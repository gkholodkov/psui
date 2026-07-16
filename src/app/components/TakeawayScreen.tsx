import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { ads, checklist, type ChecklistKey } from "../data";
import { useInspectionContext } from "../state/InspectionContext";
import {
  CheckCircle2,
  CreditCard,
  FileText,
  MapPin,
  MessageCircle,
  Play,
  Timer,
  X,
} from "lucide-react";
import destinationVideo from "../../../assets/video_destination.mp4";
import channelVideo from "../../../assets/video_channel.mp4";
import dataVideo from "../../../assets/video_data.mp4";
import paymentVideo from "../../../assets/video_payment.mp4";
import pressureVideo from "../../../assets/video_pressure.mp4";

type ChecklistMedia = {
  video: string;
  alt: string;
};

const checklistMedia: Record<ChecklistKey, ChecklistMedia> = {
  destination: {
    video: destinationVideo,
    alt: "Short animation showing how to compare a trusted housing domain with a look-alike domain",
  },
  channel: {
    video: channelVideo,
    alt: "Short animation comparing an in-platform housing chat with a private messenger",
  },
  data: {
    video: dataVideo,
    alt: "Short animation showing why identity documents should not be shared too early",
  },
  payment: {
    video: paymentVideo,
    alt: "Short animation showing the safer order of viewing, signing, and paying",
  },
  pressure: {
    video: pressureVideo,
    alt: "Short animation showing how urgency can interrupt a careful housing check",
  },
};

function ChecklistIcon({ itemKey }: { itemKey: ChecklistKey }) {
  const className = "h-5 w-5 text-zinc-700";

  switch (itemKey) {
    case "destination":
      return <MapPin className={className} />;
    case "channel":
      return <MessageCircle className={className} />;
    case "data":
      return <FileText className={className} />;
    case "payment":
      return <CreditCard className={className} />;
    case "pressure":
      return <Timer className={className} />;
  }
}

export function TakeawayScreen() {
  const navigate = useNavigate();
  const { completedAdIds, resetAll } = useInspectionContext();
  const [isRestarting, setIsRestarting] = useState(false);
  const [activeChecklistKey, setActiveChecklistKey] = useState<ChecklistKey | null>(null);
  const activeChecklist = checklist.find((item) => item.key === activeChecklistKey);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!activeChecklistKey) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveChecklistKey(null);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activeChecklistKey]);

  const startOver = () => {
    setIsRestarting(true);
    navigate("/", { replace: true });
    resetAll();
  };

  if (!isRestarting && completedAdIds.size < ads.length) {
    return <Navigate to="/board" replace />;
  }

  return (
    <main className="h-[100dvh] overflow-hidden bg-[#F5F5F5] p-4 text-zinc-900 sm:p-6">
      <div className="mx-auto flex h-full max-w-3xl flex-col">
        <header className="shrink-0 pb-3 text-center sm:pb-4">
          <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-green-600 sm:h-12 sm:w-12" />
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Session complete
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">Keep these five checks nearby</h1>
          <p className="mx-auto mt-1 max-w-xl text-sm text-zinc-600 sm:text-base">
            Open a check for a short reminder and one general rule to remember.
          </p>
        </header>

        <div className="grid min-h-0 flex-1 grid-rows-[repeat(5,minmax(0,1fr))] gap-2">
          {checklist.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveChecklistKey(item.key)}
              className="flex min-h-0 items-center gap-2 overflow-hidden rounded-xl border border-zinc-200 bg-white px-3 py-1.5 text-left shadow-sm transition-colors hover:border-[#b8912e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3B740] sm:gap-4 sm:px-4 sm:py-2"
              aria-label={`Open ${item.title} takeaway`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E3B740]/30 sm:h-11 sm:w-11">
                <ChecklistIcon itemKey={item.key} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-zinc-900 sm:text-base">{item.title}</div>
                <div className="truncate text-sm text-zinc-700">{item.takeaway}</div>
              </div>
              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-zinc-500">
                <Play className="h-3.5 w-3.5 fill-current" />
                Watch
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={startOver}
          className="mt-3 w-full shrink-0 rounded-xl bg-[#E3B740] px-4 py-3 font-bold text-zinc-900 transition-colors hover:bg-[#d6a935] sm:mt-4 sm:py-3.5"
        >
          Start over
        </button>
      </div>

      {activeChecklist && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/70 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeChecklist.title} takeaway`}
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveChecklistKey(null);
          }}
        >
          <div className="flex max-h-full w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex shrink-0 items-center gap-3 border-b border-zinc-200 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E3B740]/30">
                <ChecklistIcon itemKey={activeChecklist.key} />
              </div>
              <h2 className="min-w-0 flex-1 text-lg font-bold text-zinc-900">{activeChecklist.title}</h2>
              <button
                type="button"
                onClick={() => setActiveChecklistKey(null)}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E3B740]"
                aria-label="Close takeaway"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <video
              key={activeChecklist.key}
              className="h-[38dvh] max-h-80 w-full shrink-0 bg-zinc-950 object-contain"
              autoPlay
              muted
              playsInline
              controls={false}
              preload="auto"
              aria-label={checklistMedia[activeChecklist.key].alt}
            >
              <source src={checklistMedia[activeChecklist.key].video} type="video/mp4" />
              Your browser does not support video playback.
            </video>

            <div className="min-h-0 overflow-hidden px-4 py-4">
              <p className="text-sm font-semibold text-zinc-800">{activeChecklist.copy}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{activeChecklist.detail}</p>
              <div className="mt-3 rounded-lg bg-[#E3B740]/20 px-3 py-2 text-sm font-bold text-zinc-900">
                {activeChecklist.takeaway}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
