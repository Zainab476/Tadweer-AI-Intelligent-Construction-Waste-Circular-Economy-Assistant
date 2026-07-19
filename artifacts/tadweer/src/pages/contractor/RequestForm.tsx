import { useState } from "react";
import { useLocation } from "wouter";
import { ContractorLayout } from "@/layouts/ContractorLayout";
import { useWasteRequests } from "@/hooks/useWasteRequests";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { UploadCloud, CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const formSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters"),
  wasteType: z.enum(["Concrete", "Steel", "Wood", "Mixed Waste"]),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").max(10000, "Max quantity is 10000"),
  location: z.string().min(2, "Location is required"),
  pickupDate: z.date({
    required_error: "A pickup date is required.",
  }).refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Pickup date cannot be in the past",
  }),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RequestForm() {
  const [, setLocation] = useLocation();
  const { addRequest } = useWasteRequests();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      quantity: undefined as unknown as number,
      location: "",
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    // Fake loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const id = addRequest({
      projectName: values.projectName,
      wasteType: values.wasteType,
      quantity: values.quantity,
      location: values.location,
      pickupDate: values.pickupDate.toISOString(),
      notes: values.notes || "",
    });

    setLocation(`/contractor/confirmation/${id}`);
  };

  return (
    <ContractorLayout title="New Request">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-800">Submit Waste Request</CardTitle>
            <CardDescription className="text-slate-500">
              Provide details about your construction waste for smart matching with recycling plants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Name */}
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel className="text-slate-700">Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Riyadh Infrastructure Project" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Waste Type */}
                  <FormField
                    control={form.control}
                    name="wasteType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Waste Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Concrete">Concrete</SelectItem>
                            <SelectItem value="Steel">Steel</SelectItem>
                            <SelectItem value="Wood">Wood</SelectItem>
                            <SelectItem value="Mixed Waste">Mixed Waste</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantity */}
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Quantity (Tons)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g. 50" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Riyadh, Jeddah, Dammam" {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Pickup Date */}
                  <FormField
                    control={form.control}
                    name="pickupDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-slate-700 mb-1">Pickup Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal bg-white ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Notes */}
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel className="text-slate-700">Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special handling requirements, access instructions, etc." 
                            className="resize-none h-24 bg-white" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Photo Upload (Fake UI) */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-sm font-medium text-slate-700">Photos (Optional)</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer">
                      <UploadCloud size={32} className="mb-3 text-slate-400" />
                      <p className="text-sm font-medium">Drag & drop or click to upload</p>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" size="lg" className="w-full md:w-auto min-w-[200px]" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Find Recycling Solution"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </ContractorLayout>
  );
}
