import { useWasteRequests } from "@/hooks/useWasteRequests";
import { DriverLayout } from "@/layouts/DriverLayout";
import { motion } from "framer-motion";
import { Weight, MapPin, Calendar, Route, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function DriverDashboard() {
  const { requests, updateStatus, loaded } = useWasteRequests();
  const [, setLocation] = useLocation();

  if (!loaded) return null;

  const availableJobs = requests.filter(r => r.status === "Matched");
  const activeJobs = requests.filter(r => ["Scheduled", "On The Way", "Collected"].includes(r.status));

  const getDistance = (wasteType: string) => {
    switch (wasteType) {
      case "Concrete": return 8;
      case "Steel": return 12;
      case "Wood": return 6;
      case "Mixed Waste": return 15;
      default: return 10;
    }
  };

  const getWasteColor = (type: string) => {
    switch(type) {
      case "Concrete": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Steel": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Wood": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Mixed Waste": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Scheduled": return "bg-purple-100 text-purple-800 border-purple-200";
      case "On The Way": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Collected": return "bg-teal-100 text-teal-800 border-teal-200";
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <DriverLayout title="Dashboard">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Available Pickups</h2>
            <p className="text-slate-500 mt-1">Jobs matched by the Tadweer AI engine and ready for acceptance</p>
          </div>
          <div className="hidden sm:block">
            <Badge variant="outline" className="text-sm py-1 bg-white">
              {availableJobs.length} jobs available
            </Badge>
          </div>
        </div>

        {availableJobs.length === 0 && activeJobs.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <Truck size={32} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No jobs available</h3>
            <p className="text-slate-500">Check back soon for new pickups.</p>
          </div>
        )}

        {availableJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableJobs.map(job => (
              <motion.div key={job.id} variants={itemVariants}>
                <Card className="border-slate-200 shadow-sm overflow-hidden flex flex-col h-full relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
                  <CardContent className="p-6 flex flex-col flex-1 mt-2">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{job.projectName}</h3>
                      <Badge variant="outline" className={`font-medium ml-2 shrink-0 ${getWasteColor(job.wasteType)}`}>
                        {job.wasteType}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Weight size={16} className="text-slate-400" />
                        <span className="font-medium text-slate-900">{job.quantity} Tons</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin size={16} className="text-slate-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar size={16} className="text-slate-400" />
                        <span>{new Date(job.pickupDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Route size={16} className="text-slate-400" />
                        <span>~{getDistance(job.wasteType)} km away</span>
                      </div>
                    </div>

                    {job.notes && (
                      <p className="text-sm text-slate-500 italic line-clamp-1 mb-4 mt-auto">"{job.notes}"</p>
                    )}

                    <div className={job.notes ? "" : "mt-auto"}>
                      <Button 
                        className="w-full mt-4 bg-primary hover:bg-primary/90 text-white shadow-sm"
                        onClick={() => {
                          updateStatus(job.id, "Scheduled", "Mohammed Al-Rashidi");
                          setLocation(`/driver/job/${job.id}`);
                        }}
                      >
                        Accept Job
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {activeJobs.length > 0 && (
          <motion.div variants={itemVariants} className="mt-12">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">My Active Jobs</h3>
            <div className="space-y-3">
              {activeJobs.map(job => (
                <Card key={job.id} className="border-slate-200 shadow-sm">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-800">{job.projectName}</h4>
                      <p className="text-sm text-slate-500">{job.location} • {job.quantity} Tons</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <Badge variant="outline" className={getStatusColor(job.status)}>
                        {job.status}
                        {job.status === "On The Way" && (
                          <span className="ml-2 w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
                        )}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => setLocation(`/driver/job/${job.id}`)}>
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </DriverLayout>
  );
}