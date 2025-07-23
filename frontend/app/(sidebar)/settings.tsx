import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  DEFAULT_PREP_TIME,
  DEFAULT_WORKOUT_REMINDER_TIME,
  getSettings,
  ISettings,
} from "@/config/settings";
import { setItem, StorageKey } from "@/lib/local-storage";

export default function Settings() {
  const [settings, setSettings] = useState<ISettings>({
    workoutReminderTime: DEFAULT_WORKOUT_REMINDER_TIME,
    prepTime: DEFAULT_PREP_TIME,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const storedSettings = await getSettings();
    if (storedSettings) {
      setSettings(storedSettings);
    }
  };

  const updateReminderTime = async (minutes: number) => {
    const newSettings = {
      ...settings,
      workoutReminderTime: minutes,
    };
    await setItem(StorageKey.SETTINGS, newSettings);
    setSettings(newSettings);
  };

  const updatePrepTime = async (minutes: number) => {
    const newSettings = {
      ...settings,
      prepTime: minutes,
    };
    await setItem(StorageKey.SETTINGS, newSettings);
    setSettings(newSettings);
  };

  return (
    <SafeAreaView className="flex-1 gap-4 bg-white px-4 pt-4 dark:bg-black">
      <Text className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
        Workout Settings
      </Text>

      <View className="rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
        <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Reminder Time
        </Text>
        <Text className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          How many minutes before your workout should we remind you?
        </Text>

        <View className="flex-row items-center justify-between gap-2">
          {[15, 30, 45, 60].map((minutes) => (
            <TouchableOpacity
              key={minutes}
              onPress={() => updateReminderTime(minutes)}
              className={`flex-1 items-center rounded-md p-3 ${
                settings.workoutReminderTime === minutes
                  ? "bg-blue-500"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            >
              <View className="flex-row items-center gap-1">
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={
                    settings.workoutReminderTime === minutes
                      ? "#FFFFFF"
                      : "#6B7280"
                  }
                />
                <Text
                  className={`text-sm font-medium ${
                    settings.workoutReminderTime === minutes
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {minutes}m
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
        <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Prep Time
        </Text>
        <Text className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          How many minutes should we wait before starting the next
          exercise?
        </Text>

        <View className="flex-row items-center justify-between gap-2">
          {[10, 15, 20, 25, 30].map((minutes) => (
            <TouchableOpacity
              key={minutes}
              onPress={() => updatePrepTime(minutes)}
              className={`flex-1 items-center rounded-md p-3 ${
                settings.prepTime === minutes
                  ? "bg-blue-500"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            >
              <View className="flex-row items-center gap-1">
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={
                    settings.prepTime === minutes ? "#FFFFFF" : "#6B7280"
                  }
                />
                <Text
                  className={`text-sm font-medium ${
                    settings.prepTime === minutes
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {minutes}m
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
