import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { FloatingNav } from "./components/FloatingNav";
import { AuthModal } from "./components/AuthModal";
import { ToastProvider, useToast } from "./components/ui/Toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useListings } from "./hooks/useListings";
import { subscribeDemoMode, checkBackendHealth, fetchImpactSummary, fetchMonthlyImpact } from "./services/api";

import { Loader } from "./components/ui/Loader";

import { LandingView } from "./views/LandingView";
const DonateView = React.lazy(() => import("./views/DonateView").then((m) => ({ default: m.DonateView })));
const CourierView = React.lazy(() => import("./views/CourierView").then((m) => ({ default: m.CourierView })));
const NgoView = React.lazy(() => import("./views/NgoView").then((m) => ({ default: m.NgoView })));
const PortalView = React.lazy(() => import("./views/PortalView").then((m) => ({ default: m.PortalView })));
const ImpactView = React.lazy(() => import("./views/ImpactView").then((m) => ({ default: m.ImpactView })));
const NotFoundView = React.lazy(() => import("./views/NotFoundView").then((m) => ({ default: m.NotFoundView })));
const GameRedirectView = React.lazy(() => import("./views/GameRedirectView").then((m) => ({ default: m.GameRedirectView })));
const RedesignPreviewView = React.lazy(() => import("./views/RedesignPreviewView").then((m) => ({ default: m.RedesignPreviewView })));

/**
 * Handles smooth scrolling to landing anchors (#problem, #how-it-works, #impact, #get-involved)
 * or scrolls to top on route change.
 */
function ScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "FoodBridge — Surplus Food Rescue Platform",
      "/donate": "Donate Surplus Food — FoodBridge",
      "/courier": "Volunteer Courier Board — FoodBridge",
      "/ngo": "NGO Shelter Hub — FoodBridge",
      "/portal": "Rescue Control Center — FoodBridge",
      "/impact": "Quantified Impact & Audits — FoodBridge",
      "/game": "2D Food Rescue Runner — FoodBridge",
    };
    const title = titles[location.pathname] || (location.pathname.startsWith("/portal/") ? "Rescue Control Center — FoodBridge" : "FoodBridge");
    document.title = title;

    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 80);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return null;
}

function MainAppContent() {
  const location = useLocation();
  const { currentUser, activeRole, setActiveRole, authModalOpen, authModalOptions, openAuthModal, closeAuthModal, logout } = useAuth();
  const { listings, loading, refresh, addListing, claim, collect, distribute, cancel, totalDivertedMeals, availableListings } = useListings();

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [impactData, setImpactData] = useState(null);
  const [myOrgImpactData, setMyOrgImpactData] = useState(null);

  useEffect(() => {
    checkBackendHealth();
    return subscribeDemoMode((active) => {
      setIsDemoMode(active);
    });
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const [sum, mth] = await Promise.all([fetchImpactSummary(), fetchMonthlyImpact()]);
        setImpactData(sum);
        setMyOrgImpactData(mth);
      } catch (_e) {}
    }
    loadStats();
  }, [listings]);

  const handleAction = async (id, actionType) => {
    if (actionType === "claim") return claim(id);
    if (actionType === "collect") return collect(id);
    if (actionType === "distribute") return distribute(id);
    if (actionType === "cancel") return cancel(id);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg-cream)] text-[var(--color-forest-text)]">
      <ScrollHandler />

      {/* Shared Unified Navbar */}
      <Navbar
        currentUser={currentUser}
        activeRole={activeRole}
        onSelectRole={setActiveRole}
        onOpenAuth={openAuthModal}
        onLogout={logout}
        onRefresh={refresh}
        totalDivertedMeals={totalDivertedMeals}
        isDemoMode={isDemoMode}
      />

      {/* Main Route Content */}
      <main id="main-content" className="flex-1 pb-12">
        <div key={location.pathname} className="page-enter">
          <React.Suspense fallback={<Loader text="Loading FoodBridge view..." className="py-20" />}>
            <Routes>
          {/* Main SPA Pages */}
          <Route
            path="/"
            element={
              <LandingView
                totalDivertedMeals={totalDivertedMeals}
                activeListingsCount={availableListings.length}
                listings={listings}
                availableListings={availableListings}
                onAction={handleAction}
              />
            }
          />
          <Route
            path="/donate"
            element={
              <DonateView
                listings={listings}
                onPostListing={addListing}
                onAction={handleAction}
              />
            }
          />
          <Route
            path="/courier"
            element={
              <CourierView
                listings={listings}
                onAction={handleAction}
              />
            }
          />
          <Route
            path="/ngo"
            element={
              <NgoView
                listings={listings}
                onAction={handleAction}
              />
            }
          />
          <Route
            path="/portal"
            element={
              <PortalView
                listings={listings}
                onPostListing={addListing}
                onAction={handleAction}
                impactData={impactData}
                myOrgImpactData={myOrgImpactData}
              />
            }
          />
          <Route
            path="/portal/:role"
            element={
              <PortalView
                listings={listings}
                onPostListing={addListing}
                onAction={handleAction}
                impactData={impactData}
                myOrgImpactData={myOrgImpactData}
              />
            }
          />
          <Route path="/impact" element={<ImpactView />} />
          <Route path="/preview" element={<RedesignPreviewView />} />
          <Route path="/login" element={<Navigate to="/portal" replace />} />
          <Route path="/signup" element={<Navigate to="/portal" replace />} />
          <Route path="/game" element={<GameRedirectView />} />

          {/* Legacy multi-page route redirects */}
          <Route path="/portal.html" element={<Navigate to="/portal" replace />} />
          <Route path="/courier.html" element={<Navigate to="/courier" replace />} />
          <Route path="/donate.html" element={<Navigate to="/donate" replace />} />
          <Route path="/ngo-hub.html" element={<Navigate to="/ngo" replace />} />
          <Route path="/app.html" element={<Navigate to="/portal" replace />} />
          <Route path="/landing.html" element={<Navigate to="/" replace />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
        </React.Suspense>
        </div>
      </main>

      {/* Floating Bottom Navigation Pill */}
      <FloatingNav />

      {/* Shared Unified Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} options={authModalOptions} />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <MainAppContent />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
export default App;
