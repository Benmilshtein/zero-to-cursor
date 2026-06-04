"use client";

import { createContext, useContext } from "react";

export type ActivityResult = {
  id: string;
  correct: boolean;
  score: number; // 0-100 for this activity
};

export type ActivityContextValue = {
  report: (result: ActivityResult) => void;
};

export const ActivityContext = createContext<ActivityContextValue>({
  report: () => {},
});

export function useActivityReporter() {
  return useContext(ActivityContext);
}
