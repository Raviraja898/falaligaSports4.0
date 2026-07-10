import { useState, useEffect } from "react";
import { AuctionData, Player, Team, AuctionState } from "./types";
import { Header } from "./components/Header";
import { LiveScreen } from "./components/LiveScreen";
import { AdminPanel } from "./components/AdminPanel";
import { TeamRosters } from "./components/TeamRosters";
import { Monitor, ShieldAlert, Users, RefreshCw } from "lucide-react";

export default function App() {
  const [data, setData] = useState<AuctionData | null>(null);
  const [activeScreen, setActiveScreen] = useState<
    "live" | "admin" | "rosters"
  >("live");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch auction data from server
  const fetchState = async () => {
    try {
      const res = await fetch("/api/state");
      if (res.ok) {
        const stateData: AuctionData = await res.json();
        setData(stateData);
        setError(null);
      } else {
        setError("Failed to retrieve current auction state from server");
      }
    } catch (err) {
      console.error("State polling error:", err);
      setError("Lost connection to Falaliga live server. Reconnecting...");
    } finally {
      setLoading(false);
    }
  };

  // Poll state every 1 second
  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6">
        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h3 className="text-xl font-bold uppercase tracking-wider">
          Connecting to Falaliga Auction 4.0 Server
        </h3>
        <p className="text-xs text-slate-400 mt-2 font-mono">
          Loading player pool and setting up draft trackers...
        </p>
      </div>
    );
  }

  // Safe fallback defaults
  const players: Player[] = data?.players || [];
  const teams: Team[] = data?.teams || [];
  const state: AuctionState = data?.state || {
    currentPlayerId: null,
    currentBid: 0,
    currentBidderId: null,
    status: "idle",
    isAutoBidding: false,
    lastBidTime: 0,
    soldPlayerId: null,
    soldToTeamId: null,
    soldAmount: null,
    animationEndsAt: null,
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Dynamic Header */}
      <Header
        subtitle={
          activeScreen === "live"
            ? "LIVE DRAFT DISPLAY"
            : activeScreen === "admin"
              ? "ADMINISTRATOR COMMAND PANEL"
              : "TEAM OWNERS REVIEW BOARD"
        }
      />

      {/* Screen Selection Subheader */}
      <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Quick Tabs */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveScreen("live")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeScreen === "live"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="w-4 h-4" /> Live Screen
            </button>
            <button
              onClick={() => setActiveScreen("admin")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeScreen === "admin"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ShieldAlert className="w-4 h-4" /> Admin Controls
            </button>
            <button
              onClick={() => setActiveScreen("rosters")}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                activeScreen === "rosters"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" /> Team Rosters
            </button>
          </div>

          {/* Connection Error Ribbon */}
          {error ? (
            <div className="text-xs text-red-400 font-bold bg-red-950/50 border border-red-900 px-3 py-1.5 rounded-lg animate-pulse uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0" />
              {error}
            </div>
          ) : (
            <div className="text-xs text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-900/40 px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shrink-0 animate-ping" />
              Live Connected
            </div>
          )}
        </div>
      </div>

      {/* Screen Render Switch */}
      <div className="flex-1 bg-slate-950">
        {activeScreen === "live" && (
          <LiveScreen players={players} teams={teams} state={state} />
        )}
        {activeScreen === "admin" && (
          <AdminPanel
            players={players}
            teams={teams}
            state={state}
            onRefreshState={fetchState}
          />
        )}
        {activeScreen === "rosters" && (
          <TeamRosters players={players} teams={teams} />
        )}
      </div>

      {/* Small Legal Footer */}
      <div className="bg-slate-900 border-t border-slate-850 py-4 px-6 text-center text-[10px] text-slate-500 uppercase tracking-widest font-mono">
        Falaliga Auction 4.0 Applet • Real-Time Digital Transcriber
      </div>
    </div>
  );
}
