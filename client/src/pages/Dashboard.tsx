import { Link } from 'react-router-dom'
import { Film, Plus, History, Settings, CreditCard, TrendingUp, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  const stats = [
    { name: 'Total Videos', value: '12', icon: Film, color: 'bg-violet-500' },
    { name: 'Credits Remaining', value: String(user?.credits || 0), icon: CreditCard, color: 'bg-indigo-500' },
    { name: 'This Month', value: '8', icon: TrendingUp, color: 'bg-fuchsia-500' },
  ]

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-grid min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-300">Ready to create amazing talking videos?</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link to="/generate" className="p-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl text-white hover:scale-105 transition-transform">
                  <Plus className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold">Create New Video</h3>
                </Link>
                <Link to="/history" className="p-6 bg-gradient-to-br from-fuchsia-600 to-purple-600 rounded-xl text-white hover:scale-105 transition-transform">
                  <History className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold">View History</h3>
                </Link>
                <Link to="/profile" className="p-6 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl text-white hover:scale-105 transition-transform">
                  <Settings className="w-8 h-8 mb-3" />
                  <h3 className="font-semibold">Settings</h3>
                </Link>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
          >
            <h3 className="text-xl font-bold mb-3">Upgrade to Pro</h3>
            <p className="text-violet-100 mb-4">Get more credits and unlock premium features</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2"><ArrowUpRight className="w-4 h-4" /> 100 Credits/Month</li>
              <li className="flex items-center gap-2"><ArrowUpRight className="w-4 h-4" /> HD Quality Videos</li>
              <li className="flex items-center gap-2"><ArrowUpRight className="w-4 h-4" /> All Voices Available</li>
            </ul>
            <button className="w-full bg-white/10 backdrop-blur border border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-colors">
              Upgrade Now
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
