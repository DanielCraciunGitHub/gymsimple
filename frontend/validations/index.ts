import { z } from "zod";

export const exerciseDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  targetSets: z.string(),
  targetReps: z.string(),
  targetRestTime: z.string(),
  weight: z.object({
    value: z.string(),
    unit: z.enum(["kg", "lbs"]),
  }),
  selected: z.boolean(),
  selectionOrder: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

export const exerciseDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  weight: z.object({
    value: z.string(),
    unit: z.enum(["kg", "lbs"]),
  }),
  set: z.array(
    z.object({
      targetReps: z.number(),
      actualReps: z.number(),
    })
  ),
  restTime: z.number(),
  rating: z.number(),
});

export const workoutSessionSchema = z.object({
  id: z.string(),
  date: z.coerce.date(),
  exercises: z.array(exerciseDataSchema),
  endDate: z.coerce.date(),
});

export const exerciseDetailsArraySchema = z.array(exerciseDetailsSchema);
export const workoutSessionArraySchema = z.array(workoutSessionSchema);

export type ExerciseDetails = z.infer<typeof exerciseDetailsSchema>;
export type ExerciseData = z.infer<typeof exerciseDataSchema>;
export type WorkoutSession = z.infer<typeof workoutSessionSchema>;
