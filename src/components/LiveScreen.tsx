import React, { useEffect, useState } from "react";
import { Player, Team, AuctionState } from "../types";
import { Poppers } from "./Poppers";
import { formatChips } from "../utils/csvParser";
import {
  Trophy,
  Shield,
  Award,
  User,
  Coins,
  CheckCircle,
  Zap,
  XCircle,
} from "lucide-react";

interface LiveScreenProps {
  players: Player[];
  teams: Team[];
  state: AuctionState;
}

export const LiveScreen: React.FC<LiveScreenProps> = ({
  players,
  teams,
  state,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isUnsoldSplash, setIsUnsoldSplash] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffledPlayer, setShuffledPlayer] = useState<Player | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      if (state.animationEndsAt) {
        const remaining = Math.max(
          0,
          Math.ceil((state.animationEndsAt - Date.now()) / 1000),
        );
        setTimeLeft(remaining);
        setIsCelebrating(
          Date.now() < state.animationEndsAt && state.status === "sold",
        );
        setIsUnsoldSplash(
          Date.now() < state.animationEndsAt && state.status === "unsold",
        );
      } else {
        setIsCelebrating(false);
        setIsUnsoldSplash(false);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [state.animationEndsAt, state.status]);

  // Synchronized shuffling animation effect
  useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    let cycleInterval: NodeJS.Timeout;

    const checkShuffling = () => {
      const shufflingEndsAt = state.shufflingEndsAt;
      if (shufflingEndsAt && Date.now() < shufflingEndsAt) {
        setIsShuffling(true);
        const pool = players.filter(
          (p) => !p.isSold && !p.isUnsold && !p.isOwnerOrCoOwner,
        );
        if (pool.length > 0) {
          if (!cycleInterval) {
            cycleInterval = setInterval(() => {
              const rand = pool[Math.floor(Math.random() * pool.length)];
              setShuffledPlayer(rand);
            }, 80);
          }
        }
      } else {
        setIsShuffling(false);
        setShuffledPlayer(null);
        if (cycleInterval) {
          clearInterval(cycleInterval);
          cycleInterval = undefined as any;
        }
      }
    };

    checkShuffling();
    checkInterval = setInterval(checkShuffling, 100);

    return () => {
      clearInterval(checkInterval);
      if (cycleInterval) clearInterval(cycleInterval);
    };
  }, [state.shufflingEndsAt, players]);

  // Find current elements
  const currentPlayer = players.find((p) => p.id === state.currentPlayerId);
  const currentBidder = teams.find((t) => t.id === state.currentBidderId);

  // Celebratory elements
  const soldPlayer = players.find((p) => p.id === state.soldPlayerId);
  const soldToTeam = teams.find((t) => t.id === state.soldToTeamId);

  // Render stats progress bar with appropriate color
  const renderStatBar = (label: string, value: number, colorClass: string) => {
    return (
      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-700/50">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-bold tracking-wider text-slate-300 uppercase">
            {label}
          </span>
          <span className="text-sm font-black text-white">{value}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    );
  };

  // 6-Second Celebration View focusing only on the selected Player Card
  if (isCelebrating && soldPlayer && soldToTeam) {
    return (
      <div className="relative w-full min-h-[80vh] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden p-4 md:p-8">
        <div
          className="absolute inset-0 pointer-events-none opacity-90 bg-cover bg-center"
          style={{ backgroundImage: "url('/assets/poppers.gif')" }}
        />
        <Poppers active={isCelebrating} accentColor={soldToTeam.color} />

        {/* Glow Background matching team color */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: `${soldToTeam.color}15` }}
        />

        <div className="relative z-10 max-w-lg w-full space-y-6 flex flex-col items-center">
          {/* Top Header */}
          <div className="text-center mb-2">
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-slate-400">
              NOMINATION COMPLETE
            </h2>
          </div>

          {/* Centered Detailed Player Card styled with Team Color */}
          <div
            className="w-full flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 animate-fade-in"
            style={{
              border: `4px solid ${soldToTeam.color}`,
              boxShadow: `0 0 40px ${soldToTeam.color}40`,
            }}
          >
            {/* Card Header Bio */}
            <div className="relative bg-gradient-to-b from-slate-950 to-slate-900 p-6 flex flex-col items-center border-b border-slate-800">
              <div
                className="absolute top-3 right-4 text-xs font-mono font-black tracking-wider uppercase"
                style={{ color: soldToTeam.color }}
              >
                ACQUIRED
              </div>

              {/* Photo Frame */}
              <div className="relative my-4">
                <div
                  className="w-72 h-72 rounded-2xl overflow-hidden bg-slate-850 shadow-2xl flex items-center justify-center border-4"
                  style={{ borderColor: soldToTeam.color }}
                >
                  {soldPlayer.photoUrl && !imageError[soldPlayer.id] ? (
                    <img
                      src={soldPlayer.photoUrl}
                      alt={soldPlayer.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        setImageError((prev) => ({
                          ...prev,
                          [soldPlayer.id]: true,
                        }));
                      }}
                    />
                  ) : (
                    <User className="w-32 h-32 text-slate-600" />
                  )}
                </div>
                <div
                  className="absolute -bottom-3 -right-3 text-slate-950 font-black text-xl px-4 py-1 rounded-xl shadow-lg border"
                  style={{
                    backgroundColor: soldToTeam.color,
                    borderColor: "#fff",
                  }}
                >
                  ★ {soldPlayer.skillRating}
                </div>
              </div>

              <h3 className="text-3xl font-black uppercase text-center text-white tracking-wide mb-1">
                {soldPlayer.name}
              </h3>
              <span className="text-xs font-bold uppercase tracking-widest font-mono text-slate-400">
                {soldPlayer.role || "Draft Nominee"}
              </span>
            </div>

            {/* Individual Sport Ratings */}
            <div className="p-6 space-y-3 bg-slate-950/50">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {renderStatBar(
                  "Cricket",
                  soldPlayer.cricket,
                  "bg-gradient-to-r from-emerald-500 to-green-400",
                )}
                {renderStatBar(
                  "Football",
                  soldPlayer.football,
                  "bg-gradient-to-r from-sky-500 to-blue-400",
                )}
                {renderStatBar(
                  "Badminton",
                  soldPlayer.badminton,
                  "bg-gradient-to-r from-purple-500 to-pink-400",
                )}
                {renderStatBar(
                  "Table Tennis",
                  soldPlayer.tableTennis,
                  "bg-gradient-to-r from-orange-500 to-yellow-400",
                )}
              </div>
              <div className="mt-1">
                {renderStatBar(
                  "Carroms",
                  soldPlayer.carroms,
                  "bg-gradient-to-r from-teal-500 to-cyan-400",
                )}
              </div>
            </div>

            {/* Acquisition Banner at the bottom of the card */}
            <div
              className="p-5 text-center flex flex-col items-center justify-center border-t border-slate-800 gap-2"
              style={{
                backgroundColor: `${soldToTeam.color}10`,
              }}
            >
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                DRAFTED BY
              </span>
              <h4 className="text-2xl font-black uppercase text-white tracking-wide">
                {soldToTeam.name}
              </h4>
              <div className="inline-flex items-center gap-2 bg-black/60 px-5 py-2.5 rounded-xl border border-yellow-500/30">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-xl font-mono font-black text-yellow-400">
                  {formatChips(state.soldAmount || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar countdown */}
          <div className="w-full max-w-md mt-4">
            <div className="flex justify-between text-[11px] text-slate-400 uppercase tracking-widest font-mono mb-2">
              <span>
                {state.isAutoPilotActive
                  ? "Auto-loading next random candidate..."
                  : "Returning to dashboard..."}
              </span>
              <span>{timeLeft}s remaining</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${(timeLeft / 6) * 100}%`,
                  backgroundColor: soldToTeam.color,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6-Second Unsold/Skipped transition screen without player spotlight
  if (isUnsoldSplash) {
    return (
      <div className="relative w-full min-h-[80vh] flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden p-4 md:p-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 max-w-lg w-full space-y-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/40 px-4 py-2 rounded-full">
            <span className="w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-300">
              Nomination Closed
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-widest text-slate-200">
            SKIPPED
          </h2>

          <p className="text-sm text-slate-400 uppercase tracking-wider font-mono max-w-md">
            No player spotlight shown. Proceeding directly to the next nomination.
          </p>

          {/* Progress bar countdown */}
          <div className="w-full max-w-md mt-4">
            <div className="flex justify-between text-[11px] text-slate-400 uppercase tracking-widest font-mono mb-2">
              <span>
                {state.isAutoPilotActive
                  ? "Auto-loading next random candidate..."
                  : "Returning to dashboard..."}
              </span>
              <span>{timeLeft}s remaining</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-red-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${(timeLeft / 6) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Shuffling Screen View
  if (isShuffling && shuffledPlayer) {
    return (
      <div className="w-full min-h-[85vh] bg-slate-950 text-white p-6 md:p-8 flex flex-col justify-center items-center relative overflow-hidden">
        {/* Neon scanline overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />

        {/* Pulsing glow in the background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-xl w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white font-black text-xs px-5 py-2 rounded-full uppercase tracking-[0.25em] shadow-lg animate-bounce border border-blue-400">
            <Zap className="w-4 h-4 animate-spin text-yellow-300" />
            Random Pick Selector
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 uppercase tracking-widest animate-pulse">
            SHUFFLING REGISTER...
          </h2>
          <p className="text-slate-400 text-xs uppercase tracking-widest font-mono">
            Scanning remaining draft candidates
          </p>

          {/* Shuffling Card container with ultra premium futuristic border */}
          <div className="relative bg-slate-900/90 border-4 border-blue-500 rounded-3xl p-8 shadow-[0_0_40px_rgba(59,130,246,0.35)] transform scale-105 transition-all duration-75">
            <div className="absolute -top-3.5 left-6 bg-blue-500 text-slate-950 text-[9px] font-black uppercase px-3 py-0.5 rounded tracking-widest">
              SYSTEM AUTO-CHOICE
            </div>

            <div className="flex flex-col items-center">
              {/* Photo Frame */}
              <div className="relative mb-6">
                <div className="w-64 h-64 rounded-2xl border-4 border-blue-500/50 overflow-hidden bg-slate-800 shadow-2xl flex items-center justify-center">
                  {shuffledPlayer.photoUrl && !imageError[shuffledPlayer.id] ? (
                    <img
                      src={shuffledPlayer.photoUrl}
                      alt={shuffledPlayer.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        setImageError((prev) => ({
                          ...prev,
                          [shuffledPlayer.id]: true,
                        }));
                      }}
                    />
                  ) : (
                    <User className="w-24 h-24 text-slate-500" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-slate-950 font-black text-sm px-3 py-0.5 rounded-lg shadow">
                  ★ {shuffledPlayer.skillRating}
                </div>
              </div>

              <h3 className="text-3xl font-black uppercase text-white tracking-wide">
                {shuffledPlayer.name}
              </h3>
              <p className="text-xs font-bold text-blue-400 uppercase mt-1 tracking-wider">
                {shuffledPlayer.role || "Draft Candidate"}
              </p>

              <div className="mt-4 flex gap-4 text-xs font-mono text-slate-400">
                <span>Crick: {shuffledPlayer.cricket}</span>
                <span>•</span>
                <span>Footb: {shuffledPlayer.football}</span>
                <span>•</span>
                <span>Badm: {shuffledPlayer.badminton}</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs mx-auto bg-slate-900 border border-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Active Bidding Screen
  if (state.status === "bidding" && currentPlayer) {
    return (
      <div className="w-full min-h-[85vh] bg-slate-950 text-white p-6 md:p-8 flex flex-col justify-between">
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 mb-6 gap-4">
          <div>
            <span className="bg-blue-500 text-white font-extrabold text-xs px-3 py-1 rounded uppercase tracking-widest">
              Live Auction Block
            </span>
            <h2 className="text-2xl font-bold mt-1 tracking-tight">
              CURRENT NOMINEE
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
            <span className="text-sm font-mono tracking-widest text-slate-300 uppercase">
              Bidding Open
            </span>
          </div>
        </div>

        {/* Core Screen Division */}
        {!state.currentBidderId ? (
          <div className="max-w-7xl w-full mx-auto bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-stretch my-auto animate-fade-in">
            {/* Left Column: Player Main Bio */}
            <div className="md:w-1/2 relative bg-gradient-to-b from-blue-950 to-slate-900 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-800">
              {/* Photo Frame */}
              <div className="relative mb-6">
                <div className="w-96 h-96 md:w-[480px] md:h-[480px] rounded-2xl border-4 border-blue-500/50 overflow-hidden bg-slate-855 shadow-2xl flex items-center justify-center">
                  {currentPlayer.photoUrl && !imageError[currentPlayer.id] ? (
                    <img
                      src={currentPlayer.photoUrl}
                      alt={currentPlayer.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={() => {
                        setImageError((prev) => ({
                          ...prev,
                          [currentPlayer.id]: true,
                        }));
                      }}
                    />
                  ) : (
                    <User className="w-32 h-32 text-slate-500" />
                  )}
                </div>
              </div>

              <h3 className="text-4xl font-black uppercase text-center tracking-wide text-white mb-1">
                {currentPlayer.name}
              </h3>
              <p className="text-sm font-bold text-blue-400 uppercase tracking-widest font-mono">
                {currentPlayer.falaLeague === "Yes"
                  ? "✦ FALA LEAGUE PLAYER ✦"
                  : "Tournament Draft Pool"}
              </p>

              <div className="flex items-center gap-2 mt-3 bg-blue-600/30 border border-blue-500/40 px-4 py-1.5 rounded-full text-blue-300 text-sm font-black uppercase tracking-wide">
                ★ Overall Skill Rating: {currentPlayer.skillRating}
              </div>
            </div>

            {/* Right Column: Individual Sport Ratings & Info */}
            <div className="md:w-1/2 p-8 flex flex-col justify-between bg-slate-950/30">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Sport Specific Skill Metrics
                </h4>
                <div className="space-y-4">
                  {renderStatBar(
                    "Cricket",
                    currentPlayer.cricket,
                    "bg-gradient-to-r from-emerald-500 to-green-400",
                  )}
                  {renderStatBar(
                    "Football",
                    currentPlayer.football,
                    "bg-gradient-to-r from-sky-500 to-blue-400",
                  )}
                  {renderStatBar(
                    "Badminton",
                    currentPlayer.badminton,
                    "bg-gradient-to-r from-purple-500 to-pink-400",
                  )}
                  {renderStatBar(
                    "Table Tennis",
                    currentPlayer.tableTennis,
                    "bg-gradient-to-r from-orange-500 to-yellow-400",
                  )}
                  {renderStatBar(
                    "Carroms",
                    currentPlayer.carroms,
                    "bg-gradient-to-r from-teal-500 to-cyan-400",
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
                <span className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase block mb-1">
                  ★ NOMINATION LIVE ★
                </span>
                <p className="text-xs text-slate-400 font-mono">
                  Bidding is open! Minimum starting bid is 0 Chips.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto w-full">
            {/* Left Column: Player Card (6 Columns) */}
            <div className="lg:col-span-6 flex flex-col bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              {/* Player Main Bio */}
              <div className="relative bg-gradient-to-b from-blue-950 to-slate-900 p-6 flex flex-col items-center border-b border-slate-800">
                {/* Photo Frame */}
                <div className="relative mb-6">
                  <div className="w-80 h-80 md:w-[420px] md:h-[420px] rounded-2xl border-4 border-blue-500/50 overflow-hidden bg-slate-855 shadow-2xl flex items-center justify-center">
                    {currentPlayer.photoUrl && !imageError[currentPlayer.id] ? (
                      <img
                        src={currentPlayer.photoUrl}
                        alt={currentPlayer.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => {
                          setImageError((prev) => ({
                            ...prev,
                            [currentPlayer.id]: true,
                          }));
                        }}
                      />
                    ) : (
                      <User className="w-28 h-28 text-slate-500" />
                    )}
                  </div>
                </div>

                <h3 className="text-4xl font-black uppercase text-center tracking-wide text-white mb-1">
                  {currentPlayer.name}
                </h3>
                <p className="text-sm font-bold text-blue-400 uppercase tracking-widest font-mono">
                  {currentPlayer.falaLeague === "Yes"
                    ? "✦ FALA LEAGUE PLAYER ✦"
                    : "Tournament Draft Pool"}
                </p>

                <div className="flex items-center gap-2 mt-3 bg-blue-600/30 border border-blue-500/40 px-4 py-1.5 rounded-full text-blue-300 text-sm font-black uppercase tracking-wide">
                  ★ Overall Skill Rating: {currentPlayer.skillRating}
                </div>
              </div>

              {/* Individual Sport Ratings */}
              <div className="p-6 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Sport Specific Skill Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderStatBar(
                    "Cricket",
                    currentPlayer.cricket,
                    "bg-gradient-to-r from-emerald-500 to-green-400",
                  )}
                  {renderStatBar(
                    "Football",
                    currentPlayer.football,
                    "bg-gradient-to-r from-sky-500 to-blue-400",
                  )}
                  {renderStatBar(
                    "Badminton",
                    currentPlayer.badminton,
                    "bg-gradient-to-r from-purple-500 to-pink-400",
                  )}
                  {renderStatBar(
                    "Table Tennis",
                    currentPlayer.tableTennis,
                    "bg-gradient-to-r from-orange-500 to-yellow-400",
                  )}
                </div>
                <div className="mt-4">
                  {renderStatBar(
                    "Carroms",
                    currentPlayer.carroms,
                    "bg-gradient-to-r from-teal-500 to-cyan-400",
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Bid Stats (6 Columns) */}
            <div className="lg:col-span-6 flex flex-col justify-center gap-6">
              {/* Bid Status Panel */}
              <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[350px]">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

                <span className="text-sm font-bold tracking-[0.3em] text-blue-400 uppercase mb-4 block">
                  LEADING BID OFFER
                </span>

                {/* Giant Bid Display */}
                <div className="my-2 select-none animate-pulse">
                  <span className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 tracking-tight drop-shadow-[0_4px_10px_rgba(234,179,8,0.2)]">
                    {formatChips(state.currentBid)}
                  </span>
                </div>

                {/* Bidding Team Indicator */}
                {currentBidder ? (
                  <div
                    className="mt-6 px-8 py-4 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 w-full justify-center max-w-md"
                    style={{
                      borderColor: currentBidder.color,
                      backgroundColor: `${currentBidder.color}15`,
                    }}
                  >
                    <Shield
                      className="w-8 h-8 animate-pulse"
                      style={{ color: currentBidder.color }}
                    />
                    <div className="text-left">
                      <span className="text-xs text-slate-400 uppercase tracking-widest block font-bold">
                        HIGHEST BIDDER
                      </span>
                      <h4 className="text-2xl font-extrabold uppercase text-white">
                        {currentBidder.name}
                      </h4>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {/* Footer info banner */}
        <div className="border-t border-slate-900 pt-6 mt-6 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-xs gap-2">
          <span>Projector Display Mode — Press F11 to go full screen</span>
          <span>Falaliga 4.0 Auction © 2026</span>
        </div>
      </div>
    );
  }

  // Idle Display Screen (Waiting state)
  return (
    <div className="w-full min-h-[85vh] bg-slate-950 text-white p-8 flex flex-col justify-between">
      {/* Main graphic */}
      <div className="max-w-4xl mx-auto text-center my-auto flex flex-col items-center">
        {/* Giant branding marquee */}
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 p-12 rounded-3xl border border-blue-700/40 shadow-2xl max-w-2xl w-full mb-12 overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -inset-10 bg-repeat bg-[linear-gradient(-45deg,transparent,transparent_25%,rgba(255,255,255,.2)_25%,rgba(255,255,255,.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.2)_75%)] bg-[length:50px_50px]" />
          </div>

          <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
          <h2
            className="text-5xl md:text-6xl font-black tracking-widest text-white uppercase drop-shadow-lg"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.7)" }}
          >
            FALALIGA 4.0
          </h2>
          <p className="text-sm font-bold tracking-[0.3em] text-blue-300 uppercase mt-1">
            RISE AS ONE!
          </p>
          <div className="h-0.5 w-24 bg-blue-500 mx-auto my-4" />
          <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Build the Dream. Chase the Trophy.
          </p>
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide mb-3 uppercase">
          Welcome to the Falaliga 4.0 Player Auction
        </h3>
        <p className="text-slate-400 max-w-xl text-center mb-8 text-base">
          The stage is set, the teams are ready, and the excitement begins here.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-900 pt-6 mt-6 flex justify-between items-center text-slate-500 text-xs">
        <span>Awaiting administrator commands...</span>
        <span>Falaliga 4.0 Auction © 2026</span>
      </div>
    </div>
  );
};
