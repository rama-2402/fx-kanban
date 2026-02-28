import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useTaskStore } from '../store/taskStore'
import type { FXTask } from '../types/task'

export function useTasks() {
  const tasks = useTaskStore((s) => s.tasks)
  const setTasks = useTaskStore((s) => s.setTasks)
  const addTask = useTaskStore((s) => s.addTask)
  const updateTask = useTaskStore((s) => s.updateTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    async function fetchTasks() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: fetchError } = await supabase
          .from('fx_design_tasks')
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setTasks((data ?? []) as FXTask[])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()

    channel = supabase
      .channel('fx_design_tasks_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'fx_design_tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            addTask(payload.new as FXTask)
          } else if (payload.eventType === 'UPDATE') {
            updateTask(payload.new as FXTask)
          } else if (payload.eventType === 'DELETE') {
            deleteTask((payload.old as FXTask).id)
          }
        }
      )
      .subscribe()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [setTasks, addTask, updateTask, deleteTask])

  return { tasks, loading, error }
}

export async function updateTaskInDB(
  id: string,
  updates: Partial<Omit<FXTask, 'id' | 'created_at'>>
) {
  const { error } = await supabase
    .from('fx_design_tasks')
    .update(updates)
    .eq('id', id)
  if (error) throw error
}

export async function deleteTaskFromDB(id: string) {
  const { error } = await supabase.from('fx_design_tasks').delete().eq('id', id)
  if (error) throw error
}
