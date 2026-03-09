import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Zap, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/language";
import { PageLayout } from "@/components/layout";
import { ROUTES } from "@/constants/app";
import { TrackPathView } from "../components/track/TrackPathView";
import { MascotReaction } from "../components/mascot/MascotReaction";
import { useTrackPath } from "../hooks/useTrackPath";
import { Progress } from "@/components/ui/progress";
import duoGoatImg from "@/assets/characters/ilustration_Duo_and_Goat_NoBG_1.png";

export default function TrackPage() {
  const { trackId } = useParams<{ trackId: string }>();
  const { t, language } = useLanguage();
  const { track, sections, progressMap, overallPercent, isLoading } = useTrackPath(trackId ?? "");

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          {t("common.loading")}
        </div>
      </PageLayout>
    );
  }

  const trackName = track ? (language === "es" ? track.nameEs : track.name) : "";
  const hasContent = sections.length > 0;

  // Compute track stats
  let totalLessons = 0;
  let completedLessons = 0;
  let totalMinutes = 0;
  let totalXP = 0;
  for (const section of sections) {
    for (const unit of section.units) {
      totalMinutes += unit.estimatedMinutes;
      for (const lesson of unit.lessons) {
        totalLessons++;
        totalXP += lesson.xpReward;
        if (lesson.status === "completed") completedLessons++;
      }
    }
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Back */}
        <Link
          to={ROUTES.learn}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6 font-inter text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("learn.backToTrack")}
        </Link>

        {/* Track header */}
        {track && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{track.icon}</span>
              <h1 className="font-bangers text-3xl md:text-4xl text-foreground tracking-wide">
                {trackName}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={overallPercent} className="h-3 flex-1" />
              <span className="text-sm font-inter text-muted-foreground font-medium">
                {overallPercent}%
              </span>
            </div>
          </div>
        )}

        {/* 2-column desktop layout */}
        {hasContent ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Track path */}
            <div className="flex-1 min-w-0">
              <TrackPathView
                sections={sections}
                progressMap={progressMap}
                trackId={trackId ?? ""}
              />
            </div>

            {/* Right: Sticky sidebar (desktop only) */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 space-y-6">
                {/* Mascot illustration */}
                <div className="border-2 border-border rounded-xl bg-card p-4 shadow-[4px_4px_0px_0px_hsl(var(--border))] text-center">
                  <img
                    src={duoGoatImg}
                    alt="Caldi & The Goat"
                    className="w-48 h-auto mx-auto mb-2"
                    loading="lazy"
                  />
                  <p className="font-bangers text-lg text-foreground tracking-wide">
                    {language === "es" ? "¡Tú puedes!" : "You got this!"}
                  </p>
                </div>

                {/* Track stats card */}
                <div className="border-2 border-border rounded-xl bg-card p-5 shadow-[4px_4px_0px_0px_hsl(var(--border))] space-y-4">
                  <h3 className="font-bangers text-lg text-foreground tracking-wide">
                    {language === "es" ? "Estadísticas" : "Track Stats"}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-inter font-medium text-foreground">
                          {completedLessons} / {totalLessons}
                        </p>
                        <p className="text-xs font-inter text-muted-foreground">
                          {language === "es" ? "Lecciones" : "Lessons"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-inter font-medium text-foreground">
                          {totalXP} XP
                        </p>
                        <p className="text-xs font-inter text-muted-foreground">
                          {language === "es" ? "XP disponible" : "XP available"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-inter font-medium text-foreground">
                          ~{totalMinutes} min
                        </p>
                        <p className="text-xs font-inter text-muted-foreground">
                          {language === "es" ? "Tiempo total" : "Total time"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="text-center py-12">
            <MascotReaction mascot="caldi" mood="curious" dialogue={t("learn.comingSoonDesc")} />
            <p className="mt-4 font-bangers text-2xl text-foreground">
              {t("learn.comingSoon")}
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
