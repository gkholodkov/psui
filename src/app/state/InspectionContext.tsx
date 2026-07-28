import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ads, getExpectedChoice, type AnswerChoice } from "../data";

export type Verdict = "scam" | "not-scam";

export interface AdInspectionState {
  tapped: Set<string>;
  classifications: Record<string, AnswerChoice>;
  correct: Record<string, boolean>;
  activeHotspotId: string | null;
  verdict: Verdict | null;
}

interface ContextValue {
  byAd: Record<string, AdInspectionState>;
  completedAdIds: Set<string>;
  tap: (adId: string, hotspotId: string) => void;
  classify: (adId: string, hotspotId: string, choice: AnswerChoice) => void;
  startInspection: (adId: string) => void;
  advance: (adId: string) => void;
  decide: (adId: string, verdict: Verdict) => void;
  completeAd: (adId: string) => void;
  reset: (adId: string) => void;
  resetAll: () => void;
}

const createEmptyState = (): AdInspectionState => ({
  tapped: new Set(),
  classifications: {},
  correct: {},
  activeHotspotId: null,
  verdict: null,
});

const EMPTY_INSPECTION_STATE = createEmptyState();

const getAdState = (byAd: Record<string, AdInspectionState>, adId: string) =>
  byAd[adId] ?? createEmptyState();

const InspectionContext = createContext<ContextValue | null>(null);

export function InspectionProvider({ children }: { children: ReactNode }) {
  const [byAd, setByAd] = useState<Record<string, AdInspectionState>>({});
  const [completedAdIds, setCompletedAdIds] = useState<Set<string>>(new Set());

  const tap = useCallback((adId: string, hotspotId: string) => {
    setByAd((prev) => {
      const current = getAdState(prev, adId);
      const nextTapped = new Set(current.tapped);
      nextTapped.add(hotspotId);
      return { ...prev, [adId]: { ...current, tapped: nextTapped } };
    });
  }, []);

  const classify = useCallback((adId: string, hotspotId: string, choice: AnswerChoice) => {
    setByAd((prev) => {
      const current = getAdState(prev, adId);
      const ad = ads.find((a) => a.id === adId);
      const hotspot = ad?.hotspots.find((h) => h.id === hotspotId);
      const isCorrect = hotspot ? getExpectedChoice(hotspot) === choice : false;
      const nextTapped = new Set(current.tapped);
      nextTapped.add(hotspotId);
      return {
        ...prev,
        [adId]: {
          ...current,
          tapped: nextTapped,
          classifications: { ...current.classifications, [hotspotId]: choice },
          correct: { ...current.correct, [hotspotId]: isCorrect },
        },
      };
    });
  }, []);

  const startInspection = useCallback((adId: string) => {
    setByAd((prev) => {
      const current = getAdState(prev, adId);
      const ad = ads.find((item) => item.id === adId);
      const firstHotspotId = ad?.inspectionOrder[0] ?? null;
      return {
        ...prev,
        [adId]: {
          ...current,
          activeHotspotId: current.activeHotspotId ?? firstHotspotId,
        },
      };
    });
  }, []);

  const advance = useCallback((adId: string) => {
    setByAd((prev) => {
      const current = getAdState(prev, adId);
      const ad = ads.find((item) => item.id === adId);
      const order = ad?.inspectionOrder ?? [];
      const currentIndex = order.findIndex(
        (hotspotId) => hotspotId === current.activeHotspotId
      );
      const nextHotspotId = order[currentIndex + 1];
      return {
        ...prev,
        [adId]: {
          ...current,
          activeHotspotId: nextHotspotId ?? null,
        },
      };
    });
  }, []);

  const decide = useCallback((adId: string, verdict: Verdict) => {
    setByAd((prev) => ({
      ...prev,
      [adId]: { ...getAdState(prev, adId), verdict },
    }));
  }, []);

  const completeAd = useCallback((adId: string) => {
    setCompletedAdIds((prev) => {
      if (prev.has(adId)) return prev;
      const next = new Set(prev);
      next.add(adId);
      return next;
    });
  }, []);

  const reset = useCallback((adId: string) => {
    setByAd((prev) => ({ ...prev, [adId]: createEmptyState() }));
  }, []);

  const resetAll = useCallback(() => {
    setByAd({});
    setCompletedAdIds(new Set());
  }, []);

  const value = useMemo<ContextValue>(
    () => ({
      byAd,
      completedAdIds,
      tap,
      classify,
      startInspection,
      advance,
      decide,
      completeAd,
      reset,
      resetAll,
    }),
    [
      byAd,
      completedAdIds,
      tap,
      classify,
      startInspection,
      advance,
      decide,
      completeAd,
      reset,
      resetAll,
    ]
  );

  return <InspectionContext.Provider value={value}>{children}</InspectionContext.Provider>;
}

export function useInspectionContext() {
  const ctx = useContext(InspectionContext);
  if (!ctx) throw new Error("InspectionProvider missing");
  return ctx;
}

export function useAdInspection(adId: string) {
  const ctx = useInspectionContext();
  const state = ctx.byAd[adId] ?? EMPTY_INSPECTION_STATE;
  const isCompleted = ctx.completedAdIds.has(adId);
  const sessionComplete = ctx.completedAdIds.size >= ads.length;

  const tap = useCallback(
    (hotspotId: string) => ctx.tap(adId, hotspotId),
    [adId, ctx.tap]
  );
  const classify = useCallback(
    (hotspotId: string, choice: AnswerChoice) => ctx.classify(adId, hotspotId, choice),
    [adId, ctx.classify]
  );
  const startInspection = useCallback(
    () => ctx.startInspection(adId),
    [adId, ctx.startInspection]
  );
  const advance = useCallback(() => ctx.advance(adId), [adId, ctx.advance]);
  const decide = useCallback(
    (verdict: Verdict) => ctx.decide(adId, verdict),
    [adId, ctx.decide]
  );
  const complete = useCallback(() => ctx.completeAd(adId), [adId, ctx.completeAd]);
  const reset = useCallback(() => ctx.reset(adId), [adId, ctx.reset]);

  return {
    state,
    tap,
    classify,
    startInspection,
    advance,
    decide,
    complete,
    isCompleted,
    sessionComplete,
    reset,
  };
}
