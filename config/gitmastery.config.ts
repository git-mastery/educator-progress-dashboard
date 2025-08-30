import exercisesCsv from "./exercises.csv";
import studentsCsv from "./students.csv";

export const STUDENTS: string[] = studentsCsv.map(
  (row: { username: string }) => row.username,
);

export const EXERCISES: string[] = exercisesCsv.map(
  (row: { exercise_name: string }) => row.exercise_name,
);

export const CLASS_NAME: string | null = null;
