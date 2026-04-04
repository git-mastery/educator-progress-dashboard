import { EXERCISES } from "@config";
import { useMemo } from "react";
import type { Exercise } from "../../../api/queries/get_exercises";

export const useFilteredExercises = (
  allExercises: Exercise[] | undefined,
  isExercisesLoading: boolean,
) => {
  return useMemo(() => {
    if (allExercises == null || isExercisesLoading) return [];
    const exercisesSet = new Set(EXERCISES);
    const exercises =
      EXERCISES.length === 0
        ? [...allExercises]
        : allExercises.filter((exercise) =>
            exercisesSet.has(exercise.exercise_name),
          );
    return exercises.sort((a, b) =>
      a.exercise_name.localeCompare(b.exercise_name),
    );
  }, [allExercises, isExercisesLoading]);
};
