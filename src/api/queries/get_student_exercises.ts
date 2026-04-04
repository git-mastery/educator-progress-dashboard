import axios from "axios";
import type { Exercise } from "./get_exercises";
import type { Student } from "./get_students";

export interface ExerciseProgress {
  exercise_name: string;
  started_at: number;
  completed_at: number;
  comments: string[];
  status: string;
}

export interface StudentExercise {
  student: Student;
  exercise: Exercise;
  exerciseProgress: ExerciseProgress;
}

export const getStudentExercises = async (
  studentId: string,
  students: Student[],
  exercises: Exercise[],
) => {
  try {
    const result = await axios.get<ExerciseProgress[]>(
      `https://raw.githubusercontent.com/git-mastery/progress/refs/heads/tracker/students/${studentId}.json`,
    );
    const studentsMap = Object.fromEntries(
      students.map((student) => [student.id, student]),
    );
    const student = studentsMap[studentId];
    const exercisesMap = Object.fromEntries(
      exercises.map((exercise) => [exercise.exercise_name, exercise]),
    );
    const studentProgress = new Map<string, StudentExercise[]>();
    result.data.forEach((progress) => {
      const exercise = exercisesMap[progress.exercise_name];
      if (!studentProgress.has(progress.exercise_name)) {
        studentProgress.set(progress.exercise_name, []);
      }
      studentProgress.get(progress.exercise_name)!.push({
        student,
        exercise,
        exerciseProgress: progress,
      });
    });
    return studentProgress;
  } catch {
    return new Map();
  }
};
