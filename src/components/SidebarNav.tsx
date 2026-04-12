import { motion } from "framer-motion";
import { LayoutDashboard, KanbanSquare, List, GanttChart, Table, Plus, FolderPlus, Trash2 } from "lucide-react";
import { ViewMode, Project, SDLC_STAGES } from "@/types/task";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  onAddTask: () => void;
  onAddProject: () => void;
  projects: Project[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string) => void;
  onDeleteProject: (id: string) => void;
  stats: { total: number; done: number; completion: number };
  stageProgress: { stageId: string; total: number; done: number; progress: number }[];
  activeStageFilter: string | null;
  setActiveStageFilter: (stage: string | null) => void;
}

const views: { mode: ViewMode; label: string; icon: React.ElementType }[] = [
  { mode: "kanban", label: "Kanban Board", icon: KanbanSquare },
  { mode: "list", label: "List View", icon: List },
  { mode: "gantt", label: "Gantt Chart", icon: GanttChart },
  { mode: "table", label: "Table View", icon: Table },
];

export function SidebarNav({
  viewMode, setViewMode, onAddTask, onAddProject,
  projects, activeProjectId, setActiveProjectId, onDeleteProject,
  stats, stageProgress, activeStageFilter, setActiveStageFilter,
}: SidebarNavProps) {
  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <aside className="w-72 h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
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

      {/* Projects */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Projects</p>
          <button onClick={onAddProject} className="p-1 rounded hover:bg-sidebar-accent transition-colors" title="New Project">
            <FolderPlus className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {projects.map(project => (
            <button
              key={project.id}
              onClick={() => { setActiveProjectId(project.id); setActiveStageFilter(null); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all group",
                activeProjectId === project.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
              <span className="truncate flex-1 text-left">{project.name}</span>
              <span className="text-[10px] text-muted-foreground">{project.stages.length}s</span>
              <button
                onClick={e => { e.stopPropagation(); onDeleteProject(project.id); }}
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-destructive transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </button>
          ))}
          {projects.length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-4 text-center">No projects yet</p>
          )}
        </div>
      </div>

      {/* Stage Progress (for software projects only) */}
      {activeProject && activeProject.type === "software" && (
        <div className="px-4 py-2 border-t border-sidebar-border">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Stages</p>
            {activeStageFilter && (
              <button onClick={() => setActiveStageFilter(null)} className="text-[10px] text-primary hover:underline">All</button>
            )}
          </div>
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {stageProgress.map(sp => {
              const stage = SDLC_STAGES.find(s => s.id === sp.stageId);
              if (!stage) return null;
              return (
                <button
                  key={sp.stageId}
                  onClick={() => setActiveStageFilter(activeStageFilter === sp.stageId ? null : sp.stageId)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition-all",
                    activeStageFilter === sp.stageId
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/30"
                  )}
                >
                  <span>{stage.icon}</span>
                  <span className="truncate flex-1 text-left">{stage.label}</span>
                  <div className="w-12 h-1 rounded-full bg-muted overflow-hidden shrink-0">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${sp.progress}%` }} />
                  </div>
                  <span className="text-[9px] text-muted-foreground w-5 text-right">{sp.total}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Views */}
      <nav className="px-4 py-2 border-t border-sidebar-border flex-1">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 px-1">Views</p>
        {views.map(({ mode, label, icon: Icon }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={cn(
              "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs transition-all",
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

      {/* Bottom */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-foreground font-medium">{stats.completion}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${stats.completion}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">{stats.done}/{stats.total} tasks done</p>
        </div>
        <button
          onClick={onAddTask}
          disabled={!activeProjectId}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>
    </aside>
  );
}
