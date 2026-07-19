import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Recycle, Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          </ul>
          <div className="flex items-center gap-4">
            <button className={`text-sm font-semibold transition-colors hover:text-primary ${isScrolled ? "text-foreground" : "text-white"}`}>
              Sign In
            </button>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-md text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
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
            className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg p-6 flex flex-col gap-6 md:hidden"
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
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <button className="w-full text-center py-3 border border-input rounded-md font-semibold text-foreground">
                Sign In
              </button>
              <button className="w-full text-center py-3 bg-primary text-primary-foreground rounded-md font-bold shadow-md">
                Request Waste Pickup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
