import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router";
import { ads } from "../data";
import { Lock } from "lucide-react";
import { InspectOverlay } from "./InspectOverlay";
import { Inspectable } from "./Inspectable";
import { useAdInspection, type Verdict } from "../state/InspectionContext";

const FORM_HOTSPOT_BY_AD: Record<string, Record<string, string>> = {
  A: {
    "Upload student ID": "h3",
    "Continue to WhatsApp confirmation": "h4",
  },
  B: {
    "Passport or ID photo": "h2",
    "Refundable holding deposit: €250": "h3",
    "IBAN for identity confirmation": "h4",
  },
  C: {
    "Deposit: after contract": "h2",
    "Documents: not required before viewing": "h3",
    "Profile: active since 2021": "h4",
  },
};

export function FormScreen() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const ad = ads.find((item) => item.id === adId);
  const inspection = useAdInspection(adId ?? "");
  const [filledFields, setFilledFields] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (adId) {
      inspection.setActive();
      inspection.startInspection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adId]);

  if (!ad) return <Navigate to="/board" replace />;

  const hotspotMap = FORM_HOTSPOT_BY_AD[ad.id] ?? {};
  const mappedHotspotIds = new Set(Object.values(hotspotMap));
  const urlHotspotId = ad.id === "A" ? "h2" : ad.id === "C" ? "h1" : null;
  if (urlHotspotId) mappedHotspotIds.add(urlHotspotId);
  if (ad.id === "B") mappedHotspotIds.add("h1");

  const remainingHotspots = ad.hotspots.filter((hotspot) => !mappedHotspotIds.has(hotspot.id));

  const handleDecision = (verdict: Verdict) => {
    inspection.decide(verdict);
    navigate(`/ad/${ad.id}/outcome`, { replace: true });
  };

  const active = (hotspotId: string) => inspection.state.activeHotspotId === hotspotId;

  const renderField = (label: string, demoValue: string, hotspotId?: string) => {
    const content = (
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700">{label}</label>
        <input
          readOnly
          aria-label={label}
          value={filledFields[label] ? demoValue : ""}
          placeholder="Click to fill demo value"
          onClick={() => setFilledFields((current) => ({ ...current, [label]: true }))}
          className="h-10 bg-white border border-zinc-300 rounded-md w-full px-3 text-sm text-zinc-800 placeholder:text-zinc-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E3B740]"
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
        className={active(hotspotId) ? "block w-full px-3 py-2" : "block w-full"}
      >
        {content}
      </Inspectable>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col text-zinc-900 pt-20 pb-56">
      <div className="fixed top-0 left-0 right-0 z-10 bg-zinc-100 border-b border-zinc-300 shadow-sm flex flex-col">
        <div className="h-10 bg-zinc-200 flex items-center px-4 gap-2 border-b border-zinc-300">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-400" />
            <div className="w-3 h-3 rounded-full bg-zinc-400" />
            <div className="w-3 h-3 rounded-full bg-zinc-400" />
          </div>
        </div>
        <div className="flex items-center gap-4 p-2 bg-zinc-100">
          {urlHotspotId ? (
            <Inspectable
              adId={ad.id}
              hotspotId={urlHotspotId}
              active={active(urlHotspotId)}
              className={active(urlHotspotId) ? "flex-1 min-w-0 px-1" : "flex-1 min-w-0"}
            >
              <div className="bg-white border border-zinc-300 rounded-md px-3 py-1.5 text-sm flex items-center gap-2 overflow-hidden shadow-sm">
                <Lock className="w-3 h-3 text-zinc-400 shrink-0" />
                <span className="text-zinc-600 truncate font-mono text-xs">{ad.formUrl}</span>
              </div>
            </Inspectable>
          ) : (
            <div className="flex-1 bg-white border border-zinc-300 rounded-md px-3 py-1.5 text-sm flex items-center gap-2 overflow-hidden shadow-sm">
              <Lock className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="text-zinc-600 truncate font-mono text-xs">{ad.formUrl}</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full px-4 pt-4 md:px-8 md:pt-8">
        <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-zinc-200 overflow-hidden">
          <div className="p-6 border-b border-zinc-200">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">{ad.formTitle}</h1>
            {ad.formBadge && (
              <Inspectable
                adId={ad.id}
                hotspotId="h1"
                active={active("h1")}
                className={active("h1") ? "inline-block mb-4 px-1" : "inline-block mb-4"}
              >
                <span className="inline-block bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold px-2 py-1 rounded">
                  {ad.formBadge}
                </span>
              </Inspectable>
            )}
            <p className="text-zinc-600 text-sm leading-relaxed">{ad.formBody}</p>
          </div>

          {remainingHotspots.length > 0 && (
            <div className="p-6 border-b border-zinc-200">
              <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">
                Offer details to inspect
              </div>
              <div className="space-y-2">
                {remainingHotspots.map((hotspot) => (
                  <Inspectable
                    key={hotspot.id}
                    adId={ad.id}
                    hotspotId={hotspot.id}
                    active={active(hotspot.id)}
                    className={active(hotspot.id) ? "block w-full px-3 py-2" : "block w-full"}
                  >
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3">
                      <span className="text-sm font-medium text-zinc-800">{hotspot.label}</span>
                      <span className="text-xs text-zinc-500">Cue</span>
                    </div>
                  </Inspectable>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 bg-zinc-50">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">
              Application fields
            </div>
            <div className="space-y-4">
              {ad.formFields.map((field) => renderField(field.label, field.demoValue, hotspotMap[field.label]))}
            </div>
            {ad.formFooter && <p className="mt-6 text-xs text-zinc-500 text-center">{ad.formFooter}</p>}
          </div>
        </div>
      </div>

      <InspectOverlay adId={ad.id} onDecide={handleDecision} />
    </div>
  );
}
