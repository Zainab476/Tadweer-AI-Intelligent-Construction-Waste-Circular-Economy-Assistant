import { useState } from "react";
import { ContractorLayout } from "@/layouts/ContractorLayout";
import { useWasteRequests } from "@/hooks/useWasteRequests";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Requests() {
  const { requests } = useWasteRequests();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
    <ContractorLayout title="My Requests">
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by project name or location..." 
              className="pl-9 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-500" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending Smart Matching">Pending Smart Matching</SelectItem>
                <SelectItem value="Matched">Matched</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Collected">Collected</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-600 py-4">Project Name</TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4">Waste Type</TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4">Quantity</TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4">Location</TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4">Pickup Date</TableHead>
                  <TableHead className="font-semibold text-slate-600 py-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-slate-50/50">
                    <TableCell className="font-medium text-slate-800 py-4">{req.projectName}</TableCell>
                    <TableCell className="text-slate-600 py-4">{req.wasteType}</TableCell>
                    <TableCell className="text-slate-600 py-4">{req.quantity} Tons</TableCell>
                    <TableCell className="text-slate-600 py-4">{req.location}</TableCell>
                    <TableCell className="text-slate-600 py-4">
                      {new Date(req.pickupDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className={`font-medium ${getStatusColor(req.status)}`}>
                        {req.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="h-8 w-8 text-slate-300 mb-2" />
                        <p className="font-medium text-slate-600">No requests found</p>
                        <p className="text-sm">Try adjusting your search or filters.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </motion.div>
    </ContractorLayout>
  );
}
