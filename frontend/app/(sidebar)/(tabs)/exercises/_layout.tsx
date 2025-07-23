import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="my-exercises"
        options={{
          title: "My Exercises",
        }}
      />
      <Stack.Screen
        name="add-exercise"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
