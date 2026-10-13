import { useState } from 'react'
import { STATUSES } from '../utils/constants.js'

const blankApplication = {
  company: '',
  role: '',
  jobLink: '',
  status: 'Applied',
  dateApplied: new Date().toISOString().slice(0, 10),
  notes: '',
}

function ApplicationForm({ application, onClose, onSave }) {
  const [values, setValues] = useState(() =>
    application ? { ...blankApplication, ...application } : { ...blankApplication },
  )
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (!values.company.trim()) nextErrors.company = 'Company is required.'
    if (!values.role.trim()) nextErrors.role = 'Role is required.'
    if (values.jobLink.trim()) {
      try {
        const parsedUrl = new URL(values.jobLink.trim())
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
          nextErrors.jobLink = 'Enter a valid URL starting with http:// or https://.'
        }
      } catch {
        nextErrors.jobLink = 'Enter a valid URL starting with http:// or https://.'
      }
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    onSave({
      ...application,
      ...values,
      company: values.company.trim(),
      role: values.role.trim(),
      jobLink: values.jobLink.trim(),
      notes: values.notes.trim(),
    })
  }

  return (
    <div
      aria-labelledby="application-form-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/40 p-4"
      role="dialog"
    >
      <section className="my-auto w-full max-w-lg rounded-xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900" id="application-form-title">
            {application ? 'Edit application' : 'Add application'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">Keep your job search details in one place.</p>
        </div>
        <form className="space-y-4" noValidate onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field error={errors.company} id="company" label="Company">
              <input className={inputClass(errors.company)} id="company" name="company" onChange={handleChange} value={values.company} />
            </Field>
            <Field error={errors.role} id="role" label="Role">
              <input className={inputClass(errors.role)} id="role" name="role" onChange={handleChange} value={values.role} />
            </Field>
          </div>
          <Field error={errors.jobLink} id="jobLink" label="Job link (optional)">
            <input className={inputClass(errors.jobLink)} id="jobLink" name="jobLink" onChange={handleChange} placeholder="https://example.com/job" type="url" value={values.jobLink} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="status" label="Status">
              <select className={inputClass()} id="status" name="status" onChange={handleChange} value={values.status}>
                {STATUSES.map(({ name }) => <option key={name} value={name}>{name}</option>)}
              </select>
            </Field>
            <Field id="dateApplied" label="Date applied">
              <input className={inputClass()} id="dateApplied" name="dateApplied" onChange={handleChange} type="date" value={values.dateApplied} />
            </Field>
          </div>
          <Field id="notes" label="Notes (optional)">
            <textarea className={inputClass()} id="notes" name="notes" onChange={handleChange} rows="3" value={values.notes} />
          </Field>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={onClose} type="button">
              Cancel
            </button>
            <button className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2" type="submit">
              {application ? 'Save changes' : 'Add application'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function Field({ children, error, id, label }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor={id}>{label}</label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

function inputClass(error) {
  return `w-full rounded-lg border ${error ? 'border-red-400' : 'border-gray-300'} bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100`
}

export default ApplicationForm
