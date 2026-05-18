import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Package, Clock, Truck, CheckCircle2, ChevronRight, History } from 'lucide-react'

const DELIVERY_OPTIONS = [
  { id: '15 mins delivery', name: '15 Mins Fast Track', price: 15.00, color: 'text-red-400', bg: 'bg-red-400/20' },
  { id: '60 mins delivery', name: '60 Mins Express', price: 8.00, color: 'text-orange-400', bg: 'bg-orange-400/20' },
  { id: '1 day delivery', name: '1 Day Priority', price: 4.00, color: 'text-blue-400', bg: 'bg-blue-400/20' },
  { id: 'Standard delivery', name: 'Standard (3-5 Days)', price: 0.00, color: 'text-gray-400', bg: 'bg-white/10' }
]

export default function CustomerPanel({ currentUser }) {
  const [activeTab, setActiveTab] = useState('shop') // 'shop' or 'history'
  const [catalog, setCatalog] = useState([])
  const [orderHistory, setOrderHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [orderStatus, setOrderStatus] = useState(null) // null, 'placing', 'success'

  useEffect(() => {
    fetchCatalog()
  }, [])

  useEffect(() => {
    if (activeTab === 'history') {
      fetchOrderHistory()
    }
  }, [activeTab])

  const fetchCatalog = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/catalog')
      const data = await res.json()
      setCatalog(data.catalog)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderHistory = async () => {
    setHistoryLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/orders?username=${currentUser.username}`)
      const data = await res.json()
      setOrderHistory(data.orders)
    } catch (error) {
      console.error(error)
    } finally {
      setHistoryLoading(false)
    }
  }

  const handlePlaceOrder = async (deliveryType) => {
    setOrderStatus('placing')
    try {
      await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: selectedProduct.product_id,
          delivery_type: deliveryType,
          username: currentUser.username
        })
      })
      setTimeout(() => {
        setOrderStatus('success')
        setTimeout(() => {
          setSelectedProduct(null)
          setOrderStatus(null)
        }, 2000)
      }, 800)
    } catch (error) {
      console.error(error)
      setOrderStatus(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Clock className="w-8 h-8 animate-spin text-logistics-accent" /></div>
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-logistics-accent" />
            Customer Portal
          </h2>
          <p className="text-gray-400">Welcome, {currentUser.username}! Browse products or check your orders.</p>
        </div>
        
        <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-2 rounded-md transition-all font-medium text-sm flex items-center gap-2 ${
              activeTab === 'shop' 
                ? 'bg-logistics-accent text-logistics-dark shadow-[0_0_15px_rgba(0,229,255,0.3)]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> Shop
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md transition-all font-medium text-sm flex items-center gap-2 ${
              activeTab === 'history' 
                ? 'bg-logistics-accent text-logistics-dark shadow-[0_0_15px_rgba(0,229,255,0.3)]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" /> Order History
          </button>
        </div>
      </div>

      {activeTab === 'shop' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 relative">
          {catalog.map((product) => (
            <motion.div 
              key={product.product_id}
              whileHover={{ y: -5 }}
              className="glass-card cursor-pointer hover:border-logistics-accent/50 transition-colors flex flex-col overflow-hidden"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="h-40 bg-white/5 border-b border-white/5 w-full relative">
                <img 
                  src={product.image_url} 
                  alt={product.name} 
                  className="w-full h-full object-cover mix-blend-overlay opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-logistics-card to-transparent"></div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold text-white mb-1 leading-tight">{product.name}</h3>
                <div className="text-sm font-mono text-logistics-accent mb-4">${product.price.toFixed(2)}</div>
                <div className="mt-auto flex justify-between items-center text-xs text-gray-400 border-t border-white/5 pt-3">
                  <span>{product.weight} kg</span>
                  <span className="flex items-center">Order <ChevronRight className="w-3 h-3 ml-1" /></span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Checkout Modal Overlay */}
          <AnimatePresence>
            {selectedProduct && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                onClick={() => { if(orderStatus !== 'placing') setSelectedProduct(null) }}
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                  className="bg-logistics-card border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                  onClick={e => e.stopPropagation()}
                >
                  {orderStatus === 'success' ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">Order Placed!</h3>
                      <p className="text-gray-400 text-center">Your order has been routed to the fulfillment center.</p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-white mb-6">Choose Delivery</h3>
                      <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
                        <img src={selectedProduct.image_url} alt={selectedProduct.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <div className="font-semibold text-white">{selectedProduct.name}</div>
                          <div className="text-sm text-logistics-accent font-mono">${selectedProduct.price.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {DELIVERY_OPTIONS.map(opt => (
                          <button
                            key={opt.id}
                            onClick={() => handlePlaceOrder(opt.id)}
                            disabled={orderStatus === 'placing'}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all ${orderStatus === 'placing' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${opt.bg} ${opt.color}`}>
                                <Truck className="w-4 h-4" />
                              </div>
                              <span className="font-medium text-gray-200">{opt.name}</span>
                            </div>
                            {opt.price > 0 ? (
                              <span className="font-mono text-sm text-logistics-accent">+${opt.price.toFixed(2)}</span>
                            ) : (
                              <span className="font-mono text-sm text-gray-400">FREE</span>
                            )}
                          </button>
                        ))}
                      </div>
                      
                      {orderStatus === 'placing' && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <Clock className="w-10 h-10 animate-spin text-logistics-accent" />
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass-card min-h-[400px]">
          {historyLoading ? (
            <div className="flex justify-center items-center h-64"><Clock className="w-8 h-8 animate-spin text-logistics-accent" /></div>
          ) : orderHistory.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500">
              <Package className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-lg text-white mb-2">No orders yet.</p>
              <p className="text-sm">Head over to the Shop to place your first order.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orderHistory.map(order => (
                <div key={order.order_id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg
                      ${order.priority_score === 1 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                        order.priority_score === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                        order.priority_score === 3 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                        'bg-white/10 text-gray-400 border border-white/20'}`}
                    >
                      {order.priority_score}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{order.product_name}</div>
                      <div className="text-sm text-gray-400 font-mono">{order.order_id}</div>
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex items-center gap-8 justify-between md:justify-end">
                    <div className="text-sm text-gray-400 flex flex-col items-start md:items-end">
                      <span className="uppercase text-[10px] tracking-wider font-bold mb-1">Delivery SLA</span>
                      <span className="text-white">{order.type}</span>
                    </div>
                    <div className="text-sm text-gray-400 flex flex-col items-start md:items-end">
                      <span className="uppercase text-[10px] tracking-wider font-bold mb-1">Status</span>
                      <span className="text-logistics-accent flex items-center gap-1"><Truck className="w-3 h-3"/> In Queue</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
