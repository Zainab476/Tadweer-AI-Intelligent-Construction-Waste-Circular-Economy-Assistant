import { useState } from "react";

export interface DemoStep {
  step: number;          // 1–5
  title: string;
  description: string;
  action: string;        // label for the CTA button
  href: string;          // where the button navigates
}

export const DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: "Contractor Portal",
    description: "A contractor submits a construction waste pickup request.",
    action: "Open Contractor Dashboard →",
    href: "/contractor/dashboard",
  },
  {
    step: 2,
    title: "Submit Waste Request",
    description: "Fill in waste type, quantity, location and pickup date.",
    action: "Create New Request →",
    href: "/contractor/request",
  },
  {
    step: 3,
    title: "Driver Accepts Pickup",
    description: "A certified driver accepts the job and begins transit.",
    action: "Open Driver Portal →",
    href: "/driver/dashboard",
  },
  {
    step: 4,
    title: "Plant Processes Waste",
    description: "The recycling plant converts waste into recycled material.",
    action: "Open Plant Portal →",
    href: "/plant/dashboard",
  },
  {
    step: 5,
    title: "View Environmental Impact",
    description: "Track CO₂ reduced, waste diverted, and materials recycled.",
    action: "Open Impact Dashboard →",
    href: "/impact",
  },
];

const KEY = "tadweer_demo_active";
const STEP_KEY = "tadweer_demo_step";

export function useDemoMode() {
  const [active, setActive] = useState(() => localStorage.getItem(KEY) === "true");
  const [step, setStep] = useState(() => parseInt(localStorage.getItem(STEP_KEY) ?? "1", 10));

  const startDemo = () => {
    localStorage.setItem(KEY, "true");
    localStorage.setItem(STEP_KEY, "1");
    setActive(true);
    setStep(1);
  };

  const exitDemo = () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem(STEP_KEY);
    setActive(false);
    setStep(1);
  };

  const nextStep = () => {
    const next = Math.min(step + 1, DEMO_STEPS.length);
    localStorage.setItem(STEP_KEY, String(next));
    setStep(next);
  };

  const prevStep = () => {
    const prev = Math.max(step - 1, 1);
    localStorage.setItem(STEP_KEY, String(prev));
    setStep(prev);
  };

  const currentDemo = DEMO_STEPS[step - 1];

  return { active, step, currentDemo, startDemo, exitDemo, nextStep, prevStep };
}
