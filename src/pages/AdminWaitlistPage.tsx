import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type WaitlistEntry = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminWaitlistPage() {
  const [password, setPassword] = useState("");
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [status, setStatus] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedPassword = window.localStorage.getItem("fred-admin-password");

    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  const stats = useMemo(() => {
    const latestEntry = entries[0];

    return {
      total: entries.length,
      latest: latestEntry ? formatTimestamp(latestEntry.createdAt) : "No entries yet",
    };
  }, [entries]);

  const loadEntries = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!password.trim()) {
      setStatus("error");
      setMessage("Enter the admin password first.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/admin/waitlist", {
        method: "GET",
        headers: {
          "x-admin-password": password.trim(),
        },
      });

      const payload = (await response.json().catch(() => null)) as
        | { status: "success"; entries: WaitlistEntry[] }
        | { status: "error"; message: string }
        | null;

      if (!response.ok || !payload || payload.status !== "success") {
        setStatus("error");
        setEntries([]);
        setMessage(payload?.status === "error" ? payload.message : "Unable to load entries.");
        return;
      }

      window.localStorage.setItem("fred-admin-password", password.trim());
      setEntries(payload.entries);
      setStatus("success");
      setMessage(`Loaded ${payload.entries.length} entr${payload.entries.length === 1 ? "y" : "ies"}.`);
    } catch {
      setStatus("error");
      setEntries([]);
      setMessage("Unable to load entries.");
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F5F7] px-5 py-8 text-[#1D1D1F] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6E6E73]">
              Fred admin
            </div>
            <h1 className="mt-3 text-[clamp(2.2rem,6vw,4rem)] font-bold tracking-[-0.04em]">
              Waitlist entries
            </h1>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-[#6E6E73]">
              This page reads the live waitlist from the deployed backend, so you can open it from any device.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full border border-black/[0.08] bg-white px-5 py-3 text-[14px] font-medium transition-colors duration-200 hover:bg-[#F8F8FA]"
          >
            Back to site
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <section className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <form onSubmit={loadEntries} className="space-y-5">
              <div>
                <label htmlFor="admin-password" className="text-[13px] font-semibold">
                  Admin password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter ADMIN_PASSWORD"
                  className="mt-3 min-h-14 w-full rounded-[20px] border border-black/[0.08] bg-[#FCFCFD] px-4 text-[16px] outline-none transition-all duration-200 placeholder:text-[#9AA0A6] focus:border-[#0071E3] focus:ring-4 focus:ring-[#DDEBFA]"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#0071E3] px-5 py-3 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#0077ED] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {status === "loading" ? "Loading entries..." : "Load entries"}
              </button>
            </form>

            {message ? (
              <div
                className={`mt-5 rounded-[20px] border px-4 py-4 text-[14px] leading-relaxed ${
                  status === "error"
                    ? "border-[#F1D2D2] bg-[#FFF6F6] text-[#9A2F2F]"
                    : "border-[#D7E4F5] bg-[#F5F9FF] text-[#2F61A0]"
                }`}
              >
                {message}
              </div>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[22px] bg-[#F7F8FA] p-4">
                <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6E6E73]">Total</div>
                <div className="mt-2 text-[28px] font-bold tracking-[-0.03em]">{stats.total}</div>
              </div>
              <div className="rounded-[22px] bg-[#F7F8FA] p-4">
                <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6E6E73]">Latest</div>
                <div className="mt-2 text-[14px] font-medium leading-relaxed">{stats.latest}</div>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-[28px] border border-black/[0.06] bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="border-b border-black/[0.06] px-6 py-5">
              <h2 className="text-[20px] font-semibold tracking-[-0.03em]">Live entries</h2>
            </div>

            {entries.length === 0 ? (
              <div className="px-6 py-10 text-[15px] leading-relaxed text-[#6E6E73]">
                Load the admin password to view the live waitlist table.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-[#F7F8FA] text-left text-[12px] uppercase tracking-[0.14em] text-[#6E6E73]">
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Email</th>
                      <th className="px-6 py-4 font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry) => (
                      <tr key={entry.id} className="border-t border-black/[0.06] text-[15px]">
                        <td className="px-6 py-4 font-medium">{entry.name}</td>
                        <td className="px-6 py-4 text-[#4B5563]">{entry.email}</td>
                        <td className="px-6 py-4 text-[#4B5563]">{formatTimestamp(entry.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
