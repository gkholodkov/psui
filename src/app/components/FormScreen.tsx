import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router";
import { ads } from "../data";
import { Lock } from "lucide-react";
import { InspectOverlay } from "./InspectOverlay";
import { Inspectable } from "./Inspectable";
import { useAdInspection, type Verdict } from "../state/InspectionContext";

type FormSpotlightPhase = "initial" | "entering" | "spotlight" | "exiting" | "complete";

interface SpotlightRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const FORM_SPOTLIGHT_INITIAL_DELAY_MS = 1000;
const FORM_SPOTLIGHT_FADE_MS = 300;
const FORM_SPOTLIGHT_HOLD_MS = 2000;

const FORM_SPOTLIGHT_STEPS: Array<[FormSpotlightPhase, number]> = [
  ["entering", FORM_SPOTLIGHT_INITIAL_DELAY_MS],
  ["spotlight", FORM_SPOTLIGHT_INITIAL_DELAY_MS + FORM_SPOTLIGHT_FADE_MS],
  [
    "exiting",
    FORM_SPOTLIGHT_INITIAL_DELAY_MS + FORM_SPOTLIGHT_FADE_MS + FORM_SPOTLIGHT_HOLD_MS,
  ],
  [
    "complete",
    FORM_SPOTLIGHT_INITIAL_DELAY_MS +
      FORM_SPOTLIGHT_FADE_MS +
      FORM_SPOTLIGHT_HOLD_MS +
      FORM_SPOTLIGHT_FADE_MS,
  ],
];

function SpotlightMask({ rect, dimmed }: { rect: SpotlightRect; dimmed: boolean }) {
  const overlayClass =
    "fixed pointer-events-none z-[80] bg-zinc-950/55 transition-opacity duration-300 " +
    (dimmed ? "opacity-100" : "opacity-0");

  return (
    <>
      <div
        className={`${overlayClass} top-0 left-0 right-0`}
        style={{ height: Math.max(0, rect.top - 8) }}
        aria-hidden="true"
      />
      <div
        className={`${overlayClass} left-0`}
        style={{
          top: Math.max(0, rect.top - 8),
          bottom: Math.max(0, window.innerHeight - rect.bottom - 8),
          width: Math.max(0, rect.left - 8),
        }}
        aria-hidden="true"
      />
      <div
        className={`${overlayClass} right-0`}
        style={{
          top: Math.max(0, rect.top - 8),
          bottom: Math.max(0, window.innerHeight - rect.bottom - 8),
          width: Math.max(0, window.innerWidth - rect.right - 8),
        }}
        aria-hidden="true"
      />
      <div
        className={`${overlayClass} bottom-0 left-0 right-0`}
        style={{ top: Math.min(window.innerHeight, rect.bottom + 8) }}
        aria-hidden="true"
      />
    </>
  );
}

