import { Search } from 'lucide-react'
import { STATUSES } from '../utils/constants.js'

function SearchFilter({ search, status, onSearchChange, onStatusChange }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="relative block flex-1">
        <span className="sr-only">Search by company or role</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search company or role"
          type="search"
          value={search}
        />
      </label>
      <label>
        <span className="sr-only">Filter by status</span>
        <select
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 sm:w-48"
          onChange={(event) => onStatusChange(event.target.value)}
          value={status}
        >
          <option value="">All statuses</option>
          {STATUSES.map(({ name }) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </label>
    </div>
  )
}

export default SearchFilter
