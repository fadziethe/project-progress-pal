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

const Index = () => {
  const store = useTaskStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openNew = () => { setEditingTask(null); setDialogOpen(true); };
  const openEdit = (task: Task) => { setEditingTask(task); setDialogOpen(true); };

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarNav viewMode={store.viewMode} setViewMode={store.setViewMode} onAddTask={openNew} stats={store.stats} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader searchQuery={store.searchQuery} setSearchQuery={store.setSearchQuery} stats={store.stats} />
        <div className="flex-1 overflow-auto">
          {store.viewMode === "kanban" && <KanbanView tasks={store.tasks} onMoveTask={store.moveTask} onEditTask={openEdit} />}
          {store.viewMode === "list" && <ListView tasks={store.tasks} onEditTask={openEdit} />}
          {store.viewMode === "gantt" && <GanttView tasks={store.tasks} onEditTask={openEdit} />}
          {store.viewMode === "table" && <TableView tasks={store.tasks} onEditTask={openEdit} />}
        </div>
      </main>
      <TaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        task={editingTask}
        onSave={store.addTask}
        onUpdate={store.updateTask}
        onDelete={store.deleteTask}
      />
    </div>
  );
};

export default Index;
