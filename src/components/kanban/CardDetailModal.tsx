import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import type { FXTask, TaskStatus } from '../../types/task'
import { updateTaskInDB, deleteTaskFromDB } from '../../hooks/useTasks'

const STATUS_OPTIONS: TaskStatus[] = [
  'Completed',
  'In progress',
  'On hold',
  'Yet to start',
  'Not started yet',
]

const LABELS: Record<string, string> = {
  week_label: 'Week',
  week_start_date: 'Week Start Date',
  fsd_presented: 'FSD Presented',
  status: 'Status',
  design_start_date: 'Design Start Date',
  design_end_date: 'Design End Date',
  apl: 'APL Number(s)',
  feature_name: 'Feature / Project Name',
  pm: 'PM',
  designer: 'Designer',
  task_description: 'Task Description',
  demo_date: 'Demo Date',
  created_at: 'Created',
  updated_at: 'Updated',
}

function formatDate(value: string | undefined): string {
  if (!value) return '—'
  try {
    return format(parseISO(value), 'dd/MM/yyyy')
  } catch {
    return '—'
  }
}

function formatDateTime(value: string | undefined): string {
  if (!value) return '—'
  try {
    return format(parseISO(value), 'dd/MM/yyyy HH:mm')
  } catch {
    return '—'
  }
}

interface CardDetailModalProps {
  task: FXTask | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (task: FXTask) => void
  onDelete: (task: FXTask) => void
}

export default function CardDetailModal({
  task,
  isOpen,
  onClose,
  onUpdate,
  onDelete,
}: CardDetailModalProps) {
  const [status, setStatus] = useState<TaskStatus | ''>('')
  const [taskDescription, setTaskDescription] = useState('')
  const [designer, setDesigner] = useState('')
  const [pm, setPm] = useState('')
  const [demoDate, setDemoDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (task) {
      setStatus(task.status)
      setTaskDescription(task.task_description ?? '')
      setDesigner(task.designer ?? '')
      setPm(task.pm ?? '')
      setDemoDate(task.demo_date ?? '')
    }
  }, [task])

  if (!task) return null

  const currentTask = task

  async function handleSave() {
    setSaving(true)
    try {
      await updateTaskInDB(currentTask.id, {
        ...(status && { status: status as TaskStatus }),
        task_description: taskDescription || undefined,
        designer: designer || undefined,
        pm: pm || undefined,
        demo_date: demoDate || undefined,
      })
      const updated: FXTask = {
        ...currentTask,
        status: (status as TaskStatus) || currentTask.status,
        task_description: taskDescription || undefined,
        designer: designer || undefined,
        pm: pm || undefined,
        demo_date: demoDate || undefined,
      }
      onUpdate(updated)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    setDeleting(true)
    try {
      await deleteTaskFromDB(currentTask.id)
      onDelete(currentTask)
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const readFields: (keyof FXTask)[] = [
    'week_label',
    'week_start_date',
    'fsd_presented',
    'design_start_date',
    'design_end_date',
    'apl',
    'feature_name',
    'created_at',
    'updated_at',
  ]

  return (
    <>
      <div
        role="presentation"
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-[#1E293B] shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-600">
          <h2 className="text-lg font-semibold text-white">Task details</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close"
          >
            <span className="text-xl leading-none">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {readFields.map((key) => (
              <div key={key}>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  {LABELS[key] ?? key}
                </p>
                <p className="text-sm text-white">
                  {key === 'week_start_date' ||
                  key === 'fsd_presented' ||
                  key === 'design_start_date' ||
                  key === 'design_end_date' ||
                  key === 'demo_date'
                    ? formatDate((task as FXTask)[key] as string | undefined)
                    : key === 'created_at' || key === 'updated_at'
                      ? formatDateTime((task as FXTask)[key] as string | undefined)
                      : (task as FXTask)[key] ?? '—'}
                </p>
              </div>
            ))}

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-slate-600 text-white text-sm"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Task Description
              </label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-slate-600 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Task description"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Designer
              </label>
              <input
                type="text"
                value={designer}
                onChange={(e) => setDesigner(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-slate-600 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Designer name"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                PM
              </label>
              <input
                type="text"
                value={pm}
                onChange={(e) => setPm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-slate-600 text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Project manager"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                Demo Date
              </label>
              <input
                type="date"
                value={demoDate}
                onChange={(e) => setDemoDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#0F172A] border border-slate-600 text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-600 flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 px-4 rounded-lg font-medium text-white bg-[#6366F1] hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="py-2.5 px-4 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {deleting ? 'Deleting…' : 'Delete Task'}
          </button>
        </div>
      </aside>
    </>
  )
}
