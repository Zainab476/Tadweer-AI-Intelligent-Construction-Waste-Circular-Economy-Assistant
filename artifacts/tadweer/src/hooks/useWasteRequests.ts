import { useState, useEffect } from "react";

export type WasteType = "Concrete" | "Steel" | "Wood" | "Mixed Waste";
export type RequestStatus = "Pending Smart Matching" | "Matched" | "Scheduled" | "On The Way" | "Collected" | "Completed";

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
  assignedDriverName?: string;
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    let loaded: WasteRequest[] = [];
    if (stored) {
      try { loaded = JSON.parse(stored); }
      catch { loaded = SEED_DATA; localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA)); }
    } else {
      loaded = SEED_DATA;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    }

    if (!loaded.some(r => r.status === "Matched")) {
      const demoJob: WasteRequest = {
        id: "driver-demo-001",
        projectName: "King Abdullah Financial District",
        wasteType: "Steel",
        quantity: 85,
        location: "Riyadh",
        pickupDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        notes: "Heavy structural steel, crane access required",
        status: "Matched",
        createdAt: new Date().toISOString(),
      };
      loaded = [demoJob, ...loaded];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded));
    }

    setRequests(loaded);
    setLoaded(true);
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

  const updateStatus = (id: string, status: RequestStatus, driverName?: string) => {
    const updated = requests.map(r =>
      r.id === id
        ? { ...r, status, ...(driverName ? { assignedDriverName: driverName } : {}) }
        : r
    );
    setRequests(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getRequest = (id: string) => {
    return requests.find((req) => req.id === id);
  };

  return {
    requests,
    loaded,
    addRequest,
    updateStatus,
    getRequest,
  };
}
