import { useEffect } from "react";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { ProfileAvatar, ProfileHero, ProfileInfoForm, ProfileRankRow, ChangePasswordForm, RetakeQuizSection, TribeSection, FavoritesTable, InventoryTable } from "./components";
import { Separator } from "@/components/ui/separator";
import { FeedbackCTA } from "@/components/shared/FeedbackCTA";
import { useIsMobile } from "@/hooks/use-mobile";
import { StreakDisplay } from "@/features/learning/components/gamification/StreakDisplay";
import { DailyGoalRing } from "@/features/learning/components/gamification/DailyGoalRing";
import { useStreak } from "@/hooks/gamification/useStreak";
import { useDailyGoal } from "@/features/learning/hooks/useDailyGoal";

function ProfileContent() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();

  // Always fetch fresh profile data on mount to reflect XP earned elsewhere
  useEffect(() => {
    refreshProfile();
  }, []);
  const isMobile = useIsMobile();

  if (!user || !profile) return null;

  return (
    <PageLayout>
      {/* Mobile hero: cover + circular avatar + name + tribe tagline */}
      {isMobile && <ProfileHero />}

      <Container size="default" className="py-8">
        {/* Desktop: original heading */}
        {!isMobile && <h1 className="text-3xl md:text-4xl mb-8">{t("profile.title")}</h1>}

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Left column — avatar + tribe (desktop only) */}
          {!isMobile && (
            <div className="space-y-6">
              <ProfileAvatar
                avatarUrl={profile.avatar_url}
                displayName={profile.display_name}
                email={user.email}
              />
              <ProfileRankRow />
              <div>
                <h2 className="text-xl md:text-2xl mb-3">{t("profile.tribeHeading")}</h2>
                <TribeSection tribe={profile.coffee_tribe} />
              </div>
            </div>
          )}

          {/* Right column (full width on mobile) */}
          <div className="space-y-8">
            {/* Mobile: show tribe detail card before forms */}
            {isMobile && (
              <>
                <div>
                  <h2 className="text-xl mb-3">{t("profile.tribeHeading")}</h2>
                  <TribeSection tribe={profile.coffee_tribe} />
                </div>
                <Separator />
              </>
            )}

            {/* Desktop: show profile form inline. Mobile: editing handled in ProfileHero */}
            {!isMobile && (
              <>
                <ProfileInfoForm
                  displayName={profile.display_name}
                  city={profile.city ?? null}
                  email={user.email || ""}
                  userId={user.id}
                />
                <Separator />
              </>
            )}

            <ChangePasswordForm />

            <Separator />

            <RetakeQuizSection />
          </div>
        </div>

        <Separator className="my-8" />

        {/* Mobile: Inventory first, then Favorites. Desktop: side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8">
          <div className="order-1 md:order-2">
            <InventoryTable />
          </div>
          <div className="order-2 md:order-1">
            <FavoritesTable />
          </div>
        </div>

        <div className="mt-8 pb-8">
          <FeedbackCTA />
        </div>
      </Container>
    </PageLayout>
  );
}

export function ProfilePage() {
  return (
    <RequireAuth>
      <ProfileContent />
    </RequireAuth>
  );
}
