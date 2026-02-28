import { create } from 'zustand'
import type { FXTask } from '../types/task'

export interface TaskStore {
  tasks: FXTask[]
  setTasks: (tasks: FXTask[]) => void
  updateTask: (task: FXTask) => void
  deleteTask: (id: string) => void
  addTask: (task: FXTask) => void
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),
}))
