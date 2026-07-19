import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoMode, DEMO_STEPS } from "@/hooks/useDemoMode";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

export function DemoGuide() {
  const { active, step, currentDemo, exitDemo, nextStep, prevStep } = useDemoMode();
  const [, setLocation] = useLocation();

  if (!active || !currentDemo) return null;

  const handleNext = () => {
    if (step < DEMO_STEPS.length) {
      nextStep();
      setLocation(DEMO_STEPS[step].href); // navigate to NEXT step's href
    } else {
      // Last step — exit demo
      exitDemo();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      prevStep();
      setLocation(DEMO_STEPS[step - 2].href);
    }
  };

  const handleAction = () => {
    setLocation(currentDemo.href);
  };

  return (
    <AnimatePresence>
      <motion.div
        key="demo-guide"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-[9999] p-3 md:p-4 bg-[#030a05]/95 backdrop-blur-md border-t border-green-800/40"
      >
        <div className="max-w-5xl mx-auto flex items-center gap-3 md:gap-6">
          {/* Step badge */}
          <div className="shrink-0 hidden sm:flex flex-col items-center">
            <span className="text-[10px] font-mono text-green-500/70 uppercase tracking-widest">Demo</span>
            <span className="text-xs font-bold text-green-400">{step}/{DEMO_STEPS.length}</span>
          </div>

          {/* Progress dots */}
          <div className="shrink-0 hidden md:flex gap-1.5">
            {DEMO_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 < step ? "bg-green-500 w-4" :
                  i + 1 === step ? "bg-green-400 w-6" :
                  "bg-zinc-700 w-1.5"
                }`}
              />
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{currentDemo.title}</p>
            <p className="text-xs text-zinc-400 truncate hidden sm:block">{currentDemo.description}</p>
          </div>

          {/* Action button */}
          <button
            onClick={handleAction}
            className="shrink-0 bg-green-600 hover:bg-green-500 text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            {currentDemo.action}
          </button>

          {/* Prev / Next */}
          <div className="shrink-0 flex gap-1">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Exit */}
          <button
            onClick={exitDemo}
            className="shrink-0 p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
