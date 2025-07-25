import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

export const exportFile = async (fileName: string, fileContent: any) => {
  const json = JSON.stringify(fileContent, null, 2);
  const filePath = FileSystem.cacheDirectory + fileName;
  await FileSystem.writeAsStringAsync(filePath, json);

  if (!(await Sharing.isAvailableAsync())) {
    alert("Sharing is not available on this device");
    return;
  }

  await Sharing.shareAsync(filePath);
};
