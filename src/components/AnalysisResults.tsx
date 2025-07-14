import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  ChevronDown, 
  Download,
  Lightbulb,
  TrendingUp,
  Eye
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface AnalysisResultsProps {
  resumeFile: File;
  jobDescription: string;
}

// Mock analysis data - in real app this would come from AI analysis
const mockAnalysis = {
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

export const AnalysisResults = ({ resumeFile, jobDescription }: AnalysisResultsProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [openSections, setOpenSections] = useState<string[]>(['suggestions']);

  useEffect(() => {
    // Animate score counter
    const timer = setTimeout(() => {
      let current = 0;
      const increment = mockAnalysis.overallScore / 50;
      const counter = setInterval(() => {
        current += increment;
        if (current >= mockAnalysis.overallScore) {
          setAnimatedScore(mockAnalysis.overallScore);
          clearInterval(counter);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, 30);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-destructive";
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      High: "destructive",
      Medium: "secondary",
      Low: "outline"
    } as const;
    
    return (
      <Badge variant={variants[priority as keyof typeof variants] || "outline"}>
        {priority}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Analysis Results</h2>
        <p className="text-muted-foreground">
          Here's how your resume matches against the job description.
        </p>
      </div>

      {/* Overall Score Card */}
      <Card className="border-primary/20 shadow-glow">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Overall Match Score</span>
              </h3>
              <p className="text-muted-foreground">
                Based on skills, experience, and keyword analysis
              </p>
            </div>
            
            <div className="text-right">
              <div className={`text-5xl font-bold ${getScoreColor(animatedScore)} transition-all duration-500`}>
                {animatedScore}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">Match Rate</p>
            </div>
          </div>
          
          <div className="mt-6">
            <Progress 
              value={animatedScore} 
              className="h-3 transition-all duration-1000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Section Scores */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(mockAnalysis.sections).map(([key, data]) => (
          <Card key={key}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium capitalize text-foreground">{key}</h4>
                <span className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                  {data.score}%
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={data.score} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {data.matches} of {data.total} requirements met
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skills Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <span>Skills Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span>Matched Skills ({mockAnalysis.matchedSkills.length})</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {mockAnalysis.matchedSkills.map((skill) => (
                <Badge key={skill} variant="default" className="bg-success hover:bg-success/80">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span>Missing Skills ({mockAnalysis.missingSkills.length})</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {mockAnalysis.missingSkills.map((skill) => (
                <Badge key={skill} variant="outline" className="border-warning text-warning">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span>Improvement Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockAnalysis.suggestions.map((suggestion, index) => (
            <Collapsible
              key={index}
              open={openSections.includes(`suggestion-${index}`)}
              onOpenChange={() => toggleSection(`suggestion-${index}`)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto border border-border hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3 text-left">
                    <TrendingUp className="h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                      <div className="font-medium text-foreground">{suggestion.title}</div>
                      <div className="text-sm text-muted-foreground">{suggestion.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityBadge(suggestion.priority)}
                    <ChevronDown className={`h-4 w-4 transition-transform ${
                      openSections.includes(`suggestion-${index}`) ? 'rotate-180' : ''
                    }`} />
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-3 mt-3">
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <h5 className="font-medium text-sm text-foreground mb-1">Recommended Action:</h5>
                    <p className="text-sm text-primary">
                      {suggestion.action}
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button 
          className="gradient-primary shadow-glow flex-1"
          onClick={() => console.log("Download report clicked")}
        >
          <Download className="h-4 w-4 mr-2" />
          Download Detailed Report
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => console.log("View comparison clicked")}
        >
          <Eye className="h-4 w-4 mr-2" />
          View Side-by-Side Comparison
        </Button>
      </div>
    </div>
  );
};