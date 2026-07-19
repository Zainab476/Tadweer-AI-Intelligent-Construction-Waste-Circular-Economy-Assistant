import { useMemo } from "react";

// Read raw data from localStorage (no React state needed — pure read)
function readLS<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

export interface ImpactMetrics {
  totalWasteDivertedTons: number;       // sum of all request quantities
  co2ReducedTons: number;               // totalWaste × 0.5
  recycledMaterialTons: number;         // totalWaste × 0.9
  truckTripsOptimized: number;          // floor(totalWaste / 15)
  totalRequests: number;
  completedRequests: number;
  treesEquivalent: number;              // co2Reduced × 45 (1 ton CO₂ ≈ 45 trees)
  homesEquivalent: number;              // floor(recycledMaterial / 8)
  wasteByType: { name: string; value: number; color: string }[];
  monthlyTrend: { month: string; waste: number; co2: number; recycled: number }[];
}

export function useImpactData(): ImpactMetrics {
  return useMemo(() => {
    const requests: any[] = readLS("tadweer_waste_requests", []);
    const plantItems: any[] = readLS("tadweer_plant_items", []);

    const totalWaste = requests.reduce((s, r) => s + (r.quantity ?? 0), 0);
    const co2Reduced = parseFloat((totalWaste * 0.5).toFixed(1));
    const recycledMaterial = parseFloat((totalWaste * 0.9).toFixed(1));
    const truckTrips = Math.floor(totalWaste / 15);
    const completedReqs = requests.filter(r => r.status === "Completed").length;

    // Waste by type
    const typeMap: Record<string, number> = {};
    requests.forEach(r => { typeMap[r.wasteType] = (typeMap[r.wasteType] ?? 0) + r.quantity; });
    const typeColors: Record<string, string> = {
      Concrete: "#6b7280",
      Steel:    "#3b82f6",
      Wood:     "#f59e0b",
      "Mixed Waste": "#a855f7",
    };
    const wasteByType = Object.entries(typeMap).map(([name, value]) => ({
      name, value, color: typeColors[name] ?? "#22c55e"
    }));

    // Monthly trend — generate 6 months of synthetic growth ending at real totals
    const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    const monthlyTrend = months.map((month, i) => {
      const progress = (i + 1) / months.length;
      const jitter = 0.85 + Math.random() * 0.3; // slight variation
      return {
        month,
        waste:    parseFloat((totalWaste * progress * jitter).toFixed(0)),
        co2:      parseFloat((co2Reduced * progress * jitter).toFixed(1)),
        recycled: parseFloat((recycledMaterial * progress * jitter).toFixed(0)),
      };
    });
    // Pin last month to real values
    if (monthlyTrend.length > 0) {
      monthlyTrend[monthlyTrend.length - 1] = {
        month: "Jul",
        waste: totalWaste,
        co2: co2Reduced,
        recycled: recycledMaterial,
      };
    }

    return {
      totalWasteDivertedTons: totalWaste,
      co2ReducedTons: co2Reduced,
      recycledMaterialTons: recycledMaterial,
      truckTripsOptimized: truckTrips,
      totalRequests: requests.length,
      completedRequests: completedReqs,
      treesEquivalent: Math.round(co2Reduced * 45),
      homesEquivalent: Math.floor(recycledMaterial / 8),
      wasteByType,
      monthlyTrend,
    };
  }, []); // compute once — data is static in localStorage
}
