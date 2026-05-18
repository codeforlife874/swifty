import { useState } from 'react'
import LandingPage from './components/LandingPage'
import AdminPanel from './components/AdminPanel'
import CustomerPanel from './components/CustomerPanel'

function App() {
  const [currentPortal, setCurrentPortal] = useState(null) // 'customer' or 'admin'

  return (
    <div className="min-h-screen text-logistics-text">
      {/* Navigation */}
      {currentPortal && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-logistics-dark/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold glow-text flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPortal(null)}>
            <span className="text-logistics-accent">Swift</span>Ship
          </div>
          <div className="flex gap-4">
            <span className="px-4 py-2 rounded-md bg-white/5 text-gray-300 font-semibold border border-white/10 uppercase tracking-wider text-xs">
              {currentPortal === 'admin' ? 'Admin Control Center' : 'Customer Portal'}
            </span>
            <button 
              className="text-gray-400 hover:text-white transition-colors text-sm underline"
              onClick={() => setCurrentPortal(null)}
            >
              Switch Portal
            </button>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={currentPortal ? 'pt-24 pb-12 px-6 max-w-7xl mx-auto' : ''}>
        {!currentPortal && <LandingPage onSelectPortal={setCurrentPortal} />}
        {currentPortal === 'customer' && <CustomerPanel />}
        {currentPortal === 'admin' && <AdminPanel />}
      </main>
    </div>
  )
}

export default App
