import { CLASS_NAME, EXERCISES, STUDENTS } from "@config";
import { useCallback, useMemo, useRef } from "react";
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
    if (allExercises == null || isExercisesLoading) return [];
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
    if (allStudents == null || isStudentsLoading) return [];
    const studentsSet = new Set(STUDENTS);
    return allStudents.filter((student) => studentsSet.has(student.username));
  }, [allStudents, isStudentsLoading]);

  const tableDataRef = useRef<
    { username: string; statuses: Record<string, string | undefined> }[]
  >([]);

  const handleRowComputed = useCallback(
    (row: {
      username: string;
      statuses: Record<string, string | undefined>;
    }) => {
      // Replace or add row by username
      tableDataRef.current = [
        ...tableDataRef.current.filter((r) => r.username !== row.username),
        row,
      ];
    },
    [],
  );

  const downloadCSV = useCallback(() => {
    if (!tableDataRef.current.length) return;

    const headers = [
      "Github Username",
      ...filteredExercises.map((e) => e.exercise_name),
    ];
    const rows = tableDataRef.current.map((row) => [
      row.username,
      ...filteredExercises.map((ex) => row.statuses[ex.exercise_name] ?? ""),
    ]);

    const csvContent =
      headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const timestamp = Math.floor(Date.now() / 1000);
    link.setAttribute("download", `progress_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredExercises]);

  return (
    <div className="w-[80%] mx-auto my-12">
      <div className="flex flex-row justify-between mb-4">
        <h1 className="font-bold text-3xl">
          {`${CLASS_NAME != null ? CLASS_NAME + " " : ""}`}Progress Dashboard
        </h1>
        <button className="border-2 px-4 py-2 rounded-lg" onClick={downloadCSV}>
          Download as .csv
        </button>
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Github Username
              </th>
              {filteredExercises.map((exercise) => (
                <th key={exercise.exercise_name} className="px-6 py-3">
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
                  onRowComputed={handleRowComputed}
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
  onRowComputed,
}: {
  student: Student;
  allStudents: Student[];
  allExercises: Exercise[];
  filteredExercises: Exercise[];
  onRowComputed: (row: {
    username: string;
    statuses: Record<string, string | undefined>;
  }) => void;
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

  useMemo(() => {
    if (!isStudentProgressLoading) {
      const statuses: Record<string, string | undefined> = {};
      filteredExercises.forEach((ex) => {
        statuses[ex.exercise_name] =
          latestStatus.get(ex.exercise_name)?.exerciseProgress?.status ?? "";
      });
      onRowComputed({ username: student.username, statuses });
    }
  }, [
    student.username,
    latestStatus,
    filteredExercises,
    onRowComputed,
    isStudentProgressLoading,
  ]);

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

export default App;
