const FormShell = ({ title, description, status, children, className = '', maxWidthClass = 'max-w-md' }) => (
  <div className={`mx-auto w-full ${maxWidthClass} space-y-4 rounded-3xl bg-white px-6 py-10 shadow-xl ${className}`}>
    <div className="space-y-1">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
    {status && <p className="text-sm text-emerald-500">{status}</p>}
    <div className="space-y-4">{children}</div>
  </div>
)

export default FormShell
