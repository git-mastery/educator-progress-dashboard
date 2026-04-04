import { useQuery } from "react-query";
import {
  getStudentExercises,
  type StudentExercise,
} from "../../../api/queries/get_student_exercises";
import type { Exercise } from "../../../api/queries/get_exercises";
import type { Student } from "../../../api/queries/get_students";

export const useGetStudentExercisesQuery = (
  studentId: string,
  students: Student[],
  exercises: Exercise[],
) => {
  return useQuery<Map<string, StudentExercise[]>>({
    queryFn: () => getStudentExercises(studentId, students, exercises),
    queryKey: [`get-student-exercises-${studentId}`],
  });
};
