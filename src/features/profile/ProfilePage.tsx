import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout";
import { Container } from "@/components/shared/Container";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import {
  ProfileHero,
  TribeSection,
  FavoritesTable,
  InventoryTable,
  EditProfileDialog,
  ProfileStreakCard,
  ProfileDailyGoalCard,
  ProfileXPCard,
  ProfileFavoritesCard,
  ProfileInventoryCard,
} from "./components";
import { Separator } from "@/components/ui/separator";
import { FeedbackCTA } from "@/components/shared/FeedbackCTA";
import { Button } from "@/components/ui/button";
import { Pencil, RefreshCw } from "lucide-react";

function ProfileContent() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    refreshProfile();
  }, []);

  if (!user || !profile) return null;

  const handleRetakeQuiz = () => {
    try {
      localStorage.removeItem("caldi_quiz_result");
      localStorage.removeItem("caldi_quiz_state");
    } catch {
      // Ignore
    }
    navigate("/quiz");
  };

  return (
    <PageLayout>
      <ProfileHero />

      <Container size="default" className="py-8">
        {/* 12-column grid: Learning Journey + Coffee Hub */}
        <div className="grid grid-cols-12 gap-8">
          {/* 🎓 Learning Journey */}
          <section className="col-span-12 md:col-span-7">
            <h2 className="text-xl md:text-2xl mb-4">🎓 Learning Hub</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ProfileStreakCard />
              <ProfileDailyGoalCard />
              <div className="col-span-2 md:col-span-1">
                <ProfileXPCard />
              </div>
            </div>
          </section>

          {/* ☕ My Coffee Hub */}
          <section className="col-span-12 md:col-span-5">
            <h2 className="text-xl md:text-2xl mb-4">☕ My Coffee Hub</h2>
            <div className="grid grid-cols-2 gap-4">
              <ProfileFavoritesCard />
              <ProfileInventoryCard />
            </div>
            <div className="mt-4">
              <TribeSection tribe={profile.coffee_tribe} />
            </div>
          </section>
        </div>

        <Separator className="my-8" />

        {/* Collections detail tables */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FavoritesTable />
          <InventoryTable />
        </div>

        <Separator className="my-8" />

        {/* ⚙️ Account & Settings */}
        <section className="w-full">
          <h2 className="text-xl md:text-2xl mb-4">⚙️ Account & Settings</h2>
          <div className="flex flex-col gap-3 max-w-md">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              {t("profile.editProfile") || "Edit Profile"}
            </Button>
            <Button variant="outline" onClick={handleRetakeQuiz}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("profile.retakeQuiz") || "Retake Coffee Quiz"}
            </Button>
          </div>
        </section>

        <div className="mt-12">
          <FeedbackCTA />
        </div>
      </Container>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
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
