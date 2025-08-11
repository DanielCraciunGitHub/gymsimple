import { useMemo } from "react";
import {
  davidGogginsModeAtom,
  isPausedAtom,
  quickLogAtom,
  workoutPhaseAtom,
} from "@/atoms/play";
import { useAtomValue } from "jotai";

export const usePlayBackground = () => {
  const workoutPhase = useAtomValue(workoutPhaseAtom);
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

    if (workoutPhase === "prep") {
      return "bg-yellow-500";
    }

    if (workoutPhase === "perform") {
      return "bg-orange-500";
    }

    if (workoutPhase === "rest") {
      return "bg-green-500";
    }

    if (quickLog) {
      return "bg-purple-500";
    }

    return "bg-orange-500";
  }, [isPaused, workoutPhase, quickLog, davidGogginsMode]);
};
