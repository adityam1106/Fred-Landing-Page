import { motion } from "framer-motion";
import WaitlistButton from "./WaitlistButton";

type PricingContent = {
  label: string;
  headline: string;
  price: string;
  period: string;
  features: ReadonlyArray<string>;
  cta: string;
  finePrint: string;
};

const ease = [0.25, 0.1, 0.25, 1] as const;

function CheckIcon() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0071E3]/10">
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

function Pricing({ content }: { content: PricingContent }) {
  return (
    <section id="pricing" className="mx-auto max-w-6xl bg-white px-5 py-16 sm:px-6 sm:py-20">
      <div className="text-left font-mono text-[11px] uppercase tracking-[0.2em] text-[#6E6E73]">{content.label}</div>

      <h2 className="mt-4 max-w-3xl text-[clamp(1.95rem,8vw,3.5rem)] font-bold leading-[1.08] tracking-tight text-[#1D1D1F]">
        {content.headline}
      </h2>

      <motion.div
        className="mx-auto mt-12 flex max-w-md flex-col items-center rounded-3xl bg-[#F5F5F7] p-7 text-center shadow-sm sm:mt-16 sm:p-10"
        initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
        whileInView={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.7, ease },
        }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="text-[52px] font-bold leading-none tracking-tight text-[#1D1D1F] sm:text-[64px]">{content.price}</div>
        <div className="mt-2 text-[14px] font-normal text-[#6E6E73] sm:text-[15px]">{content.period}</div>

        <div className="mt-7 h-px w-full bg-black/[0.06] sm:mt-8" />

        <div className="mt-7 flex w-full flex-col gap-3 text-left sm:mt-8">
          {content.features.map((feature) => (
            <div key={feature} className="flex items-start gap-3">
              <CheckIcon />
              <span className="text-[14px] leading-relaxed text-[#1D1D1F] sm:text-[15px]">{feature}</span>
            </div>
          ))}
        </div>

        <WaitlistButton
          label={content.cta}
          className="mt-9 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#0071E3] py-4 text-[16px] font-medium text-white transition-colors duration-200 hover:bg-[#0077ED] active:scale-[0.98] sm:mt-10 sm:text-[17px]"
        />

        <div className="mt-4 max-w-[18rem] text-[12px] leading-relaxed text-[#6E6E73] sm:max-w-none sm:text-[13px]">{content.finePrint}</div>
      </motion.div>
    </section>
  );
}

export default Pricing;
