import React, { useState } from "react";
import { Mail, Lock, User, Building, AlertCircle, Sparkles, KeyRound } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input, Select } from "./ui/FormField";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./ui/Toast";

export function AuthModal({ isOpen, onClose, options = {} }) {
  const { login, signup } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState("quick"); // "quick" | "account"
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Quick Demo Accounts
  const demoAccounts = [
    {
      name: "Campus Canteen Manager",
      role: "donor",
      org: "Green Valley Dining Hall",
      email: "donor@foodbridge.org",
      id: 1,
    },
    {
      name: "Courier Alex",
      role: "volunteer",
      org: "Swift Rescue Network",
      email: "volunteer@foodbridge.org",
      id: 2,
    },
    {
      name: "Hope Shelter Staff",
      role: "ngo",
      org: "Hope Community Shelter",
      email: "ngo@foodbridge.org",
      id: 3,
    },
  ];

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");
  const [org, setOrg] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (options.role) {
        setRole(options.role);
      }
      if (options.tab) {
        setTab(options.tab);
      }
    }
  }, [isOpen, options]);

  async function handleQuickSelect(acc) {
    try {
      setLoading(true);
      await login({ demoRole: acc.role });
      toast.success(`Active as ${acc.name} (${acc.role.toUpperCase()}).`);
      onClose();
      if (options.onLoginSuccess) {
        try {
          await options.onLoginSuccess(acc);
        } catch (_e) {}
      }
    } catch (err) {
      toast.error(err.message || "Failed to switch role");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (isRegisterMode) {
        if (!name.trim()) {
          toast.error("Please enter your full name.");
          setLoading(false);
          return;
        }
        if (!email.trim()) {
          toast.error("Please enter a valid email address.");
          setLoading(false);
          return;
        }
        if (!password || password.length < 8) {
          toast.error("Password must be at least 8 characters.");
          setLoading(false);
          return;
        }

        const registeredUser = await signup({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          org: org.trim() || undefined,
          phone: phone.trim() || undefined,
        });

        toast.success(`Account created successfully! Welcome, ${registeredUser.name}.`);
        onClose();
        if (options.onLoginSuccess) {
          try {
            await options.onLoginSuccess(registeredUser);
          } catch (_e) {}
        }
      } else {
        // Sign in mode
        if (!email.trim() || !password) {
          toast.error("Please enter both email and password.");
          setLoading(false);
          return;
        }

        const loggedInUser = await login({
          email: email.trim(),
          password,
        });

        toast.success(`Signed in as ${loggedInUser.name}!`);
        onClose();
        if (options.onLoginSuccess) {
          try {
            await options.onLoginSuccess(loggedInUser);
          } catch (_e) {}
        }
      }
    } catch (err) {
      toast.error(err.message || "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="FoodBridge Authentication" maxWidth="max-w-md">
      <div className="space-y-4">
        {options.message && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-[var(--radius-md)] flex items-start gap-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{options.message}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[var(--color-bg-subtle)] rounded-[var(--radius-md)] border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setTab("quick")}
            className={`py-1.5 text-xs font-bold font-['Quicksand'] rounded-[var(--radius-sm)] transition-all ${
              tab === "quick"
                ? "bg-[var(--color-bg-surface)] text-[var(--color-leaf-green)] shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
            }`}
          >
            One-Click Profiles
          </button>
          <button
            type="button"
            onClick={() => setTab("account")}
            className={`py-1.5 text-xs font-bold font-['Quicksand'] rounded-[var(--radius-sm)] transition-all ${
              tab === "account"
                ? "bg-[var(--color-bg-surface)] text-[var(--color-leaf-green)] shadow-xs"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-forest-text)]"
            }`}
          >
            {isRegisterMode ? "Register Account" : "Email Sign In"}
          </button>
        </div>

        {tab === "quick" ? (
          <div className="space-y-2.5 pt-1">
            <p className="text-xs text-[var(--color-text-muted)]">
              Choose a pre-configured role to immediately test real donor listings, volunteer pickups, and shelter receipts:
            </p>
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickSelect(acc)}
                disabled={loading}
                className="w-full p-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-subtle)] hover:border-[var(--color-leaf-green)] transition-all text-left flex items-center justify-between group shadow-xs"
              >
                <div>
                  <div className="text-sm font-bold font-['Quicksand'] text-[var(--color-forest-text)] group-hover:text-[var(--color-leaf-green)]">
                    {acc.name}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)]">
                    {acc.org} &bull; <span className="capitalize font-semibold text-[var(--color-leaf-green)]">{acc.role}</span>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-full text-[11px] font-bold bg-[var(--color-leaf-green-alpha)] text-[var(--color-leaf-green)]">
                  Use Role
                </div>
              </button>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            {isRegisterMode && (
              <Input
                label="Full Name"
                placeholder="e.g. Maria Gonzalez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. you@organization.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder={isRegisterMode ? "At least 8 characters" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {isRegisterMode && (
              <>
                <Select
                  label="Community Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="donor">Food Donor (Canteen / Restaurant / Hostel)</option>
                  <option value="volunteer">Volunteer Courier (Pickup &amp; Deliver)</option>
                  <option value="ngo">NGO Shelter Hub (Recipient Kitchen)</option>
                </Select>

                <Input
                  label="Organization / Kitchen Name"
                  placeholder="e.g. Green Valley Dining Hall"
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                />

                <Input
                  label="Phone Number (Optional)"
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            )}

            <Button type="submit" variant="primary" loading={loading} className="w-full mt-2">
              {isRegisterMode ? "Create FoodBridge Account" : "Sign In to FoodBridge"}
            </Button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs font-semibold text-[var(--color-leaf-green)] hover:underline"
              >
                {isRegisterMode
                  ? "Already have an account? Sign in"
                  : "Need a new account? Register here"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
