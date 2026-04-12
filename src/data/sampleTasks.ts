import { Task, Project } from "@/types/task";

export const sampleProjects: Project[] = [
  {
    id: "proj-1",
    name: "E-Commerce Platform",
    description: "Full-stack e-commerce application with payments",
    type: "software",
    stages: ["requirements", "system_design", "development", "testing", "deployment", "maintenance"],
    createdAt: "2026-03-15",
    color: "hsl(239, 84%, 67%)",
  },
  {
    id: "proj-2",
    name: "Mobile Banking App",
    description: "Cross-platform banking app with biometric auth",
    type: "software",
    stages: ["requirements", "feasibility", "system_design", "prototyping", "development", "testing", "deployment", "documentation"],
    createdAt: "2026-03-20",
    color: "hsl(142, 71%, 45%)",
  },
];

export const sampleTasks: Task[] = [
  {
    id: "1", projectId: "proj-1", stage: "system_design", title: "Set up project architecture", description: "Initialize monorepo structure with proper tooling",
    status: "done", priority: "high", assignee: "Alex", startDate: "2026-03-20", dueDate: "2026-03-25", progress: 100, tags: ["setup", "architecture"], createdAt: "2026-03-19",
  },
  {
    id: "2", projectId: "proj-1", stage: "system_design", title: "Design database schema", description: "Create ERD and implement migrations",
    status: "done", priority: "high", assignee: "Jordan", startDate: "2026-03-22", dueDate: "2026-03-28", progress: 100, tags: ["database", "design"], createdAt: "2026-03-20",
  },
  {
    id: "3", projectId: "proj-1", stage: "development", title: "Implement authentication", description: "OAuth2 + JWT based auth system",
    status: "review", priority: "critical", assignee: "Alex", startDate: "2026-03-28", dueDate: "2026-04-05", progress: 85, tags: ["auth", "security"], createdAt: "2026-03-25",
  },
  {
    id: "4", projectId: "proj-1", stage: "development", title: "Build REST API endpoints", description: "CRUD operations for core entities",
    status: "in_progress", priority: "high", assignee: "Sam", startDate: "2026-04-01", dueDate: "2026-04-10", progress: 60, tags: ["api", "backend"], createdAt: "2026-03-28",
  },
  {
    id: "5", projectId: "proj-1", stage: "development", title: "Create UI component library", description: "Reusable components with Storybook docs",
    status: "in_progress", priority: "medium", assignee: "Jordan", startDate: "2026-04-02", dueDate: "2026-04-12", progress: 45, tags: ["ui", "components"], createdAt: "2026-03-30",
  },
  {
    id: "6", projectId: "proj-1", stage: "testing", title: "Write integration tests", description: "E2E tests for critical user flows",
    status: "todo", priority: "medium", assignee: "Sam", startDate: "2026-04-08", dueDate: "2026-04-15", progress: 0, tags: ["testing", "qa"], createdAt: "2026-04-01",
  },
  {
    id: "7", projectId: "proj-1", stage: "deployment", title: "Set up CI/CD pipeline", description: "GitHub Actions with automated deployments",
    status: "todo", priority: "high", assignee: "Alex", startDate: "2026-04-10", dueDate: "2026-04-14", progress: 0, tags: ["devops", "ci/cd"], createdAt: "2026-04-02",
  },
  {
    id: "8", projectId: "proj-2", stage: "requirements", title: "Stakeholder interviews", description: "Gather requirements from banking operations team",
    status: "done", priority: "high", assignee: "Jordan", startDate: "2026-03-20", dueDate: "2026-03-24", progress: 100, tags: ["requirements"], createdAt: "2026-03-18",
  },
  {
    id: "9", projectId: "proj-2", stage: "feasibility", title: "Security compliance review", description: "Assess PCI-DSS and regulatory requirements",
    status: "in_progress", priority: "critical", assignee: "Alex", startDate: "2026-03-25", dueDate: "2026-04-02", progress: 70, tags: ["security", "compliance"], createdAt: "2026-03-22",
  },
  {
    id: "10", projectId: "proj-2", stage: "system_design", title: "API gateway design", description: "Design microservices architecture with API gateway",
    status: "todo", priority: "high", assignee: "Sam", startDate: "2026-04-03", dueDate: "2026-04-10", progress: 0, tags: ["architecture", "api"], createdAt: "2026-03-28",
  },
];
