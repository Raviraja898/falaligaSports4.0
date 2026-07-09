import { Player } from "../types";

export function parseCSV(csvText: string): Partial<Player>[] {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];

  // Parse headers
  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  
  const players: Partial<Player>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle comma-separated values, taking care of potential commas inside quoted sections if any
    // Simple regex parser for csv values
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(",");
    const values = matches.map(val => val.replace(/^"|"$/g, "").trim());

    if (values.length < 3) continue;

    const row: any = {};
    headers.forEach((header, index) => {
      if (index < values.length) {
        row[header] = values[index];
      }
    });

    // Match with expected columns
    const name = row["name"] || values[0];
    const role = row["role"] || values[1] || "";
    const badminton = parseInt(row["badminton"] || values[2]) || 0;
    const carroms = parseInt(row["carroms"] || values[3]) || 0;
    const cricket = parseInt(row["cricket"] || values[4]) || 0;
    const football = parseInt(row["football"] || values[5]) || 0;
    const tabletennis = parseInt(row["tabletennis"] || values[6]) || 0;
    const skillRating = parseInt(row["skillrating"] || values[7]) || 0;
    const falaLeague = row["falaleague"] || values[8] || "No";
    const photoUrl = row["photourl"] || values[9] || "";

    if (name) {
      players.push({
        name,
        role,
        badminton,
        carroms,
        cricket,
        football,
        tableTennis: tabletennis,
        skillRating,
        falaLeague,
        photoUrl,
        isSold: false,
        soldTo: null,
        soldAmount: null,
        isUnsold: false,
        isOwnerOrCoOwner: false
      });
    }
  }

  return players;
}

export function formatChips(amount: number): string {
  // e.g. 5,50,000 or 10,00,000 or 0
  if (amount === 0) return "0 Chips";
  
  // Format as Lakhs/Thousands in Indian numbering format if desired, or standard locale
  const formatted = amount.toLocaleString("en-IN");
  return `${formatted} 🪙`;
}
