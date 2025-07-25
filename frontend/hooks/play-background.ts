import { useMemo } from "react";
import {
  davidGogginsModeAtom,
  isPausedAtom,
  performSetPhaseAtom,
  prepPhaseAtom,
  quickLogAtom,
  restPhaseAtom,
} from "@/atoms/play";
import { useAtomValue } from "jotai";

export const usePlayBackground = () => {
  const prepPhase = useAtomValue(prepPhaseAtom);
  const performSetPhase = useAtomValue(performSetPhaseAtom);
  const restPhase = useAtomValue(restPhaseAtom);
  const isPaused = useAtomValue(isPausedAtom);
  const quickLog = useAtomValue(quickLogAtom);
  const davidGogginsMode = useAtomValue(davidGogginsModeAtom);
  return useMemo(() => {
    if (davidGogginsMode) {
      return "bg-red-500";
    }

    if (isPaused) {
      return "bg-red-500";
    }

    if (prepPhase) {
      return "bg-yellow-500";
    }

    if (performSetPhase) {
      return "bg-orange-500";
    }

    if (restPhase) {
      return "bg-green-500";
    }

    if (quickLog) {
      return "bg-purple-500";
    }

    return "bg-orange-500";
  }, [isPaused, prepPhase, performSetPhase, restPhase, quickLog]);
};
