export const TALLY_URL = "https://tally.so/r/RGJpxQ";

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
