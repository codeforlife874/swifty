import { useState } from 'react'
import OrderGeneration from './OrderGeneration'
import MergeSortVisualization from './MergeSortVisualization'
import SchedulingSimulation from './SchedulingSimulation'
import AnalyticsDashboard from './AnalyticsDashboard'

export default function AdminPanel() {
  const [currentView, setCurrentView] = useState('generate')
  const [orders, setOrders] = useState([])
  const [sortedOrders, setSortedOrders] = useState([])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 border-b border-white/10 pb-4 mb-4 overflow-x-auto scrollbar-hide">
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${currentView === 'generate' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setCurrentView('generate')}
        >
          Queue Management
        </button>
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${currentView === 'sort' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setCurrentView('sort')}
          disabled={orders.length === 0}
        >
          Sorting Pipeline
        </button>
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${currentView === 'schedule' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setCurrentView('schedule')}
          disabled={sortedOrders.length === 0}
        >
          Packing Simulation
        </button>
        <button 
          className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors ${currentView === 'analytics' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          onClick={() => setCurrentView('analytics')}
          disabled={sortedOrders.length === 0}
        >
          Analytics Dashboard
        </button>
      </div>

      <div className="w-full">
        {currentView === 'generate' && (
          <OrderGeneration 
            orders={orders} 
            setOrders={setOrders} 
            onNext={() => setCurrentView('sort')} 
          />
        )}
        {currentView === 'sort' && (
          <MergeSortVisualization 
            orders={orders} 
            setSortedOrders={setSortedOrders}
            onNext={() => setCurrentView('schedule')}
          />
        )}
        {currentView === 'schedule' && (
          <SchedulingSimulation 
            orders={sortedOrders}
            onNext={() => setCurrentView('analytics')}
          />
        )}
        {currentView === 'analytics' && (
          <AnalyticsDashboard orders={sortedOrders} />
        )}
      </div>
    </div>
  )
}
