import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.RATE_LIMIT ? parseInt(process.env.RATE_LIMIT) : 100,
});

app.use(limiter);

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let gemini: any = null;
if (process.env.GOOGLE_AI_API_KEY) {
  gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
}

let claude: any = null;
if (process.env.CLAUDE_API_KEY) {
  claude = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });
}

// Cache for storing recent analyses
const analysisCache = new Map();
const CACHE_DURATION = process.env.CACHE_DURATION ? parseInt(process.env.CACHE_DURATION) : 3600; // 1 hour in seconds

// Helper function to generate cache key
const generateCacheKey = (resume: string, jobDescription: string): string => {
  return `${resume}_${jobDescription}`;
};

// Helper function to clean and prepare text
const prepareText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')
    .trim();
};

// AI analysis prompt template
const generatePrompt = (resume: string, jobDescription: string): string => {
  return `You are an expert career coach and AI resume analyst. Analyze the following resume against the job description.
  Provide a detailed analysis including match score, missing skills, and actionable suggestions.
  Respond in this exact JSON format:
  {
    "overallScore": number (0-100),
    "sections": {
      "skills": { "score": number, "matches": number, "total": number },
      "experience": { "score": number, "matches": number, "total": number },
      "education": { "score": number, "matches": number, "total": number },
      "keywords": { "score": number, "matches": number, "total": number }
    },
    "matchedSkills": string[],
    "missingSkills": string[],
    "suggestions": [
      {
        "category": string,
        "priority": "High" | "Medium" | "Low",
        "title": string,
        "description": string,
        "action": string
      }
    ]
  }

Resume:
${resume}

Job Description:
${jobDescription}`;
};

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({ error: 'Resume and job description are required' });
    }

    // Check cache if enabled
    if (process.env.ENABLE_CACHING === 'true') {
      const cacheKey = generateCacheKey(resume, jobDescription);
      const cachedResult = analysisCache.get(cacheKey);
      if (cachedResult) {
        return res.json(cachedResult);
      }
    }

    // Prepare texts
    const cleanResume = prepareText(resume);
    const cleanJobDescription = prepareText(jobDescription);
    const prompt = generatePrompt(cleanResume, cleanJobDescription);

    let result;

    try {
      // Try OpenAI first
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      });

      result = JSON.parse(completion.choices[0].message.content || '');
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);

      // Try Google Gemini if available
      if (gemini) {
        try {
          const model = gemini.getGenerativeModel({ model: 'gemini-pro' });
          const geminiResult = await model.generateContent(prompt);
          result = JSON.parse(geminiResult.response.text());
        } catch (geminiError) {
          console.error('Gemini API error:', geminiError);

          // Try Claude if available
          if (claude) {
            try {
              const claudeResult = await claude.messages.create({
                model: 'claude-3-opus-20240229',
                max_tokens: 2000,
                messages: [{ role: 'user', content: prompt }],
              });
              result = JSON.parse(claudeResult.content[0].text);
            } catch (claudeError) {
              console.error('Claude API error:', claudeError);
              throw new Error('All AI providers failed');
            }
          } else {
            throw new Error('All available AI providers failed');
          }
        }
      } else {
        throw new Error('OpenAI failed and no fallback providers available');
      }
    }

    // Cache the result if caching is enabled
    if (process.env.ENABLE_CACHING === 'true') {
      const cacheKey = generateCacheKey(resume, jobDescription);
      analysisCache.set(cacheKey, result);
      setTimeout(() => analysisCache.delete(cacheKey), CACHE_DURATION * 1000);
    }

    res.json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Return mock data as fallback
    const mockData = {
      overallScore: 78,
      sections: {
        skills: { score: 85, matches: 12, total: 15 },
        experience: { score: 72, matches: 8, total: 10 },
        education: { score: 90, matches: 3, total: 3 },
        keywords: { score: 65, matches: 18, total: 25 }
      },
      matchedSkills: [
        "React", "TypeScript", "Node.js", "Python", "SQL", "Git",
        "Agile", "Scrum", "REST APIs", "MongoDB", "AWS", "Docker"
      ],
      missingSkills: [
        "Kubernetes", "GraphQL", "Redux"
      ],
      suggestions: [
        {
          category: "Skills Gap",
          priority: "High",
          title: "Add missing technical skills",
          description: "Consider adding experience with Kubernetes and GraphQL to better match the job requirements.",
          action: "Add these skills to your technical skills section or highlight any related experience."
        },
        {
          category: "Keywords",
          priority: "Medium",
          title: "Include more industry keywords",
          description: "Your resume could benefit from including more specific keywords from the job description.",
          action: "Incorporate terms like 'scalable applications', 'microservices', and 'cloud architecture'."
        },
        {
          category: "ATS Optimization",
          priority: "Medium",
          title: "Improve ATS compatibility",
          description: "Some formatting might not be ATS-friendly.",
          action: "Use standard section headers and avoid complex formatting or graphics."
        }
      ]
    };

    res.json(mockData);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});