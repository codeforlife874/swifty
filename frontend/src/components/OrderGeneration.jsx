import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, RefreshCw, ArrowRight, Package, Clock, Weight, Hash, Trash2 } from 'lucide-react'

export default function OrderGeneration({ orders, setOrders, onNext }) {
  const [loading, setLoading] = useState(false)
  const [customCount, setCustomCount] = useState(20)

  useEffect(() => {
    fetchQueue()
  }, [])

  const fetchQueue = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/orders`)
      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateBulk = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/generate-orders?count=${customCount}`, {
        method: 'POST'
      })
      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error("Error generating orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearQueue = async () => {
    setLoading(true)
    try {
      await fetch(`http://localhost:5000/api/orders`, { method: 'DELETE' })
      setOrders([])
    } catch (error) {
      console.error("Error clearing orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (score) => {
    switch(score) {
      case 1: return 'bg-red-400/20 text-red-400 border-red-400/30'
      case 2: return 'bg-orange-400/20 text-orange-400 border-orange-400/30'
      case 3: return 'bg-blue-400/20 text-blue-400 border-blue-400/30'
      default: return 'bg-white/10 text-gray-400 border-white/20'
    }
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Global Order Queue</h2>
          <p className="text-gray-400">View customer orders or generate mock bulk data.</p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <button 
            onClick={fetchQueue} 
            disabled={loading}
            className="btn-secondary flex items-center gap-2 px-4 py-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <div className="h-8 w-px bg-white/10 mx-1"></div>

          <input 
            type="number" 
            value={customCount}
            onChange={(e) => setCustomCount(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-20 text-white outline-none focus:border-logistics-accent text-sm"
            min="1"
            max="1000"
          />
          <button 
            onClick={generateBulk} 
            disabled={loading}
            className="bg-logistics-accent/20 text-logistics-accent hover:bg-logistics-accent/30 border border-logistics-accent/30 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Mock Orders
          </button>

          <button 
            onClick={clearQueue} 
            disabled={loading || orders.length === 0}
            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ml-2"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button 
            onClick={onNext} 
            disabled={orders.length === 0}
            className={`btn-primary flex items-center gap-2 py-2 ml-4 ${orders.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Sort Queue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="glass-card min-h-[500px]">
        {orders.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-gray-500">
            <Package className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg text-white mb-2">Queue is empty.</p>
            <p className="text-sm">Place orders via the Customer Portal or generate mock data.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-2"><Hash className="w-4 h-4"/> Order ID</div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-2"><Weight className="w-4 h-4"/> Weight</div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4"/> Time Data</div>
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Priority
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-transparent">
                    <AnimatePresence>
                      {orders.map((order, index) => (
                        <motion.tr 
                          key={order.order_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.01 }}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">
                            {order.order_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {order.product_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getPriorityColor(order.priority_score)}`}>
                              {order.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {order.weight} kg
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                            Arr: <span className="text-white font-mono mr-2">t={order.arrival_time}</span>
                            Pack: <span className="text-white font-mono">{order.packing_time}s</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`font-bold ${order.priority_score === 1 ? 'text-red-400' : 'text-gray-400'}`}>
                              {order.priority_score}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
