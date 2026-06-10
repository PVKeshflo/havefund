"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import StepNav from "@/components/StepNav";
import FounderForm, { FounderBrief } from "@/components/FounderForm";
import VCDiscovery from "@/components/VCDiscovery";
import MarketLandscape from "@/components/MarketLandscape";
import StressTest from "@/components/StressTest";
import FundraiseAutomation from "@/components/FundraiseAutomation";

interface Investor {
  name: string;
  focus: string;
  stage: string;
  location: string;
  notablePortfolio: string[];
  activeFund: string;
  whyMatch: string;
  website: string;
}

interface MarketData {
  marketSize: { tam: string; sam: string; som: string };
  keyTrends: string[];
  competitors: { name: string; positioning: string; funding: string }[];
  tailwinds: string[];
  risks: string[];
}

interface StressTestReport {
  overallScore: number;
  strengths: string[];
  gaps: string[];
  suggestedNarrative: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1
  const [founderBrief, setFounderBrief] = useState<FounderBrief | null>(null);
  const [startupSummary, setStartupSummary] = useState<Record<string, string>>({});

  // Step 2
  const [investors, setInvestors] = useState<Investor[]>([]);

  // Step 3
  const [marketData, setMarketData] = useState<MarketData | null>(null);

  // Step 4
  const [stressReport, setStressReport] = useState<StressTestReport | null>(null);

  // Refs for scroll-into-view
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentStep === 2 && step2Ref.current) {
      step2Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (currentStep === 3 && step3Ref.current) {
      step3Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (currentStep === 4 && step4Ref.current) {
      step4Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (currentStep === 5 && step5Ref.current) {
      step5Ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentStep]);

  const handleStep1Complete = useCallback((
    brief: FounderBrief,
    _refined: string,
    summary: Record<string, string>
  ) => {
    setFounderBrief(brief);
    setStartupSummary(summary);
    setCurrentStep(2);
  }, []);

  const handleStep2Complete = useCallback((inv: Investor[]) => {
    setInvestors(inv);
    setCurrentStep(3);
  }, []);

  const handleStep3Complete = useCallback((data: MarketData) => {
    setMarketData(data);
    setCurrentStep(4);
  }, []);

  const handleStep4Complete = useCallback((report: StressTestReport) => {
    setStressReport(report);
    setCurrentStep(5);
  }, []);

  const handleStartOver = useCallback(() => {
    setCurrentStep(1);
    setFounderBrief(null);
    setStartupSummary({});
    setInvestors([]);
    setMarketData(null);
    setStressReport(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Safety net: advance step if data arrived but onComplete was missed (e.g. after Fast Refresh)
  useEffect(() => {
    if (currentStep === 2 && investors.length > 0) setCurrentStep(3);
  }, [investors, currentStep]);

  useEffect(() => {
    if (currentStep === 3 && marketData !== null) setCurrentStep(4);
  }, [marketData, currentStep]);

  return (
    <div className="min-h-screen bg-white">
      <StepNav currentStep={currentStep} />

      <main>
        {/* Step 1 */}
        <FounderForm onComplete={handleStep1Complete} />

        {/* Step 2 — unlocks after step 1 */}
        <div ref={step2Ref}>
          {currentStep >= 2 && founderBrief && (
            <VCDiscovery
              country={founderBrief.country}
              stage={founderBrief.stage}
              industry={founderBrief.industry}
              startupSummary={startupSummary}
              onComplete={handleStep2Complete}
            />
          )}
        </div>

        {/* Step 3 — unlocks after step 2 */}
        <div ref={step3Ref}>
          {currentStep >= 3 && founderBrief && (
            <MarketLandscape
              industry={founderBrief.industry}
              startupSummary={startupSummary}
              onComplete={handleStep3Complete}
            />
          )}
        </div>

        {/* Step 4 — unlocks after step 3 */}
        <div ref={step4Ref}>
          {currentStep >= 4 && (
            <StressTest
              startupSummary={startupSummary}
              onComplete={handleStep4Complete}
            />
          )}
        </div>

        {/* Step 5 — unlocks after step 4 */}
        <div ref={step5Ref}>
          {currentStep >= 5 && (
            <FundraiseAutomation
              stressReport={stressReport}
              startupSummary={startupSummary}
              investors={investors}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </main>

      <footer className="border-t border-[#E5E5E5] py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <span className="text-[13px] font-bold text-[#0A0A0A]">
            GoHave<span className="text-[#DC2626]">Fund</span>
          </span>
          <span className="text-[12px] text-[#555555]">
            Powered by Claude
          </span>
        </div>
      </footer>
    </div>
  );
}
