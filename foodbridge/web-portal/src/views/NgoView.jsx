import React, { useState } from "react";
import { Building2, CheckCircle2, PackageCheck, Utensils, ShieldCheck } from "lucide-react";
import { ListingCard } from "../components/ListingCard";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

export function NgoView({ listings, onAction }) {
  const { currentUser, activeRole, setActiveRole } = useAuth();
  const [tab, setTab] = useState("available");

  const isNgo = activeRole === "ngo";
  const isMine = (listing) => Number(listing.ngo?.id ?? listing.ngo_id) === Number(currentUser?.id);
  const availableListings = listings.filter((listing) => listing.status === "available");
  const activeOrders = listings.filter((listing) =>
    isMine(listing) && ["accepted", "claimed", "collected", "delivered"].includes(listing.status)
  );
  const deliveredOrders = listings.filter((listing) => isMine(listing) && listing.status === "distributed");
  const pendingConfirmations = activeOrders.filter((listing) => listing.status === "delivered").length;
  const totalDeliveredMeals = deliveredOrders.reduce((sum, listing) => sum + (Number(listing.meals) || 0), 0);

  const tabs = [
    { id: "available", label: `Available Donations (${availableListings.length})` },
    { id: "active", label: `My Active Orders (${activeOrders.length})` },
    { id: "delivered", label: `Delivered History (${deliveredOrders.length})` },
  ];
  const visibleListings = tab === "available"
    ? availableListings
    : tab === "active"
      ? activeOrders
      : deliveredOrders;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-['Quicksand'] bg-purple-100 text-purple-800">
              Community Shelter &bull; NGO Hub
            </span>
          </div>
          <h1 className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-[var(--color-forest-text)]">
            Accept Food Donations
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Set the drop-off address when accepting a donation. After a volunteer reports delivery, verify the food at that location and confirm receipt in My Active Orders.
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-[var(--color-bg-surface)] border-[var(--color-border)]">
          <div className="flex items-center justify-between text-xs font-bold font-['Quicksand'] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            <span>Available to Accept</span>
            <PackageCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-['Fraunces'] text-3xl font-bold text-purple-700">{availableListings.length}</div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Donations awaiting an NGO</p>
        </Card>

        <Card className="p-4 bg-[var(--color-bg-surface)] border-[var(--color-border)]">
          <div className="flex items-center justify-between text-xs font-bold font-['Quicksand'] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            <span>Needs Receipt Confirmation</span>
            <Building2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="font-['Fraunces'] text-3xl font-bold text-purple-700">{pendingConfirmations}</div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Volunteer-reported drop-offs awaiting your confirmation</p>
        </Card>

        <Card className="p-4 bg-[var(--color-bg-surface)] border-[var(--color-border)]">
          <div className="flex items-center justify-between text-xs font-bold font-['Quicksand'] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            <span>Meals Delivered</span>
            <Utensils className="w-4 h-4 text-[var(--color-leaf-green)]" />
          </div>
          <div className="font-['Fraunces'] text-3xl font-bold text-[var(--color-leaf-green)]">
            {totalDeliveredMeals.toLocaleString()}
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Confirmed as received by your NGO
          </p>
        </Card>
      </div>

      <div className="inline-flex flex-wrap p-1 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs font-bold font-['Quicksand']">
        {tabs.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`px-4 py-2 rounded-[var(--radius-sm)] transition-all ${
              tab === item.id
                ? "bg-[var(--color-leaf-green)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visibleListings.length === 0 ? (
        <EmptyState
          icon={tab === "delivered" ? CheckCircle2 : Building2}
          title={
            tab === "available"
              ? "No donations waiting for acceptance"
              : tab === "active"
                ? "No active orders in progress"
                : "No deliveries completed yet"
          }
          message={
            tab === "available"
              ? "New donor listings will appear here. Accept one and provide your drop-off address to dispatch a volunteer."
              : tab === "active"
                ? "Donations you accept will be tracked here through pickup, volunteer-reported delivery, and your receipt confirmation."
                : "Deliveries you confirm as received will appear here."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleListings.map((item) => (
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
  );
}
