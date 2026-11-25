import React, { useState } from "react";
import { Card } from "../../components/ui/Card";
import { calculateWasteKg, calculateCo2eKg, IMPACT_FOOTNOTE } from "../../constants/impact";

export function LandingImpactCalculator() {
  const [dailyMeals, setDailyMeals] = useState(250);

  const monthlyMeals = dailyMeals * 30;
  const monthlyWasteKg = calculateWasteKg(monthlyMeals);
  const monthlyCo2eKg = calculateCo2eKg(monthlyMeals);

  return (
    <Card className="p-6 sm:p-8 bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-[var(--shadow-warm-sm)] space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1">
        <h3 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-[var(--color-forest-text)]">
          Interactive Community Savings Calculator
        </h3>
        <p className="text-xs text-[var(--color-text-muted)]">
          Estimate monthly meals saved and carbon emissions prevented based on daily surplus.
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-3">
        <div className="flex items-center justify-between text-xs font-bold font-['Quicksand']">
          <label htmlFor="daily-meals-slider" className="text-[var(--color-forest-text)]">
            Estimated Daily Surplus:
          </label>
          <span className="text-sm sm:text-base font-extrabold text-[var(--color-leaf-green)] font-mono">
            {dailyMeals} meals/day
          </span>
        </div>

        <input
          id="daily-meals-slider"
          type="range"
          min="20"
          max="1000"
          step="10"
          value={dailyMeals}
          onChange={(e) => setDailyMeals(Number(e.target.value))}
          className="w-full accent-[var(--color-leaf-green)] cursor-pointer h-2 bg-[var(--color-border)] rounded-lg appearance-none"
          aria-valuemin={20}
          aria-valuemax={1000}
          aria-valuenow={dailyMeals}
          aria-label="Daily surplus meals slider"
        />

        <div className="flex justify-between text-[11px] text-[var(--color-text-muted)] font-semibold font-['Quicksand']">
          <span>20 meals/day</span>
          <span>500 meals/day</span>
          <span>1,000 meals/day</span>
        </div>
      </div>

      {/* Derived Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] text-center border border-[var(--color-border)]/60">
          <div className="font-['Fraunces'] text-2xl font-bold text-[var(--color-forest-text)]">
            {monthlyMeals.toLocaleString()}
          </div>
          <div className="text-[11px] font-bold text-[var(--color-text-muted)] font-['Quicksand'] mt-1">
            Monthly Meals Diverted
          </div>
        </div>

        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] text-center border border-[var(--color-border)]/60">
          <div className="font-['Fraunces'] text-2xl font-bold text-[#B2380E]">
            {monthlyWasteKg.toLocaleString()} kg
          </div>
          <div className="text-[11px] font-bold text-[var(--color-text-muted)] font-['Quicksand'] mt-1">
            Food Waste Avoided
          </div>
        </div>

        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] text-center border border-[var(--color-border)]/60">
          <div className="font-['Fraunces'] text-2xl font-bold text-emerald-800">
            {monthlyCo2eKg.toLocaleString()} kg
          </div>
          <div className="text-[11px] font-bold text-[var(--color-text-muted)] font-['Quicksand'] mt-1">
            CO₂e Offset
          </div>
        </div>
      </div>

      <p className="text-[11px] text-center text-[var(--color-text-muted)] font-['Inter'] leading-relaxed pt-1">
        {IMPACT_FOOTNOTE}
      </p>
    </Card>
  );
}
