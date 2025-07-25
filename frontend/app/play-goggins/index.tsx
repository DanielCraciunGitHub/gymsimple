import { useState } from "react";
import { davidGogginsModeAtom } from "@/atoms/play";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSetAtom } from "jotai";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { usePlayBackground } from "@/hooks/play-background";
import { GogginsWorkoutPlayer } from "@/components/WorkoutPlayer";

export default function PlayGoggins() {
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const setDavidGogginsMode = useSetAtom(davidGogginsModeAtom);
  const backgroundColor = usePlayBackground();

  const handleStartWorkout = () => {
    setWorkoutStarted(true);
  };

  const handleQuitWorkout = () => {
    Alert.alert(
      "Quit Goggins Mode?",
      "David Goggins would say: 'When you want to quit, you're only at 40% of your capacity.' Are you sure you want to quit?",
      [
        {
          text: "Keep Going",
          style: "cancel",
        },
        {
          text: "I'm Done",
          style: "destructive",
          onPress: () => {
            setWorkoutStarted(false);
            setDavidGogginsMode(false);
            router.back();
          },
        },
      ]
    );
  };

  if (workoutStarted) {
    return (
      <GogginsWorkoutPlayer
        backgroundColor={backgroundColor}
        onQuit={handleQuitWorkout}
      />
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${backgroundColor}`}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Header */}
        <View className="mb-12 items-center">
          <Text className="mb-4 text-center text-4xl font-bold text-white">
            GOGGINS MODE
          </Text>
          <Text className="mb-2 text-center text-xl text-white">
            STAY HARD
          </Text>
        </View>

        {/* Warning/Description */}
        <View className="mb-12 rounded-lg border border-red-500 bg-red-900/30 p-6">
          <Text className="mb-4 text-center text-xl font-bold text-white">
            ⚠️ WARNING ⚠️
          </Text>
          <Text className="mb-4 text-center text-white">
            This is an infinite endurance workout. Minimal rest, maximum
            effort.
          </Text>
          <Text className="text-center text-gray-300">
            • 8 exercises in rotation
          </Text>
          <Text className="text-center text-gray-300">
            • 100 reps per exercise
          </Text>
          <Text className="text-center text-gray-300">
            • 20 second rest between exercises
          </Text>
          <Text className="text-center text-gray-300">
            • Loops forever until you quit
          </Text>
          <Text className="text-center text-gray-300">
            • Mental toughness required
          </Text>
        </View>

        {/* Motivational Quote */}
        <View className="mb-12">
          <Text className="text-center text-lg italic text-white">
            &quot;You are in danger of living a life so comfortable and
            soft, that you will die without ever realizing your true
            potential.&quot;
          </Text>
          <Text className="mt-2 text-center text-sm text-white">
            &mdash; David Goggins
          </Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          onPress={handleStartWorkout}
          className="mb-8 items-center justify-center rounded-lg bg-red-600 px-12 py-6"
        >
          <Ionicons name="flame" size={40} color="white" />
          <Text className="mt-2 text-2xl font-bold text-white">
            START GOGGINS MODE
          </Text>
        </TouchableOpacity>

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Ionicons name="arrow-back" size={24} color="gray" />
          <Text className="ml-2 text-lg text-gray-400">
            Back to Safety
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
