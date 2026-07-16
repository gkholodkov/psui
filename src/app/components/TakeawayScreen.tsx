import React, { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { ads, checklist, type ChecklistKey } from "../data";
import { useInspectionContext } from "../state/InspectionContext";
import {
  CheckCircle2,
  ChevronDown,
  CreditCard,
  FileText,
  MapPin,
  MessageCircle,
  Timer,
} from "lucide-react";
import takeawayVideo from "../../../assets/video_nomango.mp4";

type ChecklistMedia = {
  src: string;
  alt: string;
};

const checklistMedia: Record<ChecklistKey, ChecklistMedia> = {
  destination: {
    src: "/assets/photo1.jpg",
    alt: "Example photo for checking where a housing link leads",
  },
  channel: {
    src: "/assets/photo2.jpg",
    alt: "Example photo for keeping a housing conversation on-platform",
  },
  data: {
    src: "/assets/photo3.jpg",
    alt: "Example photo for protecting identity and financial documents",
  },
  payment: {
    src: "/assets/photo4.jpg",
    alt: "Example photo for checking a payment request",
  },
  pressure: {
    src: "/assets/photo5.jpg",
    alt: "Example photo for recognizing pressure in a housing offer",
  },
};

function ChecklistIcon({ itemKey }: { itemKey: ChecklistKey }) {
  const className = "w-5 h-5 text-zinc-700";

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
  const [showIntroVideo, setShowIntroVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastVideoTimeRef = useRef(0);

  useEffect(() => {
    if (!showIntroVideo) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showIntroVideo]);

  const startOver = () => {
    setIsRestarting(true);
    navigate("/", { replace: true });
    resetAll();
  };

  const keepVideoUnskippable = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime > lastVideoTimeRef.current + 0.5) {
      video.currentTime = lastVideoTimeRef.current;
      return;
    }

    lastVideoTimeRef.current = video.currentTime;
  };

  const keepVideoPlaying = () => {
    const video = videoRef.current;
    if (video && !video.ended) {
      void video.play().catch(() => undefined);
    }
  };

  if (!isRestarting && completedAdIds.size < ads.length) {
    return <Navigate to="/board" replace />;
  }

  if (showIntroVideo) {
    return (
      <div
        className="fixed inset-0 z-[100] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-black"
        role="dialog"
        aria-label="Scam safety video"
      >
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          autoPlay
          muted
          playsInline
          controls={false}
          disablePictureInPicture
          preload="auto"
          onTimeUpdate={keepVideoUnskippable}
          onSeeking={keepVideoUnskippable}
          onPause={keepVideoPlaying}
          onEnded={() => setShowIntroVideo(false)}
          aria-label="Short silent scam explainer"
        >
          <source src={takeawayVideo} type="video/mp4" />
          Your browser does not support video playback.
        </video>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] text-zinc-900 p-6 pb-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-3">
            Session complete
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Keep this checklist nearby</h1>
          <p className="text-zinc-600 text-lg">
            Before you click, pay, or share documents, run through these five checks.
          </p>
        </div>

        <div className="space-y-3">
          {checklist.map((item) => (
            <details
              key={item.key}
              className="group rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden"
            >
              <summary className="list-none cursor-pointer px-4 py-4 flex items-center gap-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#E3B740]">
                <div className="w-10 h-10 rounded-full bg-[#E3B740]/30 flex items-center justify-center shrink-0">
                  <ChecklistIcon itemKey={item.key} />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-zinc-900">{item.title}</div>
                  <div className="text-sm text-zinc-700 mt-0.5">{item.takeaway}</div>
                </div>
                <ChevronDown className="w-5 h-5 text-zinc-500 transition-transform group-open:rotate-180" />
              </summary>

              <div className="px-4 pb-5 pt-1 border-t border-zinc-200">
                <figure className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100">
                  <img
                    src={checklistMedia[item.key].src}
                    alt={checklistMedia[item.key].alt}
                    className="block h-48 w-full object-cover"
                  />
                </figure>

                <div className="mt-4">
                  <div className="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-2">
                    Examples from the listings
                  </div>
                  <div className="space-y-2">
                    {ads.map((ad) => (
                      <div key={`${item.key}-${ad.id}`} className="rounded-lg bg-zinc-50 border border-zinc-200 px-3 py-3">
                        <div className="text-xs font-semibold text-zinc-500 mb-1">Listing {ad.id}</div>
                        <div className="text-sm text-zinc-800">{ad.checklistExamples[item.key]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>

        <button
          type="button"
          onClick={startOver}
          className="w-full mt-6 bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 py-4 px-4 rounded-xl font-bold transition-colors"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
