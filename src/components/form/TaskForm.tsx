import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabaseClient'
import type { NewFXTask } from '../../types/task'

const WEEK_OPTIONS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'] as const
const STATUS_OPTIONS = [
  'Completed',
  'In progress',
  'On hold',
  'Yet to start',
  'Not started yet',
] as const

const taskFormSchema = z.object({
  week_label: z.enum(WEEK_OPTIONS, { required_error: 'Week is required' }),
  week_start_date: z.string().optional(),
  fsd_presented: z.string().optional(),
  status: z.enum(STATUS_OPTIONS, { required_error: 'Status is required' }),
  design_start_date: z.string().optional(),
  design_end_date: z.string().optional(),
  apl: z.string().optional(),
  feature_name: z.string().min(1, 'Feature / Project Name is required'),
  pm: z.string().optional(),
  designer: z.string().optional(),
  task_description: z.string().optional(),
  demo_date: z.string().optional(),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

function emptyToUndefined(s: string | undefined): string | undefined {
  return s === '' || s == null ? undefined : s
}

export default function TaskForm() {
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      week_label: undefined,
      week_start_date: '',
      fsd_presented: '',
      status: undefined,
      design_start_date: '',
      design_end_date: '',
      apl: '',
      feature_name: '',
      pm: '',
      designer: '',
      task_description: '',
      demo_date: '',
    },
  })

  async function onSubmit(data: TaskFormValues) {
    setSubmitting(true)
    const payload: NewFXTask = {
      week_label: data.week_label,
      week_start_date: emptyToUndefined(data.week_start_date),
      fsd_presented: emptyToUndefined(data.fsd_presented),
      status: data.status,
      design_start_date: emptyToUndefined(data.design_start_date),
      design_end_date: emptyToUndefined(data.design_end_date),
      apl: emptyToUndefined(data.apl),
      feature_name: data.feature_name.trim(),
      pm: emptyToUndefined(data.pm),
      designer: emptyToUndefined(data.designer),
      task_description: emptyToUndefined(data.task_description),
      demo_date: emptyToUndefined(data.demo_date),
    }

    try {
      const { error } = await supabase.from('fx_design_tasks').insert(payload)
      if (error) throw error
      toast.success('Task submitted successfully!')
      reset()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit task.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 rounded-lg bg-[#0F172A] border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
  const labelClass = 'block text-sm font-medium text-slate-400 mb-1.5'
  const errorClass = 'mt-1 text-sm text-red-400'

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#1E293B] rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Week */}
        <div>
          <label htmlFor="week_label" className={labelClass}>
            Week <span className="text-red-400">*</span>
          </label>
          <select
            id="week_label"
            {...register('week_label')}
            className={inputClass}
          >
            <option value="">Select week</option>
            {WEEK_OPTIONS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          {errors.week_label && (
            <p className={errorClass}>{errors.week_label.message}</p>
          )}
        </div>

        {/* 2. Week Start Date */}
        <div>
          <label htmlFor="week_start_date" className={labelClass}>
            Week Start Date
          </label>
          <input
            id="week_start_date"
            type="date"
            {...register('week_start_date')}
            className={inputClass}
          />
          {errors.week_start_date && (
            <p className={errorClass}>{errors.week_start_date.message}</p>
          )}
        </div>

        {/* 3. FSD Presented */}
        <div>
          <label htmlFor="fsd_presented" className={labelClass}>
            FSD Presented
          </label>
          <input
            id="fsd_presented"
            type="date"
            {...register('fsd_presented')}
            className={inputClass}
          />
          {errors.fsd_presented && (
            <p className={errorClass}>{errors.fsd_presented.message}</p>
          )}
        </div>

        {/* 4. Status */}
        <div>
          <label htmlFor="status" className={labelClass}>
            Status <span className="text-red-400">*</span>
          </label>
          <select id="status" {...register('status')} className={inputClass}>
            <option value="">Select status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className={errorClass}>{errors.status.message}</p>
          )}
        </div>

        {/* 5. Design Start Date */}
        <div>
          <label htmlFor="design_start_date" className={labelClass}>
            Design Start Date
          </label>
          <input
            id="design_start_date"
            type="date"
            {...register('design_start_date')}
            className={inputClass}
          />
          {errors.design_start_date && (
            <p className={errorClass}>{errors.design_start_date.message}</p>
          )}
        </div>

        {/* 6. Design End Date */}
        <div>
          <label htmlFor="design_end_date" className={labelClass}>
            Design End Date
          </label>
          <input
            id="design_end_date"
            type="date"
            {...register('design_end_date')}
            className={inputClass}
          />
          {errors.design_end_date && (
            <p className={errorClass}>{errors.design_end_date.message}</p>
          )}
        </div>

        {/* 7. APL Number(s) */}
        <div>
          <label htmlFor="apl" className={labelClass}>
            APL Number(s)
          </label>
          <input
            id="apl"
            type="text"
            placeholder="e.g. 14602, 14604"
            {...register('apl')}
            className={inputClass}
          />
          {errors.apl && <p className={errorClass}>{errors.apl.message}</p>}
        </div>

        {/* 8. Feature / Project Name — full width */}
        <div className="md:col-span-2">
          <label htmlFor="feature_name" className={labelClass}>
            Feature / Project Name <span className="text-red-400">*</span>
          </label>
          <input
            id="feature_name"
            type="text"
            {...register('feature_name')}
            className={inputClass}
          />
          {errors.feature_name && (
            <p className={errorClass}>{errors.feature_name.message}</p>
          )}
        </div>

        {/* 9. PM */}
        <div>
          <label htmlFor="pm" className={labelClass}>
            PM (Project Manager)
          </label>
          <input
            id="pm"
            type="text"
            {...register('pm')}
            className={inputClass}
          />
          {errors.pm && <p className={errorClass}>{errors.pm.message}</p>}
        </div>

        {/* 10. Designer */}
        <div>
          <label htmlFor="designer" className={labelClass}>
            Designer
          </label>
          <input
            id="designer"
            type="text"
            {...register('designer')}
            className={inputClass}
          />
          {errors.designer && (
            <p className={errorClass}>{errors.designer.message}</p>
          )}
        </div>

        {/* 11. Task Description — full width */}
        <div className="md:col-span-2">
          <label htmlFor="task_description" className={labelClass}>
            Task Description
          </label>
          <textarea
            id="task_description"
            rows={4}
            {...register('task_description')}
            className={inputClass}
          />
          {errors.task_description && (
            <p className={errorClass}>{errors.task_description.message}</p>
          )}
        </div>

        {/* 12. Demo Date */}
        <div>
          <label htmlFor="demo_date" className={labelClass}>
            Demo Date
          </label>
          <input
            id="demo_date"
            type="date"
            {...register('demo_date')}
            className={inputClass}
          />
          {errors.demo_date && (
            <p className={errorClass}>{errors.demo_date.message}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 rounded-lg font-medium text-white bg-[#6366F1] hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#1E293B] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting…
            </>
          ) : (
            'Submit Task'
          )}
        </button>
      </div>
    </form>
  )
}
