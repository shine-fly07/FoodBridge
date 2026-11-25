import React, { useState } from "react";
import { PlusCircle, Clock, MapPin, Utensils, Sparkles, CheckCircle2 } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input, Select, Textarea } from "./ui/FormField";
import { useToast } from "./ui/Toast";

export function DonorForm({ onPostListing, currentUser }) {
  const [title, setTitle] = useState("");
  const [meals, setMeals] = useState(30);
  const [expiresInMinutes, setExpiresInMinutes] = useState(120);
  const [pickupAddress, setPickupAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const expiryPresets = [
    { label: "45 Mins (Urgent)", val: 45 },
    { label: "1.5 Hours", val: 90 },
    { label: "2 Hours (Standard)", val: 120 },
    { label: "4 Hours", val: 240 },
    { label: "8 Hours", val: 480 },
  ];

  const fillSample = () => {
    setTitle("75 Portions Fresh Veg Biryani & Curry");
    setMeals(75);
    setExpiresInMinutes(90);
    setPickupAddress("Campus Student Center, Gate 2 Loading Bay");
    setNotes("100% Pure Vegetarian. Packed in sanitized thermal boxes. Hot and ready for dispatch.");
    toast.info("Auto-filled sample surplus details.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a surplus food description.");
      return;
    }
    const mealCount = Number(meals);
    if (!Number.isInteger(mealCount) || mealCount < 1) {
      toast.error("Number of meals must be a positive integer.");
      return;
    }
    if (!pickupAddress.trim()) {
      toast.error("Please specify a pickup location address.");
      return;
    }

    const safeUntilDate = new Date(Date.now() + Number(expiresInMinutes) * 60000);

    setIsSubmitting(true);
    try {
      await onPostListing({
        title: title.trim(),
        meals: mealCount,
        expiresInMinutes: Number(expiresInMinutes),
        safe_until: safeUntilDate.toISOString(),
        pickup_address: pickupAddress.trim(),
        pickupAddress: pickupAddress.trim(),
        notes: notes.trim(),
        donor_name: currentUser?.name || "Campus Dining Hall",
        donor_org: currentUser?.org || "Campus Canteen",
      });

      // Clear form
      setTitle("");
      setMeals(30);
      setPickupAddress("");
      setNotes("");
    } catch (err) {
      // Error handled in hook toast
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-[var(--color-bg-surface)] border-[var(--color-border)]">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-[var(--radius-md)] bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)]">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-['Fraunces'] text-lg font-bold text-[var(--color-forest-text)]">
              Post Surplus Food Listing
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Alert volunteer couriers and community shelters before safety window lapses
            </p>
          </div>
        </div>

        <Button size="sm" variant="secondary" onClick={fillSample} title="Fill demo data">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-mustard-dark)]" />
          <span>Demo Data</span>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Food Item Description"
          placeholder="e.g., 50 Servings Fresh Vegetarian Pasta & Salad Trays"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Estimated Portions / Meals"
            type="number"
            min="1"
            value={meals}
            onChange={(e) => setMeals(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-bold font-['Quicksand'] text-[var(--color-forest-text)] uppercase tracking-wider mb-1.5">
              Safe Window Preset
            </label>
            <div className="flex flex-wrap gap-1.5">
              {expiryPresets.map((preset) => (
                <button
                  key={preset.val}
                  type="button"
                  onClick={() => setExpiresInMinutes(preset.val)}
                  className={`px-2.5 py-1.5 text-xs font-bold font-['Quicksand'] rounded-[var(--radius-sm)] border transition-all ${
                    expiresInMinutes === preset.val
                      ? "bg-[var(--color-leaf-green)] text-white border-[var(--color-leaf-green)] shadow-xs"
                      : "bg-[var(--color-bg-subtle)] text-[var(--color-forest-text)] border-[var(--color-border)] hover:bg-[#ebded0]"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Input
          label="Pickup Address / Dock Location"
          placeholder="e.g., Dining Hall Gate 3, West Kitchen Loading Dock"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
          required
        />

        <Textarea
          label="Food Safety & Packaging Notes"
          placeholder="e.g., Allergen info, thermal container requirements, contact phone"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-[var(--color-text-muted)] font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-leaf-green)]" />
            <span>Posting instantly notifies online couriers</span>
          </span>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            Publish Surplus Listing
          </Button>
        </div>
      </form>
    </Card>
  );
}
