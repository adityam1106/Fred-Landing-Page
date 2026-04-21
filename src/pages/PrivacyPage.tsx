import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

type Language = "en" | "de";

const copy = {
  en: {
    back: "Back to Fred",
    eyebrow: "Privacy Policy",
    title: "How Fred handles waitlist data",
    intro:
      "Fred currently collects only the information needed to manage waitlist updates: your name and email address.",
    sections: [
      {
        title: "What we collect",
        body:
          "If you join the waitlist, we collect the name and email address you enter into the form.",
      },
      {
        title: "How we use it",
        body:
          "We use this information only to contact you about Fred launch updates, early access, and closely related product news.",
      },
      {
        title: "What we do not do",
        body:
          "We do not ask for payment details on the waitlist form, and we do not sell waitlist data to third parties.",
      },
      {
        title: "How access is limited",
        body:
          "Waitlist entries are stored in a managed database and are available only through restricted internal admin access.",
      },
      {
        title: "Data requests",
        body:
          "If you no longer want to hear from Fred, you can unsubscribe from future messages. We can also remove your waitlist entry on request once support contact details are published.",
      },
    ],
    footer:
      "This page describes the current waitlist flow and may be updated as Fred launches more features and formal support channels.",
  },
  de: {
    back: "Zurück zu Fred",
    eyebrow: "Datenschutzerklärung",
    title: "So geht Fred mit Wartelistendaten um",
    intro:
      "Fred erhebt derzeit nur die Informationen, die für Updates zur Warteliste nötig sind: deinen Namen und deine E-Mail-Adresse.",
    sections: [
      {
        title: "Was wir erheben",
        body:
          "Wenn du dich in die Warteliste einträgst, speichern wir den Namen und die E-Mail-Adresse, die du in das Formular eingibst.",
      },
      {
        title: "Wie wir die Daten nutzen",
        body:
          "Wir nutzen diese Informationen nur, um dich über den Start von Fred, Early Access und eng damit verbundene Produktupdates zu informieren.",
      },
      {
        title: "Was wir nicht tun",
        body:
          "Wir fragen im Wartelistenformular nicht nach Zahlungsdaten und verkaufen Wartelistendaten nicht an Dritte.",
      },
      {
        title: "Wie der Zugriff begrenzt ist",
        body:
          "Wartelisteneinträge werden in einer verwalteten Datenbank gespeichert und sind nur über einen eingeschränkten internen Admin-Zugang verfügbar.",
      },
      {
        title: "Datenanfragen",
        body:
          "Wenn du keine Nachrichten von Fred mehr erhalten möchtest, kannst du spätere E-Mails abbestellen. Auf Wunsch können wir deinen Wartelisteneintrag auch löschen, sobald Support-Kontaktdaten veröffentlicht sind.",
      },
    ],
    footer:
      "Diese Seite beschreibt den aktuellen Wartelistenprozess und kann aktualisiert werden, sobald Fred weitere Funktionen und offizielle Support-Kanäle veröffentlicht.",
  },
} as const;

function inferLanguage(searchParams: URLSearchParams): Language {
  const explicit = searchParams.get("lang");
  if (explicit === "en" || explicit === "de") {
    return explicit;
  }

  if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("de")) {
    return "de";
  }

  return "en";
}

export default function PrivacyPage() {
  const [searchParams] = useSearchParams();
  const language = useMemo(() => inferLanguage(searchParams), [searchParams]);
  const content = copy[language];

  return (
    <main className="min-h-screen bg-[#F8F8FA] px-5 py-8 text-[#1D1D1F] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[36px] border border-black/[0.05] bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <Link
            to={language === "de" ? "/waitlist?lang=de" : "/"}
            className="inline-flex items-center rounded-full border border-black/[0.06] bg-white px-4 py-2 text-[13px] font-medium text-[#1D1D1F] transition-colors duration-200 hover:bg-[#F5F5F7]"
          >
            {content.back}
          </Link>

          <div className="mt-10 inline-flex items-center rounded-full border border-black/[0.06] bg-[#F8F8FA] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6E6E73]">
            {content.eyebrow}
          </div>

          <h1 className="mt-6 max-w-[14ch] text-[clamp(2.4rem,6vw,4.6rem)] font-bold leading-[1.02] tracking-[-0.05em] text-[#1D1D1F]">
            {content.title}
          </h1>

          <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-[#6E6E73] sm:text-[18px]">
            {content.intro}
          </p>

          <div className="mt-10 space-y-4">
            {content.sections.map((section) => (
              <section key={section.title} className="rounded-[28px] border border-black/[0.05] bg-[#FAFAFB] p-5 sm:p-6">
                <h2 className="text-[20px] font-semibold tracking-[-0.03em] text-[#1D1D1F]">{section.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[#4B5563] sm:text-[16px]">{section.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-[13px] leading-relaxed text-[#6E6E73] sm:text-[14px]">
            {content.footer}
          </p>
        </div>
      </div>
    </main>
  );
}
