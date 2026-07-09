import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { Player, Team, AuctionState, AuctionData } from "./src/types";
import { INITIAL_PLAYERS, INITIAL_TEAMS } from "./src/initialPlayers";

const app = express();
const PORT = 3004;
const DATA_FILE = path.join(process.cwd(), "data.json");
const PLAYERS_DIR = path.join(process.cwd(), "public", "players");

// Ensure players directory exists
if (!fs.existsSync(PLAYERS_DIR)) {
  fs.mkdirSync(PLAYERS_DIR, { recursive: true });
}

// Helper to read state
function getState(): AuctionData {
  if (!fs.existsSync(DATA_FILE)) {
    const defaultData: AuctionData = {
      players: INITIAL_PLAYERS,
      teams: INITIAL_TEAMS,
      state: {
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
      },
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
    return defaultData;
  }
  try {
    const content = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(content) as AuctionData;
  } catch (error) {
    console.error("Error reading data file, resetting to defaults...", error);
    const defaultData: AuctionData = {
      players: INITIAL_PLAYERS,
      teams: INITIAL_TEAMS,
      state: {
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
      },
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), "utf-8");
    return defaultData;
  }
}

// Helper to save state
function saveState(data: AuctionData) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

app.use(express.json({ limit: "20mb" }));

// Real-time synchronization state API
app.get("/api/state", (req, res) => {
  const data = getState();
  // Clear sold/unsold animation state if time has passed
  if (
    data.state.animationEndsAt &&
    Date.now() > data.state.animationEndsAt &&
    (data.state.status === "sold" || data.state.status === "unsold")
  ) {
    if (data.state.isAutoPilotActive) {
      // Pick next player randomly
      const availablePlayers = data.players.filter(
        (p) => !p.isSold && !p.isUnsold && !p.isOwnerOrCoOwner
      );
      
      if (availablePlayers.length > 0) {
        const randomIndex = Math.floor(Math.random() * availablePlayers.length);
        const selectedPlayer = availablePlayers[randomIndex];

        data.state.currentPlayerId = selectedPlayer.id;
        data.state.currentBid = 0;
        data.state.currentBidderId = null;
        data.state.status = "bidding";
        data.state.isAutoBidding = false;
        data.state.lastBidTime = Date.now();
        data.state.soldPlayerId = null;
        data.state.soldToTeamId = null;
        data.state.soldAmount = null;
        data.state.animationEndsAt = null;
        data.state.shufflingEndsAt = Date.now() + 3000; // 3 seconds shuffling animation
      } else {
        // No players remaining, terminate auto-pilot
        data.state.status = "idle";
        data.state.currentPlayerId = null;
        data.state.currentBid = 0;
        data.state.currentBidderId = null;
        data.state.soldPlayerId = null;
        data.state.soldToTeamId = null;
        data.state.soldAmount = null;
        data.state.animationEndsAt = null;
        data.state.isAutoPilotActive = false;
      }
    } else {
      // Standard non-autopilot transition
      data.state.status = "idle";
      data.state.currentPlayerId = null;
      data.state.currentBid = 0;
      data.state.currentBidderId = null;
      data.state.soldPlayerId = null;
      data.state.soldToTeamId = null;
      data.state.soldAmount = null;
      data.state.animationEndsAt = null;
    }
    saveState(data);
  }
  res.json(data);
});

// Reset entire database to defaults
app.post("/api/state/reset", (req, res) => {
  const defaultData: AuctionData = {
    players: INITIAL_PLAYERS,
    teams: INITIAL_TEAMS,
    state: {
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
    },
  };
  saveState(defaultData);
  res.json({ message: "State reset successfully", data: defaultData });
});

// Bulk update / Import state
app.post("/api/state/import", (req, res) => {
  const data = req.body as AuctionData;
  if (!data.players || !data.teams || !data.state) {
    res.status(400).json({ error: "Invalid auction data format" });
    return;
  }
  saveState(data);
  res.json({ message: "Imported state successfully", data });
});

