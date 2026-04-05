import { StudentProgressRow } from "@/features/student-progress-dashboard/components/StudentProgressRow";
import { ProgressTableHeader } from "@/features/student-progress-dashboard/components/ProgressTableHeader";
import type {
  Exercise,
  OnRowComputed,
  Student,
} from "@/features/student-progress-dashboard/types";

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
