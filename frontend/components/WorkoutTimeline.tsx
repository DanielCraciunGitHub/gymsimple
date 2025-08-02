import React, { useCallback, useEffect, useState } from "react";
import { davidGogginsModeAtom } from "@/atoms/play";
import { ExerciseDetails } from "@/validations";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link, router } from "expo-router";
import { useSetAtom } from "jotai";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getSettings, ISettings } from "@/config/settings";
import { getItem, StorageKey } from "@/lib/local-storage";

import { sortBySelectionOrder } from "./ExerciseInput";

interface TimelineStepProps {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  isLast?: boolean;
  stepType: "preparation" | "set" | "rest" | "log";
  duration?: string;
}

const TimelineStep: React.FC<TimelineStepProps> = ({
  title,
  subtitle,
  icon,
  isLast = false,
  stepType,
  duration,
}) => {
  const getStepColors = () => {
    switch (stepType) {
      case "preparation":
        return {
          iconBg: "bg-yellow-500",
          iconColor: "#FFFFFF",
          line: "bg-yellow-300",
        };
      case "set":
        return {
          iconBg: "bg-blue-500",
          iconColor: "#FFFFFF",
          line: "bg-blue-300",
        };
      case "rest":
        return {
          iconBg: "bg-green-500",
          iconColor: "#FFFFFF",
          line: "bg-green-300",
        };
      case "log":
        return {
          iconBg: "bg-purple-500",
          iconColor: "#FFFFFF",
          line: "bg-purple-300",
        };
    }
  };

  const colors = getStepColors();

  return (
    <View className="flex-row">
      {/* Timeline Line and Icon */}
      <View className="mr-4 items-center">
        <View
          className={`h-10 w-10 rounded-full ${colors.iconBg} items-center justify-center`}
        >
          <Ionicons name={icon} size={20} color={colors.iconColor} />
        </View>
        {!isLast && <View className={`mt-2 h-12 w-1 ${colors.line}`} />}
      </View>

      {/* Content */}
      <View className="flex-1 pb-8">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </Text>
          {duration && (
            <View className="rounded-full bg-gray-200 px-3 py-1 dark:bg-gray-700">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {duration}
              </Text>
            </View>
          )}
        </View>
        {subtitle && (
          <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {subtitle}
          </Text>
        )}
      </View>
    </View>
  );
};

interface ExerciseTimelineProps {
  exercise: ExerciseDetails;
  isLast: boolean;
}

const ExerciseTimeline: React.FC<ExerciseTimelineProps> = ({
  exercise,
  isLast,
}) => {
  const sets = parseInt(exercise.targetSets) || 1;
  const reps = exercise.targetReps;
  const restTime = exercise.targetRestTime;

  const [settings, setSettings] = useState<ISettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const settings = await getSettings();
      if (settings) {
        setSettings(settings);
      }
    };

    loadSettings();
  }, []);

  const generateTimelineSteps = () => {
    const steps: (TimelineStepProps & { key: string })[] = [];

    // Exercise start
    steps.push({
      key: `${exercise.id}-start`,
      title: exercise.name,
      subtitle: `${sets} sets • ${reps} reps${restTime ? ` • ${restTime}s rest` : ""}`,
      icon: "fitness-outline",
      stepType: "preparation",
      isLast: false,
    });

    // Preparation
    steps.push({
      key: `${exercise.id}-prep`,
      title: "Get Ready",
      subtitle: "Warm up, hydrate, and get ready to start",
      icon: "timer-outline",
      stepType: "preparation",
      duration: `${settings?.prepTime}s`,
      isLast: false,
    });

    // Sets and Rest periods
    for (let i = 1; i <= sets; i++) {
      // Set
      steps.push({
        key: `${exercise.id}-set-${i}`,
        title: `Set ${i}`,
        subtitle: `Complete ${reps} reps`,
        icon: "barbell-outline",
        stepType: "set",
        isLast: false,
      });

      // Rest (except after last set)
      if (i < sets && restTime) {
        steps.push({
          key: `${exercise.id}-rest-${i}`,
          title: "Rest Period",
          subtitle: "Recover and prepare for next set",
          icon: "pause-circle-outline",
          stepType: "rest",
          duration: `${restTime}s`,
          isLast: false,
        });
      }
    }

    // Quick Log
    steps.push({
      key: `${exercise.id}-log`,
      title: "Quick Log",
      subtitle: "Record how you felt and any deviations",
      icon: "clipboard-outline",
      stepType: "log",
      isLast: true,
    });

    return steps;
  };

  const timelineSteps = generateTimelineSteps();

  return (
    <View className="mb-6">
      {timelineSteps.map((step, index) => (
        <TimelineStep
          key={step.key}
          title={step.title}
          subtitle={step.subtitle}
          icon={step.icon}
          stepType={step.stepType}
          duration={step.duration}
          isLast={index === timelineSteps.length - 1 && isLast}
        />
      ))}

      {/* Exercise Separator */}
      {!isLast && (
        <View className="my-4 flex-row items-center">
          <View className="mr-4 w-10" />
          <View className="h-0.5 flex-1 bg-gray-300 dark:bg-gray-600" />
          <View className="mx-3">
            <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">
              NEXT EXERCISE
            </Text>
          </View>
          <View className="h-0.5 flex-1 bg-gray-300 dark:bg-gray-600" />
        </View>
      )}
    </View>
  );
};

