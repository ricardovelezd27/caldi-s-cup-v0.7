import { useEffect } from "react";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import { ProfileHero, RetakeQuizSection, TribeSection, FavoritesTable, InventoryTable } from "./components";
import { Separator } from "@/components/ui/separator";
import { FeedbackCTA } from "@/components/shared/FeedbackCTA";

function ProfileContent() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    refreshProfile();
  }, []);

  if (!user || !profile) return null;

  return (
    <PageLayout>
      <ProfileHero />

      <Container size="default" className="py-8 space-y-8">
        {/* Tribe + Retake Quiz */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl md:text-2xl mb-3">{t("profile.tribeHeading")}</h2>
            <TribeSection tribe={profile.coffee_tribe} />
          </div>
          <RetakeQuizSection />
        </div>

        <Separator />

        {/* Collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FavoritesTable />
          <InventoryTable />
        </div>

        <FeedbackCTA />
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
