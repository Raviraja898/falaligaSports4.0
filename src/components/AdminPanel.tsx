import React, { useState, useEffect } from "react";
import { Player, Team, AuctionState, AuctionData } from "../types";
import { parseCSV, formatChips } from "../utils/csvParser";
import { 
  Trophy, Users, User, Plus, Trash2, Edit2, Upload, RefreshCw, 
  Download, Play, Pause, XCircle, CheckCircle, Search, Sparkles, Image as ImageIcon,
  ShieldAlert, Lock, Zap
} from "lucide-react";

interface AdminPanelProps {
  players: Player[];
  teams: Team[];
  state: AuctionState;
  onRefreshState: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ players, teams, state, onRefreshState }) => {
  const [activeTab, setActiveTab] = useState<"auction" | "teams" | "players" | "bulk">("auction");
  
  // Search and filter states
  const [playerSearch, setPlayerSearch] = useState("");
  const [teamSearch, setTeamSearch] = useState("");

  // CRUD Forms State
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Partial<Team> | null>(null);
  
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Partial<Player> | null>(null);

  // Bulk paste state
  const [bulkCSVText, setBulkCSVText] = useState("");
  const [bulkUploadError, setBulkUploadError] = useState("");
  const [bulkUploadSuccess, setBulkUploadSuccess] = useState("");

  // Password Authentication State
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem("isAdminUnlocked") === "true";
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "Ravi@445799") {
      setIsUnlocked(true);
      sessionStorage.setItem("isAdminUnlocked", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect password. Access denied.");
    }
  };

  // Auto-Pilot & Auto-Bidding client simulation state
  const [autoBidSpeed, setAutoBidSpeed] = useState<number>(2000); // 2 seconds between bids
  const [isSimulatingBids, setIsSimulatingBids] = useState(false);
  const [isAutoPilotMode, setIsAutoPilotMode] = useState(() => {
    return localStorage.getItem("isAutoPilotMode") === "true";
  });

  // Manual Allocation State
  const [manualAssignTeamId, setManualAssignTeamId] = useState("");
  const [manualAssignAmount, setManualAssignAmount] = useState(10000);

  // Shuffling states
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffledPlayer, setShuffledPlayer] = useState<Player | null>(null);

  // Synchronized shuffling animation effect
  useEffect(() => {
    let checkInterval: NodeJS.Timeout;
    let cycleInterval: NodeJS.Timeout;

    const checkShuffling = () => {
      const shufflingEndsAt = state.shufflingEndsAt;
      if (shufflingEndsAt && Date.now() < shufflingEndsAt) {
        setIsShuffling(true);
        const pool = players.filter((p) => !p.isSold && !p.isUnsold && !p.isOwnerOrCoOwner);
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

  // Sync manual assign amount with current draft state
  const currentPlayer = players.find((p) => p.id === state.currentPlayerId);
  const currentBidder = teams.find((t) => t.id === state.currentBidderId);

  useEffect(() => {
    if (currentPlayer) {
      setManualAssignAmount(state.currentBid || 10000);
      setManualAssignTeamId(state.currentBidderId || "");
    } else {
      setManualAssignAmount(10000);
      setManualAssignTeamId("");
    }
  }, [state.currentPlayerId, state.currentBid, state.currentBidderId]);

  // Persist Auto-Pilot Mode
  useEffect(() => {
    localStorage.setItem("isAutoPilotMode", String(isAutoPilotMode));
    if (isAutoPilotMode && state.status === "bidding") {
      setIsSimulatingBids(true);
    }
  }, [isAutoPilotMode, state.status]);

  // Sync with server isAutoPilotActive status
  useEffect(() => {
    if (state.isAutoPilotActive !== undefined && state.isAutoPilotActive !== isAutoPilotMode) {
      setIsAutoPilotMode(state.isAutoPilotActive);
    }
  }, [state.isAutoPilotActive]);

  // Available players who aren't drafted and aren't assigned as owner/co-owner
  const availablePlayers = players.filter(
    (p) => !p.isSold && !p.isUnsold && !p.isOwnerOrCoOwner
  );

  // Auto-Pilot nomination sequence
  useEffect(() => {
    if (!isAutoPilotMode) return;

    // If auction state is idle, nominate the next random player after a short rest delay
    if (state.status === "idle" && !state.currentPlayerId) {
      if (availablePlayers.length === 0) {
        setIsAutoPilotMode(false);
        return;
      }

      const timer = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * availablePlayers.length);
        const randomPlayer = availablePlayers[randomIndex];
        handleSelectPlayerForBidding(randomPlayer.id);
      }, 4000); // 4 seconds delay between draft block nominations

      return () => clearTimeout(timer);
    }

    // Force bidding simulation to run
    if (state.status === "bidding" && !isSimulatingBids) {
      setIsSimulatingBids(true);
    }
  }, [isAutoPilotMode, state.status, state.currentPlayerId, availablePlayers.length]);

  // Auto Bidding Simulator interval hook
  useEffect(() => {
    if (!isSimulatingBids || state.status !== "bidding" || !state.currentPlayerId) {
      setIsSimulatingBids(false);
      return;
    }

    const interval = setInterval(() => {
      // Find candidate teams that can place a bid
      const minNextBid = state.currentBid === 0 ? 10000 : state.currentBid + 10000;
      
      // Filter teams that have enough budget and are not already the high bidder
      const candidateTeams = teams.filter(
        (t) => t.budget >= minNextBid && t.id !== state.currentBidderId
      );

      if (candidateTeams.length === 0) {
        // No teams can bid, stop simulation
        setIsSimulatingBids(false);
        clearInterval(interval);

        // If in Full Auto-Pilot Mode, automatically sold/unsold the player
        if (isAutoPilotMode) {
          if (state.currentBidderId) {
            triggerAction("/api/auction/sold", {});
          } else {
            triggerAction("/api/auction/unsold", {});
          }
        }
        return;
      }

      // Pick a random team
      const randomTeam = candidateTeams[Math.floor(Math.random() * candidateTeams.length)];
      
      // Perform API call to place the bid
      fetch("/api/auction/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: randomTeam.id, amount: minNextBid }),
      })
        .then((res) => {
          if (res.ok) {
            onRefreshState();
          }
        })
        .catch((err) => console.error("Auto-bidding request failed", err));

    }, autoBidSpeed);

    return () => clearInterval(interval);
  }, [isSimulatingBids, state.currentBid, state.currentBidderId, state.currentPlayerId, state.status, teams, autoBidSpeed, isAutoPilotMode]);

  // Helper to trigger API actions
  const triggerAction = async (endpoint: string, body: any) => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        onRefreshState();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error || "Request failed"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Network error processing command");
    }
  };

  // Reset entire state
  const handleFullReset = async () => {
    if (confirm("Are you sure you want to RESET the entire database? All bids, custom teams, and custom players will be wiped clean!")) {
      await triggerAction("/api/state/reset", {});
    }
  };

  // Put a player on the auction block
  const handleSelectPlayerForBidding = (playerId: string) => {
    triggerAction("/api/auction/select", { playerId });
  };

  // Auto select a random nominee with a shuffling animation
  const handleAutoSelectNominee = () => {
    if (availablePlayers.length === 0) {
      alert("No available players remaining to nominate!");
      return;
    }
    triggerAction("/api/auction/auto-select", {});
  };

  // Place manual bid
  const handlePlaceBid = (teamId: string, amount: number) => {
    triggerAction("/api/auction/bid", { teamId, amount });
  };

  // Complete bidding: Sold
  const handleMarkSold = () => {
    triggerAction("/api/auction/sold", {});
    setIsSimulatingBids(false);
  };

  // Direct manual allocation submit
  const handleManualAllocationSubmit = () => {
    if (!manualAssignTeamId) return;
    const team = teams.find((t) => t.id === manualAssignTeamId);
    if (team && team.budget < manualAssignAmount) {
      alert(`Error: Team ${team.name} has insufficient budget (${formatChips(team.budget)}) for a bid of ${formatChips(manualAssignAmount)}`);
      return;
    }
    triggerAction("/api/auction/sold", { teamId: manualAssignTeamId, amount: manualAssignAmount });
    setIsSimulatingBids(false);
  };

  // Mark unsold
  const handleMarkUnsold = () => {
    if (confirm("Mark this player as UNSOLD?")) {
      triggerAction("/api/auction/unsold", {});
      setIsSimulatingBids(false);
    }
  };

  // Skip / Cancel Bidding
  const handleSkipBidding = () => {
    triggerAction("/api/auction/skip", {});
    setIsSimulatingBids(false);
  };

  // Team submit handler (Create / Update)
  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeam?.name) return;

    const payload = {
      action: editingTeam.id ? "update" : "create",
      team: {
        id: editingTeam.id,
        name: editingTeam.name,
        owner: editingTeam.owner || null,
        coOwner: editingTeam.coOwner || null,
        budget: Number(editingTeam.budget) || 1000000,
        color: editingTeam.color || "#3b82f6",
      },
    };

    await triggerAction("/api/teams", payload);
    setShowTeamModal(false);
    setEditingTeam(null);
  };

  // Player submit handler (Create / Update)
  const handlePlayerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayer?.name) return;

    const payload = {
      action: editingPlayer.id ? "update" : "create",
      player: {
        id: editingPlayer.id,
        name: editingPlayer.name,
        role: editingPlayer.role || "",
        badminton: Number(editingPlayer.badminton) || 0,
        carroms: Number(editingPlayer.carroms) || 0,
        cricket: Number(editingPlayer.cricket) || 0,
        football: Number(editingPlayer.football) || 0,
        tableTennis: Number(editingPlayer.tableTennis) || 0,
        skillRating: Number(editingPlayer.skillRating) || 0,
        falaLeague: editingPlayer.falaLeague || "No",
        photoUrl: editingPlayer.photoUrl || "",
        isSold: editingPlayer.isSold ?? false,
        soldTo: editingPlayer.soldTo || null,
        soldAmount: editingPlayer.soldAmount !== undefined ? Number(editingPlayer.soldAmount) : null,
        isUnsold: editingPlayer.isUnsold ?? false,
      },
    };

    await triggerAction("/api/players", payload);
    setShowPlayerModal(false);
    setEditingPlayer(null);
  };

  // Bulk upload submit
  const handleBulkCSVSubmit = async () => {
    setBulkUploadError("");
    setBulkUploadSuccess("");
    if (!bulkCSVText.trim()) {
      setBulkUploadError("CSV content cannot be blank");
      return;
    }

    try {
      const parsed = parseCSV(bulkCSVText);
      if (parsed.length === 0) {
        setBulkUploadError("No valid rows parsed. Check your headers and commas.");
        return;
      }

      await triggerAction("/api/players", {
        action: "bulk",
        playersList: parsed,
      });

      setBulkUploadSuccess(`Successfully drafted ${parsed.length} players into the draft registry!`);
      setBulkCSVText("");
    } catch (error) {
      setBulkUploadError(`Parsing failure: ${error}`);
    }
  };

  // Run local photo matching scans
  const handleAutoMergePhotos = async () => {
    try {
      const res = await fetch("/api/players/match-photos", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        alert(`Success! Automatically merged ${data.matchedCount} player photos from the '/public/players/' folder!`);
        onRefreshState();
      } else {
        alert("Failed to scan photo directory: " + (data.error || "Internal Error"));
      }
    } catch (error) {
      console.error(error);
      alert("Error matching photos on server");
    }
  };

  // Export and Download Team Rosters as CSV
  const handleExportTeamsCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Team,Owner,Co-Owner,Drafted Player,Skill Rating,Price Paid,Remaining Wallet Chips\n";

    teams.forEach((team) => {
      const roster = players.filter((p) => p.soldTo === team.id);
      
      // Add team summary row first
      csvContent += `"${team.name}","${team.owner || ""}","${team.coOwner || ""}","--- [TEAM BUDGET SUMMARY] ---","","","${team.budget}"\n`;
      
      // Add team members
      roster.forEach((player) => {
        csvContent += `"${team.name}","${team.owner || ""}","${team.coOwner || ""}","${player.name}","${player.skillRating}","${player.soldAmount}",""\n`;
      });
      csvContent += "\n"; // empty line separator
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Falaliga_Auction_Teams_Roster_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dropdown list of players to select for next nominee
  const eligibleOwners = players.filter(p => !p.isSold && !p.isUnsold);

  if (!isUnlocked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
          {/* Decorative ambient highlights */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <ShieldAlert className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white uppercase tracking-wider">
                Admin Authentication
              </h3>
              <p className="text-xs text-slate-400">
                Please enter the security password to unlock the Command Panel.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm font-bold tracking-wider placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  autoFocus
                />
              </div>

              {authError && (
                <div className="bg-red-950/40 border border-red-900 text-red-400 p-3 rounded-xl text-xs font-bold uppercase tracking-wide">
                  ⚠️ {authError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase py-3 rounded-xl transition-all shadow-lg shadow-blue-600/10 cursor-pointer"
              >
                Authenticate & Unlock
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800">
      
      {/* Tab Navigation Menu */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab("auction")}
          className={`px-5 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "auction"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🔨 Live Auction Control
        </button>
        <button
          onClick={() => setActiveTab("teams")}
          className={`px-5 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "teams"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🛡️ Manage Teams
        </button>
        <button
          onClick={() => setActiveTab("players")}
          className={`px-5 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "players"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🏃 Player Registry
        </button>
        <button
          onClick={() => setActiveTab("bulk")}
          className={`px-5 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "bulk"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          📥 Bulk Upload
        </button>
      </div>

      {/* --- SECTION 1: LIVE AUCTION CONTROL --- */}
      {activeTab === "auction" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active Control Block (7 Columns) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Advanced Draft Automation Center */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white border border-blue-800 p-5 rounded-2xl mb-6 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="font-extrabold text-blue-300 flex items-center gap-1.5 uppercase tracking-wide text-xs">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    🤖 Advanced Draft Automation Center
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1">
                    Control standalone bidding simulations or turn on full cinematic Auto-Pilot!
                  </p>
                </div>

                {/* Auto-Pilot Switch */}
                <div className="flex items-center gap-2 bg-slate-950/40 border border-slate-800 px-3 py-1.5 rounded-xl">
                  <label className="text-[10px] font-black uppercase tracking-wider text-blue-200 select-none cursor-pointer">
                    🚀 Full Auto-Pilot Mode
                  </label>
                  <input
                    type="checkbox"
                    checked={isAutoPilotMode}
                    onChange={(e) => {
                      const val = e.target.checked;
                      setIsAutoPilotMode(val);
                      localStorage.setItem("isAutoPilotMode", String(val));
                      triggerAction("/api/auction/toggle-autopilot", {});
                    }}
                    className="w-4 h-4 text-blue-600 border-slate-700 bg-slate-800 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-800/60 flex flex-wrap items-center justify-between gap-4">
                <div className="text-[10px] text-slate-300 max-w-sm">
                  {isAutoPilotMode ? (
                    <span className="text-emerald-400 font-bold uppercase tracking-wider block animate-pulse">
                      ● Auto-Pilot Engaged: Nominating random players, bidding, and selling automatically!
                    </span>
                  ) : state.status !== "bidding" ? (
                    <span>You are in Manual Mode. Use the right sidebar to select a player, or toggle Full Auto-Pilot to automate everything!</span>
                  ) : (
                    <span>You are in Manual Nomination mode. Use the right sidebar to select players.</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <select
                    className="bg-slate-950 border border-slate-800 text-white text-[10px] px-2.5 py-1.5 rounded-lg font-bold focus:outline-none"
                    value={autoBidSpeed}
                    onChange={(e) => setAutoBidSpeed(Number(e.target.value))}
                  >
                    <option value={1000}>Speed: Fast (1s)</option>
                    <option value={2000}>Speed: Medium (2s)</option>
                    <option value={4000}>Speed: Slow (4s)</option>
                  </select>

                  <button
                    onClick={() => setIsSimulatingBids(!isSimulatingBids)}
                    disabled={isAutoPilotMode || state.status !== "bidding"}
                    title={state.status !== "bidding" ? "Nominate a player first to simulate bids" : ""}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg shadow transition-all flex items-center gap-1.5 ${
                      isAutoPilotMode || state.status !== "bidding"
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : isSimulatingBids
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isSimulatingBids ? (
                      <>
                        <Pause className="w-3 h-3" /> Pause Bid Sim
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" /> Run Bid Sim
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            
            {isShuffling && shuffledPlayer ? (
              <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 shadow-xl text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                {/* Glowing effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
                
                <div className="relative z-10 space-y-6 max-w-md w-full">
                  <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-black uppercase px-3.5 py-1 rounded-full tracking-wider border border-blue-400">
                    <Zap className="w-3.5 h-3.5 animate-spin text-yellow-300" />
                    Selecting Random Nominee
                  </span>
                  
                  <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 uppercase tracking-widest animate-pulse">
                    ROLLING DRAFT POOL...
                  </h3>

                  {/* Cycling Player Showcase Card */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-inner flex items-center gap-4 justify-start text-left">
                    <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700 flex items-center justify-center">
                      {shuffledPlayer.photoUrl ? (
                        <img src={shuffledPlayer.photoUrl} alt={shuffledPlayer.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-8 h-8 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white uppercase">{shuffledPlayer.name}</h4>
                      <span className="text-[10px] font-bold text-blue-400 uppercase">★ Overall Rating: {shuffledPlayer.skillRating}</span>
                      <div className="text-[9px] text-slate-500 mt-0.5 font-mono">Crick: {shuffledPlayer.cricket} • Footb: {shuffledPlayer.football}</div>
                    </div>
                  </div>

                  <div className="w-full bg-slate-950 border border-slate-850 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full w-full animate-pulse" />
                  </div>
                </div>
              </div>
            ) : state.status === "bidding" && currentPlayer ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-extrabold text-xs px-4 py-1.5 rounded-full inline-block uppercase tracking-widest mb-4">
                  🚨 Active Nomination Draft
                </div>

                {/* Candidate Quick Look */}
                <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-slate-100 pb-6 mb-6">
                  <div className="w-28 h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center shrink-0">
                    {currentPlayer.photoUrl ? (
                      <img
                        src={currentPlayer.photoUrl}
                        alt={currentPlayer.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <User className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-3xl font-black uppercase text-slate-900 leading-tight">
                      {currentPlayer.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start items-center mt-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                        ★ Overall Skill Rating: {currentPlayer.skillRating}
                      </span>
                      <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-mono">
                        ID: {currentPlayer.id}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-bold uppercase">
                        FalaLeague: {currentPlayer.falaLeague}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Active Bid Pricing & Bids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border border-slate-200 p-6 rounded-2xl mb-6">
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                      Current Bid Valuation
                    </span>
                    <div className="text-4xl font-black text-blue-600 mt-1">
                      {formatChips(state.currentBid)}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Increments must be higher than current bid. Starting at 0.
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest block">
                      Leading Bid Owner
                    </span>
                    {currentBidder ? (
                      <div
                        className="mt-2 inline-flex items-center gap-2 px-4 py-2 border rounded-xl font-bold uppercase"
                        style={{
                          borderColor: currentBidder.color,
                          backgroundColor: `${currentBidder.color}11`,
                          color: currentBidder.color,
                        }}
                      >
                        <Trophy className="w-5 h-5" />
                        {currentBidder.name}
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-slate-400 block mt-2 font-mono">
                        No bidders yet. Awaiting opening bid.
                      </span>
                    )}
                  </div>
                </div>

                {/* ⚡ PROMINENT FAST DRAFT CONTROLS (AUTO BIDDING & SKIP) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Auto Bidding Box */}
                  <div className="bg-slate-900 text-white border-2 border-blue-600 p-5 rounded-2xl flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                          🤖 Auto-Bidding Control Option
                        </span>
                        <span className={`w-3 h-3 rounded-full ${isSimulatingBids ? "bg-emerald-500 animate-ping" : "bg-slate-700"}`} />
                      </div>
                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                        Starts the automatic draft bidder. Teams will bid against each other automatically using real balances.
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 mt-5">
                      <select
                        className="bg-slate-950 border border-slate-800 text-white text-[11px] px-3 py-2.5 rounded-xl font-bold focus:outline-none"
                        value={autoBidSpeed}
                        onChange={(e) => setAutoBidSpeed(Number(e.target.value))}
                      >
                        <option value={1000}>Fast (1s)</option>
                        <option value={2000}>Medium (2s)</option>
                        <option value={4000}>Slow (4s)</option>
                      </select>
                      <button
                        onClick={() => setIsSimulatingBids(!isSimulatingBids)}
                        disabled={isAutoPilotMode}
                        className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isAutoPilotMode
                            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                            : isSimulatingBids
                            ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {isSimulatingBids ? (
                          <>
                            <Pause className="w-4 h-4" /> Stop Auto Bidding
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" /> Start Auto Bidding
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Skip Player Box */}
                  <div className="bg-amber-50/80 border-2 border-amber-300 p-5 rounded-2xl flex flex-col justify-between shadow-md">
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                        ⏭️ Skip Player Option
                      </span>
                      <p className="text-[11px] text-amber-900 mt-2 leading-relaxed">
                        If no teams want the player, click to skip them. The profile is placed at the end of the draft and shown again at the very last.
                      </p>
                    </div>
                    <button
                      onClick={handleSkipBidding}
                      className="w-full mt-5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      ⏭️ Skip Player (Display Last)
                    </button>
                  </div>
                </div>



                {/* Instant Manual Allocation Form */}
                <div className="bg-amber-50/60 border border-amber-200/80 p-5 rounded-2xl mb-6 shadow-sm">
                  <h4 className="font-extrabold text-amber-950 flex items-center gap-1.5 uppercase tracking-wide text-xs">
                    ⚡ Instant Manual Draft Allocation (Direct Sale)
                  </h4>
                  <p className="text-[11px] text-amber-800/80 mt-1">
                    Directly type the final price and select a team to draft this player immediately, overriding active bidding.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Select Winning Team
                      </label>
                      <select
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                        value={manualAssignTeamId}
                        onChange={(e) => setManualAssignTeamId(e.target.value)}
                      >
                        <option value="">-- Choose Team --</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} (Wallet: {formatChips(t.budget)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Custom Price (Chips)
                      </label>
                      <input
                        type="number"
                        step="10000"
                        min="0"
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono focus:ring-1 focus:ring-blue-500 outline-none"
                        value={manualAssignAmount}
                        onChange={(e) => setManualAssignAmount(Number(e.target.value))}
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleManualAllocationSubmit}
                        disabled={!manualAssignTeamId}
                        className={`w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow ${
                          manualAssignTeamId
                            ? "bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" /> Approve & Sell Player
                      </button>
                    </div>
                  </div>
                </div>

                {/* Manual bidding interface */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                    Manual Incremental Bids (Standard Draft Panel)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {teams.map((t) => {
                      // Minimum bid amount
                      const nextBidAmount = state.currentBid === 0 ? 10000 : state.currentBid + 10000;
                      const hasEnoughWallet = t.budget >= nextBidAmount;
                      const isLeading = t.id === state.currentBidderId;

                      return (
                        <div
                          key={t.id}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center gap-1 mb-2 truncate">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: t.color }}
                            />
                            <span className="text-xs font-bold uppercase truncate">
                              {t.name}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mb-3">
                            Wallet: {formatChips(t.budget)}
                          </div>
                          <button
                            disabled={!hasEnoughWallet || isLeading}
                            onClick={() => handlePlaceBid(t.id, nextBidAmount)}
                            className={`w-full py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                              isLeading
                                ? "bg-yellow-500 text-slate-900 cursor-default"
                                : !hasEnoughWallet
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-white border border-blue-500 text-blue-600 hover:bg-blue-50"
                            }`}
                          >
                            {isLeading ? "★ LEADER" : `BID ${formatChips(nextBidAmount)}`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Final state actions */}
                <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-slate-100">
                  <button
                    onClick={handleMarkSold}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-600/10 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" /> SOLD (Complete Bidding)
                  </button>
                  <button
                    onClick={handleMarkUnsold}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm uppercase py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" /> Mark Unsold
                  </button>
                  <button
                    onClick={handleSkipBidding}
                    className="bg-slate-500 hover:bg-slate-600 text-white font-semibold text-sm uppercase py-3.5 px-6 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    ⏭️ Skip (Move to End)
                  </button>
                </div>
              </div>
            ) : (
              // Empty selection state
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center flex flex-col items-center justify-center space-y-6">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-full">
                  <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 uppercase">
                    No active draft nomination
                  </h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Select a player from the "Nominate Candidate" list on the right, or use the automatic picker to nominate a candidate at random.
                  </p>
                </div>

                <button
                  onClick={handleAutoSelectNominee}
                  disabled={availablePlayers.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs uppercase px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 border border-blue-500/30 cursor-pointer animate-pulse"
                >
                  🎲 Auto Nominate (Random Pick)
                </button>
              </div>
            )}

            {/* ⏱️ Recent Draft Results (Quick Edit Option to correct team selection) */}
            {players.filter((p) => p.isSold || p.isUnsold).length > 0 && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                    <span>⏱️ Recent Draft Results (Quick Edit Option)</span>
                  </h4>
                  <span className="text-[10px] text-blue-600 bg-blue-50 font-bold uppercase px-2 py-0.5 rounded-full">
                    Click "✏️ Correct" if you selected the wrong team or amount
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {players
                    .filter((p) => p.isSold || p.isUnsold)
                    .slice(-4)
                    .reverse()
                    .map((p) => {
                      const team = teams.find((t) => t.id === p.soldTo);
                      return (
                        <div
                          key={p.id}
                          className="bg-slate-50 border border-slate-150 p-3 rounded-xl flex items-center justify-between hover:border-blue-300 transition-all shadow-sm"
                        >
                          <div className="flex items-center gap-3 truncate">
                            <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-500 overflow-hidden shrink-0 uppercase border border-slate-100">
                              {p.photoUrl ? (
                                <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                p.name.slice(0, 2)
                              )}
                            </div>
                            <div className="truncate">
                              <h5 className="font-extrabold text-xs text-slate-900 uppercase truncate">{p.name}</h5>
                              {p.isSold && team ? (
                                <span className="text-[10px] font-black uppercase flex items-center gap-1 mt-0.5" style={{ color: team.color }}>
                                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: team.color }} />
                                  Sold: {team.name} ({formatChips(p.soldAmount || 0)})
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-orange-600 uppercase flex items-center gap-1 mt-0.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                                  Unsold
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setEditingPlayer(p);
                              setShowPlayerModal(true);
                            }}
                            className="bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg text-blue-600 shadow-sm transition-all shrink-0 cursor-pointer"
                          >
                            ✏️ Correct
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* General Database Tools */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                Tournament Tools & Operations
              </h4>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleExportTeamsCSV}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase py-2.5 px-4 rounded-lg flex items-center gap-2 shadow"
                >
                  <Download className="w-4 h-4" /> Export Teams CSV Roster
                </button>
                <button
                  onClick={handleAutoMergePhotos}
                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold uppercase py-2.5 px-4 rounded-lg flex items-center gap-2 shadow"
                >
                  <ImageIcon className="w-4 h-4" /> Auto-Merge Photos Folder
                </button>
                <button
                  onClick={handleFullReset}
                  className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase py-2.5 px-4 rounded-lg flex items-center gap-2 shadow ml-auto"
                >
                  <RefreshCw className="w-4 h-4" /> Reset Draft Database
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 font-mono">
                * Place your local player images into <strong>/public/players/</strong> named identically to their player names (e.g. "Mohit B.jpg") then click "Auto-Merge Photos Folder" to synchronize their profile graphics!
              </p>
            </div>
          </div>

          {/* Player nominator select sidebar (5 Columns) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 uppercase tracking-wide text-sm">
                Nominate Candidate ({availablePlayers.length})
              </h3>
              <button
                onClick={handleAutoSelectNominee}
                disabled={availablePlayers.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-xl shadow hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                🎲 AUTO PICK
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search available draft..."
                className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                value={playerSearch}
                onChange={(e) => setPlayerSearch(e.target.value)}
              />
            </div>

            {/* Nominate candidates list */}
            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1 border border-slate-100 rounded-xl p-2 bg-slate-50">
              {availablePlayers
                .filter((p) => p.name.toLowerCase().includes(playerSearch.toLowerCase()))
                .map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border border-slate-150 rounded-xl p-3 flex justify-between items-center hover:border-blue-400 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 overflow-hidden text-xs uppercase">
                        {p.photoUrl ? (
                          <img
                            src={p.photoUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          p.name.slice(0, 2)
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800 uppercase">
                          {p.name}
                        </h4>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-mono">
                          ★ Rating: {p.skillRating}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectPlayerForBidding(p.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg shadow transition-all"
                    >
                      Nominate
                    </button>
                  </div>
                ))}
              {availablePlayers.length === 0 && (
                <div className="text-center text-xs text-slate-400 py-8">
                  No unassigned players found in candidate registry.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION 2: TEAMS MANAGER --- */}
      {activeTab === "teams" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-black uppercase text-slate-900 tracking-wide">
                Tournament Team Directory
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure owner/co-owner players. They are automatically flagged and excluded from live nominations.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingTeam({ name: "", budget: 1000000, color: "#3b82f6" });
                setShowTeamModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create Team
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => {
              const roster = players.filter((p) => p.soldTo === team.id);
              return (
                <div
                  key={team.id}
                  className="border border-slate-200 rounded-2xl shadow-sm overflow-hidden bg-slate-50/50 hover:shadow transition-all"
                >
                  <div className="h-2" style={{ backgroundColor: team.color }} />
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-black uppercase text-slate-900 tracking-wide">
                          {team.name}
                        </h4>
                        <span className="text-xs font-mono font-bold text-blue-600">
                          ID: {team.id}
                        </span>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setEditingTeam(team);
                            setShowTeamModal(true);
                          }}
                          className="p-2 text-slate-500 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 rounded-lg shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete team "${team.name}"?`)) {
                              triggerAction("/api/teams", { action: "delete", team });
                            }
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 rounded-lg shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div>
                        <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wide block">
                          Assigned Owner (Fixed)
                        </span>
                        <span className="font-extrabold text-slate-800 text-sm">
                          {team.owner || "--- Unassigned ---"}
                        </span>
                      </div>
                      <div className="pt-2">
                        <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wide block">
                          Assigned Co-Owner (Fixed)
                        </span>
                        <span className="font-extrabold text-slate-800 text-sm">
                          {team.coOwner || "--- Unassigned ---"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-center bg-white p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Chips Purse
                        </span>
                        <div className="text-sm font-black text-slate-800 font-mono">
                          {formatChips(team.budget)}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          Roster Size
                        </span>
                        <div className="text-sm font-black text-slate-800 font-mono">
                          {roster.length} Drafted
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Team Form Modal */}
          {showTeamModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white px-6 py-4">
                  <h3 className="text-lg font-black uppercase tracking-wide">
                    {editingTeam?.id ? "Edit Team Profile" : "Create Team Profile"}
                  </h3>
                </div>
                <form onSubmit={handleTeamSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                      Team Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold"
                      value={editingTeam?.name || ""}
                      onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                        Purse Budget (Chips)
                      </label>
                      <input
                        type="number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-mono"
                        value={editingTeam?.budget ?? 1000000}
                        onChange={(e) => setEditingTeam({ ...editingTeam, budget: Number(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                        Brand Accent Color
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          className="w-12 h-10 rounded-xl border border-slate-200 p-1 cursor-pointer bg-white"
                          value={editingTeam?.color || "#3b82f6"}
                          onChange={(e) => setEditingTeam({ ...editingTeam, color: e.target.value })}
                        />
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                          value={editingTeam?.color || "#3b82f6"}
                          onChange={(e) => setEditingTeam({ ...editingTeam, color: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Owner assignment dropdown */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                      Select Team Owner (Fixed Player)
                    </label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                      value={editingTeam?.owner || ""}
                      onChange={(e) => setEditingTeam({ ...editingTeam, owner: e.target.value || null })}
                    >
                      <option value="">--- Unassigned ---</option>
                      {eligibleOwners.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} (★ {p.skillRating})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Co-Owner assignment dropdown */}
                  <div>
                    <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                      Select Team Co-Owner (Fixed Player)
                    </label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                      value={editingTeam?.coOwner || ""}
                      onChange={(e) => setEditingTeam({ ...editingTeam, coOwner: e.target.value || null })}
                    >
                      <option value="">--- Unassigned ---</option>
                      {eligibleOwners.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} (★ {p.skillRating})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTeamModal(false);
                        setEditingTeam(null);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-2.5 px-4 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow"
                    >
                      Save Team
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SECTION 3: PLAYERS REGISTRY --- */}
      {activeTab === "players" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black uppercase text-slate-900 tracking-wide">
                Player Registry Directory ({players.length})
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Manage the draft pool roster entries and skill ratings.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPlayer({
                  name: "",
                  role: "",
                  badminton: 50,
                  carroms: 50,
                  cricket: 50,
                  football: 50,
                  tableTennis: 50,
                  skillRating: 50,
                  falaLeague: "No",
                  photoUrl: "",
                });
                setShowPlayerModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Add Player
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search registry by player name..."
              className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
              value={playerSearch}
              onChange={(e) => setPlayerSearch(e.target.value)}
            />
          </div>

          {/* Player Grid Display */}
          <div className="max-h-[600px] overflow-y-auto border border-slate-150 rounded-2xl bg-slate-50 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {players
                .filter((p) => p.name.toLowerCase().includes(playerSearch.toLowerCase()))
                .map((p) => {
                  const draftTeam = teams.find((t) => t.id === p.soldTo);
                  return (
                    <div
                      key={p.id}
                      className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow transition-all relative flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200 flex items-center justify-center shrink-0">
                            {p.photoUrl ? (
                              <img
                                src={p.photoUrl}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <User className="w-6 h-6 text-slate-400" />
                            )}
                          </div>
                          <div className="truncate">
                            <h4 className="font-extrabold text-sm text-slate-900 uppercase truncate">
                              {p.name}
                            </h4>
                            <span className="text-[10px] font-bold text-blue-600 block">
                              ★ Rating: {p.skillRating}
                            </span>
                          </div>
                        </div>

                        {/* Status badge */}
                        <div className="pt-1">
                          {p.isSold && draftTeam ? (
                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Sold: {draftTeam.name} ({formatChips(p.soldAmount || 0)})
                            </span>
                          ) : p.isUnsold ? (
                            <span className="inline-flex items-center bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Unsold
                            </span>
                          ) : p.isOwnerOrCoOwner ? (
                            <span className="inline-flex items-center bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Assigned Officer
                            </span>
                          ) : (
                            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Draft Pool
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setEditingPlayer(p);
                            setShowPlayerModal(true);
                          }}
                          className="flex-1 py-1 px-2 border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-lg text-xs font-bold transition-all text-slate-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete player "${p.name}" from registry?`)) {
                              triggerAction("/api/players", { action: "delete", player: p });
                            }
                          }}
                          className="p-1 px-2 border border-slate-200 hover:border-red-500 hover:text-red-600 rounded-lg text-slate-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Player Modal Form */}
          {showPlayerModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 my-8">
                <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white px-6 py-4">
                  <h3 className="text-lg font-black uppercase tracking-wide">
                    {editingPlayer?.id ? "Edit Player Profile" : "Add Player Profile"}
                  </h3>
                </div>
                <form onSubmit={handlePlayerSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                        Player Name
                      </label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-bold"
                        value={editingPlayer?.name || ""}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                        Profile Photo URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                        value={editingPlayer?.photoUrl || ""}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, photoUrl: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 uppercase block mb-1">
                        FalaLeague Player?
                      </label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                        value={editingPlayer?.falaLeague || "No"}
                        onChange={(e) => setEditingPlayer({ ...editingPlayer, falaLeague: e.target.value })}
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      Sport Skill Scores (0 - 100)
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Cricket
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          value={editingPlayer?.cricket ?? 50}
                          onChange={(e) => setEditingPlayer({ ...editingPlayer, cricket: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Football
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          value={editingPlayer?.football ?? 50}
                          onChange={(e) => setEditingPlayer({ ...editingPlayer, football: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Badminton
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          value={editingPlayer?.badminton ?? 50}
                          onChange={(e) => setEditingPlayer({ ...editingPlayer, badminton: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Table Tennis
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          value={editingPlayer?.tableTennis ?? 50}
                          onChange={(e) => setEditingPlayer({ ...editingPlayer, tableTennis: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Carroms
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          value={editingPlayer?.carroms ?? 50}
                          onChange={(e) => setEditingPlayer({ ...editingPlayer, carroms: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Skill Rating
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          className="w-full bg-slate-50 border border-blue-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-bold text-blue-600"
                          value={editingPlayer?.skillRating ?? 50}
                          onChange={(e) => setEditingPlayer({ ...editingPlayer, skillRating: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Draft Results Override */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      ⚖️ Draft Assignment Override
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Correct mistakes, reassign teams, or override draft status here. Team wallets will automatically reconcile budgets.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                          Draft Status
                        </label>
                        <select
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          value={
                            editingPlayer?.isSold
                              ? "sold"
                              : editingPlayer?.isUnsold
                              ? "unsold"
                              : "draft"
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "sold") {
                              setEditingPlayer({
                                ...editingPlayer,
                                isSold: true,
                                isUnsold: false,
                                soldTo: editingPlayer.soldTo || (teams[0]?.id || null),
                                soldAmount: editingPlayer.soldAmount || 10000,
                              });
                            } else if (val === "unsold") {
                              setEditingPlayer({
                                ...editingPlayer,
                                isSold: false,
                                isUnsold: true,
                                soldTo: null,
                                soldAmount: null,
                              });
                            } else {
                              setEditingPlayer({
                                ...editingPlayer,
                                isSold: false,
                                isUnsold: false,
                                soldTo: null,
                                soldAmount: null,
                              });
                            }
                          }}
                        >
                          <option value="draft">Available Pool</option>
                          <option value="sold">Sold</option>
                          <option value="unsold">Unsold</option>
                        </select>
                      </div>

                      {editingPlayer?.isSold && (
                        <>
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                              Drafted Team
                            </label>
                            <select
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                              value={editingPlayer?.soldTo || ""}
                              onChange={(e) =>
                                setEditingPlayer({
                                  ...editingPlayer,
                                  soldTo: e.target.value || null,
                                })
                              }
                            >
                              <option value="">-- Select Team --</option>
                              {teams.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                              Winning Bid (Chips)
                            </label>
                            <input
                              type="number"
                              step="5000"
                              min="0"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none font-mono font-bold"
                              value={editingPlayer?.soldAmount || 0}
                              onChange={(e) =>
                                setEditingPlayer({
                                  ...editingPlayer,
                                  soldAmount: Number(e.target.value),
                                })
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPlayerModal(false);
                        setEditingPlayer(null);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-2.5 px-4 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow"
                    >
                      Save Player
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- SECTION 4: BULK CSV UPLOAD --- */}
      {activeTab === "bulk" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-xl font-black uppercase text-slate-900 tracking-wide">
              Bulk Paste Player CSV Registry
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Paste lines from spreadsheet applications directly to ingest players in bulk.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">
                Pasted CSV Content (Must include comma-separated headers)
              </label>
              <textarea
                rows={10}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                placeholder="Name,Role,Badminton,Carroms,Cricket,Football,TableTennis,SkillRating,FalaLeague,PhotoUrl&#10;Kumuda,,70,0,70,0,0,28,No,https://...&#10;Sachin,,40,40,40,40,0,32,No,https://..."
                value={bulkCSVText}
                onChange={(e) => setBulkCSVText(e.target.value)}
              />
            </div>

            {bulkUploadError && (
              <div className="bg-red-50 text-red-800 p-4 rounded-xl text-xs font-bold border border-red-200">
                ⚠️ {bulkUploadError}
              </div>
            )}

            {bulkUploadSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs font-bold border border-emerald-200">
                ✅ {bulkUploadSuccess}
              </div>
            )}

            <button
              onClick={handleBulkCSVSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase py-3 px-6 rounded-xl shadow flex items-center gap-2"
            >
              <Upload className="w-4.5 h-4.5" /> Parse & Draft Bulk Candidates
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wide mb-2">
              Expected CSV Headers:
            </h4>
            <code className="text-[11px] text-slate-600 font-mono block">
              Name,Role,Badminton,Carroms,Cricket,Football,TableTennis,SkillRating,FalaLeague,PhotoUrl
            </code>
          </div>
        </div>
      )}
    </div>
  );
};
