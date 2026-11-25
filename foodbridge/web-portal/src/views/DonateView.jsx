import React from "react";
import { Link } from "react-router-dom";
import { HeartHandshake, Utensils, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import { DonorForm } from "../components/DonorForm";
import { ListingCard } from "../components/ListingCard";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

export function DonateView({ listings, onPostListing, onAction }) {
  const { currentUser, activeRole, setActiveRole } = useAuth();

  const isDonor = activeRole === "donor";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-['Quicksand'] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)]">
              Food Donor &bull; Canteen Hub
            </span>
          </div>
          <h1 className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-[var(--color-forest-text)]">
            Post &amp; Track Surplus Food
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Publish edible surplus before kitchen closing. Nearby volunteer couriers receive instant dispatch notifications.
          </p>
        </div>

        {!isDonor && (
          <Button
            size="sm"
            variant="mango"
            onClick={() => setActiveRole("donor")}
            className="self-start sm:self-auto font-bold"
          >
            Switch to Donor Mode
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Post Form */}
        <div className="lg:col-span-5 space-y-6">
          <DonorForm onPostListing={onPostListing} currentUser={currentUser} />

          {/* Guidelines Box */}
          <Card className="p-4 bg-[var(--color-bg-subtle)]/70 border-[var(--color-border)] space-y-2">
            <h4 className="font-['Quicksand'] text-xs font-bold uppercase tracking-wider text-[var(--color-forest-text)] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[var(--color-leaf-green)]" />
              <span>Safe Food Handling Guidelines</span>
            </h4>
            <ul className="text-xs text-[var(--color-text-muted)] space-y-1.5 list-disc pl-4 font-['Inter']">
              <li>Ensure cooked food has been kept at safe temperatures (&gt;60°C or &lt;5°C).</li>
              <li>Pack in clean, sealed thermal containers or sanitized food-grade trays.</li>
              <li>Provide accurate portion counts so shelters can plan dinner meal allocations.</li>
            </ul>
          </Card>
        </div>

        {/* Right Column: Live Surplus Listings */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="font-['Fraunces'] text-xl font-bold text-[var(--color-forest-text)]">
                Live Surplus Rescue Board
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Showing all active listings posted across campus dining locations
              </p>
            </div>
            <span className="text-xs font-bold font-['Quicksand'] px-2.5 py-1 rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-forest-text)] border border-[var(--color-border)]">
              {listings.length} Batches
            </span>
          </div>

          {listings.length === 0 ? (
            <EmptyState
              title="No surplus listings right now"
              message="Your kitchen has not posted any active surplus batches. Use the form on the left to alert nearby volunteers!"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listings.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  activeRole={activeRole}
                  currentUser={currentUser}
                  onAction={onAction}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
