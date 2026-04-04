import { useQuery } from "react-query";
import { getStudents, type Student } from "../../../api/queries/get_students";

export const useGetStudentsQuery = () => {
  return useQuery<Student[]>({
    queryKey: ["get-students"],
    queryFn: () => getStudents(),
  });
};
