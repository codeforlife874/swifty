import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, User, ArrowRight, Package } from 'lucide-react'
import { apiFetch } from '../api'

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    
    try {
      const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        setError(data.error || 'Authentication failed')
        return
      }
      
      // Pass the user info up to App.jsx
      onLogin({ username: data.username, role: data.role })
      
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card max-w-md w-full p-8 border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-logistics-accent to-blue-500"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-sm flex items-center justify-center mb-4 border border-white/10">
            {isLogin ? <Lock className="w-8 h-8 text-logistics-accent" /> : <User className="w-8 h-8 text-logistics-express" />}
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-400 mt-2 text-center text-sm">
            {isLogin ? 'Enter your credentials to access your portal' : 'Register to start placing orders and tracking logistics'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-sm text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-sm px-4 py-3 text-white outline-none focus:border-logistics-accent transition-colors"
              placeholder="e.g. admin or john_doe"
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-sm px-4 py-3 text-white outline-none focus:border-logistics-accent transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 rounded-sm font-bold flex justify-center items-center gap-2 transition-all mt-4
              ${isLogin ? 'bg-logistics-accent text-logistics-dark hover:bg-logistics-accent/90' : 'bg-logistics-express text-white hover:bg-logistics-express/90'}
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
            {!loading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-white hover:text-logistics-accent transition-colors font-semibold"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
