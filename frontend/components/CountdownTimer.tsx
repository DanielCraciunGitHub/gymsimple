import { useEffect, useState } from "react";
import { isPausedAtom } from "@/atoms/play";
import { Ionicons } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { Text, TouchableOpacity, View } from "react-native";

interface CountdownTimerProps {
  durationSeconds: number;
  onComplete: () => void;
}

export const CountdownTimer = ({
  durationSeconds,
  onComplete,
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isPaused, setIsPaused] = useAtom(isPausedAtom);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      if (timeLeft === 0) {
        onComplete();
      }

      return () => clearInterval(interval);
    }
  }, [timeLeft, isPaused, onComplete]);

  return (
    <View className="items-center justify-center">
      <Text className="text-9xl font-bold text-white">{timeLeft}</Text>
      <View className="flex-row gap-4">
        <TouchableOpacity onPress={() => setIsPaused(!isPaused)}>
          <Ionicons
            name={isPaused ? "play-circle" : "pause-circle"}
            size={100}
            color="white"
          />
        </TouchableOpacity>
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
