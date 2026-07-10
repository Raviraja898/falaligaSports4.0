import React, { useState } from "react";
import { Player, Team } from "../types";
import { formatChips } from "../utils/csvParser";
import { 
  Shield, User, Coins, Award, BarChart3, Star, Download,
  ChevronDown, ChevronUp, Users, Activity, Sparkles, TrendingUp
} from "lucide-react";

interface TeamRostersProps {
  players: Player[];
  teams: Team[];
}

export const TeamRosters: React.FC<TeamRostersProps> = ({ players, teams }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || "");
  const [showDashboard, setShowDashboard] = useState(true);

  // --- OVERALL LEAGUE STATS ---
  const totalPlayers = players.length;
  const malePlayers = players.filter((p) => p.gender === "Female" ? false : true).length; // Handle empty/undefined as Male
  const femalePlayers = players.filter((p) => p.gender === "Female").length;

  const totalSold = players.filter((p) => p.isSold).length;
  const maleSold = players.filter((p) => p.isSold && p.gender !== "Female").length;
  const femaleSold = players.filter((p) => p.isSold && p.gender === "Female").length;

  const totalUnsold = players.filter((p) => p.isUnsold).length;

  // Active bidding pool remaining
  const activeRemaining = players.filter((p) => !p.isSold && !p.isUnsold && !p.isOwnerOrCoOwner).length;

  // Money Metrics
  const initialTotalPurse = teams.length * 1000000;
  const totalSpentAllTeams = players.reduce((acc, p) => acc + (p.isSold ? (p.soldAmount || 0) : 0), 0);

  // Ratings metric
  const soldPlayersWithRatings = players.filter((p) => p.isSold);
  const averageSoldRating = soldPlayersWithRatings.length > 0 
    ? Math.round(soldPlayersWithRatings.reduce((acc, p) => acc + p.skillRating, 0) / soldPlayersWithRatings.length)
    : 0;

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);
  const draftedPlayers = players.filter((p) => p.soldTo === selectedTeamId);

  // Compute stats
  const totalSpent = draftedPlayers.reduce((acc, curr) => acc + (curr.soldAmount || 0), 0);
  const avgRating =
    draftedPlayers.length > 0
      ? Math.round(
          draftedPlayers.reduce((acc, curr) => acc + curr.skillRating, 0) / draftedPlayers.length
        )
      : 0;

  // Find assigned owner & co-owner player records if any (to display their stats as well!)
  const ownerPlayer = players.find(
    (p) => p.name.toLowerCase() === selectedTeam?.owner?.toLowerCase()
  );
  const coOwnerPlayer = players.find(
    (p) => p.name.toLowerCase() === selectedTeam?.coOwner?.toLowerCase()
  );

  const downloadRosterCSV = () => {
    if (!selectedTeam) return;

    const csvRows = [];

    // Team Metadata
    csvRows.push(["Team Name", selectedTeam.name]);
    csvRows.push(["Owner", selectedTeam.owner || "Unassigned"]);
    csvRows.push(["Co-Owner", selectedTeam.coOwner || "Unassigned"]);
    csvRows.push(["Remaining Purse", `${selectedTeam.budget} Chips`]);
    csvRows.push(["Total Spent", `${totalSpent} Chips`]);
    csvRows.push([]); // Empty spacing row

    // Players Header
    csvRows.push([
      "Player Name",
      "Gender",
      "Role",
      "Overall Skill Rating",
      "Cricket Rating",
      "Football Rating",
      "Badminton Rating",
      "Table Tennis Rating",
      "Carroms Rating",
      "Draft Price / Type"
    ]);

    // Add Owner player record if exists
    if (ownerPlayer) {
      csvRows.push([
        ownerPlayer.name,
        ownerPlayer.gender || "Male",
        ownerPlayer.role || "Owner",
        ownerPlayer.skillRating,
        ownerPlayer.cricket,
        ownerPlayer.football,
        ownerPlayer.badminton,
        ownerPlayer.tableTennis,
        ownerPlayer.carroms,
        "Assigned Owner"
      ]);
    }

    // Add Co-Owner player record if exists
    if (coOwnerPlayer) {
      csvRows.push([
        coOwnerPlayer.name,
        coOwnerPlayer.gender || "Male",
        coOwnerPlayer.role || "Co-Owner",
        coOwnerPlayer.skillRating,
        coOwnerPlayer.cricket,
        coOwnerPlayer.football,
        coOwnerPlayer.badminton,
        coOwnerPlayer.tableTennis,
        coOwnerPlayer.carroms,
        "Assigned Co-Owner"
      ]);
    }

    // Add drafted players
    draftedPlayers.forEach((p) => {
      csvRows.push([
        p.name,
        p.gender || "Male",
        p.role || "Draft Nominee",
        p.skillRating,
        p.cricket,
        p.football,
        p.badminton,
        p.tableTennis,
        p.carroms,
        p.soldAmount || 0
      ]);
    });

    const csvString = csvRows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedTeam.name.replace(/\s+/g, "_")}_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-slate-800">
      
      {/* 📊 LEAGUE OVERVIEW & GENDER METRICS DASHBOARD */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 mb-8 overflow-hidden">
        <div className="flex justify-between items-center pb-4 border-b border-slate-800 cursor-pointer select-none" onClick={() => setShowDashboard(!showDashboard)}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wide">League Overview & Gender Metrics</h2>
              <p className="text-xs text-slate-400">Real-time breakdown of draft statistics, male/female ratios, and team allocations</p>
            </div>
          </div>
          <button className="p-2 hover:bg-slate-800 rounded-xl transition-all">
            {showDashboard ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
        </div>

        {showDashboard && (
          <div className="mt-6 space-y-6">
            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Roster Gender Balance */}
              <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">DRAFT GENDER BALANCE</span>
                <div className="flex justify-between items-end mt-1">
                  <div>
                    <div className="text-2xl font-black text-white">{totalPlayers} <span className="text-xs font-normal text-slate-400">Total</span></div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      <span>M: <strong className="text-blue-400">{malePlayers}</strong></span>
                      <span className="mx-1.5">|</span>
                      <span>F: <strong className="text-pink-400">{femalePlayers}</strong></span>
                    </div>
                  </div>
                  <Users className="w-6 h-6 text-slate-600 mb-1" />
                </div>
                {/* Ratio Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3.5 flex">
                  <div className="bg-blue-500 h-full" style={{ width: `${(malePlayers / (totalPlayers || 1)) * 100}%` }} />
                  <div className="bg-pink-500 h-full" style={{ width: `${(femalePlayers / (totalPlayers || 1)) * 100}%` }} />
                </div>
              </div>

              {/* Card 2: Gender Draft Outcomes */}
              <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">SELECTED BY GENDER</span>
                <div className="flex justify-between items-end mt-1">
                  <div>
                    <div className="text-2xl font-black text-emerald-400">{totalSold} <span className="text-xs font-normal text-slate-400">Selected</span></div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      <span>M: <strong className="text-blue-400">{maleSold}</strong> <span className="text-[9px] text-slate-500">({Math.round((maleSold / (malePlayers || 1)) * 100)}%)</span></span>
                      <span className="mx-1.5">|</span>
                      <span>F: <strong className="text-pink-400">{femaleSold}</strong> <span className="text-[9px] text-slate-500">({Math.round((femaleSold / (femalePlayers || 1)) * 100)}%)</span></span>
                    </div>
                  </div>
                  <Sparkles className="w-6 h-6 text-emerald-600 mb-1" />
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3.5 flex">
                  <div className="bg-blue-400 h-full" style={{ width: `${(maleSold / (totalSold || 1)) * 100}%` }} />
                  <div className="bg-pink-400 h-full" style={{ width: `${(femaleSold / (totalSold || 1)) * 100}%` }} />
                </div>
              </div>

              {/* Card 3: Budget Consumption */}
              <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">TOTAL LEAGUE PURSE</span>
                <div className="flex justify-between items-end mt-1">
                  <div>
                    <div className="text-lg font-black text-yellow-500 font-mono">{formatChips(totalSpentAllTeams)}</div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                      Spent of {formatChips(initialTotalPurse)} total
                    </div>
                  </div>
                  <Coins className="w-6 h-6 text-yellow-600 mb-1" />
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3.5">
                  <div className="bg-yellow-500 h-full transition-all" style={{ width: `${(totalSpentAllTeams / (initialTotalPurse || 1)) * 100}%` }} />
                </div>
              </div>

              {/* Card 4: Draft Competitiveness */}
              <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">DRAFT POOL STATUS</span>
                <div className="flex justify-between items-end mt-1">
                  <div>
                    <div className="text-2xl font-black text-blue-400">{activeRemaining} <span className="text-xs font-normal text-slate-400">Available</span></div>
                    <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      <span>Unsold: <strong className="text-orange-400">{totalUnsold}</strong></span>
                      <span className="mx-1.5">|</span>
                      <span>Avg Rating: <strong className="text-indigo-400">★{averageSoldRating}</strong></span>
                    </div>
                  </div>
                  <Activity className="w-6 h-6 text-slate-600 mb-1" />
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-3.5">
                  <div className="bg-blue-400 h-full" style={{ width: `${(activeRemaining / (totalPlayers || 1)) * 100}%` }} />
                </div>
              </div>

            </div>

            {/* Team Roster Metrics Table */}
            <div className="bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/80 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Team-by-Team Gender & Budget Ledger</h3>
                <span className="text-[10px] font-mono text-slate-500">8 Teams Configured</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-black text-[10px] tracking-wider bg-slate-950/30">
                      <th className="py-3 px-5">Team Franchise</th>
                      <th className="py-3 px-4 text-center">Male players</th>
                      <th className="py-3 px-4 text-center">Female players</th>
                      <th className="py-3 px-4 text-center">Total Squad</th>
                      <th className="py-3 px-4 text-right">Total Spent</th>
                      <th className="py-3 px-5 text-right">Remaining Wallet</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {teams.map((t) => {
                      const squad = players.filter((p) => p.soldTo === t.id);
                      const malesCount = squad.filter((p) => p.gender !== "Female").length;
                      const femalesCount = squad.filter((p) => p.gender === "Female").length;
                      const spent = squad.reduce((sum, curr) => sum + (curr.soldAmount || 0), 0);
                      
                      return (
                        <tr key={t.id} className="hover:bg-slate-900/30 transition-all">
                          <td className="py-3.5 px-5 font-sans font-black flex items-center gap-2.5">
                            <span className="w-3 h-3 rounded-full border border-white/10 shrink-0" style={{ backgroundColor: t.color }} />
                            <span className="uppercase text-slate-200">{t.name}</span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-blue-400">
                            {malesCount}
                          </td>
                          <td className="py-3.5 px-4 text-center font-bold text-pink-400">
                            {femalesCount}
                          </td>
                          <td className="py-3.5 px-4 text-center font-black text-slate-200 font-sans">
                            {squad.length} <span className="text-[10px] font-normal text-slate-500 font-mono">players</span>
                          </td>
                          <td className="py-3.5 px-4 text-right text-yellow-600 font-bold">
                            {formatChips(spent)}
                          </td>
                          <td className="py-3.5 px-5 text-right text-emerald-500 font-black">
                            {formatChips(t.budget)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Team Selection Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 mb-8">
        {teams.map((t) => {
          const isSelected = t.id === selectedTeamId;
          const rosterCount = players.filter((p) => p.soldTo === t.id).length;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTeamId(t.id)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isSelected
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div
                className="w-8 h-8 rounded-full mx-auto mb-2 border flex items-center justify-center font-black text-xs uppercase"
                style={{
                  borderColor: t.color,
                  backgroundColor: isSelected ? t.color : `${t.color}15`,
                  color: isSelected ? "#fff" : t.color,
                }}
              >
                {t.name.slice(0, 2)}
              </div>
              <h4 className="text-xs font-black uppercase truncate max-w-full block">
                {t.name}
              </h4>
              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                {rosterCount} drafted
              </span>
            </button>
          );
        })}
      </div>

      {selectedTeam ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Team Card & Analytics (4 Columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Team Wallet Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-3"
                style={{ backgroundColor: selectedTeam.color }}
              />

              <div className="flex items-center gap-3 mb-6 pt-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-black border-2"
                  style={{
                    borderColor: selectedTeam.color,
                    backgroundColor: `${selectedTeam.color}22`,
                    color: selectedTeam.color,
                  }}
                >
                  {selectedTeam.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-black uppercase text-slate-900 leading-tight">
                    {selectedTeam.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">
                    Falaliga Contender
                  </span>
                </div>
              </div>

              {/* Wallet and Roster Summaries */}
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Remaining Purse
                      </span>
                      <span className="text-lg font-black text-slate-800 font-mono">
                        {formatChips(selectedTeam.budget)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Coins className="w-5 h-5 text-slate-400" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Total Spent Chips
                      </span>
                      <span className="text-lg font-black text-slate-800 font-mono">
                        {formatChips(totalSpent)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Officers info */}
              <div className="mt-6 pt-6 border-t border-slate-150 space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Assigned Team Officers (Fixed)
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <Shield className="w-5 h-5 text-blue-600 shrink-0" />
                    <div className="truncate">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">
                        Owner
                      </span>
                      <span className="text-xs font-extrabold text-slate-800 uppercase block truncate">
                        {selectedTeam.owner || "--- Unassigned ---"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <Shield className="w-5 h-5 text-indigo-500 shrink-0" />
                    <div className="truncate">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">
                        Co-Owner
                      </span>
                      <span className="text-xs font-extrabold text-slate-800 uppercase block truncate">
                        {selectedTeam.coOwner || "--- Unassigned ---"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                <BarChart3 className="w-4.5 h-4.5 text-blue-600" />
                Squad Analytics
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <span className="text-[10px] uppercase font-black text-slate-400">
                    Draft Size
                  </span>
                  <div className="text-2xl font-black text-slate-800 mt-1">
                    {draftedPlayers.length} <span className="text-xs font-normal text-slate-500">players</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
                  <span className="text-[10px] uppercase font-black text-slate-400">
                    Avg rating
                  </span>
                  <div className="text-2xl font-black text-blue-600 mt-1">
                    ★ {avgRating}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Full Squad Roster Display (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. assigned officers display */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg">
              <h3 className="font-extrabold text-slate-900 uppercase tracking-wide text-sm mb-4 flex items-center gap-1.5">
                <Award className="w-5 h-5 text-yellow-500" />
                Fixed Team Officers (Not in bidding pool)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Owner Card */}
                {ownerPlayer ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border overflow-hidden shrink-0 flex items-center justify-center">
                      {ownerPlayer.photoUrl ? (
                        <img
                          src={ownerPlayer.photoUrl}
                          alt={ownerPlayer.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <div className="truncate">
                      <span className="bg-blue-100 text-blue-850 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Owner
                      </span>
                      <h4 className="font-black text-slate-950 uppercase mt-1 text-base truncate">
                        {ownerPlayer.name}
                      </h4>
                      <span className="text-xs text-slate-500 font-bold block">
                        ★ Overall Skill: {ownerPlayer.skillRating}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-center text-slate-400 text-xs text-center py-6">
                    No active player assigned as Owner.
                  </div>
                )}

                {/* Co-Owner Card */}
                {coOwnerPlayer ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border overflow-hidden shrink-0 flex items-center justify-center">
                      {coOwnerPlayer.photoUrl ? (
                        <img
                          src={coOwnerPlayer.photoUrl}
                          alt={coOwnerPlayer.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <div className="truncate">
                      <span className="bg-indigo-100 text-indigo-850 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Co-Owner
                      </span>
                      <h4 className="font-black text-slate-950 uppercase mt-1 text-base truncate">
                        {coOwnerPlayer.name}
                      </h4>
                      <span className="text-xs text-slate-500 font-bold block">
                        ★ Overall Skill: {coOwnerPlayer.skillRating}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-4 flex items-center justify-center text-slate-400 text-xs text-center py-6">
                    No active player assigned as Co-Owner.
                  </div>
                )}
              </div>
            </div>

            {/* 2. Drafted Players List */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 uppercase tracking-wide text-sm flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-blue-500" />
                  Drafted Players Roster ({draftedPlayers.length})
                </h3>
                {draftedPlayers.length > 0 || ownerPlayer || coOwnerPlayer ? (
                  <button
                    id="btn-download-roster"
                    onClick={downloadRosterCSV}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Roster CSV
                  </button>
                ) : null}
              </div>

              {draftedPlayers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {draftedPlayers.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white border border-slate-200 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                    >
                      <div className="w-20 h-20 rounded-xl bg-slate-100 border overflow-hidden shrink-0 flex items-center justify-center">
                        {p.photoUrl ? (
                          <img
                            src={p.photoUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <User className="w-10 h-10 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <div className="truncate">
                            <h4 className="font-black text-slate-900 uppercase text-sm truncate leading-tight">
                              {p.name}
                            </h4>
                            <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase mt-1 inline-block ${
                              p.gender === "Female" 
                                ? "bg-pink-150 text-pink-700 border border-pink-200" 
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}>
                              {p.gender}
                            </span>
                          </div>
                          <span className="bg-blue-600 text-white font-black text-[10px] px-1.5 py-0.5 rounded-md shrink-0">
                            ★ {p.skillRating}
                          </span>
                        </div>

                        {/* Sport ratings display */}
                        <div className="grid grid-cols-3 gap-y-1 gap-x-2 text-[10px] text-slate-500 mt-2 font-mono">
                          <div className="truncate">Ckt: {p.cricket}</div>
                          <div className="truncate">Fbl: {p.football}</div>
                          <div className="truncate">Bad: {p.badminton}</div>
                          <div className="truncate">TT: {p.tableTennis}</div>
                          <div className="truncate">Car: {p.carroms}</div>
                        </div>

                        {/* Cost footer */}
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[9px] uppercase font-bold text-slate-400">
                            Draft Price
                          </span>
                          <span className="text-xs font-black text-yellow-600 font-mono">
                            {formatChips(p.soldAmount || 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                  <User className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="font-bold text-slate-500 uppercase text-sm">
                    Roster is Empty
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    This team has not drafted any candidate from the live auction block yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 bg-white border border-slate-200 rounded-3xl shadow-xl">
          <Shield className="w-12 h-12 mx-auto text-slate-300 mb-2 animate-bounce" />
          <h4 className="font-black text-slate-800 uppercase">
            No active teams configured
          </h4>
        </div>
      )}
    </div>
  );
};
