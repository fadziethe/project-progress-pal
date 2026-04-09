import { useState } from "react";
import { Task } from "@/types/task";
import { useTaskStore } from "@/hooks/useTaskStore";
import { SidebarNav } from "@/components/SidebarNav";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KanbanView } from "@/components/KanbanView";
import { ListView } from "@/components/ListView";
import { GanttView } from "@/components/GanttView";
import { TableView } from "@/components/TableView";
import { TaskDialog } from "@/components/TaskDialog";
import { ProjectDialog } from "@/components/ProjectDialog";

const Index = () => {
  const store = useTaskStore();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

  const openNewTask = () => { setEditingTask(null); setTaskDialogOpen(true); };
  const openEditTask = (task: Task) => { setEditingTask(task); setTaskDialogOpen(true); };

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav
        viewMode={store.viewMode}
        setViewMode={store.setViewMode}
        onAddTask={openNewTask}
        onAddProject={() => setProjectDialogOpen(true)}
        projects={store.projects}
        activeProjectId={store.activeProjectId}
        setActiveProjectId={store.setActiveProjectId}
        onDeleteProject={store.deleteProject}
        stats={store.stats}
        stageProgress={store.stageProgress}
        activeStageFilter={store.activeStageFilter}
        setActiveStageFilter={store.setActiveStageFilter}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          searchQuery={store.searchQuery}
          setSearchQuery={store.setSearchQuery}
          stats={store.stats}
          activeProject={store.activeProject}
          activeStageFilter={store.activeStageFilter}
        />
        <div className="flex-1 overflow-auto">
          {store.activeProject ? (
            <>
              {store.viewMode === "kanban" && <KanbanView tasks={store.tasks} onMoveTask={store.moveTask} onEditTask={openEditTask} />}
              {store.viewMode === "list" && <ListView tasks={store.tasks} onEditTask={openEditTask} />}
              {store.viewMode === "gantt" && <GanttView tasks={store.tasks} onEditTask={openEditTask} />}
              {store.viewMode === "table" && <TableView tasks={store.tasks} onEditTask={openEditTask} />}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <p className="text-4xl">📁</p>
                <h3 className="font-heading font-bold text-foreground">No project selected</h3>
                <p className="text-sm text-muted-foreground">Create a new project to start tracking tasks</p>
                <button
                  onClick={() => setProjectDialogOpen(true)}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity glow-primary"
                >
                  Create Project
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <TaskDialog
        open={taskDialogOpen}
        onClose={() => setTaskDialogOpen(false)}
        task={editingTask}
        project={store.activeProject}
        onSave={store.addTask}
        onUpdate={store.updateTask}
        onDelete={store.deleteTask}
      />
      <ProjectDialog
        open={projectDialogOpen}
        onClose={() => setProjectDialogOpen(false)}
        onSave={store.addProject}
      />
    </div>
  );
};

export default Index;
