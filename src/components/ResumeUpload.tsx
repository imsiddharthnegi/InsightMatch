import { useState, useCallback } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface ResumeUploadProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
}

export const ResumeUpload = ({ onFileUpload, uploadedFile }: ResumeUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = useCallback((file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF, DOCX, DOC, or TXT file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File size must be less than 10MB");
      return;
    }

    onFileUpload(file);
    toast.success("Resume uploaded successfully!");
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
    // Reset input value to allow re-selecting the same file
    e.target.value = '';
  }, [handleFileUpload]);

  const removeFile = () => {
    onFileUpload(null as any);
    toast.success("Resume removed");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Upload Your Resume</h2>
        <p className="text-muted-foreground">
          Upload your resume in PDF, DOCX, DOC, or TXT format to get started with the analysis.
        </p>
      </div>

      {uploadedFile ? (
        <Card className="border-success bg-success-light/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{uploadedFile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • {uploadedFile.type.split('/')[1].toUpperCase()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className={`border-2 border-dashed transition-all duration-200 ${
            isDragOver 
              ? 'border-primary bg-primary/5 scale-[1.02]' 
              : 'border-border hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className={`w-16 h-16 rounded-full transition-all duration-200 flex items-center justify-center ${
                isDragOver ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Upload className="h-8 w-8" />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {isDragOver ? 'Drop your resume here' : 'Upload your resume'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop or click to select your file
                </p>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <input
                  type="file"
                  id="resume-upload"
                  className="hidden"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileSelect}
                />
                <label htmlFor="resume-upload">
                  <Button className="gradient-primary shadow-glow">
                    <FileText className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                </label>
                
                <p className="text-xs text-muted-foreground">
                  Supports PDF, DOCX, DOC, TXT files up to 10MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};