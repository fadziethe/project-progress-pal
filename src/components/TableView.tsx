import { motion } from "framer-motion";
import { Task, STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS } from "@/types/task";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface TableViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

type SortKey = "title" | "status" | "priority" | "progress" | "dueDate";

export function TableView({ tasks, onEditTask }: TableViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...tasks].sort((a, b) => {
    const dir = sortAsc ? 1 : -1;
    if (sortKey === "progress") return (a.progress - b.progress) * dir;
    return String(a[sortKey]).localeCompare(String(b[sortKey])) * dir;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const headers: { key: SortKey; label: string; width: string }[] = [
    { key: "title", label: "Task", width: "flex-1" },
    { key: "status", label: "Status", width: "w-28" },
    { key: "priority", label: "Priority", width: "w-24" },
    { key: "progress", label: "Progress", width: "w-32" },
    { key: "dueDate", label: "Due Date", width: "w-28" },
  ];

  return (
    <div className="p-6">
      <div className="glass rounded-xl overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-border bg-secondary/30">
          {headers.map(h => (
            <button
              key={h.key}
              onClick={() => toggleSort(h.key)}
              className={`${h.width} flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors`}
            >
              {h.label}
              <ArrowUpDown className="w-3 h-3" />
            </button>
          ))}
          <div className="w-20 text-xs font-medium text-muted-foreground">Assignee</div>
        </div>
        {sorted.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => onEditTask(task)}
            className="flex items-center px-4 py-3 border-b border-border/30 cursor-pointer hover:bg-secondary/20 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{task.title}</p>
            </div>
            <div className="w-28">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[task.status]}`}>
                {STATUS_LABELS[task.status]}
              </span>
            </div>
            <div className="w-24">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
                {task.priority}
              </span>
            </div>
            <div className="w-32">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${task.progress}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground w-8 text-right">{task.progress}%</span>
              </div>
            </div>
            <div className="w-28 text-xs text-muted-foreground">{task.dueDate}</div>
            <div className="w-20">
              {task.assignee ? (
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                  {task.assignee[0]}
                </div>
              ) : <span className="text-xs text-muted-foreground">—</span>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
