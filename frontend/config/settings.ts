import { getItem, StorageKey } from "@/lib/local-storage";

export const DEFAULT_WORKOUT_REMINDER_TIME = 30;
export const DEFAULT_PREP_TIME = 30;

export interface ISettings {
  workoutReminderTime: number;
  prepTime: number;
}

export async function getSettings(): Promise<ISettings> {
  const settings = await getItem<ISettings>(StorageKey.SETTINGS);
  return {
    workoutReminderTime:
      settings?.workoutReminderTime ?? DEFAULT_WORKOUT_REMINDER_TIME,
    prepTime: settings?.prepTime ?? DEFAULT_PREP_TIME,
  };
}
