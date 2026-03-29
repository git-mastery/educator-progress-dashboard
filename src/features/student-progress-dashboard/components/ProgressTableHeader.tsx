import type { Exercise } from "../../../api/queries/get_exercises";

type ProgressTableHeaderProps = {
  filteredExercises: Exercise[];
};

export function ProgressTableHeader({ filteredExercises }: ProgressTableHeaderProps) {
  return (
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
  );
}
