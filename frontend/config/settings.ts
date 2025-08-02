import { getItem, StorageKey } from "@/lib/local-storage";

export const DEFAULT_WORKOUT_REMINDER_TIME = 30;
export const DEFAULT_PREP_TIME = 60;
export const AUTO_REST = true;
export const DEFAULT_SKIP_LOG = false;

export interface ISettings {
  workoutReminderTime: number;
  prepTime: number;
  autoRest: boolean;
  skipLog: boolean;
}

export async function getSettings(): Promise<ISettings> {
  const settings = await getItem<ISettings>(StorageKey.SETTINGS);
  return {
    workoutReminderTime:
      settings?.workoutReminderTime ?? DEFAULT_WORKOUT_REMINDER_TIME,
    prepTime: settings?.prepTime ?? DEFAULT_PREP_TIME,
    autoRest: settings?.autoRest ?? AUTO_REST,
    skipLog: settings?.skipLog ?? DEFAULT_SKIP_LOG,
  };
}
