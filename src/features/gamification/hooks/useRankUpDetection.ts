import { useEffect, useState, useCallback } from "react";
import { useUserRank } from "./useUserRank";
import { getStorage, safeJsonParse, safeJsonStringify } from "@/utils/storage/storageFactory";
import type { BaristaRank } from "../config/ranks";

const STORAGE_KEY = "caldi_last_rank_id";

interface UseRankUpDetectionResult {
  rankUpTo: BaristaRank | null;
  dismissRankUp: () => void;
}

export function useRankUpDetection(): UseRankUpDetectionResult {
  const { currentRank, totalXP } = useUserRank();
  const [rankUpTo, setRankUpTo] = useState<BaristaRank | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    // Skip if no XP yet (user not loaded or new user with 0 XP)
    if (totalXP === 0) return;

    const storage = getStorage();
    const storedRankId = safeJsonParse<string | null>(
      storage.getItem(STORAGE_KEY),
      null
    );

    if (!hasInitialized) {
      // First load: if no stored rank, save current and don't celebrate
      if (!storedRankId) {
        const serialized = safeJsonStringify(currentRank.id);
        if (serialized) {
          storage.setItem(STORAGE_KEY, serialized);
        }
      }
      setHasInitialized(true);
      return;
    }

    // Check for rank up: stored rank exists and differs from current
    if (storedRankId && storedRankId !== currentRank.id) {
      // Verify it's actually an upgrade (not a downgrade scenario)
      // By comparing the rank IDs, we assume progression is forward
      setRankUpTo(currentRank);
    }
  }, [currentRank, totalXP, hasInitialized]);

  const dismissRankUp = useCallback(() => {
    const storage = getStorage();
    const serialized = safeJsonStringify(currentRank.id);
    if (serialized) {
      storage.setItem(STORAGE_KEY, serialized);
    }
    setRankUpTo(null);
  }, [currentRank.id]);

  return { rankUpTo, dismissRankUp };
}
