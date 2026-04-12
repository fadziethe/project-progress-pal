import { useState, useCallback, useMemo, useEffect } from "react";
import { Task, TaskStatus, ViewMode, Project } from "@/types/task";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useTaskStore() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStageFilter, setActiveStageFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch projects on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [{ data: pData, error: pErr }, { data: tData, error: tErr }] = await Promise.all([
        supabase.from("projects").select("*").order("created_at", { ascending: true }),
        supabase.from("tasks").select("*").order("created_at", { ascending: true }),
      ]);
      if (pErr) { toast.error("Failed to load projects"); console.error(pErr); }
      if (tErr) { toast.error("Failed to load tasks"); console.error(tErr); }

      const mappedProjects: Project[] = (pData || []).map(p => ({
        id: p.id, name: p.name, description: p.description,
        type: p.type as Project["type"], stages: p.stages,
        color: p.color, createdAt: p.created_at.split("T")[0],
      }));
      const mappedTasks: Task[] = (tData || []).map(t => ({
        id: t.id, projectId: t.project_id, stage: t.stage,
        title: t.title, description: t.description,
        status: t.status as TaskStatus, priority: t.priority as Task["priority"],
        assignee: t.assignee || undefined, startDate: t.start_date,
        dueDate: t.due_date, progress: t.progress, tags: t.tags,
        createdAt: t.created_at.split("T")[0],
      }));

      setProjects(mappedProjects);
      setAllTasks(mappedTasks);
      if (mappedProjects.length > 0 && !activeProjectId) {
        setActiveProjectId(mappedProjects[0].id);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId) || null, [projects, activeProjectId]);

  const addProject = useCallback(async (project: Omit<Project, "id" | "createdAt">) => {
    const { data, error } = await supabase.from("projects").insert({
      name: project.name, description: project.description,
      type: project.type, stages: project.stages, color: project.color,
    }).select().single();
    if (error || !data) { toast.error("Failed to create project"); return; }
    const newProject: Project = {
      id: data.id, name: data.name, description: data.description,
      type: data.type as Project["type"], stages: data.stages,
      color: data.color, createdAt: data.created_at.split("T")[0],
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    setActiveStageFilter(null);
    toast.success("Project created");
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error("Failed to delete project"); return; }
    setProjects(prev => prev.filter(p => p.id !== id));
    setAllTasks(prev => prev.filter(t => t.projectId !== id));
    setActiveProjectId(prev => prev === id ? (projects.find(p => p.id !== id)?.id || null) : prev);
    toast.success("Project deleted");
  }, [projects]);

  const addTask = useCallback(async (task: Omit<Task, "id" | "createdAt">) => {
    const { data, error } = await supabase.from("tasks").insert({
      project_id: task.projectId, stage: task.stage, title: task.title,
      description: task.description, status: task.status, priority: task.priority,
      assignee: task.assignee || null, start_date: task.startDate,
      due_date: task.dueDate, progress: task.progress, tags: task.tags,
    }).select().single();
    if (error || !data) { toast.error("Failed to create task"); return; }
    const newTask: Task = {
      id: data.id, projectId: data.project_id, stage: data.stage,
      title: data.title, description: data.description,
      status: data.status as TaskStatus, priority: data.priority as Task["priority"],
      assignee: data.assignee || undefined, startDate: data.start_date,
      dueDate: data.due_date, progress: data.progress, tags: data.tags,
      createdAt: data.created_at.split("T")[0],
    };
    setAllTasks(prev => [...prev, newTask]);
    toast.success("Task created");
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.assignee !== undefined) dbUpdates.assignee = updates.assignee || null;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
    if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.stage !== undefined) dbUpdates.stage = updates.stage;

    const { error } = await supabase.from("tasks").update(dbUpdates).eq("id", id);
    if (error) { toast.error("Failed to update task"); return; }
    setAllTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) { toast.error("Failed to delete task"); return; }
    setAllTasks(prev => prev.filter(t => t.id !== id));
    toast.success("Task deleted");
  }, []);

  const moveTask = useCallback(async (id: string, status: TaskStatus) => {
    const progress = status === "done" ? 100 : status === "review" ? 85 : undefined;
    const updates: Record<string, unknown> = { status };
    if (progress !== undefined) updates.progress = progress;

    const { error } = await supabase.from("tasks").update(updates).eq("id", id);
    if (error) { toast.error("Failed to move task"); return; }
    setAllTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const p = status === "done" ? 100 : status === "review" ? 85 : t.progress;
      return { ...t, status, progress: p };
    }));
  }, []);

  const projectTasks = useMemo(() => {
    if (!activeProjectId) return [];
    let filtered = allTasks.filter(t => t.projectId === activeProjectId);
    if (activeStageFilter) filtered = filtered.filter(t => t.stage === activeStageFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => t.title.toLowerCase().includes(q) || t.tags.some(tag => tag.includes(q)));
    }
    return filtered;
  }, [allTasks, activeProjectId, activeStageFilter, searchQuery]);

  const stats = useMemo(() => {
    const ptasks = allTasks.filter(t => t.projectId === activeProjectId);
    const total = ptasks.length;
    const done = ptasks.filter(t => t.status === "done").length;
    const inProgress = ptasks.filter(t => t.status === "in_progress").length;
    const overallProgress = total ? Math.round(ptasks.reduce((sum, t) => sum + t.progress, 0) / total) : 0;
    return { total, done, inProgress, overallProgress, completion: total ? Math.round((done / total) * 100) : 0 };
  }, [allTasks, activeProjectId]);

  const stageProgress = useMemo(() => {
    if (!activeProject) return [];
    return activeProject.stages.map(stageId => {
      const stageTasks = allTasks.filter(t => t.projectId === activeProjectId && t.stage === stageId);
      const total = stageTasks.length;
      const done = stageTasks.filter(t => t.status === "done").length;
      const progress = total ? Math.round((done / total) * 100) : 0;
      return { stageId, total, done, progress };
    });
  }, [allTasks, activeProject, activeProjectId]);

  return {
    projects, activeProject, activeProjectId, setActiveProjectId,
    addProject, deleteProject,
    tasks: projectTasks, allTasks,
    viewMode, setViewMode, searchQuery, setSearchQuery,
    activeStageFilter, setActiveStageFilter,
    addTask, updateTask, deleteTask, moveTask,
    stats, stageProgress, loading,
  };
}
