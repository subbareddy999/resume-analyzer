import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/Header";
import { FileUpload } from "@/components/FileUpload";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { HistoryModal } from "@/components/HistoryModal";
import { JobMatchAnalyzer } from "@/components/JobMatchAnalyzer";
import { PostAnalysisActions } from "@/components/PostAnalysisActions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { AlertTriangle, X } from "lucide-react"; // Import Icons
import axios from "axios";
import toast from 'react-hot-toast';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Index() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyItems, setHistoryItems] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [openAccordionItems, setOpenAccordionItems] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // State for the storage notice alert
  const [showStorageNotice, setShowStorageNotice] = useState(false);

  useEffect(() => {
    // Load history from localStorage
    const storedHistory = JSON.parse(localStorage.getItem('resumeAnalyses')) || [];
    setHistoryItems(storedHistory);

    // Check if the storage notice has been dismissed before
    const noticeDismissed = localStorage.getItem('storageNoticeDismissed');
    if (!noticeDismissed) {
      setShowStorageNotice(true);
    }
  }, []);

  // Function to dismiss the notice permanently
  const handleDismissNotice = () => {
    setShowStorageNotice(false);
    localStorage.setItem('storageNoticeDismissed', 'true');
  };

  const handleAnalyze = async (file) => {
    setIsAnalyzing(true);
    setAnalysis(null);
    toast.loading(`Analyzing ${file.name}...`);

    const formData = new FormData();
    formData.append('resume', file);
    if (jobDescription) {
      formData.append('jobDescription', jobDescription);
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newAnalysis = response.data;
      setAnalysis(newAnalysis);
      toast.dismiss();
      toast.success('Analysis Complete!');

      const newEntry = {
        id: new Date().toISOString(),
        name: newAnalysis.personalDetails.name || 'Untitled Analysis',
        date: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), // Using Indian locale
        analysis: newAnalysis,
      };

      setHistoryItems(prevHistory => {
        const updatedHistory = [newEntry, ...prevHistory];
        localStorage.setItem('resumeAnalyses', JSON.stringify(updatedHistory));
        return updatedHistory;
      });

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
      toast.dismiss();
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistoryItem = (historyAnalysis) => {
    setAnalysis(historyAnalysis);
    setShowHistory(false);
  };

  const handleReset = () => {
    setAnalysis(null);
    setJobDescription("");
  };

  const handleDeleteHistoryItem = (idToDelete) => {
    const updatedHistory = historyItems.filter(item => item.id !== idToDelete);
    setHistoryItems(updatedHistory);
    localStorage.setItem('resumeAnalyses', JSON.stringify(updatedHistory));
    toast.success("History item deleted.");
  };

  const handleClearHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem('resumeAnalyses');
    toast.success("History cleared.");
    setShowHistory(false);
  };

  const handleExportPDF = () => {
    setOpenAccordionItems(['experience', 'education', 'projects']);
    setIsExporting(true);
  };

  useEffect(() => {
    if (isExporting && analysis) {
      const reportElement = document.getElementById('analysis-report');
      if (!reportElement) { setIsExporting(false); return; }

      toast.loading('Generating PDF...');
      reportElement.classList.add('pdf-export-active');

      html2canvas(reportElement, { scale: 2, useCORS: true, backgroundColor: null, scrollY: -window.scrollY, windowWidth: reportElement.scrollWidth, windowHeight: reportElement.scrollHeight })
      .then(canvas => {
          const imgData = canvas.toDataURL('image/png', 1.0);
          const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [canvas.width, canvas.height], compress: true });
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save(`resume-analysis-${analysis.personalDetails.name || 'report'}.pdf`);
          toast.dismiss();
          toast.success('PDF generated successfully!');
      }).catch(err => {
          toast.dismiss();
          toast.error('Could not generate PDF.');
          console.error("Error generating PDF:", err);
      }).finally(() => {
          reportElement.classList.remove('pdf-export-active');
          setOpenAccordionItems([]);
          setIsExporting(false);
      });
    }
  }, [isExporting, analysis]);

  return (
    <div className="min-h-screen bg-background">
      <Header onViewHistory={() => setShowHistory(true)} />

      <main className="container mx-auto px-6 py-12 space-y-8">
        <AnimatePresence>
          {showStorageNotice && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            >
                <Alert variant="warning" className="relative border-yellow-400/50 text-yellow-900 bg-yellow-50/80">
                    <AlertTitle className="font-semibold pb-2 ml-2">💡 Quick note: </AlertTitle>
                    <AlertDescription className="pl-4 text-wrap">
                    I don’t store your data. Your resume analyses live safely in your browser, not on my servers.
This way, you stay in control — and the tool stays free.
                    </AlertDescription>
                    <button onClick={handleDismissNotice} className="absolute top-2 right-2 p-1 rounded-full text-yellow-700 hover:bg-yellow-200/50">
                        <X className="h-4 w-4" />
                    </button>
                </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.section
            key={analysis ? 'actions' : 'upload'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            {analysis ? (
              <PostAnalysisActions onExport={handleExportPDF} onReset={handleReset} isExporting={isExporting} />
            ) : (
              <>
                <JobMatchAnalyzer
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                />
                <FileUpload onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
              </>
            )}
          </motion.section>
        </AnimatePresence>

        <AnimatePresence>
          {analysis && !isAnalyzing && (
            <motion.div>
              <ResultsDisplay
                analysis={analysis}
                openAccordionItems={openAccordionItems}
                setOpenAccordionItems={setOpenAccordionItems}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <HistoryModal
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectItem={handleSelectHistoryItem}
        historyItems={historyItems}
        onDeleteItem={handleDeleteHistoryItem}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};

export default Index;
