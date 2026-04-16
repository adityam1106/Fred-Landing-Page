import { motion } from "framer-motion";
import WaitlistButton from "./WaitlistButton";

type ParentDashboardPreviewContent = {
  label: string;
  title: string;
  description: string;
  bullets: ReadonlyArray<string>;
  cta: string;
  dashboard: {
    childName: string;
    childMeta: string;
    statusLabel: string;
    statusValue: string;
    statusMeta: string;
    allowanceLabel: string;
    allowanceValue: string;
    allowanceMeta: string;
    allowanceBadge: string;
    lessonsLabel: string;
    lessonsValue: string;
    lessonsMeta: string;
    stats: ReadonlyArray<{
      id: string;
      label: string;
      value: string;
      accent?: "blue" | "green";
    }>;
    spendingLabel: string;
    spendingLiveLabel: string;
    spending: ReadonlyArray<{
      name: string;
      amount: string;
      accent?: "default" | "green";
    }>;
    overviewLabel: string;
    overview: ReadonlyArray<{
      name: string;
      value: string;
    }>;
    controlsLabel: string;
    controlsValue: string;
    controlsMeta: string;
    controlsEnabledLabel: string;
  };
};

const ease = [0.25, 0.1, 0.25, 1] as const;

const fadeUp = {
  initial: { opacity: 0, y: 40, filter: "blur(6px)" },
  whileInView: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease },
  },
  viewport: { once: true, amount: 0.2 },
} as const;

const dashboardContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
} as const;

const dashboardItem = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease },
  },
} as const;

function BulletIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0071E3]/10">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M2.5 6.2L4.8 8.5L9.5 3.8"
          stroke="#0071E3"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function ParentDashboardPreview({
  language,
  copy,
}: {
  language: "en" | "de";
  copy: ParentDashboardPreviewContent;
}) {
  const childInitials = copy.dashboard.childName
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  const stats = Array.isArray(copy.dashboard.stats) ? copy.dashboard.stats : [];

  return (
    <section id="for-parents" data-language={language} className="bg-white px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-16">
        <motion.div {...fadeUp} className="max-w-xl">
          <div className="text-left font-mono text-[11px] uppercase tracking-[0.2em] text-[#6E6E73]">
            {copy.label}
          </div>

          <h2 className="mt-4 text-[clamp(1.95rem,8vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-[#1D1D1F]">
            {copy.title}
          </h2>

          <p className="mt-5 text-[16px] leading-relaxed text-[#6E6E73] sm:text-[17px]">{copy.description}</p>

          <div className="mt-8 grid gap-3 sm:gap-4 md:grid-cols-2">
            {copy.bullets.map((bullet) => (
              <div key={bullet} className="flex gap-3 rounded-2xl bg-[#F5F5F7] px-4 py-4">
                <BulletIcon />
                <p className="text-[14px] leading-relaxed text-[#1D1D1F]">{bullet}</p>
              </div>
            ))}
          </div>

          <WaitlistButton
            label={copy.cta}
            className="mt-9 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#0071E3] px-8 py-3.5 text-[16px] font-medium text-white transition-all duration-200 hover:bg-[#0077ED] active:scale-[0.98] sm:mt-10 sm:w-auto sm:text-[17px]"
          />
        </motion.div>

        <motion.div
          className="rounded-3xl border border-black/[0.06] bg-[#F5F5F7] p-3 shadow-[0_30px_80px_rgba(0,0,0,0.08)] sm:p-5"
          variants={dashboardContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div
            variants={dashboardItem}
            className="rounded-[28px] border border-black/[0.04] bg-white px-4 py-4 shadow-[0_12px_30px_rgba(0,0,0,0.04)] sm:px-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0071E3]/10 text-[15px] font-semibold text-[#0071E3]">
                  {childInitials}
                </div>
                <div>
                  <div className="text-[15px] font-semibold text-[#1D1D1F]">{copy.dashboard.childName}</div>
                  <div className="mt-0.5 text-[12px] text-[#6E6E73]">{copy.dashboard.childMeta}</div>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#34C759]/10 px-3 py-1.5 text-[12px] font-medium text-[#1D1D1F]">
                  <span className="h-2 w-2 rounded-full bg-[#34C759]" aria-hidden="true" />
                  {copy.dashboard.statusLabel}
                </div>
                <div className="mt-2 text-[14px] font-semibold text-[#1D1D1F]">{copy.dashboard.statusValue}</div>
                <div className="mt-1 text-[12px] text-[#6E6E73]">{copy.dashboard.statusMeta}</div>
              </div>
            </div>
          </motion.div>

          <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:grid-cols-[1.05fr_0.95fr]">
            <motion.div variants={dashboardItem} className="rounded-2xl bg-white p-4 sm:p-5">
              <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#6E6E73]">
                {copy.dashboard.allowanceLabel}
              </div>
              <div className="mt-3 flex items-end justify-between gap-4">
                <div>
                  <div className="text-[30px] font-bold tracking-tight text-[#1D1D1F]">
                    {copy.dashboard.allowanceValue}
                  </div>
                  <div className="mt-1 text-[13px] text-[#6E6E73]">{copy.dashboard.allowanceMeta}</div>
                </div>

                <div className="rounded-full bg-[#0071E3]/10 px-3 py-1.5 text-[12px] font-medium text-[#0071E3]">
                  {copy.dashboard.allowanceBadge}
                </div>
              </div>
            </motion.div>

            <motion.div variants={dashboardItem} className="rounded-2xl bg-white p-4 sm:p-5">
              <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-[#6E6E73]">
                {copy.dashboard.lessonsLabel}
              </div>
              <div className="mt-3 text-[28px] font-bold tracking-tight text-[#1D1D1F]">
                {copy.dashboard.lessonsValue}
              </div>
              <div className="mt-1 text-[13px] text-[#6E6E73]">{copy.dashboard.lessonsMeta}</div>
              <div className="mt-4 h-2 rounded-full bg-[#E5E5EA]">
                <div className="h-2 w-[72%] rounded-full bg-[#0071E3]" />
              </div>
            </motion.div>
          </div>

          <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 md:grid-cols-3">
            {stats.map((stat) => {
              const valueClass =
                stat.accent === "green"
                  ? "text-[#34C759]"
                  : stat.accent === "blue"
                    ? "text-[#0071E3]"
                    : "text-[#1D1D1F]";

              return (
                <motion.div key={stat.id} variants={dashboardItem} className="rounded-2xl bg-white p-4 sm:p-5">
                  <div className="text-[12px] text-[#6E6E73]">{stat.label}</div>
                  <div className={`mt-2 text-[22px] font-semibold tracking-tight sm:text-[24px] ${valueClass}`}>
                    {stat.value}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <motion.div variants={dashboardItem} className="rounded-2xl bg-white p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-[#1D1D1F]">{copy.dashboard.spendingLabel}</div>
                <div className="text-[12px] text-[#6E6E73]">{copy.dashboard.spendingLiveLabel}</div>
              </div>

              <div className="mt-4 space-y-3">
                {copy.dashboard.spending.map((item) => (
                  <div
                    key={`${item.name}-${item.amount}`}
                    className="flex items-center justify-between gap-4 rounded-2xl bg-[#F5F5F7] px-4 py-3"
                  >
                    <div className="text-[14px] text-[#1D1D1F]">{item.name}</div>
                    <div
                      className={`shrink-0 text-[14px] font-medium ${
                        item.accent === "green" ? "text-[#34C759]" : "text-[#1D1D1F]"
                      }`}
                    >
                      {item.amount}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={dashboardItem} className="rounded-2xl bg-white p-4 sm:p-5">
              <div className="text-[13px] font-semibold text-[#1D1D1F]">{copy.dashboard.overviewLabel}</div>

              <div className="mt-4 space-y-4">
                {copy.dashboard.overview.map((item, index) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between text-[13px] text-[#6E6E73]">
                      <span>{item.name}</span>
                      <span className="font-medium text-[#1D1D1F]">{item.value}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[#E8E8ED]">
                      <div
                        className="h-2 rounded-full bg-[#0071E3]"
                        style={{ width: `${72 - index * 14}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div variants={dashboardItem} className="mt-3 rounded-2xl bg-[#1D1D1F] p-4 text-white sm:mt-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div>
                <div className="text-[12px] font-medium uppercase tracking-[0.14em] text-white/45">
                  {copy.dashboard.controlsLabel}
                </div>
                <div className="mt-2 text-[17px] font-semibold tracking-tight">
                  {copy.dashboard.controlsValue}
                </div>
                <div className="mt-1 text-[13px] leading-relaxed text-white/55">
                  {copy.dashboard.controlsMeta}
                </div>
              </div>

              <div className="rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white">
                {copy.dashboard.controlsEnabledLabel}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default ParentDashboardPreview;
