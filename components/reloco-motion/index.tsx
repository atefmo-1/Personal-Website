"use client";

import type { ComponentType } from "react";
import { Stage } from "./Stage";
import { TRIP_CHECK_MS, TripCheck } from "./TripCheck";
import { scene as ask } from "./Ask";
import { scene as compareBanks } from "./CompareBanks";
import { scene as documents } from "./Documents";
import { scene as dmvVisit } from "./DmvVisit";
import { scene as i94Check } from "./I94Check";
import { scene as landing } from "./Landing";
import { scene as miles } from "./Miles";
import { scene as onboarding } from "./Onboarding";
import { scene as opt } from "./Opt";
import { scene as optFiling } from "./OptFiling";
import { scene as planBuild } from "./PlanBuild";
import { scene as sources } from "./Sources";
import { scene as ssaVisit } from "./SsaVisit";
import { scene as stamp } from "./Stamp";
import { scene as taskSteps } from "./TaskSteps";
import { scene as today } from "./Today";
import { scene as visaCheck } from "./VisaCheck";
import { scene as yearly } from "./Yearly";

// Every motion graphic in the case study, by id. A scene is a component drawn on the Stage plus
// the length of its loop.
const SCENES = {
  "trip-check": { Scene: TripCheck, duration: TRIP_CHECK_MS },
  onboarding,
  "plan-build": planBuild,
  today,
  "task-steps": taskSteps,
  "i94-check": i94Check,
  "visa-check": visaCheck,
  "ssa-visit": ssaVisit,
  "compare-banks": compareBanks,
  ask,
  documents,
  landing,
  yearly,
  opt,
  "opt-filing": optFiling,
  "dmv-visit": dmvVisit,
  sources,
  miles,
  stamp,
} satisfies Record<string, { Scene: ComponentType; duration: number }>;

export type MotionId = keyof typeof SCENES;
export const MOTION_IDS = Object.keys(SCENES) as MotionId[];

export function RelocoMotion({ id, alt }: { id: MotionId; alt: string }) {
  const { Scene, duration } = SCENES[id];
  return (
    <Stage alt={alt} duration={duration}>
      <Scene />
    </Stage>
  );
}
