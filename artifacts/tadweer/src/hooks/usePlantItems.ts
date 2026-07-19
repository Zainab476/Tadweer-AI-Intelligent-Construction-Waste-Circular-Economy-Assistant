import { useState, useEffect } from "react";
import type { WasteType } from "./useWasteRequests";

export type PlantItemStatus = "Received" | "Processing" | "Processed" | "Available";

export interface RecycledProduct {
  name: string;
  quantityTons: number;
  yieldPercent: number;
  usedFor: string;
  co2SavedTons: number;
}

export interface PlantItem {
  id: string;
  requestId: string;
  projectName: string;
  source: string;
  wasteType: WasteType;
  quantityTons: number;
  status: PlantItemStatus;
  receivedAt: string;
  processingStartedAt?: string;
  processedAt?: string;
  product?: RecycledProduct;
}

const PLANT_STORAGE_KEY = "tadweer_plant_items";
const REQUESTS_STORAGE_KEY = "tadweer_waste_requests";

export function generateProduct(wasteType: WasteType, quantityTons: number): RecycledProduct {
  const yieldMap: Record<WasteType, { name: string; yield: number; use: string; co2Rate: number }> = {
    Concrete: { name: "Recycled Concrete Aggregate", yield: 0.90, use: "Road Construction & Foundation Fill", co2Rate: 0.21 },
    Steel:    { name: "Reclaimed Steel Billet",       yield: 0.95, use: "Structural Manufacturing & Fabrication", co2Rate: 0.34 },
    Wood:     { name: "Engineered Wood Chips",         yield: 0.80, use: "Biomass Energy & Particleboard Production", co2Rate: 0.19 },
    "Mixed Waste": { name: "Secondary Raw Materials", yield: 0.75, use: "General Construction Backfill", co2Rate: 0.25 },
  };
  const config = yieldMap[wasteType];
  return {
    name: config.name,
    quantityTons: parseFloat((quantityTons * config.yield).toFixed(1)),
    yieldPercent: Math.round(config.yield * 100),
    usedFor: config.use,
    co2SavedTons: parseFloat((quantityTons * config.co2Rate).toFixed(1)),
  };
}

export function usePlantItems() {
  const [items, setItems] = useState<PlantItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let plantItems: PlantItem[] = [];
    const stored = localStorage.getItem(PLANT_STORAGE_KEY);
    if (stored) {
      try { plantItems = JSON.parse(stored); } catch { plantItems = []; }
    }

    const reqStored = localStorage.getItem(REQUESTS_STORAGE_KEY);
    if (reqStored) {
      try {
        const requests = JSON.parse(reqStored);
        const completedReqs = requests.filter((r: any) => r.status === "Completed");
        completedReqs.forEach((req: any) => {
          if (!plantItems.some(p => p.requestId === req.id)) {
            plantItems.push({
              id: `plant-${req.id}`,
              requestId: req.id,
              projectName: req.projectName,
              source: req.location,
              wasteType: req.wasteType,
              quantityTons: req.quantity,
              status: "Received",
              receivedAt: new Date().toISOString(),
            });
          }
        });
      } catch {}
    }

    if (!plantItems.some(p => p.status === "Received" || p.status === "Processing")) {
      plantItems.push({
        id: "plant-demo-001",
        requestId: "demo-req-001",
        projectName: "Riyadh Metro Extension",
        source: "Riyadh",
        wasteType: "Concrete",
        quantityTons: 120,
        status: "Received",
        receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      });
    }

    if (!plantItems.some(p => p.status === "Available")) {
      const qty = 300;
      plantItems.push({
        id: "plant-demo-002",
        requestId: "demo-req-002",
        projectName: "NEOM Phase 1 Clearance",
        source: "Tabuk",
        wasteType: "Mixed Waste",
        quantityTons: qty,
        status: "Available",
        receivedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        processingStartedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        product: generateProduct("Mixed Waste", qty),
      });
    }

    localStorage.setItem(PLANT_STORAGE_KEY, JSON.stringify(plantItems));
    setItems(plantItems);
    setLoaded(true);
  }, []);

  const persistAndSet = (updated: PlantItem[]) => {
    setItems(updated);
    localStorage.setItem(PLANT_STORAGE_KEY, JSON.stringify(updated));
  };

  const startProcessing = (id: string) => {
    persistAndSet(items.map(item =>
      item.id === id
        ? { ...item, status: "Processing" as PlantItemStatus, processingStartedAt: new Date().toISOString() }
        : item
    ));
  };

  const completeProcessing = (id: string) => {
    persistAndSet(items.map(item => {
      if (item.id !== id) return item;
      const product = generateProduct(item.wasteType, item.quantityTons);
      return {
        ...item,
        status: "Available" as PlantItemStatus,
        processedAt: new Date().toISOString(),
        product,
      };
    }));
  };

  return { items, loaded, startProcessing, completeProcessing };
}
