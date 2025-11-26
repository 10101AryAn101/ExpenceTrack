import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import TransactionHistory from './TransactionHistory'

const AppShell = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar onOpenMenu={() => setMobileNavOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex md:flex-shrink-0">
          <Sidebar />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
            <main className="flex-1 overflow-y-auto p-4 py-6 md:p-6 lg:p-8">
              <Outlet />
            </main>
            <aside className="hidden w-full max-w-sm flex-none overflow-y-auto border-l border-slate-200 bg-white px-6 py-8 shadow-inner lg:flex">
              <TransactionHistory />
            </aside>
          </div>
        </div>
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setMobileNavOpen(false)} />
          <div className="relative flex w-64 flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between px-4 py-4">
              <span className="text-lg font-semibold">Menu</span>
              <button
                type="button"
                aria-label="Close menu"
                className="text-slate-600"
                onClick={() => setMobileNavOpen(false)}
              >
                ✕
              </button>
            </div>
            <Sidebar onItemClick={() => setMobileNavOpen(false)} className="px-0" />
          </div>
        </div>
      )}
    </div>
  )
}

export default AppShell
