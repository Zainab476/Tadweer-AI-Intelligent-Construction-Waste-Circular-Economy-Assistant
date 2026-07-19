import { Recycle, Linkedin, Twitter, Instagram } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-16 border-t border-primary/20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: Brand & Mission */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary text-white p-1.5 rounded-sm">
                <Recycle size={24} strokeWidth={2.5} />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-white block">Tadweer</span>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Building Saudi Arabia's circular economy by transforming construction waste into valuable resources.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="#" className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all text-zinc-300">
                <Linkedin size={18} />
              </a>
              <a href="#" className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all text-zinc-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all text-zinc-300">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Column 2: Portals */}
          <div>
            <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Portals</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link href="/contractor/dashboard" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-zinc-600 rounded-full"></span> Contractor Portal
                </Link>
              </li>
              <li>
                <Link href="/driver/dashboard" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-zinc-600 rounded-full"></span> Driver Portal
                </Link>
              </li>
              <li>
                <Link href="/plant/dashboard" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-zinc-600 rounded-full"></span> Plant Portal
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-sm hover:text-cyan-500 transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-zinc-600 rounded-full"></span> Impact Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: About */}
          <div>
            <h3 className="font-semibold text-white mb-6 uppercase tracking-wider text-sm">Company</h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#how-it-works" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-zinc-600 rounded-full"></span> How It Works
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-zinc-600 rounded-full"></span> Our Mission
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-zinc-600 rounded-full"></span> Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-zinc-600 rounded-full"></span> Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
          <p>© {new Date().getFullYear()} Tadweer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
