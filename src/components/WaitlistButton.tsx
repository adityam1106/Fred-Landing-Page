export const TALLY_URL = "https://tally.so/r/REPLACE_WITH_YOUR_ID";

export default function WaitlistButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.open(TALLY_URL, "_blank")}
      className={className}
    >
      {label}
    </button>
  );
}
