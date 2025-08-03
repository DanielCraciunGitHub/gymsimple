import { useEffect, useState } from "react";
import { ExerciseDetails } from "@/validations";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AUTO_REST,
  DEFAULT_PREP_TIME,
  DEFAULT_SKIP_LOG,
  getSettings,
  ISettings,
} from "@/config/settings";
import { getItem, StorageKey } from "@/lib/local-storage";
import { usePlayBackground } from "@/hooks/play-background";
import { sortBySelectionOrder } from "@/components/ExerciseInput";
import WorkoutPlayer from "@/components/WorkoutPlayer";
import WorkoutProgress from "@/components/WorkoutProgress";

export default function Play() {
  const [exercises, setExercises] = useState<ExerciseDetails[]>([]);

  const [settings, setSettings] = useState<ISettings>({
    prepTime: DEFAULT_PREP_TIME,
    autoRest: AUTO_REST,
    skipLog: DEFAULT_SKIP_LOG,
  });

  useEffect(() => {
    const loadExercises = async () => {
      const exercises = await getItem<ExerciseDetails[]>(
        StorageKey.EXERCISES
      );
      if (exercises) {
        // Filter and sort selected exercises by selection order
        const selectedExercises = sortBySelectionOrder(
          exercises.filter((e) => e.selected)
        );
        setExercises(selectedExercises);
      }
    };
    const loadSettings = async () => {
      const settings = await getSettings();
      if (settings) {
        setSettings(settings);
      }
    };

    loadExercises();
    loadSettings();
  }, []);

  const backgroundColor = usePlayBackground();

  return (
    <SafeAreaView className={`flex-1 ${backgroundColor}`}>
      {exercises.length > 0 && (
        <WorkoutProgress
          totalExercises={exercises.length}
          exerciseNames={exercises.map((exercise) => exercise.name)}
        />
      )}
      <WorkoutPlayer
        exercises={exercises}
        settings={settings}
        backgroundColor={backgroundColor}
      />
    </SafeAreaView>
  );
}
