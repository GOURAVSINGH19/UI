import Home from "../components/Home";
import Footer from "@/components/Footer";
import ComponentList from "@/components/ComponentList";
import { GridFrame, GridSection } from "@/components/grid/Grid";
import { GithubCta } from "@/components/GithubCta";
import { Resources } from "@/components/home/Resources";
import { Faq } from "@/components/home/Faq";
import { StatsCards } from "@/components/home/StatsCards";
import { Suspense } from "react";

// Shared padding for every home row: 16px on phones, the frame padding from md up.
const row = "px-gutter md:px-[var(--ui-frame-pad)]";

const ComponentLibraryDemo = () => {
  return (
    // The frame starts under the fixed navbar; each block is one grid row.
    <GridFrame className="max-w-[var(--ui-frame-width)] flex-1 pt-14">
      <main>
        <GridSection className={`${row} pt-20 pb-14 md:pt-24`}>
          <Home />
          {/* User activity from PostHog; renders nothing until stats are configured. */}
          <Suspense>
            <StatsCards className="mt-10" />
          </Suspense>
        </GridSection>
        <GridSection className={`${row} py-12`}>
          <ComponentList />
        </GridSection>
        <GridSection className={`${row} py-12`}>
          <Resources />
        </GridSection>
        <GridSection className={`${row} py-12`}>
          <Faq />
        </GridSection>
        <GridSection className={`${row} py-12`}>
          <GithubCta />
        </GridSection>
      </main>
      <GridSection as="footer" className={`${row} pt-12 pb-8`}>
        <Footer />
      </GridSection>
    </GridFrame>
  );
};

export default ComponentLibraryDemo;
