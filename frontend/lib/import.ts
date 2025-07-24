import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { z } from "zod";

import { WorkoutSession } from "@/types/play";

const workoutSessionSchema = z.array(z.custom<WorkoutSession>());

export const importWorkoutSessions = async () => {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (res.canceled) {
      return null;
    }

    const fileUri = res.assets[0].uri;
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const workoutSessions = JSON.parse(fileContent);
    const parsedWorkoutSessions =
      workoutSessionSchema.parse(workoutSessions);
    return parsedWorkoutSessions;
  } catch (error) {
    console.error("Error importing workout sessions:", error);
    Alert.alert("Error", "Failed to import workout sessions");
  }
};
