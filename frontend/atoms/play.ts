import { WorkoutSession } from "@/validations";
import { atom } from "jotai";

export const prepPhaseAtom = atom(true);
export const performSetPhaseAtom = atom(false);
export const restPhaseAtom = atom(false);
export const isPausedAtom = atom(false);
export const currentExerciseIndexAtom = atom(0);
export const currentSetIndexAtom = atom(0);
export const quickLogAtom = atom(false);
export const exercisesDataAtom = atom<WorkoutSession>();
