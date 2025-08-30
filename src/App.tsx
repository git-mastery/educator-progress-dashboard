import { CLASS_NAME, EXERCISES, STUDENTS } from "@config";
import { useCallback, useMemo } from "react";
import {
  useGetStudentExercisesQuery,
  type StudentExercise,
} from "src/api/queries/get_student_exercises";
import {
  useGetExercisesQuery,
  type Exercise,
} from "./api/queries/get_exercises";
import { useGetStudentsQuery, type Student } from "./api/queries/get_students";

function App() {
  const { data: allExercises, isLoading: isExercisesLoading } =
    useGetExercisesQuery();
  const filteredExercises = useMemo(() => {
    if (allExercises == null || isExercisesLoading) {
      return [];
    }
    const exercisesSet = new Set(EXERCISES);
    const exercises =
      EXERCISES.length === 0
        ? allExercises
        : allExercises.filter((exercise) =>
            exercisesSet.has(exercise.exercise_name),
          );
    return exercises.sort((a, b) =>
      a.exercise_name.localeCompare(b.exercise_name),
    );
  }, [allExercises, isExercisesLoading]);

  const { data: allStudents, isLoading: isStudentsLoading } =
    useGetStudentsQuery();
  const filteredStudents = useMemo(() => {
    if (allStudents == null || isStudentsLoading) {
      return [];
    }

    const studentsSet = new Set(STUDENTS);
    return allStudents.filter((student) => studentsSet.has(student.username));
  }, [allStudents, isStudentsLoading]);

  return (
    <div className="w-[80%] mx-auto my-12">
      <h1 className="font-bold text-3xl mb-4">
        {`${CLASS_NAME != null ? CLASS_NAME + " " : ""}`}Progress Dashboard
      </h1>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Github Username
              </th>
              {filteredExercises.map((exercise) => (
                <th
                  key={exercise.exercise_name}
                  scope="col"
                  className="px-6 py-3"
                >
                  {exercise.exercise_name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allStudents != null &&
              allExercises != null &&
              filteredStudents.map((student) => (
                <StudentProgressRow
                  key={student.id}
                  student={student}
                  allStudents={allStudents}
                  allExercises={allExercises}
                  filteredExercises={filteredExercises}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentProgressRow({
  student,
  allStudents,
  allExercises,
  filteredExercises,
}: {
  student: Student;
  allStudents: Student[];
  allExercises: Exercise[];
  filteredExercises: Exercise[];
}) {
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

  const getStatusSymbol = useCallback((status?: string | null) => {
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
  console.log(latestStatus);
  console.log(studentProgress);

  return (
    <tr className="bg-white border-b border-gray-200">
      <td className="px-6 py-3">{student.username}</td>
      {filteredExercises.map((exercise) => (
        <td key={exercise.exercise_name} className="px-6 py-3">
          {getStatusSymbol(
            latestStatus.get(exercise.exercise_name)?.exerciseProgress?.status,
          )}
        </td>
      ))}
    </tr>
  );
}

export default App;
