import { BriefcaseBusiness, ChevronLeft, ChevronRight, Plus, SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createApplication, getApplicationStats, listApplications, removeApplication, updateApplication } from '../api/applications.js'
import { getApiErrorMessage } from '../api/axios.js'
import ApplicationCard from '../components/ApplicationCard.jsx'
import ApplicationForm from '../components/ApplicationForm.jsx'
import Loader from '../components/Loader.jsx'
import SearchFilter from '../components/SearchFilter.jsx'
import StatsCards from '../components/StatsCards.jsx'

const PAGE_SIZE = 9
const emptyStats = {
  Applied: 0,
  Interview: 0,
  Offer: 0,
  Rejected: 0,
  total: 0,
  responseRate: 0,
}

function Dashboard() {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(emptyStats)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loadedRequestKey, setLoadedRequestKey] = useState('')
  const [loadedStatsKey, setLoadedStatsKey] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const [statsError, setStatsError] = useState('')
  const [formError, setFormError] = useState('')
  const [editingApplication, setEditingApplication] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const requestKey = JSON.stringify([page, debouncedSearch, status, refreshKey])
  const isLoading = loadedRequestKey !== requestKey
  const isStatsLoading = loadedStatsKey !== String(refreshKey)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearch(search.trim()), 400)
    return () => window.clearTimeout(timeoutId)
  }, [search])

  useEffect(() => {
    let active = true

    listApplications({
      page,
      limit: PAGE_SIZE,
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(status && { status }),
    })
      .then((result) => {
        if (!active) return
        setApplications(result.applications)
        setTotal(result.total)
        setTotalPages(Math.max(result.totalPages, 1))
        setError('')
        if (result.totalPages > 0 && page > result.totalPages) {
          setPage(result.totalPages)
        }
      })
      .catch((requestError) => {
        if (active) setError(getApiErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoadedRequestKey(requestKey)
      })

    return () => {
      active = false
    }
  }, [page, debouncedSearch, status, refreshKey, requestKey])

  useEffect(() => {
    let active = true
    getApplicationStats()
      .then((result) => {
        if (active) {
          setStats({ ...emptyStats, ...result })
          setStatsError('')
        }
      })
      .catch((requestError) => {
        if (active) setStatsError(getApiErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoadedStatsKey(String(refreshKey))
      })

    return () => {
      active = false
    }
  }, [refreshKey])

  function changeSearch(value) {
    setSearch(value)
    setPage(1)
    setError('')
  }

  function changeStatus(value) {
    setStatus(value)
    setPage(1)
    setError('')
  }

  function openNewForm() {
    setEditingApplication(null)
    setFormError('')
    setIsFormOpen(true)
  }

  function openEditForm(application) {
    setEditingApplication(application)
    setFormError('')
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingApplication(null)
    setFormError('')
  }

  async function saveApplication(formValues) {
    const payload = {
      company: formValues.company,
      role: formValues.role,
      status: formValues.status,
      notes: formValues.notes,
      ...(formValues.jobLink && { jobLink: formValues.jobLink }),
      ...(formValues.dateApplied && { dateApplied: formValues.dateApplied }),
    }
    setIsSaving(true)
    setFormError('')
    try {
      if (editingApplication) {
        await updateApplication(editingApplication._id, payload)
      } else {
        await createApplication(payload)
      }
      closeForm()
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError))
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteApplication(application) {
    const confirmed = window.confirm(
      `Delete the ${application.role} application at ${application.company}?`,
    )
    if (!confirmed) return

    setIsDeleting(true)
    setError('')
    try {
      await removeApplication(application._id)
      setRefreshKey((current) => current + 1)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsDeleting(false)
    }
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

      {isStatsLoading ? (
        <div className="rounded-xl bg-white p-6 text-sm text-gray-500 shadow-sm">
          <Loader label="Loading statistics..." />
        </div>
      ) : statsError ? (
        <p aria-live="polite" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load statistics: {statsError}
        </p>
      ) : (
        <StatsCards stats={stats} />
      )}

      <section className="mt-9">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
            <p className="mt-1 text-sm text-gray-500">
              {total} {total === 1 ? 'opportunity' : 'opportunities'}
            </p>
          </div>
          <div className="w-full sm:max-w-md">
            <SearchFilter
              onSearchChange={changeSearch}
              onStatusChange={changeStatus}
              search={search}
              status={status}
            />
          </div>
        </div>

        {error && !isLoading && !isDeleting ? (
          <div className="rounded-xl bg-white px-6 py-10 text-center shadow-sm">
            <p aria-live="polite" className="text-sm text-red-700">{error}</p>
            <button
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              onClick={() => {
                setError('')
                setRefreshKey((current) => current + 1)
              }}
              type="button"
            >
              Try again
            </button>
          </div>
        ) : isLoading || isDeleting ? (
          <div className="rounded-xl bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
            <Loader label={isDeleting ? 'Deleting application...' : 'Loading applications...'} />
          </div>
        ) : applications.length ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {applications.map((application) => (
                <ApplicationCard
                  application={application}
                  key={application._id}
                  onDelete={deleteApplication}
                  onEdit={openEditForm}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <nav aria-label="Application pages" className="mt-6 flex items-center justify-between">
                <button
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => current - 1)}
                  type="button"
                >
                  <ChevronLeft aria-hidden="true" size={16} />
                  Previous
                </button>
                <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                <button
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={page >= totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  type="button"
                >
                  Next
                  <ChevronRight aria-hidden="true" size={16} />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
            {search.trim() || status ? (
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
          error={formError}
          isSaving={isSaving}
          onClose={closeForm}
          onSave={saveApplication}
        />
      )}
    </main>
  )
}

export default Dashboard
