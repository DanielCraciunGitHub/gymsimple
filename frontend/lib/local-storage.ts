import AsyncStorage from "@react-native-async-storage/async-storage";

export enum StorageKey {
  REMINDERS = "@reminders",
  SETTINGS = "@settings",
  EXERCISES = "@exercises",
  WORKOUT_SESSIONS = "@workout-sessions",
  TAGS = "@tags",
}

export async function setItem<T>(
  key: StorageKey,
  value: T
): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error("Error storing data:", error);
    throw error;
  }
}

export async function getItem<T>(key: StorageKey): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error retrieving data:", error);
    throw error;
  }
}

export async function removeItem(key: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing data:", error);
    throw error;
  }
}

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error("Error clearing data:", error);
    throw error;
  }
}

export async function getAllKeys(): Promise<readonly string[]> {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error("Error getting all keys:", error);
    throw error;
  }
}

export async function hasKey(key: StorageKey): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null;
  } catch (error) {
    console.error("Error checking key existence:", error);
    throw error;
  }
}

// Tag management functions
export async function getTags(): Promise<string[]> {
  try {
    const tags = await getItem<string[]>(StorageKey.TAGS);
    return tags || [];
  } catch (error) {
    console.error("Error getting tags:", error);
    return [];
  }
}

export async function addTag(tag: string): Promise<void> {
  try {
    const existingTags = await getTags();
    const trimmedTag = tag.trim();
    
    if (trimmedTag && !existingTags.includes(trimmedTag)) {
      const updatedTags = [...existingTags, trimmedTag].sort();
      await setItem(StorageKey.TAGS, updatedTags);
    }
  } catch (error) {
    console.error("Error adding tag:", error);
    throw error;
  }
}

export async function removeTag(tag: string): Promise<void> {
  try {
    const existingTags = await getTags();
    const updatedTags = existingTags.filter(t => t !== tag);
    await setItem(StorageKey.TAGS, updatedTags);
  } catch (error) {
    console.error("Error removing tag:", error);
    throw error;
  }
}
