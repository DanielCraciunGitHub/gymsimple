import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Day, nextDay } from "date-fns";
import { Platform, Text, TouchableOpacity, View } from "react-native";

import {
  clearNotificationsByWeekday,
  scheduleWeeklyNotification,
} from "@/lib/local-notifications";

import { ActiveReminder } from "./WeekCalendar";

export default function WeekCalendarItem({
  day,
  index,
  activeReminders,
}: {
  day: string;
  index: number;
  activeReminders: ActiveReminder[];
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  useEffect(() => {
    const reminder = activeReminders.find(
      (reminder) =>
        reminder.trigger && reminder.trigger.weekday === index + 1
    );
    if (reminder) {
      setSelectedTime(
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          reminder.trigger.hour,
          reminder.trigger.minute
        )
      );
    }
  }, [activeReminders, index]);

  const handleSetReminder = async (
    event: DateTimePickerEvent,
    date?: Date
  ) => {
    setShowPicker(Platform.OS === "ios");
    if (event.type === "set" && date) {
      setSelectedTime(date);

      const nextOccurrence = nextDay(new Date(), index as Day);
      nextOccurrence.setHours(date.getHours(), date.getMinutes(), 0, 0);

      await scheduleWeeklyNotification({
        title: `Gym Time 🏋️`,
        message: `Hit to the gym!`,
        date: nextOccurrence,
      });
    }
  };

  return (
    <View
      key={day}
      className="flex-1 border-b border-gray-200"
      style={index === 6 ? { borderBottomWidth: 0 } : undefined}
    >
      <TouchableOpacity
        onPress={async () => {
          if (selectedTime) {
            setSelectedTime(null);
            await clearNotificationsByWeekday(index + 1);
          } else {
            setShowPicker(true);
          }
        }}
        className="flex-row items-center justify-between p-4"
      >
        <Text className="text-sm font-medium text-gray-600">{day}</Text>
        {selectedTime ? (
          <View className="flex-row items-center gap-2">
            <Ionicons name="time-outline" size={18} color="#3B82F6" />
            <Text className="text-sm font-medium text-blue-500">
              {selectedTime.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>
          </View>
        ) : (
          <View className="flex-row items-center gap-2 opacity-50">
            <Ionicons
              name="add-circle-outline"
              size={18}
              color="#6B7280"
            />
            <Text className="text-sm text-black dark:text-white">
              Set reminder
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedTime || new Date()}
          mode="time"
          onChange={handleSetReminder}
        />
      )}
    </View>
  );
}
