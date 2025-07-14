import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ResumeUpload } from "@/components/ResumeUpload";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { AnalysisResults } from "@/components/AnalysisResults";

type Step = 'upload' | 'description' | 'analysis' | 'results';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleStepChange = (step: Step) => {
    setCurrentStep(step);
  };

  const handleFileUpload = (file: File | null) => {
    setResumeFile(file);
    if (file && jobDescription && currentStep === 'upload') {
      setCurrentStep('analysis');
    }
  };

  const handleJobDescriptionChange = (description: string) => {
    setJobDescription(description);
    if (resumeFile && description && currentStep === 'description') {
      setCurrentStep('analysis');
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <ResumeUpload 
            onFileUpload={handleFileUpload}
            uploadedFile={resumeFile}
          />
        );
      case 'description':
        return (
          <JobDescriptionInput 
            jobDescription={jobDescription}
            onJobDescriptionChange={handleJobDescriptionChange}
          />
        );
      case 'analysis':
        if (resumeFile && jobDescription) {
          // Simulate analysis loading
          setTimeout(() => setAnalysisComplete(true), 1500);
          return (
            <AnalysisResults 
              resumeFile={resumeFile}
              jobDescription={jobDescription}
            />
          );
        }
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-2">Ready to Analyze</h2>
            <p className="text-muted-foreground">
              Please upload your resume and add a job description to start the analysis.
            </p>
          </div>
        );
      case 'results':
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-2">Download Report</h2>
            <p className="text-muted-foreground">
              Your detailed analysis report will be available here.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar 
          currentStep={currentStep}
          onStepChange={handleStepChange}
          hasResume={!!resumeFile}
          hasJobDescription={!!jobDescription}
          analysisComplete={analysisComplete}
        />
        <main className="flex-1 p-8 max-w-4xl mx-auto">
          <div className="animate-fade-in">
            {renderCurrentStep()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
