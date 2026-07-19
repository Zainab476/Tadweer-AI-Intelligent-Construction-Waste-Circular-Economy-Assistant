import { motion } from "framer-motion";

export function CtaBanner() {
  return (
    <section className="py-24 relative overflow-hidden bg-primary text-primary-foreground">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <polygon fill="currentColor" points="100,0 100,100 0,100" />
        </svg>
      </div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Ready to join Saudi Arabia's circular economy?
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-xl font-medium">
            Start reducing your construction waste today. Connect with verified drivers and recycling plants in minutes.
          </p>
          <button className="bg-background text-foreground hover:bg-background/90 px-8 py-4 rounded-md text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:translate-y-0">
            Request a Pickup
          </button>
          <p className="mt-6 text-sm text-primary-foreground/70 font-semibold uppercase tracking-wider">
            Building a greener future
          </p>
        </motion.div>
      </div>
    </section>
  );
}
