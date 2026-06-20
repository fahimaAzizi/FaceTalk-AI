import { useState } from 'react'
import { Camera, Mail, User as UserIcon, CreditCard, Shield, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user, logout } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Profile updated!')
    setIsUpdating(false)
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-300">Manage your account settings and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card text-center"
          >
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold glow">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-violet-600 text-white rounded-full">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-300 mb-4">{user?.email}</p>
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-full">
              <CreditCard className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-violet-400">{user?.credits} Credits</span>
            </div>
            <p className="text-sm text-gray-400 mt-2 capitalize">{user?.subscription} Plan</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field !pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field !pl-10"
                      disabled
                    />
                  </div>
                </div>
                <button type="submit" disabled={isUpdating} className="btn-primary disabled:opacity-50">
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-white mb-6">Security</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-violet-400" />
                    <span className="text-white">Change Password</span>
                  </div>
                  <button className="btn-secondary !py-2 !px-4 text-sm">Update</button>
                </div>
              </div>
            </div>

            <button onClick={logout} className="w-full flex items-center justify-center gap-2 p-4 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-500/20">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Profile
