import { STUDENTS } from "@config";
import { useMemo } from "react";
import type { Student } from "@/features/student-progress-dashboard/types";

export const useFilteredStudents = (
  allStudents: Student[] | undefined,
  isStudentsLoading: boolean,
) => {
  return useMemo(() => {
    if (allStudents == null || isStudentsLoading) return [];
    const studentsSet = new Set(STUDENTS);
    return allStudents.filter((student) => studentsSet.has(student.username));
  }, [allStudents, isStudentsLoading]);
};
