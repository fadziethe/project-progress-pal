import { motion } from "framer-motion";
import { Task, TaskStatus, STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS } from "@/types/task";
import { GripVertical, Calendar } from "lucide-react";

interface KanbanViewProps {
  tasks: Task[];
  onMoveTask: (id: string, status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
}

const columns: TaskStatus[] = ["backlog", "todo", "in_progress", "review", "done"];

export function KanbanView({ tasks, onMoveTask, onEditTask }: KanbanViewProps) {
  return (
    <div className="flex gap-4 p-6 overflow-x-auto h-full">
      {columns.map(status => {
        const colTasks = tasks.filter(t => t.status === status);
        return (
          <div
            key={status}
            className="flex-shrink-0 w-72 flex flex-col"
            onDragOver={e => e.preventDefault()}
            onDrop={e => {
              const id = e.dataTransfer.getData("taskId");
              if (id) onMoveTask(id, status);
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[status]}`} />
              <h3 className="font-heading text-sm font-semibold text-foreground">{STATUS_LABELS[status]}</h3>
              <span className="text-xs text-muted-foreground ml-auto bg-muted px-2 py-0.5 rounded-full">{colTasks.length}</span>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {colTasks.map((task, i) => (
              <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  draggable
                  onDragStart={e => (e as unknown as React.DragEvent).dataTransfer?.setData("taskId", task.id)}
                  onClick={() => onEditTask(task)}
                  className="glass rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
                          {task.priority}
                        </span>
                        {task.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {task.progress > 0 && task.progress < 100 && (
                        <div className="mt-3">
                          <div className="h-1 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${task.progress}%` }} />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {task.dueDate}
                        </div>
                        {task.assignee && (
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-medium text-primary">
                            {task.assignee[0]}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
