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

  console.log("Scheduling notification for:", date);
  const notification = await Notifications.scheduleNotificationAsync({
    content: notificationContent,
    trigger: {
      weekday: date.getDay() + 1,
      hour: date.getHours(),
      minute: date.getMinutes(),
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
    },
  });

  console.log("Notification scheduled:", notification);
}

export async function cancelWeeklyNotification(weekday: number) {
  const scheduledNotifications =
    await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of scheduledNotifications) {
    const trigger = notification.trigger as { weekday: number };
    if (trigger.weekday === weekday + 1) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
      console.log("Cancelled notification for weekday:", weekday);
    }
  }
}
