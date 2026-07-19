export type WasteType = "Concrete" | "Steel" | "Wood" | "Mixed Waste";

export interface RecyclingPlant {
  id: string;
  name: string;
  location: string;
  acceptedMaterials: WasteType[];
  capacityTons: number;
  availableCapacityTons: number;
  distanceKm: number;       // base distance (will be adjusted by request location)
  co2PerTon: number;        // kg CO₂ saved per ton recycled
  rating: number;           // 1–5, one decimal
  verifiedSince: string;    // e.g. "2019"
  turnaroundDays: number;   // typical pickup turnaround
}

export const plants: RecyclingPlant[] = [
  {
    id: "rgp",
    name: "Riyadh Green Plant",
    location: "Riyadh",
    acceptedMaterials: ["Concrete", "Mixed Waste"],
    capacityTons: 500,
    availableCapacityTons: 320,
    distanceKm: 12,
    co2PerTon: 0.21,
    rating: 4.8,
    verifiedSince: "2018",
    turnaroundDays: 2,
  },
  {
    id: "srs",
    name: "Saudi Recycling Solutions",
    location: "Riyadh",
    acceptedMaterials: ["Steel", "Mixed Waste"],
    capacityTons: 800,
    availableCapacityTons: 560,
    distanceKm: 18,
    co2PerTon: 0.34,
    rating: 4.6,
    verifiedSince: "2016",
    turnaroundDays: 3,
  },
  {
    id: "jwrp",
    name: "Jeddah Wood Recovery Park",
    location: "Jeddah",
    acceptedMaterials: ["Wood", "Mixed Waste"],
    capacityTons: 300,
    availableCapacityTons: 180,
    distanceKm: 8,
    co2PerTon: 0.19,
    rating: 4.5,
    verifiedSince: "2020",
    turnaroundDays: 1,
  },
  {
    id: "nrc",
    name: "NEOM Recycling Center",
    location: "Tabuk",
    acceptedMaterials: ["Concrete", "Steel", "Wood", "Mixed Waste"],
    capacityTons: 1200,
    availableCapacityTons: 900,
    distanceKm: 25,
    co2PerTon: 0.28,
    rating: 4.9,
    verifiedSince: "2022",
    turnaroundDays: 4,
  },
  {
    id: "drc",
    name: "Dammam Recycling Co.",
    location: "Dammam",
    acceptedMaterials: ["Steel", "Concrete"],
    capacityTons: 600,
    availableCapacityTons: 420,
    distanceKm: 22,
    co2PerTon: 0.30,
    rating: 4.4,
    verifiedSince: "2017",
    turnaroundDays: 3,
  },
];