import React from "react";
import { Loader2 } from "lucide-react";

export function Loader({ text = "Loading FoodBridge data...", size = "md", className = "" }) {
  const sizeMap = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`flex flex-col items-center justify-center py-12 gap-3 text-center ${className}`}>
      <div className="relative">
        <Loader2 className={`${sizeMap[size] || sizeMap.md} animate-spin text-[var(--color-leaf-green)]`} />
      </div>
      {text && <p className="text-sm font-semibold font-['Quicksand'] text-[var(--color-text-muted)]">{text}</p>}
    </div>
  );
}
