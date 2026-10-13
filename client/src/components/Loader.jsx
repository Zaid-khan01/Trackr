function Loader({ label = 'Loading...' }) {
  return (
    <span aria-live="polite" className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      />
      {label}
    </span>
  )
}

export default Loader
