export interface Exercise {
  exercise_name: string;
  tags: string[];
}

export interface Student {
  id: string;
  username: string;
}

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

export type ProgressRow = {
  username: string;
  statuses: Record<string, string | undefined>;
};

export type OnRowComputed = (row: ProgressRow) => void;
