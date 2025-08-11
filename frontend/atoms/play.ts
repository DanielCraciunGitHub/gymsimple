import { WorkoutSession } from "@/validations";
import { atom } from "jotai";

type WorkoutPhase = "prep" | "perform" | "rest" | "log";
export const workoutPhaseAtom = atom<WorkoutPhase>("prep");

export const isPausedAtom = atom(false);
export const currentExerciseIndexAtom = atom(0);
export const currentSetIndexAtom = atom(0);
export const quickLogAtom = atom(false);
export const exercisesDataAtom = atom<WorkoutSession>();
export const davidGogginsModeAtom = atom(false);
