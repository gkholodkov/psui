import React from "react";
import { useParams, Link, Navigate } from "react-router";
import { ads } from "../data";
import { useAdInspection } from "../state/InspectionContext";
import { ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, EyeOff } from "lucide-react";

export function EvidenceScreen() {
  const { adId } = useParams();
  const ad = ads.find((a) => a.id === adId);
  const inspection = useAdInspection(adId ?? "");

  if (!ad) return <Navigate to="/board" />;

  const isSafe = ad.type !== "Scam";
  const { classifications, correct } = inspection.state;

  const inspectedHotspots = ad.hotspots.filter((h) => classifications[h.id] !== undefined);
  const missedHotspots = ad.hotspots.filter((h) => classifications[h.id] === undefined);
  const misclassifiedHotspots = ad.hotspots.filter(
    (h) => classifications[h.id] !== undefined && correct[h.id] === false
  );

  const continueRoute = isSafe ? "safe-apply" : "unsafe-after-inspect";
  const rejectRoute = isSafe ? "false-positive" : "safe";
  const evidenceGuidance = isSafe
    ? "These signals support proceeding cautiously; they are not a guarantee."
    : "These signals should stop the process before you share data or money.";

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-12 text-zinc-900">
      <div className="w-full p-4 py-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-6 text-center">Evidence summary</h1>

        <div
          className={`p-6 rounded-2xl mb-8 flex items-start gap-4 ${
            isSafe ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}
        >
          {isSafe ? (
            <ShieldCheck className="w-8 h-8 text-green-600 shrink-0" />
          ) : (
            <ShieldAlert className="w-8 h-8 text-red-600 shrink-0" />
          )}
          <div>
            <h2 className={`font-bold text-lg mb-1 ${isSafe ? "text-green-800" : "text-red-800"}`}>
              {isSafe ? "Looks safer" : "High risk"}
            </h2>
            <p className={isSafe ? "text-green-700" : "text-red-700"}>{ad.evidenceVerdict}</p>
          </div>
        </div>

        {/* Inspected */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-zinc-700" />
            <h3 className="font-bold text-zinc-900">What you inspected</h3>
            <span className="text-xs text-zinc-500">({inspectedHotspots.length})</span>
          </div>
          {inspectedHotspots.length === 0 ? (
            <div className="bg-white rounded-xl border border-zinc-200 p-4 text-sm text-zinc-500">
              You did not answer any inspection prompt. Decisions without evidence are guesses.
            </div>
          ) : (
            <ul className="space-y-2">
              {inspectedHotspots.map((h) => {
                const choice = classifications[h.id];
                const isCorrect = correct[h.id];
                return (
                  <li
                    key={h.id}
                    className="bg-white rounded-xl border border-zinc-200 p-4 flex items-start gap-3"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-zinc-900 text-sm mb-1">{h.label}</div>
                      <div className="text-xs text-zinc-600">{h.feedback}</div>
                    </div>
                    {choice !== undefined && (
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded shrink-0 ${
                          isCorrect
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-yellow-50 text-yellow-800 border border-yellow-200"
                        }`}
                      >
                        {choice}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Missed */}
        {missedHotspots.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <EyeOff className="w-5 h-5 text-zinc-500" />
              <h3 className="font-bold text-zinc-900">What you missed</h3>
              <span className="text-xs text-zinc-500">({missedHotspots.length})</span>
            </div>
            <ul className="space-y-2">
              {missedHotspots.map((h) => (
                <li
                  key={h.id}
                  className="bg-zinc-50 rounded-xl border border-dashed border-zinc-300 p-4 flex items-start gap-3"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-zinc-700 text-sm mb-1">{h.label}</div>
                    <div className="text-xs text-zinc-500">{h.feedback}</div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded shrink-0 bg-white text-zinc-600 border border-zinc-200">
                    {h.tactic}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Misclassified */}
        {misclassifiedHotspots.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-bold text-zinc-900">What you misclassified</h3>
              <span className="text-xs text-zinc-500">({misclassifiedHotspots.length})</span>
            </div>
            <ul className="space-y-2">
              {misclassifiedHotspots.map((h) => (
                <li
                  key={h.id}
                  className="bg-yellow-50 rounded-xl border border-yellow-200 p-4"
                >
                  <div className="font-semibold text-yellow-900 text-sm mb-1">{h.label}</div>
                  <div className="text-xs text-yellow-800 mb-2">{h.incorrectFeedback}</div>
                  <div className="text-xs text-yellow-900">
                    You picked <strong>{classifications[h.id]}</strong> — correct answer:{" "}
                    <strong>{h.tactic}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Evidence table */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden mb-8">
          <div className="px-4 py-3 border-b border-zinc-200 bg-zinc-50">
            <div className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">Evidence breakdown</div>
            <p className={`mt-1 text-xs normal-case tracking-normal font-normal ${isSafe ? "text-green-700" : "text-red-700"}`}>
              {evidenceGuidance}
            </p>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-zinc-600 font-medium border-b border-zinc-200">
              <tr>
                <th className="px-4 py-3">Signal</th>
                <th className="px-4 py-3">Evidence</th>
                <th className="px-4 py-3">Why it matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {ad.evidenceList.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 py-4 text-zinc-900 font-medium align-top">{item.cue}</td>
                  <td className="px-4 py-4 text-zinc-600 align-top font-mono text-xs break-all">
                    {item.evidence}
                  </td>
                  <td className="px-4 py-4 text-zinc-600 align-top">{item.interpretation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action footer */}
      <div className="px-4">
        <div className="w-full bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3 text-center">
            Choose next action
          </div>
          <div className="flex flex-col gap-3">
            {isSafe ? (
              <>
                <Link
                  to={`/ad/${ad.id}/outcome/${continueRoute}`}
                  replace
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors text-center"
                >
                  Request viewing
                </Link>
                <Link
                  to={`/ad/${ad.id}/outcome/${rejectRoute}`}
                  replace
                  className="flex-1 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-300 py-3 px-4 rounded-xl font-semibold transition-colors text-center"
                >
                  Report / do not continue
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/ad/${ad.id}/outcome/${rejectRoute}`}
                  replace
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors text-center"
                >
                  Report / do not continue
                </Link>
                <Link
                  to={`/ad/${ad.id}/outcome/${continueRoute}`}
                  replace
                  className="flex-1 bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-300 py-3 px-4 rounded-xl font-semibold transition-colors text-center"
                >
                  Continue
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
