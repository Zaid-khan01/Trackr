import { BriefcaseBusiness, Plus, SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import ApplicationCard from '../components/ApplicationCard.jsx'
import ApplicationForm from '../components/ApplicationForm.jsx'
import SearchFilter from '../components/SearchFilter.jsx'
import StatsCards from '../components/StatsCards.jsx'
import { MOCK_APPLICATIONS } from '../utils/constants.js'

function Dashboard() {
  const [applications, setApplications] = useState(MOCK_APPLICATIONS)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [editingApplication, setEditingApplication] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    return applications.filter((application) => {
      const matchesSearch =
        !normalizedSearch ||
        application.company.toLowerCase().includes(normalizedSearch) ||
        application.role.toLowerCase().includes(normalizedSearch)
      const matchesStatus = !status || application.status === status
      return matchesSearch && matchesStatus
    })
  }, [applications, search, status])

  function openNewForm() {
    setEditingApplication(null)
    setIsFormOpen(true)
  }

  function openEditForm(application) {
    setEditingApplication(application)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingApplication(null)
  }

  function saveApplication(formValues) {
    const now = new Date().toISOString()
    if (editingApplication) {
      setApplications((current) =>
        current.map((application) =>
          application.id === editingApplication.id
            ? { ...application, ...formValues, updatedAt: now }
            : application,
        ),
      )
    } else {
      setApplications((current) => [
        { ...formValues, id: crypto.randomUUID(), updatedAt: now },
        ...current,
      ])
    }
    closeForm()
  }

  function deleteApplication(application) {
    const confirmed = window.confirm(
      `Delete the ${application.role} application at ${application.company}?`,
    )
    if (!confirmed) return
    setApplications((current) =>
      current.filter((item) => item.id !== application.id),
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">Your job search</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Application dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Keep every opportunity organized as you move forward.
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          onClick={openNewForm}
          type="button"
        >
          <Plus aria-hidden="true" size={18} />
          Add application
        </button>
      </div>

      <StatsCards applications={applications} />

      <section className="mt-9">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
            <p className="mt-1 text-sm text-gray-500">
              {filteredApplications.length} of {applications.length} opportunities
            </p>
          </div>
          <div className="w-full sm:max-w-md">
            <SearchFilter
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              search={search}
              status={status}
            />
          </div>
        </div>

        {filteredApplications.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredApplications.map((application) => (
              <ApplicationCard
                application={application}
                key={application.id}
                onDelete={deleteApplication}
                onEdit={openEditForm}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
            {applications.length ? (
              <>
                <SearchX aria-hidden="true" className="mx-auto text-gray-400" size={30} />
                <h3 className="mt-4 font-semibold text-gray-900">No matching applications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing your search or status filter.
                </p>
              </>
            ) : (
              <>
                <BriefcaseBusiness aria-hidden="true" className="mx-auto text-gray-400" size={30} />
                <h3 className="mt-4 font-semibold text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Add your first opportunity to start tracking your search.
                </p>
                <button
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                  onClick={openNewForm}
                  type="button"
                >
                  <Plus aria-hidden="true" size={18} />
                  Add application
                </button>
              </>
            )}
          </div>
        )}
      </section>

      {isFormOpen && (
        <ApplicationForm
          application={editingApplication}
          onClose={closeForm}
          onSave={saveApplication}
        />
      )}
    </main>
  )
}

export default Dashboard
