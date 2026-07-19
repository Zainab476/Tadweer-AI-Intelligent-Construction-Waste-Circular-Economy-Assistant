import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlantLayout } from "@/layouts/PlantLayout";
import { usePlantItems } from "@/hooks/usePlantItems";
import { ArrowDownToLine, Settings2, CheckCircle2, Package, PackageCheck, Wrench, Leaf, Recycle, ShoppingBag, ArrowRight, Share } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

export default function PlantDashboard() {
  const { items, loaded, startProcessing, completeProcessing } = usePlantItems();
  const { toast } = useToast();
  
  // Loading states for buttons
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

  if (!loaded) return null;

  const handleStartProcessing = (id: string) => {
    setLoadingIds(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      startProcessing(id);
      setLoadingIds(prev => ({ ...prev, [id]: false }));
    }, 1200);
  };

  const handleCompleteProcessing = (id: string) => {
    setLoadingIds(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      completeProcessing(id);
      setLoadingIds(prev => ({ ...prev, [id]: false }));
    }, 1200);
  };

  const handleToast = () => {
    toast({
      title: "Feature coming soon",
      description: "Please contact the plant directly to proceed.",
    });
  };

  const incomingItems = items.filter(i => i.status === "Received" || i.status === "Processing");
  const availableItems = items.filter(i => i.status === "Available");

  const incomingTons = incomingItems.reduce((acc, curr) => acc + curr.quantityTons, 0);
  const processedTons = availableItems.reduce((acc, curr) => acc + (curr.product?.quantityTons || 0), 0);

  const receivedCount = items.filter(i => i.status === "Received").length;
  const processingCount = items.filter(i => i.status === "Processing").length;
  const processedCount = items.filter(i => i.status === "Processed").length;
  const availableCount = availableItems.length;

  const getWasteColor = (type: string) => {
    switch(type) {
      case "Concrete": return "bg-gray-100 text-gray-800 border-gray-200";
      case "Steel": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Wood": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Mixed Waste": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "Just now";
    if (hours === 1) return "1 hour ago";
    if (hours > 24) return `${Math.floor(hours / 24)} days ago`;
    return `${hours} hours ago`;
  };

  return (
    <PlantLayout title="Dashboard">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-10">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <motion.div variants={itemVariants}>
            <Card className="border-slate-200 shadow-sm h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-cyan-100 p-2.5 rounded-md text-cyan-700">
                    <ArrowDownToLine size={20} />
                  </div>
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-bold text-slate-800">{incomingTons}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Incoming Waste (Tons)</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="border-slate-200 shadow-sm h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-blue-100 p-2.5 rounded-md text-blue-700">
                    <Settings2 size={20} />
                  </div>
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-bold text-slate-800">500</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Processing Capacity (Tons/mo)</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="border-slate-200 shadow-sm h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-green-100 p-2.5 rounded-md text-green-700">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-bold text-slate-800">{processedTons}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Processed (Tons)</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="border-slate-200 shadow-sm h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-2">
                  <div className="bg-amber-100 p-2.5 rounded-md text-amber-700">
                    <Package size={20} />
                  </div>
                </div>
                <div className="mt-auto">
                  <h3 className="text-3xl font-bold text-slate-800">{availableCount}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Products Ready</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Processing Pipeline */}
        <motion.div variants={itemVariants}>
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-800">Conversion Pipeline</h3>
              </div>
              <div className="p-6 overflow-x-auto">
                <div className="min-w-[700px] flex items-center justify-between px-4 relative">
                  {/* Connector lines behind nodes */}
                  <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
                  
                  {/* Step 1 */}
                  <div className="flex flex-col items-center gap-3 bg-white z-10 px-2">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${receivedCount > 0 ? "border-amber-500 bg-amber-50 text-amber-600" : "border-slate-200 bg-slate-50 text-slate-400"}`}>
                      <ArrowDownToLine size={24} />
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${receivedCount > 0 ? "text-slate-800" : "text-slate-500"}`}>Received</div>
                      <div className="text-sm text-slate-500 mt-0.5">{receivedCount} {receivedCount === 1 ? "Item" : "Items"}</div>
                    </div>
                  </div>

                  <ArrowRight size={20} className="text-slate-300 z-10 bg-white" />

                  {/* Step 2 */}
                  <div className="flex flex-col items-center gap-3 bg-white z-10 px-2">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${processingCount > 0 ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 bg-slate-50 text-slate-400"}`}>
                      <Settings2 size={24} />
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${processingCount > 0 ? "text-slate-800" : "text-slate-500"}`}>Processing</div>
                      <div className="text-sm text-slate-500 mt-0.5">{processingCount} {processingCount === 1 ? "Item" : "Items"}</div>
                    </div>
                  </div>

                  <ArrowRight size={20} className="text-slate-300 z-10 bg-white" />

                  {/* Step 3 */}
                  <div className="flex flex-col items-center gap-3 bg-white z-10 px-2">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${processedCount > 0 ? "border-primary bg-primary/10 text-primary" : "border-slate-200 bg-slate-50 text-slate-400"}`}>
                      <Recycle size={24} />
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${processedCount > 0 ? "text-slate-800" : "text-slate-500"}`}>Converted</div>
                      <div className="text-sm text-slate-500 mt-0.5">{processedCount} {processedCount === 1 ? "Item" : "Items"}</div>
                    </div>
                  </div>

                  <ArrowRight size={20} className="text-slate-300 z-10 bg-white" />

                  {/* Step 4 */}
                  <div className="flex flex-col items-center gap-3 bg-white z-10 px-2">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 ${availableCount > 0 ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-slate-200 bg-slate-50 text-slate-400"}`}>
                      <ShoppingBag size={24} />
                    </div>
                    <div className="text-center">
                      <div className={`font-semibold ${availableCount > 0 ? "text-slate-800" : "text-slate-500"}`}>Marketplace</div>
                      <div className="text-sm text-slate-500 mt-0.5">{availableCount} {availableCount === 1 ? "Item" : "Items"}</div>
                    </div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Incoming Waste */}
        <motion.div variants={itemVariants} id="incoming">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Incoming Waste</h2>
            <p className="text-slate-500 mt-1">Materials delivered by drivers awaiting processing</p>
          </div>

          {incomingItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <PackageCheck size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">No incoming waste</h3>
              <p className="text-slate-500">New deliveries will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {incomingItems.map(item => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="border-slate-200 shadow-sm overflow-hidden h-full flex flex-col relative">
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${item.status === "Received" ? "bg-amber-500" : "bg-blue-500"}`} />
                      <CardContent className="p-6 pl-8 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{item.projectName}</h3>
                          {item.status === "Received" ? (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none shrink-0 font-medium">Received</Badge>
                          ) : (
                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none shrink-0 font-medium flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                              Processing
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6 text-sm">
                          <Badge variant="outline" className={`font-medium ${getWasteColor(item.wasteType)}`}>
                            {item.wasteType}
                          </Badge>
                          <Badge variant="outline" className="bg-slate-50 font-medium text-slate-600">
                            {item.source}
                          </Badge>
                          <Badge variant="outline" className="bg-slate-50 font-medium text-slate-600">
                            {item.quantityTons} Tons
                          </Badge>
                        </div>

                        {item.status === "Processing" && (
                          <div className="mb-6 mt-auto">
                            <div className="text-xs font-medium text-slate-500 mb-2 flex justify-between">
                              <span>Conversion in progress...</span>
                            </div>
                            <div className="h-2 w-full bg-primary/20 rounded-full overflow-hidden relative">
                              <div className="absolute top-0 bottom-0 left-0 right-0 bg-primary/40 -translate-x-full animate-[shimmer_1.5s_infinite]" />
                            </div>
                          </div>
                        )}
                        
                        {item.status === "Received" && (
                          <div className="text-sm text-slate-500 mb-6 mt-auto">
                            Received {formatTimeAgo(item.receivedAt)}
                          </div>
                        )}

                        <div className={item.status === "Processing" ? "" : ""}>
                          {item.status === "Received" ? (
                            <Button 
                              className="w-full bg-primary hover:bg-primary/90 text-white" 
                              onClick={() => handleStartProcessing(item.id)}
                              disabled={loadingIds[item.id]}
                            >
                              {loadingIds[item.id] ? "Starting..." : "Start Processing"}
                            </Button>
                          ) : (
                            <Button 
                              className="w-full bg-green-600 hover:bg-green-700 text-white" 
                              onClick={() => handleCompleteProcessing(item.id)}
                              disabled={loadingIds[item.id]}
                            >
                              {loadingIds[item.id] ? "Finishing..." : "Mark as Processed"}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Available Products */}
        <motion.div variants={itemVariants} id="products">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Available Products</h2>
            <p className="text-slate-500 mt-1">Recycled materials ready for procurement</p>
          </div>

          {availableItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-slate-300">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <ShoppingBag size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">No products available</h3>
              <p className="text-slate-500">Processed materials will be listed here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableItems.map(item => (
                <Card key={item.id} className="border-slate-200 shadow-sm overflow-hidden h-full flex flex-col relative">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                  <CardContent className="p-6 pl-8 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-bold text-slate-800 leading-tight pr-4">{item.product?.name}</h3>
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none shrink-0 font-medium">Available</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Output</span>
                        <span className="font-medium text-slate-900">{item.product?.quantityTons} Tons</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Yield</span>
                        <span className="font-medium text-slate-900">{item.product?.yieldPercent}%</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</span>
                        <span className="font-medium text-slate-900 line-clamp-1" title={item.projectName}>{item.projectName}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Waste Type</span>
                        <div>
                          <Badge variant="outline" className={`font-medium py-0 px-2 text-xs ${getWasteColor(item.wasteType)}`}>
                            {item.wasteType}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6 mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-700 shrink-0">
                          <Wrench size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold text-emerald-800/70 uppercase tracking-wider">Primary Use</span>
                          <span className="text-sm font-medium text-emerald-900 leading-tight">{item.product?.usedFor}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-1.5 rounded text-emerald-700 shrink-0">
                          <Leaf size={16} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-semibold text-emerald-800/70 uppercase tracking-wider">CO₂ Saved</span>
                          <span className="text-sm font-medium text-emerald-900 leading-tight">{item.product?.co2SavedTons} Tons</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-primary text-primary hover:bg-primary/5 hover:text-primary"
                        onClick={handleToast}
                      >
                        Request Material
                      </Button>
                      <Button 
                        variant="outline" 
                        className="px-4 shrink-0 text-slate-600 hover:text-slate-900"
                        onClick={handleToast}
                        title="Share Listing"
                      >
                        <Share size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}} />
    </PlantLayout>
  );
}
