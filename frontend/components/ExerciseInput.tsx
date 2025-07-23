import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";

export interface ExerciseDetails {
  id: string;
  name: string;
  targetSets: string;
  targetReps: string;
  targetRestTime: string;
  weight: {
    value: string;
    unit: "kg" | "lbs";
  };
  selected: boolean;
  selectionOrder?: number; // Track the order in which exercises were selected
}

// Utility function to sort exercises by selection order
export const sortBySelectionOrder = (
  exercises: ExerciseDetails[]
): ExerciseDetails[] => {
  return exercises.sort((a, b) => {
    // Sort by selection order, with undefined/null values at the end
    if (a.selectionOrder === undefined && b.selectionOrder === undefined)
      return 0;
    if (a.selectionOrder === undefined) return 1;
    if (b.selectionOrder === undefined) return -1;
    return a.selectionOrder - b.selectionOrder;
  });
};

interface ExerciseInputProps {
  onSubmit: (details: ExerciseDetails) => void;
  initialValues?: ExerciseDetails;
}

const defaultValues: ExerciseDetails = {
  id: "",
  name: "",
  targetSets: "",
  targetReps: "",
  targetRestTime: "",
  weight: {
    value: "",
    unit: "kg",
  },
  selected: false,
  selectionOrder: undefined,
};

export const ExerciseInput: React.FC<ExerciseInputProps> = ({
  onSubmit,
  initialValues = defaultValues,
}) => {
  const [details, setDetails] = useState<ExerciseDetails>(initialValues);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      label: "Exercise Name",
      placeholder: "Enter exercise name",
      keyboardType: "default" as const,
      field: "name" as keyof ExerciseDetails,
    },
    {
      label: "Weight",
      placeholder: "Enter weight",
      keyboardType: "numeric" as const,
      field: "weight" as keyof ExerciseDetails,
    },
    {
      label: "Sets",
      placeholder: "Enter number of sets",
      keyboardType: "numeric" as const,
      field: "targetSets" as keyof ExerciseDetails,
    },
    {
      label: "Reps",
      placeholder: "Enter number of reps",
      keyboardType: "numeric" as const,
      field: "targetReps" as keyof ExerciseDetails,
    },
    {
      label: "Rest Time",
      placeholder: "Enter rest time in seconds",
      keyboardType: "numeric" as const,
      field: "targetRestTime" as keyof ExerciseDetails,
    },
  ];

  const handleSubmit = () => {
    onSubmit({
      ...details,
      id:
        initialValues.id === "" ? (uuid.v4() as string) : initialValues.id,
    });
    setDetails(defaultValues);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (text: string) => {
    const field = steps[currentStep].field;
    if (field === "weight") {
      setDetails({
        ...details,
        weight: { ...details.weight, value: text },
      });
    } else {
      setDetails({ ...details, [field]: text });
    }
  };

  const currentStepData = steps[currentStep];
  const currentValue =
    currentStepData.field === "weight"
      ? details.weight.value
      : (details[currentStepData.field] as string);

  return (
    <View className="w-full flex-1 bg-white dark:bg-black">
      {/* Fixed Header with Progress Bar */}
      <View className="bg-white px-4 pb-2 pt-4 shadow-sm dark:bg-black">
        <View className="mb-4">
          <Text className="mb-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </Text>
          <View className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <View
              className="h-2 rounded-full bg-blue-500"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </View>
        </View>

        {/* Navigation Buttons at Top */}
        <View className="mb-4 flex-row justify-between">
          {/* Previous Button */}
          <TouchableOpacity
            className={`mr-2 flex-1 rounded-md py-3 ${
              currentStep === 0
                ? "bg-gray-300 dark:bg-gray-600"
                : "bg-gray-500 dark:bg-gray-500"
            }`}
            onPress={handlePrevious}
            disabled={currentStep === 0}
          >
            <Text
              className={`text-center font-semibold ${
                currentStep === 0
                  ? "text-gray-500 dark:text-gray-400"
                  : "text-white"
              }`}
            >
              Previous
            </Text>
          </TouchableOpacity>

          {/* Next/Save Button */}
          {currentStep < steps.length - 1 ? (
            <TouchableOpacity
              className="ml-2 flex-1 rounded-md bg-blue-500 py-3 dark:bg-blue-500"
              onPress={handleNext}
            >
              <Text className="text-center font-semibold text-white">
                Next
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="ml-2 flex-1 rounded-md bg-green-500 py-3 dark:bg-green-500"
              onPress={handleSubmit}
            >
              <Text className="text-center font-semibold text-white">
                Save Exercise
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Input Section - Higher up to avoid keyboard */}
      <View className="flex-1 px-4 pt-8">
        <View className="mb-6">
          <Text className="mb-4 text-center text-lg font-medium text-gray-700 dark:text-gray-300">
            {currentStepData.label}
          </Text>
          <TextInput
            className="h-14 w-full rounded-md border border-gray-300 px-4 text-lg focus:border-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            value={currentValue}
            onChangeText={handleInputChange}
            placeholder={currentStepData.placeholder}
            keyboardType={currentStepData.keyboardType}
            autoFocus={true}
            textAlignVertical="center"
            onSubmitEditing={() => {
              if (currentStep === steps.length - 1) {
                handleSubmit();
              } else {
                handleNext();
              }
            }}
            returnKeyType={
              currentStep === steps.length - 1 ? "done" : "next"
            }
            submitBehavior="submit"
          />
          {currentStepData.field === "weight" && (
            <View className="mt-4 flex-row items-center justify-center gap-4">
              <Pressable
                onPress={() =>
                  setDetails({
                    ...details,
                    weight: { ...details.weight, unit: "kg" },
                  })
                }
                className={`rounded-lg px-6 py-3 ${
                  details.weight.unit === "kg"
                    ? "bg-blue-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    details.weight.unit === "kg"
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  kg
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  setDetails({
                    ...details,
                    weight: { ...details.weight, unit: "lbs" },
                  })
                }
                className={`rounded-lg px-6 py-3 ${
                  details.weight.unit === "lbs"
                    ? "bg-blue-500"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    details.weight.unit === "lbs"
                      ? "text-white"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  lbs
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
