import axios from "axios";
import { useQuery } from "react-query";
import type { Student } from "@/features/student-progress-dashboard/types";

export const getStudents = async () => {
  try {
    const result = await axios.get<{ [githubId: string]: string }>(
      "https://raw.githubusercontent.com/git-mastery/progress/refs/heads/tracker/user_map.json",
    );
    return Object.entries(result.data).map(([githubId, username]) => ({
      id: githubId,
      username: username,
    })) as Student[];
  } catch {
    return [];
  }
};

export const useGetStudentsQuery = () => {
  return useQuery<Student[]>({
    queryKey: ["get-students"],
    queryFn: () => getStudents(),
  });
};
