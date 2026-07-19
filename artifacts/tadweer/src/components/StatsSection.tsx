import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { stats } from "@/data/stats";

function Counter({ from, to, duration = 1.5 }: { from: number; to: number; duration?: number }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    
    let startTimestamp: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeProgress * (to - from) + from));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count.toLocaleString()}</span>;
}

export function StatsSection() {
  return (
    <section className="py-20 bg-zinc-950 relative border-t border-zinc-800/50">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-sm shadow-sm"
            >
              <div className="text-4xl md:text-5xl font-mono font-bold text-white mb-2 tracking-tight">
                {stat.prefix}
                <Counter from={0} to={stat.value} />
                <span className="text-primary">{stat.suffix}</span>
              </div>
              <div className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
