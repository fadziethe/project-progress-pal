import { useState } from "react";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  onSave: (data: Omit<Task, "id" | "createdAt">) => void;
  onUpdate: (id: string, data: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const statuses: TaskStatus[] = ["backlog", "todo", "in_progress", "review", "done"];
const priorities: TaskPriority[] = ["low", "medium", "high", "critical"];

export function TaskDialog({ open, onClose, task, onSave, onUpdate, onDelete }: TaskDialogProps) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || ("todo" as TaskStatus),
    priority: task?.priority || ("medium" as TaskPriority),
    assignee: task?.assignee || "",
    startDate: task?.startDate || new Date().toISOString().split("T")[0],
    dueDate: task?.dueDate || "",
    progress: task?.progress || 0,
    tags: task?.tags?.join(", ") || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
    };
    if (task) {
      onUpdate(task.id, data);
    } else {
      onSave(data);
    }
    onClose();
  };

  const inputClass = "w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";
  const labelClass = "block text-xs font-medium text-muted-foreground mb-1.5";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold text-foreground">{task ? "Edit Task" : "New Task"}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Title</label>
                <input className={inputClass} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required placeholder="Task title" />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea className={`${inputClass} min-h-[80px] resize-none`} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the task..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Status</label>
                  <select className={inputClass} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}>
                    {statuses.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <select className={inputClass} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}>
                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Start Date</label>
                  <input type="date" className={inputClass} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                </div>
                <div>
                  <label className={labelClass}>Due Date</label>
                  <input type="date" className={inputClass} value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Assignee</label>
                  <input className={inputClass} value={form.assignee} onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))} placeholder="Name" />
                </div>
                <div>
                  <label className={labelClass}>Progress ({form.progress}%)</label>
                  <input type="range" min="0" max="100" className="w-full accent-primary" value={form.progress} onChange={e => setForm(f => ({ ...f, progress: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Tags (comma separated)</label>
                <input className={inputClass} value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="e.g. frontend, api, bugfix" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity glow-primary">
                  {task ? "Update Task" : "Create Task"}
                </button>
                {task && (
                  <button
                    type="button"
                    onClick={() => { onDelete(task.id); onClose(); }}
                    className="px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
