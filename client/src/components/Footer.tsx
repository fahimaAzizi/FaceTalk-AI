import { Film, Twitter, Github, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">AliveFrame AI</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Transform any photo into a realistic talking video using advanced AI technology. Perfect for marketing, education, and entertainment.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/generate" className="hover:text-white transition-colors">Generate Video</a></li>
              <li><a href="/history" className="hover:text-white transition-colors">History</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">2024 AliveFrame AI. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
