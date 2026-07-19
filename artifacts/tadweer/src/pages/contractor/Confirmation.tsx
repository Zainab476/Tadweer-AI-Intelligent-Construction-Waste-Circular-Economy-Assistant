import { useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { ContractorLayout } from "@/layouts/ContractorLayout";
import { useWasteRequests } from "@/hooks/useWasteRequests";
import { motion } from "framer-motion";
import { Zap, Truck, Bell, LayoutDashboard, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Confirmation() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { getRequest } = useWasteRequests();

  const request = id ? getRequest(id) : undefined;

  // Redirect if not found
  useEffect(() => {
    if (!request && id) {
      setLocation("/contractor/dashboard");
    }
  }, [request, id, setLocation]);

  if (!request) return null;

  return (
    <ContractorLayout title="Request Status">
      <div className="max-w-2xl mx-auto py-8">
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
          className="flex flex-col items-center text-center space-y-8"
        >
          {/* Animated Checkmark */}
          <motion.div variants={itemVariants} className="relative">
            <svg className="w-24 h-24 text-primary" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
              <motion.circle 
                cx="50" cy="50" r="45" 
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-primary/20"
                stroke="currentColor"
              />
              <motion.path 
                d="M30 50L45 65L70 35"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
              />
            </svg>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Request Created Successfully</h1>
            <div className="flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                Pending Smart Matching
              </Badge>
            </div>
            <p className="text-slate-500 max-w-md mx-auto">
              Your request for <span className="font-semibold text-slate-700">{request.projectName}</span> is now active.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <Card className="border-slate-200 shadow-sm bg-slate-50/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-left">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Waste Type</p>
                    <p className="font-semibold text-slate-800">{request.wasteType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Quantity</p>
                    <p className="font-semibold text-slate-800">{request.quantity} Tons</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Location</p>
                    <p className="font-semibold text-slate-800">{request.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Pickup Date</p>
                    <p className="font-semibold text-slate-800">{new Date(request.pickupDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full text-left space-y-4">
            <h3 className="text-lg font-semibold text-slate-800">What happens next?</h3>
            <div className="space-y-4">
              {[
                { icon: Zap, text: "Our AI matches your request with nearby recycling plants", color: "text-amber-500" },
                { icon: Truck, text: "A verified driver will be assigned within 24 hours", color: "text-blue-500" },
                { icon: Bell, text: "You'll receive confirmation when pickup is scheduled", color: "text-primary" },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-slate-100 bg-white shadow-sm">
                  <div className={`p-2 rounded-full bg-slate-50 ${step.color}`}>
                    <step.icon size={20} />
                  </div>
                  <p className="text-slate-700 font-medium pt-1.5">{step.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 border-slate-200" 
              onClick={() => setLocation("/contractor/dashboard")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              View Dashboard
            </Button>
            <Button 
              className="flex-1"
              onClick={() => setLocation("/contractor/request")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit Another
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </ContractorLayout>
  );
}
