import { motion } from "framer-motion";
import { Leaf, Building2, TrendingUp } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-gray-50 text-slate-900 w-full overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="text-sm font-mono text-primary uppercase tracking-widest mb-4">Our Mission</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Building Saudi Arabia's Circular Economy</h2>
          <p className="text-lg text-slate-600">
            Tadweer transforms construction waste into valuable resources — diverting materials from landfills, reducing carbon emissions, and creating a closed-loop economy aligned with Saudi Vision 2030.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="bg-green-100 text-green-600 p-3 rounded-lg w-fit mb-6">
              <Leaf size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Zero Waste Future</h3>
            <p className="text-slate-600">
              Every construction project generates waste. We ensure none of it reaches a landfill.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg w-fit mb-6">
              <Building2 size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Saudi-Built Infrastructure</h3>
            <p className="text-slate-600">
              Our network of verified recycling plants spans Riyadh, Jeddah, Dammam, Tabuk, and beyond.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
          >
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-lg w-fit mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">Real Economic Value</h3>
            <p className="text-slate-600">
              Recycled construction materials reduce costs for buyers and generate revenue for plant operators.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="bg-primary/5 border border-primary/10 rounded-2xl p-8 md:p-12 text-center w-full"
        >
          <p className="text-2xl md:text-3xl font-medium italic text-slate-800 mb-6">
            "We don't see waste — we see raw materials waiting for a second life."
          </p>
          <div className="text-primary font-bold tracking-wide">
            — Tadweer Founding Team
          </div>
        </motion.div>
      </div>
    </section>
  );
}
