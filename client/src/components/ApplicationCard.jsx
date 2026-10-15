import { CalendarDays, Pencil, Trash2 } from 'lucide-react'
import { STATUSES } from '../utils/constants.js'

function ApplicationCard({ application, onEdit, onDelete }) {
  const badgeColor = STATUSES.find(({ name }) => name === application.status)?.badgeColor
  const dateLabel = (() => {
    if (!application.dateApplied) return 'Not provided'

    const rawDate = String(application.dateApplied)
    const datePart = rawDate.slice(0, 10)

    const date = /^\d{4}-\d{2}-\d{2}$/.test(datePart)
      ? new Date(`${datePart}T00:00:00`)
      : new Date(rawDate)

    if (Number.isNaN(date.getTime())) return 'Not provided'

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  })()

  return (
    <article className="flex h-full flex-col rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-gray-900">{application.company}</h3>
          <p className="mt-1 text-sm text-gray-600">{application.role}</p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${badgeColor || 'bg-gray-100 text-gray-700'}`}>
          {application.status}
        </span>
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
        <CalendarDays aria-hidden="true" size={16} />
        <span>Applied {dateLabel}</span>
      </div>
      <div className="mt-auto flex justify-end gap-1 border-t border-gray-100 pt-4">
        <button
          aria-label={`Edit ${application.company} application`}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-600"
          onClick={() => onEdit(application)}
          type="button"
        >
          <Pencil aria-hidden="true" size={17} />
        </button>
        <button
          aria-label={`Delete ${application.company} application`}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
          onClick={() => onDelete(application)}
          type="button"
        >
          <Trash2 aria-hidden="true" size={17} />
        </button>
      </div>
    </article>
  )
}

export default ApplicationCard
