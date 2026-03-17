"use client";

import { create } from "zustand";
import type { Task } from "@/lib/types";

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  createTask: (data: Record<string, unknown>) => Promise<Task>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  executeTask: (id: string) => Promise<string>;
  getTaskById: (id: string) => Task | undefined;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/tasks");
      const tasks = await res.json();
      set({ tasks, loading: false });
    } catch {
      set({ error: "Failed to fetch tasks", loading: false });
    }
  },

  createTask: async (data) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const task = await res.json();
    await get().fetchTasks();
    return task;
  },

  updateTask: async (id, data) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await get().fetchTasks();
  },

  deleteTask: async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    await get().fetchTasks();
  },

  executeTask: async (id) => {
    const res = await fetch(`/api/tasks/${id}/execute`, { method: "POST" });
    const { runId } = await res.json();
    await get().fetchTasks();
    return runId;
  },

  getTaskById: (id) => {
    return get().tasks.find((t) => t.id === id);
  },
}));
