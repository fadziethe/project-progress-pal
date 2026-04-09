import { useState, useCallback, useMemo } from "react";
import { Task, TaskStatus, ViewMode } from "@/types/task";
import { sampleTasks } from "@/data/sampleTasks";

export function useTaskStore() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    const q = searchQuery.toLowerCase();
    return tasks.filter(t => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q)));
  }, [tasks, searchQuery]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.status === "done").length;
    const inProgress = tasks.filter(t => t.status === "in_progress").length;
    const overallProgress = total ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / total) : 0;
    return { total, done, inProgress, overallProgress, completion: total ? Math.round((done / total) * 100) : 0 };
  }, [tasks]);

  return { tasks: filteredTasks, allTasks: tasks, viewMode, setViewMode, searchQuery, setSearchQuery, addTask, updateTask, deleteTask, moveTask, stats };
}
