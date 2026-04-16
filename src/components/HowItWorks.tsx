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
    <section id="how-it-works" className="bg-white px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-left font-mono text-[11px] uppercase tracking-[0.2em] text-[#6E6E73]">
          {content.label}
        </div>

        <h2 className="mt-4 max-w-3xl text-[clamp(1.95rem,8vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-[#1D1D1F]">
          {content.headline}
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-14 sm:gap-5 md:mt-16 md:grid-cols-3 md:gap-6">
          {content.cards.map((card, index) => (
            <motion.article
              key={card.number}
              className="relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-[#F5F5F7] p-6 sm:p-7 lg:p-8"
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              whileInView={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
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
    </section>
  );
}

export default HowItWorks;
