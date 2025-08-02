import React, { useState, useEffect } from "react";
import { ExerciseDetails } from "@/validations";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import uuid from "react-native-uuid";

import { isValidNumber, isWholeNumber } from "@/lib/num";
import { getTags, addTag } from "@/lib/local-storage";

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
  tags: [],
};

export const ExerciseInput: React.FC<ExerciseInputProps> = ({
  onSubmit,
  initialValues = defaultValues,
}) => {
  const [details, setDetails] = useState<ExerciseDetails>(initialValues);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string>("");
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState<string>("");

  useEffect(() => {
    const loadTags = async () => {
      const tags = await getTags();
      setAvailableTags(tags);
    };
    loadTags();
  }, []);

  const steps = [
    {
      label: "Name",
      placeholder: "Enter exercise name",
      keyboardType: "default",
      field: "name",
    },
    {
      label: "Weight",
      placeholder: "Enter weight",
      keyboardType: "numeric",
      field: "weight",
    },
    {
      label: "Sets",
      placeholder: "Enter number of sets",
      keyboardType: "numeric",
      field: "targetSets",
    },
    {
      label: "Reps/Time",
      placeholder: "1 Rep = 3 Seconds of Exercise Time",
      keyboardType: "numeric",
      field: "targetReps",
    },
    {
      label: "Rest",
      placeholder: "Enter rest time in seconds",
      keyboardType: "numeric",
      field: "targetRestTime",
    },
    {
      label: "Tags",
      placeholder: "Add tags",
      keyboardType: "default",
      field: "tags",
    },
  ] as const;

  const validateCurrentStep = (): boolean => {
    const field = steps[currentStep].field;
    setError("");

    switch (field) {
      case "name":
        if (!details.name || details.name.trim().length === 0) {
          setError("Name must be at least one character");
          return false;
        }
        break;
      case "weight":
        if (
          details.weight.value !== "" &&
          !isValidNumber(details.weight.value)
        ) {
          setError("Weight must be a valid number");
          return false;
        }
        break;
      case "targetSets":
        if (!isWholeNumber(details.targetSets)) {
          setError("Sets must be a whole number and less than 10");
          return false;
        }
        const sets = parseInt(details.targetSets);
        if (sets < 1 || sets > 10) {
          setError("Sets must be between 1 and 10");
          return false;
        }
        break;
      case "targetReps":
        if (!isWholeNumber(details.targetReps)) {
          setError("Reps must be a whole number");
          return false;
        }
        const reps = parseInt(details.targetReps);
        if (reps < 1) {
          setError("Reps must be greater than 0");
          return false;
        }
        break;
      case "targetRestTime":
        if (!isWholeNumber(details.targetRestTime)) {
          setError("Rest time must be a whole number");
          return false;
        }
        const restTime = parseInt(details.targetRestTime);
        if (restTime < 5) {
          setError("Rest time must be at least 5 seconds");
          return false;
        }
        break;
      case "tags":
        // Tags are optional, so no validation needed
        break;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) {
      return;
    }

    onSubmit({
      ...details,
      id:
        initialValues.id === "" ? (uuid.v4() as string) : initialValues.id,
    });
    setDetails(defaultValues);
    setError("");
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setError("");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (text: string) => {
    const field = steps[currentStep].field;
    const numericFields = [
      "weight",
      "targetSets",
      "targetReps",
      "targetRestTime",
    ] as (keyof ExerciseDetails)[];

    if (field === "tags") {
      setNewTag(text);
      return;
    }

    if (numericFields.includes(field)) {
      let sanitizedText: string;

      if (field === "weight") {
        // Allow digits and one decimal point for weight
        sanitizedText = text.replace(/[^\d.]/g, "");
        // Ensure only one decimal point
        const parts = sanitizedText.split(".");
        if (parts.length > 2) {
          sanitizedText = parts[0] + "." + parts.slice(1).join("");
        }
      } else {
        // Only digits for other numeric fields
        sanitizedText = text.replace(/[^\d]/g, "");
      }

      if (field === "weight") {
        setDetails({
          ...details,
          weight: { ...details.weight, value: sanitizedText },
        });
      } else {
        setDetails({ ...details, [field]: sanitizedText });
      }
    } else {
      setDetails({ ...details, [field]: text });
    }
  };

  const handleAddNewTag = async () => {
    if (newTag.trim() && !details.tags?.includes(newTag.trim())) {
      const trimmedTag = newTag.trim();
      await addTag(trimmedTag);
      setDetails({
        ...details,
        tags: [...(details.tags || []), trimmedTag],
      });
      setAvailableTags(prev => prev.includes(trimmedTag) ? prev : [...prev, trimmedTag].sort());
      setNewTag("");
    }
  };

  const handleToggleTag = (tag: string) => {
    if (details.tags && details.tags.includes(tag)) {
      setDetails({
        ...details,
        tags: details.tags.filter(t => t !== tag),
      });
    } else {
      setDetails({
        ...details,
        tags: [...(details.tags || []), tag],
      });
    }
  };

  const currentStepData = steps[currentStep];
  const currentValue =
    currentStepData.field === "weight"
      ? details.weight.value
      : currentStepData.field === "tags"
      ? newTag
      : (details[currentStepData.field] as string);

  return (
    <View className="w-full flex-1 bg-white dark:bg-black">
      {/* Fixed Header with Progress Bar */}
      <View className="bg-white px-4 pb-2 pt-4 shadow-sm dark:bg-black">
        <View className="mb-8 mt-4">
          <View className="flex-row items-start justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity 
                  className="items-center"
                  onPress={() => setCurrentStep(index)}
                  activeOpacity={0.7}
                >
                  <View
                    className={`h-4 w-4 rounded-full border-2 ${
                      index < currentStep
                        ? "border-blue-500 bg-blue-500"
                        : index === currentStep
                          ? "border-blue-500 bg-white dark:bg-gray-800"
                          : "border-gray-400 bg-transparent dark:border-gray-600"
                    }`}
                  />
                  <Text
                    className={`mt-2 w-16 text-center text-xs ${
                      index === currentStep
                        ? "font-bold text-blue-500"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.label}
                  </Text>
                </TouchableOpacity>

                {index < steps.length - 1 && (
                  <View
                    className={`mt-1.5 h-0.5 flex-1 ${
                      index < currentStep
                        ? "bg-blue-500"
                        : "bg-gray-400 dark:bg-gray-600"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
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
            {currentStepData.field !== "weight" && currentStepData.field !== "tags" && (
              <Text className="text-red-500">*</Text>
            )}
          </Text>
          <TextInput
            className={`h-14 w-full rounded-md border px-4 text-lg focus:border-blue-500 dark:bg-gray-800 dark:text-white ${
              error
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
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
          {error ? (
            <Text className="mt-2 text-sm text-red-500">{error}</Text>
          ) : null}
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
          {currentStepData.field === "tags" && (
            <View className="mt-4">
              {/* Add New Tag */}
              <View className="flex-row items-center gap-2">
                
                <TouchableOpacity
                  onPress={handleAddNewTag}
                  className="rounded-md bg-green-500 px-4 py-2"
                  disabled={!newTag.trim()}
                >
                  <Text className="text-xs font-medium text-white">Add</Text>
                </TouchableOpacity>
              </View>
              {/* Selected Tags */}
              {details.tags && details.tags.length > 0 && (
                <View className="mb-4">
                  <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Selected Tags:
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {details.tags.map((tag, index) => (
                      <Pressable
                        key={index}
                        onPress={() => handleToggleTag(tag)}
                        className="rounded-full bg-blue-500 px-3 py-1"
                      >
                        <Text className="text-xs font-medium text-white">
                          {tag} ✕
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
              
              {/* Available Tags */}
              {availableTags.filter(tag => !details.tags?.includes(tag)).length > 0 && (
                <View className="mb-4">
                  <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Available Tags:
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {availableTags
                      .filter(tag => !details.tags?.includes(tag))
                      .map((tag, index) => (
                        <Pressable
                          key={index}
                          onPress={() => handleToggleTag(tag)}
                          className="rounded-full bg-gray-200 px-3 py-1 dark:bg-gray-700"
                        >
                          <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            {tag}
                          </Text>
                        </Pressable>
                      ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
