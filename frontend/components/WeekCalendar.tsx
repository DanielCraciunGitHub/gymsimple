import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import WeekCalendarItem from "./WeekCalendarItem";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const WeekCalendar = () => {
  return (
    <SafeAreaView className="w-full flex-1 bg-white dark:bg-black">
      <View className="mt-4 flex-1">
        <View className="flex-1 flex-col">
          {DAYS_OF_WEEK.map((day, index) => (
            <WeekCalendarItem key={day} day={day} index={index} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};