export function FormScreen() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const ad = ads.find((item) => item.id === adId);
  const { state, decide, isCompleted, startInspection } = useAdInspection(adId ?? "");
  const [filledFields, setFilledFields] = useState<Record<string, boolean>>({});
  const [spotlightPhase, setSpotlightPhase] = useState<FormSpotlightPhase>("initial");
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const spotlightTargetRef = useRef<HTMLDivElement>(null);
  const firstHotspotId = ad?.inspectionOrder[0] ?? null;
  const spotlightEngaged =
    spotlightPhase === "entering" ||
    spotlightPhase === "spotlight" ||
    spotlightPhase === "exiting";
  const spotlightDimmed = spotlightPhase === "spotlight";

  const withSpotlightClass = (hotspotId: string, className: string) =>
    [
      className,
      spotlightEngaged && hotspotId === firstHotspotId ? "relative z-[86] transition-transform duration-500" : "",
      spotlightDimmed && hotspotId === firstHotspotId ? "scale-[1.01]" : "",
    ]
      .filter(Boolean)
      .join(" ");

  useEffect(() => {
    scrollContainerRef.current?.scrollTo(0, 0);
    if (adId) startInspection();
  }, [adId, startInspection]);

  useEffect(() => {
    setSpotlightPhase("initial");
    const timers = FORM_SPOTLIGHT_STEPS.map(([phase, delay]) =>
      window.setTimeout(() => setSpotlightPhase(phase), delay)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [adId]);

  useEffect(() => {
    if (!spotlightEngaged) {
      setSpotlightRect(null);
      return;
    }

    const updateSpotlightRect = () => {
      const rect = spotlightTargetRef.current?.getBoundingClientRect();
      if (!rect) return;
      setSpotlightRect({
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
      });
    };

    const scrollContainer = scrollContainerRef.current;
    updateSpotlightRect();
    window.addEventListener("resize", updateSpotlightRect);
    scrollContainer?.addEventListener("scroll", updateSpotlightRect);

    return () => {
      window.removeEventListener("resize", updateSpotlightRect);
      scrollContainer?.removeEventListener("scroll", updateSpotlightRect);
    };
  }, [spotlightEngaged]);

  if (!ad || isCompleted) return <Navigate to="/board" replace />;

  const mappedHotspotIds = new Set([ad.formUrlHotspotId]);
  ad.formFields.forEach((field) => {
    if (field.hotspotId) mappedHotspotIds.add(field.hotspotId);
  });
  if (ad.formBadgeHotspotId) mappedHotspotIds.add(ad.formBadgeHotspotId);

  const remainingHotspots = ad.hotspots.filter((hotspot) => !mappedHotspotIds.has(hotspot.id));

  const handleDecision = (verdict: Verdict) => {
    decide(verdict);
    navigate(`/ad/${ad.id}/outcome`, { replace: true });
  };

  const active = (hotspotId: string) => state.activeHotspotId === hotspotId;

  const renderField = (label: string, demoValue: string, hotspotId?: string) => {
    const content = (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-zinc-800">{label}</label>
        <input
          readOnly
          aria-label={label}
          value={filledFields[label] ? demoValue : ""}
          placeholder="Select to preview a demo value"
          onClick={() => {
            if (!hotspotId || !active(hotspotId)) {
              setFilledFields((current) => ({ ...current, [label]: true }));
            }
          }}
          tabIndex={hotspotId && active(hotspotId) ? -1 : undefined}
          className={`h-10 bg-white border border-zinc-300 rounded-md w-full px-3 text-sm text-zinc-800 placeholder:text-zinc-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E3B740] ${
            hotspotId && active(hotspotId) ? "pointer-events-none" : ""
          }`}
        />
      </div>
    );

    if (!hotspotId) return <div key={label}>{content}</div>;
    return (
      <Inspectable
        key={label}
        adId={ad.id}
        hotspotId={hotspotId}
        active={active(hotspotId)}
        className={withSpotlightClass(
          hotspotId,
          active(hotspotId) ? "block w-full px-3 py-2" : "block w-full"
        )}
      >
        {content}
      </Inspectable>
    );
  };

  return (
    <div
      ref={scrollContainerRef}
      className="h-[100dvh] overflow-y-auto overscroll-none bg-[#F5F5F5] flex flex-col text-zinc-900 pt-44"
    >
      <div className="fixed top-20 left-0 right-0 z-10 bg-zinc-100 border-b border-zinc-300 shadow-sm flex flex-col">
        <div className="h-10 bg-zinc-200 flex items-center px-4 gap-2 border-b border-zinc-300">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-400" />
            <div className="w-3 h-3 rounded-full bg-zinc-400" />
            <div className="w-3 h-3 rounded-full bg-zinc-400" />
          </div>
        </div>
        <div className="flex items-center gap-4 p-2 bg-zinc-100">
          <div ref={spotlightTargetRef} className="flex-1 min-w-0">
            <Inspectable
              adId={ad.id}
              hotspotId={ad.formUrlHotspotId}
              active={active(ad.formUrlHotspotId)}
              className={withSpotlightClass(
                ad.formUrlHotspotId,
                active(ad.formUrlHotspotId) ? "block w-full px-1" : "block w-full"
              )}
            >
              <div className="bg-white border border-zinc-300 rounded-md px-3 py-1.5 text-sm flex items-center gap-2 overflow-hidden shadow-sm">
                <Lock className="w-3 h-3 text-zinc-400 shrink-0" />
                <span className="text-zinc-600 truncate font-mono text-xs">{ad.formUrl}</span>
              </div>
            </Inspectable>
          </div>
        </div>
      </div>

      <div className="w-full px-4 pt-4 md:px-8 md:pt-8">
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-zinc-200 overflow-hidden">
          <div className="p-6 border-b border-zinc-200">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">{ad.formTitle}</h1>
            {ad.formBadge && (
              ad.formBadgeHotspotId ? (
                <Inspectable
                  adId={ad.id}
                  hotspotId={ad.formBadgeHotspotId}
                  active={active(ad.formBadgeHotspotId)}
                  className={withSpotlightClass(
                    ad.formBadgeHotspotId,
                    active(ad.formBadgeHotspotId)
                      ? "inline-block mb-4 px-1"
                      : "inline-block mb-4"
                  )}
                >
                  <span className="inline-block bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold px-2 py-1 rounded">
                    {ad.formBadge}
                  </span>
                </Inspectable>
              ) : (
                <span className="inline-block mb-4 bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold px-2 py-1 rounded">
                  {ad.formBadge}
                </span>
              )
            )}
            <p className="text-zinc-600 text-sm leading-relaxed">{ad.formBody}</p>
          </div>

          {(remainingHotspots.length > 0 || ad.type === "Scam") && (
            <div className="p-6 border-b border-zinc-200">
              <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">
                Details to review
              </div>
              <div className="space-y-2">
                <div className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Original URL</span>
                  <span className="text-sm font-mono text-zinc-700 break-all">{ad.originalUrl}</span>
                </div>
                {remainingHotspots.map((hotspot) => (
                  <Inspectable
                    key={hotspot.id}
                    adId={ad.id}
                    hotspotId={hotspot.id}
                    active={active(hotspot.id)}
                    className={withSpotlightClass(
                      hotspot.id,
                      active(hotspot.id) ? "block w-full px-3 py-2" : "block w-full"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3">
                      <span className="text-sm font-medium text-zinc-800 break-all">{hotspot.label}</span>
                    </div>
                  </Inspectable>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 bg-zinc-50">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">
              What the form asks for
            </div>
            <div className="space-y-4">
              {ad.formFields.map((field) =>
                renderField(field.label, field.demoValue, field.hotspotId)
              )}
            </div>
            {ad.formFooter && <p className="mt-6 text-xs text-zinc-500 text-center">{ad.formFooter}</p>}
          </div>
        </div>
      </div>

      {spotlightEngaged && spotlightRect && (
        <SpotlightMask rect={spotlightRect} dimmed={spotlightDimmed} />
      )}

      <InspectOverlay adId={ad.id} onDecide={handleDecision} />
    </div>
  );
}
