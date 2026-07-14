import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ads, type TacticTag } from "../data";

export interface InspectablePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
  documentX: number;
  documentY: number;
  documentTop: number;
  documentRight: number;
  documentBottom: number;
  documentLeft: number;
}

export interface SelectedInspectable {
  hotspotId: string;
  position: InspectablePosition;
}

export type Verdict = "scam" | "not-scam";

export interface AdInspectionState {
  tapped: Set<string>;
  classifications: Record<string, TacticTag>;
  correct: Record<string, boolean>;
  selectedInspectable: SelectedInspectable | null;
  activeHotspotId: string | null;
  verdict: Verdict | null;
}

interface ContextValue {
  byAd: Record<string, AdInspectionState>;
  lastAdId: string | null;
  tap: (adId: string, hotspotId: string) => void;
  selectInspectable: (adId: string, hotspotId: string, position: InspectablePosition) => void;
  clearSelectedInspectable: (adId: string, hotspotId?: string) => void;
  classify: (adId: string, hotspotId: string, choice: TacticTag) => void;
  startInspection: (adId: string) => void;
  advance: (adId: string) => void;
  decide: (adId: string, verdict: Verdict) => void;
  setLastAdId: (adId: string) => void;
  reset: (adId: string) => void;
  resetAll: () => void;
}

const createEmptyState = (): AdInspectionState => ({
  tapped: new Set(),
  classifications: {},
  correct: {},
  selectedInspectable: null,
  activeHotspotId: null,
  verdict: null,
});

const InspectionContext = createContext<ContextValue | null>(null);

export function InspectionProvider({ children }: { children: React.ReactNode }) {
  const [byAd, setByAd] = useState<Record<string, AdInspectionState>>({});
  const [lastAdId, setLastAdIdState] = useState<string | null>(null);

  const ensure = (adId: string, prev: Record<string, AdInspectionState>) =>
    prev[adId] ?? createEmptyState();

  const tap = useCallback((adId: string, hotspotId: string) => {
    setByAd((prev) => {
      const cur = ensure(adId, prev);
      const nextTapped = new Set(cur.tapped);
      nextTapped.add(hotspotId);
      return { ...prev, [adId]: { ...cur, tapped: nextTapped } };
    });
  }, []);

  const selectInspectable = useCallback(
    (adId: string, hotspotId: string, position: InspectablePosition) => {
      setByAd((prev) => ({
        ...prev,
        [adId]: {
          ...ensure(adId, prev),
          selectedInspectable: { hotspotId, position },
        },
      }));
    },
    []
  );

  const clearSelectedInspectable = useCallback((adId: string, hotspotId?: string) => {
    setByAd((prev) => {
      const cur = ensure(adId, prev);
      if (!cur.selectedInspectable) return prev;
      if (hotspotId && cur.selectedInspectable.hotspotId !== hotspotId) return prev;
      return { ...prev, [adId]: { ...cur, selectedInspectable: null } };
    });
  }, []);

  const classify = useCallback((adId: string, hotspotId: string, choice: TacticTag) => {
    setByAd((prev) => {
      const cur = ensure(adId, prev);
      const ad = ads.find((a) => a.id === adId);
      const hotspot = ad?.hotspots.find((h) => h.id === hotspotId);
      const isCorrect = hotspot ? hotspot.tactic === choice : false;
      const nextTapped = new Set(cur.tapped);
      nextTapped.add(hotspotId);
      return {
        ...prev,
        [adId]: {
          ...cur,
          tapped: nextTapped,
          classifications: { ...cur.classifications, [hotspotId]: choice },
          correct: { ...cur.correct, [hotspotId]: isCorrect },
        },
      };
    });
  }, []);

  const startInspection = useCallback((adId: string) => {
    setByAd((prev) => {
      const cur = ensure(adId, prev);
      const ad = ads.find((item) => item.id === adId);
      const firstHotspotId = ad?.inspectionOrder[0] ?? null;
      return {
        ...prev,
        [adId]: {
          ...cur,
          activeHotspotId: cur.activeHotspotId ?? firstHotspotId,
        },
      };
    });
  }, []);

  const advance = useCallback((adId: string) => {
    setByAd((prev) => {
      const cur = ensure(adId, prev);
      const ad = ads.find((item) => item.id === adId);
      const order = ad?.inspectionOrder ?? [];
      const currentIndex = order.findIndex((hotspotId) => hotspotId === cur.activeHotspotId);
      const nextHotspotId = order[currentIndex + 1];
      return {
        ...prev,
        [adId]: {
          ...cur,
          activeHotspotId: nextHotspotId ?? null,
          selectedInspectable: null,
        },
      };
    });
  }, []);

  const decide = useCallback((adId: string, verdict: Verdict) => {
    setByAd((prev) => ({ ...prev, [adId]: { ...ensure(adId, prev), verdict } }));
  }, []);

  const reset = useCallback((adId: string) => {
    setByAd((prev) => ({ ...prev, [adId]: createEmptyState() }));
  }, []);

  const resetAll = useCallback(() => {
    setByAd({});
    setLastAdIdState(null);
  }, []);

  const setLastAdId = useCallback((adId: string) => setLastAdIdState(adId), []);

  const value = useMemo<ContextValue>(
    () => ({
      byAd,
      lastAdId,
      tap,
      selectInspectable,
      clearSelectedInspectable,
      classify,
      startInspection,
      advance,
      decide,
      setLastAdId,
      reset,
      resetAll,
    }),
    [
      byAd,
      lastAdId,
      tap,
      selectInspectable,
      clearSelectedInspectable,
      classify,
      startInspection,
      advance,
      decide,
      setLastAdId,
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
  const state = ctx.byAd[adId] ?? createEmptyState();

  return useMemo(
    () => ({
      state,
      tap: (hotspotId: string) => ctx.tap(adId, hotspotId),
      selectInspectable: (hotspotId: string, position: InspectablePosition) =>
        ctx.selectInspectable(adId, hotspotId, position),
      clearSelectedInspectable: (hotspotId?: string) =>
        ctx.clearSelectedInspectable(adId, hotspotId),
      classify: (hotspotId: string, choice: TacticTag) => ctx.classify(adId, hotspotId, choice),
      startInspection: () => ctx.startInspection(adId),
      advance: () => ctx.advance(adId),
      decide: (verdict: Verdict) => ctx.decide(adId, verdict),
      reset: () => ctx.reset(adId),
      resetAll: ctx.resetAll,
      setActive: () => ctx.setLastAdId(adId),
    }),
    [state, ctx, adId]
  );
}
