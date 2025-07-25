import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import WeekCalendarItem from "./WeekCalendarItem";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export interface ActiveReminder {
  identifier: string;
  trigger: {
    weekday: number;
    hour: number;
    minute: number;
  };
}
export const WeekCalendar = () => {
  const [activeReminders, setActiveReminders] = useState<ActiveReminder[]>(
    []
  );

  useEffect(() => {
    const loadReminders = async () => {
      const notifications =
        await Notifications.getAllScheduledNotificationsAsync();
      setActiveReminders(
        notifications.map((notification) => ({
          identifier: notification.identifier,
          trigger: notification.trigger as ActiveReminder["trigger"],
        }))
      );
    };
    loadReminders();
  }, []);

  return (
    <SafeAreaView className="w-full flex-1 bg-white dark:bg-black">
      <View className="mt-4 flex-1">
        <View className="flex-1 flex-col">
          {DAYS_OF_WEEK.map((day, index) => (
            <WeekCalendarItem
              key={day}
              day={day}
              index={index}
              activeReminders={activeReminders}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};
