import { motion } from "framer-motion";

type LessonShowcaseContent = {
  label: string;
  headline: string;
  subheadline: string;
  cards: ReadonlyArray<{
    icon: string;
    title: string;
    description: string;
  }>;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

function LessonShowcase({ content }: { content: LessonShowcaseContent }) {
  return (
    <section className="bg-[#1D1D1F] px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-left font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          {content.label}
        </div>

        <h2 className="mt-4 max-w-3xl text-[clamp(1.95rem,8vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-white">
          {content.headline}
        </h2>

        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/50 sm:mt-3 sm:text-[17px]">{content.subheadline}</p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:grid-cols-2">
          {content.cards.map((card, index) => (
            <motion.article
              key={card.title}
              className="cursor-default rounded-2xl border border-white/[0.08] bg-white/[0.06] p-5 transition-all duration-300 hover:bg-white/[0.10] sm:p-6"
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              whileInView={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.7,
                  delay: index * 0.1,
                  ease,
                },
              }}
              viewport={{ once: true, amount: 0.15 }}
            >
              <div className="text-2xl" aria-hidden="true">
                {card.icon}
              </div>
              <h3 className="mt-3 text-[16px] font-semibold text-white sm:text-[17px]">{card.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-white/50">{card.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LessonShowcase;
