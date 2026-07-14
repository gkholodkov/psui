import React from "react";
import { Link, Navigate, useParams } from "react-router";
import { ads, checklist, type ChecklistKey } from "../data";
import { useAdInspection } from "../state/InspectionContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { CheckCircle, XCircle, ChevronDown, ChevronRight } from "lucide-react";

export function OutcomeScreen() {
  const { adId } = useParams();
  const ad = ads.find((item) => item.id === adId);
  const inspection = useAdInspection(adId ?? "");

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

  const headline = correctVerdict
    ? enoughEvidence
      ? "You made the call — and you can show why"
      : "Your instinct was right; now build the habit"
    : enoughEvidence
    ? "You found the clues, but the final call slipped"
    : "The page moved faster than your evidence";
  const body = correctVerdict
    ? enoughEvidence
      ? "You matched the offer and checked the cues that mattered. In real life, being able to explain a decision matters more than getting lucky."
      : "Your decision was right, but it was not backed by enough checks. Good judgment is a repeatable habit, not a lucky guess."
    : enoughEvidence
    ? "You did the detective work, but the verdict went the other way. That is useful practice: a strong process still needs a final pause before you commit."
    : "You did not have enough evidence to support the final call. When a page is moving quickly, slow the moment down and check the destination, data, payment, and pressure.";
  const tone = correctVerdict && enoughEvidence ? "success" : correctVerdict ? "warning" : "error";

  const orderedKeys = [
    ...ad.relevantChecklistKeys,
    ...checklist.map((item) => item.key).filter((key) => !ad.relevantChecklistKeys.includes(key)),
  ] as ChecklistKey[];
  const orderedChecklist = orderedKeys
    .map((key) => checklist.find((item) => item.key === key))
    .filter((item): item is (typeof checklist)[number] => Boolean(item));

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-zinc-900 p-6 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 flex flex-col items-center">
          {tone === "success" ? (
            <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
          ) : (
            <XCircle className={`w-16 h-16 mb-4 ${tone === "warning" ? "text-yellow-600" : "text-red-600"}`} />
          )}
          <h1
            className={`text-3xl font-bold mb-4 ${
              tone === "success" ? "text-green-700" : tone === "warning" ? "text-yellow-700" : "text-red-700"
            }`}
          >
            {headline}
          </h1>
          <p className="text-zinc-600 text-lg">{body}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-200 mb-6">
          <h2 className="font-bold text-zinc-900 mb-4">What your decision was built on</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl bg-zinc-50 p-3">
              <div className="text-zinc-500 mb-1">Verdict</div>
              <div className="font-semibold text-zinc-900">
                {inspection.state.verdict === "scam" ? "It’s a scam" : "It’s not a scam"}
              </div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3">
              <div className="text-zinc-500 mb-1">Key cues checked</div>
              <div className="font-semibold text-zinc-900">{mandatoryChecked} of {mandatory.length}</div>
              <div className="text-xs text-zinc-500 mt-1">Supported call: {threshold} or more</div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3">
              <div className="text-zinc-500 mb-1">Cues read accurately</div>
              <div className="font-semibold text-zinc-900">{mandatoryCorrect} of {mandatory.length}</div>
              <div className="text-xs text-zinc-500 mt-1">Extra clues add context</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-200 mb-6">
          <h2 className="font-bold text-zinc-900 mb-1">Take this habit with you</h2>
          <p className="text-sm text-zinc-600 mb-4">
            A polished page can still lead somewhere unsafe, and a messy page can still be legitimate. Before you click, pay, or share documents, check the destination, channel, data, payment timing, and pressure.
          </p>
          <div className="space-y-3">
            {orderedChecklist.map((item, index) => {
              const isRelevant = ad.relevantChecklistKeys.includes(item.key);
              return (
                <Collapsible
                  key={item.key}
                  defaultOpen={isRelevant}
                  className="bg-zinc-50 rounded-xl border border-zinc-200 group"
                >
                  <CollapsibleTrigger className="w-full p-4 flex items-start gap-3 text-left cursor-pointer">
                    <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-zinc-600 font-bold shrink-0 border border-zinc-200 text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-zinc-900">{item.title}</h3>
                        {isRelevant && (
                          <span className="text-[10px] uppercase tracking-wide font-semibold text-yellow-800 bg-yellow-100 px-2 py-0.5 rounded-full">
                            Matters in this case
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-600 text-sm leading-relaxed">{item.copy}</p>
                    </div>
                    <ChevronDown className="w-5 h-5 text-zinc-400 mt-1 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 pb-4 pl-14">
                    <div className="border-t border-zinc-200 pt-3 space-y-3">
                      <p className="text-sm text-zinc-700 leading-relaxed">{item.detail}</p>
                      <div className="text-sm bg-yellow-50 border border-yellow-200 rounded-md p-3 text-yellow-900">
                        <span className="font-semibold">{ad.title}:</span> {ad.checklistExamples[item.key]}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </div>
        </div>

        <Link
          to="/board"
          replace
          onClick={inspection.resetAll}
          className="w-full bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 py-4 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          Try another listing <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
