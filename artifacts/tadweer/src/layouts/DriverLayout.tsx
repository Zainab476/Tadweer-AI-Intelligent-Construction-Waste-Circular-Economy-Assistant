import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Truck, PackageCheck, Recycle, Menu, X, ChevronDown, ChevronRight, HardHat, Factory, BarChart3 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useDemoMode } from "@/hooks/useDemoMode";

export function DriverLayout({ children, title }: { children: React.ReactNode, title?: string }) {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoRole, setDemoRole] = useState("Driver");
  const { active: demoActive, startDemo } = useDemoMode();

  const navItems = [
    { name: "Available Jobs", href: "/driver/dashboard", icon: Truck },
    { name: "Active Job", href: "/driver/dashboard", icon: PackageCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white p-1 rounded-sm">
            <Recycle size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">Tadweer</span>
        </div>
        <button className="text-slate-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile) */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 hidden md:flex items-center gap-2 group">
          <div className="bg-primary text-white p-1.5 rounded-sm">
            <Recycle size={24} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">Tadweer</span>
        </div>
        
        <div className="px-6 pb-4 md:pt-0 pt-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Driver Portal</div>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const reallyActive = (item.name === "Available Jobs" && location === "/driver/dashboard") || 
                                 (item.name === "Active Job" && location.startsWith("/driver/job"));
            return (
              <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)}>
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                    reallyActive
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className={`${reallyActive ? "text-primary" : "text-slate-400"}`}>
                    <item.icon size={18} />
                  </div>
                  {item.name}
                  {reallyActive && (
                    <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {!demoActive && (
          <button
            onClick={() => { startDemo(); setLocation("/contractor/dashboard"); }}
            className="mx-4 mb-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-primary border border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-lg py-2 transition-colors"
          >
            <ChevronRight size={14} /> Start Demo
          </button>
        )}

        <div className="p-4 border-t border-gray-200 mt-auto">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-between w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-sm text-left transition-colors">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Demo Mode</span>
                  <span className="font-medium text-slate-700">{demoRole}</span>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="text-xs font-medium text-slate-500 px-2 py-1.5">Switch Role</div>
              <div
                className={`flex items-center gap-3 px-2 py-2 text-sm rounded-sm cursor-pointer hover:bg-slate-100 ${
                  demoRole === "Contractor" ? "font-medium text-primary bg-primary/5" : "text-slate-700"
                }`}
                onClick={() => {
                  setDemoRole("Contractor");
                  setLocation("/contractor/dashboard");
                }}
              >
                <HardHat size={16} className={demoRole === "Contractor" ? "text-primary" : "text-slate-400"} /> Contractor
              </div>
              <div
                className={`flex items-center gap-3 px-2 py-2 text-sm rounded-sm cursor-pointer hover:bg-slate-100 ${
                  demoRole === "Driver" ? "font-medium text-primary bg-primary/5" : "text-slate-700"
                }`}
                onClick={() => {
                  setDemoRole("Driver");
                  setLocation("/driver/dashboard");
                }}
              >
                <Truck size={16} className={demoRole === "Driver" ? "text-primary" : "text-slate-400"} /> Driver
              </div>
              <div
                className={`flex items-center gap-3 px-2 py-2 text-sm rounded-sm cursor-pointer hover:bg-slate-100 ${
                  demoRole === "Recycling Plant" ? "font-medium text-primary bg-primary/5" : "text-slate-700"
                }`}
                onClick={() => {
                  setDemoRole("Recycling Plant");
                  setLocation("/plant/dashboard");
                }}
              >
                <Factory size={16} className={demoRole === "Recycling Plant" ? "text-primary" : "text-slate-400"} /> Recycling Plant
              </div>
              <div className="h-px bg-slate-100 my-1 mx-2" />
              <div
                className={`flex items-center gap-3 px-2 py-2 text-sm rounded-sm cursor-pointer hover:bg-slate-100 text-slate-700`}
                onClick={() => {
                  setLocation("/impact");
                }}
              >
                <BarChart3 size={16} className="text-cyan-500" /> Impact Dashboard
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Desktop Topbar */}
        <header className="hidden md:flex items-center justify-between bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
          <h1 className="text-xl font-bold text-slate-800">{title || "Dashboard"}</h1>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-900">Mohammed Al-Rashidi</span>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider py-0 mt-0.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none">
                DRIVER
              </Badge>
            </div>
            <Avatar className="h-10 w-10 border-2 border-primary/20 bg-primary/10">
              <AvatarFallback className="text-primary font-bold bg-transparent">MR</AvatarFallback>
            </Avatar>
          </div>
        </header>
        
        {/* Mobile Title (when topbar is hidden) */}
        {title && (
          <div className="md:hidden px-4 pt-4 pb-2 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-800">{title}</h1>
            <Avatar className="h-8 w-8 border border-primary/20 bg-primary/10">
              <AvatarFallback className="text-primary font-bold text-xs bg-transparent">MR</AvatarFallback>
            </Avatar>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
