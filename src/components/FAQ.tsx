import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type FAQContent = {
  label: string;
  headline: string;
  items: ReadonlyArray<{
    question: string;
    answer: string;
  }>;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

function FAQ({ content }: { content: FAQContent }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-6xl bg-white px-5 py-16 sm:px-6 sm:py-20">
      <div className="text-left font-mono text-[11px] uppercase tracking-[0.2em] text-[#6E6E73]">
        {content.label}
      </div>

      <h2 className="mt-4 text-[clamp(1.95rem,8vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-[#1D1D1F]">
        {content.headline}
      </h2>

      <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-3 sm:mt-16 sm:gap-4">
        {content.items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={item.question}
              className="overflow-hidden rounded-2xl bg-[#F5F5F7]"
              initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
              whileInView={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: {
                  duration: 0.7,
                  delay: index * 0.08,
                  ease,
                },
              }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full cursor-pointer items-center justify-between px-5 py-4.5 text-left transition-colors duration-200 hover:bg-[#EBEBF0] sm:px-6 sm:py-5"
                aria-expanded={isOpen}
              >
                <span className="pr-4 text-[14px] font-medium leading-relaxed text-[#1D1D1F] sm:text-[15px]">{item.question}</span>
                <motion.svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="shrink-0"
                >
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="#1D1D1F"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </button>

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-[14px] leading-relaxed text-[#6E6E73] sm:px-6">{item.answer}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default FAQ;
