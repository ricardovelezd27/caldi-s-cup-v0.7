import { useLanguage } from "@/contexts/language";
import { Lock, Check, Circle, Coffee } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { TrackPathSection, TrackPathLesson } from "../../hooks/useTrackPath";
import type { LearningUserProgress } from "../../types";

const DECAY_JOKES_EN = [
  "Brrr... your coffee is getting cold! 🥶",
  "These beans are going stale. Time to review! 🫘",
  "Your crema is fading! Reheat your skills. ☕",
  "Extraction dropping... pull this shot again! 📉",
];

const DECAY_JOKES_ES = [
  "Brrr... ¡tu café se está enfriando! 🥶",
  "Estos granos se están poniendo rancios. ¡Hora de repasar! 🫘",
  "¡Tu crema se desvanece! Recalienta tus habilidades. ☕",
  "Extracción bajando... ¡tira este shot de nuevo! 📉",
];

interface TrackPathViewProps {
  sections: TrackPathSection[];
  progressMap: Map<string, LearningUserProgress>;
  trackId: string;
}

function LessonNode({ lesson, trackId, language }: { lesson: TrackPathLesson; trackId: string; language: string }) {
  const name = language === "es" ? lesson.nameEs : lesson.name;
  const minutes = lesson.estimatedMinutes;
  const isDecayed = lesson.status === "decayed";

  const jokes = language === "es" ? DECAY_JOKES_ES : DECAY_JOKES_EN;
  const joke = jokes[lesson.id.charCodeAt(0) % jokes.length];

  const nodeContent = (
    <div className={cn(
      "flex items-center gap-3 py-2 group",
      lesson.status === "locked" && "opacity-50",
      (lesson.status === "available" || isDecayed) && "cursor-pointer",
    )}>
      {/* Status circle */}
      <div className={cn(
        "w-10 h-10 rounded-full border-4 flex items-center justify-center shrink-0 transition-all",
        lesson.status === "completed" && "bg-secondary border-secondary text-secondary-foreground",
        lesson.status === "available" && "border-primary bg-primary/10 animate-pulse",
        lesson.status === "locked" && "border-border bg-muted",
        isDecayed && "bg-amber-100 border-amber-500 text-amber-600",
      )}
        style={{ boxShadow: (lesson.status === "available" || isDecayed) ? "2px 2px 0px 0px hsl(var(--border))" : undefined }}
      >
        {lesson.status === "completed" && <Check className="w-5 h-5" />}
        {lesson.status === "available" && <Circle className="w-4 h-4 fill-primary text-primary" />}
        {lesson.status === "locked" && <Lock className="w-4 h-4 text-muted-foreground" />}
        {isDecayed && <Coffee className="w-5 h-5" />}
      </div>

      {/* Lesson info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-inter text-sm font-medium truncate",
          lesson.status === "completed" && "text-secondary",
          lesson.status === "available" && "text-foreground",
          lesson.status === "locked" && "text-muted-foreground",
          isDecayed && "text-amber-600",
        )}>
          {name}
        </p>
        {isDecayed ? (
          <p className="text-xs text-amber-500 font-inter italic">
            {joke}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground font-inter">
            {minutes} min · {lesson.xpReward} XP
          </p>
        )}
      </div>
    </div>
  );

  if (lesson.status === "available" || isDecayed) {
    return (
      <Link to={`/learn/${trackId}/${lesson.id}`} className="block hover:bg-accent/10 rounded-lg px-2 -mx-2 transition-colors">
        {nodeContent}
      </Link>
    );
  }

  return <div className="px-2 -mx-2">{nodeContent}</div>;
}

export function TrackPathView({ sections, progressMap, trackId }: TrackPathViewProps) {
  const { language, t } = useLanguage();

  if (sections.length === 0) {
    return (
      <p className="text-center text-muted-foreground font-inter py-8">
        {t("learn.comingSoonDesc")}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {sections.map((section, sIdx) => {
        const sectionName = language === "es" ? section.nameEs : section.name;
        const goal = language === "es" ? section.learningGoalEs : section.learningGoal;
        const isLocked = section.requiresSectionId != null;

        return (
          <div key={section.id} className={cn(isLocked && "opacity-50")}>
            {/* Section header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full border-2 border-border bg-card text-xs font-inter font-bold uppercase tracking-wider text-foreground shadow-[2px_2px_0px_0px_hsl(var(--border))]">
                {section.level}
              </span>
              <h3 className="font-bangers text-xl text-foreground tracking-wide">
                {sectionName}
              </h3>
              {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
            </div>

            {goal && (
              <p className="text-sm text-muted-foreground font-inter mb-4 ml-1">
                🎯 {goal}
              </p>
            )}

            {/* Units */}
            {section.units.length === 0 ? (
              <div className="ml-6 border-l-4 border-dashed border-border pl-6 py-4">
                <p className="text-sm text-muted-foreground font-inter italic">
                  {t("learn.comingSoon")}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {section.units.map((unit) => {
                  const unitName = language === "es" ? unit.nameEs : unit.name;
                  return (
                    <div key={unit.id} className="ml-2">
                      {/* Unit header */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">{unit.icon}</span>
                        <h4 className="font-bangers text-lg text-foreground tracking-wide">
                          {unitName}
                        </h4>
                        <span className="text-xs text-muted-foreground font-inter">
                          · {unit.estimatedMinutes} min
                        </span>
                      </div>

                      {/* Lesson path */}
                      <div className="ml-5 border-l-2 border-border pl-4 space-y-1">
                        {unit.lessons.map((lesson) => (
                          <LessonNode
                            key={lesson.id}
                            lesson={lesson}
                            trackId={trackId}
                            language={language}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Connecting line between sections */}
            {sIdx < sections.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-0.5 h-8 bg-border" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
