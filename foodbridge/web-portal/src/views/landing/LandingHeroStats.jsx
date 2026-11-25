import React, { useState, useEffect } from "react";
import { Utensils, Scale, Sparkles, AlertCircle } from "lucide-react";
import { fetchImpactSummary } from "../../services/api";
import { calculateWasteKg } from "../../constants/impact";

export function LandingHeroStats({ fallbackMeals = 0, fallbackActive = 0 }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const data = await fetchImpactSummary();
        if (isMounted && data) {
          setStats(data);
          setIsError(false);
        } else if (isMounted) {
          setIsError(true);
        }
      } catch (_e) {
        if (isMounted) setIsError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const hasData = stats !== null || fallbackMeals > 0;
  const meals = stats?.meals_diverted ?? (fallbackMeals > 0 ? fallbackMeals : null);
  const wasteKg = meals !== null ? calculateWasteKg(meals) : null;
  const activeCount = stats?.available ?? (fallbackActive > 0 ? fallbackActive : null);

  if (loading) {
    return (
      <div
        className="w-full pt-6"
        aria-busy="true"
        aria-label="Loading live impact metrics"
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold font-['Plus_Jakarta_Sans'] text-[#2E7D4F] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#2E7D4F] animate-pulse" />
            <span>Live Platform Activity</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-[#D6E6DC] shadow-xs flex items-center justify-between min-h-[96px] animate-pulse"
            >
              <div className="space-y-2">
                <div className="h-7 w-20 bg-[#E8F0EA] rounded" />
                <div className="h-3.5 w-32 bg-[#E8F0EA] rounded" />
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#E8F0EA] shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-6">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 text-xs font-bold font-['Plus_Jakarta_Sans'] text-[#2E7D4F] uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#2E7D4F] animate-pulse" />
          <span>Live Platform Activity</span>
        </div>
        {(!hasData || isError) && (
          <span className="text-[11px] text-[#5B7363] font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            <span>Live data temporarily unavailable</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Stat 1: Meals Rescued */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6E6DC] shadow-xs flex items-center justify-between hover:shadow-sm transition-shadow min-h-[96px]">
          <div>
            <div className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#16281D]">
              {meals !== null ? meals.toLocaleString() : "-"}
            </div>
            <div className="text-xs text-[#476352] font-semibold mt-0.5">
              Meals Diverted from Waste
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#E8F5E9] text-[#2E7D4F] border border-[#C8E6C9]">
            <Utensils className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 2: Waste Diverted */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6E6DC] shadow-xs flex items-center justify-between hover:shadow-sm transition-shadow min-h-[96px]">
          <div>
            <div className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#E8643C]">
              {wasteKg !== null ? `${wasteKg.toLocaleString()} kg` : "-"}
            </div>
            <div className="text-xs text-[#476352] font-semibold mt-0.5">
              Landfill Waste Avoided
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FBE9E7] text-[#E8643C] border border-[#FFCCBC]">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 3: Active Listings */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6E6DC] shadow-xs flex items-center justify-between hover:shadow-sm transition-shadow min-h-[96px]">
          <div>
            <div className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-[#D97706]">
              {activeCount !== null ? activeCount : "-"}
            </div>
            <div className="text-xs text-[#476352] font-semibold mt-0.5">
              Active Surplus Batches Ready
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#FFF8E1] text-[#D97706] border border-[#FFE082]">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
