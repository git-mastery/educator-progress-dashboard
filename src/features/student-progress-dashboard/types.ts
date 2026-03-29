export type ProgressRow = {
  username: string;
  statuses: Record<string, string | undefined>;
};

export type OnRowComputed = (row: ProgressRow) => void;