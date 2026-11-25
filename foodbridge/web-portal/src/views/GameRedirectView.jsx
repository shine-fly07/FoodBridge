import React, { useEffect } from "react";
import { Gamepad2, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/Button";

export function GameRedirectView() {
  const gameUrl = import.meta.env.VITE_GAME_URL || "http://localhost:5173";

  useEffect(() => {
    // Attempt automatic redirect
    window.location.href = gameUrl;
  }, [gameUrl]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-5">
      <div className="w-16 h-16 rounded-full bg-[var(--color-tomato-alpha)] text-[var(--color-tomato-orange)] flex items-center justify-center mx-auto shadow-[var(--shadow-warm-sm)]">
        <Gamepad2 className="w-8 h-8" />
      </div>
      <h1 className="font-['Fraunces'] text-2xl font-bold text-[var(--color-forest-text)]">
        Launching 2D Food Rescue Runner...
      </h1>
      <p className="text-xs text-[var(--color-text-muted)] font-['Inter']">
        Redirecting to the game client at <code className="font-mono bg-[var(--color-bg-subtle)] px-1.5 py-0.5 rounded">{gameUrl}</code>. If your browser does not redirect automatically, click below:
      </p>
      <a href={gameUrl} target="_blank" rel="noopener noreferrer" className="inline-block pt-2">
        <Button variant="mango">
          <span>Launch Game Manually</span>
          <ExternalLink className="w-4 h-4 ml-1.5" />
        </Button>
      </a>
    </div>
  );
}
