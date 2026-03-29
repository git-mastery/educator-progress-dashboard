import { useCallback } from "react";
import type { Exercise } from "../../../api/queries/get_exercises";
import type { ProgressRow } from "../types";

type UseCsvDownloadParams = {
  exercises: Exercise[];
  getRows: () => ProgressRow[];
  filenamePrefix?: string;
};

const escapeCsvCell = (value: string) => {
  const safe = value.replace(/"/g, '""');
  return /[",\n]/.test(safe) ? `"${safe}"` : safe;
};

export const useCsvDownload = ({
  exercises,
  getRows,
  filenamePrefix = "progress",
}: UseCsvDownloadParams) => {
  const downloadCsv = useCallback(() => {
    const rows = getRows();
    if (rows.length === 0) return;

    const headers = ["Github Username", ...exercises.map((e) => e.exercise_name)];
    const dataRows = rows.map((row) => [
      row.username,
      ...exercises.map((ex) => row.statuses[ex.exercise_name] ?? ""),
    ]);

    const csvContent = [
      headers.map(escapeCsvCell).join(","),
      ...dataRows.map((r) => r.map((c) => escapeCsvCell(String(c))).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    try {
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filenamePrefix}_${Math.floor(Date.now() / 1000)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      URL.revokeObjectURL(url);
    }
  }, [exercises, getRows, filenamePrefix]);

  return { downloadCsv };
};

