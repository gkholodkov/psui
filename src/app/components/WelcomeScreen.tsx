import React from "react";
import { Link } from "react-router";
import { ArrowUp } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-sans">
      <div className="flex flex-col justify-center w-full min-h-[62vh] py-16 px-8 md:px-10 relative z-10">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-semibold mb-5">
          A housing-scam reality check
        </p>
        <h1 className="w-full text-[3.5rem] md:text-[4.5rem] leading-[1.02] font-semibold text-zinc-900 mb-8 tracking-tight">
          Would you spot the <span className="text-[#E3B740]">scam?</span>
        </h1>

        <p className="w-full text-2xl text-zinc-800 mb-10 font-medium">
          Three rooms. Three ways a listing can fool you. Check the route, the requests, and the
          pressure before you trust the offer.
        </p>

        <div className="flex flex-col gap-5 w-full z-10 mb-8 relative">
          <Link
            to="/board"
            replace
            className="w-full bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900 py-5 rounded-[2.5rem] font-semibold text-xl text-center transition-colors shadow-sm"
          >
            Tap to start
          </Link>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 -translate-y-[35%]"
          >
            <div className="motion-safe:animate-[welcome-arrow-bob_2.4s_ease-in-out_infinite]">
              <ArrowUp
                className="h-[44vh] w-[20vw] min-w-14 max-w-48 text-[#E3B740] sm:h-[58vh] sm:w-[17vw] md:h-[72vh] md:w-[15vw] md:max-w-[220px]"
                strokeWidth={1.25}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="w-full relative flex-1 min-h-[300px] -mt-20 z-0 flex flex-col">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#F5F5F5] to-transparent z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1625585598750-3535fe40efb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMHJvb20lMjB5ZWxsb3clMjBhcm1jaGFpciUyMHBsYW50fGVufDF8fHx8MTc4MDY1OTc0MXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Empty room with yellow armchair"
          className="w-full h-full flex-1 object-cover object-bottom"
        />
      </div>

      <footer className="w-full bg-white py-8 px-10 text-center z-20">
        <p className="text-zinc-600 font-medium">A learning prototype by LMU Munich</p>
      </footer>
    </div>
  );
}
