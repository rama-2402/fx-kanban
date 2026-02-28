import { format, parseISO, isBefore, startOfDay } from 'date-fns'
import type { FXTask } from '../../types/task'
import StatusBadge from '../shared/StatusBadge'

interface KanbanCardProps {
  task: FXTask
  onCardClick: (task: FXTask) => void
}

function getInitials(name: string | undefined): string {
  if (!name?.trim()) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function formatDisplayDate(value: string | undefined): string {
  if (!value) return '—'
  try {
    return format(parseISO(value), 'dd/MM/yyyy')
  } catch {
    return '—'
  }
}

export default function KanbanCard({ task, onCardClick }: KanbanCardProps) {
  const designEndDateFormatted = formatDisplayDate(task.design_end_date)
  const isOverdue =
    task.design_end_date &&
    task.status !== 'Completed' &&
    isBefore(parseISO(task.design_end_date), startOfDay(new Date()))

  return (
    <button
      type="button"
      onClick={() => onCardClick(task)}
      className="w-full text-left p-4 rounded-lg border border-slate-600 bg-[#1E293B] hover:shadow-lg hover:border-slate-500 transition-all duration-200"
    >
      <div className="flex flex-col gap-2">
        <p className="font-bold text-white truncate" title={task.feature_name}>
          {task.feature_name}
        </p>
        {task.apl && (
          <span className="text-xs text-slate-400">APL: {task.apl}</span>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {task.designer && (
            <div className="flex items-center gap-2">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-medium"
                title={task.designer}
              >
                {getInitials(task.designer)}
              </span>
              <span className="text-xs text-slate-400 truncate max-w-[100px]">
                {task.designer}
              </span>
            </div>
          )}
          {task.pm && (
            <span className="text-xs text-slate-400">PM: {task.pm}</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <StatusBadge status={task.status} />
          <span
            className={`text-xs flex items-center gap-1 ${
              isOverdue ? 'text-red-400' : 'text-slate-400'
            }`}
          >
            {isOverdue && (
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {designEndDateFormatted}
          </span>
        </div>
        <div className="flex justify-end">
          <span className="text-xs text-slate-500">{task.week_label}</span>
        </div>
      </div>
    </button>
  )
}
