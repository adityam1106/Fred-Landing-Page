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
      "Fred gives children aged 8–18 a real debit card, pocket money management, and weekly financial lessons — unlocking their money only after they learn something new.",
    finePrint: "No credit card required · Launching in Germany first",
    navCta: "Get early access",
    primaryCta: "Join the waitlist",
    secondaryCta: "Learn more ↓",
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
        "Track spending, lessons, and progress from one calm dashboard.",
        "Set rules that unlock money only after learning happens.",
        "Spot patterns early with real-time visibility and monthly summaries.",
        "Give independence gradually while staying fully informed.",
      ],
      cta: "Join the waitlist",
      dashboard: {
        childName: "Felix Schneider",
        childMeta: "Age 11 · Mainz",
        statusLabel: "All systems healthy",
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
            "Fred is built on top of regulated banking infrastructure. Your child's money is protected up to €100,000 by deposit guarantee schemes — the same protection as any German bank account.",
        },
        {
          question: "What age is Fred for?",
          answer:
            "Children aged 8 to 18. The app difficulty and UI adapt as your child grows — a 9 year old and a 17 year old see a completely different experience.",
        },
        {
          question: "How does the lesson unlock work?",
          answer:
            "Parents load money into the account. Kids watch a short educational video and pass a quick quiz. Once they pass, the money unlocks to their debit card. No pass, no spend — simple as that.",
        },
        {
          question: "What does Fred teach?",
          answer:
            "Progressive taxation, compound interest, stock market basics, budgeting, and more. Everything is built around the German financial context — tax brackets, DAX, ETFs, and Kindergeld.",
        },
        {
          question: "How much does it cost?",
          answer:
            "€2.99 per month per family. One subscription covers all children in the household. No hidden fees, cancel anytime.",
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
      "Fred gibt Kindern von 8–18 Jahren eine echte Debitkarte, Taschengeldverwaltung und wöchentliche Finanzlektionen — das Geld wird erst freigeschaltet, wenn sie etwas Neues gelernt haben.",
    finePrint: "Keine Kreditkarte erforderlich · Zuerst in Deutschland verfügbar",
    navCta: "Früher Zugang",
    primaryCta: "Zur Warteliste",
    secondaryCta: "Mehr erfahren ↓",
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
  const { scrollY, scrollYProgress } = useScroll();
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
          force3D: true,
        },
        0,
      );

      timeline.to(
        heroPhone,
        {
          y: -104,
          scale: 0.945,
          rotation: -1.4,
          transformOrigin: "50% 18%",
          force3D: true,
        },
        0,
      );

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
      <motion.div
        className="fixed left-0 top-0 z-[100] h-[2px] w-full origin-left bg-[#0071E3]"
        style={{ scaleX: scrollYProgress }}
      />

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
            className="text-[1.45rem] font-extrabold tracking-tight text-[#1D1D1F] sm:text-2xl"
          >
            fred
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
            <div ref={heroContentRef} className="flex flex-col items-center will-change-transform">
              <motion.div {...revealProps(0)}>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F5F5F7] px-3.5 py-1.5 text-[12px] font-medium text-[#6E6E73] sm:px-4 sm:text-[13px]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34C759] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34C759]" />
                  </span>
                  <AnimatedSwap value={activeCopy.badge} as="span" />
                </div>
              </motion.div>

              <motion.div {...revealProps(0.15)} id="hero-copy" className="mt-7 max-w-[19rem] sm:mt-8 sm:max-w-4xl">
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

            <div ref={heroPhoneRef} className="mx-auto mt-14 w-full max-w-[250px] will-change-transform sm:mt-20 sm:max-w-[280px]">
              <motion.div
                id="hero-phone"
                className="w-full"
                initial={{ opacity: 0, y: 60, scale: 0.95, filter: "blur(6px)" }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: { duration: 1.2, delay: 0.5, ease },
                }}
              >
                <div className="rounded-[40px] bg-[#1D1D1F] p-3 shadow-[0_40px_80px_rgba(0,0,0,0.15)]">
                  <div className="flex aspect-[9/19.5] flex-col overflow-hidden rounded-[32px] bg-white">
                    <div className="flex items-center justify-between px-4 pt-3">
                      <span className="text-[11px] font-bold text-[#1D1D1F]">fred</span>
                      <div className="flex items-center gap-1.5">
                        <div className="h-[8px] w-[8px] rounded-full border border-[#1D1D1F]/60" />
                        <div className="h-[8px] w-[12px] rounded-[3px] border border-[#1D1D1F]/60 p-[1px]">
                          <div className="h-full w-[70%] rounded-[2px] bg-[#1D1D1F]" />
                        </div>
                      </div>
                    </div>

                    <div className="mx-3 mt-2 rounded-xl bg-[#34C759]/10 px-4 py-2.5 text-[13px] font-medium text-[#1D1D1F]">
                      🔓 Balance unlocked · €12.50
                    </div>

                    <div className="mx-3 mt-3 rounded-2xl bg-[#F5F5F7] p-4 text-left">
                      <div className="text-[14px] font-semibold text-[#1D1D1F]">What is a tax?</div>
                      <div className="mt-1 text-[11px] text-[#6E6E73]">Lesson 01 · 3 min</div>
                      <div className="mt-3 h-1.5 rounded-full bg-[#E5E5EA]">
                        <div className="h-1.5 w-3/5 rounded-full bg-[#0071E3]" />
                      </div>
                      <button
                        type="button"
                        className="mt-3 w-full rounded-full bg-[#0071E3] py-2 text-center text-[12px] font-medium text-white transition-colors duration-200 hover:bg-[#0077ED]"
                      >
                        Watch lesson →
                      </button>
                    </div>

                    <div className="mx-3 mt-3 flex gap-2">
                      <div className="rounded-full bg-[#F5F5F7] px-3 py-1.5 text-[11px] text-[#6E6E73]">
                        €34.50 total
                      </div>
                      <div className="rounded-full bg-[#F5F5F7] px-3 py-1.5 text-[11px] text-[#6E6E73]">
                        3 lessons done
                      </div>
                    </div>

                    <div className="mt-4 px-4 text-left">
                      <div className="text-[10px] font-medium text-[#6E6E73]">Recent activity</div>
                      <div className="mt-2 flex items-center justify-between py-2">
                        <div className="text-[11px] text-[#1D1D1F]">🛒 Supermarket</div>
                        <div className="text-[11px] font-medium text-[#1D1D1F]">-€4.20</div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="text-[11px] text-[#1D1D1F]">🎮 App Store</div>
                        <div className="text-[11px] font-medium text-[#1D1D1F]">-€1.99</div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div className="text-[11px] text-[#1D1D1F]">💰 Pocket money</div>
                        <div className="text-[11px] font-medium text-[#34C759]">+€10.00</div>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-center gap-8 px-6 pb-6 pt-4 text-[#6E6E73]">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M4 10.5L12 4L20 10.5V19A1 1 0 0 1 19 20H15V14H9V20H5A1 1 0 0 1 4 19V10.5Z"
                          stroke="#0071E3"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect
                          x="4"
                          y="6"
                          width="16"
                          height="12"
                          rx="2.5"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <path d="M4 10H20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                      </svg>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 8.75A3.25 3.25 0 1 0 12 15.25A3.25 3.25 0 1 0 12 8.75Z"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        />
                        <path
                          d="M19 12A7 7 0 0 0 18.92 10.95L21 9.3L18.7 5.3L16.2 6.1A7 7 0 0 0 14.35 5.05L14 2.5H10L9.65 5.05A7 7 0 0 0 7.8 6.1L5.3 5.3L3 9.3L5.08 10.95A7 7 0 0 0 5 12C5 12.36 5.03 12.7 5.08 13.05L3 14.7L5.3 18.7L7.8 17.9A7 7 0 0 0 9.65 18.95L10 21.5H14L14.35 18.95A7 7 0 0 0 16.2 17.9L18.7 18.7L21 14.7L18.92 13.05C18.97 12.7 19 12.36 19 12Z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
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
