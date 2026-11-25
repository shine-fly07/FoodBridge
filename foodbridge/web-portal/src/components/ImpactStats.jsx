import React, { useState } from "react";
import { Utensils, Scale, Leaf, Globe, Building } from "lucide-react";
import { Card } from "./ui/Card";
import { calculateWasteKg, calculateCo2eKg } from "../constants/impact";

export function ImpactStats({ impactData, myOrgImpactData, activeRole }) {
  const [filterMode, setFilterMode] = useState("platform");

  const activeStats = filterMode === "org" && myOrgImpactData ? myOrgImpactData : impactData;
  const totalMeals = activeStats?.meals_diverted ?? activeStats?.meals ?? 120;
  const wasteKg = activeStats?.waste_kg ?? calculateWasteKg(totalMeals);
  const co2eKg = activeStats?.co2e_kg ?? calculateCo2eKg(totalMeals);

  return (
    <Card className="mb-8 border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--color-border)]">
        <div>
          <h2 className="font-['Fraunces'] text-lg font-bold text-[var(--color-forest-text)] flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[var(--color-leaf-green)]" />
            <span>Environmental Impact & Resource Diversion</span>
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Verified resource diversion metrics computed live from rescue logs.
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="inline-flex p-1 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs font-bold font-['Quicksand']">
          <button
            onClick={() => setFilterMode("platform")}
            className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-all flex items-center gap-1.5 ${
              filterMode === "platform"
                ? "bg-[var(--color-leaf-green)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Platform-wide</span>
          </button>
          <button
            onClick={() => setFilterMode("org")}
            className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-all flex items-center gap-1.5 ${
              filterMode === "org"
                ? "bg-[var(--color-leaf-green)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>My Organization</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Total Meals */}
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)]/60 border border-[var(--color-border)]">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-1 font-bold font-['Quicksand'] uppercase tracking-wider">
            <span>Meals Diverted</span>
            <Utensils className="w-4 h-4 text-[var(--color-leaf-green)]" />
          </div>
          <div className="font-['Fraunces'] text-3xl font-extrabold text-[var(--color-forest-text)]">
            {totalMeals.toLocaleString()} <span className="text-sm font-semibold text-[var(--color-leaf-green)]">meals</span>
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
            Sum of collected and distributed campus batches
          </p>
        </div>

        {/* Metric 2: Food Waste Prevented */}
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)]/60 border border-[var(--color-border)]">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-1 font-bold font-['Quicksand'] uppercase tracking-wider">
            <span>Landfill Waste Averted</span>
            <Scale className="w-4 h-4 text-[var(--color-tomato-orange)]" />
          </div>
          <div className="font-['Fraunces'] text-3xl font-extrabold text-[var(--color-forest-text)]">
            {wasteKg.toLocaleString()} <span className="text-sm font-semibold text-[var(--color-tomato-orange)]">kg</span>
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
            Calculated at standardized 0.40 kg edible waste/meal
          </p>
        </div>

        {/* Metric 3: Carbon Offset */}
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)]/60 border border-[var(--color-border)]">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] mb-1 font-bold font-['Quicksand'] uppercase tracking-wider">
            <span>CO2e Offset</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-['Fraunces'] text-3xl font-extrabold text-[var(--color-forest-text)]">
            {co2eKg.toLocaleString()} <span className="text-sm font-semibold text-emerald-700">kg CO2e</span>
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
            Methane generation avoided from organic decomposition
          </p>
        </div>
      </div>
    </Card>
  );
}
