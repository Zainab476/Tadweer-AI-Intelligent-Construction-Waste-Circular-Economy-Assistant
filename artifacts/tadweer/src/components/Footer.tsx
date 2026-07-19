import { Recycle, Linkedin, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 py-12 border-t border-primary/20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-white p-1.5 rounded-sm">
              <Recycle size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white block">Tadweer</span>
              <span className="text-xs font-mono uppercase tracking-widest text-primary mt-0.5 block">Circular Economy Platform</span>
            </div>
          </div>

          <nav>
            <ul className="flex flex-wrap justify-center gap-6 md:gap-8">
              {['Home', 'How It Works', 'Impact', 'Network'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-semibold hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <a href="#" className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all text-zinc-300">
              <Linkedin size={18} />
            </a>
            <a href="#" className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all text-zinc-300">
              <Twitter size={18} />
            </a>
            <a href="#" className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-primary hover:border-primary hover:text-white transition-all text-zinc-300">
              <Instagram size={18} />
            </a>
          </div>
        </div>
        
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
          <p>© 2025 Tadweer. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
