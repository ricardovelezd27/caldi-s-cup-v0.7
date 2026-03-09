import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import caldiCelebrating from "@/assets/characters/caldi-celebrating.png";
import type { BaristaRank } from "../config/ranks";

interface RankUpCelebrationProps {
  rank: BaristaRank;
  onDismiss: () => void;
}

const CONFETTI_ITEMS = ["☕", "⭐", "🎉", "✨", "🏆"];

export function RankUpCelebration({ rank, onDismiss }: RankUpCelebrationProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/90 animate-fade-in">
      {/* Animated glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(var(--primary)/0.3)_0%,_transparent_70%)] animate-pulse" />
      
      {/* Floating confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {CONFETTI_ITEMS.map((emoji, i) => (
          <span
            key={i}
            className="absolute text-4xl animate-bounce"
            style={{
              left: `${10 + i * 20}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.15}s`,
              animationDuration: `${1.5 + i * 0.2}s`,
            }}
          >
            {emoji}
          </span>
        ))}
        {CONFETTI_ITEMS.map((emoji, i) => (
          <span
            key={`b-${i}`}
            className="absolute text-3xl animate-bounce"
            style={{
              right: `${5 + i * 18}%`,
              bottom: `${20 + (i % 2) * 30}%`,
              animationDelay: `${0.3 + i * 0.1}s`,
              animationDuration: `${1.8 + i * 0.15}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md animate-scale-in">
        {/* Mascot */}
        <img
          src={caldiCelebrating}
          alt="Caldi celebrating"
          className="w-40 h-40 object-contain mb-4 drop-shadow-2xl animate-bounce"
          style={{ animationDuration: "2s" }}
        />

        {/* Rank Icon - large and styled */}
        <div
          className={cn(
            "text-8xl mb-4 drop-shadow-lg animate-pulse",
            rank.colorClass
          )}
          style={{ animationDuration: "1.5s" }}
        >
          {rank.icon}
        </div>

        {/* Heading */}
        <h1 className="font-bangers text-5xl text-primary-foreground mb-2 tracking-wide drop-shadow-md">
          RANK UP!
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-primary-foreground/90 mb-8 font-medium">
          You are now a{" "}
          <span className={cn("font-bold", rank.colorClass)}>{rank.name}</span>!
        </p>

        {/* Continue button */}
        <Button
          onClick={onDismiss}
          size="lg"
          className="px-10 text-lg font-bold shadow-lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
