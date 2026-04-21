import { Link } from "react-router-dom";

export default function WaitlistButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Link
      to="/waitlist"
      className={className}
    >
      {label}
    </Link>
  );
}
