import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { useLanguage } from "@/contexts/language";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Save, Lock } from "lucide-react";

const editProfileSchema = z
  .object({
    display_name: z.string().trim().min(1, "Name is required").max(50),
    city: z.string().trim().max(100).optional().or(z.literal("")),
    newPassword: z
      .string()
      .max(72)
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (d) => {
      if (d.newPassword && d.newPassword.length > 0) {
        return d.newPassword.length >= 8;
      }
      return true;
    },
    { message: "Password must be at least 8 characters", path: ["newPassword"] }
  )
  .refine(
    (d) => {
      if (d.newPassword && d.newPassword.length > 0) {
        return d.newPassword === d.confirmPassword;
      }
      return true;
    },
    { message: "Passwords don't match", path: ["confirmPassword"] }
  );

type EditProfileFormData = z.infer<typeof editProfileSchema>;

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDialog({ open, onOpenChange }: EditProfileDialogProps) {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLanguage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      display_name: profile?.display_name || "",
      city: profile?.city || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Sync form when dialog opens
  useEffect(() => {
    if (open && profile) {
      reset({
        display_name: profile.display_name || "",
        city: profile.city || "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [open, profile, reset]);

  const onSubmit = async (data: EditProfileFormData) => {
    if (!user) return;

    // Update profile fields
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        display_name: data.display_name,
        city: data.city || null,
      })
      .eq("id", user.id);

    if (profileError) {
      toast.error(t("profile.failedSave"));
      return;
    }

    // Update password if provided
    if (data.newPassword && data.newPassword.length > 0) {
      const { error: pwError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (pwError) {
        toast.error(pwError.message || t("profile.passwordFailed"));
        return;
      }
    }

    await refreshProfile();
    toast.success(t("profile.profileSaved"));
    onOpenChange(false);
  };

  if (!user || !profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("profile.editProfile") ?? "Edit Profile"}</DialogTitle>
          <DialogDescription>
            {t("profile.editProfileDesc") ?? "Update your profile information."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Display Name */}
          <div>
            <Label htmlFor="edit-display-name">{t("profile.displayName")}</Label>
            <Input id="edit-display-name" {...register("display_name")} />
            {errors.display_name && (
              <p className="text-destructive text-xs mt-1">{errors.display_name.message}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <Label htmlFor="edit-email">{t("profile.emailLabel")}</Label>
            <Input id="edit-email" value={user.email || ""} disabled className="opacity-60" />
            <p className="text-muted-foreground text-xs mt-1">{t("profile.emailNoChange")}</p>
          </div>

          {/* City */}
          <div>
            <Label htmlFor="edit-city">{t("profile.cityLabel")}</Label>
            <Input
              id="edit-city"
              placeholder={t("profile.cityPlaceholder")}
              {...register("city")}
            />
          </div>

          <Separator />

          {/* Password Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{t("profile.changePassword")}</span>
            </div>

            <div>
              <Label htmlFor="edit-new-password">{t("profile.newPassword")}</Label>
              <Input
                id="edit-new-password"
                type="password"
                placeholder="••••••••"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-destructive text-xs mt-1">{errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-confirm-password">{t("profile.confirmPassword")}</Label>
              <Input
                id="edit-confirm-password"
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <p className="text-muted-foreground text-xs">
              {t("profile.passwordOptionalHint") ?? "Leave blank to keep your current password."}
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? t("profile.savingProfile") : t("profile.saveProfile")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
