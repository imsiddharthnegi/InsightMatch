import { HelpCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">InsightMatch</h1>
          <p className="text-xs text-muted-foreground">AI-Powered Resume Analysis</p>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-sm">
            <p className="text-sm">
              Upload your resume and paste a job description to get AI-powered analysis, 
              match scoring, and actionable feedback to improve your application success rate.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </header>
  );
};