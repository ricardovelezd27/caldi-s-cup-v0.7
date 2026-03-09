import { useRef, useState } from "react";
import { useAuth } from "@/contexts/auth";
import { ProfileAvatar } from "./ProfileAvatar";
import { getTribeDefinition, type CoffeeTribe } from "@/features/quiz";
import { getTribeCoverStyle } from "../utils/tribeCoverStyles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X, Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/language";
import { ProfileRankRow } from "./ProfileRankRow";
import caldiLogo from "/lovable-uploads/8e78a6bd-5f00-45be-b082-c35b57fa9a7c.png";

export function ProfileHero() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tempCity, setTempCity] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (!user || !profile) return null;

  const tribe = profile.coffee_tribe as CoffeeTribe | null;
  const tribeDef = tribe ? getTribeDefinition(tribe) : null;
  const coverStyle = getTribeCoverStyle(tribe);

  const startEdit = () => {
    setTempName(profile.display_name || "");
    setTempCity(profile.city || "");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveEdit = async () => {
    if (!tempName.trim()) {
      toast.error(t("profile.nameRequired"));
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: tempName.trim(),
        city: tempCity.trim() || null,
      })
      .eq("id", user.id);

    if (error) {
      toast.error(t("profile.failedSave"));
    } else {
      await refreshProfile();
      toast.success(t("profile.profileSaved"));
      setIsEditing(false);
    }
    setSaving(false);
  };

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

  // Get translated tribe name/title
  const tribeName = tribe ? t(`tribes.${tribe}.name`) : null;
  const tribeTitle = tribe ? t(`tribes.${tribe}.title`) : null;

  return (
    <div className="md:hidden w-full">
      {/* Cover gradient with SVG pattern or custom image */}
      <div
        className="relative w-full h-[33vh] flex items-center justify-center overflow-hidden"
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
          className="absolute bottom-14 right-4 flex items-center gap-2 rounded-full bg-foreground/60 backdrop-blur-sm text-background px-3 py-2 text-xs font-medium transition-colors active:bg-foreground/80"
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

      {/* White content card overlapping cover */}
      <div className="bg-background rounded-t-3xl -mt-10 relative z-10 px-5 pt-0 pb-2">
        <div className="-mt-16">
          <ProfileAvatar
            avatarUrl={profile.avatar_url}
            displayName={profile.display_name}
            email={user.email}
            variant="circle"
            className="w-28 h-28"
            showOverlayAlways={isEditing}
          />
        </div>

        <div className="flex items-start justify-between pt-3 pb-4">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder={t("profile.yourName")}
                  className="text-xl font-bold !border-2"
                  style={{ fontFamily: "'Bangers', cursive" }}
                  autoFocus
                />
                <Input
                  value={tempCity}
                  onChange={(e) => setTempCity(e.target.value)}
                  placeholder={t("profile.cityOptional")}
                  className="!border-2"
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl truncate">
                  {profile.display_name || t("profile.coffeeLover")}
                </h1>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              </>
            )}

            {tribeDef && !isEditing && tribeName && tribeTitle && (
              <p className="text-sm text-muted-foreground mt-1">
                <span className="mr-1">{tribeDef.emoji}</span>
                {tribeName} — {tribeTitle}
              </p>
            )}

            {!isEditing && <ProfileRankRow />}
          </div>

          <div className="flex items-center gap-1 ml-2 pt-1">
            {isEditing ? (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="h-9 w-9"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={saveEdit}
                  disabled={saving}
                  className="h-9 w-9"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                size="icon"
                variant="ghost"
                onClick={startEdit}
                className="h-9 w-9"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
