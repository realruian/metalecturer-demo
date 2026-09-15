"use client";
import { useEffect, useState } from "react";
export type LearningEvent = {
  id: string;
  type: "lesson" | "question" | "note" | "experiment" | "quiz";
  courseId: string;
  label: string;
  createdAt: string;
  value?: number;
};
const KEY = "metalecturer.learning.v1";
const SIGNAL = "metalecturer-learning";
export function getLearningEvents(): LearningEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(data)
      ? data.filter(
          (e): e is LearningEvent =>
            !!e &&
            typeof e === "object" &&
            typeof e.id === "string" &&
            typeof e.type === "string" &&
            typeof e.label === "string" &&
            typeof e.createdAt === "string",
        )
      : [];
  } catch {
    return [];
  }
}
export function recordLearning(event: Omit<LearningEvent, "id" | "createdAt">) {
  const events = [
    ...getLearningEvents(),
    { ...event, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
  ].slice(-1000);
  try {
    localStorage.setItem(KEY, JSON.stringify(events));
    window.dispatchEvent(new Event(SIGNAL));
  } catch {
    /* 无存储权限时仍可浏览课程。 */
  }
}
export function resetLearning() {
  localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(SIGNAL));
}
export function useLearningEvents() {
  const [events, setEvents] = useState<LearningEvent[]>([]);
  useEffect(() => {
    const sync = () => setEvents(getLearningEvents());
    sync();
    window.addEventListener(SIGNAL, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SIGNAL, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return events;
}
