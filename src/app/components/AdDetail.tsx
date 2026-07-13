import React, { useEffect } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router";
import { ads } from "../data";
import { ExternalLink, ShieldCheck, ShieldAlert } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAdInspection, type Verdict } from "../state/InspectionContext";

export function AdDetail() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const ad = ads.find((item) => item.id === adId);
  const inspection = useAdInspection(adId ?? "");

  useEffect(() => {
    if (adId) {
      inspection.reset();
      inspection.setActive();
    }
    // This screen starts a fresh session for the selected offer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adId]);

  if (!ad) return <Navigate to="/board" replace />;

  const handleDecision = (verdict: Verdict) => {
    inspection.decide(verdict);
    navigate(`/ad/${ad.id}/outcome`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-zinc-900">
      <div className="w-full px-4 py-8 md:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden mb-8">
          <div className="h-64 relative">
            <ImageWithFallback src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-6 gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-900">{ad.title}</h1>
              <span className="shrink-0 text-xl font-bold text-zinc-900 bg-[#E3B740] px-3 py-1 rounded-lg">
                {ad.price}
              </span>
            </div>

            <div className="whitespace-pre-wrap text-zinc-600 leading-relaxed mb-8">
              {ad.description}
            </div>

            <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200">
              <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Details</h2>
              <dl className="space-y-3">
                {Object.entries(ad.details).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="text-zinc-500 sm:w-1/3 text-sm">{key}</dt>
                    <dd className={`text-zinc-900 font-medium text-sm sm:w-2/3 break-all ${key === "Link preview" ? "text-blue-600" : ""}`}>
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-zinc-200 p-6 text-center">
          <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">
            Decide what to do next
          </div>
          <p className="text-sm text-zinc-600 mb-5">
            Trust your first impression, or inspect the application before deciding.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to={`/ad/${ad.id}/form`}
              replace
              className="w-full bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 py-4 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              Go to form to inspect
            </Link>
            <button
              type="button"
              onClick={() => handleDecision("scam")}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldAlert className="w-5 h-5" />
              It’s a scam
            </button>
            <button
              type="button"
              onClick={() => handleDecision("not-scam")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <ShieldCheck className="w-5 h-5" />
              It’s not a scam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
