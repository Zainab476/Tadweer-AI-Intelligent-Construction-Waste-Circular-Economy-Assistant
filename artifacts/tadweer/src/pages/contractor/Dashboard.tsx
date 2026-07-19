import { useWasteRequests } from "@/hooks/useWasteRequests";
import { ContractorLayout } from "@/layouts/ContractorLayout";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, TrendingUp, Leaf, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link, useLocation } from "wouter";

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

export default function Dashboard() {
  const { requests } = useWasteRequests();
  const [, setLocation] = useLocation();

  const activeRequests = requests.filter(r => r.status !== "Completed").length;
  const completedRequests = requests.filter(r => r.status === "Completed").length;
  const totalWaste = requests.reduce((acc, r) => acc + r.quantity, 0);
  const co2Saved = (totalWaste * 0.82).toFixed(0);

  const stats = [
    { label: "Active Requests", value: activeRequests, icon: Activity, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Completed Requests", value: completedRequests, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Total Waste", value: `${totalWaste} Tons`, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "CO₂ Saved", value: `${co2Saved} Tons`, icon: Leaf, color: "text-primary", bg: "bg-primary/20" },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Pending Smart Matching": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Matched": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Scheduled": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Collected": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Completed": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <ContractorLayout title="Dashboard">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8">
        {/* Quick Actions */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Overview</h2>
            <p className="text-slate-500 mt-1">Track your waste management impact.</p>
          </div>
          <Button onClick={() => setLocation("/contractor/request")} className="gap-2 shadow-sm">
            <PlusCircle size={18} />
            <span className="hidden sm:inline">New Request</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                      <stat.icon size={20} />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Requests */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Recent Requests</h3>
            <Link href="/contractor/requests" className="text-sm text-primary hover:underline font-medium">
              View All
            </Link>
          </div>
          
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="font-semibold text-slate-600">Project Name</TableHead>
                    <TableHead className="font-semibold text-slate-600">Waste Type</TableHead>
                    <TableHead className="font-semibold text-slate-600">Quantity</TableHead>
                    <TableHead className="font-semibold text-slate-600">Location</TableHead>
                    <TableHead className="font-semibold text-slate-600">Pickup Date</TableHead>
                    <TableHead className="font-semibold text-slate-600">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.slice(0, 5).map((req) => (
                    <TableRow key={req.id} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-800">{req.projectName}</TableCell>
                      <TableCell className="text-slate-600">{req.wasteType}</TableCell>
                      <TableCell className="text-slate-600">{req.quantity} Tons</TableCell>
                      <TableCell className="text-slate-600">{req.location}</TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(req.pickupDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`font-medium ${getStatusColor(req.status)}`}>
                          {req.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {requests.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                        No requests found. Create your first request.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </ContractorLayout>
  );
}
