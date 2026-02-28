import type { TaskStatus } from '../../types/task'

const STATUS_STYLES: Record<
  TaskStatus,
  { bg: string; text: string }
> = {
  Completed: { bg: '#22C55E', text: 'text-gray-900' },
  'In progress': { bg: '#F97316', text: 'text-gray-900' },
  'On hold': { bg: '#EAB308', text: 'text-gray-900' },
  'Yet to start': { bg: '#3B82F6', text: 'text-white' },
  'Not started yet': { bg: '#EF4444', text: 'text-white' },
}

interface StatusBadgeProps {
  status: TaskStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { bg, text } = STATUS_STYLES[status]
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${text}`}
      style={{ backgroundColor: bg }}
    >
      {status}
    </span>
  )
}
