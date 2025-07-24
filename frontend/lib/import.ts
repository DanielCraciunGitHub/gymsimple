import {
  exerciseDetailsArraySchema,
  workoutSessionArraySchema,
} from "@/validations";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

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
      workoutSessionArraySchema.parse(workoutSessions);
    return parsedWorkoutSessions;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error importing workout sessions:", error.message);
      Alert.alert(
        "Error",
        "Failed to import workout sessions: Invalid format"
      );
    } else {
      console.error("Error importing workout sessions:", error);
      Alert.alert("Error", "Failed to import workout sessions");
    }
    return null;
  }
};

export const importExercises = async () => {
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
    const exercises = JSON.parse(fileContent);
    const parsedExercises = exerciseDetailsArraySchema.parse(exercises);
    return parsedExercises;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error importing exercises:", error.message);
      Alert.alert("Error", "Failed to import exercises: Invalid format");
    } else {
      console.error("Error importing exercises:", error);
      Alert.alert("Error", "Failed to import exercises");
    }
    return null;
  }
};
