import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Factory, MapPin, Zap, CheckCircle2, ArrowLeft, Loader2, Star, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWasteRequests, WasteRequest } from "@/hooks/useWasteRequests";
import { findMatches, MatchResult } from "@/utils/matchingEngine";
import { Badge } from "@/components/ui/badge";

// Data stream background effect
const DataStream = () => {
  const [chars, setChars] = useState<string[]>([]);
  
  useEffect(() => {
    const chars = "0123456789ABCDEF".split("");
    const generateStream = () => Array.from({ length: 400 }, () => chars[Math.floor(Math.random() * chars.length)]);
    
    setChars(generateStream());
    
    const interval = setInterval(() => {
      setChars(generateStream());
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none flex flex-wrap content-start break-all font-mono text-[10px] leading-tight text-primary">
      {chars.join(" ")}
    </div>
  );
};

export default function MatchingPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { requests, loaded, updateStatus } = useWasteRequests();

  const [phase, setPhase] = useState<"analyzing" | "results">("analyzing");
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [request, setRequest] = useState<WasteRequest | undefined>(undefined);
  const [activeStep, setActiveStep] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const didInit = useState(false);

  useEffect(() => {
    if (!loaded || !id || didInit[0]) return;
    didInit[1](true);

    const req = requests.find(r => r.id === id);
    if (!req) {
      setLocation("/contractor/dashboard");
      return;
    }

    setRequest(req);
    setMatches(findMatches(req));

    // Animation sequence — auto-progresses through 4 steps then shows results
    const timers = [
      setTimeout(() => setActiveStep(1), 800),
      setTimeout(() => setActiveStep(2), 1600),
      setTimeout(() => setActiveStep(3), 2400),
      setTimeout(() => setActiveStep(4), 3200),
      setTimeout(() => setPhase("results"), 3800),
    ];

    return () => timers.forEach(clearTimeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, id]);

  if (!request || matches.length === 0) return null;

  const bestMatch = matches[0];
  const otherMatches = matches.slice(1, 3);

  const handleConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      if (id) updateStatus(id, "Matched");
      setLocation("/contractor/dashboard");
    }, 1000);
  };

  const steps = [
    { icon: Search, label: "Detecting waste composition" },
    { icon: Factory, label: "Scanning plant availability" },
    { icon: MapPin, label: "Calculating optimal distance" },
    { icon: Zap, label: "Running compatibility check" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex flex-col relative overflow-hidden font-sans">
      <DataStream />
      
      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md">
        <button 
          onClick={() => setLocation("/contractor/dashboard")}
          className="flex items-center text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h1 className="text-lg font-semibold tracking-tight">Smart Match Results</h1>
        <div className="text-xs text-zinc-500 font-mono hidden md:block">
          Processing time: 3.8s &nbsp;|&nbsp; 5 plants evaluated
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center p-4 md:p-8">
        <AnimatePresence mode="wait">
          {phase === "analyzing" ? (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md flex flex-col items-center"
            >
              {/* Glowing Orb */}
              <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
                <motion.div 
                  className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute inset-4 rounded-full border border-primary/30"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute inset-8 rounded-full border border-primary/50" />
                <Zap className="w-8 h-8 text-primary relative z-10" />
              </div>

              <h2 className="text-primary font-mono text-xs uppercase tracking-widest mb-2">AI Matching Engine</h2>
              <p className="text-xl font-medium text-white mb-10">Analyzing waste request...</p>

              {/* Steps */}
              <div className="w-full space-y-4">
                {steps.map((step, index) => {
                  const isActive = activeStep === index;
                  const isDone = activeStep > index;
                  const isPending = activeStep < index;
                  
                  if (isPending) return null;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-md ${isDone ? 'bg-primary/20 text-primary' : 'bg-zinc-800 text-zinc-400'}`}>
                          <step.icon size={16} />
                        </div>
                        <span className={isDone ? "text-slate-200" : "text-zinc-400"}>{step.label}</span>
                      </div>
                      <div>
                        {isActive && (
                          <div className="flex items-center gap-2 text-xs text-primary font-mono">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Processing...
                          </div>
                        )}
                        {isDone && (
                          <div className="flex items-center gap-1 text-xs text-primary font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Complete
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Left Column: Best Match */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden flex flex-col">
                  {/* Card Header */}
                  <div className="p-6 md:p-8 border-b border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-900/50">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground mb-3 text-sm px-3 py-1">
                          Best Match Found
                        </Badge>
                        <h2 className="text-3xl font-bold text-white mb-2">{bestMatch.plant.name}</h2>
                        <div className="flex items-center gap-4 text-zinc-400 text-sm">
                          <span className="flex items-center gap-1">
                            <MapPin size={16} /> {bestMatch.plant.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star size={16} className="fill-amber-500 text-amber-500" /> 
                            <span className="text-zinc-300 font-medium">{bestMatch.plant.rating}</span>
                          </span>
                          <span className="hidden sm:inline-flex items-center gap-1">
                            <CheckCircle2 size={16} className="text-primary" />
                            Verified since {bestMatch.plant.verifiedSince}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="text-4xl font-bold text-white">{Math.round(bestMatch.score)}%</div>
                        <div className="text-xs text-zinc-500 font-mono uppercase tracking-wider">Match Score</div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                        <div className="text-zinc-500 text-xs mb-1">Distance</div>
                        <div className="text-xl font-semibold text-zinc-200">{bestMatch.distanceKm} <span className="text-sm font-normal text-zinc-500">km</span></div>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                        <div className="text-zinc-500 text-xs mb-1">Capacity</div>
                        <div className="text-xl font-semibold text-zinc-200">{bestMatch.plant.availableCapacityTons} <span className="text-sm font-normal text-zinc-500">t</span></div>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                        <div className="text-zinc-500 text-xs mb-1">Turnaround</div>
                        <div className="text-xl font-semibold text-zinc-200">{bestMatch.plant.turnaroundDays} <span className="text-sm font-normal text-zinc-500">days</span></div>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                        <div className="text-zinc-500 text-xs mb-1">CO₂/Ton</div>
                        <div className="text-xl font-semibold text-zinc-200">{bestMatch.plant.co2PerTon} <span className="text-sm font-normal text-zinc-500">kg</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 md:p-8 flex flex-col gap-8">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-zinc-300">Match Confidence</span>
                        <span className="text-primary font-mono">{Math.round(bestMatch.score)}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${bestMatch.score}%` }}
                          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Match Reasons */}
                      <div>
                        <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Why this matches</h3>
                        <ul className="space-y-3">
                          {bestMatch.matchReasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                              <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CO2 Impact */}
                      <div className="bg-[#0f1f14] border border-[#1a3a24] rounded-xl p-5 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Zap size={64} />
                        </div>
                        <div className="relative z-10">
                          <div className="text-primary/80 text-xs font-mono mb-2">ENVIRONMENTAL IMPACT</div>
                          <div className="text-3xl font-bold text-white mb-1">
                            {bestMatch.co2SavedTons} <span className="text-xl font-medium text-zinc-400">Tons</span>
                          </div>
                          <div className="text-sm text-zinc-300">CO₂ Saved from Landfill</div>
                          <div className="mt-3 text-xs text-primary/70 bg-primary/10 px-2 py-1 rounded inline-flex">
                            Equivalent to planting {Math.round(request.quantity * 2)} trees
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Summary & Actions */}
              <div className="flex flex-col gap-6">
                {/* Request Summary */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Your Request</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Project</div>
                      <div className="text-sm font-medium text-zinc-200">{request.projectName}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-zinc-500 mb-1">Material</div>
                        <Badge variant="outline" className="text-zinc-300 border-zinc-700 bg-zinc-800">{request.wasteType}</Badge>
                      </div>
                      <div>
                        <div className="text-xs text-zinc-500 mb-1">Quantity</div>
                        <div className="text-sm font-medium text-zinc-200">{request.quantity} Tons</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Location</div>
                      <div className="text-sm font-medium text-zinc-200">{request.location}</div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Pickup Date</div>
                      <div className="text-sm font-medium text-zinc-200">{new Date(request.pickupDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>

                {/* Other Options */}
                {otherMatches.length > 0 && (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-zinc-400 mb-4 uppercase tracking-wider">Alternative Options</h3>
                    <div className="space-y-3">
                      {otherMatches.map((match, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-zinc-800/50 bg-zinc-950/30">
                          <div>
                            <div className="text-sm font-medium text-zinc-200 truncate max-w-[140px]">{match.plant.name}</div>
                            <div className="text-xs text-zinc-500">{match.distanceKm} km away</div>
                          </div>
                          <div className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                            {Math.round(match.score)}% Match
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-auto flex flex-col gap-3">
                  <Button 
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 text-base shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                    onClick={handleConfirm}
                    disabled={isConfirming}
                  >
                    {isConfirming ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Confirming...
                      </span>
                    ) : (
                      `Confirm Pickup with ${bestMatch.plant.name.split(' ')[0]}`
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800"
                    onClick={() => setLocation("/contractor/dashboard")}
                    disabled={isConfirming}
                  >
                    Cancel and return to Dashboard
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}