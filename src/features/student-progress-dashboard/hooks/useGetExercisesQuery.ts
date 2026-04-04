import { useQuery } from "react-query";
import {
  getExercises,
  type Exercise,
} from "../../../api/queries/get_exercises";

export const useGetExercisesQuery = () => {
  return useQuery<Exercise[]>({
    queryKey: ["get-exercises"],
    queryFn: () => getExercises(),
  });
};
