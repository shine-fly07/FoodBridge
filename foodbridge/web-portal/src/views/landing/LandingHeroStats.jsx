import React, { useState, useEffect } from "react";
import { Utensils, Scale, Sparkles, AlertCircle } from "lucide-react";
import { fetchImpactSummary } from "../../services/api";
import { calculateWasteKg } from "../../constants/impact";

export function LandingHeroStats({ fallbackMeals = 0, fallbackActive = 0 }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const data = await fetchImpactSummary();
        if (isMounted && data) {
          setStats(data);
        }
      } catch (_e) {
        // Fallback to initial props if network fails
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const meals = stats?.meals_diverted ?? fallbackMeals;
  const wasteKg = calculateWasteKg(meals);
  const activeCount = stats?.available ?? fallbackActive;

  if (loading) {
    return (
      <div
        className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6"
        aria-busy="true"
        aria-label="Loading live impact metrics"
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] animate-pulse space-y-2"
          >
            <div className="h-4 w-24 bg-[var(--color-border)] rounded" />
            <div className="h-8 w-16 bg-[var(--color-border)] rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full pt-6">
      <div className="flex items-center gap-1.5 text-xs font-bold font-['Quicksand'] text-[var(--color-leaf-green)] uppercase tracking-wider mb-3">
        <span className="w-2 h-2 rounded-full bg-[var(--color-leaf-green)] animate-pulse" />
        <span>Live Platform Activity</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Stat 1: Meals Rescued */}
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-[var(--shadow-warm-xs)] flex items-center justify-between">
          <div>
            <div className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-[var(--color-leaf-green)]">
              {meals.toLocaleString()}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] font-medium font-['Quicksand']">
              Meals Diverted from Waste
            </div>
          </div>
          <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)]">
            <Utensils className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 2: Waste Diverted */}
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-[var(--shadow-warm-xs)] flex items-center justify-between">
          <div>
            <div className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-[var(--color-tomato-orange)]">
              {wasteKg.toLocaleString()} kg
            </div>
            <div className="text-xs text-[var(--color-text-muted)] font-medium font-['Quicksand']">
              Landfill Waste Avoided
            </div>
          </div>
          <div className="p-2.5 rounded-[var(--radius-md)] bg-[var(--color-tomato-alpha)] text-[var(--color-tomato-orange)]">
            <Scale className="w-5 h-5" />
          </div>
        </div>

        {/* Stat 3: Active Listings */}
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-[var(--shadow-warm-xs)] flex items-center justify-between">
          <div>
            <div className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-amber-700">
              {activeCount}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] font-medium font-['Quicksand']">
              Active Surplus Batches Ready
            </div>
          </div>
          <div className="p-2.5 rounded-[var(--radius-md)] bg-amber-50 text-amber-700 border border-amber-200">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
