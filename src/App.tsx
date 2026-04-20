/**
 * Install:
 * npm i react@18 react-dom@18 framer-motion lenis gsap @gsap/react
 * npm i -D typescript vite @vitejs/plugin-react @types/react @types/react-dom tailwindcss @tailwindcss/vite
 */

import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  Suspense,
  lazy,
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from "react";
import AgeEvolutionSection from "./components/AgeEvolutionSection";
import HowItWorks from "./components/HowItWorks";
import LessonShowcase from "./components/LessonShowcase";
import WaitlistButton from "./components/WaitlistButton";

const DeferredSections = lazy(() => import("./components/DeferredSections"));

type Language = "en" | "de";

const ease = [0.25, 0.1, 0.25, 1] as const;
const fontStack =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const copy = {
  en: {
    badge: "Introducing Fred · Early access open",
    headline: "The bank that teaches your kids how money actually works.",
    subheadline:
      "Fred gives children aged 8-18 a real debit card, pocket money management, and weekly financial lessons, unlocking their money only after they learn something new.",
    finePrint: "No credit card required · Launching in Germany first",
    navCta: "Get early access",
    primaryCta: "Join the waitlist",
    secondaryCta: "Learn more ↓",
    phone: {
      greeting: "Hi, Mila!",
      mode: "Explorer Fred",
      annotation: "Representative Explorer preview",
      bankLabel: "My Jungle Bank",
      locked: "Locked",
      bananasSaved: "bananas saved",
      details: "Details",
      lessonLabel: "Level 4 • Expedition",
      lessonTitle: "Saving Goals",
      progressLabel: "Expedition progress",
      cta: "Continue lesson →",
      streakTitle: "7 day streak",
      streakSubtitle: "Super Explorer!",
      rewards: "Rewards",
      nextReward: "Next: Golden Banana",
      nav: {
        home: "Jungle",
        lessons: "Lessons",
        bank: "Bank",
      },
    },
    ageEvolution: {
      headline: "Grows with your child",
      subheadline: "From saving up that special LEGO set to understanding taxes and investments.",
      stages: [
        {
          label: "Explorer",
          ageRange: "Ages 8-10",
          portraitSrc: "/fred-avatar-1.png",
          wordmark: "Fred",
          wordmarkColor: "#365E34",
          labelColor: "#7E9957",
          pillClassName: "bg-[#EEF2DD] text-[#7C9654]",
          caption: "Curious beginnings. Learning through play.",
        },
        {
          label: "Adventurer",
          ageRange: "Ages 11-13",
          portraitSrc: "/fred-avatar-2.png",
          wordmark: "Fred",
          wordmarkColor: "#2E6A49",
          labelColor: "#2E6A49",
          pillClassName: "bg-[#EEF2DD] text-[#6F8E57]",
          caption: "Build confidence. Develop capability.",
        },
        {
          label: "Navigator",
          ageRange: "Ages 14-16",
          portraitSrc: "/fred-avatar-3.png",
          wordmark: "Fred",
          wordmarkColor: "#204C7B",
          labelColor: "#2F61A0",
          pillClassName: "bg-[#E4EAF6] text-[#3A69A8]",
          caption: "Take responsibility. Understand impact.",
        },
        {
          label: "Independence",
          ageRange: "Ages 17-18",
          portraitSrc: "/fred-avatar-4.png",
          wordmark: "Fred",
          wordmarkColor: "#0F1F3A",
          labelColor: "#18253E",
          pillClassName: "bg-[#EAE3F6] text-[#6E58A9]",
          caption: "A comprehensive understanding of taxes and finance. Ready for the future.",
        },
      ],
    },
    howItWorks: {
      label: "01 / HOW IT WORKS",
      headline: "Simple for kids. Reassuring for parents.",
      cards: [
        {
          number: "01",
          icon: "🏦",
          title: "Parents load money",
          description:
            "Top up your child's Fred account anytime. Set spending limits and stay in full control of every euro.",
        },
        {
          number: "02",
          icon: "🎓",
          title: "Kids complete lessons",
          description:
            "Watch a short video, pass a quick quiz, unlock real money. No lesson passed, no money unlocked.",
        },
        {
          number: "03",
          icon: "📈",
          title: "Everyone grows smarter",
          description:
            "Kids build genuine financial knowledge. Parents see every transaction in real time.",
        },
      ],
    },
    lessonShowcase: {
      label: "02 / WHAT FRED TEACHES",
      headline: "Real knowledge. Real money.",
      subheadline: "Age-appropriate financial education built for the German context.",
      cards: [
        {
          icon: "📊",
          title: "Progressive Taxation",
          description:
            "How Germany's tax brackets work and why earning more is always still better.",
        },
        {
          icon: "💹",
          title: "Compound Interest",
          description:
            "Why €10 today becomes €40 in 20 years. The math behind every great investor.",
        },
        {
          icon: "📈",
          title: "Stock Markets",
          description:
            "What the DAX is, how ETFs work, and why starting early changes everything.",
        },
        {
          icon: "💰",
          title: "Budgeting Basics",
          description:
            "Income minus expenses equals freedom. Fred makes it click before bad habits form.",
        },
      ],
    },
    parentDashboard: {
      label: "03 / FOR PARENTS",
      title: "Clarity for parents. Confidence for kids.",
      description:
        "See what your child is learning, how they are spending, and which rules are guiding their money. Fred gives families oversight without turning every payment into a conversation.",
      bullets: [
        "Track spending, lessons, and progress from one dashboard.",
        "Set rules that unlock money only after learning happens.",
        "Spot patterns early with real-time visibility and monthly summaries.",
        "Give independence gradually while staying fully informed.",
      ],
      cta: "Join the waitlist",
      dashboard: {
        childName: "Felix Schneider",
        childMeta: "Age 11 · Mainz",
        statusValue: "Balance unlocked",
        statusMeta: "This week’s lesson passed",
        allowanceLabel: "Weekly pocket money",
        allowanceValue: "€18.00",
        allowanceMeta: "Every Friday at 16:00",
        allowanceBadge: "Active",
        lessonsLabel: "Lessons completed",
        lessonsValue: "9 of 12",
        lessonsMeta: "Tax, saving, budgeting, and more",
        stats: [
          { id: "quizScore", label: "Quiz score", value: "92%", accent: "blue" },
          { id: "streak", label: "Current streak", value: "6 weeks", accent: "green" },
          { id: "completion", label: "Completion", value: "75%" },
        ],
        spendingLabel: "Recent spending",
        spendingLiveLabel: "Live",
        spending: [
          { name: "School lunch", amount: "-€3.80" },
          { name: "Bookshop", amount: "-€12.00" },
          { name: "Pocket money loaded", amount: "+€18.00", accent: "green" },
        ],
        overviewLabel: "Monthly overview",
        overview: [
          { name: "Saving", value: "€42" },
          { name: "Spending", value: "€28" },
          { name: "Learning progress", value: "75%" },
        ],
        controlsLabel: "Rules",
        controlsValue: "Lesson requirement active",
        controlsMeta: "Allowance unlocks after the weekly lesson and quiz are completed.",
        controlsEnabledLabel: "Enabled",
      },
    },
    pricing: {
      label: "04 / PRICING",
      headline: "One price. The whole family.",
      price: "€2.99",
      period: "/month",
      features: [
        "Debit card for your child",
        "Unlimited lesson unlocks",
        "Parent dashboard and real-time alerts",
        "Tax and investment education",
        "Works for ages 8 to 18",
        "Cancel anytime",
      ],
      cta: "Join the waitlist →",
      finePrint: "No credit card required to join the waitlist.",
    },
    faq: {
      label: "05 / FAQ",
      headline: "Good questions.",
      items: [
        {
          question: "Is Fred a real bank?",
          answer:
            "Fred is built on top of regulated banking infrastructure. Your child's money is protected up to €100,000 by deposit guarantee schemes, the same protection as any German bank account.",
        },
        {
          question: "What age is Fred for?",
          answer:
            "Children aged 8 to 18. The app difficulty and UI adapt dynamically as your child grows, a 9 year old and a 17 year old see a completely different experience.",
        },
        {
          question: "How does the lesson unlock work?",
          answer:
            "Parents load money into the account. Kids watch a short educational video and pass a quick quiz. Once they pass, the money unlocks to their debit card. No pass, no spend, simple as that.",
        },
        {
          question: "What does Fred teach?",
          answer:
            "Progressive taxation, compound interest, stock market basics, budgeting, and more. Everything is built around the German financial context with tax brackets, DAX, ETFs, and Kindergeld so that your child is ready to deal with real world financial problems",
        },
        {
          question: "How much does it cost?",
          answer:
            "€2.99 per month per family. One subscription covers all children in the household. No hidden fees, cancel anytime.",
        },
        {
          question: "What if my child needs money urgently and doesn’t have time to complete a lesson?",
          answer:
            "In urgent situations, your child can use an “instant release” option once per week. This allows them to access their money immediately, even without completing a lesson first.\n\nTo keep the learning loop intact, they will need to complete an extra lesson afterwards. Parents can fully control and adjust this feature in the parental settings.",
        },
      ],
    },
    waitlistCta: {
      headline: "Be the first family on Fred.",
      subheadline:
        "We are building Fred for families who want their kids to grow up financially confident. Join the waitlist and shape the product.",
      placeholder: "Your email address",
      button: "Join waitlist →",
      finePrint: "Available in German and English",
    },
    footer: {
      left: "Fred · Teaching kids money since 2026",
      madeWith: "Made with",
      words: ["caffeine", "deadlines", "curiosity", "Ctrl+Z", "impostor syndrome"],
      location: "Mainz, DE · 49°N 8°E",
    },
  },
  de: {
    badge: "Fred vorstellen · Früher Zugang offen",
    headline: "Die Bank, die deinen Kindern beibringt, wie Geld wirklich funktioniert.",
    subheadline:
      "Fred gibt Kindern von 8-18 Jahren eine echte Debitkarte, Taschengeldverwaltung und wöchentliche Finanzlektionen — das Geld wird erst freigeschaltet, wenn sie etwas Neues gelernt haben.",
    finePrint: "Keine Kreditkarte erforderlich · Zuerst in Deutschland verfügbar",
    navCta: "Früher Zugang",
    primaryCta: "Zur Warteliste",
    secondaryCta: "Mehr erfahren ↓",
    phone: {
      greeting: "Hi, Mila!",
      mode: "Entdecker Fred",
      annotation: "Beispielhafte Explorer-Vorschau",
      bankLabel: "Meine Dschungelbank",
      locked: "Gesperrt",
      bananasSaved: "Bananen gespart",
      details: "Details",
      lessonLabel: "Level 4 • Expedition",
      lessonTitle: "Sparziele",
      progressLabel: "Expeditionsfortschritt",
      cta: "Lektion fortsetzen →",
      streakTitle: "7 Tage Serie",
      streakSubtitle: "Super Entdecker!",
      rewards: "Belohnungen",
      nextReward: "Als Nächstes: Goldene Banane",
      nav: {
        home: "Dschungel",
        lessons: "Lektionen",
        bank: "Bank",
      },
    },
    ageEvolution: {
      headline: "Wächst mit deinem Kind",
      subheadline: "Vom Sparen für das besondere LEGO-Set bis hin zum Verständnis von Steuern und Investitionen.",
      stages: [
        {
          label: "Entdecker",
          ageRange: "8-10 Jahre",
          portraitSrc: "/fred-avatar-1.png",
          wordmark: "Fred",
          wordmarkColor: "#365E34",
          labelColor: "#7E9957",
          pillClassName: "bg-[#EEF2DD] text-[#7C9654]",
          caption: "Neugieriger Anfang. Lernen durch Spiel.",
        },
        {
          label: "Abenteurer",
          ageRange: "11-13 Jahre",
          portraitSrc: "/fred-avatar-2.png",
          wordmark: "Fred",
          wordmarkColor: "#2E6A49",
          labelColor: "#2E6A49",
          pillClassName: "bg-[#EEF2DD] text-[#6F8E57]",
          caption: "Selbstvertrauen aufbauen. Fähigkeiten entwickeln.",
        },
        {
          label: "Navigator",
          ageRange: "14-16 Jahre",
          portraitSrc: "/fred-avatar-3.png",
          wordmark: "Fred",
          wordmarkColor: "#204C7B",
          labelColor: "#2F61A0",
          pillClassName: "bg-[#E4EAF6] text-[#3A69A8]",
          caption: "Verantwortung übernehmen. Wirkung verstehen.",
        },
        {
          label: "Unabhängig",
          ageRange: "17-18 Jahre",
          portraitSrc: "/fred-avatar-4.png",
          wordmark: "Fred",
          wordmarkColor: "#0F1F3A",
          labelColor: "#18253E",
          pillClassName: "bg-[#EAE3F6] text-[#6E58A9]",
          caption: "Komplexes Verständnis von Steuern und Finanzen. Bereit für die Zukunft.",
        },
      ],
    },
    howItWorks: {
      label: "01 / SO FUNKTIONIERT'S",
      headline: "Einfach für Kinder. Beruhigend für Eltern.",
      cards: [
        {
          number: "01",
          icon: "🏦",
          title: "Eltern laden Geld auf",
          description:
            "Lade das Fred-Konto deines Kindes jederzeit auf. Setze Ausgabelimits und behalte jeden Euro im Blick.",
        },
        {
          number: "02",
          icon: "🎓",
          title: "Kinder schließen Lektionen ab",
          description:
            "Ein kurzes Video schauen, ein Quiz bestehen, echtes Geld freischalten. Keine bestandene Lektion, kein freigeschaltetes Geld.",
        },
        {
          number: "03",
          icon: "📈",
          title: "Alle werden finanziell schlauer",
          description:
            "Kinder bauen echtes Finanzwissen auf. Eltern sehen jede Transaktion in Echtzeit.",
        },
      ],
    },
    lessonShowcase: {
      label: "02 / WAS FRED VERMITTELT",
      headline: "Echtes Wissen. Echtes Geld.",
      subheadline: "Altersgerechte Finanzbildung, entwickelt für den Alltag.",
      cards: [
        {
          icon: "📊",
          title: "Progressive Besteuerung",
          description:
            "Wie Deutschlands Steuerstufen funktionieren und warum mehr verdienen trotzdem immer besser ist.",
        },
        {
          icon: "💹",
          title: "Zinseszins",
          description:
            "Warum aus 10 EUR heute in 20 Jahren 40 EUR werden. Die Mathematik hinter großartigen Anlegern.",
        },
        {
          icon: "📈",
          title: "Aktienmärkte",
          description:
            "Was der DAX ist, wie ETFs funktionieren und warum früh anfangen alles verändert.",
        },
        {
          icon: "💰",
          title: "Budget-Grundlagen",
          description:
            "Einnahmen minus Ausgaben ergibt Freiheit. Fred macht es verständlich, bevor schlechte Gewohnheiten entstehen.",
        },
      ],
    },
    parentDashboard: {
      label: "03 / FÜR ELTERN",
      title: "Klarheit für Eltern. Sicherheit für Kinder.",
      description:
        "Sieh, was dein Kind lernt, wie es Geld ausgibt und welche Regeln sein Geld steuern. Fred gibt Familien Überblick, ohne jede Zahlung zu einem Gespräch zu machen.",
      bullets: [
        "Verfolge Ausgaben, Lektionen und Fortschritt in einem ruhigen Dashboard.",
        "Lege Regeln fest, damit Geld erst nach dem Lernen freigeschaltet wird.",
        "Erkenne Muster früh mit Echtzeit-Einblicken und Monatsübersichten.",
        "Gib Schritt für Schritt mehr Freiheit, ohne den Überblick zu verlieren.",
      ],
      cta: "Zur Warteliste",
      dashboard: {
        childName: "Felix Schneider",
        childMeta: "11 Jahre · Mainz",
        statusLabel: "Alles im grünen Bereich",
        statusValue: "Guthaben freigeschaltet",
        statusMeta: "Die Wochenlektion wurde bestanden",
        allowanceLabel: "Wöchentliches Taschengeld",
        allowanceValue: "18,00 €",
        allowanceMeta: "Jeden Freitag um 16:00 Uhr",
        allowanceBadge: "Aktiv",
        lessonsLabel: "Abgeschlossene Lektionen",
        lessonsValue: "9 von 12",
        lessonsMeta: "Steuern, Sparen, Budgetierung und mehr",
        stats: [
          { id: "quizScore", label: "Quiz-Ergebnis", value: "92%", accent: "blue" },
          { id: "streak", label: "Aktuelle Serie", value: "6 Wochen", accent: "green" },
          { id: "completion", label: "Fortschritt", value: "75%" },
        ],
        spendingLabel: "Letzte Ausgaben",
        spendingLiveLabel: "Live",
        spending: [
          { name: "Schulessen", amount: "-3,80 €" },
          { name: "Buchhandlung", amount: "-12,00 €" },
          { name: "Taschengeld geladen", amount: "+18,00 €", accent: "green" },
        ],
        overviewLabel: "Monatsübersicht",
        overview: [
          { name: "Gespart", value: "42 €" },
          { name: "Ausgegeben", value: "28 €" },
          { name: "Lernfortschritt", value: "75%" },
        ],
        controlsLabel: "Regeln",
        controlsValue: "Lektionspflicht ist aktiv",
        controlsMeta: "Taschengeld wird erst freigeschaltet, wenn Wochenlektion und Quiz erledigt sind.",
        controlsEnabledLabel: "Aktiv",
      },
    },
    pricing: {
      label: "04 / PREISE",
      headline: "Ein Preis. Die ganze Familie.",
      price: "€2.99",
      period: "/Monat",
      features: [
        "Debitkarte für dein Kind",
        "Unbegrenzte Lektionen zum Freischalten",
        "Eltern-Dashboard und Echtzeit-Benachrichtigungen",
        "Steuer- und Investmentbildung",
        "Für Kinder von 8 bis 18 Jahren",
        "Jederzeit kündbar",
      ],
      cta: "Zur Warteliste →",
      finePrint: "Keine Kreditkarte nötig, um der Warteliste beizutreten.",
    },
    faq: {
      label: "05 / FAQ",
      headline: "Gute Fragen.",
      items: [
        {
          question: "Ist Fred eine echte Bank?",
          answer:
            "Fred basiert auf regulierter Banking-Infrastruktur. Das Geld deines Kindes ist bis zu 100.000 EUR durch Einlagensicherungssysteme geschützt — genau wie bei jedem deutschen Bankkonto.",
        },
        {
          question: "Für welches Alter ist Fred gedacht?",
          answer:
            "Für Kinder von 8 bis 18 Jahren. Schwierigkeitsgrad und Oberfläche passen sich mit dem Alter deines Kindes an — ein 9-jähriges Kind und ein 17-jähriger Teenager sehen eine komplett andere Erfahrung.",
        },
        {
          question: "Wie funktioniert das Freischalten durch Lektionen?",
          answer:
            "Eltern laden Geld auf das Konto. Kinder schauen ein kurzes Lernvideo und bestehen ein kurzes Quiz. Erst dann wird das Geld für ihre Debitkarte freigeschaltet. Nicht bestanden, nicht ausgeben — so einfach ist das.",
        },
        {
          question: "Was lehrt Fred?",
          answer:
            "Progressive Besteuerung, Zinseszins, Grundlagen des Aktienmarkts, Budgetierung und mehr. Alles ist auf den deutschen Finanzkontext aufgebaut — Steuerklassen, DAX, ETFs und Kindergeld.",
        },
        {
          question: "Wie viel kostet Fred?",
          answer:
            "2,99 EUR pro Monat für die ganze Familie. Ein Abo deckt alle Kinder im Haushalt ab. Keine versteckten Gebühren, jederzeit kündbar.",
        },
        {
          question: "Was ist, wenn mein Kind dringend Geld braucht und keine Zeit für eine Lektion hat?",
          answer:
            "In dringenden Fällen kann dein Kind einmal pro Woche die Funktion „Sofortfreigabe“ nutzen und sofort auf das Geld zugreifen – auch ohne vorher eine Lektion abzuschließen.\n\nDamit der Lerneffekt erhalten bleibt, muss anschließend eine zusätzliche Lektion abgeschlossen werden. Eltern können diese Funktion jederzeit in den Einstellungen steuern und anpassen.",
        },
      ],
    },
    waitlistCta: {
      headline: "Sei die erste Familie auf Fred.",
      subheadline:
        "Wir bauen Fred für Familien, die möchten, dass ihre Kinder finanziell selbstbewusst aufwachsen. Komm auf die Warteliste und präge das Produkt mit.",
      placeholder: "Deine E-Mail-Adresse",
      button: "Zur Warteliste →",
      finePrint: "Verfügbar auf Deutsch und Englisch",
    },
    footer: {
      left: "Fred · Wir bringen Kindern seit 2026 Geld bei",
      madeWith: "Gemacht mit",
      words: ["Koffein", "Deadlines", "Neugier", "Ctrl+Z", "Impostor-Syndrom"],
      location: "Mainz, DE · 49°N 8°E",
    },
  },
} as const;