// --- TEAMS CRUD ---
app.post("/api/teams", (req, res) => {
  const data = getState();
  const { action, team } = req.body;

  if (action === "create") {
    const newTeam: Team = {
      id: "t_" + Date.now(),
      name: team.name || "New Team",
      owner: team.owner || null,
      coOwner: team.coOwner || null,
      budget: Number(team.budget) ?? 1000000,
      color: team.color || "#3b82f6",
    };
    data.teams.push(newTeam);
    saveState(data);
    res.json({ message: "Team created successfully", team: newTeam });
  } else if (action === "update") {
    const index = data.teams.findIndex((t) => t.id === team.id);
    if (index !== -1) {
      // Find old owner & co-owner to unmark them
      const oldTeam = data.teams[index];
      
      // Update team data
      data.teams[index] = {
        ...data.teams[index],
        name: team.name,
        owner: team.owner || null,
        coOwner: team.coOwner || null,
        budget: Number(team.budget) ?? 1000000,
        color: team.color,
      };

      // Refresh players owner/co-owner flags
      // First unmark everyone
      data.players.forEach(p => {
        p.isOwnerOrCoOwner = false;
      });

      // Now re-mark owners and co-owners from all teams
      data.teams.forEach(t => {
        if (t.owner) {
          const ownerPlayer = data.players.find(p => p.name.toLowerCase() === t.owner?.toLowerCase());
          if (ownerPlayer) ownerPlayer.isOwnerOrCoOwner = true;
        }
        if (t.coOwner) {
          const coOwnerPlayer = data.players.find(p => p.name.toLowerCase() === t.coOwner?.toLowerCase());
          if (coOwnerPlayer) coOwnerPlayer.isOwnerOrCoOwner = true;
        }
      });

      saveState(data);
      res.json({ message: "Team updated successfully", team: data.teams[index] });
    } else {
      res.status(404).json({ error: "Team not found" });
    }
  } else if (action === "delete") {
    const index = data.teams.findIndex((t) => t.id === team.id);
    if (index !== -1) {
      const deletedTeam = data.teams.splice(index, 1)[0];
      
      // Unmark any players that were owner/co-owner for this team
      data.players.forEach(p => {
        p.isOwnerOrCoOwner = false;
      });
      data.teams.forEach(t => {
        if (t.owner) {
          const ownerPlayer = data.players.find(p => p.name.toLowerCase() === t.owner?.toLowerCase());
          if (ownerPlayer) ownerPlayer.isOwnerOrCoOwner = true;
        }
        if (t.coOwner) {
          const coOwnerPlayer = data.players.find(p => p.name.toLowerCase() === t.coOwner?.toLowerCase());
          if (coOwnerPlayer) coOwnerPlayer.isOwnerOrCoOwner = true;
        }
      });

      saveState(data);
      res.json({ message: "Team deleted successfully", team: deletedTeam });
    } else {
      res.status(404).json({ error: "Team not found" });
    }
  } else {
    res.status(400).json({ error: "Invalid team action" });
  }
});

