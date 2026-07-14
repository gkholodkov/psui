import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { ads, checklist, type ChecklistKey } from "../data";
import { useInspectionContext } from "../state/InspectionContext";
import { CheckCircle2, CreditCard, FileText, MapPin, MessageCircle, Timer } from "lucide-react";

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

  if (!isRestarting && completedAdIds.size < ads.length) {
    return <Navigate to="/board" replace />;
  }

  const startOver = () => {
    setIsRestarting(true);
    navigate("/", { replace: true });
    resetAll();
  };

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

        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-zinc-200 space-y-3">
          {checklist.map((item) => (
            <div
              key={item.key}
              className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4"
            >
              <div className="w-10 h-10 rounded-full bg-[#E3B740]/30 flex items-center justify-center shrink-0">
                <ChecklistIcon itemKey={item.key} />
              </div>
              <div>
                <div className="font-bold text-zinc-900">{item.title}</div>
                <div className="text-sm text-zinc-700 mt-0.5">{item.takeaway}</div>
              </div>
            </div>
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
