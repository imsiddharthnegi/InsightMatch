import { useState } from "react";
import { Upload, FileText, BarChart3, Download, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentStep: 'upload' | 'description' | 'analysis' | 'results';
  onStepChange: (step: 'upload' | 'description' | 'analysis' | 'results') => void;
  hasResume: boolean;
  hasJobDescription: boolean;
  analysisComplete: boolean;
}

export const Sidebar = ({ 
  currentStep, 
  onStepChange, 
  hasResume, 
  hasJobDescription, 
  analysisComplete 
}: SidebarProps) => {
  const steps = [
    {
      id: 'upload' as const,
      label: 'Upload Resume',
      icon: Upload,
      description: 'Upload your resume file',
      completed: hasResume,
      disabled: false
    },
    {
      id: 'description' as const,
      label: 'Job Description',
      icon: FileText,
      description: 'Paste the job posting',
      completed: hasJobDescription,
      disabled: false
    },
    {
      id: 'analysis' as const,
      label: 'AI Analysis',
      icon: BarChart3,
      description: 'View detailed comparison',
      completed: analysisComplete,
      disabled: !hasResume || !hasJobDescription
    },
    {
      id: 'results' as const,
      label: 'Download Report',
      icon: Download,
      description: 'Get your detailed report',
      completed: false,
      disabled: !analysisComplete
    }
  ];

  return (
    <aside className="w-80 bg-card border-r border-border p-6 flex flex-col space-y-4">
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-2">Analysis Steps</h2>
        <p className="text-sm text-muted-foreground">
          Follow these steps to analyze your resume against the job description.
        </p>
      </div>

      <div className="space-y-3 flex-1">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isClickable = !step.disabled;
          
          return (
            <Button
              key={step.id}
              onClick={() => isClickable && onStepChange(step.id)}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-4 transition-all duration-200",
                isActive && "shadow-md gradient-primary text-primary-foreground",
                !isClickable && "opacity-50 cursor-not-allowed",
                step.completed && !isActive && "bg-success-light hover:bg-success-light/80"
              )}
              disabled={!isClickable}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  isActive 
                    ? "bg-primary-foreground/20" 
                    : step.completed 
                    ? "bg-success text-success-foreground"
                    : "bg-muted"
                )}>
                  {step.completed ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className={cn(
                    "font-medium text-sm",
                    isActive ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {step.label}
                  </div>
                  <div className={cn(
                    "text-xs opacity-80",
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                  )}>
                    {step.description}
                  </div>
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-medium text-sm text-foreground mb-2">Quick Tips</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use recent resume versions</li>
          <li>• Copy complete job descriptions</li>
          <li>• Review all feedback sections</li>
        </ul>
      </div>
    </aside>
  );
};