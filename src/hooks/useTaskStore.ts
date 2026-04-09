import { useState, useCallback, useMemo } from "react";
import { Task, TaskStatus, ViewMode, Project } from "@/types/task";
import { sampleTasks, sampleProjects } from "@/data/sampleTasks";

export function useTaskStore() {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(sampleProjects[0]?.id || null);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStageFilter, setActiveStageFilter] = useState<string | null>(null);

  const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId) || null, [projects, activeProjectId]);

  const addProject = useCallback((project: Omit<Project, "id" | "createdAt">) => {
    const newProject: Project = { ...project, id: crypto.randomUUID(), createdAt: new Date().toISOString().split("T")[0] };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setActiveStageFilter(null);
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    setActiveProjectId(prev => prev === id ? (projects.find(p => p.id !== id)?.id || null) : prev);
  }, [projects]);

  const addTask = useCallback((task: Omit<Task, "id" | "createdAt">) => {
    setTasks(prev => [...prev, { ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString().split("T")[0] }]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const progress = status === "done" ? 100 : status === "review" ? 85 : t.progress;
      return { ...t, status, progress };
    }));
  }, []);

  const projectTasks = useMemo(() => {
    if (!activeProjectId) return [];
    let filtered = tasks.filter(t => t.projectId === activeProjectId);
    if (activeStageFilter) filtered = filtered.filter(t => t.stage === activeStageFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q)));
    }
    return filtered;
  }, [tasks, activeProjectId, activeStageFilter, searchQuery]);

  const stats = useMemo(() => {
    const ptasks = tasks.filter(t => t.projectId === activeProjectId);
    const total = ptasks.length;
    const done = ptasks.filter(t => t.status === "done").length;
    const inProgress = ptasks.filter(t => t.status === "in_progress").length;
    const overallProgress = total ? Math.round(ptasks.reduce((sum, t) => sum + t.progress, 0) / total) : 0;
    return { total, done, inProgress, overallProgress, completion: total ? Math.round((done / total) * 100) : 0 };
  }, [tasks, activeProjectId]);

  const stageProgress = useMemo(() => {
    if (!activeProject) return [];
    return activeProject.stages.map(stageId => {
      const stageTasks = tasks.filter(t => t.projectId === activeProjectId && t.stage === stageId);
      const total = stageTasks.length;
      const done = stageTasks.filter(t => t.status === "done").length;
      const progress = total ? Math.round((done / total) * 100) : 0;
      return { stageId, total, done, progress };
    });
  }, [tasks, activeProject, activeProjectId]);

  return {
    projects, activeProject, activeProjectId, setActiveProjectId,
    addProject, deleteProject,
    tasks: projectTasks, allTasks: tasks,
    viewMode, setViewMode, searchQuery, setSearchQuery,
    activeStageFilter, setActiveStageFilter,
    addTask, updateTask, deleteTask, moveTask,
    stats, stageProgress,
  };
}
