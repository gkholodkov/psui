import React, { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router";
import { ads } from "../data";
import { useAdInspection } from "../state/InspectionContext";
import { AlertTriangle, CheckCircle, ChevronRight, XCircle } from "lucide-react";

export function OutcomeScreen() {
  const { adId } = useParams();
  const ad = ads.find((item) => item.id === adId);
  const inspection = useAdInspection(adId ?? "");

  useEffect(() => {
    if (ad && inspection.state.verdict) {
      inspection.complete();
    }
  }, [ad, inspection.complete, inspection.state.verdict]);

  if (!ad || !inspection.state.verdict) return <Navigate to="/board" replace />;

  const mandatory = ad.hotspots.filter((hotspot) => hotspot.mandatory);
  const mandatoryChecked = mandatory.filter(
    (hotspot) => inspection.state.classifications[hotspot.id] !== undefined
  ).length;
  const mandatoryCorrect = mandatory.filter(
    (hotspot) => inspection.state.correct[hotspot.id] === true
  ).length;
  const threshold = Math.ceil(mandatory.length / 2);
  const enoughEvidence = mandatoryChecked >= threshold;
  const correctVerdict =
    (inspection.state.verdict === "scam") === (ad.type === "Scam");
  const inspectedCount = inspection.state.tapped.size;
  const misclassified = ad.hotspots.filter(
    (hotspot) => inspection.state.correct[hotspot.id] === false
  );
  const missedImportant = mandatory.filter(
    (hotspot) => inspection.state.classifications[hotspot.id] === undefined
  );

  const headline = correctVerdict
    ? enoughEvidence
      ? "You made the call — and you can show why"
      : "Your instinct was right; now build the habit"
    : enoughEvidence
    ? "You found the important details, but the final call slipped"
    : "The page moved faster than your evidence";

  const body = inspectedCount === 0
    ? "You made the call without reviewing any highlighted details. Pause on the route, the requests, and the timing before you decide."
    : correctVerdict
    ? enoughEvidence
      ? "Your decision matched the listing, and your checks gave it a clear basis."
      : "Your decision was right, but it was not backed by enough important checks. Good judgment is a repeatable habit, not a lucky guess."
    : enoughEvidence
    ? "You did the important checks, but the verdict went the other way. Use the evidence to pause once more before you commit."
    : "You did not have enough evidence to support the final call. Slow down and check the destination, data, payment, and pressure.";

  const tone = correctVerdict && enoughEvidence ? "success" : correctVerdict ? "warning" : "error";
  const reviewItems = [
    ...misclassified.map((hotspot) => ({
      id: `wrong-${hotspot.id}`,
      label: hotspot.label,
      answer: hotspot.tactic,
      copy: hotspot.incorrectFeedback,
    })),
    ...missedImportant.map((hotspot) => ({
      id: `missed-${hotspot.id}`,
      label: hotspot.label,
      answer: hotspot.tactic,
      copy: hotspot.feedback,
    })),
  ];

  const nextPath = inspection.sessionComplete ? "/takeaway" : "/board";
  const nextLabel = inspection.sessionComplete ? "See final takeaway" : "Check another listing";

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-zinc-900 p-6 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 flex flex-col items-center">
          {tone === "success" ? (
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
          ) : tone === "warning" ? (
            <AlertTriangle className="w-16 h-16 text-yellow-600 mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-600 mb-4" />
          )}
          <h1
            className={`text-3xl font-bold mb-4 ${
              tone === "success" ? "text-green-700" : tone === "warning" ? "text-yellow-700" : "text-red-700"
            }`}
          >
            {headline}
          </h1>
          <p className="text-zinc-600 text-lg max-w-2xl">{body}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-200 mb-6">
          <h2 className="font-bold text-zinc-900 mb-4">Your decision</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl bg-zinc-50 p-3">
              <div className="text-zinc-500 mb-1">Verdict</div>
              <div className="font-bold text-zinc-900">
                {inspection.state.verdict === "scam" ? "It’s a scam" : "It’s not a scam"}
              </div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3">
              <div className="text-zinc-500 mb-1">Details inspected</div>
              <div className="font-bold text-zinc-900">{inspectedCount}</div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3">
              <div className="text-zinc-500 mb-1">Important details read accurately</div>
              <div className="font-bold text-zinc-900">{mandatoryCorrect} of {mandatory.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-200 mb-6">
          <h2 className="font-bold text-zinc-900 mb-2">Why this listing mattered</h2>
          <p className="text-zinc-700 leading-relaxed">{ad.evidenceVerdict}</p>
        </div>

        {reviewItems.length > 0 ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-200 mb-6">
            <h2 className="font-bold text-zinc-900 mb-1">Review these details</h2>
            <p className="text-sm text-zinc-600 mb-4">
              Focus on the few details that would change your next action.
            </p>
            <div className="space-y-3">
              {reviewItems.map((item) => (
                <div key={item.id} className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
                  <div className="font-bold text-zinc-900">{item.label}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-yellow-800">
                    Read as: {item.answer}
                  </div>
                  <p className="mt-2 text-sm text-zinc-700 leading-relaxed">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        ) : inspectedCount > 0 ? (
          <div className="bg-green-50 rounded-2xl p-5 border border-green-200 mb-6">
            <h2 className="font-bold text-green-900 mb-1">You interpreted the details correctly</h2>
            <p className="text-sm text-green-800 leading-relaxed">
              You focused on the important signals without overreacting to ordinary listing details.
            </p>
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-200 mb-6">
            <h2 className="font-bold text-yellow-900 mb-1">Next time, inspect before deciding</h2>
            <p className="text-sm text-yellow-900 leading-relaxed">
              A quick first impression is only a starting point. Check the highlighted details before you click, pay, or share documents.
            </p>
          </div>
        )}

        <Link
          to={nextPath}
          replace
          className="w-full bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 py-4 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
        >
          {nextLabel} <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
