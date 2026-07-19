import { motion } from "framer-motion";
import { Building, Truck, Recycle, Package } from "lucide-react";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-zinc-950 text-white min-h-[90vh] flex flex-col justify-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Text Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6 text-center lg:text-left"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-foreground w-fit mx-auto lg:mx-0">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono font-semibold tracking-wide uppercase text-green-400">Live Network Active</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Transform <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-primary">Construction Waste</span> <br className="hidden lg:block" />
            into Sustainable Resources.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto lg:mx-0 font-medium">
            Tadweer connects construction companies, transport drivers, and recycling plants to build a smarter circular economy in Saudi Arabia.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mt-4 justify-center lg:justify-start">
            <button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-md text-base font-bold shadow-[0_0_20px_rgba(21,128,61,0.4)] transition-all hover:shadow-[0_0_30px_rgba(21,128,61,0.6)] hover:-translate-y-0.5 active:translate-y-0">
              Request Waste Pickup
            </button>
            <button className="w-full sm:w-auto bg-transparent border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 text-white px-8 py-4 rounded-md text-base font-bold transition-all">
              Explore Recycling Network
            </button>
          </motion.div>
        </motion.div>

        {/* Animated Diagram */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full aspect-square max-w-[500px] mx-auto hidden lg:flex items-center justify-center"
        >
          {/* Circular Track */}
          <div className="absolute inset-0 rounded-full border border-zinc-800/50 m-8" />
          <div className="absolute inset-0 rounded-full border border-zinc-800/30 m-20" />
          
          {/* Animated paths SVG */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 500">
            <defs>
              <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#15803D" stopOpacity="0" />
                <stop offset="50%" stopColor="#22C55E" stopOpacity="1" />
                <stop offset="100%" stopColor="#15803D" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 250 50 A 200 200 0 1 1 249.9 50"
              fill="none"
              stroke="url(#flow-gradient)"
              strokeWidth="4"
              strokeDasharray="200 1000"
              animate={{ strokeDashoffset: [1200, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]"
            />
          </svg>

          {/* Nodes */}
          <div className="relative w-full h-full animate-[spin_40s_linear_infinite]">
            {/* Top Node - Construction */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[spin_40s_linear_infinite_reverse]">
              <div className="w-20 h-20 bg-zinc-900 border border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-black/50 z-10 relative group hover:border-green-400 transition-colors">
                <Building className="text-green-400" size={28} />
                <span className="text-[10px] font-mono font-bold text-zinc-400">SITE</span>
              </div>
            </div>
            
            {/* Right Node - Transport */}
            <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 animate-[spin_40s_linear_infinite_reverse]">
              <div className="w-20 h-20 bg-zinc-900 border border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-black/50 z-10 relative group hover:border-green-400 transition-colors">
                <Truck className="text-green-400" size={28} />
                <span className="text-[10px] font-mono font-bold text-zinc-400">TRANS</span>
              </div>
            </div>
            
            {/* Bottom Node - Recycling */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 animate-[spin_40s_linear_infinite_reverse]">
              <div className="w-20 h-20 bg-primary border border-green-400 rounded-xl flex flex-col items-center justify-center gap-1 shadow-[0_0_30px_rgba(21,128,61,0.5)] z-10 relative">
                <Recycle className="text-white" size={28} />
                <span className="text-[10px] font-mono font-bold text-green-100">PLANT</span>
              </div>
            </div>
            
            {/* Left Node - Materials */}
            <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 animate-[spin_40s_linear_infinite_reverse]">
              <div className="w-20 h-20 bg-zinc-900 border border-zinc-700 rounded-xl flex flex-col items-center justify-center gap-1 shadow-lg shadow-black/50 z-10 relative group hover:border-green-400 transition-colors">
                <Package className="text-green-400" size={28} />
                <span className="text-[10px] font-bold font-mono text-zinc-400">MATS</span>
              </div>
            </div>
          </div>

          {/* Center Hub */}
          <div className="absolute w-32 h-32 bg-zinc-900/80 backdrop-blur-sm border-2 border-primary/50 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(21,128,61,0.2)]">
            <div className="text-center">
              <div className="text-2xl font-black text-white tracking-tight">Tadweer</div>
              <div className="text-[10px] font-mono text-green-400 uppercase tracking-widest mt-1">Platform</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
