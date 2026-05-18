import { motion } from 'framer-motion'
import { Package, Cpu, Zap, BarChart3, ArrowRight } from 'lucide-react'

export default function LandingPage({ onSelectPortal }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-logistics-accent/10 rounded-sm"
            style={{
              width: Math.random() * 40 + 10,
              height: Math.random() * 40 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <motion.div 
        className="z-10 text-center max-w-4xl px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <Zap className="w-4 h-4 text-logistics-express" />
          <span className="text-sm font-medium tracking-wider uppercase text-gray-300">Intelligent Logistics Engine</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
          <span className="text-white">Swift</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-logistics-accent to-blue-500 glow-text">Ship</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Optimizing E-Commerce Deliveries Using <strong className="text-white">Merge Sort</strong> and <strong className="text-white">CPU Scheduling Algorithms</strong>.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => onSelectPortal('customer')} className="btn-primary flex items-center justify-center gap-2 group">
            <Package className="w-5 h-5" />
            Customer Portal
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => onSelectPortal('admin')} className="btn-secondary flex items-center justify-center gap-2 group">
            <Cpu className="w-5 h-5 text-logistics-accent" />
            Admin Control Center
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
          <FeatureCard 
            icon={<Package className="w-8 h-8 text-logistics-accent" />}
            title="Smart Order Sorting"
            description="Prioritizes express deliveries using O(n log n) Merge Sort."
          />
          <FeatureCard 
            icon={<Cpu className="w-8 h-8 text-logistics-express" />}
            title="CPU Scheduling"
            description="Simulates warehouse packing using FCFS, SJF, and Hybrid queues."
          />
          <FeatureCard 
            icon={<BarChart3 className="w-8 h-8 text-blue-400" />}
            title="Real-time Analytics"
            description="Compare algorithm performance with interactive Gantt charts."
          />
        </motion.div>
      </motion.div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      variants={{
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      }}
      className="glass-card flex flex-col items-center text-center p-8 hover:bg-white/5 transition-colors cursor-default"
    >
      <div className="mb-4 p-4 rounded-full bg-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}
