import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import { z } from "zod";

export const importFile = async <T>(schema: z.ZodSchema<T>) => {
  try {
    const res = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (res.canceled) {
      return null;
    }

    const fileUri = res.assets[0].uri;
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const parsedFile = schema.parse(JSON.parse(fileContent));
    return parsedFile;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error importing file:", error.message);
      Alert.alert("Error", "Failed to import file: Invalid format");
    } else {
      console.error("Error importing file:", error);
      Alert.alert("Error", "Failed to import file");
    }
    return null;
  }
};
