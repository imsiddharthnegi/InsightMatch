import { useState } from "react";
import { FileText, ClipboardCopy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface JobDescriptionInputProps {
  jobDescription: string;
  onJobDescriptionChange: (description: string) => void;
}

export const JobDescriptionInput = ({ jobDescription, onJobDescriptionChange }: JobDescriptionInputProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const wordCount = jobDescription.trim().split(/\s+/).filter(word => word.length > 0).length;
  const minWords = 50;
  const isValidLength = wordCount >= minWords;

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        onJobDescriptionChange(text.trim());
        toast.success("Job description pasted successfully!");
      } else {
        toast.error("Clipboard is empty");
      }
    } catch (error) {
      toast.error("Unable to paste from clipboard. Please paste manually.");
    }
  };

  const clearDescription = () => {
    onJobDescriptionChange("");
    toast.success("Job description cleared");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Job Description</h2>
        <p className="text-muted-foreground">
          Paste the complete job description to analyze how well your resume matches the requirements.
        </p>
      </div>

      <Card className={jobDescription ? "border-success bg-success-light/10" : ""}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Job Posting Details</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              {jobDescription && (
                <Badge variant={isValidLength ? "default" : "secondary"}>
                  {wordCount} words
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handlePaste}
                className="flex items-center space-x-1"
              >
                <ClipboardCopy className="h-4 w-4" />
                <span>Paste</span>
              </Button>
              {jobDescription && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearDescription}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="job-description" className="text-sm font-medium">
              Complete Job Description *
            </Label>
            <Textarea
              id="job-description"
              placeholder="Paste the complete job description here, including responsibilities, requirements, qualifications, and company information..."
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              className={`mt-2 min-h-[200px] transition-all duration-200 ${
                isExpanded ? 'min-h-[400px]' : ''
              } ${!isValidLength && jobDescription ? 'border-warning' : ''}`}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => setIsExpanded(false)}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className={`transition-colors ${
                wordCount === 0 
                  ? 'text-muted-foreground'
                  : isValidLength 
                  ? 'text-success' 
                  : 'text-warning'
              }`}>
                {wordCount} / {minWords} words minimum
              </span>
              {!isValidLength && jobDescription && (
                <span className="text-warning text-xs">
                  Add more details for better analysis
                </span>
              )}
            </div>
            
            {jobDescription && (
              <Badge variant={isValidLength ? "default" : "secondary"}>
                {isValidLength ? "Ready for analysis" : "Needs more detail"}
              </Badge>
            )}
          </div>

          {jobDescription && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-medium text-foreground mb-2">Preview</h4>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {jobDescription.substring(0, 200)}...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium text-sm text-foreground mb-2">💡 Tips for Better Results</h3>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Include the complete job posting with all requirements</li>
          <li>• Don't remove company information or contact details</li>
          <li>• Make sure all technical skills and qualifications are included</li>
          <li>• Include preferred qualifications and nice-to-haves</li>
        </ul>
      </div>
    </div>
  );
};