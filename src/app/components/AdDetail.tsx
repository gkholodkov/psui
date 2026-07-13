import React, { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router";
import { ads } from "../data";
import { ArrowLeft, ExternalLink, Search } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { InspectOverlay } from "./InspectOverlay";
import { Inspectable } from "./Inspectable";
import { useAdInspection } from "../state/InspectionContext";

export function AdDetail() {
  const { adId } = useParams();
  const ad = ads.find((a) => a.id === adId);
  const [isInspecting, setIsInspecting] = useState(false);
  const inspection = useAdInspection(adId ?? "");

  useEffect(() => {
    if (adId) inspection.setActive();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adId]);

  if (!ad) return <Navigate to="/board" />;

  // Hotspots are wired by id. On AdDetail we expose h1 (link preview) and h2 (URL preview)
  // for A; h1 (scarcity badge) for B; h1 (verified link), h4 (profile) for C;
  // h1 (URL preview), h4 (agent ID) for D. Form-side hotspots get exposed in FormScreen.
  const exposeLinkPreview = ad.id === "A" || ad.id === "C" || ad.id === "D";
  const linkPreviewHotspot = ad.id === "A" ? "h1" : ad.id === "C" ? "h1" : ad.id === "D" ? "h1" : "";
  const exposeScarcity = ad.id === "B";
  const exposeProfile = ad.id === "C";
  const exposeAgentId = ad.id === "D";

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-zinc-900">
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-10 px-4 py-3 flex items-center shadow-sm">
        <Link to="/board" className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-zinc-600" />
        </Link>
        <span className="ml-2 font-medium text-zinc-900">Board</span>
      </div>

      <div className={`w-full p-4 py-8 ${isInspecting ? "pt-24 pb-40" : ""}`}>
        <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden mb-8 ${
          ad.id === "B" ? "border-[#E3B740]" : "border-zinc-200"
        }`}>
          <div className="h-64 relative">
            <ImageWithFallback src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-6 gap-4">
              <h1 className="text-2xl font-bold text-zinc-900">{ad.title}</h1>
              <Inspectable adId={ad.id} hotspotId="h5" active={isInspecting} className="shrink-0 inline-block">
                <span className="text-xl font-bold text-zinc-900 bg-[#E3B740] px-3 py-1 rounded-lg inline-block">
                  {ad.price}
                </span>
              </Inspectable>
            </div>

            <div className="prose max-w-none mb-8 whitespace-pre-wrap text-zinc-600">
              {ad.description}
            </div>

            <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-200 mb-6">
              <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Details</h3>
              <dl className="space-y-3">
                {Object.entries(ad.details).map(([key, value]) => {
                  const isLink = key === "Link preview";
                  const isAvailability = key === "Availability";
                  const isContact = key === "Contact";
                  const isPlatformProfile = key === "Platform profile";

                  let hotspotId = "";
                  if (isLink && exposeLinkPreview) hotspotId = linkPreviewHotspot;
                  else if (isPlatformProfile && exposeProfile) hotspotId = "h4";
                  else if (isContact && exposeAgentId) hotspotId = "h4";
                  else if (isContact) hotspotId = "h7";
                  else if (isAvailability) hotspotId = "h6";

                  const inner = (
                    <div className="flex flex-col sm:flex-row sm:gap-4">
                      <dt className="text-zinc-500 sm:w-1/3 text-sm">{key}</dt>
                      <dd className={`text-zinc-900 font-medium text-sm sm:w-2/3 break-all ${
                        isLink ? "text-blue-600 underline" : ""
                      }`}>
                        {value}
                      </dd>
                    </div>
                  );

                  if (hotspotId) {
                    return (
                      <Inspectable
                        key={key}
                        adId={ad.id}
                        hotspotId={hotspotId}
                        active={isInspecting}
                        className={isInspecting ? "block w-full px-3 py-2" : ""}
                      >
                        {inner}
                      </Inspectable>
                    );
                  }
                  return <div key={key}>{inner}</div>;
                })}
              </dl>
            </div>

            {exposeScarcity && (
              <Inspectable adId={ad.id} hotspotId="h1" active={isInspecting} className="mb-6 block">
                <div className="bg-yellow-50 text-yellow-800 border border-yellow-200 px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center">
                  2 viewing slots left this week
                </div>
              </Inspectable>
            )}
          </div>
        </div>

        {!isInspecting && (
          <div className="bg-white rounded-2xl shadow-lg border border-zinc-200 p-6 text-center mt-6">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">
              Next step
            </div>
            <div className="flex flex-col gap-3">
              <Link
                to={`/ad/${ad.id}/form`}
                className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Open link
              </Link>
              <button
                onClick={() => setIsInspecting(true)}
                className="flex-1 bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Search className="w-5 h-5" />
                Inspect first
              </button>
            </div>
          </div>
        )}
      </div>

      {isInspecting && (
        <InspectOverlay adId={ad.id} onClose={() => setIsInspecting(false)} />
      )}
    </div>
  );
}
