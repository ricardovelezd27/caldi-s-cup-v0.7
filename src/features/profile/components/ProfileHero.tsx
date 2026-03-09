import { useRef, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { ProfileAvatar } from "./ProfileAvatar";
import { EditProfileDialog } from "./EditProfileDialog";
import { getTribeCoverStyle } from "../utils/tribeCoverStyles";
import type { CoffeeTribe } from "@/features/quiz";
import { Button } from "@/components/ui/button";
import { Pencil, Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language";
import { ProfileRankRow } from "./ProfileRankRow";
import { StreakDisplay } from "@/features/learning/components/gamification/StreakDisplay";
import { DailyGoalRing } from "@/features/learning/components/gamification/DailyGoalRing";
import { useStreak } from "@/hooks/gamification/useStreak";
import { useDailyGoal } from "@/features/learning/hooks/useDailyGoal";
import { useFavorites } from "@/features/coffee/hooks/useFavorites";
import { useInventory } from "@/features/coffee/hooks/useInventory";
import { Heart, Package } from "lucide-react";
import caldiLogo from "/lovable-uploads/8e78a6bd-5f00-45be-b082-c35b57fa9a7c.png";

export function ProfileHero() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const [editOpen, setEditOpen] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { streak } = useStreak();
  const { goal } = useDailyGoal();
  const { favoriteIds } = useFavorites();
  const { inventoryItems } = useInventory();

  if (!user || !profile) return null;

  const tribe = profile.coffee_tribe as CoffeeTribe | null;
  const coverStyle = getTribeCoverStyle(tribe);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const filePath = `${user.id}/cover.${ext}`;

    setUploadingCover(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ cover_url: publicUrl })
        .eq("id", user.id);
      if (updateError) throw updateError;

      await refreshProfile();
      toast.success(t("profile.coverUpdated"));
    } catch (err: any) {
      toast.error(err.message || t("profile.failedSave"));
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = "";
    }
  };

  const hasCoverImage = !!profile.cover_url;

  return (
    <div className="w-full">
      {/* Cover */}
      <div
        className="relative w-full h-[200px] md:h-[250px] flex items-center justify-center overflow-hidden"
        style={{ background: hasCoverImage ? undefined : coverStyle.gradient }}
      >
        {hasCoverImage && (
          <img
            src={profile.cover_url!}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {!hasCoverImage && coverStyle.patternSvg && (
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: coverStyle.patternSvg, backgroundRepeat: "repeat" }}
          />
        )}

        {!hasCoverImage && (
          <img
            src={caldiLogo}
            alt=""
            aria-hidden
            className="h-20 object-contain opacity-30 select-none pointer-events-none"
          />
        )}

        <button
          onClick={() => !uploadingCover && coverInputRef.current?.click()}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-foreground/60 backdrop-blur-sm text-background px-3 py-2 text-xs font-medium transition-colors active:bg-foreground/80 hover:bg-foreground/80"
          aria-label={t("profile.editCover")}
        >
          {uploadingCover ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          <span>{t("profile.editCover")}</span>
        </button>

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverUpload}
        />
      </div>

      {/* Content card overlapping cover */}
      <div className="bg-background rounded-t-3xl md:rounded-none -mt-10 md:-mt-0 relative z-10">
        <div className="max-w-5xl mx-auto px-5 md:px-4">
          {/* Avatar + info row */}
          <div className="flex flex-col md:flex-row md:items-end gap-0 md:gap-6">
            {/* Avatar overlapping cover */}
            <div className="-mt-16 md:-mt-16 shrink-0">
              <ProfileAvatar
                avatarUrl={profile.avatar_url}
                displayName={profile.display_name}
                email={user.email}
                variant="circle"
                className="w-28 h-28 md:w-32 md:h-32 border-4 border-background"
              />
            </div>

            {/* Info block */}
            <div className="flex items-start justify-between flex-1 min-w-0 pt-3 md:pt-0 md:pb-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl truncate">
                  {profile.display_name || t("profile.coffeeLover")}
                </h1>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2">
                  <ProfileRankRow />
                  <div className="flex items-center gap-3 flex-wrap">
                    <StreakDisplay currentStreak={streak?.currentStreak ?? profile.current_streak ?? 0} size="sm" />
                    {goal && <DailyGoalRing earnedXp={goal.earnedXp} goalXp={goal.goalXp} size="sm" />}
                    <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                      <Heart className="h-3.5 w-3.5" />
                      {favoriteIds.length}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                      <Package className="h-3.5 w-3.5" />
                      {inventoryItems.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit button → opens dialog */}
              <div className="ml-2 pt-1">
                <Button size="icon" variant="ghost" onClick={() => setEditOpen(true)} className="h-9 w-9">
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileDialog open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}
