import React, { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import { getItem, StorageKey } from "@/lib/local-storage";

import { ExerciseDetails, sortBySelectionOrder } from "./ExerciseInput";

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
      subtitle: "Position yourself and prepare for the exercise",
      icon: "timer-outline",
      stepType: "preparation",
      duration: "30s",
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
  const [selectedExercises, setSelectedExercises] = useState<
    ExerciseDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useFocusEffect(
    useCallback(() => {
      loadSelectedExercises();
    }, [])
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black" />
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
      <View className="flex-row items-center justify-between px-6 pb-4 pt-6">
        <Text className="text-2xl font-bold text-gray-800 dark:text-white">
          Today&apos;s Workout
        </Text>
        <Link href="/play">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-lg">
            <Ionicons name="play" size={24} color="#FFFFFF" />
          </View>
        </Link>
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
