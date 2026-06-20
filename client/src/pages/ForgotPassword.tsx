import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSent(true)
    toast.success('Password reset link sent!')
    setIsLoading(false)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card max-w-md w-full text-center">
          <Mail className="w-16 h-16 text-violet-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-gray-300 mb-6">We sent a password reset link to {email}</p>
          <Link to="/login" className="btn-primary inline-block">Back to Login</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-gray-300">Enter your email and we'll send you a reset link</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-5">
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
                required
              />
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="btn-primary w-full disabled:opacity-50">
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-300">
          Remember your password? <Link to="/login" className="text-violet-400 hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
