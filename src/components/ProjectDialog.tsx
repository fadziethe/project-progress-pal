import { useState } from "react";
import { SDLC_STAGES, PROJECT_COLORS, ProjectType } from "@/types/task";
import { X, Check, Code2, ClipboardList } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; type: ProjectType; stages: string[]; color: string }) => void;
}

export function ProjectDialog({ open, onClose, onSave }: ProjectDialogProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);

  const toggleStage = (id: string) => {
    setSelectedStages(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedStages(SDLC_STAGES.map(s => s.id));
  const selectNone = () => setSelectedStages([]);

  const handleClose = () => {
    setStep(1);
    setProjectType(null);
    setName("");
    setDescription("");
    setSelectedStages([]);
    setColor(PROJECT_COLORS[0]);
    onClose();
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    if (projectType === "software" && selectedStages.length === 0) return;
    onSave({ name, description, type: projectType!, stages: selectedStages, color });
    handleClose();
  };

  const handleTypeSelect = (type: ProjectType) => {
    setProjectType(type);
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!name.trim()) return;
    if (projectType === "software") {
      setStep(3);
    } else {
      handleSubmit();
    }
  };

  const inputClass = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";
  const labelClass = "block text-xs font-medium text-muted-foreground mb-1.5";

  const stepTitle = step === 1 ? "What type of project?" : step === 2 ? "Project Details" : "Select SDLC Stages";
  const stepDesc = step === 1
    ? "Choose the kind of project you want to create"
    : step === 2
      ? "Give your project a name and description"
      : "Choose the stages your project needs. These define your development lifecycle.";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading font-bold text-foreground">{stepTitle}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stepDesc}</p>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Step 1: Project Type */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  onClick={() => handleTypeSelect("software")}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Code2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground block">Software Project</span>
                    <p className="text-xs text-muted-foreground mt-1">Full SDLC tracking with stages like Requirements, Design, Testing & more</p>
                  </div>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  onClick={() => handleTypeSelect("general")}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center group-hover:bg-accent/50 transition-colors">
                    <ClipboardList className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground block">General Tasks</span>
                    <p className="text-xs text-muted-foreground mt-1">Simple task management without SDLC stages — just add and track tasks</p>
                  </div>
                </motion.button>
              </div>
            )}

            {/* Step 2: Name & Details */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Project Name</label>
                  <input className={inputClass} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. E-Commerce Platform" required />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea className={`${inputClass} min-h-[80px] resize-none`} value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the project..." />
                </div>
                <div>
                  <label className={labelClass}>Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {PROJECT_COLORS.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={cn(
                          "w-8 h-8 rounded-full transition-all border-2",
                          color === c ? "border-foreground scale-110" : "border-transparent"
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setStep(1); setProjectType(null); }}
                    className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleStep2Next}
                    disabled={!name.trim()}
                    className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity glow-primary disabled:opacity-50"
                  >
                    {projectType === "software" ? "Next — Choose Stages →" : "Create Project"}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: SDLC Stages (software only) */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <button onClick={selectAll} className="text-xs text-primary hover:underline">Select All</button>
                  <span className="text-xs text-muted-foreground">·</span>
                  <button onClick={selectNone} className="text-xs text-muted-foreground hover:underline">Clear</button>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {selectedStages.length} selected
                  </span>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {SDLC_STAGES.map((stage, i) => {
                    const selected = selectedStages.includes(stage.id);
                    return (
                      <motion.button
                        key={stage.id}
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => toggleStage(stage.id)}
                        className={cn(
                          "w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left",
                          selected
                            ? "border-primary/50 bg-primary/5"
                            : "border-border hover:border-primary/20 bg-secondary/30"
                        )}
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                          selected ? "bg-primary border-primary" : "border-muted-foreground/30"
                        )}>
                          {selected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{stage.icon}</span>
                            <span className="text-sm font-medium text-foreground">{stage.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
                          Stage {stage.order}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={selectedStages.length === 0}
                    className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity glow-primary disabled:opacity-50"
                  >
                    Create Project ({selectedStages.length} stages)
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
