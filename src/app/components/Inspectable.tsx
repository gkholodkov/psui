import React, { useEffect, useMemo, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { type InspectablePosition, useAdInspection } from "../state/InspectionContext";
import { ads, type TacticTag } from "../data";
import { CheckCircle2, ChevronRight, XCircle } from "lucide-react";

interface InspectableProps {
  adId: string;
  hotspotId: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Inspectable({ adId, hotspotId, active, children, className = "" }: InspectableProps) {
  const ad = ads.find((item) => item.id === adId);
  const hotspot = ad?.hotspots.find((item) => item.id === hotspotId);
  const { state, tap, selectInspectable, clearSelectedInspectable, classify, advance } =
    useAdInspection(adId);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const options = useMemo<TacticTag[]>(() => {
    if (!hotspot) return [];
    return [hotspot.tactic, ...hotspot.distractors].sort((a, b) => a.localeCompare(b));
  }, [hotspot]);

  useEffect(() => {
    if (!active) {
      setOpen(false);
      clearSelectedInspectable(hotspotId);
    }
  }, [active, clearSelectedInspectable, hotspotId]);

  if (!hotspot) return <>{children}</>;

  const chosen = state.classifications[hotspotId];
  const isCorrect = state.correct[hotspotId];
  const isTapped = state.tapped.has(hotspotId);

  const getInspectablePosition = (): InspectablePosition | null => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      documentX: rect.x + scrollX,
      documentY: rect.y + scrollY,
      documentTop: rect.top + scrollY,
      documentRight: rect.right + scrollX,
      documentBottom: rect.bottom + scrollY,
      documentLeft: rect.left + scrollX,
    };
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      tap(hotspotId);
      const position = getInspectablePosition();
      if (position) selectInspectable(hotspotId, position);
    } else {
      clearSelectedInspectable(hotspotId);
    }
  };

  const handleNext = () => {
    setOpen(false);
    clearSelectedInspectable(hotspotId);
    advance();
  };

  if (!active) {
    return <div className={className}>{children}</div>;
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              handleOpenChange(true);
            }
          }}
          className={`relative text-left rounded-lg transition-all cursor-pointer ring-2 ring-[#E3B740]/80 ring-offset-2 ring-offset-white animate-[pulse_2.2s_ease-in-out_infinite] ${className}`}
          aria-label={`Inspect: ${hotspot.label}`}
        >
          {children}
        </div>
      </PopoverTrigger>
      {open && <div className="fixed inset-0 z-[100] bg-zinc-900/20 backdrop-blur-sm" aria-hidden="true" />}
      <PopoverContent
        sideOffset={10}
        collisionPadding={{ top: 96, bottom: 144, left: 16, right: 16 }}
        className="z-[110] w-[min(22rem,calc(100vw-2rem))] p-0 overflow-hidden border-zinc-200 bg-white shadow-2xl"
      >
        <div className="p-4 border-b border-zinc-200">
          <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">
            {hotspot.label}
          </div>
          <p className="text-sm text-zinc-700 leading-relaxed">{hotspot.feedback}</p>
        </div>
        <div className="p-4">
          <div className="text-xs font-semibold text-zinc-700 mb-2">
            What kind of evidence is this?
          </div>
          <div className="flex flex-col gap-2">
            {options.map((opt) => {
              const picked = chosen === opt;
              const isAnswer = hotspot.tactic === opt;
              const showResult = chosen !== undefined;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => classify(hotspotId, opt)}
                  disabled={chosen !== undefined && !picked}
                  className={`text-left text-sm px-3 py-2 rounded-md border transition-colors ${
                    showResult && picked && isAnswer
                      ? "bg-green-50 border-green-300 text-green-800"
                      : showResult && picked && !isAnswer
                      ? "bg-red-50 border-red-300 text-red-800"
                      : showResult && !picked && isAnswer
                      ? "bg-green-50/60 border-green-200 text-green-700"
                      : showResult
                      ? "bg-zinc-50 border-zinc-200 text-zinc-400"
                      : "bg-white border-zinc-300 hover:border-zinc-500 text-zinc-800"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {showResult && picked && isAnswer && <CheckCircle2 className="w-4 h-4" />}
                    {showResult && picked && !isAnswer && <XCircle className="w-4 h-4" />}
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
          {chosen !== undefined && (
            <>
              <div
                className={`mt-3 text-sm rounded-md p-3 border ${
                  isCorrect
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-yellow-50 border-yellow-200 text-yellow-900"
                }`}
              >
                {isCorrect ? hotspot.correctFeedback : hotspot.incorrectFeedback}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="mt-3 w-full bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 px-3 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
              >
                {state.activeHotspotId === ad?.hotspots[ad.hotspots.length - 1]?.id
                  ? "Finish inspection"
                  : "Next cue"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
