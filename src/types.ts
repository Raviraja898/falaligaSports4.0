export interface Player {
  id: string;
  name: string;
  role: string;
  badminton: number;
  carroms: number;
  cricket: number;
  football: number;
  tableTennis: number;
  skillRating: number;
  falaLeague: string;
  photoUrl: string;
  isSold: boolean;
  soldTo: string | null; // teamId
  soldAmount: number | null;
  isUnsold: boolean;
  isOwnerOrCoOwner: boolean;
  isBiddingPaused?: boolean;
}

export interface Team {
  id: string;
  name: string;
  owner: string | null; // player name or custom
  coOwner: string | null; // player name or custom
  budget: number; // Starts at 10,00,000 (10 lakhs)
  color: string;
}

export interface AuctionState {
  currentPlayerId: string | null;
  currentBid: number;
  currentBidderId: string | null; // teamId
  status: 'idle' | 'bidding' | 'sold' | 'unsold';
  isAutoBidding: boolean;
  lastBidTime: number;
  soldPlayerId: string | null;
  soldToTeamId: string | null;
  soldAmount: number | null;
  animationEndsAt: number | null; // timestamp when the 10s fireworks end
  shufflingEndsAt?: number | null; // timestamp when the random select animation ends
  isAutoPilotActive?: boolean; // indicates if the automated sequence of auto-nomination is running
}

export interface AuctionData {
  players: Player[];
  teams: Team[];
  state: AuctionState;
}
