import { Link } from 'react-router-dom'
import { Sparkles, Zap, Globe, Shield, BarChart, Film, ArrowRight, Play } from 'lucide-react'
import { motion } from 'framer-motion'

const Landing = () => {
  const features = [
    { icon: Sparkles, title: 'AI-Powered', description: 'Advanced AI creates realistic talking videos from any photo' },
    { icon: Zap, title: 'Lightning Fast', description: 'Generate high-quality videos in minutes, not hours' },
    { icon: Globe, title: 'Multiple Languages', description: 'Support for 30+ languages and accents worldwide' },
    { icon: Shield, title: 'Secure & Private', description: 'Your data is encrypted and never shared with third parties' },
    { icon: BarChart, title: 'Credit System', description: 'Flexible pricing with pay-per-video credits' },
    { icon: Film, title: 'High Quality', description: '1080p HD videos with natural lip-sync animations' },
  ]

  const pricing = [
    { name: 'Free', price: '$0', credits: 10, features: ['10 Free Credits', 'Standard Quality', 'Basic Voices', 'Watermark'] },
    { name: 'Pro', price: '$29', credits: 100, features: ['100 Credits/Month', 'HD Quality', 'All Voices', 'No Watermark', 'Priority Support'], popular: true },
    { name: 'Enterprise', price: '$99', credits: 500, features: ['500 Credits/Month', '4K Quality', 'Custom Voices', 'API Access', 'Dedicated Support'] },
  ]

  return (
    <div className="overflow-hidden">
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-violet-600/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-medium text-violet-300">AI-Powered Video Generation</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">Bring Photos to Life</span>
              <br />
              <span className="text-white">with AI Talking Videos</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
              Transform any static photo into a realistic talking video. Perfect for marketing, education, entertainment, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg flex items-center justify-center gap-2">
                Start Creating Free <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="btn-secondary text-lg flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Watch Demo
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div className="aspect-video bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Film className="w-20 h-20 mx-auto mb-4 opacity-80" />
                  <p className="text-2xl font-bold">Your Talking Video Preview</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Powerful Features</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">Everything you need to create stunning AI talking videos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card hover:scale-105"
                >
                  <Icon className="w-12 h-12 text-violet-400 mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Simple, Transparent Pricing</h2>
            <p className="text-gray-300">Choose the perfect plan for your needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`card relative ${plan.popular ? 'border-2 border-violet-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <div className="my-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <p className="text-violet-400 font-semibold mb-6">{plan.credits} Credits</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-violet-500 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                    plan.popular ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Get Started
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing
