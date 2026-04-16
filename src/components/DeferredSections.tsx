import { memo, type ComponentProps } from "react";
import FAQ from "./FAQ";
import Footer from "./Footer";
import ParentDashboardPreview from "./ParentDashboardPreview";
import Pricing from "./Pricing";
import WaitlistCTA from "./WaitlistCTA";

type DeferredSectionsProps = {
  language: ComponentProps<typeof ParentDashboardPreview>["language"];
  content: {
    parentDashboard: ComponentProps<typeof ParentDashboardPreview>["copy"];
    pricing: ComponentProps<typeof Pricing>["content"];
    faq: ComponentProps<typeof FAQ>["content"];
    waitlistCta: ComponentProps<typeof WaitlistCTA>["content"];
    footer: ComponentProps<typeof Footer>["content"];
  };
};

const DeferredSections = memo(function DeferredSections({ language, content }: DeferredSectionsProps) {
  return (
    <>
      <ParentDashboardPreview language={language} copy={content.parentDashboard} />
      <Pricing content={content.pricing} />
      <FAQ content={content.faq} />
      <WaitlistCTA content={content.waitlistCta} />
      <Footer content={content.footer} />
    </>
  );
});

export default DeferredSections;
