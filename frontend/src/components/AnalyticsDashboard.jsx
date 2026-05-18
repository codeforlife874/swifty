import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Activity, Lightbulb, TrendingDown, Clock, Zap } from 'lucide-react'

export default function AnalyticsDashboard({ orders }) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
      })
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analytics) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center text-logistics-accent">
        <Activity className="w-12 h-12 animate-pulse mb-4" />
        <h2 className="text-2xl font-bold glow-text">Generating Analytics...</h2>
      </div>
    )
  }

  const { FCFS, SJF, Hybrid } = analytics.algorithms
  const { insights } = analytics

  const comparisonData = [
    {
      name: 'FCFS',
      'Avg Wait Time': FCFS.avg_waiting_time,
      'Avg Turnaround': FCFS.avg_turnaround_time,
    },
    {
      name: 'SJF',
      'Avg Wait Time': SJF.avg_waiting_time,
      'Avg Turnaround': SJF.avg_turnaround_time,
    },
    {
      name: 'Hybrid',
      'Avg Wait Time': Hybrid.avg_waiting_time,
      'Avg Turnaround': Hybrid.avg_turnaround_time,
    }
  ]

  const throughputData = [
    { name: 'FCFS', Throughput: FCFS.throughput * 100 },
    { name: 'SJF', Throughput: SJF.throughput * 100 },
    { name: 'Hybrid', Throughput: Hybrid.throughput * 100 },
  ]

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h2>
        <p className="text-gray-400">Comprehensive comparison of CPU scheduling algorithms for warehouse logistics.</p>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          icon={<Clock className="w-6 h-6 text-blue-400" />}
          title="Best Turnaround Time"
          value={Math.min(FCFS.avg_turnaround_time, SJF.avg_turnaround_time, Hybrid.avg_turnaround_time).toFixed(2) + 's'}
          subtitle={
            FCFS.avg_turnaround_time <= SJF.avg_turnaround_time && FCFS.avg_turnaround_time <= Hybrid.avg_turnaround_time ? 'FCFS' :
            SJF.avg_turnaround_time <= Hybrid.avg_turnaround_time ? 'SJF' : 'Hybrid'
          }
          color="blue"
        />
        <StatCard 
          icon={<TrendingDown className="w-6 h-6 text-green-400" />}
          title="Best Wait Time"
          value={Math.min(FCFS.avg_waiting_time, SJF.avg_waiting_time, Hybrid.avg_waiting_time).toFixed(2) + 's'}
          subtitle={
            FCFS.avg_waiting_time <= SJF.avg_waiting_time && FCFS.avg_waiting_time <= Hybrid.avg_waiting_time ? 'FCFS' :
            SJF.avg_waiting_time <= Hybrid.avg_waiting_time ? 'SJF' : 'Hybrid'
          }
          color="green"
        />
        <StatCard 
          icon={<Zap className="w-6 h-6 text-logistics-accent" />}
          title="Best Throughput"
          value={Math.max(FCFS.throughput, SJF.throughput, Hybrid.throughput).toFixed(3) + ' ops/s'}
          subtitle={
            FCFS.throughput >= SJF.throughput && FCFS.throughput >= Hybrid.throughput ? 'FCFS' :
            SJF.throughput >= Hybrid.throughput ? 'SJF' : 'Hybrid'
          }
          color="cyan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Charts */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="glass-card p-6 h-[400px]">
            <h3 className="text-lg font-semibold text-white mb-6">Average Time Comparison</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" tick={{fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#15151a', borderColor: '#ffffff10', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                <Bar dataKey="Avg Wait Time" fill="#00d2ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Avg Turnaround" fill="#aa3bff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="glass-card p-6 h-[300px]">
            <h3 className="text-lg font-semibold text-white mb-6">Throughput Score (Orders/100s)</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={throughputData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#15151a', borderColor: '#ffffff10', borderRadius: '8px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="Throughput" stroke="#00e5ff" strokeWidth={3} dot={{ r: 6, fill: '#00e5ff', strokeWidth: 0 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="lg:col-span-1 glass-card p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold text-white">Smart Insights</h3>
          </div>
          
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
              >
                <p className="text-sm text-gray-300 leading-relaxed">
                  {insight}
                </p>
              </motion.div>
            ))}
            
            <div className="mt-8 p-4 rounded-lg bg-logistics-accent/10 border border-logistics-accent/30">
              <h4 className="text-sm font-semibold text-logistics-accent mb-2">Conclusion</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                While <strong className="text-white">SJF</strong> provides the best average turnaround time for fast orders, the <strong className="text-white">Hybrid</strong> approach ensures that high-priority SLAs (15 mins, 60 mins) are strictly honored without entirely starving standard deliveries, mimicking real-world tiered fulfillment centers optimally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, subtitle, color }) {
  return (
    <div className="glass-card p-6 flex items-start justify-between group hover:-translate-y-1 transition-transform">
      <div>
        <p className="text-sm text-gray-400 mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-white mb-1">{value}</h4>
        <p className={`text-sm font-medium text-${color}-400`}>{subtitle}</p>
      </div>
      <div className={`p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-${color}-500/20 group-hover:border-${color}-500/50 transition-colors`}>
        {icon}
      </div>
    </div>
  )
}
