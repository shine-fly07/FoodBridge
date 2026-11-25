import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Filter,
  PlusCircle,
  Truck,
  Building2,
  HeartHandshake,
  Clock,
  Sparkles,
} from "lucide-react";
import { ImpactStats } from "../components/ImpactStats";
import { ListingCard } from "../components/ListingCard";
import { DonorForm } from "../components/DonorForm";
import { EmptyState } from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

export function PortalView({ listings, onPostListing, onAction, impactData, myOrgImpactData }) {
  const { role: urlRole } = useParams();
  const navigate = useNavigate();
  const { currentUser, activeRole, setActiveRole } = useAuth();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDonorForm, setShowDonorForm] = useState(false);

  useEffect(() => {
    if (urlRole && ["donor", "volunteer", "ngo"].includes(urlRole)) {
      if (urlRole !== activeRole) {
        setActiveRole(urlRole);
      }
    }
  }, [urlRole, activeRole, setActiveRole]);

  const handleRoleTabChange = (newRole) => {
    setActiveRole(newRole);
    navigate(`/portal/${newRole}`);
  };

  const filteredListings = listings.filter((l) => {
    if (activeRole === "volunteer" && l.status === "available") return false;

    // Status filter
    if (activeTab !== "all" && l.status !== activeTab) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (l.title || "").toLowerCase().includes(q);
      const matchAddr = (l.pickup_address || l.pickupAddress || "").toLowerCase().includes(q);
      const matchDropoff = (l.dropoff_address || l.dropoffAddress || "").toLowerCase().includes(q);
      const matchDonor = (l.donor_name || l.donor?.name || l.donor_org || l.donor?.org || "").toLowerCase().includes(q);
      return matchTitle || matchAddr || matchDropoff || matchDonor;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-['Quicksand'] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)]">
              Unified Platform Portal
            </span>
          </div>
          <h1 className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-[var(--color-forest-text)]">
            Surplus Food Rescue Control Center
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
            Real-time pipeline monitoring connecting campus food producers with transport volunteers and shelter kitchens.
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="inline-flex p-1 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs font-bold font-['Quicksand'] self-start sm:self-auto">
          <button
            onClick={() => handleRoleTabChange("donor")}
            className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-all flex items-center gap-1.5 ${
              activeRole === "donor"
                ? "bg-[var(--color-leaf-green)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Donor View</span>
          </button>
          <button
            onClick={() => handleRoleTabChange("volunteer")}
            className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-all flex items-center gap-1.5 ${
              activeRole === "volunteer"
                ? "bg-[var(--color-leaf-green)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Courier View</span>
          </button>
          <button
            onClick={() => handleRoleTabChange("ngo")}
            className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-all flex items-center gap-1.5 ${
              activeRole === "ngo"
                ? "bg-[var(--color-leaf-green)] text-white shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>NGO Hub</span>
          </button>
        </div>
      </div>

      {/* Impact Stats Component */}
      <ImpactStats
        impactData={impactData}
        myOrgImpactData={myOrgImpactData}
        activeRole={activeRole}
      />

      {/* Donor Quick Post Drawer / Toggle */}
      {activeRole === "donor" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Fraunces'] text-xl font-bold text-[var(--color-forest-text)]">
              Donor Listing Management
            </h2>
            <Button
              size="sm"
              variant={showDonorForm ? "secondary" : "primary"}
              onClick={() => setShowDonorForm(!showDonorForm)}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showDonorForm ? "Hide Form" : "Post New Surplus Listing"}</span>
            </Button>
          </div>

          {showDonorForm && (
            <div className="mb-8 animate-fadeIn">
              <DonorForm
                onPostListing={async (data) => {
                  await onPostListing(data);
                  setShowDonorForm(false);
                }}
                currentUser={currentUser}
              />
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
        {/* Status Filters */}
        <div className="inline-flex p-1 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] text-xs font-bold font-['Quicksand'] w-full sm:w-auto overflow-x-auto">
          {[
            { key: "all", label: "All Statuses" },
            { key: "available", label: "Available" },
            { key: "accepted", label: "Ready for Pickup" },
            { key: "claimed", label: "Claimed" },
            { key: "collected", label: "Collected" },
            { key: "delivered", label: "Awaiting NGO Confirmation" },
            { key: "distributed", label: "Distributed" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`px-3 py-1.5 rounded-[var(--radius-sm)] transition-all whitespace-nowrap ${
                activeTab === item.key
                  ? "bg-[var(--color-leaf-green)] text-white shadow-xs"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[var(--color-text-light)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search listings, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-surface)] text-xs font-['Inter'] text-[var(--color-forest-text)] outline-none focus:border-[var(--color-leaf-green)] transition-all"
          />
        </div>
      </div>

      {/* Listings Display */}
      {filteredListings.length === 0 ? (
        <EmptyState
          title="No food rescue batches found"
          message={
            searchQuery
              ? `No listings matching "${searchQuery}". Try clearing search filters.`
              : "No batches are currently in this status pipeline stage."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
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
