import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Recycle, Menu, X, ChevronDown, HardHat, Truck, Factory, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { useDemoMode } from "@/hooks/useDemoMode";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { startDemo } = useDemoMode();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Impact", href: "#impact" },
    { name: "Network", href: "#network" },
  ];

  const handleStartDemo = () => {
    startDemo();
    setLocation("/contractor/dashboard");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-sm group-hover:bg-primary/90 transition-colors">
            <Recycle size={24} strokeWidth={2.5} />
          </div>
          <span className={`font-bold text-xl tracking-tight transition-colors ${isScrolled ? "text-foreground" : "text-white md:text-foreground"} group-hover:text-primary`}>
            Tadweer
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${isScrolled ? "text-foreground/80" : "text-white/80"}`}
                >
                  {link.name}
                </a>
              </li>
            ))}
            
            {/* Portals Dropdown */}
            <li className="relative group py-2">
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${isScrolled ? "text-foreground/80" : "text-white/80"}`}>
                Portals <ChevronDown size={14} />
              </button>
              <div className="absolute top-full left-0 mt-0 w-52 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <div className="flex flex-col py-1">
                  <a href="#" onClick={(e) => { e.preventDefault(); setLocation("/contractor/dashboard"); }} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-foreground">
                    <HardHat size={16} className="text-primary" /> Contractor Portal
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setLocation("/driver/dashboard"); }} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-foreground">
                    <Truck size={16} className="text-primary" /> Driver Portal
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); setLocation("/plant/dashboard"); }} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-foreground">
                    <Factory size={16} className="text-primary" /> Plant Portal
                  </a>
                  <div className="h-px bg-border my-1" />
                  <a href="#" onClick={(e) => { e.preventDefault(); setLocation("/impact"); }} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-foreground">
                    <BarChart3 size={16} className="text-cyan-600" /> Impact Dashboard
                  </a>
                </div>
              </div>
            </li>
          </ul>
          
          <div className="flex items-center gap-4">
            <button 
              className={`border border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors ${!isScrolled && "bg-background/90"}`}
              onClick={handleStartDemo}
            >
              Start Demo
            </button>
            <button 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
              onClick={() => setLocation("/contractor/request")}
            >
              Request Waste Pickup
            </button>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden p-2 ${isScrolled ? "text-foreground" : "text-white"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg p-6 flex flex-col gap-6 md:hidden max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-base font-semibold text-foreground block w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
            
            <div className="pt-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Portals</div>
              <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                <button onClick={() => { setMobileMenuOpen(false); setLocation("/contractor/dashboard"); }} className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-full text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted/80">
                  <HardHat size={16} className="text-primary" /> Contractor
                </button>
                <button onClick={() => { setMobileMenuOpen(false); setLocation("/driver/dashboard"); }} className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-full text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted/80">
                  <Truck size={16} className="text-primary" /> Driver
                </button>
                <button onClick={() => { setMobileMenuOpen(false); setLocation("/plant/dashboard"); }} className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-full text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted/80">
                  <Factory size={16} className="text-primary" /> Plant
                </button>
                <button onClick={() => { setMobileMenuOpen(false); setLocation("/impact"); }} className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-full text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted/80">
                  <BarChart3 size={16} className="text-cyan-600" /> Impact
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <button 
                className="w-full text-center py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-full font-semibold transition-colors"
                onClick={() => { setMobileMenuOpen(false); handleStartDemo(); }}
              >
                Start Demo
              </button>
              <button 
                className="w-full text-center py-3 bg-primary text-primary-foreground rounded-full font-bold shadow-md"
                onClick={() => { setMobileMenuOpen(false); setLocation("/contractor/request"); }}
              >
                Request Waste Pickup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
