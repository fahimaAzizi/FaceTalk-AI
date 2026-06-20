import { useEffect, useState } from 'react'
import { Users, Film, TrendingUp, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../utils/api'

interface User {
  _id: string
  name: string
  email: string
  credits: number
  subscription: string
  createdAt: string
}

interface Analytics {
  totalUsers: number
  totalVideos: number
  completedVideos: number
  failedVideos: number
  totalCreditsUsed: number
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'videos'>('overview')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, usersRes, videosRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/admin/users'),
          api.get('/admin/videos'),
        ])
        setAnalytics(analyticsRes.data)
        setUsers(usersRes.data.users)
        setVideos(videosRes.data.videos)
      } catch (error: any) {
        console.error('Failed to load admin data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const deleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(users.filter((u) => u._id !== id))
      toast.success('User deleted')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  if (isLoading) {
    return (
      <div className="pt-24 pb-12 px-4 flex justify-center">
        <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Monitor and manage your application</p>
        </motion.div>

        {activeTab === 'overview' && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { name: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'bg-violet-500' },
              { name: 'Total Videos', value: analytics.totalVideos, icon: Film, color: 'bg-indigo-500' },
              { name: 'Completed', value: analytics.completedVideos, icon: TrendingUp, color: 'bg-green-500' },
              { name: 'Credits Used', value: analytics.totalCreditsUsed, icon: TrendingUp, color: 'bg-fuchsia-500' },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.name}</p>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <div className="flex gap-4 mb-6">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'users', label: 'Users' },
            { key: 'videos', label: 'Videos' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'users' && (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300">Name</th>
                  <th className="text-left py-3 px-4 text-gray-300">Email</th>
                  <th className="text-left py-3 px-4 text-gray-300">Credits</th>
                  <th className="text-left py-3 px-4 text-gray-300">Plan</th>
                  <th className="text-left py-3 px-4 text-gray-300">Joined</th>
                  <th className="text-right py-3 px-4 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-white/5">
                    <td className="py-3 px-4 text-white font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-gray-300">{user.email}</td>
                    <td className="py-3 px-4 text-white">{user.credits}</td>
                    <td className="py-3 px-4 text-gray-300 capitalize">{user.subscription}</td>
                    <td className="py-3 px-4 text-gray-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300">Title</th>
                  <th className="text-left py-3 px-4 text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300">Provider</th>
                  <th className="text-left py-3 px-4 text-gray-300">Created</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video._id} className="border-b border-white/5">
                    <td className="py-3 px-4 text-white font-medium">{video.title}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        video.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {video.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 capitalize">{video.provider}</td>
                    <td className="py-3 px-4 text-gray-300">{new Date(video.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
