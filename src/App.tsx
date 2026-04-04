import { useCallback, useRef } from "react";

import { DashboardHeader } from "./features/student-progress-dashboard/components/DashboardHeader";
import { useCsvDownload } from "./features/student-progress-dashboard/hooks/useCsvDownload";
import { DownloadCsvButton } from "./features/student-progress-dashboard/components/DownloadCsvButton";
import { useGetExercisesQuery } from "./features/student-progress-dashboard/hooks/useGetExercisesQuery";
import { useGetStudentsQuery } from "./features/student-progress-dashboard/hooks/useGetStudentsQuery";
import { ProgressTable } from "./features/student-progress-dashboard/components/ProgressTable";
import { useFilteredExercises } from "./features/student-progress-dashboard/hooks/useFilteredExercises";
import { useFilteredStudents } from "./features/student-progress-dashboard/hooks/useFilteredStudents";
import type { OnRowComputed, ProgressRow } from "./features/student-progress-dashboard/types";

function App() {
  const { data: allExercises, isLoading: isExercisesLoading } =
    useGetExercisesQuery();

  const filteredExercises = useFilteredExercises(allExercises, isExercisesLoading);
  
  const { data: allStudents, isLoading: isStudentsLoading } =
    useGetStudentsQuery();

  const filteredStudents = useFilteredStudents(allStudents, isStudentsLoading);

  const tableDataRef = useRef<ProgressRow[]>([]);

  const { downloadCsv } = useCsvDownload({
    exercises: filteredExercises,
    getRows: () => tableDataRef.current
  });

  const handleRowComputed = useCallback<OnRowComputed>((row) => {
    // Replace or add row by username
    tableDataRef.current = [
      ...tableDataRef.current.filter((r) => r.username !== row.username),
      row,
    ];
  }, []);

  return (
    <div className="w-[80%] mx-auto my-12">
      <div className="flex flex-row justify-between mb-4">
        <DashboardHeader/>
        <DownloadCsvButton onClick={downloadCsv} />
      </div>

      <ProgressTable
        allStudents={allStudents}
        allExercises={allExercises}
        filteredStudents={filteredStudents}
        filteredExercises={filteredExercises}
        onRowComputed={handleRowComputed}
      />

    </div>
  );
}

export default App;
