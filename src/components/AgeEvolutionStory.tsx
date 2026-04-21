import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMemo, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Stage = {
  label: string;
  ageRange: string;
  portraitSrc: string;
  wordmark?: string;
  wordmarkColor: string;
  labelColor: string;
  pillClassName: string;
  caption: string;
  topics: ReadonlyArray<string>;
  phone: {
    greeting: string;
    modeLabel: string;
    headerBadge: string;
    primaryEyebrow: string;
    primaryValue?: string;
    primaryTitle?: string;
    primaryMeta?: string;
    primaryBadge?: string;
    primaryCta?: string;
    lessonEyebrow: string;
    lessonTitle: string;
    progressLabel?: string;
    progressValue?: string;
    lessonCta?: string;
    rewardPrimaryLabel?: string;
    rewardPrimaryValue?: string;
    rewardSecondaryLabel?: string;
    rewardSecondaryValue?: string;
    milestoneLabels?: ReadonlyArray<string>;
    chartDays?: ReadonlyArray<string>;
    secondaryStats?: ReadonlyArray<{
      label: string;
      value: string;
    }>;
    nav: ReadonlyArray<string>;
  };
};

type AgeEvolutionContent = {
  eyebrow: string;
  headline: string;
  subheadline: string;
  learnHeading: string;
  learnFooter: string;
  stages: ReadonlyArray<Stage>;
};