// --- PLAYERS CRUD ---
app.post("/api/players", (req, res) => {
  const data = getState();
  const { action, player, playersList } = req.body;

  if (action === "create") {
    const newPlayer: Player = {
      id: "p_" + Date.now(),
      name: player.name || "Unnamed Player",
      role: player.role || "",
      badminton: Number(player.badminton) || 0,
      carroms: Number(player.carroms) || 0,
      cricket: Number(player.cricket) || 0,
      football: Number(player.football) || 0,
      tableTennis: Number(player.tableTennis) || 0,
      skillRating: Number(player.skillRating) || 0,
      falaLeague: player.falaLeague || "No",
      photoUrl: player.photoUrl || "",
      isSold: false,
      soldTo: null,
      soldAmount: null,
      isUnsold: false,
      isOwnerOrCoOwner: false,
    };
    data.players.push(newPlayer);
    saveState(data);
    res.json({ message: "Player created successfully", player: newPlayer });
  } else if (action === "update") {
    const index = data.players.findIndex((p) => p.id === player.id);
    if (index !== -1) {
      const oldPlayer = data.players[index];

      // 1. Refund the old team's budget if the player was previously sold
      if (oldPlayer.isSold && oldPlayer.soldTo && oldPlayer.soldAmount !== null) {
        const oldTeam = data.teams.find((t) => t.id === oldPlayer.soldTo);
        if (oldTeam) {
          oldTeam.budget += Number(oldPlayer.soldAmount);
        }
      }

      // Extract new draft parameters
      const isSold = player.isSold ?? oldPlayer.isSold;
      const soldTo = player.soldTo || null;
      const soldAmount = player.soldAmount !== null && player.soldAmount !== undefined ? Number(player.soldAmount) : null;
      const isUnsold = player.isUnsold ?? oldPlayer.isUnsold;

      // 2. Deduct from the new team's budget if they are currently sold
      if (isSold && soldTo && soldAmount !== null) {
        const newTeam = data.teams.find((t) => t.id === soldTo);
        if (newTeam) {
          newTeam.budget -= soldAmount;
        }
      }

      data.players[index] = {
        ...data.players[index],
        name: player.name,
        role: player.role || "",
        badminton: Number(player.badminton) || 0,
        carroms: Number(player.carroms) || 0,
        cricket: Number(player.cricket) || 0,
        football: Number(player.football) || 0,
        tableTennis: Number(player.tableTennis) || 0,
        skillRating: Number(player.skillRating) || 0,
        falaLeague: player.falaLeague || "No",
        photoUrl: player.photoUrl || "",
        isSold: isSold,
        soldTo: soldTo,
        soldAmount: soldAmount,
        isUnsold: isUnsold,
      };
      saveState(data);
      res.json({ message: "Player updated successfully", player: data.players[index] });
    } else {
      res.status(404).json({ error: "Player not found" });
    }
  } else if (action === "delete") {
    const index = data.players.findIndex((p) => p.id === player.id);
    if (index !== -1) {
      const deletedPlayer = data.players.splice(index, 1)[0];
      saveState(data);
      res.json({ message: "Player deleted successfully", player: deletedPlayer });
    } else {
      res.status(404).json({ error: "Player not found" });
    }
  } else if (action === "bulk") {
    if (!Array.isArray(playersList)) {
      res.status(400).json({ error: "playersList must be an array" });
      return;
    }
    const uploadedPlayers: Player[] = playersList.map((p, idx) => ({
      id: `p_bulk_${Date.now()}_${idx}`,
      name: p.name || `Player ${idx}`,
      role: p.role || "",
      badminton: Number(p.badminton) || 0,
      carroms: Number(p.carroms) || 0,
      cricket: Number(p.cricket) || 0,
      football: Number(p.football) || 0,
      tableTennis: Number(p.tableTennis) || 0,
      skillRating: Number(p.skillRating) || 0,
      falaLeague: p.falaLeague || "No",
      photoUrl: p.photoUrl || "",
      isSold: false,
      soldTo: null,
      soldAmount: null,
      isUnsold: false,
      isOwnerOrCoOwner: false,
    }));
    data.players = [...data.players, ...uploadedPlayers];
    saveState(data);
    res.json({ message: "Bulk upload successful", count: uploadedPlayers.length });
  } else {
    res.status(400).json({ error: "Invalid player action" });
  }
});

// --- PHOTO MERGING UTILITY ---
app.post("/api/players/match-photos", (req, res) => {
  const data = getState();
  let matchedCount = 0;

  try {
    if (!fs.existsSync(PLAYERS_DIR)) {
      res.json({ message: "Local players photo directory empty", matchedCount: 0 });
      return;
    }
    const files = fs.readdirSync(PLAYERS_DIR);
    
    data.players.forEach((player) => {
      // Find a file that matches the player name
      const normalizedPlayerName = player.name.toLowerCase().replace(/[^a-z0-9]/g, "");
      const matchedFile = files.find((file) => {
        const ext = path.extname(file);
        const nameWithoutExt = path.basename(file, ext).toLowerCase().replace(/[^a-z0-9]/g, "");
        return nameWithoutExt === normalizedPlayerName || nameWithoutExt.includes(normalizedPlayerName) || normalizedPlayerName.includes(nameWithoutExt);
      });

      if (matchedFile) {
        player.photoUrl = `/players/${matchedFile}`;
        matchedCount++;
      }
    });

    saveState(data);
    res.json({ message: "Local photos auto-merged successfully", matchedCount });
  } catch (error) {
    console.error("Error matching local photos", error);
    res.status(500).json({ error: "Error scanning local photo directory" });
  }
});

