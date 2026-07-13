import React from "react";
import { Link } from "react-router";
import { MangoBubble } from "./MangoBubble";
import { ads } from "../data";
import { Shield, Clock, MapPin, Eye } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Board() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="bg-white text-zinc-900 p-6 shadow-sm text-center sticky top-0 z-10 border-b border-zinc-200">
        <h1 className="text-2xl font-bold mb-2">Which room would you check first?</h1>
        <p className="text-zinc-600">3 offers. 45 seconds. One could cost you more than rent.</p>
        <div className="flex items-center justify-center gap-3 text-[11px] text-zinc-500 mt-3">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> No login</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> No typing</span>
          <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> No real data</span>
        </div>
      </div>
      
      <div className="max-w-[700px] mx-auto p-6 mt-6">
        <MangoBubble text="Pick any ad. I'll only explain after you decide." />
        
        <div className="grid grid-cols-1 gap-6 mt-8">
          {ads.map((ad) => (
            <div 
              key={ad.id} 
              className={`rounded-2xl overflow-hidden flex flex-col shadow-md transition-transform hover:-translate-y-1 bg-white border ${
                ad.id === "B" ? "border-[#E3B740] shadow-[#E3B740]/20" : "border-zinc-200"
              }`}
            >
              <div className="h-64 overflow-hidden relative">
                <ImageWithFallback 
                  src={ad.image} 
                  alt={ad.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-zinc-900 shadow-sm border border-zinc-100">
                  {ad.price}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h2 className={`text-xl font-bold mb-4 text-zinc-900 ${
                  ad.id === "B" ? "font-serif text-zinc-900" : ""
                }`}>{ad.title}</h2>
                
                <ul className="space-y-3 mb-6 text-sm flex-1">
                  {ad.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-600">
                      <div className="mt-0.5 text-zinc-400">
                        {i === 0 ? <MapPin className="w-4 h-4" /> : 
                         i === 1 ? <Clock className="w-4 h-4" /> : 
                         <Eye className="w-4 h-4" />}
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  to={`/ad/${ad.id}`} 
                  className={`block w-full py-3 text-center rounded-xl font-semibold transition-colors ${
                    ad.id === "B" ? "bg-[#E3B740] hover:bg-[#d6a935] text-zinc-900" :
                    "bg-zinc-100 hover:bg-zinc-200 text-zinc-800"
                  }`}
                >
                  {ad.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
