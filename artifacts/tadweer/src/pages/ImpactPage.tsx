import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useImpactData } from "@/hooks/useImpactData";
import {
  Recycle,
  Leaf,
  ArrowDownToLine,
  Truck,
  Home,
  Zap,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer
} from "recharts";

function useCountUp(target: number, duration = 1800, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts + delay;
      const elapsed = Math.max(0, ts - start);
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((target * eased).toFixed(1)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return value;
}

export default function ImpactPage() {
  const metrics = useImpactData();

  // count up values
  const wasteDiverted = useCountUp(metrics.totalWasteDivertedTons);
  const co2Reduced = useCountUp(metrics.co2ReducedTons, 1800, 100);
  const recycledMat = useCountUp(metrics.recycledMaterialTons, 1800, 200);
  const truckTrips = useCountUp(metrics.truckTripsOptimized, 1800, 300);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 300, damping: 24 } 
    }
  };

  const pipelineData = [
    { stage: "Waste Collected", value: metrics.totalWasteDivertedTons, fill: "#6b7280" },
    { stage: "Processed", value: metrics.recycledMaterialTons, fill: "#22c55e" },
    { stage: "CO₂ Eliminated", value: metrics.co2ReducedTons, fill: "#06b6d4" },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#030a05] text-white font-sans selection:bg-green-500/30">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Recycle className="h-6 w-6 text-green-500" />
          <span className="font-bold text-lg tracking-tight">Tadweer</span>
        </div>
        <div className="hidden md:block font-medium text-zinc-300">
          Environmental Impact Dashboard
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-mono text-green-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            LIVE DATA
          </div>
          <Link href="/contractor/dashboard" className="text-sm font-medium text-zinc-400 hover:text-white transition flex items-center gap-1">
            Back to Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-24">
        {/* Hero Section */}
        <motion.section 
          className="text-center space-y-6 flex flex-col items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-green-500 font-mono tracking-widest text-xs uppercase">
            Saudi Circular Economy Initiative
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-black tracking-tight text-white max-w-3xl">
            Building a Sustainable Tomorrow
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-zinc-400 max-w-2xl">
            Every ton of construction waste diverted from landfill is a step toward Saudi Vision 2030's sustainability goals.
          </motion.p>
          <motion.div variants={itemVariants} className="flex gap-4 pt-4">
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium">
              <Leaf className="h-4 w-4 text-green-500" />
              Carbon Neutral by 2060
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium">
              <Recycle className="h-4 w-4 text-emerald-500" />
              Zero Waste Construction
            </div>
          </motion.div>
        </motion.section>

        {/* KPI Cards */}
        <motion.section 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Card 1 */}
          <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/8 transition relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 rounded-full bg-cyan-500/20 text-cyan-400">
                <ArrowDownToLine className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-zinc-400">Waste Diverted</span>
            </div>
            <div className="relative z-10">
              <div className="text-5xl font-black tracking-tight text-white mb-1">
                {wasteDiverted}
              </div>
              <div className="text-sm text-zinc-500 mb-4">Tons</div>
              <div className="text-xs text-green-400 font-medium bg-green-500/10 inline-block px-2 py-1 rounded">
                ≈ {metrics.treesEquivalent.toLocaleString()} trees saved
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <ArrowDownToLine className="h-40 w-40" />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/8 transition relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 rounded-full bg-green-500/20 text-green-400">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-zinc-400">CO₂ Reduced</span>
            </div>
            <div className="relative z-10">
              <div className="text-5xl font-black tracking-tight text-white mb-1">
                {co2Reduced}
              </div>
              <div className="text-sm text-zinc-500 mb-4">Tons CO₂</div>
              <div className="text-xs text-green-400 font-medium bg-green-500/10 inline-block px-2 py-1 rounded">
                Carbon footprint eliminated
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <Leaf className="h-40 w-40" />
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/8 transition relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                <Recycle className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-zinc-400">Recycled Material</span>
            </div>
            <div className="relative z-10">
              <div className="text-5xl font-black tracking-tight text-white mb-1">
                {recycledMat}
              </div>
              <div className="text-sm text-zinc-500 mb-4">Tons</div>
              <div className="text-xs text-green-400 font-medium bg-green-500/10 inline-block px-2 py-1 rounded">
                ≈ {metrics.homesEquivalent.toLocaleString()} homes supplied
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <Recycle className="h-40 w-40" />
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/8 transition relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2 rounded-full bg-amber-500/20 text-amber-400">
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-zinc-400">Trips Optimized</span>
            </div>
            <div className="relative z-10">
              <div className="text-5xl font-black tracking-tight text-white mb-1">
                {truckTrips}
              </div>
              <div className="text-sm text-zinc-500 mb-4">Trips</div>
              <div className="text-xs text-green-400 font-medium bg-green-500/10 inline-block px-2 py-1 rounded">
                Fewer diesel truck journeys
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <Truck className="h-40 w-40" />
            </div>
          </motion.div>
        </motion.section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: AreaChart (8 cols) */}
          <motion.div 
            className="lg:col-span-8 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.1 }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Impact Over Time</h3>
              <p className="text-sm text-zinc-400">6-month recycling performance</p>
            </div>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gWaste" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gCo2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" vertical={false} />
                  <XAxis dataKey="month" stroke="#71717a" tick={{ fill: "#71717a", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" tick={{ fill: "#71717a", fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, color: "#fff" }} itemStyle={{ color: '#e4e4e7' }} />
                  <Legend wrapperStyle={{ color: "#a1a1aa", fontSize: 12, paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="waste" name="Waste Diverted (T)" stroke="#22c55e" fill="url(#gWaste)" strokeWidth={2} dot={{ fill: "#22c55e", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#22c55e", strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="recycled" name="Recycled (T)" stroke="#06b6d4" fill="url(#gCo2)" strokeWidth={2} dot={{ fill: "#06b6d4", r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: "#06b6d4", strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 2: PieChart (4 cols) */}
          <motion.div 
            className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.2 }}
          >
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-white">Waste Composition</h3>
              <p className="text-sm text-zinc-400">By material type</p>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="h-[220px] w-full flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.wasteByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {metrics.wasteByType.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, color: "#fff" }} formatter={(val) => [`${val} Tons`, ""]} itemStyle={{ color: '#e4e4e7' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full mt-2 grid grid-cols-2 gap-y-3 gap-x-2">
                {metrics.wasteByType.map((item, idx) => {
                  const percent = Math.round((item.value / metrics.totalWasteDivertedTons) * 100) || 0;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="flex-1 truncate text-zinc-300" title={item.name}>{item.name}</div>
                      <div className="font-mono text-xs text-zinc-500">{percent}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Chart 3: Processing Pipeline (12 cols) */}
          <motion.div 
            className="lg:col-span-12 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.3 }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Circular Economy Flow</h3>
              <p className="text-sm text-zinc-400">From raw waste to recycled product</p>
            </div>
            <div className="h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData} layout="vertical" margin={{ top: 0, right: 50, left: 0, bottom: 0 }} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" horizontal={false} />
                  <XAxis type="number" stroke="#71717a" tick={{ fill: "#71717a", fontSize: 12 }} unit=" T" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="stage" width={140} stroke="#71717a" tick={{ fill: "#a1a1aa", fontSize: 13, fontWeight: 500 }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "#ffffff0a" }} contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, color: "#fff" }} formatter={(val) => [`${val} Tons`, ""]} itemStyle={{ color: '#e4e4e7' }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {pipelineData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    <LabelList dataKey="value" position="right" formatter={(v: number) => `${v.toLocaleString()} T`} style={{ fill: "#a1a1aa", fontSize: 12, fontWeight: 600 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>

        {/* Real-World Impact */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <div className="text-green-500 font-mono tracking-widest text-xs uppercase">Real-World Impact</div>
            <h2 className="text-3xl font-bold text-white">What This Means for Saudi Arabia</h2>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            {/* Equiv 1 */}
            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 border-t-green-500 border-t-2 rounded-2xl p-6 backdrop-blur-sm">
              <div className="mb-4 text-green-400 bg-green-500/10 w-12 h-12 flex items-center justify-center rounded-xl">
                <Leaf className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{metrics.treesEquivalent.toLocaleString()} Trees Worth of CO₂ Absorbed</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">Equivalent forest cover preserved through sustainable construction practices.</p>
            </motion.div>

            {/* Equiv 2 */}
            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 border-t-blue-500 border-t-2 rounded-2xl p-6 backdrop-blur-sm">
              <div className="mb-4 text-blue-400 bg-blue-500/10 w-12 h-12 flex items-center justify-center rounded-xl">
                <Home className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{metrics.homesEquivalent.toLocaleString()} Homes Supplied with materials</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">Secondary raw materials generated to build sustainable future communities.</p>
            </motion.div>

            {/* Equiv 3 */}
            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 border-t-amber-500 border-t-2 rounded-2xl p-6 backdrop-blur-sm">
              <div className="mb-4 text-amber-400 bg-amber-500/10 w-12 h-12 flex items-center justify-center rounded-xl">
                <Truck className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{metrics.truckTripsOptimized.toLocaleString()} Fewer Diesel Trips</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">Reduced transportation emissions through localized processing.</p>
            </motion.div>

            {/* Equiv 4 */}
            <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 border-t-purple-500 border-t-2 rounded-2xl p-6 backdrop-blur-sm">
              <div className="mb-4 text-purple-400 bg-purple-500/10 w-12 h-12 flex items-center justify-center rounded-xl">
                <Zap className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">{Math.round(metrics.co2ReducedTons * 1.2).toLocaleString()} MWh Energy Equivalent</h4>
              <p className="text-sm text-zinc-400 leading-relaxed">Avoided through circular processes and reduced raw extraction.</p>
            </motion.div>
          </motion.div>
        </section>

        {/* Vision 2030 Banner */}
        <motion.section 
          className="relative bg-gradient-to-r from-green-950/50 via-emerald-900/30 to-green-950/50 border border-green-800/30 rounded-2xl p-10 md:p-16 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <Leaf className="w-96 h-96 text-green-500 opacity-5 -rotate-12 transform scale-150" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto space-y-6 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Aligned with Saudi Vision 2030</h2>
            <p className="text-lg text-green-100/70 leading-relaxed">
              Tadweer directly supports the Kingdom's ambitious goal of diverting 90% of construction waste from landfills by 2035, reducing carbon emissions across the built environment.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <div className="bg-green-950/50 border border-green-500/20 text-green-300 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide">
                90% Diversion Target
              </div>
              <div className="bg-green-950/50 border border-green-500/20 text-green-300 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide">
                2030 Goal
              </div>
              <div className="bg-green-950/50 border border-green-500/20 text-green-300 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide">
                Net-Zero by 2060
              </div>
            </div>
          </div>
        </motion.section>

      </main>
    </div>
  );
}
