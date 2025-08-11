import { useEffect, useRef, useState } from "react";
import { isPausedAtom } from "@/atoms/play";
import { Ionicons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { Text, TouchableOpacity, View } from "react-native";

interface CountdownTimerProps {
  durationSeconds: number;
  onComplete: () => void;
  isPausable?: boolean;
}

export const CountdownTimer = ({
  durationSeconds,
  onComplete,
  isPausable = true,
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isPaused, setIsPaused] = useAtom(isPausedAtom);
  const onCompleteRef = useRef(onComplete);

  // Update the ref whenever onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  // Handle completion when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft <= 0) {
      onCompleteRef.current();
    }
  }, [timeLeft]);

  // Timer interval
  useEffect(() => {
    if (!isPaused && timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft, isPaused]);

  return (
    <View className="items-center justify-center">
      <Text className="text-9xl font-bold text-white">{timeLeft}</Text>
      <View className="flex-row gap-4">
        {isPausable && (
          <TouchableOpacity onPress={() => setIsPaused(!isPaused)}>
            <Ionicons
              name={isPaused ? "play-circle" : "pause-circle"}
              size={100}
              color="white"
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            setTimeLeft(0);
            setIsPaused(false);
          }}
        >
          <Ionicons
            name="play-skip-forward-circle"
            size={100}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
