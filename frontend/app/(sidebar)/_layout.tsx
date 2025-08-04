import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Drawer } from "expo-router/drawer";
import { useColorScheme } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  const { colorScheme } = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerShown: true,
          headerTitle: "",
          drawerPosition: "left",
          headerStyle: {
            backgroundColor:
              colorScheme === "dark" ? "#000000" : "#FFFFFF",
          },
          headerTintColor: colorScheme === "dark" ? "#FFFFFF" : "#023c69",
          drawerActiveTintColor:
            colorScheme === "dark" ? "#FFFFFF" : "#023c69",
          drawerInactiveTintColor:
            colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
          drawerStyle: {
            backgroundColor:
              colorScheme === "dark" ? "#000000" : "#FFFFFF",
          },
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: "Home",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="reminders"
          options={{
            drawerLabel: "Reminders",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="alarm-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="import-export"
          options={{
            drawerLabel: "Import/Export",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="cloud-upload-outline" size={size} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            drawerIcon: ({ color, size }) => (
              <Ionicons
                name="settings-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
