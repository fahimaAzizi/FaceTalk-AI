import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('All fields are required')
      return
    }

    setIsLoading(true)
    try {
      await login(email, password)
      toast.success('Login successful!')
      window.location.href = '/dashboard'
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to continue creating</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {error && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field !pl-10"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field !pl-10 !pr-10"
                placeholder="Enter your password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-violet-400 hover:underline">Forgot password?</Link>
          </div>

          <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-50">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          Don't have an account? <Link to="/register" className="text-violet-400 hover:underline font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Login
