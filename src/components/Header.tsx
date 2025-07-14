import { HelpCircle, Zap, Shield, Star, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export const Header = () => {
  return (
    <header className="h-20 border-b border-border/60 bg-card/95 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
      {/* Left Section - Brand */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
            <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              InsightMatch
            </h1>
            <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
              <Shield className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            AI-Powered Resume Intelligence Platform
          </p>
        </div>
      </div>

      {/* Center Section - Status Indicators */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center space-x-2 px-3 py-2 bg-success-light/20 rounded-full border border-success/20">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-success">AI Engine Active</span>
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Star className="h-4 w-4 text-warning fill-warning" />
          <span className="text-sm font-medium">Premium Analysis</span>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-sm p-4 bg-card border shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-sm">How InsightMatch Works</span>
                </div>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Upload your resume in PDF, DOCX, or TXT format</li>
                  <li>• Paste the complete job description</li>
                  <li>• Get AI-powered match scoring and analysis</li>
                  <li>• Receive actionable feedback and suggestions</li>
                  <li>• Download detailed improvement report</li>
                </ul>
                <div className="flex items-center space-x-2 pt-2 border-t border-border">
                  <Shield className="h-3 w-3 text-success" />
                  <span className="text-xs text-success font-medium">Enterprise-grade security</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => console.log("Settings clicked")}
          className="text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <div 
          className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-full hover:bg-muted/80 transition-all duration-200 cursor-pointer"
          onClick={() => console.log("User profile clicked")}
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-foreground">Demo User</p>
            <p className="text-xs text-muted-foreground">Free Trial</p>
          </div>
        </div>
      </div>
    </header>
  );
};