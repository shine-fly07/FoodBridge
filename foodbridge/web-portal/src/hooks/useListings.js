import { useState, useEffect, useCallback } from "react";
import {
  fetchListings,
  createListing as apiCreateListing,
  claimListing as apiClaimListing,
  collectListing as apiCollectListing,
  distributeListing as apiDistributeListing,
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

  const distribute = async (id) => {
    try {
      const updated = await apiDistributeListing(id, currentUser);
      toast.success("Distribution confirmed! Impact metrics updated.");
      await loadListings(true);
      return updated;
    } catch (err) {
      toast.error(err.message || "Could not confirm distribution.");
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
    const isAvailable = l.status === "available";
    const expiry = l.expires_at || l.safe_until;
    const notExpired = !expiry || new Date(expiry).getTime() > now;
    return isAvailable && notExpired;
  });

  const claimedListings = listings.filter((l) => l.status === "claimed");
  const collectedListings = listings.filter((l) => l.status === "collected");
  const distributedListings = listings.filter((l) => l.status === "distributed");
  const cancelledListings = listings.filter((l) => l.status === "cancelled");
  const expiredListings = listings.filter((l) => l.status === "expired");

  const totalDivertedMeals = listings
    .filter((l) => l.status === "collected" || l.status === "distributed")
    .reduce((sum, l) => sum + (Number(l.meals) || 0), 0);

  return {
    listings,
    loading,
    error,
    refresh: () => loadListings(false),
    addListing,
    claim,
    collect,
    distribute,
    cancel,
    availableListings,
    claimedListings,
    collectedListings,
    distributedListings,
    cancelledListings,
    expiredListings,
    totalDivertedMeals,
  };
}
