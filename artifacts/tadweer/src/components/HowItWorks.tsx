import { motion } from "framer-motion";
import { steps } from "@/data/steps";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6"
          >
            How Tadweer Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground font-medium"
          >
            A seamless digital infrastructure connecting the entire waste lifecycle—from demolition to new material production.
          </motion.p>
        </div>

        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-[44px] left-[12%] right-[12%] h-0.5 bg-border z-0">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left relative group"
                >
                  <div className="w-24 h-24 rounded-full bg-card border-4 border-background shadow-xl flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 group-hover:border-primary/20 transition-all duration-300">
                    <Icon className="w-10 h-10 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-mono font-bold text-sm shadow-md">
                      {step.id}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
