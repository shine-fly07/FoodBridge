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

import { AppleShape, BowlShape } from "../components/visuals/FoodShapes";
import { ScribbleUnderline, DoodleCircle, SparkleStar, DoodleArrow } from "../components/visuals/Doodles";
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

  // Interactive Sample Walkthrough (Demo Walkthrough) state
  const [simStep, setSimStep] = useState(1);
  const simSteps = [
    {
      num: 1,
      title: "1. Post Surplus",
      status: "Available for Rescue",
      badgeVariant: "leaf",
      desc: "Dining hall or caterer posts 50 unserved portions with a safe-until window.",
      progress: 25,
      meta: "Campus Central Dining • Safe until 4:30 PM",
      portalPath: "/donate",
      portalRole: "donor",
      portalLabel: "Open Donor Hub",
    },
    {
      num: 2,
      title: "2. Claim Route",
      status: "Courier Claimed",
      badgeVariant: "warning",
      desc: "Nearby volunteer Alex claims pickup on bicycle; heads to loading bay.",
      progress: 50,
      meta: "Courier Alex assigned • Pickup Gate 3",
      portalPath: "/courier",
      portalRole: "volunteer",
      portalLabel: "Open Courier Board",
    },
    {
      num: 3,
      title: "3. Deliver Food",
      status: "In Transit",
      badgeVariant: "mango",
      desc: "Wholesome meal boxes in insulated carriers en route to community shelter.",
      progress: 75,
      meta: "Transit to Hope Community Shelter",
      portalPath: "/courier",
      portalRole: "volunteer",
      portalLabel: "View Live Deliveries",
    },
    {
      num: 4,
      title: "4. Confirm & Log",
      status: "Verified Received",
      badgeVariant: "success",
      desc: "Shelter confirms warm receipt; 50 meals and 20kg food waste logged to impact ledger.",
      progress: 100,
      meta: "Confirmed by Hope Shelter Kitchen",
      portalPath: "/ngo",
      portalRole: "ngo",
      portalLabel: "Open Shelter Hub",
    },
  ];

  const currentSim = simSteps[simStep - 1];

  function handleNextSimStep() {
    setSimStep((prev) => (prev === 4 ? 1 : prev + 1));
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
      toast.success("Delivery claimed successfully! View under Courier deliveries.");
    } catch (err) {
      toast.error(err.message || "Could not claim listing.");
    }
  };

  // Up to 3 active available listings
  const teaserListings = availableListings.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* =========================================================================
          SECTION 1: HERO (Soft Pastel Sage/Mint #EEF6F0)
          ========================================================================= */}
      <section
        id="home"
        className="relative overflow-hidden pt-8 sm:pt-14 pb-16 bg-[#EEF6F0] border-b border-[#D6E6DC]"
      >
        {/* Soft Ambient Pastel Glows */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 bg-[#C8E6C9]/40 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 -right-32 w-96 h-96 bg-[#FFF9C4]/40 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-7 space-y-6 relative">
              {/* Floating 3D Apple Accent */}
              <div className="absolute -top-10 -left-6 sm:-left-10 animate-bounce duration-[4000ms] pointer-events-none hidden sm:block">
                <AppleShape variant="glossy-3d" size={80} />
              </div>

              {/* Verified Mission Pill (Zero SDG references) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D6E6DC] text-xs font-semibold text-[#2E7D4F] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Zero food waste to landfill • Rapid local redistribution</span>
              </div>

              {/* Two-Tone Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.035em] leading-[1.08] text-[#16281D]">
                Turn Surplus Food{" "}
                <span className="text-[#5B7363] font-medium">into</span>{" "}
                <span className="relative inline-block text-[#16281D]">
                  Community Meals.
                  <ScribbleUnderline color="#F59E0B" className="mt-1" />
                </span>
              </h1>

              {/* Concise Subcopy */}
              <p className="text-base sm:text-lg text-[#476352] leading-relaxed max-w-xl">
                FoodBridge connects canteens, restaurants, hostels, and caterers with local volunteer couriers to deliver wholesome unserved meals to community shelters before food spoils.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/donate"
                  className="group inline-flex items-center gap-3 text-base font-bold text-[#16281D] hover:text-[#2E7D4F] transition-colors"
                >
                  <span className="underline decoration-3 underline-offset-8 decoration-[#2E7D4F]">
                    Donate Surplus Food
                  </span>
                  <span className="w-9 h-9 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-[#2E7D4F]/20">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Button
                  to="/courier"
                  variant="secondary"
                  size="md"
                  className="rounded-full bg-white hover:bg-[#F2F8F4] text-[#16281D] border-[#D6E6DC] shadow-xs px-5"
                >
                  <Truck className="w-4 h-4 mr-1.5 text-[#2E7D4F]" />
                  <span>Join as Volunteer</span>
                </Button>
              </div>

              {/* Live Platform Stats Strip */}
              <LandingHeroStats
                fallbackMeals={totalDivertedMeals}
                fallbackActive={activeListingsCount}
              />
            </div>

            {/* Right Column: Interactive Sample Walkthrough (Clearly Labelled Demo) */}
            <div className="lg:col-span-5 relative">
              {/* Floating Warm Bowl Accent */}
              <div className="absolute -top-8 -right-4 sm:-right-8 animate-pulse duration-[5000ms] pointer-events-none z-10 hidden sm:block">
                <BowlShape variant="glossy-3d" size={88} />
              </div>

              <div className="rounded-[28px] bg-white border border-[#D6E6DC] p-6 shadow-xl shadow-[#16281D]/5 relative backdrop-blur-sm">
                {/* Header with clear Demo Walkthrough Banner */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8F2EC]">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#2E7D4F] uppercase">
                    <span className="w-2 h-2 rounded-full bg-[#2E7D4F] animate-ping" />
                    <span>Interactive Sample Walkthrough</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#5B7363] px-2 py-0.5 rounded-full bg-[#EEF6F0] border border-[#D6E6DC]">
                    Demo Walkthrough
                  </span>
                </div>

                {/* 4 Steps Tabs */}
                <div className="grid grid-cols-4 gap-1 p-1 bg-[#EEF6F0] rounded-xl mb-4 text-xs font-bold">
                  {simSteps.map((s) => (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => setSimStep(s.num)}
                      className={`py-1.5 rounded-lg transition-all text-center ${
                        simStep === s.num
                          ? "bg-white text-[#16281D] shadow-xs font-extrabold"
                          : "text-[#5B7363] hover:text-[#16281D]"
                      }`}
                    >
                      {s.num}. {s.title.split(" ")[1]}
                    </button>
                  ))}
                </div>

                {/* Simulation Content Body */}
                <div className="p-4 rounded-2xl bg-[#F7FBF8] border border-[#E0EDE4] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant={currentSim.badgeVariant}>
                      {currentSim.status}
                    </Badge>
                    <span className="text-[11px] text-[#5B7363] font-mono">
                      Step {simStep} of 4
                    </span>
                  </div>

                  <p className="text-base font-bold text-[#16281D]">
                    50 Servings Fresh Veg Curry &amp; Rice
                  </p>

                  <p className="text-xs text-[#5B7363] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>{currentSim.meta}</span>
                  </p>

                  {/* Progress Track */}
                  <div className="w-full bg-[#E0EDE4] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2E7D4F] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${currentSim.progress}%` }}
                    />
                  </div>

                  <p className="text-xs text-[#476352] leading-relaxed">
                    {currentSim.desc}
                  </p>
                </div>

                {/* Action Controls */}
                <div className="pt-4 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleNextSimStep}
                    className="w-full sm:flex-1 py-2 px-4 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white font-bold text-xs transition-all text-center shadow-xs"
                  >
                    {simStep === 4 ? "Restart Walkthrough ↺" : "Next Step ➔"}
                  </button>
                  <Button
                    to={currentSim.portalPath}
                    variant="secondary"
                    size="sm"
                    className="w-full sm:flex-1 rounded-full bg-[#EEF6F0] hover:bg-[#E2EDE5] text-[#16281D] font-bold text-xs border border-[#D6E6DC]"
                    onClick={() => setActiveRole(currentSim.portalRole)}
                  >
                    {currentSim.portalLabel} ➔
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CHOOSE YOUR PATH (ROLE CARDS)
          ========================================================================= */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#2E7D4F] bg-[#E8F5E9] border border-[#C8E6C9] shadow-xs">
            Choose Your Path
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16281D]">
            How Do You Want to Participate?
          </h2>
          <p className="text-sm text-[#476352]">
            Whether you manage a food facility, want to volunteer locally, or represent a shelter, FoodBridge makes coordination seamless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Role 1: Food Donor */}
          <div className="p-7 rounded-[24px] bg-white border border-[#D6E6DC] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#2E7D4F] border border-[#C8E6C9] flex items-center justify-center">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#16281D]">
                I Have Surplus Food
              </h3>
              <p className="text-xs sm:text-sm text-[#476352] leading-relaxed">
                For university canteens, hostels, restaurants, and caterers. Post portion estimates and pickup location in under 60 seconds with safe-until timestamps.
              </p>
            </div>
            <Button to="/donate" variant="primary" size="md" className="w-full rounded-full font-bold">
              <span>List Surplus Food ➔</span>
            </Button>
          </div>

          {/* Role 2: Volunteer Courier */}
          <div className="p-7 rounded-[24px] bg-white border border-[#D6E6DC] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8E1] text-[#D97706] border border-[#FFE082] flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#16281D]">
                I Can Deliver Locally
              </h3>
              <p className="text-xs sm:text-sm text-[#476352] leading-relaxed">
                Have 30 minutes to spare? Pick up fresh meal boxes on foot or bicycle and deliver directly to nearby shelters (typically 1 to 3 km away).
              </p>
            </div>
            <Button to="/courier" variant="mango" size="md" className="w-full rounded-full font-bold text-[#16281D]">
              <span>View Delivery Board ➔</span>
            </Button>
          </div>

          {/* Role 3: Shelter Hub */}
          <div className="p-7 rounded-[24px] bg-white border border-[#D6E6DC] shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F3E5F5] text-[#7B1FA2] border border-[#E1BEE7] flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#16281D]">
                We Need Food for Shelters
              </h3>
              <p className="text-xs sm:text-sm text-[#476352] leading-relaxed">
                For registered NGOs, community kitchens, and shelters. Receive fresh, unserved meals delivered to your door at zero cost.
              </p>
            </div>
            <Button to="/ngo" variant="secondary" size="md" className="w-full rounded-full font-bold text-[#16281D]">
              <span>Access Shelter Hub ➔</span>
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: HYPERLOCAL NETWORK (Scattered Rotated Pastel Pills)
          ========================================================================= */}
      <section className="bg-[#F6F1E7] py-20 px-4 sm:px-6 lg:px-8 border-y border-[#E2DDD1]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#795548] bg-white border border-[#E0D7C7] px-3.5 py-1 rounded-full shadow-xs">
              Hyperlocal Network
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16281D]">
              Bridging surplus to sustenance.
            </h2>
            <p className="text-sm text-[#476352]">
              An active community coordination system engineered for immediate neighborhood relief.
            </p>
          </div>

          {/* Scattered Rotated Pills in Soft Pastel Candies */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto py-6">
            <span className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] shadow-xs transform -rotate-6 hover:rotate-0 transition-transform">
              Hostel Messes
            </span>
            <span className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#E0F2F1] text-[#004D40] border border-[#B2DFDB] shadow-xs transform rotate-12 hover:rotate-0 transition-transform">
              Zero Landfill
            </span>
            <span className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#F3E5F5] text-[#4A148C] border border-[#E1BEE7] shadow-xs transform -rotate-12 hover:rotate-0 transition-transform">
              Event Catering
            </span>
            <span className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#FFF9C4] text-[#F57F17] border border-[#FFF59D] shadow-xs transform rotate-6 hover:rotate-0 transition-transform">
              Safe-Until Timers
            </span>
            <span className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#FFE0B2] text-[#E65100] border border-[#FFCC80] shadow-xs transform -rotate-3 hover:rotate-0 transition-transform">
              Local Pickups
            </span>
            <span className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#E1F5FE] text-[#01579B] border border-[#B3E5FC] shadow-xs transform rotate-8 hover:rotate-0 transition-transform">
              Campus Cafeterias
            </span>
            <span className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#EFEBE9] text-[#3E2723] border border-[#D7CCC8] shadow-xs transform -rotate-8 hover:rotate-0 transition-transform">
              Community Kitchens
            </span>
            <span className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#E8EAF6] text-[#1A237E] border border-[#C5CAE9] shadow-xs transform rotate-14 hover:rotate-0 transition-transform">
              Registered NGOs
            </span>
            <span className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold bg-[#FCE4EC] text-[#880E4F] border border-[#F8BBD0] shadow-xs transform -rotate-6 hover:rotate-0 transition-transform">
              Rapid Redistribution
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: OPERATIONAL WORKFLOW & TIMER LEGEND
          ========================================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#2E7D4F] bg-[#E8F5E9] border border-[#C8E6C9] shadow-xs">
            Operational Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16281D]">
            Four Steps to Zero Food Waste
          </h2>
          <p className="text-sm text-[#476352]">
            A fast, accountable rescue pipeline that prioritizes food freshness and food safety.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl border border-[#D6E6DC] bg-white shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#2E7D4F] text-white font-bold flex items-center justify-center text-sm shadow-xs">
              1
            </div>
            <h3 className="text-lg font-bold text-[#16281D]">
              1. Post Surplus
            </h3>
            <p className="text-xs text-[#476352] leading-relaxed">
              Donors specify portion count, pickup location, and safe-until window right after meal preparation or dining service.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#D6E6DC] bg-white shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#D97706] text-white font-bold flex items-center justify-center text-sm shadow-xs">
              2
            </div>
            <h3 className="text-lg font-bold text-[#16281D]">
              2. Courier Claims
            </h3>
            <p className="text-xs text-[#476352] leading-relaxed">
              Nearby volunteer couriers browse available listings and claim the delivery route on the live board.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#D6E6DC] bg-white shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#7B1FA2] text-white font-bold flex items-center justify-center text-sm shadow-xs">
              3
            </div>
            <h3 className="text-lg font-bold text-[#16281D]">
              3. Transport Food
            </h3>
            <p className="text-xs text-[#476352] leading-relaxed">
              Meals are collected and transported directly to registered community shelters (typically local pickups within 1 to 3 km).
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#D6E6DC] bg-white shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-full bg-[#1B5E20] text-white font-bold flex items-center justify-center text-sm shadow-xs">
              4
            </div>
            <h3 className="text-lg font-bold text-[#16281D]">
              4. Confirm &amp; Log
            </h3>
            <p className="text-xs text-[#476352] leading-relaxed">
              The receiving shelter confirms meal arrival; saved food and greenhouse gas offsets are logged to the public impact ledger.
            </p>
          </div>
        </div>

        {/* Safety Countdown Legend */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6E6DC] shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#16281D] uppercase tracking-wider">
            <Clock className="w-4 h-4 text-[#2E7D4F]" />
            <span>Shelf-Life &amp; Safety Timer Legend:</span>
          </div>
          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[#16281D]">
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
          <p className="text-[11px] text-[#5B7363] pt-1 border-t border-[#E8F2EC]">
            ✓ Verified Auto-Expiry: Listings that pass their donor-specified safe-until window without being claimed are automatically hidden from the active board.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: LIVE SURPLUS TEASER
          ========================================================================= */}
      <section id="live-surplus" className="py-14 bg-white border-y border-[#D6E6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#FFF8E1] text-[#D97706] border border-[#FFE082] uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Live Surplus Board</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16281D] mt-2">
                Active Listings Ready for Rescue
              </h2>
              <p className="text-xs sm:text-sm text-[#476352] mt-1">
                Batches currently posted by kitchens awaiting volunteer courier pickup.
              </p>
            </div>

            <Button to="/courier" variant="secondary" size="sm" className="rounded-full">
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
                  <div
                    key={listing.id}
                    className="p-6 rounded-2xl flex flex-col justify-between border border-[#D6E6DC] bg-[#FBF8F1] shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-[#16281D] leading-snug">
                          {listing.title}
                        </h3>
                        <Badge variant="leaf">Available</Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white text-xs font-bold text-[#16281D] border border-[#D6E6DC] shadow-xs">
                          <Utensils className="w-3 h-3 text-[#2E7D4F]" />
                          <span>{listing.meals} Portions</span>
                        </span>

                        {expiresAt && <ExpiryBadge expiresAt={expiresAt} />}
                      </div>

                      <div className="text-xs text-[#476352] space-y-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#2E7D4F] shrink-0" />
                          <span className="truncate">{listing.pickup_address || "Pickup address provided"}</span>
                        </div>
                        {listing.donor_name && (
                          <div className="text-[11px] text-[#5B7363] pl-5">
                            From: {listing.donor_name}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full rounded-full"
                      onClick={() => handleTeaserClaim(listing.id)}
                    >
                      <span>Claim as Volunteer ➔</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: WHY IT MATTERS & CALCULATOR
          ========================================================================= */}
      <section id="problem" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#2E7D4F] bg-[#E8F5E9] border border-[#C8E6C9] shadow-xs">
            Why It Matters
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16281D]">
            Transforming Waste into Sustenance
          </h2>
          <p className="text-sm text-[#476352]">
            A small shift in logistics prevents edible food from generating landfill methane while feeding local families.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3 Factual Pillars */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl border border-[#D6E6DC] bg-white shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#FBE9E7] text-[#E8643C]">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#16281D]">
                  Preventing Food Spoilage
                </h3>
              </div>
              <p className="text-xs text-[#476352] leading-relaxed">
                Large dining kitchens and catering halls regularly prepare buffer quantities that go untouched. Without rapid coordination, safe food gets discarded.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#D6E6DC] bg-white shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#E8F5E9] text-[#2E7D4F]">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#16281D]">
                  Local Deliveries
                </h3>
              </div>
              <p className="text-xs text-[#476352] leading-relaxed">
                Keeping food deliveries local (typically 1 to 3 km) enables student and neighborhood couriers on foot and bicycle to deliver warm meals without motor vehicle expenses.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[#D6E6DC] bg-white shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#E8F5E9] text-[#1B5E20]">
                  <Leaf className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#16281D]">
                  Direct Carbon Avoidance
                </h3>
              </div>
              <p className="text-xs text-[#476352] leading-relaxed">
                Food decomposing in landfills generates potent methane. Diverting 1 kg of food waste avoids an estimated 2.50 kg of CO₂e lifecycle emissions (UN FAO standard).
              </p>
            </div>
          </div>

          {/* Right: Interactive Impact Calculator */}
          <div id="impact" className="lg:col-span-7">
            <LandingImpactCalculator />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: TRUST & TRANSPARENCY
          ========================================================================= */}
      <section id="trust" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#2E7D4F] bg-[#E8F5E9] border border-[#C8E6C9] shadow-xs">
            Trust &amp; Transparency
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16281D]">
            Built for Safe &amp; Accountable Rescues
          </h2>
          <p className="text-sm text-[#476352]">
            FoodBridge combines donor timestamps, role verification, and public audit summaries to maintain safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-[#D6E6DC] bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] text-[#2E7D4F] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#16281D]">
              Donor Safe-Until Timers
            </h3>
            <p className="text-xs text-[#476352] leading-relaxed">
              Every listing specifies when the food was prepared and its maximum safe holding window. Listings that expire without a courier claim are automatically hidden.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#D6E6DC] bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FBE9E7] text-[#E8643C] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#16281D]">
              Registered NGOs &amp; Shelters
            </h3>
            <p className="text-xs text-[#476352] leading-relaxed">
              Surplus food is delivered exclusively to registered community shelters, NGOs, and food distribution centers with established meal distribution facilities.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-[#D6E6DC] bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3E5F5] text-[#7B1FA2] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#16281D]">
              Public Impact &amp; Audit Log
            </h3>
            <p className="text-xs text-[#476352] leading-relaxed">
              Every completed distribution is recorded to our platform impact summary. Explore our monthly diverted meal records and audit log.
            </p>
            <Link to="/impact" className="inline-flex items-center gap-1 text-xs font-bold text-[#2E7D4F] hover:underline pt-1">
              <span>View Quantified Impact Page ➔</span>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FIVE FOUNDATIONAL PROJECT AIMS (Zero SDG text)
          ========================================================================= */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-8 rounded-[28px] bg-[#F6F1E7] border border-[#E2DDD1] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DDD1] pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F]">
                About the FoodBridge Initiative
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16281D] mt-1">
                Five Foundational Project Aims
              </h2>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#476352] leading-relaxed max-w-3xl">
            FoodBridge addresses the dual challenges of food waste and urban food insecurity by engineering a lightweight coordination system built on five foundational aims:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-white border border-[#E2DDD1] space-y-1.5 shadow-xs">
              <div className="text-sm font-bold text-[#2E7D4F] font-mono">01</div>
              <h3 className="text-sm font-bold text-[#16281D]">Rapid Surplus Notification</h3>
              <p className="text-[11px] text-[#476352] leading-relaxed">
                Allowing dining facilities and caterers to post available portions within 60 seconds with safe-until timestamps.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2DDD1] space-y-1.5 shadow-xs">
              <div className="text-sm font-bold text-[#2E7D4F] font-mono">02</div>
              <h3 className="text-sm font-bold text-[#16281D]">Direct Volunteer Dispatch</h3>
              <p className="text-[11px] text-[#476352] leading-relaxed">
                Enabling local couriers on foot and bicycle to claim and execute local pickups within 1 to 3 km.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2DDD1] space-y-1.5 shadow-xs">
              <div className="text-sm font-bold text-[#2E7D4F] font-mono">03</div>
              <h3 className="text-sm font-bold text-[#16281D]">Shelf-Life Prioritization</h3>
              <p className="text-[11px] text-[#476352] leading-relaxed">
                Color-coded countdown timers (green, yellow, red) that ensure urgent food is dispatched and expired food is hidden.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2DDD1] space-y-1.5 shadow-xs">
              <div className="text-sm font-bold text-[#2E7D4F] font-mono">04</div>
              <h3 className="text-sm font-bold text-[#16281D]">Transparent Accounting</h3>
              <p className="text-[11px] text-[#476352] leading-relaxed">
                Measuring verified meal numbers, food waste averted in kilograms, and calculated carbon emissions avoided.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E2DDD1] space-y-1.5 shadow-xs">
              <div className="text-sm font-bold text-[#2E7D4F] font-mono">05</div>
              <h3 className="text-sm font-bold text-[#16281D]">Community Recognition</h3>
              <p className="text-[11px] text-[#476352] leading-relaxed">
                Recognizing contributing dining kitchens, couriers, and shelters driving community impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: FAQ ACCORDION
          ========================================================================= */}
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#2E7D4F] bg-[#E8F5E9] border border-[#C8E6C9] shadow-xs">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16281D]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#476352]">
            Everything you need to know about food safety, volunteering, and receiving food.
          </p>
        </div>

        <LandingFaqAccordion />
      </section>

      {/* =========================================================================
          SECTION 10: FINAL CONVERSION BANNER
          ========================================================================= */}
      <section id="get-involved" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] bg-[#2E7D4F] text-white p-8 sm:p-14 text-center shadow-lg shadow-[#2E7D4F]/15 space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Bridge the Food Waste Gap?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Whether you run a kitchen, cycle between daily stops, or feed the community, join the FoodBridge network today.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              to="/donate"
              variant="mango"
              size="lg"
              className="bg-white text-[#16281D] hover:bg-emerald-50 border-transparent font-bold rounded-full px-6 shadow-sm"
            >
              <span>Post Surplus Food ➔</span>
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="bg-[#1E5434] text-white hover:bg-[#163E26] border-emerald-600/50 font-bold rounded-full px-6"
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
