import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function LandingFaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What types of food can dining facilities, eateries, and caterers donate?",
      a: "Donors can post fresh, unserved prepared dishes (such as cooked grains, curries, and vegetable preparations), individually packed meal boxes, sandwiches, and bakery goods. All donations must be held under clean conditions with an accurate safe-until time estimate specified at posting.",
    },
    {
      q: "Who delivers the food, and what distance do couriers travel?",
      a: "Deliveries are made by registered student and local volunteer couriers primarily on foot or bicycle. Because the network connects donors directly to nearby community shelters, delivery distances are typically between 1 and 3 km.",
    },
    {
      q: "How do safety windows work, and what happens if food is not claimed in time?",
      a: "Every listing features an active countdown timer: Green (>2 hours remaining), Yellow (1 to 2 hours), and Red (<1 hour). If a batch is not claimed by a volunteer courier before its donor-specified safe-until window elapses, the listing is automatically hidden from the active board to ensure only fresh food is dispatched.",
    },
    {
      q: "Is there any cost for registered NGOs, community kitchens, or shelters?",
      a: "No. FoodBridge is a community-driven surplus food rescue platform. All food received by registered non-profits, shelters, and community kitchens is 100% free of charge.",
    },
    {
      q: "How do volunteer couriers track their service hours and rescues?",
      a: "When a delivery is collected and subsequently confirmed as received by the shelter hub, the rescue batch is automatically logged to the volunteer's profile and counted in public community impact summaries.",
    },
  ];

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto" role="region" aria-label="Frequently Asked Questions">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        const headingId = `faq-heading-${idx}`;
        const panelId = `faq-panel-${idx}`;

        return (
          <div
            key={idx}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-surface)] overflow-hidden transition-all shadow-[var(--shadow-warm-xs)]"
          >
            <h3>
              <button
                type="button"
                id={headingId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " " || e.code === "Space") {
                    e.preventDefault();
                    toggle(idx);
                  }
                }}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-['Fraunces'] text-sm sm:text-base font-bold text-[var(--color-forest-text)] hover:text-[var(--color-leaf-green)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-leaf-green)] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--color-leaf-green)] flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={headingId}
                className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[var(--color-text-muted)] font-['Inter'] leading-relaxed border-t border-[var(--color-border)]/50"
              >
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
