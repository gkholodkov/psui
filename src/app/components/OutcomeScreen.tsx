import React, { useEffect, useRef, useState } from "react";
import { useParams, Link, Navigate } from "react-router";
import { ads } from "../data";
import { useAdInspection } from "../state/InspectionContext";
import { CheckCircle, XCircle, Info, ArrowRight, ListChecks } from "lucide-react";

interface SessionSnapshot {
  answeredCount: number;
  total: number;
}

export function OutcomeScreen() {
  const { adId, outcomeType } = useParams();
  const ad = ads.find((a) => a.id === adId);
  const inspection = useAdInspection(adId ?? "");
  const resetOutcomeKeyRef = useRef<string | null>(null);
  const [sessionSnapshot, setSessionSnapshot] = useState<SessionSnapshot | null>(null);

  useEffect(() => {
    if (!ad || !outcomeType) return;

    const outcomeKey = `${ad.id}:${outcomeType}`;
    if (resetOutcomeKeyRef.current === outcomeKey) return;

    resetOutcomeKeyRef.current = outcomeKey;
    setSessionSnapshot({
      answeredCount: ad.hotspots.filter((h) => inspection.state.classifications[h.id] !== undefined).length,
      total: ad.hotspots.length,
    });
    inspection.resetAll();
  }, [ad, outcomeType, inspection.state.classifications, inspection.resetAll]);

  if (!ad || !outcomeType) return <Navigate to="/board" />;

  let headline = "";
  let body = "";
  let takeaway = "";
  let type: "success" | "error" | "warning" | "info" = "success";
  let lesson = "";
  let safeEvidence: string[] | null = null;
  let safeEvidenceHeading = "Safe signals you would have rejected:";

  if (outcomeType === "safe") {
    type = "success";
    headline = "Good call: you stopped before the risky step";
    body = "You checked the route, requested data, and timing before acting.";
    lesson = ad.outcomeSafeTactic || "";
    takeaway = "Verification should happen before documents, deposits, or private-channel contact.";
  } else if (outcomeType === "unsafe") {
    type = "error";
    headline = "Risky path: the scammer gets leverage";
    body = ad.outcomeUnsafeBody || "";
    takeaway = "Stop when the process asks for sensitive data or payment before verification.";
  } else if (outcomeType === "unsafe-after-inspect") {
    type = "warning";
    headline = "Research only helps if it changes the action";
    body = "You found the risk cues, but still continued through the unsafe route.";
    takeaway = "The goal is not only to notice red flags. The goal is to change the next action.";
  } else if (outcomeType === "safe-apply") {
    type = "success";
    headline = "Reasonable action: request viewing";
    body = "You checked the evidence before acting. The route is accountable, viewing comes before payment, and no sensitive document is requested early.";
    takeaway = "Verify first, then act safely.";
  } else if (outcomeType === "safe-unverified") {
    type = "warning";
    headline = "Safe offer, risky process";
    body = "This proposal was legitimate, so nothing bad happened. But you continued without answering any inspection prompt.";
    takeaway = "A good outcome is not proof that the method was safe. Verify evidence cues before you continue.";
    safeEvidenceHeading = "Evidence cues you skipped:";
    safeEvidence = ad.evidenceList.map((e) => `${e.cue}: ${e.interpretation}`);
  } else if (outcomeType === "false-positive") {
    type = "info";
    headline = "Suspicion means verify, not panic";
    body = "This listing had safer transaction patterns. Rejecting it on instinct would have cost you a legitimate room.";
    takeaway = "A single suspicious-looking step is not the same as a scam. Look at route, timing, and refund terms together.";
    safeEvidence = ad.evidenceList.map((e) => `${e.cue}: ${e.interpretation}`);
  } else if (outcomeType === "unnecessary-report") {
    // legacy slug — keep as alias of false-positive
    type = "info";
    headline = "Safe, but probably unnecessary";
    body = "This offer looked less polished, but the evidence was mostly safe.";
    takeaway = "Suspicion means verify, not panic.";
    safeEvidence = ad.evidenceList.map((e) => `${e.cue}: ${e.interpretation}`);
  } else {
    return <Navigate to="/board" />;
  }

  const answeredCount =
    sessionSnapshot?.answeredCount ??
    ad.hotspots.filter((h) => inspection.state.classifications[h.id] !== undefined).length;
  const total = sessionSnapshot?.total ?? ad.hotspots.length;
  const showInspectionStats = answeredCount > 0 || outcomeType === "safe-unverified";

  return (
    <div className="min-h-screen flex flex-col justify-center p-6 bg-[#F5F5F5] text-zinc-900">
      <div className="max-w-[700px] mx-auto w-full">
        <div className="text-center mb-8 flex flex-col items-center">
          {type === "success" && <CheckCircle className="w-16 h-16 text-green-600 mb-4" />}
          {type === "error" && <XCircle className="w-16 h-16 text-red-600 mb-4" />}
          {type === "warning" && <Info className="w-16 h-16 text-yellow-600 mb-4" />}
          {type === "info" && <Info className="w-16 h-16 text-blue-500 mb-4" />}

          <h1
            className={`text-2xl font-bold mb-4 ${
              type === "success"
                ? "text-green-700"
                : type === "error"
                ? "text-red-700"
                : type === "warning"
                ? "text-yellow-700"
                : "text-blue-700"
            }`}
          >
            {headline}
          </h1>

          <p className="text-zinc-600 text-lg">{body}</p>
        </div>

        {showInspectionStats && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6 border border-zinc-200 flex items-center justify-between">
            <div className="text-sm text-zinc-600">
              Inspection: <span className="font-semibold text-zinc-900">{answeredCount} of {total}</span> evidence cues checked
            </div>
          </div>
        )}

        {lesson && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6 border border-zinc-200">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-1">
              Tactic learned:
            </div>
            <div className="font-medium text-zinc-900">{lesson}</div>
          </div>
        )}

        {outcomeType === "unsafe" && (
          <div className="bg-red-50 rounded-xl p-4 shadow-sm mb-6 border border-red-200">
            <div className="text-xs uppercase tracking-wider text-red-700 font-semibold mb-2">
              What could be lost:
            </div>
            <ul className="text-sm text-red-900 space-y-1 list-disc list-inside pl-4">
              <li>Money</li>
              <li>Identity documents</li>
              <li>Phone number</li>
              <li>Bank details</li>
              <li>Control over the conversation</li>
            </ul>
          </div>
        )}

        {safeEvidence && (
          <div
            className={`rounded-xl p-4 shadow-sm mb-6 border ${
              outcomeType === "safe-unverified"
                ? "bg-yellow-50 border-yellow-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div
              className={`text-xs uppercase tracking-wider font-semibold mb-2 ${
                outcomeType === "safe-unverified" ? "text-yellow-800" : "text-blue-800"
              }`}
            >
              {safeEvidenceHeading}
            </div>
            <ul
              className={`text-sm space-y-1 list-disc list-inside pl-4 ${
                outcomeType === "safe-unverified" ? "text-yellow-900" : "text-blue-900"
              }`}
            >
              {safeEvidence.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        <div
          className={`rounded-xl p-5 mb-8 border shadow-sm ${
            type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : type === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : type === "warning"
              ? "bg-yellow-50 border-yellow-200 text-yellow-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <div className="font-bold mb-1">Takeaway</div>
          <div>{takeaway}</div>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/"
            replace
            className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
              type === "error" || type === "warning"
                ? "bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 shadow-sm"
                : "bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-700 shadow-sm"
            }`}
          >
            Back to start <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/checklist"
            state={{ exampleAdId: ad.id }}
            className="w-full bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors mt-2 shadow-sm"
          >
            <ListChecks className="w-5 h-5" />
            Show checklist
          </Link>
        </div>
      </div>
    </div>
  );
}
