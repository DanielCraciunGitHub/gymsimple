import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const exportWorkoutSessions = async (workoutSessions: any) => {
  const json = JSON.stringify(workoutSessions, null, 2);
  const filePath = FileSystem.cacheDirectory + "workout-sessions.json";
  await FileSystem.writeAsStringAsync(filePath, json);

  if (!(await Sharing.isAvailableAsync())) {
    alert("Sharing is not available on this device");
    return;
  }

  await Sharing.shareAsync(filePath);
};
