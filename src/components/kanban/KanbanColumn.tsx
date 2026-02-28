import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FXTask, TaskStatus } from '../../types/task'
import KanbanCard from './KanbanCard'
import WeekGroupHeader from '../shared/WeekGroupHeader'

const WEEK_ORDER = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

const STATUS_HEADER_COLORS: Record<TaskStatus, string> = {
  'Yet to start': '#3B82F6',
  'Not started yet': '#EF4444',
  'In progress': '#F97316',
  'On hold': '#EAB308',
  Completed: '#22C55E',
}

interface SortableCardProps {
  task: FXTask
  onCardClick: (task: FXTask) => void
}

function SortableCard({ task, onCardClick }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className={isDragging ? 'opacity-50' : ''}>
        <KanbanCard task={task} onCardClick={onCardClick} />
      </div>
    </div>
  )
}

interface KanbanColumnProps {
  status: TaskStatus
  tasks: FXTask[]
  onCardClick: (task: FXTask) => void
  groupByWeek?: boolean
}

function groupTasksByWeek(tasks: FXTask[]): { weekLabel: string; tasks: FXTask[] }[] {
  const byWeek = new Map<string, FXTask[]>()
  for (const task of tasks) {
    const week = task.week_label || 'Other'
    if (!byWeek.has(week)) byWeek.set(week, [])
    byWeek.get(week)!.push(task)
  }
  const ordered: { weekLabel: string; tasks: FXTask[] }[] = []
  for (const week of WEEK_ORDER) {
    const list = byWeek.get(week)
    if (list?.length) ordered.push({ weekLabel: week, tasks: list })
  }
  const rest = [...byWeek.entries()].filter(([w]) => !WEEK_ORDER.includes(w))
  for (const [weekLabel, list] of rest) {
    ordered.push({ weekLabel, tasks: list })
  }
  return ordered
}

export default function KanbanColumn({
  status,
  tasks,
  onCardClick,
  groupByWeek = false,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const headerColor = STATUS_HEADER_COLORS[status]
  const weekGroups = groupByWeek ? groupTasksByWeek(tasks) : null

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-[280px] min-w-[280px] max-h-[calc(100vh-120px)] rounded-lg bg-[#0F172A] border-2 transition-colors ${
        isOver ? 'border-indigo-500 border-dashed' : 'border-transparent'
      }`}
    >
      <div
        className="flex items-center justify-between px-4 py-3 rounded-t-lg text-white font-semibold"
        style={{ backgroundColor: headerColor }}
      >
        <span>{status}</span>
        <span className="flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-white/20 text-sm">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <SortableContext items={tasks.map((t) => t.id)}>
          {tasks.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-slate-600 text-slate-500 text-sm py-8 px-4 text-center">
              No tasks match your filters
            </div>
          ) : weekGroups ? (
            <div className="space-y-4">
              {weekGroups.map(({ weekLabel, tasks: weekTasks }) => (
                <div key={weekLabel}>
                  <WeekGroupHeader weekLabel={weekLabel} />
                  <div className="space-y-2 pl-0">
                    {weekTasks.map((task) => (
                      <SortableCard
                        key={task.id}
                        task={task}
                        onCardClick={onCardClick}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            tasks.map((task) => (
              <SortableCard
                key={task.id}
                task={task}
                onCardClick={onCardClick}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}
