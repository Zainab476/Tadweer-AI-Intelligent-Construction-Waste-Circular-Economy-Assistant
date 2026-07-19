import { motion } from "framer-motion";
import { features } from "@/data/features";

export function WhyTadweer() {
  return (
    <section id="impact" className="py-24 bg-zinc-50 dark:bg-zinc-950/40 relative">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
            >
              Why Choose Tadweer
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground font-medium"
            >
              Building the infrastructure for Saudi Arabia's green economy through intelligent resource management.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-8 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Left accent border equivalent */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/20 group-hover:bg-primary transition-colors duration-300" />
                
                {/* Hover Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row gap-6">
                  <div className="shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon strokeWidth={2} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed font-medium">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
