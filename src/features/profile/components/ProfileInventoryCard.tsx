import { Package } from "lucide-react";
import { useInventory } from "@/features/coffee/hooks/useInventory";
import { ProfileStatCard } from "./ProfileStatCard";

export function ProfileInventoryCard() {
  const { inventoryItems } = useInventory();

  return (
    <ProfileStatCard
      icon={<Package className="h-5 w-5" />}
      iconClassName="bg-amber-100 text-amber-700"
      metric={inventoryItems.length}
      label="Coffees in Inventory"
    />
  );
}
