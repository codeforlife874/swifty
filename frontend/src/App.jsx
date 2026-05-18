import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import AdminPanel from './components/AdminPanel'
import CustomerPanel from './components/CustomerPanel'
import AuthPage from './components/AuthPage'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)

  // On mount, check if there's a stored session
  useEffect(() => {
    const storedUser = localStorage.getItem('swiftship_user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem('swiftship_user', JSON.stringify(userData))
    setShowAuth(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('swiftship_user')
  }

  return (
    <div className="min-h-screen text-logistics-text">
      {/* Navigation */}
      {(currentUser || showAuth) && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-logistics-dark/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center">
          <div 
            className="text-xl font-bold glow-text flex items-center gap-2 cursor-pointer" 
            onClick={() => { if(!currentUser) setShowAuth(false) }}
          >
            <span className="text-logistics-accent">Swift</span>Ship
          </div>
          
          <div className="flex gap-4 items-center">
            {currentUser && (
              <>
                <span className="px-4 py-2 rounded-md bg-white/5 text-gray-300 font-semibold border border-white/10 uppercase tracking-wider text-xs">
                  {currentUser.role === 'admin' ? 'Admin Control Center' : 'Customer Portal'}
                </span>
                <div className="h-4 w-px bg-white/20 mx-2"></div>
                <div className="text-sm">
                  <span className="text-gray-500">Logged in as </span>
                  <span className="font-bold text-white">{currentUser.username}</span>
                </div>
                <button 
                  className="text-gray-400 hover:text-white transition-colors text-sm underline ml-2"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
            {showAuth && !currentUser && (
              <button 
                className="text-gray-400 hover:text-white transition-colors text-sm underline"
                onClick={() => setShowAuth(false)}
              >
                Back to Home
              </button>
            )}
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={(currentUser || showAuth) ? 'pt-24 pb-12 px-6 max-w-7xl mx-auto' : ''}>
        {!currentUser && !showAuth && <LandingPage onStart={() => setShowAuth(true)} />}
        {!currentUser && showAuth && <AuthPage onLogin={handleLogin} />}
        
        {currentUser?.role === 'customer' && <CustomerPanel currentUser={currentUser} />}
        {currentUser?.role === 'admin' && <AdminPanel currentUser={currentUser} />}
      </main>
    </div>
  )
}

export default App
