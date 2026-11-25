import { useState, useEffect, useCallback } from "react";
import {
  fetchListings,
  createListing as apiCreateListing,
  acceptListing as apiAcceptListing,
  claimListing as apiClaimListing,
  collectListing as apiCollectListing,
  deliverListing as apiDeliverListing,
  confirmDeliveryListing as apiConfirmDeliveryListing,
  cancelListing as apiCancelListing,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";

export function useListings(pollIntervalMs = 20000) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const toast = useToast();

  const loadListings = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const data = await fetchListings();
      if (Array.isArray(data)) {
        setListings(data);
        setError(null);
      }
    } catch (err) {
      setError(err.message || "Failed to load listings");
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  // Initial load and visibility-aware periodic polling
  useEffect(() => {
    loadListings();
    if (pollIntervalMs <= 0) return;

    let interval = null;

    function startPolling() {
      if (!interval) {
        interval = setInterval(() => {
          if (!document.hidden) {
            loadListings(true);
          }
        }, pollIntervalMs);
      }
    }

    function stopPolling() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopPolling();
      } else {
        loadListings(true);
        startPolling();
      }
    }

    startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loadListings, pollIntervalMs]);

  // Actions
  const addListing = async (formData) => {
    try {
      const created = await apiCreateListing(formData, currentUser);
      toast.success(`Success! Listed ${created.meals || formData.meals} meals for rescue.`);
      await loadListings(true);
      return created;
    } catch (err) {
      toast.error(err.message || "Failed to create listing.");
      throw err;
    }
  };

  const claim = async (id) => {
    try {
      const updated = await apiClaimListing(id, currentUser);
      toast.success("Listing claimed! Head to pickup address.");
      await loadListings(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Could not claim listing.");
      throw err;
    }
  };

  const accept = async (id, dropoffAddress) => {
    try {
      const updated = await apiAcceptListing(id, dropoffAddress, currentUser);
      toast.success("Donation accepted. Volunteers can now claim the delivery.");
      await loadListings(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Could not accept donation.");
      throw err;
    }
  };

  const collect = async (id) => {
    try {
      const updated = await apiCollectListing(id, currentUser);
      toast.success("Food collected! En route to NGO shelter.");
      await loadListings(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Could not mark collected.");
      throw err;
    }
  };

  const deliver = async (id) => {
    try {
      const updated = await apiDeliverListing(id, currentUser);
      toast.success("Delivery reported. The NGO must confirm receipt.");
      await loadListings(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Could not report delivery.");
      throw err;
    }
  };

  const confirmDelivery = async (id) => {
    try {
      const updated = await apiConfirmDeliveryListing(id, currentUser);
      toast.success("Food receipt confirmed. Delivery is complete.");
      await loadListings(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Could not confirm food receipt.");
      throw err;
    }
  };

  const cancel = async (id) => {
    try {
      const updated = await apiCancelListing(id, currentUser);
      toast.success("Listing cancelled successfully.");
      await loadListings(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Could not cancel listing.");
      throw err;
    }
  };

  // Filtered views
  const now = Date.now();
  const availableListings = listings.filter((l) => {
    const isAvailable = l.status === "accepted";
    const expiry = l.expiresAt || l.expires_at || l.safe_until;
    const notExpired = !expiry || new Date(expiry).getTime() > now;
    return isAvailable && notExpired;
  });

  const claimedListings = listings.filter((l) => l.status === "claimed");
  const collectedListings = listings.filter((l) => l.status === "collected");
  const deliveredListings = listings.filter((l) => l.status === "delivered");
  const distributedListings = listings.filter((l) => l.status === "distributed");
  const cancelledListings = listings.filter((l) => l.status === "cancelled");
  const expiredListings = listings.filter((l) => l.status === "expired");

  const totalDivertedMeals = listings
    .filter((l) => ["collected", "delivered", "distributed"].includes(l.status))
    .reduce((sum, l) => sum + (Number(l.meals) || 0), 0);

  return {
    listings,
    loading,
    error,
    refresh: () => loadListings(false),
    addListing,
    accept,
    claim,
    collect,
    deliver,
    confirmDelivery,
    cancel,
    availableListings,
    claimedListings,
    collectedListings,
    deliveredListings,
    distributedListings,
    cancelledListings,
    expiredListings,
    totalDivertedMeals,
  };
}
