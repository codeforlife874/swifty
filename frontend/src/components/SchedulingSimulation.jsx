import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Server, Activity, ArrowRight, CheckCircle2 } from 'lucide-react'
import { apiFetch } from '../api'

export default function SchedulingSimulation({ orders, onNext }) {
  const [activeAlgorithm, setActiveAlgorithm] = useState('FCFS')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    fetchSchedulingData(activeAlgorithm)
  }, [activeAlgorithm])

  useEffect(() => {
    let interval
    if (isPlaying && results) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= results.total_time) {
            setIsPlaying(false)
            return results.total_time
          }
          return prev + 1
        })
      }, 100) // 100ms per simulation time unit
    }
    return () => clearInterval(interval)
  }, [isPlaying, results])

  const fetchSchedulingData = async (algo) => {
    setLoading(true)
    setIsPlaying(false)
    setCurrentTime(0)
    setResults(null)
    try {
      const endpoint = algo.toLowerCase()
      const response = await apiFetch(`/api/schedule/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error fetching scheduling data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActiveTask = (ganttList, t) => {
    return ganttList.find(task => t >= task.start_time && t < task.end_time)
  }

  const getCompletedTasks = (ganttList, t) => {
    return ganttList.filter(task => task.end_time <= t)
  }

  const getWaitingTasks = (ganttList, t) => {
    return ganttList.filter(task => {
      const order = orders.find(o => o.order_id === task.order_id)
      return order && order.arrival_time <= t && t < task.start_time
    })
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">CPU Scheduling Simulation</h2>
          <p className="text-gray-400">Model warehouse packing stations processing sorted orders.</p>
        </div>
        
        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
          {['FCFS', 'SJF', 'Hybrid'].map(algo => (
            <button
              key={algo}
              onClick={() => setActiveAlgorithm(algo)}
              className={`px-4 py-2 rounded-md transition-all font-medium text-sm ${
                activeAlgorithm === algo 
                  ? 'bg-logistics-accent text-logistics-dark shadow-[0_0_15px_rgba(0,229,255,0.3)]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {algo}
            </button>
          ))}
        </div>
        
        <button 
          onClick={onNext} 
          className="btn-primary flex items-center gap-2"
        >
          View Analytics <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card min-h-[500px] flex flex-col p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={!results || currentTime >= results.total_time}
                className="btn-secondary py-2"
              >
                {isPlaying ? 'Pause' : currentTime === 0 ? 'Start Simulation' : 'Resume'}
              </button>
              <button 
                onClick={() => { setIsPlaying(false); setCurrentTime(0); }}
                className="px-4 py-2 rounded border border-white/10 text-gray-300 hover:bg-white/10 transition-colors"
              >
                Reset
              </button>
            </div>
            <div className="font-mono text-2xl text-logistics-accent glow-text">
              T = {currentTime}s
            </div>
          </div>

          {loading || !results ? (
            <div className="flex-1 flex items-center justify-center">
              <Activity className="w-8 h-8 animate-pulse text-logistics-accent" />
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-8 relative overflow-hidden">
              {/* CPU Station rendering logic */}
              {activeAlgorithm !== 'Hybrid' ? (
                <PackingStation 
                  name="Main Packing Station" 
                  gantt={results.gantt} 
                  currentTime={currentTime} 
                  orders={orders}
                />
              ) : (
                <>
                  <PackingStation 
                    name="Express Queue (SJF)" 
                    gantt={results.express_gantt} 
                    currentTime={currentTime} 
                    orders={orders}
                    colorClass="text-logistics-express border-logistics-express"
                  />
                  <div className="h-px w-full bg-white/5 my-2"></div>
                  <PackingStation 
                    name="Standard Queue (FCFS)" 
                    gantt={results.standard_gantt} 
                    currentTime={currentTime} 
                    orders={orders}
                    colorClass="text-logistics-standard border-logistics-standard"
                  />
                </>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-4 text-white border-b border-white/10 pb-2">Algorithm Definition</h3>
            {activeAlgorithm === 'FCFS' && (
              <p className="text-sm text-gray-300 leading-relaxed">
                <strong className="text-white block mb-1">First Come First Serve</strong>
                Processes orders strictly in the order they arrive. Simple and fair, but can cause the "convoy effect" where short express orders get stuck behind long standard ones.
              </p>
            )}
            {activeAlgorithm === 'SJF' && (
              <p className="text-sm text-gray-300 leading-relaxed">
                <strong className="text-white block mb-1">Shortest Job First</strong>
                Selects the available order with the smallest packing time. Optimal for minimizing average waiting time, but can lead to starvation for very large orders.
              </p>
            )}
            {activeAlgorithm === 'Hybrid' && (
              <p className="text-sm text-gray-300 leading-relaxed">
                <strong className="text-white block mb-1">Multi-Level Queue (Hybrid)</strong>
                Routes Express orders to a dedicated SJF queue and Standard orders to an FCFS queue, processing both simultaneously across two stations.
              </p>
            )}
          </div>

          {results && (
            <div className="glass-card flex-1">
              <h3 className="text-lg font-semibold mb-4 text-white border-b border-white/10 pb-2">Current Metrics</h3>
              <div className="space-y-4">
                <MetricRow label="Total Time Req." value={`${results.total_time}s`} />
                <MetricRow label="Avg Wait Time" value={`${results.avg_waiting_time.toFixed(2)}s`} />
                <MetricRow label="Avg Turnaround" value={`${results.avg_turnaround_time.toFixed(2)}s`} />
                <MetricRow label="Throughput" value={`${results.throughput.toFixed(2)} / s`} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricRow({ label, value }) {
  return (
    <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
      <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-sm font-mono font-semibold text-white">{value}</span>
    </div>
  )
}

function PackingStation({ name, gantt = [], currentTime, orders, colorClass = "text-white border-white/20" }) {
  const activeTask = gantt.find(task => currentTime >= task.start_time && currentTime < task.end_time)
  
  // Find waiting tasks
  const waitingTasks = gantt.filter(task => {
    const order = orders.find(o => o.order_id === task.order_id)
    return order && order.arrival_time <= currentTime && currentTime < task.start_time
  })

  const completedCount = gantt.filter(task => task.end_time <= currentTime).length

  const getTypeStyles = (type, isSolid = false) => {
    if (isSolid) {
      switch(type) {
        case '15 mins delivery': return 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(248,113,113,0.5)]'
        case '60 mins delivery': return 'bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.5)]'
        case '1 day delivery': return 'bg-blue-500 text-white border-blue-400'
        default: return 'bg-gray-600 text-white border-gray-500'
      }
    } else {
      switch(type) {
        case '15 mins delivery': return 'bg-red-400/20 border-red-400 text-red-400'
        case '60 mins delivery': return 'bg-orange-400/20 border-orange-400 text-orange-400'
        case '1 day delivery': return 'bg-blue-400/20 border-blue-400 text-blue-400'
        default: return 'bg-white/10 border-white/20 text-gray-400'
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h4 className={`text-md font-semibold flex items-center gap-2 ${colorClass.split(' ')[0]}`}>
        <Server className="w-5 h-5" />
        {name}
      </h4>
      
      <div className="flex gap-6 items-center">
        {/* Waiting Queue */}
        <div className="flex-1 bg-black/30 rounded-xl border border-white/10 p-4 min-h-[120px] flex items-center relative overflow-hidden">
          <div className="absolute top-2 left-3 text-xs text-gray-500 uppercase font-bold tracking-widest">Waiting Queue ({waitingTasks.length})</div>
          <div className="flex gap-2 overflow-x-auto w-full pt-6 pb-2 px-2 scrollbar-hide">
            <AnimatePresence>
              {waitingTasks.map((task) => (
                <motion.div
                  key={`wait-${task.order_id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, x: 50 }}
                  className={`flex-shrink-0 w-16 h-16 rounded border flex items-center justify-center text-xs font-mono
                    ${getTypeStyles(task.type, false)}`}
                >
                  {task.packing_time}s
                </motion.div>
              ))}
            </AnimatePresence>
            {waitingTasks.length === 0 && (
              <div className="w-full text-center text-sm text-gray-600 mt-2">Queue Empty</div>
            )}
          </div>
        </div>

        <ArrowRight className="text-gray-500 w-8 h-8 flex-shrink-0" />

        {/* Active Processor */}
        <div className={`w-40 h-32 rounded-xl border-2 flex flex-col items-center justify-center relative shadow-lg
          ${activeTask ? 'border-logistics-accent bg-logistics-accent/10 shadow-[0_0_20px_rgba(0,229,255,0.2)]' : 'border-white/10 bg-white/5'}
        `}>
          <div className="absolute top-2 text-[10px] text-gray-400 uppercase font-bold tracking-widest">CPU Processor</div>
          {activeTask ? (
            <motion.div
              key={`active-${activeTask.order_id}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`px-3 py-2 rounded text-center border
                ${getTypeStyles(activeTask.type, true)}
              `}
            >
              <div className="font-mono text-xs">{activeTask.order_id.split('-')[1]}</div>
              <div className="font-bold">{activeTask.end_time - currentTime}s left</div>
            </motion.div>
          ) : (
            <span className="text-gray-500 text-sm">IDLE</span>
          )}
        </div>

        <ArrowRight className="text-gray-500 w-8 h-8 flex-shrink-0" />

        {/* Completed Stats */}
        <div className="w-32 h-32 bg-green-500/10 border border-green-500/30 rounded-xl flex flex-col items-center justify-center text-green-400">
          <CheckCircle2 className="w-8 h-8 mb-2" />
          <div className="text-2xl font-bold">{completedCount}</div>
          <div className="text-xs uppercase tracking-wider">Packed</div>
        </div>
      </div>
    </div>
  )
}
