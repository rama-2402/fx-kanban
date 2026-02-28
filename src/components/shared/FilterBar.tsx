import { useState, useMemo, useEffect } from 'react'
import type { FXTask } from '../../types/task'

const WEEK_OPTIONS = ['All Weeks', 'Week 1', 'Week 2', 'Week 3', 'Week 4'] as const

interface FilterBarProps {
  tasks: FXTask[]
  onFilterChange: (filtered: FXTask[]) => void
}

function applyFilters(
  tasks: FXTask[],
  search: string,
  designer: string,
  pm: string,
  week: string
): FXTask[] {
  return tasks.filter((task) => {
    const searchLower = search.trim().toLowerCase()
    if (searchLower) {
      const matchFeature = task.feature_name?.toLowerCase().includes(searchLower)
      const matchApl = task.apl?.toLowerCase().includes(searchLower)
      if (!matchFeature && !matchApl) return false
    }
    if (designer && task.designer !== designer) return false
    if (pm && task.pm !== pm) return false
    if (week && week !== 'All Weeks' && task.week_label !== week) return false
    return true
  })
}

export default function FilterBar({ tasks, onFilterChange }: FilterBarProps) {
  const [search, setSearch] = useState('')
  const [designer, setDesigner] = useState('')
  const [pm, setPm] = useState('')
  const [week, setWeek] = useState('')

  const designers = useMemo(() => {
    const set = new Set<string>()
    tasks.forEach((t) => {
      if (t.designer?.trim()) set.add(t.designer.trim())
    })
    return Array.from(set).sort()
  }, [tasks])

  const pms = useMemo(() => {
    const set = new Set<string>()
    tasks.forEach((t) => {
      if (t.pm?.trim()) set.add(t.pm.trim())
    })
    return Array.from(set).sort()
  }, [tasks])

  const filtered = useMemo(
    () => applyFilters(tasks, search, designer, pm, week),
    [tasks, search, designer, pm, week]
  )

  useEffect(() => {
    onFilterChange(filtered)
  }, [filtered, onFilterChange])

  function handleClear() {
    setSearch('')
    setDesigner('')
    setPm('')
    setWeek('')
  }

  const inputClass =
    'px-3 py-2 rounded-lg bg-[#0F172A] border border-slate-600 text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Search by feature or APL..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`${inputClass} min-w-[180px]`}
      />
      <select
        value={designer}
        onChange={(e) => setDesigner(e.target.value)}
        className={inputClass}
      >
        <option value="">All Designers</option>
        {designers.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        value={pm}
        onChange={(e) => setPm(e.target.value)}
        className={inputClass}
      >
        <option value="">All PMs</option>
        {pms.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <select
        value={week}
        onChange={(e) => setWeek(e.target.value)}
        className={inputClass}
      >
        {WEEK_OPTIONS.map((w) => (
          <option key={w} value={w === 'All Weeks' ? '' : w}>
            {w}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleClear}
        className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-600 text-white hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  )
}
