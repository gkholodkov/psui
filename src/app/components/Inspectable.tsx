import React, { useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { type InspectablePosition, useAdInspection } from "../state/InspectionContext";
import { ANSWER_OPTIONS, getExpectedChoice, ads } from "../data";
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

  const options = ANSWER_OPTIONS;

  useEffect(() => {
    if (!active) {
      setOpen(false);
      clearSelectedInspectable(hotspotId);
    }
  }, [active, clearSelectedInspectable, hotspotId]);

  if (!hotspot) return <>{children}</>;

  const chosen = state.classifications[hotspotId];
  const isCorrect = state.correct[hotspotId];
  const detailNumber = (ad?.inspectionOrder.indexOf(hotspotId) ?? -1) + 1;

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
      if (chosen !== undefined) {
        advance();
      }
    }
  };

  const handleNext = () => {
    handleOpenChange(false);
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
          <div className="grid w-full min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">{children}</div>
            {!open && detailNumber > 0 && (
              <span className="pointer-events-none inline-flex shrink-0 items-center justify-self-end gap-2 whitespace-nowrap rounded-full border-2 border-[#b8912e] bg-zinc-900 px-2 py-1.5 text-xs font-bold leading-none text-white shadow-xl">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E3B740] text-sm font-bold text-zinc-900">
                  {detailNumber}
                </span>
                <span>Inspect</span>
              </span>
            )}
          </div>
        </div>
      </PopoverTrigger>
      {open && <div className="fixed inset-0 z-[100] bg-zinc-900/20 backdrop-blur-sm" aria-hidden="true" />}
      <PopoverContent
        sideOffset={10}
        collisionPadding={{ top: 96, bottom: 144, left: 16, right: 16 }}
        className="z-[110] w-[min(34rem,calc(100vw-2rem))] p-0 overflow-hidden border-zinc-200 bg-white shadow-2xl"
      >
        <div className="p-6 border-b border-zinc-200">
          <h2 className="text-xl font-bold text-zinc-900 break-all">{hotspot.label}</h2>
        </div>
        <div className="p-6">
          <div className="text-sm font-semibold text-zinc-700 mb-3">
            What do you see here?
          </div>
          <div className="flex flex-col gap-2">
            {options.map((option) => {
              const picked = chosen === option.value;
              const isAnswer = getExpectedChoice(hotspot) === option.value;
              const showResult = chosen !== undefined;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => classify(hotspotId, option.value)}
                  disabled={chosen !== undefined && !picked}
                  className={`text-left text-sm min-h-12 px-4 py-3 rounded-lg border transition-colors ${
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
                    {option.label}
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
                {hotspot.choiceFeedback[chosen]}
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="mt-4 w-full bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
              >
                {state.activeHotspotId === ad?.inspectionOrder[ad.inspectionOrder.length - 1]
                  ? "Finish this check"
                  : "Show the next detail"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
