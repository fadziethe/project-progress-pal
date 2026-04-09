import { useMemo } from "react";
import { motion } from "framer-motion";
import { Task, STATUS_COLORS } from "@/types/task";

interface GanttViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export function GanttView({ tasks, onEditTask }: GanttViewProps) {
  const { sortedTasks, minDate, totalDays, months } = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    const dates = sorted.flatMap(t => [new Date(t.startDate), new Date(t.dueDate)]);
    const min = new Date(Math.min(...dates.map(d => d.getTime())));
    const max = new Date(Math.max(...dates.map(d => d.getTime())));
    min.setDate(min.getDate() - 2);
    max.setDate(max.getDate() + 2);
    const total = Math.ceil((max.getTime() - min.getTime()) / (1000 * 60 * 60 * 24));

    const monthsList: { label: string; startPx: number; widthPx: number }[] = [];
    const cursor = new Date(min);
    cursor.setDate(1);
    while (cursor <= max) {
      const mStart = new Date(Math.max(cursor.getTime(), min.getTime()));
      const nextMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      const mEnd = new Date(Math.min(nextMonth.getTime() - 1, max.getTime()));
      const startDay = Math.floor((mStart.getTime() - min.getTime()) / (1000 * 60 * 60 * 24));
      const endDay = Math.ceil((mEnd.getTime() - min.getTime()) / (1000 * 60 * 60 * 24));
      monthsList.push({
        label: mStart.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        startPx: (startDay / total) * 100,
        widthPx: ((endDay - startDay) / total) * 100,
      });
      cursor.setMonth(cursor.getMonth() + 1);
      cursor.setDate(1);
    }

    return { sortedTasks: sorted, minDate: min, totalDays: total, months: monthsList };
  }, [tasks]);

  const getBarStyle = (task: Task) => {
    const start = new Date(task.startDate);
    const end = new Date(task.dueDate);
    const startDay = (start.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return {
      left: `${(startDay / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    };
  };

  const todayOffset = ((new Date().getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100;

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="min-w-[800px]">
        {/* Month headers */}
        <div className="relative h-8 mb-2 border-b border-border">
          {months.map((m, i) => (
            <div
              key={i}
              className="absolute top-0 h-full flex items-center text-[10px] text-muted-foreground font-medium border-l border-border/50 px-2"
              style={{ left: `${200 + ((m.startPx / 100) * (100 - 20))}px`, width: `${(m.widthPx / 100) * (100 - 20)}%` }}
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Rows */}
        {sortedTasks.map((task, i) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center h-12 border-b border-border/30 hover:bg-secondary/30 transition-colors group"
          >
            <div
              onClick={() => onEditTask(task)}
              className="w-[200px] shrink-0 pr-4 truncate text-sm text-foreground cursor-pointer hover:text-primary transition-colors"
            >
              {task.title}
            </div>
            <div className="flex-1 relative h-full">
              <div
                className="absolute top-1/2 -translate-y-1/2 h-7 rounded-md cursor-pointer hover:opacity-90 transition-opacity flex items-center overflow-hidden"
                style={getBarStyle(task)}
                onClick={() => onEditTask(task)}
              >
                <div className={`h-full w-full rounded-md ${STATUS_COLORS[task.status]} opacity-40`} />
                <div
                  className="absolute left-0 top-0 h-full rounded-l-md bg-primary/60"
                  style={{ width: `${task.progress}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-foreground">
                  {task.progress}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Today line */}
        {todayOffset > 0 && todayOffset < 100 && (
          <div
            className="absolute top-0 bottom-0 w-px bg-destructive/50 pointer-events-none"
            style={{ left: `${200 + (todayOffset / 100) * 80}%` }}
          />
        )}
      </div>
    </div>
  );
}