const navLinks = [
  { label: "How it works", target: "#how-it-works" },
  { label: "For Parents", target: "#for-parents" },
  { label: "Pricing", target: "#pricing" },
] as const;

const revealProps = (delay = 0) => ({
  initial: { opacity: 0, y: 40, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, delay, ease },
  },
});

const AnimatedSwap = memo(function AnimatedSwap({
  value,
  as = "div",
  className,
}: {
  value: string;
  as?: ElementType;
  className?: string;
}) {
  const Tag = as;

  return (
    <div className={className}>
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.7, ease },
          }}
          exit={{
            opacity: 0,
            y: -40,
            filter: "blur(6px)",
            transition: { duration: 0.35, ease },
          }}
        >
          <Tag>{value}</Tag>
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

const AnimatedButtonLabel = memo(function AnimatedButtonLabel({ value }: { value: string }) {
  return (
    <span className="block overflow-hidden">
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={value}
          className="block"
          initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.7, ease },
          }}
          exit={{
            opacity: 0,
            y: -40,
            filter: "blur(6px)",
            transition: { duration: 0.35, ease },
          }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

const LanguageToggle = memo(function LanguageToggle({
  language,
  onChange,
}: {
  language: Language;
  onChange: (language: Language) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full bg-[#F5F5F7] px-1 py-1 text-[11px] font-medium text-[#6E6E73] sm:text-[12px]">
      {(["en", "de"] as const).map((item) => {
        const active = item === language;

        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={`rounded-full px-2 py-1 transition-all duration-200 sm:px-2.5 ${active ? "bg-white text-[#1D1D1F] shadow-sm" : "text-[#6E6E73] hover:text-[#1D1D1F]"
              }`}
            aria-pressed={active}
          >
            {item.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
});

function DeferredSectionsFallback() {
  return (
    <div aria-hidden="true">
      <section className="bg-white px-5 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="h-3 w-28 rounded-full bg-[#F5F5F7]" />
          <div className="mt-4 h-12 max-w-xl rounded-[28px] bg-[#F5F5F7]" />
          <div className="mt-5 h-24 max-w-3xl rounded-[28px] bg-[#F5F5F7]" />
        </div>
      </section>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState<Language>("en");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const scrolledRef = useRef(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const heroPhoneRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  const activeCopy = useMemo(() => copy[language], [language]);
  const deferredContent = useMemo(
    () => ({
      parentDashboard: activeCopy.parentDashboard,
      pricing: activeCopy.pricing,
      faq: activeCopy.faq,
      waitlistCta: activeCopy.waitlistCta,
      footer: activeCopy.footer,
    }),
    [activeCopy],
  );

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let frameId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(raf);
    };

    frameId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const nextScrolled = latest > 80;

    if (nextScrolled !== scrolledRef.current) {
      scrolledRef.current = nextScrolled;
      setScrolled(nextScrolled);
    }
  });

  useEffect(() => {
    setMenuOpen(false);
  }, [language]);

  const handleLanguageChange = useCallback((nextLanguage: Language) => {
    startTransition(() => {
      setLanguage(nextLanguage);
    });
  }, []);

  useGSAP(
    () => {
      const hero = heroRef.current;
      const heroContent = heroContentRef.current;
      const heroPhone = heroPhoneRef.current;
      const lenis = lenisRef.current;

      if (!hero || !heroContent || !heroPhone) {
        return;
      }

      if (prefersReducedMotion) {
        return;
      }

      // Lenis eases the page scroll, so we ping ScrollTrigger from the same scroll updates.
      const syncScrollTrigger = () => ScrollTrigger.update();
      lenis?.on("scroll", syncScrollTrigger);

      // Keep the hero layered: text drifts gently while the phone travels a bit further.
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      timeline.to(
        heroContent,
        {
          y: -52,
        },
        0,
      );

      timeline.to(heroPhone, { y: -96 }, 0);

      ScrollTrigger.refresh();

      return () => {
        lenis?.off("scroll", syncScrollTrigger);
      };
    },
    { scope: heroRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [language]);

  const scrollToTarget = useCallback((target: string) => {
    lenisRef.current?.scrollTo(target, { offset: -72 });
    setMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F]" style={{ fontFamily: fontStack }}>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-14 transition-all duration-[400ms] md:h-[52px] ${scrolled
          ? "border-b border-black/[0.06] bg-white/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
          }`}
      >
        <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between px-5 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => scrollToTarget("#hero")}
            className="text-[1.6rem] font-black tracking-[-0.04em] text-[#1D1D1F] sm:text-[2.1rem]"
          >
            Fred
          </button>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <nav className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => scrollToTarget(link.target)}
                  className="text-[13px] text-[#6E6E73] transition-colors duration-200 hover:text-[#1D1D1F]"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <LanguageToggle language={language} onChange={handleLanguageChange} />

            <WaitlistButton
              label={activeCopy.navCta}
              className="hidden rounded-full bg-[#0071E3] px-4 py-1.5 text-[13px] font-medium text-white transition-colors duration-200 hover:bg-[#0077ED] sm:inline-flex md:px-5"
            />

            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F7] text-[#1D1D1F] transition-colors duration-200 hover:bg-[#E8E8ED] md:hidden"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
            >
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={menuOpen ? "close" : "menu"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
                >
                  {menuOpen ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M4 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M4 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  )}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                transition: { duration: 0.35, ease },
              }}
              exit={{
                opacity: 0,
                y: -12,
                height: 0,
                transition: { duration: 0.25, ease },
              }}
              className="overflow-hidden border-b border-black/[0.06] bg-white/90 backdrop-blur-xl md:hidden"
            >
              <div className="mx-auto flex max-w-[1200px] flex-col gap-2.5 px-5 py-4 sm:px-6">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => scrollToTarget(link.target)}
                    className="rounded-[18px] bg-[#F5F5F7] px-4 py-3.5 text-left text-[14px] font-medium text-[#1D1D1F] transition-colors duration-200 hover:bg-[#E8E8ED]"
                  >
                    {link.label}
                  </button>
                ))}

                <WaitlistButton
                  label={activeCopy.navCta}
                  className="mt-1 inline-flex min-h-12 items-center justify-center rounded-full bg-[#0071E3] px-5 py-3 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#0077ED]"
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <main>
        <section
          id="hero"
          ref={heroRef}
          className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-white px-5 pb-16 pt-24 text-center sm:px-6 sm:pb-20 sm:pt-28"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
            <div ref={heroContentRef} className="flex flex-col items-center">
              <motion.div {...revealProps(0.15)} id="hero-copy" className="max-w-[19rem] sm:max-w-4xl">
                <AnimatedSwap
                  value={activeCopy.headline}
                  as="h1"
                  className="text-[clamp(2.8rem,11vw,6.5rem)] font-bold leading-[1.04] tracking-[-0.04em] text-[#1D1D1F] sm:tracking-[-0.03em]"
                />
              </motion.div>

              <motion.div {...revealProps(0.25)} className="mt-5 max-w-[22rem] sm:mt-6 sm:max-w-2xl" id="hero-context">
                <AnimatedSwap
                  value={activeCopy.subheadline}
                  as="p"
                  className="text-[17px] font-normal leading-relaxed text-[#6E6E73] sm:text-[19px]"
                />
              </motion.div>

              <motion.div
                {...revealProps(0.35)}
                className="mt-8 flex w-full max-w-sm flex-col items-center justify-center gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:gap-4"
              >
                <WaitlistButton
                  label={activeCopy.primaryCta}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#0071E3] px-8 py-3.5 text-[16px] font-medium text-white transition-all duration-200 hover:bg-[#0077ED] active:scale-[0.98] sm:w-auto sm:text-[17px]"
                />

                <button
                  type="button"
                  onClick={() => scrollToTarget("#how-it-works")}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#F5F5F7] px-8 py-3.5 text-[16px] font-medium text-[#1D1D1F] transition-all duration-200 hover:bg-[#E8E8ED] active:scale-[0.98] sm:w-auto sm:text-[17px]"
                >
                  <AnimatedButtonLabel value={activeCopy.secondaryCta} />
                </button>
              </motion.div>

              <motion.div {...revealProps(0.4)} id="hero-note" className="mt-4 max-w-[18rem] sm:max-w-none">
                <AnimatedSwap
                  value={activeCopy.finePrint}
                  as="p"
                  className="text-[12px] leading-relaxed text-[#6E6E73] sm:text-[13px]"
                />
              </motion.div>
            </div>

            <div ref={heroPhoneRef} className="relative mx-auto mt-14 w-full max-w-[250px] sm:mt-20 sm:max-w-[280px]">
              <motion.div
                initial={{ opacity: 0, x: 14, y: -8 }}
                animate={{ opacity: 1, x: 0, y: 0, transition: { duration: 0.65, delay: 0.95, ease } }}
                className="pointer-events-none absolute left-full top-4 z-20 ml-8 hidden lg:flex lg:flex-col lg:items-end xl:top-6 xl:ml-10"
              >
                <span className="whitespace-nowrap text-xs font-medium tracking-[0.01em] text-[#6E6E73]/90">
                  {activeCopy.phone.annotation}
                </span>
                <svg
                  className="-mt-1"
                  width="126"
                  height="68"
                  viewBox="0 0 126 68"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M114 13C94 13 76 17 60 28C44 39 28 49 15 55"
                    stroke="rgba(110,110,115,0.62)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M21 50L14 55L23 57"
                    stroke="rgba(110,110,115,0.62)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>

              <div className="pointer-events-none absolute inset-x-[-20%] top-[8%] h-[66%] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,200,120,0.22),rgba(247,220,118,0.16)_34%,rgba(255,255,255,0)_70%)] blur-[56px]" />
              <div className="pointer-events-none absolute inset-x-[8%] bottom-[-10%] h-20 rounded-full bg-[#1D1D1F]/[0.14] blur-[30px]" />
              <motion.div
                id="hero-phone"
                className="w-full"
                initial={{ opacity: 0, y: 60 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 1.2, delay: 0.5, ease },
                }}
              >
                <div className="rounded-[42px] border border-black/[0.12] bg-[linear-gradient(180deg,#24231F_0%,#171611_100%)] p-[11px] shadow-[0_58px_124px_rgba(0,0,0,0.24)] antialiased [text-rendering:optimizeLegibility] [-webkit-font-smoothing:antialiased] [-moz-osx-font-smoothing:grayscale]">
                  <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[31px] bg-[linear-gradient(180deg,#FBF8EC_0%,#FFFDF6_100%)]">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_50%_8%,rgba(255,233,162,0.96),rgba(221,237,187,0.74)_34%,rgba(251,248,236,0)_78%)]" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(36,72,31,0.26)_0%,rgba(76,120,56,0.18)_34%,rgba(255,255,255,0)_100%)]" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40 overflow-hidden">
                      <div className="absolute -left-12 -top-20 h-44 w-44 rotate-[-16deg] rounded-[42%_58%_44%_56%/62%_42%_58%_38%] bg-[#335A2F]/18 blur-[6px]" />
                      <div className="absolute left-[3.55rem] -top-16 h-36 w-28 rotate-[6deg] rounded-[44%_56%_48%_52%/64%_44%_56%_36%] bg-[#5C8747]/14 blur-[4px]" />
                      <div className="absolute right-[-1.7rem] -top-[4.8rem] h-44 w-40 rotate-[18deg] rounded-[44%_56%_50%_50%/66%_46%_54%_34%] bg-[#2D5C2A]/22 blur-[5px]" />
                    </div>

                    <div className="relative z-10 px-4 pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 rounded-full bg-white/58 px-2.5 py-1.5 shadow-[0_12px_24px_rgba(87,120,56,0.08)]">
                          <motion.div
                            className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-[#F5E6A4]/80"
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1, transition: { duration: 0.45, delay: 0.82, ease } }}
                          >
                            <img
                              src="/fred-avatar-1.png"
                              alt="Fred avatar"
                              className="h-full w-full object-cover object-center"
                            />
                          </motion.div>
                          <div className="text-left">
                            <div className="text-[11px] font-medium leading-none text-[#47633A]">{activeCopy.phone.greeting}</div>
                            <div className="mt-1 text-[11px] font-semibold leading-none text-[#1E4E2E]">
                              {activeCopy.phone.mode}
                            </div>
                          </div>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F4DA]/85 text-[#2E5B2E] shadow-[0_8px_18px_rgba(87,120,56,0.08)]">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                              d="M12 21C12 21 18 17.4 18 11V7.5L12 5L6 7.5V11C6 17.4 12 21 12 21Z"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="relative z-10 mx-3 mt-4 rounded-[30px] bg-[linear-gradient(145deg,#1E6A47_0%,#1D6B46_48%,#2F7E58_100%)] px-5 py-4 text-left shadow-[0_20px_38px_rgba(33,94,63,0.20)]">
                      <div className="pointer-events-none absolute inset-x-5 top-3 h-10 rounded-full bg-white/10 blur-md" />
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C8E6B7]">
                            {activeCopy.phone.bankLabel}
                          </div>
                          <motion.div
                            className="mt-2 text-[28px] font-bold leading-none tracking-tight text-white"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.92, ease } }}
                          >
                            €12.50
                          </motion.div>
                        </div>

                        <div className="inline-flex items-center rounded-full bg-[#88B987]/26 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90">
                          {activeCopy.phone.locked}
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[11px] font-medium text-[#EAF4D7]">
                          <span className="text-[14px]">🍌</span>
                          {`35 ${activeCopy.phone.bananasSaved}`}
                        </div>
                        <button
                          type="button"
                          className="rounded-full bg-[#FFD65C] px-4 py-2 text-[11px] font-semibold text-[#355327]"
                        >
                          {activeCopy.phone.details}
                        </button>
                      </div>
                    </div>

                    <div className="relative z-10 mx-3 mt-4 rounded-[32px] bg-[linear-gradient(180deg,#FFF8DD_0%,#FFFDF0_100%)] px-5 py-5 text-left shadow-[0_24px_42px_rgba(199,179,97,0.18)] ring-1 ring-[#F4E7B1]/70">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6C8A45]">
                            {activeCopy.phone.lessonLabel}
                          </div>
                          <div className="mt-2 text-[17px] font-semibold leading-tight text-[#1D1D1F]">
                            {activeCopy.phone.lessonTitle}
                          </div>
                        </div>
                        <motion.div
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDF2C6] text-[#3F6E30] shadow-[0_12px_20px_rgba(115,158,76,0.12)]"
                          animate={{ y: [0, -2, 0] }}
                          transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                              d="M4 6.5C4 5.67 4.67 5 5.5 5H11V19H5.5C4.67 19 4 18.33 4 17.5V6.5Z"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M20 6.5C20 5.67 19.33 5 18.5 5H13V19H18.5C19.33 19 20 18.33 20 17.5V6.5Z"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      </div>

                      <div className="mt-5 flex items-center justify-between text-[11px] font-medium text-[#567243]">
                        <span>{activeCopy.phone.progressLabel}</span>
                        <span>78%</span>
                      </div>
                      <div className="mt-2 h-3.5 rounded-full bg-[#ECE5C6]">
                        <motion.div
                          className="h-3.5 rounded-full bg-[linear-gradient(90deg,#1D7B56_0%,#4FA866_68%,#8BCE69_100%)]"
                          initial={{ width: 0 }}
                          animate={{ width: "78%", transition: { duration: 0.8, delay: 1, ease: "easeOut" } }}
                        />
                      </div>

                      <motion.button
                        type="button"
                        className="mt-5 w-full rounded-full bg-[#1F6E49] py-3.5 text-center text-[14px] font-semibold text-white shadow-[0_16px_30px_rgba(31,110,73,0.22)] transition-shadow duration-200 hover:shadow-[0_18px_32px_rgba(31,110,73,0.24)]"
                        animate={{
                          scale: [1, 1.02, 1],
                          boxShadow: [
                            "0 16px 30px rgba(31,110,73,0.22)",
                            "0 19px 34px rgba(31,110,73,0.26)",
                            "0 16px 30px rgba(31,110,73,0.22)",
                          ],
                        }}
                        transition={{
                          duration: 2.8,
                          delay: 1.15,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 1.3,
                          ease: "easeInOut",
                        }}
                      >
                        {activeCopy.phone.cta}
                      </motion.button>
                    </div>

                    <div className="mx-3 mt-4 grid grid-cols-[1.05fr_0.95fr] gap-3">
                      <div className="rounded-[26px] bg-[linear-gradient(180deg,#FFE08A_0%,#FFD965_100%)] px-4 py-4 text-left shadow-[0_16px_28px_rgba(245,198,74,0.14)]">
                        <motion.div
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF2BF] text-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                          initial={{ y: 0 }}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.5, delay: 1.05, ease: "easeOut" }}
                        >
                          ⭐
                        </motion.div>
                        <div className="mt-4 text-[15px] font-semibold text-[#55411C]">{activeCopy.phone.streakTitle}</div>
                        <div className="mt-1 text-[11px] font-medium text-[#775D22]">{activeCopy.phone.streakSubtitle}</div>
                      </div>

                      <div className="rounded-[26px] bg-[linear-gradient(180deg,#F6F1DF_0%,#F2EDDE_100%)] px-4 py-4 text-left shadow-[0_14px_24px_rgba(15,23,42,0.04)]">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#D8EDC6] text-[#2E8A54]">
                          <span className="text-[15px]">$</span>
                        </div>
                        <div className="mt-4 text-[14px] font-semibold text-[#3A4530]">{activeCopy.phone.rewards}</div>
                        <div className="mt-2 text-[11px] leading-relaxed text-[#6E6E73]">
                          {activeCopy.phone.nextReward}
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto px-3 pb-4 pt-4">
                      <div className="flex items-center justify-between rounded-[26px] bg-[#EAF7E6]/92 px-4 py-3 text-[#476B3D] shadow-[0_10px_22px_rgba(87,120,56,0.05)]">
                        <div className="flex flex-col items-center gap-1 text-[10px] font-semibold">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#147A58] text-white">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                d="M4 10.5L12 4L20 10.5V19A1 1 0 0 1 19 20H15V14H9V20H5A1 1 0 0 1 4 19V10.5Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          {activeCopy.phone.nav.home}
                        </div>
                        <div className="flex flex-col items-center gap-1 text-[10px] font-medium text-[#567A49]">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                d="M4 6.5C4 5.67 4.67 5 5.5 5H11V19H5.5C4.67 19 4 18.33 4 17.5V6.5Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M20 6.5C20 5.67 19.33 5 18.5 5H13V19H18.5C19.33 19 20 18.33 20 17.5V6.5Z"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          {activeCopy.phone.nav.lessons}
                        </div>
                        <div className="flex flex-col items-center gap-1 text-[10px] font-medium text-[#567A49]">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <path
                                d="M7 8H17M7 12H15M7 16H12"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                strokeLinecap="round"
                              />
                              <rect
                                x="4"
                                y="5"
                                width="16"
                                height="14"
                                rx="3"
                                stroke="currentColor"
                                strokeWidth="1.7"
                              />
                            </svg>
                          </div>
                          {activeCopy.phone.nav.bank}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 sm:bottom-8"
            initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.7, delay: 0.7, ease },
            }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 9L12 15L18 9"
                  stroke="#6E6E73"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        </section>

        <AgeEvolutionSection content={activeCopy.ageEvolution} />
        <HowItWorks content={activeCopy.howItWorks} />
        <LessonShowcase content={activeCopy.lessonShowcase} />
        <Suspense fallback={<DeferredSectionsFallback />}>
          <DeferredSections language={language} content={deferredContent} />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
