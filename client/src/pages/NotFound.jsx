import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">Page not found</h1>
      <Link className="mt-4 inline-block text-indigo-600 hover:text-indigo-700" to="/">
        Return to Trackr
      </Link>
    </main>
  )
}

export default NotFound
