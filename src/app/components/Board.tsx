import React from "react";
import { Link } from "react-router";
import { ads, type ListingFactIcon } from "../data";
import { CalendarDays, Eye, FileCheck2, Home, MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useInspectionContext } from "../state/InspectionContext";

function FactIcon({ icon }: { icon: ListingFactIcon }) {
  const className = "w-4 h-4 shrink-0 text-zinc-500";

  switch (icon) {
    case "location":
      return <MapPin className={className} />;
    case "home":
      return <Home className={className} />;
    case "calendar":
      return <CalendarDays className={className} />;
    case "viewing":
      return <Eye className={className} />;
    case "payment":
      return <FileCheck2 className={className} />;
  }
}

export function Board() {
  const { completedAdIds } = useInspectionContext();
  const completedCount = ads.filter((ad) => completedAdIds.has(ad.id)).length;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="bg-white text-zinc-900 px-6 py-8 shadow-sm text-center sticky top-0 z-10 border-b border-zinc-200">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-3">
          Housing board
        </p>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Which room would you trust?</h1>
        <p className="text-zinc-600 max-w-xl mx-auto">
          Three listings. Check the route, the requests, and the timing before you commit.
        </p>
        <div className="mt-5 inline-flex items-center rounded-full bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-700">
          {completedCount} of {ads.length} listings checked
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 gap-6">
          {ads.map((ad) => {
            const isCompleted = completedAdIds.has(ad.id);
            const card = (
              <div
                className={`rounded-2xl overflow-hidden flex flex-col shadow-md bg-white border transition-opacity ${
                  isCompleted ? "border-zinc-200 opacity-55 grayscale" : "border-zinc-200"
                }`}
              >
                <div className="h-56 overflow-hidden relative bg-zinc-200">
                  <ImageWithFallback
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  {isCompleted && (
                    <div className="absolute inset-0 bg-zinc-900/35 flex items-center justify-center">
                      <span className="rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-zinc-800 shadow-sm">
                        Checked
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-zinc-900">{ad.title}</h2>
                      <p className="mt-1 text-sm text-zinc-500">Housing listing</p>
                    </div>
                    <span className="shrink-0 text-lg font-bold text-zinc-900">{ad.price}</span>
                  </div>

                  <ul className="space-y-3 mb-6 text-sm flex-1">
                    {ad.cardFacts.map((fact) => (
                      <li key={`${ad.id}-${fact.text}`} className="flex items-start gap-3 text-zinc-700">
                        <FactIcon icon={fact.icon} />
                        <span className="leading-snug font-medium">{fact.text}</span>
                      </li>
                    ))}
                  </ul>

                  <span
                    className={`block w-full py-3 text-center rounded-xl font-semibold ${
                      isCompleted ? "bg-zinc-200 text-zinc-500" : "bg-zinc-900 text-white"
                    }`}
                  >
                    {isCompleted ? "Listing checked" : "Open listing"}
                  </span>
                </div>
              </div>
            );

            if (isCompleted) {
              return (
                <div key={ad.id} aria-disabled="true" aria-label={`${ad.title} has already been checked`}>
                  {card}
                </div>
              );
            }

            return (
              <Link
                key={ad.id}
                to={`/ad/${ad.id}`}
                replace
                aria-label={`Open listing: ${ad.title}`}
                className="block rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E3B740] hover:-translate-y-1 transition-transform"
              >
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