type StoryTheme = {
  background: string;
  panel: string;
  accent: string;
  accentSoft: string;
  accentStrong: string;
  glow: string;
  textMuted: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

const stageThemes: readonly StoryTheme[] = [
  {
    background:
      "linear-gradient(180deg, rgba(232,243,216,0.95) 0%, rgba(251,247,233,0.98) 56%, rgba(255,255,255,1) 100%)",
    panel: "linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(248,250,242,0.94) 100%)",
    accent: "#2F7E58",
    accentSoft: "#DDEFC8",
    accentStrong: "#1E6A47",
    glow: "radial-gradient(circle at 68% 42%, rgba(130,191,110,0.18), rgba(255,224,137,0.12) 36%, rgba(255,255,255,0) 72%)",
    textMuted: "#5F6B54",
  },
  {
    background:
      "linear-gradient(180deg, rgba(239,234,216,0.94) 0%, rgba(248,244,232,0.98) 54%, rgba(255,255,255,1) 100%)",
    panel: "linear-gradient(180deg, rgba(255,252,246,0.82) 0%, rgba(248,244,232,0.94) 100%)",
    accent: "#7E6A35",
    accentSoft: "#EFE3B9",
    accentStrong: "#5F6B36",
    glow: "radial-gradient(circle at 68% 42%, rgba(176,156,94,0.16), rgba(255,229,164,0.10) 34%, rgba(255,255,255,0) 72%)",
    textMuted: "#6F6752",
  },
  {
    background:
      "linear-gradient(180deg, rgba(228,237,246,0.96) 0%, rgba(245,248,252,0.98) 56%, rgba(255,255,255,1) 100%)",
    panel: "linear-gradient(180deg, rgba(255,255,255,0.84) 0%, rgba(244,248,252,0.96) 100%)",
    accent: "#2F61A0",
    accentSoft: "#DDE8F8",
    accentStrong: "#204C7B",
    glow: "radial-gradient(circle at 68% 42%, rgba(98,146,214,0.16), rgba(170,214,234,0.10) 34%, rgba(255,255,255,0) 72%)",
    textMuted: "#5F6E83",
  },
  {
    background:
      "linear-gradient(180deg, rgba(19,28,44,1) 0%, rgba(27,37,58,0.98) 44%, rgba(234,239,246,1) 100%)",
    panel: "linear-gradient(180deg, rgba(24,31,46,0.84) 0%, rgba(37,46,67,0.90) 100%)",
    accent: "#B7C8F2",
    accentSoft: "#343E58",
    accentStrong: "#E7EEF9",
    glow: "radial-gradient(circle at 68% 42%, rgba(106,130,182,0.18), rgba(56,74,113,0.18) 36%, rgba(255,255,255,0) 74%)",
    textMuted: "#B9C3D7",
  },
] as const;

function StoryAvatar({
  src,
  alt,
  ringClassName,
  className = "h-14 w-14",
}: {
  src: string;
  alt: string;
  ringClassName: string;
  className?: string;
}) {
  return (
    <div className={`${className} overflow-hidden rounded-full ring-2 ${ringClassName} shadow-[0_10px_28px_rgba(15,23,42,0.10)]`}>
      <img src={src} alt={alt} className="h-full w-full object-cover object-center" />
    </div>
  );
}

function PhoneBadge({
  children,
  dark = false,
  className = "",
}: {
  children: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-semibold leading-none ${
        dark ? "bg-white/10 text-white/78 ring-1 ring-white/12" : "bg-white/88 text-[#40505C] ring-1 ring-black/[0.06]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function PhoneButton({
  children,
  tone,
}: {
  children: string;
  tone: "green" | "olive" | "blue" | "dark" | "sun";
}) {
  const toneClasses = {
    green:
      "bg-[linear-gradient(180deg,#228153_0%,#1A6C44_100%)] text-white shadow-[0_18px_32px_rgba(26,108,68,0.28)] ring-1 ring-[#2A8A5B]/25 hover:shadow-[0_20px_36px_rgba(26,108,68,0.32)] active:translate-y-px",
    olive:
      "bg-[linear-gradient(180deg,#6E7A3F_0%,#556031_100%)] text-white shadow-[0_18px_30px_rgba(85,96,49,0.26)] ring-1 ring-[#7D8B49]/22 hover:shadow-[0_20px_34px_rgba(85,96,49,0.30)] active:translate-y-px",
    blue:
      "bg-[linear-gradient(180deg,#3972B6_0%,#2A5C96_100%)] text-white shadow-[0_18px_30px_rgba(42,92,150,0.28)] ring-1 ring-[#4C83C1]/24 hover:shadow-[0_20px_34px_rgba(42,92,150,0.32)] active:translate-y-px",
    dark:
      "bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.10)_100%)] text-white shadow-[0_18px_30px_rgba(5,9,18,0.28)] ring-1 ring-white/12 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.12)_100%)] active:translate-y-px",
    sun:
      "bg-[linear-gradient(180deg,#FFE07A_0%,#F5CA47_100%)] text-[#274827] shadow-[0_18px_30px_rgba(245,202,71,0.28)] ring-1 ring-[#F2D66A]/35 hover:shadow-[0_20px_34px_rgba(245,202,71,0.32)] active:translate-y-px",
  } as const;

  return (
    <button
      type="button"
      className={`w-full rounded-full px-4 py-3.5 text-center text-[13px] font-bold leading-tight tracking-[-0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D1D1F]/10 ${toneClasses[tone]}`}
    >
      {children}
    </button>
  );
}

function PhoneHeader({
  stage,
  dark = false,
}: {
  stage: Stage & StoryTheme;
  dark?: boolean;
}) {
  const phone = stage.phone;

  return (
    <div
      className={`relative z-10 flex items-center justify-between gap-3 rounded-[24px] px-3 py-2.5 ${
        dark
          ? "bg-white/6 ring-1 ring-white/8 backdrop-blur-[2px]"
          : "bg-white/82 ring-1 ring-black/[0.05] shadow-[0_10px_24px_rgba(15,23,42,0.06)]"
      }`}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <StoryAvatar
          src={stage.portraitSrc}
          alt={`${stage.label} avatar`}
          ringClassName={dark ? "ring-white/10" : "ring-black/5"}
          className="h-10 w-10"
        />
        <div className="min-w-0 text-left">
          <div className={`truncate text-[10px] font-medium leading-none ${dark ? "text-white/62" : "text-[#5C6A75]"}`}>
            {phone.greeting}
          </div>
          <div className={`mt-1 truncate text-[13px] font-bold leading-none ${dark ? "text-white" : "text-[#17202A]"}`}>
            {phone.modeLabel}
          </div>
        </div>
      </div>
      <PhoneBadge dark={dark} className="shrink-0">
        {phone.headerBadge}
      </PhoneBadge>
    </div>
  );
}

function StatTile({
  label,
  value,
  tone = "light",
}: {
  label: string;
  value: string;
  tone?: "light" | "green" | "blue" | "dark";
}) {
  const toneClasses = {
    light: "bg-white/88 ring-1 ring-black/[0.05]",
    green: "bg-[#EEF4E3] ring-1 ring-[#D7E6C4]",
    blue: "bg-[#EDF3FB] ring-1 ring-[#D7E4F5]",
    dark: "bg-white/7 ring-1 ring-white/[0.06]",
  } as const;

  const labelTone = tone === "dark" ? "text-white/54" : "text-[#5E6973]";
  const valueTone = tone === "dark" ? "text-white" : "text-[#111827]";

  return (
    <div className={`min-w-0 rounded-[20px] px-3.5 py-3 ${toneClasses[tone]}`}>
      <div className={`text-[10px] font-medium leading-snug ${labelTone}`}>{label}</div>
      <div className={`mt-1.5 text-[17px] font-bold leading-tight tracking-[-0.01em] ${valueTone}`}>{value}</div>
    </div>
  );
}

function StageNav({
  items,
  accent,
  dark = false,
}: {
  items: ReadonlyArray<string>;
  accent: string;
  dark?: boolean;
}) {
  return (
    <div className={`mt-auto grid grid-cols-3 gap-2 px-1.5 pb-1 ${dark ? "pt-4" : "pt-5"}`}>
      {items.map((item, index) => {
        const active = index === 0;

        return (
          <div
            key={item}
            className={`flex min-h-[42px] min-w-0 items-center justify-center rounded-[18px] px-2.5 py-2.5 text-center text-[10px] font-semibold leading-[1.15] tracking-[-0.01em] ${
              dark
                ? active
                  ? "text-[#111827] shadow-[0_10px_22px_rgba(5,9,18,0.18)] ring-1 ring-white/20"
                  : "text-white/80 ring-1 ring-white/[0.07]"
                : active
                  ? "text-white shadow-[0_10px_20px_rgba(15,23,42,0.12)]"
                  : "text-[#42515D] ring-1 ring-black/[0.06]"
            }`}
            style={{
              backgroundColor:
                active
                  ? accent
                  : dark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.84)",
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}

function ExplorerPhone({ stage }: { stage: Stage & StoryTheme }) {
  const phone = stage.phone;

  return (
    <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#FBF8EC_0%,#FFFDF6_100%)] px-4 pb-1 pt-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_50%_8%,rgba(255,233,162,0.96),rgba(221,237,187,0.74)_34%,rgba(251,248,236,0)_78%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(33,65,28,0.30)_0%,rgba(65,102,49,0.18)_32%,rgba(255,255,255,0)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(29,63,26,0.26)_0%,rgba(29,63,26,0)_100%)]" />
      <div className="pointer-events-none absolute -left-14 -top-16 h-40 w-40 rounded-[42%_58%_44%_56%/62%_42%_58%_38%] bg-[#335A2F]/12 blur-[12px]" />
      <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-[44%_56%_50%_50%/66%_46%_54%_34%] bg-[#2D5C2A]/12 blur-[12px]" />

      <PhoneHeader stage={stage} />

      <div className="relative z-10 mt-4 rounded-[30px] bg-[linear-gradient(145deg,#1E6A47_0%,#1D6B46_48%,#2F7E58_100%)] px-4 py-4 text-left shadow-[0_18px_34px_rgba(33,94,63,0.18)] ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold leading-none text-[#E3F5D7]">{phone.primaryEyebrow}</div>
            <div className="mt-2 text-[30px] font-bold leading-none tracking-[-0.04em] text-white">{phone.primaryValue}</div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[#FFD65C] text-[18px] shadow-[0_12px_24px_rgba(255,214,92,0.18)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 13C7 9.7 9.7 7 13 7H17" stroke="#355327" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M9 16C9 12.7 11.7 10 15 10H18" stroke="#355327" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <PhoneBadge className="bg-[#E8F4D9] text-[#264B2D] ring-1 ring-[#D3E9C2]">{phone.primaryMeta ?? ""}</PhoneBadge>
          <PhoneBadge className="bg-[#FFF0B8] text-[#355327] ring-1 ring-[#F2DF95]">{phone.primaryBadge ?? ""}</PhoneBadge>
        </div>
        <div className="mt-4">
          <PhoneButton tone="sun">{phone.primaryCta ?? ""}</PhoneButton>
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[30px] bg-[linear-gradient(180deg,#FFF8DD_0%,#FFFDF0_100%)] px-4 py-4 text-left shadow-[0_22px_40px_rgba(199,179,97,0.16)] ring-1 ring-[#F4E7B1]/70">
        <div className="text-[10px] font-semibold leading-none text-[#5E7F39]">{phone.lessonEyebrow}</div>
        <div className="mt-2 text-[18px] font-bold leading-tight text-[#14181C]">{phone.lessonTitle}</div>
        <div className="mt-4 flex items-center justify-between gap-4 text-[11px] font-medium text-[#4C6A3D]">
          <span>{phone.progressLabel}</span>
          <span className="font-bold text-[#2E5830]">{phone.progressValue}</span>
        </div>
        <div className="mt-2 h-3.5 rounded-full bg-[#ECE5C6]">
          <div className="h-3.5 w-[78%] rounded-full bg-[linear-gradient(90deg,#1D7B56_0%,#4FA866_68%,#8BCE69_100%)]" />
        </div>
        <div className="mt-5">
          <PhoneButton tone="green">{phone.lessonCta ?? ""}</PhoneButton>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1.06fr_0.94fr] gap-3">
        <div className="rounded-[24px] bg-[linear-gradient(180deg,#FFE08A_0%,#FFD965_100%)] px-4 py-4 text-left shadow-[0_16px_28px_rgba(245,198,74,0.14)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[#FFF2BF] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 4L14.4 8.6L19.5 9.3L15.8 12.8L16.7 17.9L12 15.5L7.3 17.9L8.2 12.8L4.5 9.3L9.6 8.6L12 4Z" fill="#7D6117" />
            </svg>
          </div>
          <div className="mt-3 text-[14px] font-bold leading-tight text-[#4D3913]">{phone.rewardPrimaryLabel}</div>
          <div className="mt-1 text-[11px] font-medium leading-relaxed text-[#775D22]">{phone.rewardPrimaryValue}</div>
        </div>
        <div className="rounded-[24px] bg-[linear-gradient(180deg,#F7F2E5_0%,#F3EEDC_100%)] px-4 py-4 text-left shadow-[0_10px_20px_rgba(15,23,42,0.035)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[16px] bg-[#D8EDC6]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5C15.3 5 18 7.7 18 11C18 15.4 12 19 12 19C12 19 6 15.4 6 11C6 7.7 8.7 5 12 5Z" stroke="#2E8A54" strokeWidth="1.8" />
            </svg>
          </div>
          <div className="mt-3 text-[13px] font-bold leading-tight text-[#2F3B28]">{phone.rewardSecondaryLabel}</div>
          <div className="mt-1 text-[11px] leading-relaxed text-[#505A61]">{phone.rewardSecondaryValue}</div>
        </div>
      </div>

      <StageNav items={phone.nav} accent={stage.accentStrong} />
    </div>
  );
}

function AdventurerPhone({ stage }: { stage: Stage & StoryTheme }) {
  const phone = stage.phone;

  return (
    <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#FBF7EC_0%,#FFFDF7_100%)] px-4 pb-1 pt-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_50%_10%,rgba(240,218,156,0.88),rgba(223,210,161,0.46)_38%,rgba(255,255,255,0)_76%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(88,86,45,0.22)_0%,rgba(124,112,67,0.12)_42%,rgba(255,255,255,0)_100%)]" />
      <div className="pointer-events-none absolute -left-8 top-8 h-24 w-24 rounded-full bg-[#D8C089]/22 blur-2xl" />

      <PhoneHeader stage={stage} />

      <div className="relative z-10 mt-4 rounded-[30px] bg-[linear-gradient(145deg,#F8EACA_0%,#F5E1B1_52%,#E8D5A0_100%)] px-4 py-4 text-left shadow-[0_18px_34px_rgba(138,116,52,0.14)] ring-1 ring-white/30">
        <div className="text-[10px] font-semibold leading-none text-[#726432]">{phone.primaryEyebrow}</div>
        <div className="mt-2 text-[18px] font-bold leading-tight text-[#2E291A]">{phone.primaryTitle}</div>
        <div className="mt-4 flex items-start">
          {phone.milestoneLabels?.map((label, step) => (
            <div key={label} className="flex min-w-0 flex-1 items-start">
              <div className="flex min-w-0 flex-1 flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    step < 2 ? "bg-[#8AA55B]" : "bg-[#CDBA7B]"
                  } text-[11px] font-semibold text-white`}
                >
                  {step + 1}
                </div>
                <div className="mt-2 w-full text-center text-[10px] font-medium leading-tight text-[#65592F]">{label}</div>
              </div>
              {step < (phone.milestoneLabels?.length ?? 0) - 1 ? (
                <div className="flex flex-1 items-center px-2 pt-4">
                  <div className="h-1 w-full rounded-full bg-[#D5C081]" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[30px] bg-white/92 px-4 py-4 text-left shadow-[0_20px_34px_rgba(46,44,31,0.08)] ring-1 ring-black/[0.04]">
        <div className="text-[10px] font-semibold leading-none text-[#726432]">{phone.lessonEyebrow}</div>
        <div className="mt-2 text-[18px] font-bold leading-tight text-[#171A1E]">{phone.lessonTitle}</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {phone.secondaryStats?.map((stat, index) => (
            <StatTile key={stat.label} label={stat.label} value={stat.value} tone={index === 0 ? "light" : "green"} />
          ))}
        </div>
        <div className="mt-5">
          <PhoneButton tone="olive">{phone.lessonCta ?? ""}</PhoneButton>
        </div>
      </div>

      <div className="mt-4 rounded-[24px] bg-white/82 px-4 py-4 text-left shadow-[0_12px_24px_rgba(15,23,42,0.04)] ring-1 ring-black/[0.04]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold leading-none text-[#62656B]">{phone.rewardPrimaryLabel}</div>
            <div className="mt-2 text-[16px] font-bold leading-tight text-[#2E291A]">{phone.rewardPrimaryValue}</div>
          </div>
          <PhoneBadge className="bg-[#F3E3B3] text-[#6A5A25] ring-0">{phone.rewardSecondaryValue ?? ""}</PhoneBadge>
        </div>
      </div>

      <StageNav items={phone.nav} accent={stage.accentStrong} />
    </div>
  );
}

function NavigatorPhone({ stage }: { stage: Stage & StoryTheme }) {
  const phone = stage.phone;

  return (
    <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#F4F8FC_0%,#FFFFFF_100%)] px-4 pb-1 pt-4">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgba(90,127,178,0.42)_0%,rgba(170,205,230,0.20)_44%,rgba(255,255,255,0)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[47%] h-16 bg-[linear-gradient(180deg,rgba(110,147,184,0)_0%,rgba(110,147,184,0.16)_100%)]" />

      <PhoneHeader stage={stage} />

      <div className="relative z-10 mt-4 rounded-[30px] bg-white/90 px-4 py-4 text-left shadow-[0_18px_34px_rgba(47,97,160,0.10)] ring-1 ring-[#E3ECF8]">
        <div className="text-[10px] font-semibold leading-none text-[#4B6889]">{phone.primaryEyebrow}</div>
        <div className="mt-3 grid grid-cols-5 items-end gap-2">
          {[34, 52, 76, 60, 84].map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-full rounded-full bg-[#DDE8F8]" style={{ height: `${value}px` }}>
                <div
                  className="w-full rounded-full bg-[linear-gradient(180deg,#4F84C3_0%,#7AB5D7_100%)]"
                  style={{ height: `${Math.max(18, value - 10)}px` }}
                />
              </div>
              <div className="text-[9px] font-medium text-[#5F6E83]">{phone.chartDays?.[index]}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {phone.secondaryStats?.map((stat, index) => (
            <PhoneBadge key={stat.label} className={index === 0 ? "justify-between bg-[#EDF3FB] text-[#3F5E86] ring-0" : "justify-between bg-white text-[#5A6B7B]"}>
              {`${stat.label} · ${stat.value}`}
            </PhoneBadge>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[30px] bg-[linear-gradient(180deg,#EFF5FD_0%,#FFFFFF_100%)] px-4 py-4 text-left shadow-[0_20px_34px_rgba(58,98,146,0.10)] ring-1 ring-[#E6EEF8]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold leading-none text-[#53749B]">{phone.lessonEyebrow}</div>
            <div className="mt-2 text-[18px] font-bold leading-tight text-[#111827]">{phone.lessonTitle}</div>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] bg-[#DDE8F8] text-[#2F61A0]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M7 6.5H18V17.5H7C5.9 17.5 5 16.6 5 15.5V8.5C5 7.4 5.9 6.5 7 6.5Z" stroke="currentColor" strokeWidth="1.8" />
              <path d="M9 9.5H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-[#5F6E83]">
          <span>{phone.progressLabel}</span>
          <span className="font-bold text-[#244E81]">{phone.progressValue}</span>
        </div>
        <div className="mt-2 h-3 rounded-full bg-[#E5ECF5]">
          <div className="h-3 w-[84%] rounded-full bg-[linear-gradient(90deg,#2F61A0_0%,#78A9D5_100%)]" />
        </div>
        <div className="mt-5">
          <PhoneButton tone="blue">{phone.lessonCta ?? ""}</PhoneButton>
        </div>
      </div>

      <StageNav items={phone.nav} accent={stage.accentStrong} />
    </div>
  );
}

function IndependencePhone({ stage }: { stage: Stage & StoryTheme }) {
  const phone = stage.phone;

  return (
    <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#0F1624_0%,#131C2B_100%)] px-4 pb-1 pt-4 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(117,143,196,0.28),rgba(24,34,52,0)_68%)]" />

      <PhoneHeader stage={stage} dark />

      <div className="relative z-10 mt-4 rounded-[30px] bg-[linear-gradient(180deg,rgba(39,51,77,0.94)_0%,rgba(25,34,52,0.94)_100%)] px-4 py-4 shadow-[0_22px_42px_rgba(5,9,18,0.28)] ring-1 ring-white/[0.06]">
        <div className="text-[10px] font-semibold leading-none text-white/52">{phone.primaryEyebrow}</div>
        <div className="mt-2 text-[28px] font-bold leading-none tracking-tight text-white">{phone.primaryValue}</div>
        <div className="mt-5 h-20 rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] p-3">
          <svg viewBox="0 0 160 54" className="h-full w-full" fill="none" aria-hidden="true">
            <path d="M0 44C22 44 20 24 43 24C65 24 68 38 89 38C110 38 116 10 136 10C148 10 154 18 160 22" stroke="#B7C8F2" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[30px] bg-[linear-gradient(180deg,rgba(37,47,69,0.92)_0%,rgba(24,31,46,0.96)_100%)] px-4 py-4 shadow-[0_20px_34px_rgba(5,9,18,0.22)] ring-1 ring-white/[0.06]">
        <div className="text-[10px] font-semibold leading-none text-white/54">{phone.lessonEyebrow}</div>
        <div className="mt-2 text-[18px] font-bold leading-tight text-white">{phone.lessonTitle}</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {phone.secondaryStats?.map((stat) => (
            <StatTile key={stat.label} label={stat.label} value={stat.value} tone="dark" />
          ))}
        </div>
      </div>

      <StageNav items={phone.nav} accent={stage.accentStrong} dark />
    </div>
  );
}

function StoryPhone({ stage, index }: { stage: Stage & StoryTheme; index: number }) {
  const sharedShell =
    "mx-auto w-full max-w-[280px] rounded-[42px] border border-black/[0.12] bg-[linear-gradient(180deg,#24231F_0%,#171611_100%)] p-[11px] shadow-[0_56px_112px_rgba(0,0,0,0.20)]";

  return (
    <div className={sharedShell}>
      {index === 0 ? <ExplorerPhone stage={stage} /> : null}
      {index === 1 ? <AdventurerPhone stage={stage} /> : null}
      {index === 2 ? <NavigatorPhone stage={stage} /> : null}
      {index === 3 ? <IndependencePhone stage={stage} /> : null}
    </div>
  );
}

function TopicBlock({
  heading,
  footer,
  topics,
  accent,
  dark = false,
}: {
  heading: string;
  footer: string;
  topics: ReadonlyArray<string>;
  accent: string;
  dark?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease } }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.28, ease } }}
      className={`w-[14.5rem] rounded-[24px] px-4 py-3.5 ${
        dark
          ? "bg-white/6 ring-1 ring-white/8 backdrop-blur-[4px]"
          : "bg-white/52 ring-1 ring-black/[0.04] backdrop-blur-[6px]"
      }`}
    >
      <div
        className={`text-[10px] font-medium uppercase tracking-[0.16em] ${dark ? "text-white/54" : "text-[#6E6E73]"}`}
        style={!dark ? { color: `${accent}B5` } : undefined}
      >
        {heading}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2">
        {topics.map((topic, index) => (
          <motion.div
            key={topic}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.32, delay: 0.05 + index * 0.04, ease } }}
            exit={{ opacity: 0, y: -6, transition: { duration: 0.18, ease } }}
            className={`flex items-start gap-2.5 text-[12px] leading-[1.5] ${dark ? "text-white/80" : "text-[#2F3742]"}`}
          >
            <span
              className={`mt-[0.38rem] h-1.5 w-1.5 flex-none rounded-full ${dark ? "ring-1 ring-white/12" : "ring-1 ring-black/5"}`}
              style={{ backgroundColor: dark ? "rgba(255,255,255,0.34)" : accent }}
            />
            <span>{topic}</span>
          </motion.div>
        ))}
      </div>
      <div className={`mt-3 text-right text-[11px] font-medium italic ${dark ? "text-white/46" : "text-[#6E6E73]/85"}`}>
        {footer}
      </div>
    </motion.div>
  );
}

function SectionIntro({ content }: { content: AgeEvolutionContent }) {
  return (
    <div className="relative mx-auto max-w-4xl px-5 pb-6 pt-20 text-center sm:px-6 sm:pb-8 sm:pt-24 lg:pb-10 lg:pt-28">
      <div className="pointer-events-none absolute inset-x-[18%] top-0 h-32 rounded-full bg-[radial-gradient(circle_at_center,rgba(196,215,240,0.12),rgba(255,255,255,0)_72%)] blur-[44px]" />
      <div className="relative">
        <div className="inline-flex items-center rounded-full border border-black/[0.06] bg-white/72 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6E6E73] backdrop-blur-[6px]">
          {content.eyebrow}
        </div>
        <h2 className="mx-auto mt-6 max-w-[12ch] text-[clamp(2.5rem,6vw,4.6rem)] font-bold leading-[1.02] tracking-[-0.05em] text-[#1D1D1F]">
          {content.headline}
        </h2>
        <p className="mx-auto mt-5 max-w-[38rem] text-[16px] leading-relaxed text-[#6E6E73] sm:text-[18px]">
          {content.subheadline}
        </p>
      </div>
    </div>
  );
}

function DesktopStory({
  stages,
  activeStage,
  learnHeading,
  learnFooter,
}: {
  stages: ReadonlyArray<Stage & StoryTheme>;
  activeStage: number;
  learnHeading: string;
  learnFooter: string;
}) {
  const active = stages[activeStage];

  return (
    <div className="relative hidden h-screen overflow-hidden lg:block">
      <div className="relative flex h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          {stages.map((stage, index) => (
            <div
              key={`${stage.label}-background`}
              className={`absolute inset-0 transition-opacity duration-700 ${index === activeStage ? "opacity-100" : "opacity-0"}`}
              style={{ background: stage.background }}
            />
          ))}
        </div>

        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] items-center gap-16 px-6">
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active.label}-${active.ageRange}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease } }}
                exit={{ opacity: 0, y: -18, transition: { duration: 0.28, ease } }}
              >
                <div className="text-[13px] font-medium uppercase tracking-[0.24em]" style={{ color: active.textMuted }}>
                  {`0${activeStage + 1} / 04`}
                </div>
                <h2 className={`mt-4 max-w-[12ch] text-[clamp(2.8rem,5.6vw,5rem)] font-bold leading-[0.98] tracking-[-0.05em] ${activeStage === 3 ? "text-white" : "text-[#1D1D1F]"}`}>
                  {active.label}
                </h2>
                <div className="mt-5 inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium uppercase tracking-[0.16em] shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <span className={active.pillClassName}>{active.ageRange}</span>
                </div>
                <p className={`mt-6 max-w-[28rem] text-[20px] leading-relaxed ${activeStage === 3 ? "text-white/72" : "text-[#6E6E73]"}`}>
                  {active.caption}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex items-center gap-3">
              {stages.map((stage, index) => (
                <div key={`${stage.label}-progress`} className="flex items-center gap-3">
                  <div
                    className={`h-[3px] rounded-full transition-all duration-500 ${index === activeStage ? "w-12" : "w-7"}`}
                    style={{
                      backgroundColor:
                        index === activeStage
                          ? stage.accent
                          : activeStage === 3
                            ? "rgba(255,255,255,0.2)"
                            : "rgba(29,29,31,0.12)",
                    }}
                  />
                  {index < stages.length - 1 ? (
                    <div className={`h-px w-4 ${activeStage === 3 ? "bg-white/14" : "bg-black/[0.06]"}`} />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-0 rounded-[44px] blur-[60px]" style={{ background: active.glow }} />
            <div className="pointer-events-none absolute left-1/2 top-[17%] h-[56%] w-[72%] -translate-x-1/2 rounded-full bg-black/10 blur-[44px]" />

            <AnimatePresence mode="wait">
              <motion.div
                key={`${active.label}-${active.ageRange}-phone`}
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease } }}
                exit={{ opacity: 0, y: -18, scale: 0.985, transition: { duration: 0.28, ease } }}
                className="relative"
              >
                <div className="absolute -right-[6.75rem] top-[19%] z-20 xl:-right-[8rem] xl:top-[20%]">
                  <div className="flex flex-col items-center gap-3">
                    <div className={`rounded-full px-4 py-3 shadow-[0_22px_40px_rgba(15,23,42,0.12)] ${activeStage === 3 ? "bg-white/8 ring-1 ring-white/10" : "bg-white/72"}`}>
                      <StoryAvatar
                        src={active.portraitSrc}
                        alt={`${active.label} portrait`}
                        ringClassName={activeStage === 3 ? "ring-white/10" : "ring-black/5"}
                        className="h-[5.75rem] w-[5.75rem]"
                      />
                    </div>
                    <TopicBlock
                      heading={learnHeading}
                      footer={learnFooter}
                      topics={active.topics}
                      accent={active.accent}
                      dark={activeStage === 3}
                    />
                  </div>
                </div>
                <StoryPhone stage={active} index={activeStage} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileStory({ stages, content }: { stages: ReadonlyArray<Stage & StoryTheme>; content: AgeEvolutionContent }) {
  return (
    <div className="lg:hidden">
      <div className="mx-auto max-w-6xl px-5 pb-18 pt-10 sm:px-6 sm:pb-20 sm:pt-12">
        <div className="space-y-5">
          {stages.map((stage, index) => (
            <motion.article
              key={`${stage.label}-${stage.ageRange}-mobile`}
              initial={{ opacity: 0, y: 28, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, delay: index * 0.06, ease } }}
              viewport={{ once: true, amount: 0.3 }}
              className="overflow-hidden rounded-[34px] border border-black/[0.06] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.05)]"
            >
              <div className="px-5 pb-5 pt-6" style={{ background: stage.panel }}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#6E6E73]">{`0${index + 1} / 04`}</div>
                    <div className="mt-2 text-[25px] font-bold tracking-[-0.04em]" style={{ color: stage.wordmarkColor }}>
                      {stage.label}
                    </div>
                    <div className={`mt-3 inline-flex rounded-full px-4 py-2 text-[12px] font-medium uppercase tracking-[0.16em] ${stage.pillClassName}`}>
                      {stage.ageRange}
                    </div>
                  </div>
                  <StoryAvatar src={stage.portraitSrc} alt={`${stage.label} portrait`} ringClassName="ring-black/5" />
                </div>

                <p className="mt-5 max-w-[30ch] text-[15px] leading-relaxed text-[#6E6E73]">{stage.caption}</p>

                <div className="mt-6">
                  <div className="mx-auto max-w-[240px]">
                    <StoryPhone stage={stage} index={index} />
                  </div>
                </div>

                <div className="mt-5 flex justify-center">
                  <TopicBlock
                    heading={content.learnHeading}
                    footer={content.learnFooter}
                    topics={stage.topics}
                    accent={stage.accent}
                    dark={false}
                  />
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AgeEvolutionStory({ content }: { content: AgeEvolutionContent }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const desktopStoryRef = useRef<HTMLDivElement | null>(null);
  const activeStageRef = useRef(0);
  const [activeStage, setActiveStage] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const stages = useMemo(
    () =>
      content.stages.slice(0, 4).map((stage, index) => ({
        ...stage,
        ...stageThemes[index],
      })),
    [content],
  );

  useGSAP(
    () => {
      if (prefersReducedMotion || !sectionRef.current || !desktopStoryRef.current || stages.length === 0) {
        return undefined;
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: desktopStoryRef.current,
          start: "top top",
          end: "+=300%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const nextStage = Math.min(stages.length - 1, Math.floor(self.progress * stages.length));

            if (nextStage !== activeStageRef.current) {
              activeStageRef.current = nextStage;
              setActiveStage(nextStage);
            }
          },
        });

        return () => {
          trigger.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion, stages.length] },
  );

  return (
    <section ref={sectionRef} className="relative bg-white">
      <SectionIntro content={content} />
      <div ref={desktopStoryRef}>
        <DesktopStory
          stages={stages}
          activeStage={activeStage}
          learnHeading={content.learnHeading}
          learnFooter={content.learnFooter}
        />
      </div>
      <MobileStory stages={stages} content={content} />
    </section>
  );
}
