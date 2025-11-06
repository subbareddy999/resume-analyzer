import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// The 'onExport' function will be passed down as a prop from the parent.
export function ExportOptions({ onExport }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Save a copy of your complete analysis report as a PDF document.
          </p>
          <Button onClick={onExport} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download Report as PDF
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
