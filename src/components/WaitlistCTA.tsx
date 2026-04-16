import { motion } from "framer-motion";
import { useState } from "react";
import { TALLY_URL } from "./WaitlistButton";

type WaitlistCTAContent = {
  headline: string;
  subheadline: string;
  placeholder: string;
  button: string;
  finePrint: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

function WaitlistCTA({ content }: { content: WaitlistCTAContent }) {
  const [email, setEmail] = useState("");
  const [shakeKey, setShakeKey] = useState(0);

  const handleSubmit = () => {
    if (email.trim()) {
      window.open(TALLY_URL, "_blank");
      return;
    }

    setShakeKey((current) => current + 1);
  };

  return (
    <motion.section
      className="bg-[#1D1D1F] px-5 py-16 text-center text-white sm:px-6 sm:py-20"
      initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.7, ease },
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <h2 className="max-w-[13ch] text-[clamp(2.2rem,10vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-white sm:max-w-none">
          {content.headline}
        </h2>

        <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/50 sm:mt-6 sm:text-[17px]">{content.subheadline}</p>

        <div className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:flex-row">
          <motion.div
            key={shakeKey}
            className="flex-1"
            animate={shakeKey === 0 ? { x: 0 } : { x: [0, -8, 8, -6, 6, 0] }}
            transition={{ duration: shakeKey === 0 ? 0 : 0.35, ease: "easeInOut" }}
          >
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={content.placeholder}
              className="min-h-12 w-full rounded-full border border-white/[0.12] bg-white/[0.08] px-5 py-3.5 text-[15px] text-white outline-none transition-all duration-200 placeholder:text-white/30 focus:border-white/30 focus:bg-white/[0.12]"
            />
          </motion.div>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex min-h-12 w-full items-center justify-center whitespace-nowrap rounded-full bg-[#0071E3] px-6 py-3.5 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-[#0077ED] active:scale-[0.98] sm:w-auto"
          >
            {content.button}
          </button>
        </div>

        <div className="mt-4 max-w-[20rem] text-[12px] leading-relaxed text-white/30 sm:max-w-none sm:text-[13px]">{content.finePrint}</div>
      </div>
    </motion.section>
  );
}

export default WaitlistCTA;
