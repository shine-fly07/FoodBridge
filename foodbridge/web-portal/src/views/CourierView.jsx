import React, { useState } from "react";
import { Truck, MapPin, CheckCircle2, Clock, PackageCheck, AlertTriangle } from "lucide-react";
import { ListingCard } from "../components/ListingCard";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

export function CourierView({ listings, onAction }) {
  const { currentUser, activeRole, setActiveRole } = useAuth();
  const [filter, setFilter] = useState("available"); // "available" | "my_pickups" | "all"

  const isVolunteer = activeRole === "volunteer";

  const availableListings = listings.filter((l) => l.status === "available");
  const myPickups = listings.filter((l) => l.status === "claimed");
  const inTransit = listings.filter((l) => l.status === "collected");
  const completed = listings.filter((l) => l.status === "distributed");

  const displayedListings =
    filter === "available"
      ? availableListings
      : filter === "my_pickups"
      ? [...myPickups, ...inTransit]
      : listings;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-['Quicksand'] bg-[var(--color-mustard-alpha)] text-[var(--color-mustard-dark)]">
              Volunteer Courier Network
            </span>
          </div>
          <h1 className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-[var(--color-forest-text)]">
            Urgent Pickup &amp; Transit Board
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Claim nearby campus food surplus, confirm collection at the kitchen dock, and deliver to community shelters.
          </p>
        </div>

        {!isVolunteer && (
          <Button
            size="sm"
            variant="mango"
            onClick={() => setActiveRole("volunteer")}
            className="self-start sm:self-auto font-bold"
          >
            Switch to Courier Mode
          </Button>
        )}
      </div>

      {/* Courier Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-[var(--color-bg-surface)] border-[var(--color-border)]">
          <div className="text-xs font-bold font-['Quicksand'] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Available to Claim
          </div>
          <div className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[var(--color-leaf-green)]">
            {availableListings.length}
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Urgent campus batches</div>
        </Card>

        <Card className="p-4 bg-[var(--color-bg-surface)] border-[var(--color-border)]">
          <div className="text-xs font-bold font-['Quicksand'] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Claimed / En Route
          </div>
          <div className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[var(--color-mustard-dark)]">
            {myPickups.length}
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Head to kitchen dock</div>
        </Card>

        <Card className="p-4 bg-[var(--color-bg-surface)] border-[var(--color-border)]">
          <div className="text-xs font-bold font-['Quicksand'] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Collected / In Transit
          </div>
          <div className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-purple-700">
            {inTransit.length}
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">En route to shelter</div>
        </Card>

        <Card className="p-4 bg-[var(--color-bg-surface)] border-[var(--color-border)]">
          <div className="text-xs font-bold font-['Quicksand'] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Completed Rescues
          </div>
          <div className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-emerald-800">
            {completed.length}
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">Delivered to shelters</div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
        <div className="inline-flex p-1 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs font-bold font-['Quicksand']">
          <button
            onClick={() => setFilter("available")}
            className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-all flex items-center gap-1.5 ${
              filter === "available"
                ? "bg-[var(--color-leaf-green)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
            }`}
          >
            <span>Available for Pickup ({availableListings.length})</span>
          </button>
          <button
            onClick={() => setFilter("my_pickups")}
            className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-all flex items-center gap-1.5 ${
              filter === "my_pickups"
                ? "bg-[var(--color-leaf-green)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
            }`}
          >
            <span>My Active Deliveries ({myPickups.length + inTransit.length})</span>
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-all flex items-center gap-1.5 ${
              filter === "all"
                ? "bg-[var(--color-leaf-green)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
            }`}
          >
            <span>All Batches ({listings.length})</span>
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      {displayedListings.length === 0 ? (
        <EmptyState
          icon={Truck}
          title="No deliveries match this view"
          message={
            filter === "available"
              ? "All current campus food surplus batches have been claimed by couriers. Check back when dining halls finish dinner service!"
              : "You have no claimed pickups awaiting collection right now. Check the 'Available for Pickup' tab to claim one!"
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedListings.map((item) => (
            <ListingCard
              key={item.id}
              listing={item}
              activeRole="volunteer"
              currentUser={currentUser}
              onAction={onAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
