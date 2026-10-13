import {
  BriefcaseBusiness,
  CircleX,
  MessageSquare,
  TrendingUp,
  Trophy,
} from 'lucide-react'

function StatsCards({ applications }) {
  const total = applications.length
  const interviews = applications.filter(({ status }) => status === 'Interview').length
  const offers = applications.filter(({ status }) => status === 'Offer').length
  const rejected = applications.filter(({ status }) => status === 'Rejected').length
  const responses = interviews + offers + rejected
  const responseRate = total ? Math.round((responses / total) * 100) : 0

  const stats = [
    { label: 'Total applications', value: total, icon: BriefcaseBusiness, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Interviews', value: interviews, icon: MessageSquare, color: 'text-amber-600 bg-amber-50' },
    { label: 'Offers', value: offers, icon: Trophy, color: 'text-green-600 bg-green-50' },
    { label: 'Rejected', value: rejected, icon: CircleX, color: 'text-red-600 bg-red-50' },
    { label: 'Response rate', value: `${responseRate}%`, icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50' },
  ]

  return (
    <section
      aria-label="Application statistics"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
    >
      {stats.map(({ label, value, icon: Icon, color }) => (
        <article className="rounded-xl bg-white p-4 shadow-sm sm:p-5" key={label}>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-500">{label}</p>
            <span className={`rounded-lg p-2 ${color}`}>
              <Icon aria-hidden="true" size={18} />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{value}</p>
        </article>
      ))}
    </section>
  )
}

export default StatsCards
