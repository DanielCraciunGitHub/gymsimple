import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationProps {
  title?: string;
  message: string;
  date?: Date;
}
export async function requestNotificationPermissions() {
  if (Platform.OS === "ios") {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } else if (Platform.OS === "android") {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  }
  return true;
}

export async function scheduleWeeklyNotification({
  title,
  message,
  date,
}: NotificationProps) {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    console.warn("Notification permission not granted");
    return;
  }

  if (!date) {
    throw new Error(
      "Date is required for scheduling weekly notifications"
    );
  }

  const notificationContent: Notifications.NotificationContentInput = {
    title: title,
    body: message,
    priority: Notifications.AndroidNotificationPriority.HIGH,
    vibrate: [250, 250],
    sound: true,
  };

  const id = await Notifications.scheduleNotificationAsync({
    content: notificationContent,
    trigger: {
      weekday: date.getDay() + 1,
      hour: date.getHours(),
      minute: date.getMinutes(),
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
    },
  });

  console.log("Notification scheduled with id:", id);
  return id;
}

export async function cancelWeeklyNotification(identifier: string) {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}
