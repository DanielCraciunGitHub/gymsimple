export type ExerciseData = {
  id: string;
  name: string;
  set: {
    targetReps: number;
    actualReps: number;
  }[];
  restTime: number;
  rating: number;
};

export type WorkoutSession = {
  id: string;
  date: Date;
  exercises: ExerciseData[];
};
