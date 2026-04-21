import { motion } from "framer-motion";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

type Language = "en" | "de";
type SubmitState = "idle" | "loading" | "success" | "duplicate" | "error";

const ease = [0.25, 0.1, 0.25, 1] as const;

const copy = {
  en: {
    back: "Back to Fred",
    label: "Early access",
    title: "Join the Fred waitlist",
    description: "Be the first to hear when Fred launches.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    submit: "Join waitlist",
    submitting: "Joining...",
    privacy:
      "We’ll only use your details for Fred waitlist updates. No spam, no resale, and you can opt out anytime.",
    aside:
      "A simple, first-party signup so you hear from Fred directly when access opens.",
    successTitle: "You're on the list.",
    successBody: "We’ll be in touch when Fred launches.",
    duplicate: "This email is already registered.",
    invalidName: "Please enter your name.",
    invalidEmail: "Please enter a valid email.",
    genericError: "Something went wrong. Please try again.",
    noteLabel: "Direct updates",
  },
  de: {
    back: "Zurück zu Fred",
    label: "Früher Zugang",
    title: "Zur Fred-Warteliste",
    description: "Erfahre als Erste:r, wenn Fred startet.",
    nameLabel: "Name",
    namePlaceholder: "Dein Name",
    emailLabel: "E-Mail",
    emailPlaceholder: "du@beispiel.de",
    submit: "Zur Warteliste",
    submitting: "Wird eingetragen...",
    privacy:
      "Wir nutzen deine Angaben nur für Updates zur Fred-Warteliste. Kein Spam, kein Weiterverkauf, jederzeit abmeldbar.",
    aside:
      "Ein einfacher, direkter Signup, damit du Fred-Updates ohne Drittanbieter bekommst.",
    successTitle: "Du stehst auf der Liste.",
    successBody: "Wir melden uns, sobald Fred startet.",
    duplicate: "Diese E-Mail ist bereits registriert.",
    invalidName: "Bitte gib deinen Namen ein.",
    invalidEmail: "Bitte gib eine gültige E-Mail ein.",
    genericError: "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    noteLabel: "Direkte Updates",
  },
} as const;

function inferInitialLanguage(searchParams: URLSearchParams): Language {
  const explicit = searchParams.get("lang");
  if (explicit === "en" || explicit === "de") {
    return explicit;
  }

  if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("de")) {
    return "de";
  }

  return "en";
}

