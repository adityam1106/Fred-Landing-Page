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
};

type AgeEvolutionContent = {
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

function ExplorerPhone({ stage }: { stage: Stage & StoryTheme }) {
  return (
    <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#FBF8EC_0%,#FFFDF6_100%)] px-3.5 pt-3.5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_50%_8%,rgba(255,233,162,0.96),rgba(221,237,187,0.74)_34%,rgba(251,248,236,0)_78%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(33,65,28,0.30)_0%,rgba(65,102,49,0.18)_32%,rgba(255,255,255,0)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(29,63,26,0.26)_0%,rgba(29,63,26,0)_100%)]" />
      <div className="pointer-events-none absolute -left-14 -top-16 h-40 w-40 rounded-[42%_58%_44%_56%/62%_42%_58%_38%] bg-[#335A2F]/14 blur-[10px]" />
      <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-[44%_56%_50%_50%/66%_46%_54%_34%] bg-[#2D5C2A]/14 blur-[10px]" />

      <div className="relative z-10 flex items-center justify-between rounded-full bg-white/58 px-2.5 py-1.5 shadow-[0_10px_22px_rgba(87,120,56,0.08)]">
        <div className="flex items-center gap-2.5">
          <StoryAvatar src={stage.portraitSrc} alt={`${stage.label} avatar`} ringClassName="ring-[#F5E6A4]/80" />
          <div className="text-left">
            <div className="text-[11px] font-medium leading-none text-[#47633A]">Hi, Mila!</div>
            <div className="mt-1 text-[12px] font-semibold leading-none text-[#1E4E2E]">{stage.wordmark ?? "Fred"}</div>
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F4DA]/88 text-[#2E5B2E] shadow-[0_8px_18px_rgba(87,120,56,0.08)]">
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

      <div className="relative z-10 mt-4 rounded-[30px] bg-[linear-gradient(145deg,#1E6A47_0%,#1D6B46_48%,#2F7E58_100%)] px-5 py-4 text-left shadow-[0_18px_34px_rgba(33,94,63,0.18)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C8E6B7]">My Jungle Bank</div>
        <div className="mt-2 text-[28px] font-bold leading-none tracking-tight text-white">€12.50</div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-[11px] font-medium text-[#EAF4D7]">
            <span className="text-[14px]">🍌</span>
            35 bananas saved
          </div>
          <div className="rounded-full bg-[#88B987]/26 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/90">
            Locked
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[32px] bg-[linear-gradient(180deg,#FFF8DD_0%,#FFFDF0_100%)] px-5 py-5 text-left shadow-[0_22px_40px_rgba(199,179,97,0.16)] ring-1 ring-[#F4E7B1]/70">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6C8A45]">Level 4 • Expedition</div>
        <div className="mt-2 text-[17px] font-semibold leading-tight text-[#1D1D1F]">Saving Goals</div>
        <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-[#567243]">
          <span>Expedition progress</span>
          <span>78%</span>
        </div>
        <div className="mt-2 h-3.5 rounded-full bg-[#ECE5C6]">
          <div className="h-3.5 w-[78%] rounded-full bg-[linear-gradient(90deg,#1D7B56_0%,#4FA866_68%,#8BCE69_100%)]" />
        </div>
        <div className="mt-5 rounded-full bg-[#1F6E49] py-3.5 text-center text-[14px] font-semibold text-white shadow-[0_16px_30px_rgba(31,110,73,0.22)]">
          Continue lesson
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1.05fr_0.95fr] gap-3">
        <div className="rounded-[26px] bg-[linear-gradient(180deg,#FFE08A_0%,#FFD965_100%)] px-4 py-4 text-left shadow-[0_16px_28px_rgba(245,198,74,0.14)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF2BF] text-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">⭐</div>
          <div className="mt-4 text-[15px] font-semibold text-[#55411C]">7 day streak</div>
          <div className="mt-1 text-[11px] font-medium text-[#775D22]">Super Explorer!</div>
        </div>
        <div className="rounded-[26px] bg-[linear-gradient(180deg,#F6F1DF_0%,#F2EDDE_100%)] px-4 py-4 text-left shadow-[0_10px_20px_rgba(15,23,42,0.035)]">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#D8EDC6] text-[#2E8A54]">$</div>
          <div className="mt-4 text-[14px] font-semibold text-[#3A4530]">Rewards</div>
          <div className="mt-2 text-[11px] leading-relaxed text-[#6E6E73]">Next: Golden Banana</div>
        </div>
      </div>
    </div>
  );
}

function AdventurerPhone({ stage }: { stage: Stage & StoryTheme }) {
  return (
    <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#FBF7EC_0%,#FFFDF7_100%)] px-3.5 pt-3.5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_50%_10%,rgba(240,218,156,0.88),rgba(223,210,161,0.46)_38%,rgba(255,255,255,0)_76%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(88,86,45,0.22)_0%,rgba(124,112,67,0.12)_42%,rgba(255,255,255,0)_100%)]" />
      <div className="pointer-events-none absolute -left-8 top-8 h-24 w-24 rounded-full bg-[#D8C089]/22 blur-2xl" />

      <div className="relative z-10 flex items-center justify-between rounded-full bg-white/70 px-2.5 py-1.5 shadow-[0_10px_24px_rgba(114,101,55,0.08)]">
        <div className="flex items-center gap-2.5">
          <StoryAvatar src={stage.portraitSrc} alt={`${stage.label} avatar`} ringClassName="ring-[#EAD9A9]" />
          <div className="text-left">
            <div className="text-[11px] font-medium leading-none text-[#645934]">Hi, Mila!</div>
            <div className="mt-1 text-[12px] font-semibold leading-none text-[#514824]">Adventure mode</div>
          </div>
        </div>
        <div className="rounded-full bg-[#EFE3B9] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7B6B36]">
          Trail active
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[30px] bg-[linear-gradient(145deg,#F8EACA_0%,#F5E1B1_52%,#E8D5A0_100%)] px-5 py-4 text-left shadow-[0_18px_34px_rgba(138,116,52,0.14)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7A6C39]">Explorer trail</div>
        <div className="mt-2 text-[18px] font-semibold leading-tight text-[#3A3320]">Milestones unlocked</div>
        <div className="mt-4 flex items-center gap-2">
          {[0, 1, 2].map((step) => (
            <div key={step} className="flex flex-1 items-center gap-2">
              <div className={`h-8 w-8 rounded-full ${step < 2 ? "bg-[#8AA55B]" : "bg-[#D9C998]"} text-center text-[11px] font-semibold leading-8 text-white`}>
                {step + 1}
              </div>
              {step < 2 ? <div className="h-1 flex-1 rounded-full bg-[#CDBA7B]" /> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[32px] bg-white/90 px-5 py-5 text-left shadow-[0_20px_34px_rgba(46,44,31,0.08)] ring-1 ring-black/[0.04]">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7B6B36]">Weekly challenge</div>
        <div className="mt-2 text-[17px] font-semibold leading-tight text-[#1D1D1F]">Needs vs wants</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[20px] bg-[#F6F0DD] px-3 py-3">
            <div className="text-[11px] font-medium text-[#6E6E73]">Quiz score</div>
            <div className="mt-1 text-[18px] font-semibold text-[#3A3320]">92%</div>
          </div>
          <div className="rounded-[20px] bg-[#EEF2DD] px-3 py-3">
            <div className="text-[11px] font-medium text-[#6E6E73]">Badges</div>
            <div className="mt-1 text-[18px] font-semibold text-[#3A3320]">4 earned</div>
          </div>
        </div>
        <div className="mt-5 rounded-full bg-[#5F6B36] py-3.5 text-center text-[14px] font-semibold text-white shadow-[0_14px_28px_rgba(95,107,54,0.18)]">
          Continue mission
        </div>
      </div>

      <div className="mt-4 rounded-[26px] bg-white/78 px-4 py-4 text-left shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-[#6E6E73]">Explorer rank</div>
            <div className="mt-1 text-[15px] font-semibold text-[#3A3320]">Adventurer</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F3E3B3] text-[18px]">🧭</div>
        </div>
      </div>
    </div>
  );
}

function NavigatorPhone({ stage }: { stage: Stage & StoryTheme }) {
  return (
    <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#F4F8FC_0%,#FFFFFF_100%)] px-3.5 pt-3.5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[linear-gradient(180deg,rgba(90,127,178,0.42)_0%,rgba(170,205,230,0.20)_44%,rgba(255,255,255,0)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-[47%] h-16 bg-[linear-gradient(180deg,rgba(110,147,184,0)_0%,rgba(110,147,184,0.16)_100%)]" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5 rounded-full bg-white/82 px-2.5 py-1.5 shadow-[0_10px_24px_rgba(73,102,138,0.10)]">
          <StoryAvatar src={stage.portraitSrc} alt={`${stage.label} avatar`} ringClassName="ring-[#D7E7FA]" />
          <div className="text-left">
            <div className="text-[11px] font-medium leading-none text-[#5B6F89]">Hi, Mila!</div>
            <div className="mt-1 text-[12px] font-semibold leading-none text-[#26486F]">Navigator</div>
          </div>
        </div>
        <div className="rounded-full bg-[#DDE8F8] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#38659F]">
          Weekly view
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[30px] bg-white/90 px-5 py-4 text-left shadow-[0_18px_34px_rgba(47,97,160,0.10)] ring-1 ring-[#E3ECF8]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#587393]">Money map</div>
        <div className="mt-3 grid grid-cols-5 items-end gap-2">
          {[34, 52, 76, 60, 84].map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-full rounded-full bg-[#DDE8F8]" style={{ height: `${value}px` }}>
                <div
                  className="w-full rounded-full bg-[linear-gradient(180deg,#4F84C3_0%,#7AB5D7_100%)]"
                  style={{ height: `${Math.max(18, value - 10)}px` }}
                />
              </div>
              <div className="text-[9px] font-medium text-[#6E6E73]">{["M", "T", "W", "T", "F"][index]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[32px] bg-[linear-gradient(180deg,#EFF5FD_0%,#FFFFFF_100%)] px-5 py-5 text-left shadow-[0_20px_34px_rgba(58,98,146,0.10)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5E7FA8]">Current focus</div>
            <div className="mt-2 text-[17px] font-semibold leading-tight text-[#1D1D1F]">Budgeting basics</div>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDE8F8] text-[#2F61A0]">📘</div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[11px] font-medium text-[#5F6E83]">
          <span>Course progress</span>
          <span>84%</span>
        </div>
        <div className="mt-2 h-3 rounded-full bg-[#E5ECF5]">
          <div className="h-3 w-[84%] rounded-full bg-[linear-gradient(90deg,#2F61A0_0%,#78A9D5_100%)]" />
        </div>
        <div className="mt-5 rounded-full bg-[#2F61A0] py-3.5 text-center text-[14px] font-semibold text-white shadow-[0_14px_28px_rgba(47,97,160,0.20)]">
          Review insights
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          ["Monthly goal", "€80"],
          ["ETF basics", "Next up"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[22px] bg-white/84 px-4 py-4 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
            <div className="text-[11px] font-medium text-[#6E6E73]">{label}</div>
            <div className="mt-2 text-[15px] font-semibold text-[#294C74]">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IndependencePhone({ stage }: { stage: Stage & StoryTheme }) {
  return (
    <div className="relative flex aspect-[9/19.5] flex-col overflow-hidden rounded-[30px] bg-[linear-gradient(180deg,#0F1624_0%,#131C2B_100%)] px-3.5 pt-3.5 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(117,143,196,0.28),rgba(24,34,52,0)_68%)]" />

      <div className="relative z-10 flex items-center justify-between rounded-full bg-white/6 px-3 py-2 backdrop-blur-[2px]">
        <div className="flex items-center gap-2.5">
          <StoryAvatar src={stage.portraitSrc} alt={`${stage.label} avatar`} ringClassName="ring-white/10" />
          <div className="text-left">
            <div className="text-[11px] font-medium leading-none text-white/60">Profile</div>
            <div className="mt-1 text-[12px] font-semibold leading-none text-white/90">Independence</div>
          </div>
        </div>
        <div className="rounded-full bg-white/8 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/68">
          Live
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[30px] bg-[linear-gradient(180deg,rgba(39,51,77,0.94)_0%,rgba(25,34,52,0.94)_100%)] px-5 py-4 shadow-[0_22px_42px_rgba(5,9,18,0.28)] ring-1 ring-white/[0.06]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/48">Available balance</div>
        <div className="mt-2 text-[28px] font-bold leading-none tracking-tight text-white">€255.70</div>
        <div className="mt-5 h-20 rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.02)_100%)] p-3">
          <svg viewBox="0 0 160 54" className="h-full w-full" fill="none" aria-hidden="true">
            <path d="M0 44C22 44 20 24 43 24C65 24 68 38 89 38C110 38 116 10 136 10C148 10 154 18 160 22" stroke="#B7C8F2" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 mt-4 rounded-[32px] bg-[linear-gradient(180deg,rgba(37,47,69,0.92)_0%,rgba(24,31,46,0.96)_100%)] px-5 py-5 shadow-[0_20px_34px_rgba(5,9,18,0.22)] ring-1 ring-white/[0.06]">
        <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/46">Next lesson</div>
        <div className="mt-2 text-[17px] font-semibold leading-tight text-white">ETFs and long-term investing</div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[20px] bg-white/6 px-3 py-3">
            <div className="text-[11px] font-medium text-white/46">Portfolio</div>
            <div className="mt-1 text-[16px] font-semibold text-white">€1,670</div>
          </div>
          <div className="rounded-[20px] bg-white/6 px-3 py-3">
            <div className="text-[11px] font-medium text-white/46">Monthly save</div>
            <div className="mt-1 text-[16px] font-semibold text-white">€80</div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 pb-3">
        {["Account", "Card", "Invest"].map((item) => (
          <div
            key={item}
            className="rounded-[20px] bg-white/6 px-3 py-3 text-center text-[11px] font-medium text-white/72 ring-1 ring-white/[0.04]"
          >
            {item}
          </div>
        ))}
      </div>
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
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-black/[0.06] bg-white/55 px-4 py-2 backdrop-blur-[6px]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6E6E73]">Age evolution</span>
            </div>

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
      <div className="mx-auto max-w-6xl px-5 py-18 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(2.2rem,8vw,3.8rem)] font-bold leading-[1.02] tracking-[-0.05em] text-[#1D1D1F]">
            {content.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-[#6E6E73] sm:text-[18px]">
            {content.subheadline}
          </p>
        </div>

        <div className="mt-10 space-y-5">
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
