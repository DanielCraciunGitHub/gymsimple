import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AUTO_REST,
  DEFAULT_PREP_TIME,
  DEFAULT_SKIP_LOG,
  DEFAULT_WORKOUT_REMINDER_TIME,
  getSettings,
  ISettings,
} from "@/config/settings";
import { setItem, StorageKey } from "@/lib/local-storage";

export default function Settings() {
  const [settings, setSettings] = useState<ISettings>({
    workoutReminderTime: DEFAULT_WORKOUT_REMINDER_TIME,
    prepTime: DEFAULT_PREP_TIME,
    autoRest: AUTO_REST,
    skipLog: DEFAULT_SKIP_LOG,
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

  const updateAutoRest = async (autoRest: boolean) => {
    const newSettings = {
      ...settings,
      autoRest,
    };
    console.log("newSettings", newSettings);
    await setItem(StorageKey.SETTINGS, newSettings);
    setSettings(newSettings);
  };

  const updateSkipLog = async (skipLog: boolean) => {
    const newSettings = {
      ...settings,
      skipLog,
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
          How many seconds should we wait before starting the next
          exercise?
        </Text>

        <View className="flex-row items-center justify-between gap-2">
          {[20, 30, 60, 80, 100].map((seconds) => (
            <TouchableOpacity
              key={seconds}
              onPress={() => updatePrepTime(seconds)}
              className={`flex-1 items-center rounded-md p-3 ${
                settings.prepTime === seconds
                  ? "bg-blue-500"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            >
              <View className="flex-row items-center gap-1">
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={
                    settings.prepTime === seconds ? "#FFFFFF" : "#6B7280"
                  }
                />
                <Text
                  className={`text-sm font-medium ${
                    settings.prepTime === seconds
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {seconds}s
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
        <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Auto Rest
        </Text>
        <Text className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          Should we automatically start the rest timer for your next set?
          We&apos;ll count down 3 seconds per rep before the rest period.
        </Text>

        <View className="flex-row items-center justify-between gap-2">
          {[true, false].map((autoRest) => (
            <TouchableOpacity
              key={autoRest.toString()}
              onPress={() => updateAutoRest(autoRest)}
              className={`flex-1 items-center rounded-md p-3 ${
                settings.autoRest === autoRest
                  ? "bg-blue-500"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            >
              <View className="flex-row items-center gap-1">
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={
                    settings.autoRest === autoRest ? "#FFFFFF" : "#6B7280"
                  }
                />
                <Text
                  className={`text-sm font-medium ${
                    settings.autoRest === autoRest
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {autoRest ? "Yes" : "No"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View className="rounded-lg bg-gray-100 p-4 dark:bg-gray-900">
        <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Skip Log
        </Text>
        <Text className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          Should we skip the log screen when you complete an exercise?
        </Text>

        <View className="flex-row items-center justify-between gap-2">
          {[true, false].map((skipLog) => (
            <TouchableOpacity
              key={skipLog.toString()}
              onPress={() => updateSkipLog(skipLog)}
              className={`flex-1 items-center rounded-md p-3 ${
                settings.skipLog === skipLog
                  ? "bg-blue-500"
                  : "bg-gray-200 dark:bg-gray-800"
              }`}
            >
              <View className="flex-row items-center gap-1">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={
                    settings.skipLog === skipLog ? "#FFFFFF" : "#6B7280"
                  }
                />
                <Text
                  className={`text-sm font-medium ${
                    settings.skipLog === skipLog
                      ? "text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {skipLog ? "Yes" : "No"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
