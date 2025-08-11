import { useEffect, useState } from "react";
import { isPausedAtom } from "@/atoms/play";
import { useAtom } from "jotai";
import { Text, View } from "react-native";

interface StopwatchProps {
  className?: string;
}

export const Stopwatch = ({ className = "" }: StopwatchProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPaused, setIsPaused] = useAtom(isPausedAtom);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <View className={`items-center ${className}`}>
      <Text className="text-4xl font-bold text-white">
        {formatTime(elapsedTime)}
      </Text>
    </View>
  );
};
