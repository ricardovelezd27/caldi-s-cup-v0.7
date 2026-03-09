import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageLayout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/app";
import { RecipeForm } from "./components";
import { useCreateRecipe } from "./services";
import { useAwardXP } from "@/hooks/gamification";
import type { RecipeFormData } from "./types/recipe";

export function CreateRecipePage() {
  const navigate = useNavigate();
  const createMutation = useCreateRecipe();
  const { rewardAction } = useAwardXP();

  const handleSubmit = async (data: RecipeFormData) => {
    try {
      await createMutation.mutateAsync(data);
      rewardAction("log_brew_recipe", 20, "Recipe Created"); // fire-and-forget
      toast.success("Recipe created successfully!");
      navigate(ROUTES.recipes);
    } catch (error) {
      console.error("Failed to create recipe:", error);
      toast.error("Failed to create recipe. Please try again.");
    }
  };

  return (
    <PageLayout>
      <div className="container max-w-2xl py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bangers text-3xl text-foreground">Create Recipe</h1>
        </div>

        {/* Form */}
        <div className="border-4 border-border rounded-lg p-6 shadow-[4px_4px_0px_0px_hsl(var(--border))] bg-card">
          <RecipeForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            isSubmitting={createMutation.isPending}
            submitLabel="Create Recipe"
          />
        </div>
      </div>
    </PageLayout>
  );
}
