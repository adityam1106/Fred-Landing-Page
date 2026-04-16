import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type FooterContent = {
  left: string;
  madeWith: string;
  location: string;
};

function Footer({ content }: { content: FooterContent }) {
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["caffeine", "deadlines", "curiosity", "Ctrl+Z", "impostor syndrome"] as const;

  useEffect(() => {
    const interval = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % words.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [words.length]);

  return (
    <footer className="border-t border-black/[0.06] bg-white px-5 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row md:gap-4 md:text-left">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6E6E73] sm:text-[11px]">
            {content.left}
          </div>

          <div className="flex items-center gap-1 font-mono text-[10px] text-[#0071E3] sm:text-[11px]">
            <span>{content.madeWith}</span>
            <span className="relative inline-flex min-w-[9.5ch] justify-start overflow-hidden">
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={words[wordIndex]}
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {words[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>

          <div className="font-mono text-[10px] text-[#6E6E73]/40 sm:text-[11px]">{content.location}</div>
        </div>

      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.02 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          fontSize: "clamp(6rem, 20vw, 16rem)",
          color: "rgba(29,29,31,0.03)",
          fontWeight: 900,
          lineHeight: 1,
          textAlign: "center",
          width: "100%",
          marginTop: "1.5rem",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        FR
      </motion.div>
    </footer>
  );
}

export default Footer;
