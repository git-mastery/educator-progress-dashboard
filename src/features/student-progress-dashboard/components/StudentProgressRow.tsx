import { useCallback, useEffect, useMemo } from "react";
import {
  useGetStudentExercisesQuery,
  type StudentExercise,
} from "../../../api/queries/get_student_exercises";
import type { Exercise } from "../../../api/queries/get_exercises";
import type { Student } from "../../../api/queries/get_students";
import type { OnRowComputed } from "../types";

type StudentProgressRowProps = {
  student: Student;
  allStudents: Student[];
  allExercises: Exercise[];
  filteredExercises: Exercise[];
  onRowComputed: OnRowComputed
};

export function StudentProgressRow({
  student,
  allStudents,
  allExercises,
  filteredExercises,
  onRowComputed,
}: StudentProgressRowProps) {
  const { data: studentProgress, isLoading: isStudentProgressLoading } =
    useGetStudentExercisesQuery(student.id, allStudents, allExercises);

  const latestStatus = useMemo(() => {
    if (studentProgress == null || isStudentProgressLoading) {
      return new Map<string, StudentExercise>();
    }
    const result = new Map<string, StudentExercise>();
    studentProgress.forEach((exercises, exerciseName: string) => {
      result.set(exerciseName, exercises.at(-1)!);
    });
    return result;
  }, [isStudentProgressLoading, studentProgress]);

  const getEmoji = useCallback((status?: string | null) => {
    switch (status) {
      case "SUCCESSFUL":
      case "Completed":
        return "✅";
      case "UNSUCCESSFUL":
      case "Incomplete":
        return "❌";
      case "ERROR":
      case "Error":
        return "⚠️";
      default:
        return "";
    }
  }, []);

  const exerciseStatusRecord = useMemo(() => {
    const latestExerciseStatusRecord: Record<string, string | undefined> = {};
    filteredExercises.forEach((ex) => {
      latestExerciseStatusRecord[ex.exercise_name] =
        latestStatus.get(ex.exercise_name)?.exerciseProgress?.status ?? "";
    });
    return latestExerciseStatusRecord;
  }, [filteredExercises, latestStatus]);

  useEffect(() => {
    if (!isStudentProgressLoading) {
      onRowComputed({ username: student.username, statuses: exerciseStatusRecord });
    }
  }, [isStudentProgressLoading, onRowComputed, student.username, exerciseStatusRecord]);

  return (
    <tr className="bg-white border-b border-gray-200">
      <td className="px-6 py-3">{student.username}</td>
      {filteredExercises.map((exercise) => {
        const rawStatus =
          latestStatus.get(exercise.exercise_name)?.exerciseProgress?.status ??
          "";
        return (
          <td key={exercise.exercise_name} className="px-6 py-3">
            {getEmoji(rawStatus)}
          </td>
        );
      })}
    </tr>
  );
}
