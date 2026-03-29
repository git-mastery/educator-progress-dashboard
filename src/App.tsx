import { useCallback, useRef } from "react";

import {
  useGetExercisesQuery
} from "./api/queries/get_exercises";
import { useGetStudentsQuery } from "./api/queries/get_students";
import { DashboardHeader } from "./features/student-progress-dashboard/components/DashboardHeader";
import { useCsvDownload } from "./features/student-progress-dashboard/hooks/useCsvDownload";
import { DownloadCsvButton } from "./features/student-progress-dashboard/components/DownloadCsvButton";
import { ProgressTable } from "./features/student-progress-dashboard/components/ProgressTable";
import { useFilteredExercises } from "./features/student-progress-dashboard/hooks/useFilteredExercises";
import { useFilteredStudents } from "./features/student-progress-dashboard/hooks/useFilteredStudents";

function App() {
  const { data: allExercises, isLoading: isExercisesLoading } =
    useGetExercisesQuery();

  const filteredExercises = useFilteredExercises(allExercises, isExercisesLoading);
  
  const { data: allStudents, isLoading: isStudentsLoading } =
    useGetStudentsQuery();

  const filteredStudents = useFilteredStudents(allStudents, isStudentsLoading);

  const tableDataRef = useRef<
    { username: string; statuses: Record<string, string | undefined> }[]
  >([]);

  const { downloadCsv } = useCsvDownload({
    exercises: filteredExercises,
    getRows: () => tableDataRef.current
  });

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
