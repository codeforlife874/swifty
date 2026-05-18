import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, SkipForward, RotateCcw, ArrowRight, RefreshCw } from 'lucide-react'

export default function MergeSortVisualization({ orders, setSortedOrders, onNext }) {
  const [frames, setFrames] = useState([])
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(50) // ms per frame
  const [loading, setLoading] = useState(false)
  
  const timerRef = useRef(null)

  useEffect(() => {
    fetchMergeSortData()
  }, [])

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setTimeout(() => {
        if (currentFrameIndex < frames.length - 1) {
          setCurrentFrameIndex(prev => prev + 1)
        } else {
          setIsPlaying(false)
          if (frames.length > 0) {
            setSortedOrders(frames[frames.length - 1].array)
          }
        }
      }, speed)
    }
    return () => clearTimeout(timerRef.current)
  }, [isPlaying, currentFrameIndex, frames.length, speed, setSortedOrders])

  const fetchMergeSortData = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/merge-sort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
      })
      const data = await response.json()
      setFrames(data.frames)
      setCurrentFrameIndex(0)
    } catch (error) {
      console.error("Error fetching merge sort:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayPause = () => setIsPlaying(!isPlaying)
  const handleReset = () => {
    setIsPlaying(false)
    setCurrentFrameIndex(0)
  }
  const handleSkipToEnd = () => {
    setIsPlaying(false)
    setCurrentFrameIndex(frames.length - 1)
    setSortedOrders(frames[frames.length - 1].array)
  }

  const currentFrame = frames[currentFrameIndex] || { array: orders, type: 'start' }
  const isComplete = currentFrameIndex === frames.length - 1 && frames.length > 0

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Merge Sort Visualization</h2>
          <p className="text-gray-400">Sorting based on: 1. Express Priority, 2. Packing Time, 3. Arrival Time.</p>
        </div>
        <div className="flex gap-3 items-center bg-white/5 p-2 rounded-xl border border-white/10">
          <button onClick={handleReset} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button onClick={handlePlayPause} className="p-2 bg-logistics-accent/20 text-logistics-accent hover:bg-logistics-accent/30 rounded-lg transition-colors border border-logistics-accent/30">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={handleSkipToEnd} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-300">
            <SkipForward className="w-5 h-5" />
          </button>
          
          <div className="h-8 w-px bg-white/10 mx-2"></div>
          
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs text-gray-400">Speed</span>
            <input 
              type="range" 
              min="10" 
              max="500" 
              value={510 - speed} 
              onChange={(e) => setSpeed(510 - e.target.value)}
              className="w-24 accent-logistics-accent"
            />
          </div>

          <button 
            onClick={onNext} 
            disabled={!isComplete}
            className={`btn-primary ml-4 flex items-center gap-2 ${!isComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card min-h-[500px] flex flex-col justify-end p-8 relative overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center text-logistics-accent">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="flex items-end justify-center gap-1 h-full w-full">
              {currentFrame.array.map((order, idx) => {
                let stateClass = "bg-white/10"
                if (order.priority_score === 1) stateClass = "bg-red-400"
                else if (order.priority_score === 2) stateClass = "bg-orange-400"
                else if (order.priority_score === 3) stateClass = "bg-blue-400"
                else if (order.priority_score === 4) stateClass = "bg-gray-400"
                
                // Highlight based on action
                if (currentFrame.type === 'compare' && currentFrame.indices?.includes(idx)) {
                  stateClass = "bg-yellow-400 glow-text"
                } else if (currentFrame.type === 'overwrite' && currentFrame.index === idx) {
                  stateClass = "bg-green-400 glow-text"
                }

                // Height heuristic: mainly based on packing time for visual variation
                const height = Math.max(10, Math.min(100, (order.packing_time / 15) * 100))

                return (
                  <motion.div
                    key={order.order_id}
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`rounded-t-sm w-full max-w-[20px] ${stateClass} relative group`}
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-10 bg-black/80 text-xs p-2 rounded whitespace-nowrap">
                      ID: {order.order_id}<br/>
                      Type: {order.type}<br/>
                      Pack: {order.packing_time}s<br/>
                      Arr: t={order.arrival_time}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-white/10 pb-2">Status</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current Action</p>
                <p className="text-sm font-medium text-logistics-accent capitalize bg-logistics-accent/10 py-1 px-3 rounded inline-block">
                  {currentFrame.type.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Progress</p>
                <div className="w-full bg-white/10 rounded-full h-2 mb-1">
                  <div 
                    className="bg-logistics-accent h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(currentFrameIndex / Math.max(1, frames.length - 1)) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right text-gray-400">{currentFrameIndex} / {frames.length - 1} Steps</p>
              </div>
            </div>
          </div>

          <div className="glass-card flex-1">
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-white/10 pb-2">Algorithm Insights</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <p><strong className="text-white">Time Complexity:</strong> <span className="font-mono text-logistics-accent bg-logistics-accent/10 px-1 rounded">O(n log n)</span></p>
              <p><strong className="text-white">Space Complexity:</strong> <span className="font-mono text-logistics-standard bg-logistics-standard/10 px-1 rounded">O(n)</span></p>
              <p className="mt-4 text-xs leading-relaxed">
                Merge sort works by recursively dividing the array of orders into two halves until each sub-array contains a single element. Then, it merges these sub-arrays back together in the correct sorted order, ensuring high-priority express packages are handled first.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
