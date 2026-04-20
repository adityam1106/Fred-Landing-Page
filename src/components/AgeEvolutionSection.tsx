import { motion, useReducedMotion } from "framer-motion";

type Stage = {
  label: string;
  ageRange: string;
  portraitSrc: string;
  wordmark?: string;
  wordmarkColor: string;
  labelColor: string;
  pillClassName: string;
  caption: string;
};

type AgeEvolutionContent = {
  headline: string;
  subheadline: string;
  stages: ReadonlyArray<Stage>;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

function StageAvatar({ src, alt }: { src: string; alt: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="h-36 w-36 overflow-hidden rounded-full ring-2 ring-black/5 shadow-[0_10px_28px_rgba(15,23,42,0.08)] sm:h-40 sm:w-40">
      <motion.img
        src={src}
        alt={alt}
        className="h-full w-full object-cover object-center"
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
        whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{
          duration: 0.5,
          ease,
        }}
      />
    </div>
  );
}

function StageItem({
  stage,
  index,
}: {
  stage: Stage;
  index: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      className="group relative flex min-w-[15.75rem] snap-center flex-col items-center rounded-[30px] border border-black/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(248,248,246,0.92)_100%)] px-5 py-6 text-center shadow-[0_14px_34px_rgba(15,23,42,0.04)] sm:min-w-[17rem] sm:px-6 sm:py-7 lg:min-w-0 lg:h-full"
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 30, scale: 0.97 }
      }
      whileInView={{
        opacity: 1,
        ...(prefersReducedMotion ? {} : { y: 0, scale: 1 }),
        transition: {
          duration: 0.5,
          delay: index * 0.06,
          ease,
        },
      }}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -3 }}
      transition={prefersReducedMotion ? undefined : { duration: 0.25, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.4 }}
    >
      <div className="mb-5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#6E6E73]">
        {`Stage ${index + 1}`}
      </div>

      <StageAvatar src={stage.portraitSrc} alt={`${stage.label} avatar`} />

      <div
        className="mt-5 text-[2.7rem] font-bold leading-none tracking-[-0.05em] sm:text-[3rem]"
        style={{ color: stage.wordmarkColor }}
      >
        {stage.wordmark ?? "Fred"}
      </div>
      <div
        className="mt-3 text-[11px] font-medium uppercase tracking-[0.28em] sm:text-[12px]"
        style={{ color: stage.labelColor }}
      >
        {stage.label}
      </div>
      <div
        className={`mt-4 rounded-full px-4 py-2 text-[12px] font-medium uppercase tracking-[0.18em] sm:text-[13px] ${stage.pillClassName}`}
      >
        {stage.ageRange}
      </div>
      <p className="mt-5 max-w-[14rem] text-[14px] leading-relaxed text-[#4C5458] sm:text-[15px]">
        {stage.caption}
      </p>
    </motion.article>
  );
}

function AgeEvolutionSection({ content }: { content: AgeEvolutionContent }) {
  return (
    <section className="bg-white px-5 py-18 sm:px-6 sm:py-22">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.6, ease },
          }}
          viewport={{ once: true, amount: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-[clamp(2.05rem,7vw,4rem)] font-bold leading-[1.04] tracking-[-0.04em] text-[#1D1D1F]">
            {content.headline}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-relaxed text-[#6E6E73] sm:mt-5 sm:text-[18px]">
            {content.subheadline}
          </p>
        </motion.div>

        <div className="relative mt-12 sm:mt-14">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, transition: { duration: 0.5, ease } }}
            viewport={{ once: true, amount: 0.5 }}
            className="mx-auto mb-8 h-px max-w-5xl bg-black/[0.08]"
          />
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-[7.9rem] hidden h-px bg-[linear-gradient(90deg,rgba(0,0,0,0.08),rgba(0,0,0,0.03)_18%,rgba(0,0,0,0.03)_82%,rgba(0,0,0,0.08))] lg:block" />
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
            {content.stages.map((stage, index) => (
              <StageItem key={`${stage.label}-${stage.ageRange}`} stage={stage} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AgeEvolutionSection;
