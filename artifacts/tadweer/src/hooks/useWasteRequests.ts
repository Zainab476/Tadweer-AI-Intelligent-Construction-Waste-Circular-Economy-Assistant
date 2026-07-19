import { useState, useEffect } from "react";

export type WasteType = "Concrete" | "Steel" | "Wood" | "Mixed Waste";
export type RequestStatus = "Pending Smart Matching" | "Matched" | "Scheduled" | "Collected" | "Completed";

export interface WasteRequest {
  id: string;
  projectName: string;
  wasteType: WasteType;
  quantity: number;
  location: string;
  pickupDate: string;
  notes: string;
  status: RequestStatus;
  createdAt: string;
}

const STORAGE_KEY = "tadweer_waste_requests";

const SEED_DATA: WasteRequest[] = [
  {
    id: crypto.randomUUID(),
    projectName: "Riyadh Metro Extension",
    wasteType: "Concrete",
    quantity: 120,
    location: "Riyadh",
    pickupDate: "2025-08-10",
    notes: "",
    status: "Completed",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    projectName: "Jeddah Waterfront Tower",
    wasteType: "Steel",
    quantity: 45,
    location: "Jeddah",
    pickupDate: "2025-08-18",
    notes: "Includes rebar and structural beams",
    status: "Scheduled",
    createdAt: new Date().toISOString(),
  },
  {
    id: crypto.randomUUID(),
    projectName: "NEOM Phase 1 Clearance",
    wasteType: "Mixed Waste",
    quantity: 300,
    location: "Tabuk",
    pickupDate: "2025-08-25",
    notes: "",
    status: "Pending Smart Matching",
    createdAt: new Date().toISOString(),
  },
];

export function useWasteRequests() {
  const [requests, setRequests] = useState<WasteRequest[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRequests(JSON.parse(stored));
      } catch (e) {
        setRequests(SEED_DATA);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      }
    } else {
      setRequests(SEED_DATA);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    }
  }, []);

  const addRequest = (data: Omit<WasteRequest, "id" | "status" | "createdAt">) => {
    const newRequest: WasteRequest = {
      ...data,
      id: crypto.randomUUID(),
      status: "Pending Smart Matching",
      createdAt: new Date().toISOString(),
    };
    
    const updated = [newRequest, ...requests];
    setRequests(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    return newRequest.id;
  };

  const getRequest = (id: string) => {
    return requests.find((req) => req.id === id);
  };

  return {
    requests,
    addRequest,
    getRequest,
  };
}
