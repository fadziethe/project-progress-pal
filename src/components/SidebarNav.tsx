import { motion } from "framer-motion";
import { LayoutDashboard, KanbanSquare, List, GanttChart, Table, Plus } from "lucide-react";
import { ViewMode } from "@/types/task";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAddTask: () => void;
  stats: { total: number; done: number; completion: number };
}

const views: { mode: ViewMode; label: string; icon: React.ElementType }[] = [
  { mode: "kanban", label: "Kanban Board", icon: KanbanSquare },
  { mode: "list", label: "List View", icon: List },
  { mode: "gantt", label: "Gantt Chart", icon: GanttChart },
  { mode: "table", label: "Table View", icon: Table },
];

export function SidebarNav({ viewMode, setViewMode, onAddTask, stats }: SidebarNavProps) {
  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center glow-primary">
            <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-foreground text-sm">TaskFlow</h1>
            <p className="text-xs text-muted-foreground">Project Tracker</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 px-3">Views</p>
        {views.map(({ mode, label, icon: Icon }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
              viewMode === mode
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
            {viewMode === mode && (
              <motion.div layoutId="activeView" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Project Progress</span>
            <span className="text-foreground font-medium">{stats.completion}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${stats.completion}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">{stats.done}/{stats.total} tasks completed</p>
        </div>

        <button
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity glow-primary"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>
    </aside>
  );
}
