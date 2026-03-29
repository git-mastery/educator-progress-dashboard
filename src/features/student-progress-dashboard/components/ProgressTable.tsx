import type { Exercise } from "../../../api/queries/get_exercises";
import type { Student } from "../../../api/queries/get_students";
import { StudentProgressRow } from "./StudentProgressRow";
import { ProgressTableHeader } from "./ProgressTableHeader";
import type { OnRowComputed } from "../types";

type ProgressTableProps = {
  allStudents: Student[] | undefined;
  allExercises: Exercise[] | undefined;
  filteredStudents: Student[];
  filteredExercises: Exercise[];
  onRowComputed: OnRowComputed
};

export function ProgressTable({
  allStudents,
  allExercises,
  filteredStudents,
  filteredExercises,
  onRowComputed,
}: ProgressTableProps) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <ProgressTableHeader filteredExercises={filteredExercises} />
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
                onRowComputed={onRowComputed}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}
