interface WeekGroupHeaderProps {
  weekLabel: string
}

export default function WeekGroupHeader({ weekLabel }: WeekGroupHeaderProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="border-l-4 border-indigo-500 pl-3">
        <h2 className="text-lg font-semibold text-slate-600">{weekLabel}</h2>
      </div>
      <div className="flex-1 h-px bg-slate-600/50" aria-hidden />
    </div>
  )
}
