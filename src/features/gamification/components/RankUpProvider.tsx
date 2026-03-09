import { ReactNode } from "react";
import { useRankUpDetection } from "../hooks/useRankUpDetection";
import { RankUpCelebration } from "./RankUpCelebration";

interface RankUpProviderProps {
  children: ReactNode;
}

export function RankUpProvider({ children }: RankUpProviderProps) {
  const { rankUpTo, dismissRankUp } = useRankUpDetection();

  return (
    <>
      {children}
      {rankUpTo && (
        <RankUpCelebration rank={rankUpTo} onDismiss={dismissRankUp} />
      )}
    </>
  );
}
