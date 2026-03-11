import { Heart } from "lucide-react";
import { useFavorites } from "@/features/coffee/hooks/useFavorites";
import { ProfileStatCard } from "./ProfileStatCard";

export function ProfileFavoritesCard() {
  const { favoriteIds } = useFavorites();

  return (
    <ProfileStatCard
      icon={<Heart className="h-5 w-5" />}
      iconClassName="bg-rose-100 text-rose-600"
      metric={favoriteIds.length}
      label="Favorite coffees"
    />
  );
}
