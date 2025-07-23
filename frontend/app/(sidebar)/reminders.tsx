import { View } from "react-native";

import { WeekCalendar } from "@/components/WeekCalendar";

export default function Reminders() {
  return (
    <View className="flex-1 bg-white dark:bg-black">
      <WeekCalendar />
    </View>
  );
}
