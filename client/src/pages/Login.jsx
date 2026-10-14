import { LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Login() {
  const { isAuthenticated, login, loading, error, clearError } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  if (isAuthenticated) {
    return <Navigate replace to="/" />
  }

  function validate() {
    const nextErrors = {}
    if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!values.password) {
      nextErrors.password = 'Password is required.'
    }
    return nextErrors
  }

  function updateField(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    clearError()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const user = await login({
      email: values.email.trim(),
      password: values.password,
    })
    if (user) {
      navigate('/')
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold text-indigo-600">Trackr</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to keep your job search on track.
          </p>
        </div>

        <form className="space-y-5" noValidate onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="email">
              Email address
            </label>
            <div className="relative">
              <Mail aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                id="email"
                name="email"
                onChange={updateField}
                type="email"
                value={values.email}
              />
            </div>
            {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                id="password"
                name="password"
                onChange={updateField}
                type="password"
                value={values.password}
              />
            </div>
            {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
          </div>

          {error && (
            <p aria-live="polite" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
            type="submit"
          >
            {loading ? <Loader label="Signing in..." /> : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New to Trackr?{' '}
          <Link className="font-semibold text-indigo-600 hover:text-indigo-700" to="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  )
}

export default Login
