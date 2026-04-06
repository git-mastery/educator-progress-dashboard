type DownloadCsvButtonProps = {
  onClick: () => void;
  disabled?: boolean;
};

export function DownloadCsvButton({ onClick, disabled = false }: DownloadCsvButtonProps) {
  return (
    <button className="border-2 px-4 py-2 rounded-lg" onClick={onClick} disabled={disabled}>
      Download as .csv
    </button>
  );
}
