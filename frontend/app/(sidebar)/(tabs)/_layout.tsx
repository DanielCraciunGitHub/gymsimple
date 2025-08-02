import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";

export default function Layout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerTitle: "",
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#000000" : "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: colorScheme === "dark" ? "#1F2937" : "#E5E5E5",
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        tabBarActiveTintColor:
          colorScheme === "dark" ? "#FFFFFF" : "#023c69",
        tabBarInactiveTintColor:
          colorScheme === "dark" ? "#9CA3AF" : "#6B7280",
        headerShown: false,
        headerStyle: {
          backgroundColor: colorScheme === "dark" ? "#000000" : "#FFFFFF",
        },
        headerTintColor: colorScheme === "dark" ? "#FFFFFF" : "#023c69",
      }}
    >
      <Tabs.Screen
        name="exercises"
        options={{
          title: "Exercises",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="barbell-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Play",
          tabBarIcon: ({ size, focused }) => (
            <Ionicons
              name="play"
              size={size}
              color={focused ? "green" : "gray"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: "Sessions",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
