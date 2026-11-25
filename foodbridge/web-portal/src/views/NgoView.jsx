import React, { useState } from "react";
import { Building2, CheckCircle2, PackageCheck, Utensils, HeartHandshake, ShieldCheck } from "lucide-react";
import { ListingCard } from "../components/ListingCard";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../context/AuthContext";

export function NgoView({ listings, onAction }) {
  const { currentUser, activeRole, setActiveRole } = useAuth();
  const [tab, setTab] = useState("incoming"); // "incoming" | "distributed"

  const isNgo = activeRole === "ngo";

  const incomingBatches = listings.filter((l) => l.status === "collected");
  const enRouteBatches = listings.filter((l) => l.status === "claimed");
  const distributedBatches = listings.filter((l) => l.status === "distributed");

  const totalDistributedMeals = distributedBatches.reduce((sum, l) => sum + (Number(l.meals) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-['Quicksand'] bg-purple-100 text-purple-800">
              Community Shelter &bull; NGO Hub
            </span>
          </div>
          <h1 className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-[var(--color-forest-text)]">
            Food Distribution &amp; Receipt Ledger
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Confirm received surplus deliveries from volunteer couriers and log served meals to community shelters.
          </p>
        </div>

        {!isNgo && (
          <Button
            size="sm"
            variant="mango"
            onClick={() => setActiveRole("ngo")}
            className="self-start sm:self-auto font-bold"
          >
            Switch to NGO Mode
          </Button>
        )}
      </div>

      {/* Shelter Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[var(--color-bg-surface)] border-[var(--color-border)]">
          <div className="flex items-center justify-between text-xs font-bold font-['Quicksand'] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            <span>Incoming for Delivery</span>
            <PackageCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-['Fraunces'] text-3xl font-bold text-purple-700">
            {incomingBatches.length}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Couriers currently en route to your kitchen dock
          </p>
        </Card>

        <Card className="p-4 bg-[var(--color-bg-surface)] border-[var(--color-border)]">
          <div className="flex items-center justify-between text-xs font-bold font-['Quicksand'] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            <span>Total Meals Distributed</span>
            <Utensils className="w-4 h-4 text-[var(--color-leaf-green)]" />
          </div>
          <div className="font-['Fraunces'] text-3xl font-bold text-[var(--color-leaf-green)]">
            {totalDistributedMeals.toLocaleString()}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Verified portions served to community members
          </p>
        </Card>

        <Card className="p-4 bg-[var(--color-bg-surface)] border-[var(--color-border)]">
          <div className="flex items-center justify-between text-xs font-bold font-['Quicksand'] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            <span>Verified Distribution</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-['Fraunces'] text-3xl font-bold text-emerald-800">
            100%
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Zero-waste verified distribution trail
          </p>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="inline-flex p-1 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs font-bold font-['Quicksand']">
        <button
          onClick={() => setTab("incoming")}
          className={`px-4 py-2 rounded-[var(--radius-sm)] transition-all flex items-center gap-1.5 ${
            tab === "incoming"
              ? "bg-[var(--color-leaf-green)] text-white shadow-xs"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
          }`}
        >
          <span>Awaiting Receipt / Incoming ({incomingBatches.length})</span>
        </button>
        <button
          onClick={() => setTab("distributed")}
          className={`px-4 py-2 rounded-[var(--radius-sm)] transition-all flex items-center gap-1.5 ${
            tab === "distributed"
              ? "bg-[var(--color-leaf-green)] text-white shadow-xs"
              : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
          }`}
        >
          <span>Verified Distribution History ({distributedBatches.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {tab === "incoming" ? (
        incomingBatches.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No incoming food batches awaiting confirmation"
            message="Couriers will appear here the moment they pick up food from the campus canteen and are en route to your kitchen."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incomingBatches.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                activeRole="ngo"
                currentUser={currentUser}
                onAction={onAction}
              />
            ))}
          </div>
        )
      ) : (
        distributedBatches.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No completed distributions yet"
            message="When you confirm received food batches, they will be archived here in your permanent verified audit record."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {distributedBatches.map((item) => (
              <ListingCard
                key={item.id}
                listing={item}
                activeRole="ngo"
                currentUser={currentUser}
                onAction={onAction}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}
