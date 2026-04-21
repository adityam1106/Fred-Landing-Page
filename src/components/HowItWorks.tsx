import { motion } from "framer-motion";

type HowItWorksContent = {
  label: string;
  headline: string;
  cards: ReadonlyArray<{
    number: string;
    icon: string;
    title: string;
    description: string;
  }>;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

function HowItWorks({ content }: { content: HowItWorksContent }) {
  return (
    <section id="how-it-works" className="bg-white px-5 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl border-t border-black/[0.06] pt-8 sm:pt-10">
        <div className="text-left font-mono text-[11px] uppercase tracking-[0.2em] text-[#6E6E73]">
          {content.label}
        </div>

        <h2 className="mt-4 max-w-3xl text-[clamp(1.95rem,8vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-[#1D1D1F]">
          {content.headline}
        </h2>

        <div className="mt-12 rounded-[32px] border border-black/[0.06] bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f9_100%)] p-3 sm:mt-14 sm:p-4 md:mt-16">
          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
          {content.cards.map((card, index) => (
            <motion.article
              key={card.number}
              className={`relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-black/[0.04] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.04)] sm:p-7 lg:p-8 ${
                index === 1 ? "md:translate-y-8" : index === 2 ? "md:translate-y-4" : ""
              }`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.7,
                  delay: index * 0.12,
                  ease,
                },
              }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="pointer-events-none absolute right-5 top-3 select-none text-[68px] font-bold leading-none text-[#0071E3] opacity-[0.08] sm:right-6 sm:top-4 sm:text-[80px]">
                {card.number}
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                <span aria-hidden="true">{card.icon}</span>
              </div>

              <div>
                <h3 className="text-[16px] font-semibold text-[#1D1D1F] sm:text-[17px]">{card.title}</h3>
                <p className="mt-1 text-[14px] leading-relaxed text-[#6E6E73]">{card.description}</p>
              </div>
            </motion.article>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
