import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Film, Trash2, Download, Search, Play, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import api from '../utils/api'

interface Video {
  _id: string
  title: string
  status: string
  videoUrl?: string
  progress: number
  createdAt: string
}

const VideoHistory = () => {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchVideos = async () => {
    try {
      const response = await api.get(`/history?page=${page}&limit=10`)
      setVideos(response.data.videos)
      setTotalPages(response.data.pagination.totalPages)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load videos')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [page])

  const deleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return
    try {
      await api.delete(`/history/${id}`)
      setVideos(videos.filter((v) => v._id !== id))
      toast.success('Video deleted')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Delete failed')
    }
  }

  const downloadVideo = async (id: string) => {
    try {
      const response = await api.get(`/history/${id}/download`)
      window.open(response.data.downloadUrl, '_blank')
      toast.success('Download started')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Download failed')
    }
  }

  const filteredVideos = videos.filter((v) => v.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const statusColors: Record<string, string> = {
    uploading: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    processing: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    generating: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    completed: 'bg-green-500/10 text-green-400 border border-green-500/20',
    failed: 'bg-red-500/10 text-red-400 border border-red-500/20',
  }

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Video History</h1>
          <p className="text-gray-300">Manage your created videos</p>
        </motion.div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field !pl-10"
              placeholder="Search videos..."
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="card text-center py-20">
            <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No videos yet</h3>
            <p className="text-gray-300 mb-6">Create your first AI talking video</p>
            <Link to="/generate" className="btn-primary inline-block">Create Video</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card hover:scale-105"
              >
                <div className="aspect-video bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                  {video.videoUrl ? (
                    <video src={video.videoUrl} className="w-full h-full object-cover" />
                  ) : (
                    <Film className="w-12 h-12 text-white/80" />
                  )}
                  <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[video.status]}`}>
                    {video.status}
                  </span>
                </div>
                <h3 className="font-bold text-white mb-1 truncate">{video.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(video.createdAt).toLocaleDateString()}
                </div>
                {(video.status === 'processing' || video.status === 'generating') && (
                  <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                    <div className="bg-violet-600 h-2 rounded-full" style={{ width: `${video.progress}%` }} />
                  </div>
                )}
                <div className="flex gap-2">
                  {video.videoUrl && (
                    <>
                      <button onClick={() => downloadVideo(video._id)} className="flex-1 btn-secondary !py-2 text-sm flex items-center justify-center gap-1">
                        <Download className="w-4 h-4" /> Download
                      </button>
                      <button onClick={() => window.open(video.videoUrl, '_blank')} className="btn-primary !py-2 !px-3">
                        <Play className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button onClick={() => deleteVideo(video._id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 disabled:opacity-50">
              Previous
            </button>
            <span className="px-4 py-2 text-gray-300">Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 disabled:opacity-50">
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoHistory
