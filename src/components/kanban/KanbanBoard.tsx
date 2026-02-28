import { useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useTasks, updateTaskInDB } from '../../hooks/useTasks'
import { useTaskStore, type TaskStore } from '../../store/taskStore'
import type { FXTask, TaskStatus } from '../../types/task'
import FilterBar from '../shared/FilterBar'
import KanbanColumn from './KanbanColumn'
import KanbanCard from './KanbanCard'
import CardDetailModal from './CardDetailModal'

const COLUMN_ORDER: TaskStatus[] = [
  'Yet to start',
  'Not started yet',
  'In progress',
  'On hold',
  'Completed',
]

function LoadingSkeleton() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[1, 2, 3, 4, 5].map((col) => (
        <div
          key={col}
          className="flex flex-col w-[280px] min-w-[280px] rounded-lg bg-[#0F172A] border border-slate-700 overflow-hidden"
        >
          <div className="h-12 bg-slate-700/50 animate-pulse rounded-t-lg" />
          <div className="p-3 space-y-2">
            {[1, 2, 3, 4].map((row) => (
              <div
                key={row}
                className="h-20 rounded-lg bg-slate-700/60 animate-pulse"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function KanbanBoard() {
  const { tasks, loading, error } = useTasks()
  const updateTask = useTaskStore((s: TaskStore) => s.updateTask)

  const [filteredTasks, setFilteredTasks] = useState<FXTask[]>([])
  const [groupByWeek, setGroupByWeek] = useState(false)
  const [activeTask, setActiveTask] = useState<FXTask | null>(null)
  const [modalTask, setModalTask] = useState<FXTask | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const tasksByStatus = useMemo(() => {
    const map = new Map<TaskStatus, FXTask[]>()
    for (const status of COLUMN_ORDER) {
      map.set(
        status,
        filteredTasks
          .filter((t) => t.status === status)
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
      )
    }
    return map
  }, [filteredTasks])

  const stats = useMemo(() => {
    const completed = tasksByStatus.get('Completed')?.length ?? 0
    const inProgress = tasksByStatus.get('In progress')?.length ?? 0
    const onHold = tasksByStatus.get('On hold')?.length ?? 0
    return {
      total: filteredTasks.length,
      completed,
      inProgress,
      onHold,
    }
  }, [filteredTasks, tasksByStatus])

  function handleDragStart(event: DragStartEvent) {
    const taskId = event.active.id as string
    const task = tasks.find((t: FXTask) => t.id === taskId)
    if (task) setActiveTask(task)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return
    const taskId = active.id as string
    const task = tasks.find((t: FXTask) => t.id === taskId)
    if (!task) return

    let newStatus: TaskStatus | null = null
    if (COLUMN_ORDER.includes(over.id as TaskStatus)) {
      newStatus = over.id as TaskStatus
    } else {
      const overTask = tasks.find((t: FXTask) => t.id === over.id)
      if (overTask) newStatus = overTask.status
    }

    if (!newStatus || newStatus === task.status) return

    const updated = { ...task, status: newStatus }
    updateTask(updated)
    updateTaskInDB(task.id, { status: newStatus }).catch(() => {
      updateTask(task)
    })
  }

  function handleCardClick(task: FXTask) {
    setModalTask(task)
    setModalOpen(true)
  }

  function handleModalUpdate(updated: FXTask) {
    updateTask(updated)
    setModalTask(updated)
  }

  function handleModalDelete(deleted: FXTask) {
    useTaskStore.getState().deleteTask(deleted.id)
    setModalOpen(false)
    setModalTask(null)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-full bg-slate-600 text-white text-sm animate-pulse">
            —
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-600 text-white text-sm animate-pulse">
            —
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-600 text-white text-sm animate-pulse">
            —
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-600 text-white text-sm animate-pulse">
            —
          </span>
        </div>
        <LoadingSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      <FilterBar tasks={tasks} onFilterChange={setFilteredTasks} />
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setGroupByWeek((v) => !v)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            groupByWeek
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          Group by Week
        </button>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-full bg-white/10 text-white text-sm">
            Total: {stats.total}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-green-600/80 text-white text-sm">
            Completed: {stats.completed}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-orange-500/80 text-white text-sm">
            In Progress: {stats.inProgress}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-yellow-500/80 text-gray-900 text-sm">
            On Hold: {stats.onHold}
          </span>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMN_ORDER.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasksByStatus.get(status) ?? []}
              onCardClick={handleCardClick}
              groupByWeek={groupByWeek}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-[260px] cursor-grabbing opacity-95 shadow-xl rounded-lg">
              <KanbanCard task={activeTask} onCardClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardDetailModal
        task={modalTask}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setModalTask(null)
        }}
        onUpdate={handleModalUpdate}
        onDelete={handleModalDelete}
      />
    </div>
  )
}
