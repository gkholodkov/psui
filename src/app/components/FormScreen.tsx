import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router";
import { ads } from "../data";
import { Lock, ArrowLeft } from "lucide-react";
import { InspectOverlay } from "./InspectOverlay";
import { Inspectable } from "./Inspectable";
import { useAdInspection } from "../state/InspectionContext";

// Maps form field labels to the hotspot id they correspond to, per ad.
// Fields not in this map render normally (no inspect ring).
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
  },
  D: {
    "Refundable holding fee — only after viewing, refundable until signature": "h2",
    "ID upload — only after viewing is confirmed": "h3",
  },
};

export function FormScreen() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const ad = ads.find((a) => a.id === adId);
  const [isInspecting, setIsInspecting] = useState(false);
  const inspection = useAdInspection(adId ?? "");

  useEffect(() => {
    if (adId) inspection.setActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adId]);

  if (!ad) return <Navigate to="/board" />;

  const hotspotMap = FORM_HOTSPOT_BY_AD[ad.id] ?? {};
  const isScam = ad.type === "Scam";
  const exposeBadgeHotspot = ad.id === "B"; // scarcity badge
  const exposeFormUrlHotspot = ad.id === "A"; // redirect URL on form chrome
  const answeredCount = ad.hotspots.filter(
    (h) => inspection.state.classifications[h.id] !== undefined
  ).length;

  const handleContinue = () => {
    if (isScam) {
      inspection.markContinued();
      // Only answered classifications count as inspection.
      const outcome = answeredCount > 0 ? "unsafe-after-inspect" : "unsafe";
      navigate(`/ad/${ad.id}/outcome/${outcome}`, { replace: true });
    } else {
      const outcome = answeredCount > 0 ? "safe-apply" : "safe-unverified";
      navigate(`/ad/${ad.id}/outcome/${outcome}`, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col text-zinc-900">
      {/* Fake Browser Chrome */}
      <div className={`bg-zinc-100 border-b border-zinc-300 shadow-sm flex flex-col ${isInspecting ? "mt-20" : ""}`}>
        <div className="h-10 bg-zinc-200 flex items-center px-4 gap-2 border-b border-zinc-300">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-400"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-400"></div>
            <div className="w-3 h-3 rounded-full bg-zinc-400"></div>
          </div>
        </div>
        <div className="flex items-center gap-4 p-2 bg-zinc-100">
          <Link to={`/ad/${ad.id}`} className="flex gap-2 text-zinc-500 hover:text-zinc-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          {exposeFormUrlHotspot ? (
            <Inspectable adId={ad.id} hotspotId="h2" active={isInspecting} className="flex-1 min-w-0">
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

      {/* Page Content */}
      <div
        className="w-full px-4 pt-4 pb-4 md:px-8 md:pt-8"
      >
        <div className="w-full bg-white rounded-xl shadow-md border border-zinc-200 overflow-hidden">
          <div className="p-6 border-b border-zinc-200">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">{ad.formTitle}</h1>
            {ad.formBadge && (
              exposeBadgeHotspot ? (
                <Inspectable adId={ad.id} hotspotId="h1" active={isInspecting} className="inline-block mb-4">
                  <span className="inline-block bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold px-2 py-1 rounded">
                    {ad.formBadge}
                  </span>
                </Inspectable>
              ) : (
                <span className="inline-block bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-semibold px-2 py-1 rounded mb-4">
                  {ad.formBadge}
                </span>
              )
            )}
            <p className="text-zinc-600 text-sm leading-relaxed">{ad.formBody}</p>
          </div>

          <div className="p-6 bg-zinc-50">
            <div className="space-y-4">
              {ad.formFields.map((field, i) => {
                const hotspotId = hotspotMap[field];
                const fieldRow = (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-zinc-700">{field}</label>
                    <div className="h-10 bg-white border border-zinc-300 rounded-md w-full cursor-not-allowed"></div>
                  </div>
                );
                if (hotspotId) {
                  return (
                    <Inspectable
                      key={i}
                      adId={ad.id}
                      hotspotId={hotspotId}
                      active={isInspecting}
                      className={isInspecting ? "block w-full px-3 py-2" : ""}
                    >
                      {fieldRow}
                    </Inspectable>
                  );
                }
                return <div key={i}>{fieldRow}</div>;
              })}
            </div>

            {ad.formFooter && (
              <p className="mt-6 text-xs text-zinc-500 text-center">{ad.formFooter}</p>
            )}
          </div>
        </div>
      </div>

      {/* Decision Footer */}
      {!isInspecting && (
        <div className="w-full px-4 md:px-8 pb-8">
          <div className="w-full bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3 text-center">
              Choose next action
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleContinue}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold text-center transition-colors ${
                  isScam ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                Continue
              </button>
              <button
                onClick={() => setIsInspecting(true)}
                className="flex-1 bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 py-3 px-4 rounded-xl font-semibold text-center transition-colors cursor-pointer"
              >
                Pause & inspect
              </button>
            </div>
          </div>
        </div>
      )}

      {isInspecting && <InspectOverlay adId={ad.id} onClose={() => setIsInspecting(false)} />}
    </div>
  );
}
