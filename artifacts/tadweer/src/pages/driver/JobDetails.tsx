import { useWasteRequests } from "@/hooks/useWasteRequests";
import { DriverLayout } from "@/layouts/DriverLayout";
import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { findMatches } from "@/utils/matchingEngine";
import { 
  ArrowLeft, FileText, UserCheck, Navigation, Package, Factory,
  Building, PackageCheck, Route, Star, MapPin, Weight,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const { getRequest, updateStatus, loaded } = useWasteRequests();
  const [, setLocation] = useLocation();
  const [isUpdating, setIsUpdating] = useState(false);

  // Re-fetch request from hook instead of state to stay updated
  const request = getRequest(id || "");

  useEffect(() => {
    if (loaded && !request) {
      setLocation("/driver/dashboard");
    }
  }, [loaded, request, setLocation]);

  if (!loaded || !request) return null;

  const matchResult = findMatches(request)[0];
  const plant = matchResult?.plant;

  // Status map to order for timeline
  const statuses = ["Matched", "Scheduled", "On The Way", "Collected", "Completed"];
  const currentIndex = statuses.indexOf(request.status);

  const getTimelineSteps = () => {
    return [
      {
        id: "step1",
        label: "Request Received",
        icon: FileText,
        isComplete: true, // Always complete
        isActive: false
      },
      {
        id: "step2",
        label: "Driver Accepted",
        icon: UserCheck,
        isComplete: currentIndex >= 1, // Scheduled or further
        isActive: false // Never active, just a quick step
      },
      {
        id: "step3",
        label: "On The Way",
        icon: Navigation,
        isComplete: currentIndex >= 3, // Collected or further
        isActive: currentIndex === 1 || currentIndex === 2 // Scheduled or On The Way
      },
      {
        id: "step4",
        label: "Waste Collected",
        icon: Package,
        isComplete: currentIndex >= 4, // Completed
        isActive: currentIndex === 3 // Collected
      },
      {
        id: "step5",
        label: "Delivered to Plant",
        icon: Factory,
        isComplete: currentIndex === 4,
        isActive: currentIndex === 4 // We treat Completed as end state, could be active or just complete
      }
    ];
  };

  const timelineSteps = getTimelineSteps();

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Matched": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Scheduled": return "bg-purple-100 text-purple-800 border-purple-200";
      case "On The Way": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Collected": return "bg-teal-100 text-teal-800 border-teal-200";
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getWasteTypeDesc = (type: string) => {
    switch (type) {
      case "Concrete": return "Demolition debris and structural concrete";
      case "Steel": return "Structural steel, rebar and metal components";
      case "Wood": return "Timber offcuts, formwork and wood pallets";
      case "Mixed Waste": return "Combined construction materials";
      default: return "";
    }
  };

  const handleActionClick = () => {
    setIsUpdating(true);
    setTimeout(() => {
      let nextStatus = "Scheduled" as any;
      if (request.status === "Matched") nextStatus = "Scheduled";
      else if (request.status === "Scheduled") nextStatus = "On The Way";
      else if (request.status === "On The Way") nextStatus = "Collected";
      else if (request.status === "Collected") nextStatus = "Completed";

      updateStatus(request.id, nextStatus, "Mohammed Al-Rashidi");
      setIsUpdating(false);
    }, 1000);
  };

  const getButtonProps = () => {
    switch (request.status) {
      case "Matched":
        return { label: "Accept Job", desc: "You will be assigned to this pickup" };
      case "Scheduled":
        return { label: "Start Trip", desc: "Notify contractor you are heading to site" };
      case "On The Way":
        return { label: "Confirm Waste Collection", desc: "Verify materials are loaded onto truck" };
      case "Collected":
        return { label: "Confirm Delivery to Plant", desc: "Mark job as fully completed" };
      case "Completed":
        return null;
      default:
        return { label: "Action", desc: "" };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <DriverLayout title={request.projectName}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-24 md:pb-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="pl-0 gap-2 text-slate-500 hover:text-slate-900" onClick={() => setLocation("/driver/dashboard")}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
          <Badge variant="outline" className={`font-medium ${getStatusBadge(request.status)}`}>
            {request.status}
            {request.status === "On The Way" && (
              <span className="ml-2 w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse inline-block" />
            )}
          </Badge>
        </div>

        {/* Timeline */}
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardContent className="p-6">
            {/* Desktop Timeline */}
            <div className="hidden md:flex items-center justify-between relative">
              <div className="absolute left-6 right-6 top-5 h-1 bg-slate-100 rounded-full z-0"></div>
              {timelineSteps.map((step, index) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-3 w-32">
                  <div className="flex items-center w-full">
                    {index > 0 && (
                      <div className={`h-1 w-full absolute left-[-50%] right-[50%] top-5 z-0 transition-colors duration-500 ${step.isComplete || step.isActive ? "bg-primary" : "bg-transparent"}`}></div>
                    )}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500
                      ${step.isComplete ? "bg-primary text-white" : 
                        step.isActive ? "bg-white border-2 border-primary text-primary shadow-[0_0_0_4px_rgba(34,197,94,0.1)]" : 
                        "bg-slate-100 text-slate-400"}
                    `}>
                      <step.icon size={18} strokeWidth={step.isComplete ? 3 : 2} />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${step.isComplete || step.isActive ? "text-primary" : "text-slate-400"}`}>
                      Step {index + 1}
                    </div>
                    <div className={`text-sm font-semibold ${step.isActive ? "text-slate-900" : "text-slate-600"}`}>
                      {step.label}
                    </div>
                    {step.isActive && (
                      <div className="text-[10px] text-primary font-medium mt-1 uppercase tracking-wider animate-pulse">
                        In Progress
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden flex flex-col space-y-6 relative ml-2">
              <div className="absolute top-4 bottom-4 left-4 w-1 bg-slate-100 rounded-full z-0"></div>
              {timelineSteps.map((step, index) => (
                <div key={step.id} className="relative z-10 flex items-start gap-4">
                  {index > 0 && (
                    <div className={`absolute left-4 top-[-24px] bottom-[24px] w-1 z-0 transition-colors duration-500 ${step.isComplete || step.isActive ? "bg-primary" : "bg-transparent"}`}></div>
                  )}
                  <div className={`
                    w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500 mt-1
                    ${step.isComplete ? "bg-primary text-white" : 
                      step.isActive ? "bg-white border-2 border-primary text-primary shadow-[0_0_0_4px_rgba(34,197,94,0.1)]" : 
                      "bg-slate-100 text-slate-400"}
                  `}>
                    <step.icon size={16} strokeWidth={step.isComplete ? 3 : 2} />
                  </div>
                  <div className="pt-1">
                    <div className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${step.isComplete || step.isActive ? "text-primary" : "text-slate-400"}`}>
                      Step {index + 1}
                    </div>
                    <div className={`text-base font-semibold ${step.isActive ? "text-slate-900" : "text-slate-600"}`}>
                      {step.label}
                    </div>
                    {step.isActive && (
                      <div className="text-xs text-primary font-medium mt-0.5">
                        In Progress
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Job Details */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                  <Building size={18} className="text-slate-400" />
                  Construction Site
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 mb-1">Project</h4>
                    <p className="font-semibold text-slate-900 text-lg">{request.projectName}</p>
                    <p className="text-slate-600 text-sm">Al-Banna Construction Co.</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 mb-1">Location</h4>
                    <p className="font-medium text-slate-800 flex items-start gap-1">
                      <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      {request.location}, Saudi Arabia
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 mb-1">Pickup Date</h4>
                    <p className="font-medium text-slate-800 flex items-center gap-1.5">
                      <Calendar size={16} className="text-slate-400" />
                      {new Date(request.pickupDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  {request.notes && (
                    <div className="sm:col-span-2">
                      <h4 className="text-sm font-semibold text-slate-500 mb-1">Special Instructions</h4>
                      <div className="bg-amber-50 border border-amber-100 rounded-md p-3">
                        <p className="text-amber-800 text-sm italic">"{request.notes}"</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Waste Info */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                  <Package size={18} className="text-slate-400" />
                  Waste Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-1">
                    <Badge variant="outline" className="mb-2 bg-slate-50 text-slate-700">{request.wasteType}</Badge>
                    <p className="text-slate-600 text-sm">{getWasteTypeDesc(request.wasteType)}</p>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-500 mb-1">Total Quantity</div>
                      <div className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Weight size={20} className="text-slate-400" />
                        {request.quantity} <span className="text-base font-medium text-slate-500">Tons</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1">Est. {request.quantity * 1000} kg</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            
            {/* Destination */}
            {plant && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                  <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                    <Factory size={18} className="text-slate-400" />
                    Destination Plant
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-1">{plant.name}</h4>
                      <p className="text-slate-500 flex items-center gap-1.5 text-sm">
                        <MapPin size={14} />
                        {plant.location}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 py-3 border-y border-slate-100">
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><Route size={14} /> Distance</div>
                        <div className="font-semibold text-slate-800">~{matchResult.distanceKm} km</div>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1"><Star size={14} /> Rating</div>
                        <div className="font-semibold text-amber-600">{plant.rating}/5.0</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs font-semibold text-slate-500 mb-2">Accepted Materials</div>
                      <div className="flex flex-wrap gap-2">
                        {plant.acceptedMaterials.map(mat => (
                          <Badge key={mat} variant="secondary" className="text-xs bg-slate-100 hover:bg-slate-100 text-slate-600">
                            {mat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Card (Sticky on mobile) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 md:relative md:p-0 md:bg-transparent md:border-none md:shadow-none">
              <Card className="border-none shadow-none md:border md:border-slate-200 md:shadow-sm h-full">
                <CardContent className="p-0 md:p-6 h-full flex flex-col justify-center">
                  {buttonProps ? (
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-600 mb-3 hidden md:block">
                        Ready to proceed?
                      </p>
                      <Button 
                        size="lg" 
                        className="w-full text-base font-semibold h-14 bg-primary hover:bg-primary/90 text-white shadow-sm transition-all"
                        onClick={handleActionClick}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Updating..." : buttonProps.label}
                      </Button>
                      <p className="text-xs text-slate-500 mt-3 hidden md:block">
                        {buttonProps.desc}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 p-4 bg-green-50 border border-green-100 rounded-lg text-green-700">
                      <PackageCheck size={24} />
                      <span className="font-bold">Delivery Complete</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </motion.div>
    </DriverLayout>
  );
}