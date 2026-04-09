import { Task } from "@/types/task";

export const sampleTasks: Task[] = [
  {
    id: "1", title: "Set up project architecture", description: "Initialize monorepo structure with proper tooling",
    status: "done", priority: "high", assignee: "Alex", startDate: "2026-03-20", dueDate: "2026-03-25", progress: 100, tags: ["setup", "architecture"], createdAt: "2026-03-19",
  },
  {
    id: "2", title: "Design database schema", description: "Create ERD and implement migrations",
    status: "done", priority: "high", assignee: "Jordan", startDate: "2026-03-22", dueDate: "2026-03-28", progress: 100, tags: ["database", "design"], createdAt: "2026-03-20",
  },
  {
    id: "3", title: "Implement authentication", description: "OAuth2 + JWT based auth system",
    status: "review", priority: "critical", assignee: "Alex", startDate: "2026-03-28", dueDate: "2026-04-05", progress: 85, tags: ["auth", "security"], createdAt: "2026-03-25",
  },
  {
    id: "4", title: "Build REST API endpoints", description: "CRUD operations for core entities",
    status: "in_progress", priority: "high", assignee: "Sam", startDate: "2026-04-01", dueDate: "2026-04-10", progress: 60, tags: ["api", "backend"], createdAt: "2026-03-28",
  },
  {
    id: "5", title: "Create UI component library", description: "Reusable components with Storybook docs",
    status: "in_progress", priority: "medium", assignee: "Jordan", startDate: "2026-04-02", dueDate: "2026-04-12", progress: 45, tags: ["ui", "components"], createdAt: "2026-03-30",
  },
  {
    id: "6", title: "Write integration tests", description: "E2E tests for critical user flows",
    status: "todo", priority: "medium", assignee: "Sam", startDate: "2026-04-08", dueDate: "2026-04-15", progress: 0, tags: ["testing", "qa"], createdAt: "2026-04-01",
  },
  {
    id: "7", title: "Set up CI/CD pipeline", description: "GitHub Actions with automated deployments",
    status: "todo", priority: "high", assignee: "Alex", startDate: "2026-04-10", dueDate: "2026-04-14", progress: 0, tags: ["devops", "ci/cd"], createdAt: "2026-04-02",
  },
  {
    id: "8", title: "Performance optimization", description: "Lighthouse audit and optimizations",
    status: "backlog", priority: "low", assignee: undefined, startDate: "2026-04-15", dueDate: "2026-04-22", progress: 0, tags: ["performance"], createdAt: "2026-04-03",
  },
  {
    id: "9", title: "Documentation", description: "API docs, README, and developer guide",
    status: "backlog", priority: "medium", assignee: undefined, startDate: "2026-04-18", dueDate: "2026-04-25", progress: 0, tags: ["docs"], createdAt: "2026-04-05",
  },
];
