import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FilePlus2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Import the cn utility

// Accept the isExporting prop
export function PostAnalysisActions({ onExport, onReset, isExporting }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-2"
    >
      <Card className="shadow-medium">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-center gap-4">
          <h3 className="text-lg font-semibold text-foreground text-center md:text-left">
            Analysis Complete!
          </h3>
          <div className="flex-grow"></div>
          {/* Add conditional animation and text */}
          <Button
            onClick={onExport}
            disabled={isExporting}
            className={cn(
                "w-full md:w-auto",
                isExporting && "animate-glow"
            )}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isExporting ? "Generating PDF..." : "Download Report"}
          </Button>
          <Button onClick={onReset} variant="outline" className="w-full md:w-auto">
            <FilePlus2 className="w-4 h-4 mr-2" />
            Analyze New Resume
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