export default function WaitlistPage() {
  const [searchParams] = useSearchParams();
  const [language, setLanguage] = useState<Language>(() => inferInitialLanguage(searchParams));
  const [name, setName] = useState("");
  const [email, setEmail] = useState(searchParams.get("email")?.trim() ?? "");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const content = copy[language];
  const statusTitle =
    submitState === "success"
      ? content.successTitle
      : submitState === "duplicate"
        ? content.duplicate
        : content.genericError;

  useEffect(() => {
    const nextLanguage = inferInitialLanguage(searchParams);
    setLanguage(nextLanguage);

    const nextEmail = searchParams.get("email")?.trim();
    if (nextEmail) {
      setEmail(nextEmail);
    }
  }, [searchParams]);

  const isBusy = submitState === "loading";

  const statusTone = useMemo(() => {
    switch (submitState) {
      case "success":
        return "border-[#CFE7D5] bg-[#F2FBF4] text-[#1E6A47]";
      case "duplicate":
        return "border-[#D7E4F5] bg-[#F5F9FF] text-[#2F61A0]";
      case "error":
        return "border-[#F1D2D2] bg-[#FFF6F6] text-[#9A2F2F]";
      default:
        return "";
    }
  }, [submitState]);

  const validateName = (value: string) => {
    const normalized = value.trim();

    if (!normalized) {
      setNameError(content.invalidName);
      return null;
    }

    setNameError("");
    return normalized;
  };

  const validateEmail = (value: string) => {
    const normalized = value.trim().toLowerCase();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);

    if (!isValid) {
      setEmailError(content.invalidEmail);
      return null;
    }

    setEmailError("");
    return normalized;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = validateName(name);
    const normalizedEmail = validateEmail(email);
    if (!normalizedName || !normalizedEmail) {
      setSubmitState("idle");
      return;
    }

    setSubmitState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { status?: "success" | "duplicate" | "error"; message?: string }
        | null;

      if (response.ok && payload?.status === "success") {
        setSubmitState("success");
        setMessage(content.successBody);
        return;
      }

      if (response.status === 409 || payload?.status === "duplicate") {
        setSubmitState("duplicate");
        setMessage(payload?.message ?? content.duplicate);
        return;
      }

      setSubmitState("error");
      setMessage(payload?.message ?? content.genericError);
    } catch {
      setSubmitState("error");
      setMessage(content.genericError);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F8FA] px-5 py-8 sm:px-6 sm:py-10">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 bg-[radial-gradient(circle_at_top,rgba(0,113,227,0.10),rgba(248,248,250,0)_72%)]" />
        <div className="absolute right-[-8rem] top-[18%] h-64 w-64 rounded-full bg-[#E8F1FF] blur-[96px]" />
        <div className="absolute left-[-6rem] bottom-[14%] h-56 w-56 rounded-full bg-[#EEF7E6] blur-[84px]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-12">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease } }}
            className="flex flex-col justify-between rounded-[36px] border border-black/[0.05] bg-white/78 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-[10px] sm:p-8 lg:p-10"
          >
            <div>
              <Link
                to="/"
                className="inline-flex items-center rounded-full border border-black/[0.06] bg-white px-4 py-2 text-[13px] font-medium text-[#1D1D1F] transition-colors duration-200 hover:bg-[#F5F5F7]"
              >
                {content.back}
              </Link>

              <div className="mt-10 inline-flex items-center rounded-full border border-black/[0.06] bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6E6E73]">
                {content.label}
              </div>

              <h1 className="mt-6 max-w-[12ch] text-[clamp(2.5rem,6vw,4.75rem)] font-bold leading-[1.02] tracking-[-0.05em] text-[#1D1D1F]">
                {content.title}
              </h1>

              <p className="mt-5 max-w-[34rem] text-[16px] leading-relaxed text-[#6E6E73] sm:text-[18px]">
                {content.description}
              </p>
            </div>

            <div className="mt-10 rounded-[28px] border border-black/[0.05] bg-[#FAFAFB] p-5 sm:p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6E6E73]">
                {content.noteLabel}
              </div>
              <div className="mt-3 text-[15px] leading-relaxed text-[#1D1D1F]">
                {content.aside}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.08, ease } }}
            className="rounded-[36px] border border-black/[0.05] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10"
          >
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="waitlist-name" className="text-[13px] font-semibold text-[#1D1D1F]">
                  {content.nameLabel}
                </label>
                <input
                  id="waitlist-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (nameError) {
                      setNameError("");
                    }
                  }}
                  placeholder={content.namePlaceholder}
                  className={`mt-3 min-h-14 w-full rounded-[22px] border bg-[#FCFCFD] px-4 text-[16px] text-[#1D1D1F] outline-none transition-all duration-200 placeholder:text-[#9AA0A6] ${
                    nameError
                      ? "border-[#E69A9A] focus:border-[#D14C4C] focus:ring-4 focus:ring-[#F8DADA]"
                      : "border-black/[0.08] focus:border-[#0071E3] focus:ring-4 focus:ring-[#DDEBFA]"
                  }`}
                />
                {nameError ? <p className="mt-3 text-[13px] text-[#B23737]">{nameError}</p> : null}
              </div>

              <div>
                <label htmlFor="waitlist-email" className="text-[13px] font-semibold text-[#1D1D1F]">
                  {content.emailLabel}
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (emailError) {
                      setEmailError("");
                    }
                  }}
                  placeholder={content.emailPlaceholder}
                  className={`mt-3 min-h-14 w-full rounded-[22px] border bg-[#FCFCFD] px-4 text-[16px] text-[#1D1D1F] outline-none transition-all duration-200 placeholder:text-[#9AA0A6] ${
                    emailError
                      ? "border-[#E69A9A] focus:border-[#D14C4C] focus:ring-4 focus:ring-[#F8DADA]"
                      : "border-black/[0.08] focus:border-[#0071E3] focus:ring-4 focus:ring-[#DDEBFA]"
                  }`}
                />
                {emailError ? <p className="mt-3 text-[13px] text-[#B23737]">{emailError}</p> : null}
              </div>

              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#0071E3] px-6 py-4 text-[16px] font-semibold text-white shadow-[0_18px_36px_rgba(0,113,227,0.22)] transition-all duration-200 hover:bg-[#0077ED] disabled:cursor-not-allowed disabled:opacity-75"
              >
                {isBusy ? content.submitting : content.submit}
              </button>

              {submitState !== "idle" && message ? (
                <div aria-live="polite" className={`rounded-[22px] border px-4 py-4 text-[14px] leading-relaxed ${statusTone}`}>
                  <div className="font-semibold">{statusTitle}</div>
                  {message !== statusTitle ? <div className="mt-1">{message}</div> : null}
                </div>
              ) : null}

              <p className="max-w-[32rem] text-[12px] leading-relaxed text-[#6E6E73] sm:text-[13px]">
                {content.privacy}
              </p>
            </form>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
