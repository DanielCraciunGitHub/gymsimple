import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  AUTO_REST,
  DEFAULT_PREP_TIME,
  DEFAULT_SKIP_LOG,
  getSettings,
  ISettings,
} from "@/config/settings";
import { setItem, StorageKey } from "@/lib/local-storage";

export default function Settings() {
  const [settings, setSettings] = useState<ISettings>({
    prepTime: DEFAULT_PREP_TIME,
    autoRest: AUTO_REST,
    skipLog: DEFAULT_SKIP_LOG,
  });

  const [prepTimeInput, setPrepTimeInput] = useState<string>(
    DEFAULT_PREP_TIME.toString()
  );

  const reminderTimeDebounceRef = useRef<number | undefined>(undefined);
  const prepTimeDebounceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    loadSettings();

    // Cleanup function to clear timeouts on unmount
    return () => {
      if (reminderTimeDebounceRef.current) {
        clearTimeout(reminderTimeDebounceRef.current);
      }
      if (prepTimeDebounceRef.current) {
        clearTimeout(prepTimeDebounceRef.current);
      }
    };
  }, []);

  const loadSettings = async () => {
    const storedSettings = await getSettings();
    if (storedSettings) {
      setSettings(storedSettings);
      setPrepTimeInput(storedSettings.prepTime.toString());
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

  const updatePrepTime = async (seconds: number) => {
    const newSettings = {
      ...settings,
      prepTime: seconds,
    };
    await setItem(StorageKey.SETTINGS, newSettings);
    setSettings(newSettings);
  };

  const handlePrepTimeChange = (text: string) => {
    setPrepTimeInput(text);

    // Clear existing timeout
    if (prepTimeDebounceRef.current) {
      clearTimeout(prepTimeDebounceRef.current);
    }

    // Set new timeout for debouncing
    prepTimeDebounceRef.current = setTimeout(() => {
      const seconds = parseInt(text, 10);
      if (!isNaN(seconds) && seconds > 0) {
        console.log("Prep time changed to", seconds);
        updatePrepTime(seconds);
      }
    }, 500) as unknown as number;
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
          Prep Time
        </Text>
        <Text className="mb-4 text-xs text-gray-500 dark:text-gray-400">
          How many seconds should we wait before starting the next
          exercise?
        </Text>

        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <TextInput
              value={prepTimeInput}
              onChangeText={handlePrepTimeChange}
              placeholder={DEFAULT_PREP_TIME.toString()}
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="rounded-md bg-white px-4 py-3 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
            />
          </View>
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
              seconds
            </Text>
          </View>
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
