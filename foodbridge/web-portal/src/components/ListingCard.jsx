import React, { useState } from "react";
import { MapPin, Clock, Truck, Building2, Utensils, CheckCircle2, User, AlertTriangle } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { ExpiryBadge } from "./ui/ExpiryBadge";

export function ListingCard({ listing, activeRole, currentUser, onAction }) {
  const [loading, setLoading] = useState(false);

  const expiresAt = listing.expires_at || listing.safe_until;
  const isAvailable = listing.status === "available";
  const isClaimed = listing.status === "claimed";
  const isCollected = listing.status === "collected";
  const isDistributed = listing.status === "distributed";

  const handleActionClick = async (actionType) => {
    setLoading(true);
    try {
      await onAction(listing.id, actionType);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (listing.status) {
      case "available":
        return <Badge variant="leaf">Available</Badge>;
      case "claimed":
        return <Badge variant="warning">Claimed &bull; En Route</Badge>;
      case "collected":
        return <Badge variant="mango">Collected &bull; Transit</Badge>;
      case "distributed":
        return <Badge variant="success">Distributed &bull; Delivered</Badge>;
      case "cancelled":
        return <Badge variant="neutral">Cancelled</Badge>;
      case "expired":
        return <Badge variant="danger">Expired</Badge>;
      default:
        return <Badge variant="neutral">{listing.status}</Badge>;
    }
  };

  return (
    <Card hoverable className="flex flex-col justify-between border-[var(--color-border)] bg-[var(--color-bg-surface)]">
      <div>
        {/* Card Header: Title & Status */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="font-['Fraunces'] text-base font-bold text-[var(--color-forest-text)] leading-snug">
            {listing.title}
          </h3>
          {getStatusBadge()}
        </div>

        {/* Portion size & Expiry countdown */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)] text-xs font-bold font-['Quicksand'] text-[var(--color-forest-text)] border border-[var(--color-border)]">
            <Utensils className="w-3.5 h-3.5 text-[var(--color-leaf-green)]" />
            <span>{listing.meals} Verified Servings</span>
          </span>

          {isAvailable && expiresAt && <ExpiryBadge expiresAt={expiresAt} />}
        </div>

        {/* Pickup & Donor Info */}
        <div className="space-y-1.5 text-xs text-[var(--color-text-muted)] font-['Inter'] mb-3">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-[var(--color-tomato-orange)] shrink-0 mt-0.5" />
            <span className="text-[var(--color-forest-text)] font-medium">
              {listing.pickup_address || listing.pickupAddress || "Campus Canteen"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-[var(--color-leaf-green)] shrink-0" />
            <span>
              Donor: <strong className="text-[var(--color-forest-text)]">{listing.donor_name || listing.donor_org || "Campus Dining"}</strong>
            </span>
          </div>

          {listing.notes && (
            <p className="p-2 rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)]/60 border border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)] italic">
              &ldquo;{listing.notes}&rdquo;
            </p>
          )}

          {listing.volunteer_name && (
            <div className="text-[11px] text-[var(--color-text-muted)] pt-1 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[var(--color-leaf-green)]" />
              <span>Courier: <strong>{listing.volunteer_name}</strong></span>
            </div>
          )}

          {listing.ngo_org && (
            <div className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Recipient: <strong>{listing.ngo_org}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[var(--color-border)] mt-2">
        {activeRole === "volunteer" && isAvailable && (
          <Button
            variant="primary"
            size="sm"
            className="w-full font-bold"
            loading={loading}
            onClick={() => handleActionClick("claim")}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Accept Pickup &bull; Claim</span>
          </Button>
        )}

        {activeRole === "volunteer" && isClaimed && (
          <Button
            variant="mango"
            size="sm"
            className="w-full font-bold"
            loading={loading}
            onClick={() => handleActionClick("collect")}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark Food Collected</span>
          </Button>
        )}

        {activeRole === "ngo" && isCollected && (
          <Button
            variant="primary"
            size="sm"
            className="w-full font-bold bg-purple-700 hover:bg-purple-800"
            loading={loading}
            onClick={() => handleActionClick("distribute")}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Confirm Distribution &bull; Received</span>
          </Button>
        )}

        {isDistributed && (
          <div className="flex items-center justify-center gap-1.5 py-1 text-xs font-bold font-['Quicksand'] text-emerald-800 bg-emerald-50 rounded-[var(--radius-sm)] border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Successfully Diverted to Community</span>
          </div>
        )}

        {/* If user is donor */}
        {activeRole === "donor" && isAvailable && (
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
              Awaiting courier claim
            </span>
            <Button
              variant="outline"
              size="xs"
              loading={loading}
              onClick={() => handleActionClick("cancel")}
              className="text-red-700 border-red-200 hover:bg-red-50 text-[11px] py-1 px-2.5 font-bold"
            >
              Cancel Batch
            </Button>
          </div>
        )}

        {activeRole === "donor" && isClaimed && (
          <div className="text-center text-[11px] font-semibold text-[var(--color-text-muted)] py-1">
            Courier en route to collect
          </div>
        )}

        {listing.status === "cancelled" && (
          <div className="text-center py-1.5 text-xs font-semibold text-stone-500 bg-stone-100 rounded-[var(--radius-sm)] border border-stone-200">
            Cancelled by Donor
          </div>
        )}

        {listing.status === "expired" && (
          <div className="text-center py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 rounded-[var(--radius-sm)] border border-rose-200">
            Expired past safe consumption window
          </div>
        )}
      </div>
    </Card>
  );
}
