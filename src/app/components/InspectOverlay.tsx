import React from "react";
import { ads } from "../data";
import { useAdInspection, type Verdict } from "../state/InspectionContext";
import { Search } from "lucide-react";

interface InspectOverlayProps {
  adId: string;
  onDecide: (verdict: Verdict) => void;
}

export function InspectOverlay({ adId, onDecide }: InspectOverlayProps) {
  const ad = ads.find((item) => item.id === adId);
  const { state } = useAdInspection(adId);

  if (!ad) return null;

  const mandatory = ad.hotspots.filter((hotspot) => hotspot.mandatory);
  const mandatoryChecked = mandatory.filter(
    (hotspot) => state.classifications[hotspot.id] !== undefined
  ).length;
  const mandatoryCorrect = mandatory.filter(
    (hotspot) => state.correct[hotspot.id] === true
  ).length;
  const checkedCount = ad.hotspots.filter(
    (hotspot) => state.classifications[hotspot.id] !== undefined
  ).length;
  const progress = ad.hotspots.length ? (checkedCount / ad.hotspots.length) * 100 : 0;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[90] bg-white/95 backdrop-blur-md border-b border-[#E3B740] shadow-md">
        <div className="w-full px-4 py-3 flex items-start gap-3">
          <div className="mt-1 w-8 h-8 rounded-full bg-[#E3B740]/20 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4 text-[#b8912e]" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-zinc-900">Inspection mode</div>
            <div className="text-xs text-zinc-600 leading-snug">
              {state.activeHotspotId
                ? ad.inspectInstruction
                : "You reviewed every cue. Choose the verdict that fits the evidence."}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[90] bg-white/95 backdrop-blur-md border-t border-zinc-200 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-10px_40px_rgba(0,0,0,0.10)]">
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 text-xs text-zinc-600">
            <div>
              <div className="font-semibold text-zinc-900">Cues reviewed</div>
              <div>{checkedCount} of {ad.hotspots.length}</div>
            </div>
            <div>
              <div className="font-semibold text-zinc-900">Mandatory cues</div>
              <div>{mandatoryChecked} checked · {mandatoryCorrect} correct</div>
            </div>
          </div>
          <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#E3B740] transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onDecide("scam")}
              className="min-h-11 px-3 rounded-xl text-sm font-semibold flex items-center justify-center bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              It’s a scam
            </button>
            <button
              type="button"
              onClick={() => onDecide("not-scam")}
              className="min-h-11 px-3 rounded-xl text-sm font-semibold flex items-center justify-center bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              It’s not a scam
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
