export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type ViewMode = "kanban" | "list" | "gantt" | "table";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  startDate: string;
  dueDate: string;
  progress: number; // 0-100
  tags: string[];
  createdAt: string;
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  backlog: "Backlog",
  todo: "To Do",
  in_progress: "In Progress",
  review: "Review",
  done: "Done",
};

export const STATUS_COLORS: Record<TaskStatus, string> = {
  backlog: "bg-muted-foreground/20",
  todo: "bg-info/20 text-info",
  in_progress: "bg-warning/20 text-warning",
  review: "bg-primary/20 text-primary",
  done: "bg-success/20 text-success",
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "bg-muted-foreground/20 text-muted-foreground",
  medium: "bg-info/20 text-info",
  high: "bg-warning/20 text-warning",
  critical: "bg-destructive/20 text-destructive",
};
