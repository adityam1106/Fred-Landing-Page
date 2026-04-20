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
    <div className="h-40 w-40 overflow-hidden rounded-full ring-2 ring-black/5 shadow-sm">
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
      className="group flex min-w-[16.25rem] snap-center flex-col items-center rounded-[28px] px-4 py-5 text-center sm:min-w-[17.5rem] lg:min-w-0"
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
      <StageAvatar src={stage.portraitSrc} alt={`${stage.label} avatar`} />

      <div
        className="mt-5 text-[3rem] font-bold leading-none tracking-[-0.05em]"
        style={{ color: stage.wordmarkColor }}
      >
        {stage.wordmark ?? "Fred"}
      </div>
      <div
        className="mt-2 text-[12px] font-medium uppercase tracking-[0.26em]"
        style={{ color: stage.labelColor }}
      >
        {stage.label}
      </div>
      <div className={`mt-4 rounded-full px-4 py-2 text-[13px] font-medium uppercase tracking-[0.18em] ${stage.pillClassName}`}>
        {stage.ageRange}
      </div>
      <p className="mt-5 max-w-[14rem] text-[15px] leading-relaxed text-[#4C5458]">
        {stage.caption}
      </p>
    </motion.article>
  );
}

function AgeEvolutionSection({ content }: { content: AgeEvolutionContent }) {
  return (
    <section className="bg-white px-5 py-20 sm:px-6 sm:py-24">
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
          <h2 className="text-[clamp(2.1rem,7vw,4.1rem)] font-bold leading-[1.04] tracking-[-0.04em] text-[#1D1D1F]">
            {content.headline}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[#6E6E73] sm:text-[18px]">
            {content.subheadline}
          </p>
        </motion.div>

        <div className="mt-12 sm:mt-14">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, transition: { duration: 0.5, ease } }}
            viewport={{ once: true, amount: 0.5 }}
            className="mx-auto mb-8 h-px max-w-5xl bg-black/[0.10]"
          />
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
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
