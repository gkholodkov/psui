import React, { useState } from "react";
import { Link, useLocation } from "react-router";
import { ads, checklist } from "../data";
import { useInspectionContext } from "../state/InspectionContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { CheckSquare, ChevronDown, Copy, Check, QrCode } from "lucide-react";

interface ChecklistLocationState {
  exampleAdId?: string;
}

export function ChecklistScreen() {
  const { lastAdId } = useInspectionContext();
  const location = useLocation();
  const locationState = location.state as ChecklistLocationState | null;
  const exampleAdId = locationState?.exampleAdId ?? lastAdId;
  const lastAd = exampleAdId ? ads.find((a) => a.id === exampleAdId) : undefined;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const lines = [
      "Before you apply, check 5 things",
      ...checklist.map(
        (item, i) =>
          `${i + 1}. ${item.title} — ${item.copy}\n   ${item.detail}` +
          (lastAd ? `\n   Example (${lastAd.title}): ${lastAd.checklistExamples[item.key]}` : "")
      ),
      "",
      "Campus reporting: report-rooms@your-university.example",
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore — clipboard may be unavailable in some browsers
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-zinc-900 p-6 flex flex-col">
      <div className="max-w-[700px] mx-auto w-full flex-1 flex flex-col">
        <div className="text-center mb-8 mt-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl mb-6 border border-yellow-200">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-zinc-900">Before you apply, check 5 things</h1>
          {lastAd && (
            <p className="text-sm text-zinc-500 mt-2">
              Examples below are from <strong className="text-zinc-700">{lastAd.title}</strong>.
            </p>
          )}
        </div>

        <div className="space-y-3 mb-8">
          {checklist.map((item, i) => (
            <Collapsible
              key={item.key}
              className="bg-white rounded-xl border border-zinc-200 shadow-sm group"
            >
              <CollapsibleTrigger className="w-full p-5 flex items-start gap-4 text-left cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600 font-bold shrink-0 border border-zinc-200">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-zinc-900 mb-1">{item.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{item.copy}</p>
                </div>
                <ChevronDown className="w-5 h-5 text-zinc-400 mt-1 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-5 pb-5 pl-[4.25rem]">
                <div className="border-t border-zinc-100 pt-3 space-y-3">
                  <p className="text-sm text-zinc-700 leading-relaxed">{item.detail}</p>
                  {lastAd && (
                    <div className="text-sm bg-yellow-50 border border-yellow-200 rounded-md p-3 text-yellow-900">
                      <span className="font-semibold">Example — {lastAd.title}:</span>{" "}
                      {lastAd.checklistExamples[item.key]}
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex items-center gap-6 mb-10 shadow-sm">
          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center shrink-0 border border-yellow-100">
            <QrCode className="w-12 h-12 text-zinc-900" />
          </div>
          <div>
            <h4 className="font-bold text-yellow-900 mb-1">Campus reporting</h4>
            <p className="text-yellow-700 text-sm">
              Report suspected scams to your university's housing desk. Placeholder contact:{" "}
              <span className="font-mono">report-rooms@your-university.example</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-zinc-200 text-center shadow-sm">
          <h3 className="font-bold text-lg text-zinc-900 mb-6">
            I know what to check before applying for a room.
          </h3>
          <div className="flex flex-col gap-3">
            <Link
              to="/board"
              replace
              className="flex-1 bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 py-3 px-4 rounded-xl font-semibold transition-colors shadow-sm"
            >
              Yes
            </Link>
            <Link
              to="/"
              replace
              className="flex-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 py-3 px-4 rounded-xl font-semibold transition-colors"
            >
              Not yet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
