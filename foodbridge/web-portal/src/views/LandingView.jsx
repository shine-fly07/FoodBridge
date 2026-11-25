import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HeartHandshake,
  Truck,
  Building2,
  Sparkles,
  ArrowRight,
  Utensils,
  Leaf,
  Scale,
  Award,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Compass,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { ExpiryBadge } from "../components/ui/ExpiryBadge";
import { EmptyState } from "../components/ui/EmptyState";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";

import { LandingHeroStats } from "./landing/LandingHeroStats";
import { LandingImpactCalculator } from "./landing/LandingImpactCalculator";
import { LandingFaqAccordion } from "./landing/LandingFaqAccordion";

export function LandingView({
  totalDivertedMeals = 0,
  activeListingsCount = 0,
  listings = [],
  availableListings = [],
  onAction = () => {},
}) {
  const { currentUser, activeRole, setActiveRole, openAuthModal } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Workflow Simulation interactive state
  const [simStep, setSimStep] = useState(1);
  const simStepsData = {
    1: {
      role: "donor",
      status: "Available for Rescue",
      badgeVariant: "leaf",
      title: "50 Servings Fresh Veg Curry & Rice",
      meta: "📍 Campus Central Canteen • ⌛ Safe for ~2h 15m",
      progress: 33,
      desc: "Kitchen completes dining service with 50 safe, untouched meals. Donor creates a surplus listing with a verified safe-until window.",
      nextStepLabel: "Next: Courier Pickup ➔",
      portalLabel: "Go to Donor Hub",
      portalRole: "donor",
      portalPath: "/donate",
    },
    2: {
      role: "volunteer",
      status: "Claimed • Courier En Route",
      badgeVariant: "warning",
      title: "50 Servings Fresh Veg Curry & Rice",
      meta: "🚴 Courier Alex assigned • Pickup from Gate 3",
      progress: 66,
      desc: "Nearby volunteer courier accepts the delivery on bicycle, arrives at the kitchen loading area, and collects the meal batch.",
      nextStepLabel: "Next: Shelter Delivery ➔",
      portalLabel: "Go to Courier Board",
      portalRole: "volunteer",
      portalPath: "/courier",
    },
    3: {
      role: "ngo",
      status: "Delivered • Distributed to Community",
      badgeVariant: "success",
      title: "50 Servings Fresh Veg Curry & Rice",
      meta: "🏢 Hope Community Shelter • Verified distributed",
      progress: 100,
      desc: "Meals arrive warm at the shelter kitchen and are served to families. Receipt is logged to public community impact metrics.",
      nextStepLabel: "Restart Workflow ↺",
      portalLabel: "Go to Shelter Hub",
      portalRole: "ngo",
      portalPath: "/ngo",
    },
  };

  const currentSim = simStepsData[simStep];

  function handleNextSimStep() {
    if (simStep === 3) setSimStep(1);
    else setSimStep((prev) => prev + 1);
  }

  // Handle claiming from the live surplus teaser
  const handleTeaserClaim = async (listingId) => {
    if (!currentUser) {
      toast.info("Please sign in as a Volunteer to claim this rescue.");
      openAuthModal({
        role: "volunteer",
        tab: "quick",
        onLoginSuccess: async () => {
          try {
            await onAction(listingId, "claim");
            toast.success("Delivery claimed successfully! View under Courier deliveries.");
          } catch (err) {
            toast.error(err.message || "Could not claim listing.");
          }
        },
      });
      return;
    }

    if (currentUser.role !== "volunteer" && activeRole !== "volunteer") {
      toast.error("Only volunteer couriers can claim pickups. Please switch to a volunteer account.");
      openAuthModal({
        role: "volunteer",
        tab: "quick",
        onLoginSuccess: async () => {
          try {
            await onAction(listingId, "claim");
            toast.success("Delivery claimed successfully! View under Courier deliveries.");
          } catch (err) {
            toast.error(err.message || "Could not claim listing.");
          }
        },
      });
      return;
    }

    try {
      await onAction(listingId, "claim");
    } catch (err) {
      toast.error(err.message || "Could not claim listing.");
    }
  };

  // Up to 3 active available listings
  const teaserListings = availableListings.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16 font-['Inter']">
      {/* =========================================================================
          SECTION 1: HERO
          ========================================================================= */}
      <section id="home" className="pt-8 sm:pt-14 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text & Actions Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-['Quicksand'] bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supporting UN SDG 2 (Zero Hunger) &amp; SDG 12 (Responsible Consumption)</span>
            </div>

            <h1 className="font-['Fraunces'] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[var(--color-forest-text)] leading-[1.12]">
              Turn Surplus Food into{" "}
              <span className="text-[var(--color-leaf-green)] underline decoration-[var(--color-mustard)] decoration-wavy decoration-2">
                Community Meals.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--color-text-muted)] leading-relaxed max-w-2xl font-['Inter']">
              FoodBridge connects canteens, restaurants, hostels, and caterers with local volunteer couriers to deliver fresh, untouched surplus food to community shelters before it spoils.
            </p>

            {/* Hero Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button to="/donate" variant="primary" size="lg" className="shadow-[var(--shadow-warm-sm)]">
                <span>Donate Surplus Food ➔</span>
              </Button>

              <Button to="/courier" variant="secondary" size="lg">
                <Truck className="w-4 h-4 mr-1.5" />
                <span>Join as Volunteer</span>
              </Button>
            </div>

            {/* Live Stats Strip */}
            <LandingHeroStats
              fallbackMeals={totalDivertedMeals}
              fallbackActive={activeListingsCount}
            />
          </div>

          {/* Right: Live Interactive Workflow Card */}
          <div className="lg:col-span-5">
            <Card className="bg-[var(--color-bg-surface)] border-2 border-[var(--color-border)] shadow-[var(--shadow-warm-lg)] p-6">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-1.5 text-xs font-bold font-['Quicksand'] text-[var(--color-leaf-green)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-leaf-green)] animate-ping" />
                  <span>HOW FOOD RESCUE WORKS</span>
                </div>
                <Badge variant="neutral">Stage {simStep} of 3</Badge>
              </div>

              {/* Step Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--color-bg-subtle)] rounded-[var(--radius-md)] mb-4 text-xs font-bold font-['Quicksand']">
                <button
                  type="button"
                  onClick={() => setSimStep(1)}
                  className={`py-1.5 rounded-[var(--radius-sm)] transition-all ${
                    simStep === 1
                      ? "bg-[var(--color-bg-surface)] text-[var(--color-leaf-green)] shadow-xs"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
                  }`}
                >
                  1. Post
                </button>
                <button
                  type="button"
                  onClick={() => setSimStep(2)}
                  className={`py-1.5 rounded-[var(--radius-sm)] transition-all ${
                    simStep === 2
                      ? "bg-[var(--color-bg-surface)] text-[var(--color-leaf-green)] shadow-xs"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
                  }`}
                >
                  2. Claim
                </button>
                <button
                  type="button"
                  onClick={() => setSimStep(3)}
                  className={`py-1.5 rounded-[var(--radius-sm)] transition-all ${
                    simStep === 3
                      ? "bg-[var(--color-bg-surface)] text-[var(--color-leaf-green)] shadow-xs"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
                  }`}
                >
                  3. Deliver
                </button>
              </div>

              {/* Simulation Content Body */}
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-subtle)]/70 border border-[var(--color-border)] space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={currentSim.badgeVariant}>{currentSim.status}</Badge>
                  <span className="text-[11px] text-[var(--color-text-muted)] font-mono">Stage {simStep}/3</span>
                </div>

                <p className="font-['Fraunces'] text-base font-bold text-[var(--color-forest-text)]">
                  {currentSim.title}
                </p>

                <p className="text-xs text-[var(--color-text-muted)]">{currentSim.meta}</p>

                {/* Progress Track */}
                <div className="w-full bg-[var(--color-border)] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[var(--color-leaf-green)] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${currentSim.progress}%` }}
                  />
                </div>

                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed pt-1">
                  {currentSim.desc}
                </p>
              </div>

              {/* Simulation Controls */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-2.5">
                <Button
                  to={currentSim.portalPath}
                  variant="primary"
                  size="sm"
                  className="w-full sm:flex-1 font-bold justify-center"
                  onClick={() => setActiveRole(currentSim.portalRole)}
                >
                  {currentSim.portalLabel} ➔
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNextSimStep}
                  className="w-full sm:flex-1 font-bold justify-center"
                >
                  {currentSim.nextStepLabel}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CHOOSE YOUR PATH (ROLE CARDS)
          ========================================================================= */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-['Quicksand'] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)] uppercase tracking-wider">
            Choose Your Path
          </span>
          <h2 className="font-['Fraunces'] text-3xl sm:text-4xl font-extrabold text-[var(--color-forest-text)]">
            How Do You Want to Participate?
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Whether you manage a food facility, want to volunteer locally, or represent a shelter, FoodBridge makes coordination seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role 1: Food Donor */}
          <Card hoverable className="p-6 flex flex-col justify-between border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)] flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="font-['Fraunces'] text-xl font-bold text-[var(--color-forest-text)]">
                I Have Surplus Food
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                For university canteens, hostels, restaurants, and caterers. Post portion estimates and pickup location in under 60 seconds with safe-until timestamps.
              </p>
            </div>
            <Button to="/donate" variant="primary" size="md" className="w-full">
              <span>List Surplus Food ➔</span>
            </Button>
          </Card>

          {/* Role 2: Volunteer Courier */}
          <Card hoverable className="p-6 flex flex-col justify-between border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-tomato-alpha)] text-[var(--color-tomato-orange)] flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-['Fraunces'] text-xl font-bold text-[var(--color-forest-text)]">
                I Can Deliver Locally
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                Have 30 minutes to spare? Pick up fresh meal boxes on foot or bicycle and deliver directly to nearby shelters (typically 1 to 3 km away).
              </p>
            </div>
            <Button to="/courier" variant="mango" size="md" className="w-full">
              <span>View Delivery Board ➔</span>
            </Button>
          </Card>

          {/* Role 3: Shelter Hub */}
          <Card hoverable className="p-6 flex flex-col justify-between border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-5">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-[var(--radius-md)] bg-purple-100 text-purple-800 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-['Fraunces'] text-xl font-bold text-[var(--color-forest-text)]">
                We Need Food for Shelters
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                For registered NGOs, community kitchens, and homeless shelters. Receive fresh, unserved meals delivered to your door at zero cost.
              </p>
            </div>
            <Button to="/ngo" variant="secondary" size="md" className="w-full">
              <span>Access Shelter Hub ➔</span>
            </Button>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: HOW IT WORKS & TIMER LEGEND
          ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-['Quicksand'] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)] uppercase tracking-wider">
            Operational Workflow
          </span>
          <h2 className="font-['Fraunces'] text-3xl sm:text-4xl font-extrabold text-[var(--color-forest-text)]">
            Four Steps to Zero Food Waste
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            A fast, accountable rescue pipeline that prioritizes food freshness and food safety.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-5 border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-3">
            <div className="w-9 h-9 rounded-full bg-[var(--color-leaf-green)] text-white font-['Fraunces'] font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-['Fraunces'] text-lg font-bold text-[var(--color-forest-text)]">
              1. Post Surplus
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Donors specify portion count, pickup location, and safe-until window right after meal preparation or dining service.
            </p>
          </Card>

          <Card className="p-5 border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-3">
            <div className="w-9 h-9 rounded-full bg-[var(--color-mustard-dark)] text-white font-['Fraunces'] font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-['Fraunces'] text-lg font-bold text-[var(--color-forest-text)]">
              2. Courier Claims
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Nearby volunteer couriers browse available listings and claim the delivery route on the live board.
            </p>
          </Card>

          <Card className="p-5 border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-3">
            <div className="w-9 h-9 rounded-full bg-purple-700 text-white font-['Fraunces'] font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-['Fraunces'] text-lg font-bold text-[var(--color-forest-text)]">
              3. Transport Food
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Meals are collected and transported directly to verified community shelters (typically within 1 to 3 km).
            </p>
          </Card>

          <Card className="p-5 border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-3">
            <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-['Fraunces'] font-bold flex items-center justify-center text-sm">
              4
            </div>
            <h3 className="font-['Fraunces'] text-lg font-bold text-[var(--color-forest-text)]">
              4. Confirm &amp; Audit
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              The receiving shelter confirms meal arrival; saved food and greenhouse gas offsets are logged to the public impact ledger.
            </p>
          </Card>
        </div>

        {/* Safety Countdown Legend */}
        <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border)] shadow-[var(--shadow-warm-xs)] space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold font-['Quicksand'] text-[var(--color-forest-text)] uppercase tracking-wider">
            <Clock className="w-4 h-4 text-[var(--color-leaf-green)]" />
            <span>Shelf-Life &amp; Safety Timer Legend:</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[var(--color-forest-text)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span><strong>Green</strong>: &gt;2 Hours Remaining (Safe Window)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span><strong>Yellow</strong>: 1 to 2 Hours (Urgent Window)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span><strong>Red</strong>: &lt;1 Hour (Critical Window)</span>
            </span>
          </div>
          <p className="text-[11px] text-[var(--color-text-muted)] font-['Inter'] pt-1 border-t border-[var(--color-border)]/50">
            ✓ Verified Auto-Expiry: Listings that pass their donor-specified safe-until window without being claimed are automatically hidden from the active board.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: LIVE SURPLUS TEASER
          ========================================================================= */}
      <section id="live-surplus" className="py-12 bg-[var(--color-bg-surface)] border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-['Quicksand'] bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Live Surplus Board</span>
              </span>
              <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-[var(--color-forest-text)] mt-2">
                Active Listings Ready for Rescue
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                Batches currently posted by kitchens awaiting volunteer courier pickup.
              </p>
            </div>

            <Button to="/courier" variant="secondary" size="sm">
              <span>View Full Courier Board ➔</span>
            </Button>
          </div>

          {teaserListings.length === 0 ? (
            <EmptyState
              title="No active surplus batches right now"
              message="Dining facilities and caterers typically post batches after meal preparation or dining service. Check back soon or visit the volunteer courier board!"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teaserListings.map((listing) => {
                const expiresAt = listing.expires_at || listing.safe_until;
                return (
                  <Card
                    key={listing.id}
                    hoverable
                    className="p-5 flex flex-col justify-between border-[var(--color-border)] bg-[var(--color-bg-subtle)] space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-['Fraunces'] text-base font-bold text-[var(--color-forest-text)] leading-snug">
                          {listing.title}
                        </h3>
                        <Badge variant="leaf">Available</Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--color-bg-surface)] text-xs font-bold font-['Quicksand'] text-[var(--color-forest-text)] border border-[var(--color-border)]">
                          <Utensils className="w-3 h-3 text-[var(--color-leaf-green)]" />
                          <span>{listing.meals} Portions</span>
                        </span>

                        {expiresAt && <ExpiryBadge expiresAt={expiresAt} />}
                      </div>

                      <div className="text-xs text-[var(--color-text-muted)] space-y-1 font-['Inter']">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[var(--color-leaf-green)] shrink-0" />
                          <span className="truncate">{listing.pickup_address || "Pickup address provided"}</span>
                        </div>
                        {listing.donor_name && (
                          <div className="text-[11px] text-[var(--color-text-muted)] pl-5">
                            From: {listing.donor_name}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => handleTeaserClaim(listing.id)}
                    >
                      <span>Claim as Volunteer ➔</span>
                    </Button>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: WHY IT MATTERS & CALCULATOR
          ========================================================================= */}
      <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-['Quicksand'] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)] uppercase tracking-wider">
            Why It Matters
          </span>
          <h2 className="font-['Fraunces'] text-3xl sm:text-4xl font-extrabold text-[var(--color-forest-text)]">
            Transforming Waste into Sustenance
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            A small shift in logistics prevents edible food from generating landfill methane while feeding local families.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3 Factual Pillars */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-5 border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-[var(--radius-md)] bg-[var(--color-tomato-alpha)] text-[var(--color-tomato-orange)]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="font-['Fraunces'] text-base font-bold text-[var(--color-forest-text)]">
                  Preventing Food Spoilage
                </h3>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Large dining kitchens and catering halls regularly prepare buffer quantities that go untouched. Without rapid coordination, safe food gets discarded.
              </p>
            </Card>

            <Card className="p-5 border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-[var(--radius-md)] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)]">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="font-['Fraunces'] text-base font-bold text-[var(--color-forest-text)]">
                  Short-Distance Deliveries
                </h3>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Keeping food deliveries hyperlocal (1 to 3 km) enables student and neighborhood couriers on foot and bicycle to deliver warm meals without motor vehicle expenses.
              </p>
            </Card>

            <Card className="p-5 border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-[var(--radius-md)] bg-emerald-100 text-emerald-800">
                  <Leaf className="w-4 h-4" />
                </div>
                <h3 className="font-['Fraunces'] text-base font-bold text-[var(--color-forest-text)]">
                  Direct Carbon Avoidance
                </h3>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                Food decomposing in landfills generates potent methane. Diverting 1 kg of food waste avoids an estimated 2.50 kg of CO₂e lifecycle emissions (UN FAO standard).
              </p>
            </Card>
          </div>

          {/* Right: Interactive Impact Calculator */}
          <div id="impact" className="lg:col-span-7">
            <LandingImpactCalculator />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: TRUST, SAFETY & VERIFICATION
          ========================================================================= */}
      <section id="trust" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-['Quicksand'] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)] uppercase tracking-wider">
            Trust &amp; Transparency
          </span>
          <h2 className="font-['Fraunces'] text-3xl sm:text-4xl font-extrabold text-[var(--color-forest-text)]">
            Built for Safe &amp; Accountable Rescues
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            FoodBridge combines donor timestamps, role verification, and public audit summaries to maintain safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-3">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-['Fraunces'] text-base font-bold text-[var(--color-forest-text)]">
              Donor Safe-Until Timers
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Every listing specifies when the food was prepared and its maximum safe holding window. Listings that expire without a courier claim are automatically hidden.
            </p>
          </Card>

          <Card className="p-6 border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-3">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-tomato-alpha)] text-[var(--color-tomato-orange)] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-['Fraunces'] text-base font-bold text-[var(--color-forest-text)]">
              Registered Shelter Hubs
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Surplus food is delivered exclusively to verified community shelters, NGOs, and food distribution centers with established meal distribution facilities.
            </p>
          </Card>

          <Card className="p-6 border-[var(--color-border)] bg-[var(--color-bg-surface)] space-y-3">
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-purple-100 text-purple-800 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-['Fraunces'] text-base font-bold text-[var(--color-forest-text)]">
              Public Impact &amp; Audit Log
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Every completed distribution is recorded to our platform impact summary. Explore our monthly diverted meal records and audit log.
            </p>
            <Link to="/impact" className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-leaf-green)] hover:underline pt-1">
              <span>View Quantified Impact Page ➔</span>
            </Link>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: ABOUT THE PROJECT & 5 AIMS (SDG 2 & 12)
          ========================================================================= */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-8 rounded-[var(--radius-lg)] bg-[var(--color-bg-subtle)] border border-[var(--color-border)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
            <div>
              <span className="text-xs font-bold font-['Quicksand'] uppercase tracking-wider text-[var(--color-leaf-green)]">
                About the FoodBridge Initiative
              </span>
              <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-[var(--color-forest-text)] mt-1">
                Five Project Aims &amp; UN Sustainable Development Goals (SDG 2 &amp; SDG 12)
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed font-['Inter'] max-w-3xl">
            FoodBridge addresses the dual challenges of food waste and urban food insecurity by engineering a lightweight coordination system built on five foundational aims:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-1.5">
              <div className="font-['Fraunces'] text-sm font-bold text-[var(--color-leaf-green)] font-mono">01</div>
              <h3 className="font-['Fraunces'] text-sm font-bold text-[var(--color-forest-text)]">Rapid Surplus Notification</h3>
              <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                Allowing dining facilities and caterers to post available portions within 60 seconds with safe-until timestamps.
              </p>
            </div>

            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-1.5">
              <div className="font-['Fraunces'] text-sm font-bold text-[var(--color-leaf-green)] font-mono">02</div>
              <h3 className="font-['Fraunces'] text-sm font-bold text-[var(--color-forest-text)]">Direct Volunteer Dispatch</h3>
              <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                Enabling local couriers on foot and bicycle to claim and execute hyperlocal pickups within 1 to 3 km.
              </p>
            </div>

            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-1.5">
              <div className="font-['Fraunces'] text-sm font-bold text-[var(--color-leaf-green)] font-mono">03</div>
              <h3 className="font-['Fraunces'] text-sm font-bold text-[var(--color-forest-text)]">Shelf-Life Prioritization</h3>
              <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                Color-coded countdown timers (green, yellow, red) that ensure urgent food is dispatched and expired food is hidden.
              </p>
            </div>

            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-1.5">
              <div className="font-['Fraunces'] text-sm font-bold text-[var(--color-leaf-green)] font-mono">04</div>
              <h3 className="font-['Fraunces'] text-sm font-bold text-[var(--color-forest-text)]">Transparent Accounting</h3>
              <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                Measuring verified meal numbers, food waste averted in kilograms, and calculated carbon emissions avoided.
              </p>
            </div>

            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-bg-surface)] border border-[var(--color-border)] space-y-1.5">
              <div className="font-['Fraunces'] text-sm font-bold text-[var(--color-leaf-green)] font-mono">05</div>
              <h3 className="font-['Fraunces'] text-sm font-bold text-[var(--color-forest-text)]">Community Recognition</h3>
              <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
                Recognizing contributing dining kitchens, couriers, and shelters driving community impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FAQ ACCORDION
          ========================================================================= */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold font-['Quicksand'] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)] uppercase tracking-wider">
            Common Questions
          </span>
          <h2 className="font-['Fraunces'] text-3xl sm:text-4xl font-extrabold text-[var(--color-forest-text)]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Everything you need to know about food safety, volunteering, and receiving food.
          </p>
        </div>

        <LandingFaqAccordion />
      </section>

      {/* =========================================================================
          SECTION 9: FINAL CONVERSION BANNER
          ========================================================================= */}
      <section id="get-involved" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[var(--radius-lg)] bg-[var(--color-leaf-green)] text-white p-8 sm:p-12 text-center shadow-[var(--shadow-warm-lg)] space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="font-['Fraunces'] text-3xl sm:text-4xl font-extrabold">
              Ready to Bridge the Food Waste Gap?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 font-['Inter'] leading-relaxed">
              Whether you run a kitchen, cycle between daily stops, or feed the community, join the FoodBridge network today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              to="/donate"
              variant="mango"
              size="lg"
              className="bg-white text-[var(--color-forest-text)] hover:bg-emerald-50 border-transparent font-bold"
            >
              <span>Post Surplus Food ➔</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="bg-emerald-800 text-white hover:bg-emerald-900 border-emerald-700 font-bold"
              onClick={() => openAuthModal({ role: "volunteer", tab: "quick" })}
            >
              <Truck className="w-4 h-4 mr-1.5" />
              <span>Join as Volunteer</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingView;
