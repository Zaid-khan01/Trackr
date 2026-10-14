import {
  BriefcaseBusiness,
  CircleX,
  MessageSquare,
  TrendingUp,
  Trophy,
} from 'lucide-react'

function StatsCards({ stats }) {
  const cards = [
    { label: 'Total applications', value: stats.total, icon: BriefcaseBusiness, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Interviews', value: stats.Interview, icon: MessageSquare, color: 'text-amber-600 bg-amber-50' },
    { label: 'Offers', value: stats.Offer, icon: Trophy, color: 'text-green-600 bg-green-50' },
    { label: 'Rejected', value: stats.Rejected, icon: CircleX, color: 'text-red-600 bg-red-50' },
    { label: 'Response rate', value: `${Math.round(stats.responseRate)}%`, icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50' },
  ]

  return (
    <section
      aria-label="Application statistics"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
    >
      {cards.map(({ label, value, icon: Icon, color }) => (
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
