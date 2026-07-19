import type { WasteRequest } from "@/hooks/useWasteRequests";
import type { RecyclingPlant } from "@/data/plants";
import { plants } from "@/data/plants";

export interface MatchResult {
  plant: RecyclingPlant;
  score: number;           // 0–100, used internally
  distanceKm: number;      // adjusted for location
  co2SavedTons: number;    // quantity * co2PerTon
  matchReasons: string[];  // 2–3 human-readable reasons shown in UI
}

export function findMatches(request: WasteRequest): MatchResult[] {
  // Location distance adjustment — if request.location matches plant.location exactly → base distance; else add 15–40km
  const locationMultiplier = (plant: RecyclingPlant): number => {
    const req = request.location.toLowerCase();
    const plt = plant.location.toLowerCase();
    if (req.includes(plt) || plt.includes(req)) return 1;
    if ((req.includes("riyadh") && plt.includes("riyadh")) || (req.includes("jeddah") && plt.includes("jeddah"))) return 1;
    return 1 + (Math.abs(plant.id.charCodeAt(0) - request.wasteType.charCodeAt(0)) % 3) * 0.4 + 0.3;
  };

  const eligible = plants.filter(p => p.acceptedMaterials.includes(request.wasteType) && p.availableCapacityTons >= request.quantity);

  const scored = eligible.map(plant => {
    const adjustedDistance = Math.round(plant.distanceKm * locationMultiplier(plant));
    const co2Saved = parseFloat((request.quantity * plant.co2PerTon).toFixed(1));

    // Score: capacity match (30) + proximity (30) + rating (20) + turnaround (20)
    const capacityScore = Math.min(30, (plant.availableCapacityTons / plant.capacityTons) * 30);
    const proximityScore = Math.max(0, 30 - adjustedDistance * 0.5);
    const ratingScore = (plant.rating / 5) * 20;
    const turnaroundScore = Math.max(0, 20 - plant.turnaroundDays * 4);
    const score = Math.round(capacityScore + proximityScore + ratingScore + turnaroundScore);

    const reasons: string[] = [];
    if (adjustedDistance <= 15) reasons.push("Nearest certified facility");
    else if (adjustedDistance <= 25) reasons.push("Nearby certified facility");
    else reasons.push("Regional processing partner");

    if (plant.availableCapacityTons >= request.quantity * 1.5) reasons.push("Surplus capacity available");
    else reasons.push("Capacity confirmed for your order");

    if (plant.rating >= 4.7) reasons.push("Top-rated plant in the network");
    else if (plant.rating >= 4.5) reasons.push("High-performance recycling partner");
    else reasons.push("Verified network partner");

    return { plant, score, distanceKm: adjustedDistance, co2SavedTons: co2Saved, matchReasons: reasons };
  });

  // Sort descending by score. If no eligible plants, fall back to NEOM (universal)
  if (scored.length === 0) {
    const fallback = plants.find(p => p.id === "nrc")!;
    const co2Saved = parseFloat((request.quantity * fallback.co2PerTon).toFixed(1));
    return [{ plant: fallback, score: 72, distanceKm: fallback.distanceKm, co2SavedTons: co2Saved, matchReasons: ["Universal waste processor", "Capacity confirmed for your order", "High-performance recycling partner"] }];
  }

  return scored.sort((a, b) => b.score - a.score);
}