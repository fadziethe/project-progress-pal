import { motion } from "framer-motion";
import { Task, STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS } from "@/types/task";
import { Calendar, ChevronRight } from "lucide-react";

interface ListViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export function ListView({ tasks, onEditTask }: ListViewProps) {
  return (
    <div className="p-6 space-y-2">
      {tasks.map((task, i) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03 }}
          onClick={() => onEditTask(task)}
          className="glass rounded-xl p-4 cursor-pointer hover:border-primary/30 transition-all flex items-center gap-4"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{task.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
          </div>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium shrink-0 ${STATUS_COLORS[task.status]}`}>
            {STATUS_LABELS[task.status]}
          </span>
          <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium shrink-0 ${PRIORITY_COLORS[task.priority]}`}>
            {task.priority}
          </span>
          <div className="w-24 shrink-0">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-primary" style={{ width: `${task.progress}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Calendar className="w-3 h-3" />
            {task.dueDate}
          </div>
          {task.assignee && (
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary shrink-0">
              {task.assignee[0]}
            </div>
          )}
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </motion.div>
      ))}
    </div>
  );
}
