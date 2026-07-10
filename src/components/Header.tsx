import React from "react";
import { Trophy, Award } from "lucide-react";

export const Header: React.FC<{ subtitle?: string }> = ({ subtitle }) => {
  // Clean subtitle and hide "LIVE DRAFT DISPLAY" as requested
  const displaySubtitle = subtitle && subtitle !== "LIVE DRAFT DISPLAY" ? subtitle : null;

  return (
    <div className="relative overflow-hidden bg-slate-900 border-b border-blue-900/40 py-5 px-8 shadow-2xl">
      {/* Premium ambient glow background */}
      <div className="absolute top-0 left-1/4 w-96 h-24 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-24 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between max-w-7xl mx-auto gap-4">
        {/* Brand Container */}
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-2.5 rounded-xl shadow-lg shadow-amber-500/20 ring-1 ring-white/10">
            <Trophy className="w-6 h-6 text-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-blue-200 uppercase">
                FALALIGA 4.0 - AUCTION
              </h1>
            </div>
            <p className="text-[10px] font-bold tracking-[0.3em] text-blue-400/80 uppercase">
              RISE AS ONE • OFFICIAL TOURNEY AUCTION
            </p>
          </div>
        </div>

        {/* Dynamic Screen Marker */}
        {displaySubtitle && (
          <div className="flex items-center gap-3 bg-slate-950/50 border border-blue-500/20 px-4 py-2 rounded-xl backdrop-blur-md self-start md:self-auto">
            <Award className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-slate-300 uppercase tracking-widest font-bold">
              {displaySubtitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