// --- LIVE AUCTION FLOW CONTROLLER ---
app.post("/api/auction/select", (req, res) => {
  const data = getState();
  const { playerId } = req.body;

  const player = data.players.find((p) => p.id === playerId);
  if (!player) {
    res.status(404).json({ error: "Player not found" });
    return;
  }

  data.state.currentPlayerId = playerId;
  data.state.currentBid = 0;
  data.state.currentBidderId = null;
  data.state.status = "bidding";
  data.state.isAutoBidding = false;
  data.state.lastBidTime = Date.now();
  data.state.soldPlayerId = null;
  data.state.soldToTeamId = null;
  data.state.soldAmount = null;
  data.state.animationEndsAt = null;
  data.state.shufflingEndsAt = null;
  data.state.isAutoPilotActive = false; // Turn off autopilot on manual select

  saveState(data);
  res.json({ message: "Player selected for bidding", state: data.state });
});

app.post("/api/auction/auto-select", (req, res) => {
  const data = getState();
  
  // Available players who aren't drafted and aren't assigned as owner/co-owner
  const availablePlayers = data.players.filter(
    (p) => !p.isSold && !p.isUnsold && !p.isOwnerOrCoOwner
  );

  if (availablePlayers.length === 0) {
    res.status(400).json({ error: "No available players remaining in the draft pool" });
    return;
  }

  // Pick a random player
  const randomIndex = Math.floor(Math.random() * availablePlayers.length);
  const selectedPlayer = availablePlayers[randomIndex];

  data.state.currentPlayerId = selectedPlayer.id;
  data.state.currentBid = 0;
  data.state.currentBidderId = null;
  data.state.status = "bidding";
  data.state.isAutoBidding = false;
  data.state.lastBidTime = Date.now();
  data.state.soldPlayerId = null;
  data.state.soldToTeamId = null;
  data.state.soldAmount = null;
  data.state.animationEndsAt = null;
  data.state.shufflingEndsAt = Date.now() + 3000; // 3 seconds shuffling animation
  data.state.isAutoPilotActive = true; // Turn on autopilot on auto select

  saveState(data);
  res.json({ message: "Auto-selected player for nomination", state: data.state });
});

app.post("/api/auction/toggle-autopilot", (req, res) => {
  const data = getState();
  data.state.isAutoPilotActive = !data.state.isAutoPilotActive;
  saveState(data);
  res.json({ message: `Auto-pilot status updated`, state: data.state });
});

app.post("/api/auction/bid", (req, res) => {
  const data = getState();
  const { teamId, amount } = req.body;

  if (data.state.status !== "bidding") {
    res.status(400).json({ error: "No active bidding on block" });
    return;
  }

  const team = data.teams.find((t) => t.id === teamId);
  if (!team) {
    res.status(404).json({ error: "Team not found" });
    return;
  }

  if (team.budget < amount) {
    res.status(400).json({ error: "Insufficient budget for this team" });
    return;
  }

  if (amount <= data.state.currentBid && data.state.currentBid > 0) {
    res.status(400).json({ error: "Bid must be higher than current bid" });
    return;
  }

  data.state.currentBid = amount;
  data.state.currentBidderId = teamId;
  data.state.lastBidTime = Date.now();

  saveState(data);
  res.json({ message: "Bid accepted", state: data.state });
});

