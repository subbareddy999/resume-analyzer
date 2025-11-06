import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Loader2, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";

// Converted from TSX to JSX: Removed interfaces and type annotations (e.g., : File, : React.DragEvent).
export function FileUpload({ onAnalyze, isAnalyzing }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');

    if (pdfFile) {
      setSelectedFile(pdfFile);
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  }, []);

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleAnalyze = () => {
    if (selectedFile) {
      onAnalyze(selectedFile);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="w-full max-w-2xl mx-auto h-full"
    >
      <Card className="p-8 shadow-medium h-full flex flex-col justify-between">
        <div className="space-y-6">
          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-normal
              ${isDragOver
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-border hover:border-primary/50 hover:bg-accent/30'
              }
              ${isAnalyzing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
            `}
            onClick={() => {
              if (!isAnalyzing) {
                document.getElementById('file-input')?.click();
              }
            }}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isAnalyzing}
            />

            <motion.div
              animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
            </motion.div>

            <h3 className="text-xl font-semibold text-foreground mb-2">
              Upload Your Resume
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag & drop your PDF resume here, or click to browse
            </p>
          </div>

          {/* Selected File */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between p-4 bg-accent rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>

                {!isAnalyzing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analyze Button */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isAnalyzing}
                  className="w-full py-6 text-lg font-semibold bg-gradient-primary hover:shadow-medium transition-all duration-normal"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}
