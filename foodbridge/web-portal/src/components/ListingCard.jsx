import React, { useState } from "react";
import { MapPin, Truck, Building2, Utensils, CheckCircle2, User, ChevronDown } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { ExpiryBadge } from "./ui/ExpiryBadge";
import { Input } from "./ui/FormField";

export function ListingCard({ listing, activeRole, currentUser, onAction }) {
  const [loading, setLoading] = useState(false);
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false);

  const expiresAt = listing.expiresAt || listing.expires_at || listing.safe_until;
  const donorName = listing.donor_name || listing.donor?.name || listing.donor_org || listing.donor?.org || "Campus Dining";
  const volunteerName = listing.volunteer_name || listing.volunteer?.name;
  const ngoName = listing.ngo_org || listing.ngo?.org;
  const deliveryAddress = listing.dropoffAddress || listing.dropoff_address;
  const volunteerReportedAt = listing.deliveredAt || listing.delivered_at;
  const ngoConfirmedAt = listing.distributedAt || listing.distributed_at;
  const isAssignedVolunteer = Number(listing.volunteer?.id ?? listing.volunteer_id) === Number(currentUser?.id);
  const isAssignedNgo = Number(listing.ngo?.id ?? listing.ngo_id) === Number(currentUser?.id);
  const isAvailable = listing.status === "available";
  const isAccepted = listing.status === "accepted";
  const isClaimed = listing.status === "claimed";
  const isCollected = listing.status === "collected";
  const isDelivered = listing.status === "delivered";
  const isDistributed = listing.status === "distributed";

  const handleActionClick = async (actionType, details) => {
    setLoading(true);
    try {
      await onAction(listing.id, actionType, details);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (listing.status) {
      case "available":
        return <Badge variant="leaf">Awaiting NGO Acceptance</Badge>;
      case "accepted":
        return <Badge variant="leaf">Accepted by NGO</Badge>;
      case "claimed":
        return <Badge variant="warning">Claimed &bull; En Route</Badge>;
      case "collected":
        return <Badge variant="mango">Collected &bull; Transit</Badge>;
      case "delivered":
        return <Badge variant="warning">Awaiting NGO Receipt Confirmation</Badge>;
      case "distributed":
        return <Badge variant="success">NGO Confirmed Food Received</Badge>;
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

          {(isAvailable || isAccepted) && expiresAt && <ExpiryBadge expiresAt={expiresAt} />}
        </div>

        {/* Pickup & Donor Info */}
        <div className="space-y-1.5 text-xs text-[var(--color-text-muted)] font-['Inter'] mb-3">
          <div className="flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-[var(--color-tomato-orange)] shrink-0 mt-0.5" />
            <span className="text-[var(--color-forest-text)] font-medium">
              <strong>Pickup:</strong> {listing.pickup_address || listing.pickupAddress || "Campus Canteen"}
            </span>
          </div>

          {deliveryAddress && (
            <div className="flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span className="text-[var(--color-forest-text)] font-medium">
                <strong>Drop-off:</strong> {deliveryAddress}
              </span>
            </div>
          )}

          {activeRole === "volunteer" && (isClaimed || isCollected || isDelivered) && !isAssignedVolunteer && (
            <div className="text-center text-[11px] font-semibold text-[var(--color-text-muted)] py-1">
              {isClaimed ? "Already claimed by another volunteer" : "Another volunteer is delivering this donation"}
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-[var(--color-leaf-green)] shrink-0" />
            <span>
              Donor: <strong className="text-[var(--color-forest-text)]">{donorName}</strong>
            </span>
          </div>

          {listing.notes && (
            <p className="p-2 rounded-[var(--radius-sm)] bg-[var(--color-bg-subtle)]/60 border border-[var(--color-border)] text-[11px] text-[var(--color-text-muted)] italic">
              &ldquo;{listing.notes}&rdquo;
            </p>
          )}

          {volunteerName && (
            <div className="text-[11px] text-[var(--color-text-muted)] pt-1 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-[var(--color-leaf-green)]" />
              <span>Courier: <strong>{volunteerName}</strong></span>
            </div>
          )}

          {ngoName && (
            <div className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Recipient: <strong>{ngoName}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[var(--color-border)] mt-2">
        {activeRole === "volunteer" && isAccepted && (
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

        {activeRole === "volunteer" && isClaimed && isAssignedVolunteer && (
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

        {activeRole === "volunteer" && isCollected && isAssignedVolunteer && (
          <Button
            variant="primary"
            size="sm"
            className="w-full font-bold bg-purple-700 hover:bg-purple-800"
            loading={loading}
            onClick={() => handleActionClick("deliver")}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Report Food Delivered</span>
          </Button>
        )}

        {activeRole === "ngo" && isAvailable && (
          <div className="space-y-2">
            <Input
              id={`dropoff-${listing.id}`}
              label="Delivery drop-off address"
              placeholder="Enter your shelter / kitchen address"
              value={dropoffAddress}
              onChange={(event) => setDropoffAddress(event.target.value)}
              maxLength={160}
              required
            />
            <Button
              variant="primary"
              size="sm"
              className="w-full font-bold"
              loading={loading}
              disabled={dropoffAddress.trim().length < 5}
              onClick={() => handleActionClick("accept", { dropoffAddress: dropoffAddress.trim() })}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Accept Donation</span>
            </Button>
          </div>
        )}

        {activeRole === "ngo" && (isAccepted || isClaimed || isCollected) && (
          <div className="text-center text-[11px] font-semibold text-[var(--color-text-muted)] py-1">
            {isAccepted ? "Accepted and awaiting a volunteer" : isClaimed ? "Volunteer is heading to pickup" : isCollected ? "Volunteer is delivering to your shelter" : "Awaiting receipt confirmation by the assigned NGO"}
          </div>
        )}

        {isDelivered && (
          <div className="space-y-2">
            <div className="text-center text-xs text-amber-900 bg-amber-50 rounded-[var(--radius-sm)] border border-amber-200 p-2">
              <p className="font-bold">Volunteer reported food drop-off at:</p>
              <p className="font-semibold">{deliveryAddress || "Drop-off location unavailable"}</p>
              <p className="mt-1">
              {activeRole === "ngo" && isAssignedNgo
                  ? "Check this location, then confirm receipt."
                  : "Awaiting receipt confirmation by the assigned NGO."}
              </p>
            </div>
            {activeRole === "ngo" && isAssignedNgo && (
              <Button
                variant="primary"
                size="sm"
                className="w-full font-bold"
                loading={loading}
                onClick={() => handleActionClick("confirm-delivery")}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Receipt at This Location</span>
              </Button>
            )}
          </div>
        )}

        {isDistributed && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1.5 py-1 text-xs font-bold font-['Quicksand'] text-emerald-800 bg-emerald-50 rounded-[var(--radius-sm)] border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {activeRole === "ngo"
                  ? <>Receipt confirmed by your NGO at <strong>{deliveryAddress || "the listed drop-off location"}</strong></>
                  : "NGO Confirmed Food Receipt"}
              </span>
            </div>
          </div>
        )}

        {(isDelivered || isDistributed) && (
          <>
            <button
              type="button"
              aria-expanded={showDeliveryDetails}
              onClick={() => setShowDeliveryDetails((shown) => !shown)}
              className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-[var(--color-leaf-green)] hover:underline mt-2"
            >
              <span>{showDeliveryDetails ? "Hide delivery details" : "View delivery details"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDeliveryDetails ? "rotate-180" : ""}`} />
            </button>
            {showDeliveryDetails && (
              <div className="space-y-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] p-3 text-xs">
                <p>Delivered by: <strong>{volunteerName || "Volunteer details unavailable"}</strong></p>
                <p>
                  Volunteer reported delivery:{" "}
                  <strong>
                    {volunteerReportedAt && !Number.isNaN(new Date(volunteerReportedAt).getTime())
                      ? new Date(volunteerReportedAt).toLocaleString()
                      : "Timestamp unavailable"}
                  </strong>
                </p>
                <p>
                  NGO receipt confirmation:{" "}
                  <strong>
                    {isDistributed && ngoConfirmedAt && !Number.isNaN(new Date(ngoConfirmedAt).getTime())
                      ? new Date(ngoConfirmedAt).toLocaleString()
                      : "Awaiting NGO confirmation"}
                  </strong>
                </p>
                <p>Pickup location: <strong>{listing.pickup_address || listing.pickupAddress || "Location unavailable"}</strong></p>
                <p>Drop-off location: <strong>{deliveryAddress || "Location unavailable"}</strong></p>
                {ngoName && <p>Recipient: <strong>{ngoName}</strong></p>}
              </div>
            )}
          </>
        )}

        {/* If user is donor */}
        {activeRole === "donor" && isAvailable && (
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
              Awaiting NGO acceptance
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

        {activeRole === "donor" && (isAccepted || isClaimed || isCollected || isDelivered) && (
          <div className="text-center text-[11px] font-semibold text-[var(--color-text-muted)] py-1">
            {isAccepted ? "Accepted by an NGO; awaiting volunteer" : isClaimed ? "Courier is heading to pickup" : isCollected ? "Courier is delivering to the NGO" : "Volunteer reported drop-off; awaiting NGO confirmation"}
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
