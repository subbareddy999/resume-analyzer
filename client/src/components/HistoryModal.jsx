import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, FileText, Trash2, X, Info } from "lucide-react"; // Import the Info icon

export function HistoryModal({ isOpen, onClose, onSelectItem, historyItems, onDeleteItem, onClearHistory }) {
  const handleSelectItem = (item) => {
    onSelectItem(item.analysis);
    onClose();
  };

  const handleDeleteClick = (e, itemId) => {
    e.stopPropagation();
    onDeleteItem(itemId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Analysis History
          </DialogTitle>
          <DialogDescription>
            Select a previous analysis to view its details.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto pr-2">
          <AnimatePresence>
            {!historyItems || historyItems.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No previous analyses found</p>
                <p className="text-sm text-muted-foreground mt-2">Analyze a resume to start your history.</p>
              </motion.div>
            ) : (
              <div className="space-y-2">
                {historyItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-2 w-full rounded-lg hover:bg-accent/50 transition-colors group"
                  >
                    <button
                      onClick={() => handleSelectItem(item)}
                      className="flex-grow p-3 text-left flex items-center gap-3"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <div className="text-sm text-muted-foreground font-semibold">
                        Score: {item.analysis.aiFeedback.rating}/10
                      </div>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 mr-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => handleDeleteClick(e, item.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {historyItems && historyItems.length > 0 && (
           <DialogFooter className="pt-4 border-t flex items-center justify-between">
            {/* --- NEW: Informational Text --- */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>History is saved securely in your browser and not stored online.</span>
            </div>
            <Button variant="destructive" onClick={onClearHistory}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
           </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
