"use client";

import { useEffect } from "react";
import { useTaskStore } from "@/lib/stores/task.store";

export function useTasks() {
  const store = useTaskStore();

  useEffect(() => {
    if (store.tasks.length === 0 && !store.loading) {
      store.fetchTasks();
    }
  }, []);

  return {
    tasks: store.tasks,
    loading: store.loading,
    error: store.error,
    createTask: store.createTask,
    updateTask: store.updateTask,
    deleteTask: store.deleteTask,
    executeTask: store.executeTask,
    getTaskById: store.getTaskById,
    refetch: store.fetchTasks,
  };
}
