import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Package, ScanLine, Share2, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth";
import { useFavorites } from "../hooks/useFavorites";
import { useInventory } from "../hooks/useInventory";
import { ReportScanErrorDialog } from "./ReportScanErrorDialog";
import { useLanguage } from "@/contexts/language";
import type { Coffee, CoffeeScanMeta } from "../types";

interface CoffeeActionsProps { coffee: Coffee; scanMeta?: CoffeeScanMeta; onScanAgain?: () => void; }

export function CoffeeActions({ coffee, scanMeta, onScanAgain }: CoffeeActionsProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isFavorite, addToFavorites, removeFromFavorites, isAddingFavorite, isRemovingFavorite } = useFavorites();
  const { isInInventory, addToInventory, isAddingInventory } = useInventory();
  const coffeeIsFavorite = isFavorite(coffee.id);
  const coffeeInInventory = isInInventory(coffee.id);

  const handleToggleFavorite = async () => {
    if (!user) { navigate("/auth", { state: { from: "/scanner" } }); toast({ title: t('coffee.signUpSave'), description: t('coffee.signUpFavDesc') }); return; }
    try {
      if (coffeeIsFavorite) { await removeFromFavorites(coffee.id); toast({ title: t('coffee.removedFavorites') }); }
      else { await addToFavorites(coffee.id); toast({ title: t('coffee.addedFavorites') }); }
    } catch { toast({ title: t('common.error'), description: t('coffee.errorFavorites'), variant: "destructive" }); }
  };

  const handleAddToInventory = async () => {
    if (!user) { navigate("/auth", { state: { from: "/scanner" } }); toast({ title: t('coffee.signUpSave'), description: t('coffee.signUpInvDesc') }); return; }
    if (coffeeInInventory) { toast({ title: t('coffee.alreadyInventory') }); return; }
    try { await addToInventory(coffee.id); toast({ title: t('coffee.addedInventory') }); }
    catch { toast({ title: t('common.error'), description: t('coffee.errorInventory'), variant: "destructive" }); }
  };

  const handleShare = async () => {
    try { await navigator.share({ title: coffee.name, text: `Check out ${coffee.name}${coffee.brand ? ` by ${coffee.brand}` : ""}`, url: window.location.href }); }
    catch { await navigator.clipboard.writeText(window.location.href); toast({ title: t('coffee.linkCopied') }); }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Button variant={coffeeIsFavorite ? "secondary" : "outline"} onClick={handleToggleFavorite} disabled={isAddingFavorite || isRemovingFavorite}>
          {(isAddingFavorite || isRemovingFavorite) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : coffeeIsFavorite ? <Heart className="h-4 w-4 mr-2 fill-current" /> : <Heart className="h-4 w-4 mr-2" />}
          {coffeeIsFavorite ? t('coffee.favorited') : t('coffee.addToFavorites')}
        </Button>
        <Button variant={coffeeInInventory ? "secondary" : "outline"} onClick={handleAddToInventory} disabled={isAddingInventory || coffeeInInventory}>
          {isAddingInventory ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : coffeeInInventory ? <Check className="h-4 w-4 mr-2" /> : <Package className="h-4 w-4 mr-2" />}
          {coffeeInInventory ? t('coffee.inInventory') : t('coffee.addToInventory')}
        </Button>
        {onScanAgain && (<Button variant="outline" onClick={onScanAgain}><ScanLine className="h-4 w-4 mr-2" />{t('coffee.scanAnother')}</Button>)}
        <ReportScanErrorDialog coffee={coffee} scanMeta={scanMeta} />
      </div>
      <div className="flex justify-center">
        <Button variant="ghost" onClick={handleShare} size="icon"><Share2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