app.post("/api/auction/sold", (req, res) => {
  const data = getState();

  if (data.state.status !== "bidding" || !data.state.currentPlayerId) {
    res.status(400).json({ error: "No active player bidding to complete" });
    return;
  }

  const player = data.players.find((p) => p.id === data.state.currentPlayerId);
  if (!player) {
    res.status(404).json({ error: "Current player not found" });
    return;
  }

  // Handle direct manual assignment parameters if passed in body
  const { teamId: manualTeamId, amount: manualAmount } = req.body;
  const teamId = manualTeamId !== undefined ? manualTeamId : data.state.currentBidderId;
  const finalBid = manualAmount !== undefined ? Number(manualAmount) : data.state.currentBid;

  if (!teamId) {
    // If no bids were placed, mark as unsold and enter 6-second unsold splash
    player.isUnsold = true;
    data.state.status = "unsold";
    data.state.soldPlayerId = player.id;
    data.state.soldToTeamId = null;
    data.state.soldAmount = null;
    data.state.animationEndsAt = Date.now() + 6000; // 6 seconds splash
    data.state.currentPlayerId = null;
    data.state.currentBid = 0;
    data.state.currentBidderId = null;
    saveState(data);
    res.json({ message: "Player marked as unsold due to zero bids", state: data.state });
    return;
  }

  const team = data.teams.find((t) => t.id === teamId);
  if (!team) {
    res.status(404).json({ error: "Bidding team not found" });
    return;
  }

  // Double check budget
  if (team.budget < finalBid) {
    res.status(400).json({ error: "Winning team has insufficient budget" });
    return;
  }

  // Update Team Budget
  team.budget -= finalBid;

  // Update Player Stats
  player.isSold = true;
  player.soldTo = teamId;
  player.soldAmount = finalBid;

  // Set 6-second splash screen celebration
  data.state.status = "sold";
  data.state.soldPlayerId = player.id;
  data.state.soldToTeamId = teamId;
  data.state.soldAmount = finalBid;
  data.state.animationEndsAt = Date.now() + 6000; // 6 seconds fireworks

  saveState(data);
  res.json({ message: "Player SOLD!", state: data.state });
});

app.post("/api/auction/unsold", (req, res) => {
  const data = getState();

  if (data.state.status !== "bidding" || !data.state.currentPlayerId) {
    res.status(400).json({ error: "No active player bidding to mark unsold" });
    return;
  }

  const player = data.players.find((p) => p.id === data.state.currentPlayerId);
  if (!player) {
    res.status(404).json({ error: "Current player not found" });
    return;
  }

  player.isUnsold = true;
  data.state.status = "unsold";
  data.state.soldPlayerId = player.id;
  data.state.soldToTeamId = null;
  data.state.soldAmount = null;
  data.state.animationEndsAt = Date.now() + 6000; // 6 seconds splash
  data.state.currentPlayerId = null;
  data.state.currentBid = 0;
  data.state.currentBidderId = null;

  saveState(data);
  res.json({ message: "Player marked as UNSOLD", state: data.state });
});

app.post("/api/auction/skip", (req, res) => {
  const data = getState();
  const skippedPlayerId = data.state.currentPlayerId;

  if (skippedPlayerId) {
    const index = data.players.findIndex((p) => p.id === skippedPlayerId);
    if (index !== -1) {
      const [skippedPlayer] = data.players.splice(index, 1);
      // Reset any active bidding status on the player so they are clean
      skippedPlayer.isSold = false;
      skippedPlayer.soldTo = null;
      skippedPlayer.soldAmount = null;
      skippedPlayer.isUnsold = false;
      // Append to the end of the list
      data.players.push(skippedPlayer);
    }
  }

  data.state.currentPlayerId = null;
  data.state.currentBid = 0;
  data.state.currentBidderId = null;
  data.state.status = "idle";
  data.state.isAutoBidding = false;
  data.state.soldPlayerId = null;
  data.state.soldToTeamId = null;
  data.state.soldAmount = null;
  data.state.animationEndsAt = null;

  saveState(data);
  res.json({ message: "Player skipped to the end of the queue", state: data.state });
});

// Start server
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve client-side bundle
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Falaliga Auction 4.0 server running on port ${PORT}`);
  });
}

startServer();