export const WorkoutTimeline: React.FC = () => {
  const setDavidGogginsMode = useSetAtom(davidGogginsModeAtom);
  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<ISettings | null>(null);

  const loadSelectedExercises = async () => {
    try {
      setIsLoading(true);
      const storedExercises = await getItem<ExerciseDetails[]>(
        StorageKey.EXERCISES
      );
      const selected = sortBySelectionOrder(
        (storedExercises || []).filter((exercise) => exercise.selected)
      );
      setSelectedExercises(selected);
    } catch (error) {
      console.error("Error loading exercises:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = async () => {
    const settings = await getSettings();
    if (settings) {
      setSettings(settings);
    }
  };

  const calculateEstimatedDuration = (): string => {
    if (!settings || selectedExercises.length === 0) return "0s";

    let totalSeconds = 0;

    // Get Ready Period * exercises.length
    totalSeconds += (settings.prepTime || 0) * selectedExercises.length;

    // For each exercise: sets * reps * 3 + (sets - 1) * restTime
    selectedExercises.forEach((exercise) => {
      const sets = parseInt(exercise.targetSets) || 1;
      const reps = parseInt(exercise.targetReps) || 1;
      const restTime = parseInt(exercise.targetRestTime) || 0;

      // sets * reps * 3 seconds per rep
      totalSeconds += sets * reps * 3;

      // Rest periods (sets - 1 because no rest after last set)
      totalSeconds += (sets - 1) * restTime;
    });

    // Convert to minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes === 0) {
      return `${seconds}s`;
    } else if (seconds === 0) {
      return `${minutes} min`;
    } else {
      return `${minutes} min ${seconds}s`;
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSelectedExercises();
      loadSettings();
    }, [])
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (selectedExercises.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6 dark:bg-black">
        <Ionicons name="fitness-outline" size={64} color="#9CA3AF" />
        <Text className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
          No Workout Selected
        </Text>
        <Text className="mt-2 text-center text-gray-600 dark:text-gray-300">
          Select exercises from &ldquo;My Exercises&rdquo; to see your
          workout timeline
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <View className="px-6 pb-4 pt-6">
        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800 dark:text-white">
              Today&apos;s Workout
            </Text>
            <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Estimated duration: {calculateEstimatedDuration()}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setDavidGogginsMode(true);
              router.push("/play-goggins");
            }}
          >
            <View className="h-12 w-12 items-center justify-center rounded-full bg-red-500">
              <Ionicons name="flame" size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Link href="/play">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-lg">
              <Ionicons name="play" size={24} color="#FFFFFF" />
            </View>
          </Link>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
        {selectedExercises.map((exercise, index) => (
          <ExerciseTimeline
            key={exercise.id}
            exercise={exercise}
            isLast={index === selectedExercises.length - 1}
          />
        ))}

        <View className="mb-12 flex-row">
          <View className="mr-4 items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-emerald-500">
              <Ionicons name="checkmark" size={24} color="#FFFFFF" />
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              Workout Complete!
            </Text>
            <Text className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Great job finishing your workout
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
