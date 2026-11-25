import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Truck, ArrowRight, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { AppleShape, BowlShape } from "../components/visuals/FoodShapes";
import { ScribbleUnderline, DoodleCircle, SparkleStar, DoodleArrow } from "../components/visuals/Doodles";

export function RedesignPreviewView() {
  const [shapeStyle, setShapeStyle] = useState("glossy-3d"); // "glossy-3d" | "flat-gloss"
  const [simStep, setSimStep] = useState(1);

  const simSteps = [
    {
      num: 1,
      title: "1. Post Surplus",
      status: "Available for Rescue",
      desc: "Kitchen posts 50 fresh portions with a 2-hour safe-until window.",
      progress: 25,
      meta: "Campus Central Dining • Safe until 4:30 PM",
    },
    {
      num: 2,
      title: "2. Claim Route",
      status: "Courier Claimed",
      desc: "Volunteer Alex claims pickup on bicycle; heads to loading bay.",
      progress: 50,
      meta: "Courier Alex assigned • Pickup Gate 3",
    },
    {
      num: 3,
      title: "3. Deliver Food",
      status: "In Transit",
      desc: "Meal boxes in insulated carriers en route to community shelter.",
      progress: 75,
      meta: "Transit to Hope Community Shelter",
    },
    {
      num: 4,
      title: "4. Confirm & Log",
      status: "Verified Received",
      desc: "Shelter confirms warm receipt; 50 meals and 20kg food waste logged.",
      progress: 100,
      meta: "Distribution confirmed by shelter kitchen",
    },
  ];

  const currentStep = simSteps[simStep - 1];

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-[#16281D] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#C8E6C9] selection:text-[#1B5E20]">
      {/* Top Banner: Review Controls */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E2DDD1] px-4 py-3 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D4F] animate-pulse" />
            <h1 className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F]">
              Pastel Visual Redesign Preview (Soft Organic Look &amp; Feel)
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#5B7363] font-medium">Food Shape Style:</span>
            <div className="inline-flex p-0.5 rounded-full bg-[#EDE8DC] border border-[#DDD5C5]">
              <button
                type="button"
                onClick={() => setShapeStyle("glossy-3d")}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  shapeStyle === "glossy-3d"
                    ? "bg-[#2E7D4F] text-white shadow-xs"
                    : "text-[#5B7363] hover:text-[#16281D]"
                }`}
              >
                Glossy 3D (Layered SVG)
              </button>
              <button
                type="button"
                onClick={() => setShapeStyle("flat-gloss")}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  shapeStyle === "flat-gloss"
                    ? "bg-[#2E7D4F] text-white shadow-xs"
                    : "text-[#5B7363] hover:text-[#16281D]"
                }`}
              >
                Flat-Gloss (Geometric Sheen)
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          HERO SECTION (Soft Pastel Sage/Mint #EEF6F0)
          ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-24 px-4 sm:px-6 lg:px-8 bg-[#EEF6F0] border-b border-[#D6E6DC]">
        {/* Soft Ambient Pastel Glows */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 bg-[#C8E6C9]/40 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 -right-32 w-96 h-96 bg-[#FFF9C4]/40 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto">
          {/* Top Minimal Brand Bar */}
          <div className="flex items-center justify-between pb-12">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#2E7D4F] flex items-center justify-center font-black text-white text-sm shadow-xs">
                FB
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#16281D]">FoodBridge</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs px-3 py-1 rounded-full bg-white text-[#2E7D4F] font-semibold border border-[#D6E6DC] shadow-xs">
                Donor Hub
              </span>
              <button
                type="button"
                className="text-xs px-4 py-1.5 rounded-full bg-[#16281D] text-white font-bold hover:bg-[#254231] transition-all shadow-xs"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Headlines & Two-Tone Typography */}
            <div className="lg:col-span-7 space-y-6 relative">
              {/* Floating 3D/Flat Apple Accent */}
              <div className="absolute -top-12 -left-6 sm:-left-10 animate-bounce duration-[4000ms] pointer-events-none">
                <AppleShape variant={shapeStyle} size={84} />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D6E6DC] text-xs font-semibold text-[#2E7D4F] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#E68A00]" />
                <span>Zero food waste to landfill • Rapid local redistribution</span>
              </div>

              <h2 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-[-0.035em] leading-[1.08] text-[#16281D]">
                Turn surplus food{" "}
                <span className="text-[#5B7363] font-medium">into</span>{" "}
                <span className="relative inline-block text-[#16281D]">
                  community meals.
                  <ScribbleUnderline color="#F59E0B" className="mt-1" />
                </span>
              </h2>

              <p className="text-base sm:text-lg text-[#476352] leading-relaxed max-w-xl">
                FoodBridge coordinates university canteens, restaurants, caterers, and volunteer couriers
                to deliver wholesome unserved meals to local community shelters before food spoils.
              </p>

              {/* CTAs matching reference style with pastel warmth */}
              <div className="flex flex-wrap items-center gap-5 pt-3">
                <Link
                  to="/donate"
                  className="group inline-flex items-center gap-3 text-base font-bold text-[#16281D] hover:text-[#2E7D4F] transition-colors"
                >
                  <span className="underline decoration-3 underline-offset-8 decoration-[#2E7D4F]">
                    Get started
                  </span>
                  <span className="w-9 h-9 rounded-full bg-[#2E7D4F] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-[#2E7D4F]/20">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link
                  to="/courier"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F2F8F4] text-[#16281D] font-bold text-sm border border-[#D6E6DC] shadow-xs transition-all"
                >
                  <Truck className="w-4 h-4 text-[#2E7D4F]" />
                  <span>Join as Volunteer</span>
                </Link>
              </div>

              {/* Standalone Visual Accent Comparison Box */}
              <div className="pt-6 border-t border-[#D6E6DC] mt-6 flex items-center gap-8">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#5B7363] font-bold block mb-2">
                    Active Shapes ({shapeStyle}):
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <AppleShape variant={shapeStyle} size={58} />
                      <span className="text-[10px] text-[#476352] font-mono">Apple</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <BowlShape variant={shapeStyle} size={58} />
                      <span className="text-[10px] text-[#476352] font-mono">Warm Bowl</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-[#5B7363] max-w-xs space-y-1 pl-4 border-l border-[#D6E6DC]">
                  <p className="font-bold text-[#16281D]">Soft-lit vector aesthetic</p>
                  <p className="text-[11px] text-[#5B7363] leading-snug">
                    Zero image weight (&lt;3KB pure SVG). Toggle styles using the top switcher to evaluate.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Interactive Sample Walkthrough Card (Clearly Labelled Demo) */}
            <div className="lg:col-span-5 relative">
              {/* Floating Bowl Accent over the card */}
              <div className="absolute -top-8 -right-4 sm:-right-8 animate-pulse duration-[5000ms] pointer-events-none z-10">
                <BowlShape variant={shapeStyle} size={90} />
              </div>

              <div className="rounded-[28px] bg-white border border-[#D6E6DC] p-6 shadow-xl shadow-[#16281D]/5 relative backdrop-blur-sm">
                {/* Header with clear Sample Walkthrough Demo Banner */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E8F2EC]">
                  <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#2E7D4F] uppercase">
                    <span className="w-2 h-2 rounded-full bg-[#2E7D4F] animate-ping" />
                    <span>Interactive Sample Walkthrough</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#5B7363] px-2 py-0.5 rounded-full bg-[#EEF6F0] border border-[#D6E6DC]">
                    Demo Mode
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
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D8EFE0] text-[#1B5E20] font-bold border border-[#BDE3CA]">
                      {currentStep.status}
                    </span>
                    <span className="text-[11px] text-[#5B7363] font-mono">
                      Step {simStep} of 4
                    </span>
                  </div>

                  <p className="text-base font-bold text-[#16281D]">
                    50 Servings Fresh Veg Curry &amp; Rice
                  </p>

                  <p className="text-xs text-[#5B7363] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D97706]" />
                    <span>{currentStep.meta}</span>
                  </p>

                  {/* Progress Track */}
                  <div className="w-full bg-[#E0EDE4] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#2E7D4F] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${currentStep.progress}%` }}
                    />
                  </div>

                  <p className="text-xs text-[#476352] leading-relaxed">
                    {currentStep.desc}
                  </p>
                </div>

                {/* Action Controls */}
                <div className="pt-4 flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSimStep(simStep === 4 ? 1 : simStep + 1)}
                    className="flex-1 py-2 px-4 rounded-full bg-[#2E7D4F] hover:bg-[#256640] text-white font-bold text-xs transition-all text-center shadow-xs"
                  >
                    {simStep === 4 ? "Restart Walkthrough ↺" : "Next Step ➔"}
                  </button>
                  <Link
                    to="/donate"
                    className="flex-1 py-2 px-4 rounded-full bg-[#EEF6F0] hover:bg-[#E2EDE5] text-[#16281D] font-bold text-xs transition-all text-center border border-[#D6E6DC]"
                  >
                    Open Live Board ➔
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 PREVIEW: STATS IN SOFT CIRCULAR DISCS (Soft Pastel Cream #FBF8F1)
          ========================================================================= */}
      <section className="bg-[#FBF8F1] text-[#16281D] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2DDD1]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D4F] bg-[#E8F5E9] border border-[#C8E6C9] px-3.5 py-1 rounded-full shadow-xs">
              Real-Time Impact
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16281D]">
              Measured community diversion.
            </h3>
            <p className="text-sm text-[#476352]">
              Live metrics recorded directly from completed donor pickups and shelter handovers.
            </p>
          </div>

          {/* Scattered Circular Stat Discs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center relative">
            {/* Stat Circle 1 */}
            <div className="w-56 h-56 rounded-full bg-white border border-[#E2DDD1] shadow-[0_8px_30px_rgba(22,40,29,0.05)] flex flex-col items-center justify-center p-6 text-center transform -translate-y-2 hover:-translate-y-4 transition-transform">
              <span className="text-4xl sm:text-5xl font-black text-[#16281D] tracking-tight">
                640
              </span>
              <span className="text-xs font-bold text-[#476352] uppercase tracking-wider mt-2">
                Meals Rescued
              </span>
              <span className="text-[11px] text-[#5B7363] mt-1">Direct to local families</span>
            </div>

            {/* Doodle Star in between */}
            <div className="hidden md:block absolute top-12 left-[32%] pointer-events-none">
              <SparkleStar color="#F59E0B" size={28} />
            </div>

            {/* Stat Circle 2 */}
            <div className="w-60 h-60 rounded-full bg-white border border-[#D6E6DC] shadow-[0_8px_30px_rgba(46,125,79,0.08)] flex flex-col items-center justify-center p-6 text-center transform translate-y-3 hover:translate-y-1 transition-transform ring-4 ring-[#E8F5E9]">
              <span className="text-4xl sm:text-5xl font-black text-[#2E7D4F] tracking-tight">
                256 kg
              </span>
              <span className="text-xs font-bold text-[#476352] uppercase tracking-wider mt-2">
                Food Diverted
              </span>
              <span className="text-[11px] text-[#5B7363] mt-1">Zero landfill methane</span>
            </div>

            {/* Doodle Arrow in between */}
            <div className="hidden md:block absolute bottom-10 right-[31%] pointer-events-none">
              <DoodleArrow color="#0284C7" />
            </div>

            {/* Stat Circle 3 */}
            <div className="w-56 h-56 rounded-full bg-white border border-[#E2DDD1] shadow-[0_8px_30px_rgba(22,40,29,0.05)] flex flex-col items-center justify-center p-6 text-center transform -translate-y-1 hover:-translate-y-3 transition-transform">
              <span className="text-4xl sm:text-5xl font-black text-[#16281D] tracking-tight">
                640 kg
              </span>
              <span className="text-xs font-bold text-[#476352] uppercase tracking-wider mt-2">
                CO₂e Avoided
              </span>
              <span className="text-[11px] text-[#5B7363] mt-1">~2.5 kg CO₂e per kg waste</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 PREVIEW: SCATTERED ROTATED PILLS (Soft Pastel Oatmeal #F6F1E7)
          ========================================================================= */}
      <section className="bg-[#F6F1E7] text-[#16281D] py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E2DDD1]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#795548] bg-white border border-[#E0D7C7] px-3.5 py-1 rounded-full shadow-xs">
              Hyperlocal Network
            </span>
            <h3 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#16281D]">
              Bridging surplus to sustenance.
            </h3>
            <p className="text-sm text-[#476352]">
              An active community coordination system engineered for immediate neighborhood relief.
            </p>
          </div>

          {/* Rotated Vocabulary Pills in Soft Pastel Candies */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto py-8">
            <span className="px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#E8F5E9] text-[#1B5E20] border border-[#C8E6C9] shadow-xs transform -rotate-6 hover:rotate-0 transition-transform">
              Hostel Messes
            </span>
            <span className="px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#E0F2F1] text-[#004D40] border border-[#B2DFDB] shadow-xs transform rotate-12 hover:rotate-0 transition-transform">
              Zero Landfill
            </span>
            <span className="px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#F3E5F5] text-[#4A148C] border border-[#E1BEE7] shadow-xs transform -rotate-12 hover:rotate-0 transition-transform">
              Event Catering
            </span>
            <span className="px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#FFF9C4] text-[#F57F17] border border-[#FFF59D] shadow-xs transform rotate-6 hover:rotate-0 transition-transform">
              Safe-Until Timers
            </span>
            <span className="px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#FFE0B2] text-[#E65100] border border-[#FFCC80] shadow-xs transform -rotate-3 hover:rotate-0 transition-transform">
              Local Pickups
            </span>
            <span className="px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#E1F5FE] text-[#01579B] border border-[#B3E5FC] shadow-xs transform rotate-8 hover:rotate-0 transition-transform">
              Campus Cafeterias
            </span>
            <span className="px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#EFEBE9] text-[#3E2723] border border-[#D7CCC8] shadow-xs transform -rotate-8 hover:rotate-0 transition-transform">
              Community Kitchens
            </span>
            <span className="px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#E8EAF6] text-[#1A237E] border border-[#C5CAE9] shadow-xs transform rotate-14 hover:rotate-0 transition-transform">
              Registered NGOs
            </span>
            <span className="px-5 py-2 rounded-full text-xs sm:text-sm font-bold bg-[#FCE4EC] text-[#880E4F] border border-[#F8BBD0] shadow-xs transform -rotate-6 hover:rotate-0 transition-transform">
              Rapid Redistribution
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FLOATING BOTTOM PILL NAV PREVIEW (Fixed at Bottom-Center)
          ========================================================================= */}
      <div className="fixed bottom-6 inset-x-0 mx-auto w-max z-50 pointer-events-auto">
        <nav
          aria-label="Bottom Navigation"
          className="bg-[#162D20]/95 border border-[#2D5A40] shadow-2xl backdrop-blur-xl px-5 py-2 rounded-full flex items-center gap-4 text-xs font-semibold text-emerald-100"
        >
          <span className="text-white font-extrabold bg-[#2E7D4F] px-3.5 py-1 rounded-full shadow-xs" aria-current="page">
            Home
          </span>
          <Link to="/donate" className="hover:text-white transition-colors">
            Donate
          </Link>
          <Link to="/courier" className="hover:text-white transition-colors">
            Courier
          </Link>
          <Link to="/ngo" className="hover:text-white transition-colors">
            NGO Hub
          </Link>
          <Link to="/impact" className="hover:text-white transition-colors">
            Impact
          </Link>
          <Link to="/portal" className="hover:text-white transition-colors">
            Portal
          </Link>

          <span className="w-px h-4 bg-emerald-600/40" />

          <Link
            to="/donate"
            className="bg-[#4ADE80] hover:bg-[#86EFAC] text-[#0A2612] font-black px-4 py-1.5 rounded-full transition-all shadow-sm"
          >
            Donate Food ➔
          </Link>
        </nav>
      </div>
    </div>
  );
}
