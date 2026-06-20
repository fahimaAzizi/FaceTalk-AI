import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image, Trash2, Mic, Loader2, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import api from '../utils/api'

type Step = 'upload' | 'audio' | 'generate' | 'status'

const GenerateVideo = () => {
  const { user, updateCredits, isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState<Step>('upload')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('male-1')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [videoStatus, setVideoStatus] = useState<any>(null)
  const [provider, setProvider] = useState('did')

  useEffect(() => {
    if (videoStatus?.status === 'completed') {
      toast.success('Video generated successfully!')
    }
  }, [videoStatus?.status])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
      toast.error('Please upload JPG or PNG only')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    toast.loading('Uploading image...', { id: 'upload' })

    try {
      const formData = new FormData()
      formData.append('image', file)
      const response = await api.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setImageUrl(response.data.imageUrl)
      toast.success('Image uploaded!', { id: 'upload' })
      setCurrentStep('audio')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed', { id: 'upload' })
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/jpeg': [], 'image/png': [], 'image/jpg': [] }, maxFiles: 1 })

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageUrl(null)
  }

  const generateAudio = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text')
      return
    }
    toast.loading('Generating audio...', { id: 'audio' })
    try {
      const response = await api.post('/audio/generate', { text, voice: selectedVoice })
      setAudioUrl(response.data.audioUrl)
      toast.success('Audio generated!', { id: 'audio' })
      setCurrentStep('generate')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Audio generation failed', { id: 'audio' })
    }
  }

  const startGeneration = async () => {
    if (!imageUrl || !audioUrl) {
      toast.error('Please complete all previous steps')
      return
    }
    setIsGenerating(true)
    toast.loading('Starting video generation...', { id: 'generate' })

    try {
      const response = await api.post('/video/generate', {
        imageUrl,
        audioUrl,
        text,
        provider,
        voice: selectedVoice,
      })
      setVideoId(response.data.videoId)
      toast.success('Video generation started!', { id: 'generate' })
      setCurrentStep('status')
      pollStatus(response.data.videoId)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Generation failed', { id: 'generate' })
      setIsGenerating(false)
    }
  }

  const pollStatus = async (id: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/video/status/${id}`)
        setVideoStatus(response.data)
        if (response.data.status === 'completed') {
          clearInterval(interval)
          setIsGenerating(false)
          toast.success('Video generated successfully!')
        } else if (response.data.status === 'failed') {
          clearInterval(interval)
          setIsGenerating(false)
          toast.error(response.data.error || 'Video generation failed')
        }
      } catch (error) {
        clearInterval(interval)
        setIsGenerating(false)
      }
    }, 3000)
  }

  const statusIcon: Record<string, React.ReactNode> = {
    uploading: <Upload className="w-5 h-5" />,
    processing: <Loader2 className="w-5 h-5 animate-spin" />,
    generating: <Loader2 className="w-5 h-5 animate-spin" />,
    completed: <CheckCircle className="w-5 h-5 text-green-500" />,
    failed: <XCircle className="w-5 h-5 text-red-500" />,
  }

  if (!isAuthenticated) return <Navigate to="/login" />

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create Talking Video</h1>
          <p className="text-gray-300">Upload a photo, add text, and generate your AI video</p>
        </motion.div>

        <div className="flex items-center justify-between mb-8">
          {[
            { step: 'upload', label: 'Upload Photo' },
            { step: 'audio', label: 'Add Text' },
            { step: 'generate', label: 'Generate' },
            { step: 'status', label: 'Status' },
          ].map((s, i) => (
            <div key={s.step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                ['upload', 'audio', 'generate', 'status'].indexOf(currentStep) >= i
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/10 text-gray-400'
              }`}>
                {i + 1}
              </div>
              <span className={`hidden sm:block text-sm ${['upload', 'audio', 'generate', 'status'].indexOf(currentStep) >= i ? 'text-violet-400' : 'text-gray-400'}`}>
                {s.label}
              </span>
              {i < 3 && <div className={`w-8 sm:w-12 h-1 ${['upload', 'audio', 'generate', 'status'].indexOf(currentStep) > i ? 'bg-violet-600' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        {currentStep === 'upload' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 hover:border-violet-500'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">Drag & drop your photo here, or click to browse</p>
              <p className="text-sm text-gray-400">Supports JPG, PNG (Max 10MB)</p>
            </div>

            {imagePreview && (
              <div className="mt-6 relative inline-block">
                <img src={imagePreview} alt="Preview" className="max-h-64 rounded-xl" />
                <button onClick={removeImage} className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <button onClick={() => imageUrl && setCurrentStep('audio')} disabled={!imageUrl} className="btn-primary w-full mt-6 disabled:opacity-50">
              Continue to Add Text
            </button>
          </motion.div>
        )}

        {currentStep === 'audio' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <h2 className="text-2xl font-bold text-white mb-6">Add Text for Speech</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">What should the photo say?</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input-field h-32 resize-none"
                placeholder="Enter text here..."
                maxLength={500}
              />
              <p className="text-right text-sm text-gray-400 mt-1">{text.length}/500</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Voice</label>
              <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="input-field">
                <option value="male-1">James (Male, American)</option>
                <option value="male-2">Michael (Male, American)</option>
                <option value="female-1">Sarah (Female, American)</option>
                <option value="female-2">Emma (Female, British)</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setCurrentStep('upload')} className="btn-secondary flex-1">Back</button>
              <button onClick={generateAudio} className="btn-primary flex-1">Generate Audio</button>
            </div>
          </motion.div>
        )}

        {currentStep === 'generate' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <h2 className="text-2xl font-bold text-white mb-6">Generate Video</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Provider</label>
              <select value={provider} onChange={(e) => setProvider(e.target.value)} className="input-field">
                <option value="did">D-ID</option>
                <option value="heygen">HeyGen</option>
                <option value="runway">Runway (Coming Soon)</option>
              </select>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Image className="w-5 h-5 text-violet-400" />
                <span className="text-sm font-medium text-gray-200">Photo uploaded</span>
              </div>
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-violet-400" />
                <span className="text-sm font-medium text-gray-200">Audio ready ({text.slice(0, 50)}...)</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl mb-6">
              <div>
                <p className="font-semibold text-white">Credits Required</p>
                <p className="text-sm text-gray-300">1 credit per video</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-violet-400">{user?.credits || 0}</p>
                <p className="text-sm text-gray-400">Available</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setCurrentStep('audio')} className="btn-secondary flex-1">Back</button>
              <button onClick={startGeneration} disabled={isGenerating || !audioUrl} className="btn-primary flex-1 disabled:opacity-50">
                {isGenerating ? 'Generating...' : 'Generate Video'}
              </button>
            </div>
          </motion.div>
        )}

        {currentStep === 'status' && videoStatus && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <h2 className="text-2xl font-bold text-white mb-6">Video Status</h2>

            <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
              {statusIcon[videoStatus.status as keyof typeof statusIcon] || <Loader2 className="w-5 h-5 animate-spin" />}
              <div className="flex-grow">
                <p className="font-semibold text-white capitalize">{videoStatus.status}</p>
                <p className="text-sm text-gray-300">
                  {videoStatus.status === 'completed' ? 'Your video is ready!' : videoStatus.status === 'failed' ? videoStatus.error : 'Processing...'}
                </p>
              </div>
              <span className="text-sm font-medium text-gray-400">{videoStatus.progress || 0}%</span>
            </div>

            {(videoStatus.status === 'processing' || videoStatus.status === 'generating') && (
              <div className="w-full bg-white/10 rounded-full h-2 mb-6">
                <div className="bg-violet-600 h-2 rounded-full transition-all" style={{ width: `${videoStatus.progress || 0}%` }} />
              </div>
            )}

            {videoStatus.status === 'completed' && videoStatus.videoUrl && (
              <div className="mb-6">
                <video src={videoStatus.videoUrl} controls className="w-full rounded-xl" />
                <div className="flex gap-4 mt-4">
                  <a href={videoStatus.videoUrl} download className="btn-primary flex-1 text-center">Download Video</a>
                  <button onClick={() => { setCurrentStep('upload'); setVideoId(null); setVideoStatus(null); setImageFile(null); setImagePreview(null); setImageUrl(null); setAudioUrl(null); setText(''); }} className="btn-secondary flex-1">
                    Create New
                  </button>
                </div>
              </div>
            )}

            {videoStatus.status === 'failed' && (
              <button onClick={() => { setCurrentStep('generate'); setVideoId(null); setVideoStatus(null); }} className="btn-secondary w-full">
                Try Again
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default GenerateVideo
