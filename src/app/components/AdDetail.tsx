import { useEffect } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router";
import { ads } from "../data";
import { Search, ShieldCheck, ShieldAlert } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAdInspection, type Verdict } from "../state/InspectionContext";

export function AdDetail() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const ad = ads.find((item) => item.id === adId);
  const { decide, isCompleted, reset } = useAdInspection(adId ?? "");

  useEffect(() => {
    if (adId && !isCompleted) reset();
  }, [adId, isCompleted, reset]);

  if (!ad || isCompleted) return <Navigate to="/board" replace />;

  const handleDecision = (verdict: Verdict) => {
    decide(verdict);
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

            <div className="whitespace-pre-wrap text-zinc-600 leading-relaxed">
              {ad.description}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-zinc-200 p-6 text-center">
          <div className="flex flex-col gap-3">
            <Link
              to={`/ad/${ad.id}/form`}
              replace
              className="w-full min-h-16 bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 py-5 px-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Search className="w-6 h-6" />
              Inspect the listing
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDecision("scam")}
                className="min-h-10 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                It’s a scam
              </button>
              <button
                type="button"
                onClick={() => handleDecision("not-scam")}
                className="min-h-10 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                It’s not a scam
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
