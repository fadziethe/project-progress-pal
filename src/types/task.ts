export type TaskStatus = "backlog" | "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type ViewMode = "kanban" | "list" | "gantt" | "table";

export interface Task {
  id: string;
  projectId: string;
  stage: string; // SDLC stage this task belongs to
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  startDate: string;
  dueDate: string;
  progress: number;
  tags: string[];
  createdAt: string;
}

export interface SDLCStage {
  id: string;
  label: string;
  description: string;
  icon: string;
  order: number;
}

export type ProjectType = "software" | "general";

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  stages: string[]; // selected stage IDs (software projects only)
  createdAt: string;
  color: string;
}

export const SDLC_STAGES: SDLCStage[] = [
  { id: "requirements", label: "Requirements Gathering", description: "Define what the system should do — user stories, functional & non-functional requirements", icon: "📋", order: 1 },
  { id: "feasibility", label: "Feasibility Study", description: "Assess technical, economic, and operational viability", icon: "🔍", order: 2 },
  { id: "system_design", label: "System Design", description: "Architecture, database schema, API design, UI/UX wireframes", icon: "📐", order: 3 },
  { id: "prototyping", label: "Prototyping", description: "Build interactive mockups or proof-of-concept demos", icon: "🧪", order: 4 },
  { id: "development", label: "Development", description: "Write code, build features, integrate components", icon: "💻", order: 5 },
  { id: "testing", label: "Testing & QA", description: "Unit tests, integration tests, UAT, performance testing", icon: "🧹", order: 6 },
  { id: "deployment", label: "Deployment", description: "Release to staging/production, CI/CD pipeline setup", icon: "🚀", order: 7 },
  { id: "documentation", label: "Documentation", description: "API docs, user guides, technical documentation", icon: "📖", order: 8 },
  { id: "training", label: "Training & Handover", description: "User training, knowledge transfer, onboarding", icon: "🎓", order: 9 },
  { id: "maintenance", label: "Maintenance & Support", description: "Bug fixes, updates, monitoring, and ongoing support", icon: "🔧", order: 10 },
  { id: "review", label: "Review & Retrospective", description: "Post-mortem, lessons learned, process improvements", icon: "🔄", order: 11 },
];

export const PROJECT_COLORS = [
  "hsl(239, 84%, 67%)",  // indigo
  "hsl(142, 71%, 45%)",  // green
  "hsl(38, 92%, 50%)",   // amber
  "hsl(199, 89%, 48%)",  // cyan
  "hsl(0, 72%, 51%)",    // red
  "hsl(280, 67%, 51%)",  // purple
  "hsl(330, 81%, 60%)",  // pink
  "hsl(172, 66%, 50%)",  // teal
];

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
