import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router";
import {
  ads,
  getExpectedChoice,
  type AnswerChoice,
  type Hotspot,
  type HotspotIcon,
} from "../data";
import { useAdInspection } from "../state/InspectionContext";
import {
  AlertTriangle,
  BadgeCheck,
  CheckCircle,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  FileWarning,
  Globe2,
  MessageCircle,
  XCircle,
} from "lucide-react";

function choiceLabel(choice?: AnswerChoice) {
  return choice ?? "Not checked";
}

type OutcomeTone = "success" | "warning" | "error";

function getOutcomePresentation(
  correctVerdict: boolean,
  enoughEvidence: boolean,
  inspectedCount: number
): { headline: string; body: string; tone: OutcomeTone } {
  let headline: string;
  if (correctVerdict) {
    headline = enoughEvidence ? "Correct" : "Correct answer, but not enough evidence";
  } else {
    headline = enoughEvidence
      ? "Trust the hints you've spotted during inspection"
      : "Stop and inspect before making a decision";
  }

  let body: string;
  if (inspectedCount === 0) {
    body =
      "You trusted luck instead of rationality. Estimate plausibility based on the facts before you decide.";
  } else if (correctVerdict && enoughEvidence) {
    body = "Your decision was correct, and was based on the facts. Great job.";
  } else if (correctVerdict) {
    body =
      "Your decision was correct, but it was not backed by reality check. Good judgment is a repeatable habit, not a lucky guess.";
  } else if (enoughEvidence) {
    body =
      "You spotted important details, but didn't trust them. Use the collected evidence to pause once more before you decide.";
  } else {
    body = "You need to stop for a moment and look for important hints before making a decision.";
  }

  const tone = correctVerdict && enoughEvidence ? "success" : correctVerdict ? "warning" : "error";

  return { headline, body, tone };
}

function createReviewItem(
  hotspot: Hotspot,
  kind: "wrong" | "missed",
  selected?: AnswerChoice
) {
  return {
    id: `${kind}-${hotspot.id}`,
    label: hotspot.label,
    selected,
    expected: getExpectedChoice(hotspot),
    technique: hotspot.technique,
    hint: hotspot.outcomeHint ?? hotspot.feedback,
    icon: hotspot.icon,
  };
}

function HintIcon({ icon }: { icon?: HotspotIcon }) {
  const className = "w-5 h-5";

  switch (icon) {
    case "route":
      return <Globe2 className={className} />;
    case "channel":
      return <MessageCircle className={className} />;
    case "data":
      return <FileWarning className={className} />;
    case "payment":
      return <CreditCard className={className} />;
    case "timing":
      return <Clock3 className={className} />;
    default:
      return <CircleHelp className={className} />;
  }
}

export function OutcomeScreen() {
  const { adId } = useParams();
  const ad = ads.find((item) => item.id === adId);
  const { state, complete, sessionComplete } = useAdInspection(adId ?? "");

  useEffect(() => {
    if (ad && state.verdict) complete();
  }, [ad, complete, state.verdict]);

  if (!ad || !state.verdict) return <Navigate to="/board" replace />;

  const mandatory = ad.hotspots.filter((hotspot) => hotspot.mandatory);
  const mandatoryCorrect = mandatory.filter(
    (hotspot) => state.correct[hotspot.id] === true
  ).length;
  const enoughEvidence = mandatoryCorrect >= 1;
  const correctVerdict = (state.verdict === "scam") === (ad.type === "Scam");
  const inspectedCount = state.tapped.size;
  const misclassified = ad.hotspots.filter((hotspot) => state.correct[hotspot.id] === false);
  const missedImportant = mandatory.filter(
    (hotspot) => state.classifications[hotspot.id] === undefined
  );

  const { headline, body, tone } = getOutcomePresentation(
    correctVerdict,
    enoughEvidence,
    inspectedCount
  );
  const reviewItems = [
    ...misclassified.map((hotspot) =>
      createReviewItem(hotspot, "wrong", state.classifications[hotspot.id])
    ),
    ...missedImportant.map((hotspot) => createReviewItem(hotspot, "missed")),
  ];

  const nextPath = sessionComplete ? "/takeaway" : "/board";
  const nextLabel = sessionComplete ? "See final takeaway" : "Check another listing";

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
                {state.verdict === "scam" ? "It’s a scam" : "It’s not a scam"}
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

        {reviewItems.length > 0 ? (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-zinc-200 mb-6">
            <h2 className="font-bold text-zinc-900 mb-1">{enoughEvidence ? "Additional details you could inspect" : "Reasonable details to inspect"}</h2>
            <br />
            <div className="space-y-3">
              {reviewItems.map((item) => (
                <div key={item.id} className="rounded-xl bg-zinc-50 border border-zinc-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E3B740]/30 flex items-center justify-center shrink-0 text-zinc-700">
                      <HintIcon icon={item.icon} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-zinc-900 break-all">{item.label}</div>
                      <p className="mt-1 text-sm text-zinc-700 leading-relaxed">{item.hint}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-white border border-zinc-200 px-3 py-2">
                      <div className="text-zinc-500">Your choice</div>
                      <div className="font-semibold text-zinc-800">{choiceLabel(item.selected)}</div>
                    </div>
                    <div className="rounded-lg bg-white border border-zinc-200 px-3 py-2">
                      <div className="text-zinc-500">Expected</div>
                      <div className="font-semibold text-zinc-800">{choiceLabel(item.expected)}</div>
                    </div>
                  </div>
                  {item.technique && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-900">
                      <BadgeCheck className="w-4 h-4" />
                      Scam technique: {item.technique}
                    </div>
                  )}
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
