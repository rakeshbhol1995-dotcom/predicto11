export const INITIAL_MATCHES = [
  // Live Matches (In-Play)
  {
    id: "soccer-1",
    sport: "Soccer",
    league: "Premier League",
    homeTeam: "Manchester United",
    awayTeam: "Chelsea",
    homeScore: 2,
    awayScore: 1,
    time: "72:15",
    status: "live",
    eventStatus: "Attacking Play",
    stats: {
      possession: [54, 46],
      shots: [12, 9],
      corners: [6, 4]
    },
    odds: {
      home: 1.62,
      draw: 3.40,
      away: 5.25
    }
  },
  {
    id: "cricket-1",
    sport: "Cricket",
    league: "Indian Premier League",
    homeTeam: "Mumbai Indians",
    awayTeam: "Chennai Super Kings",
    homeScore: "174/4",
    awayScore: "122/3",
    time: "14.2 Ov", // Over indicator
    status: "live",
    eventStatus: "CSK needs 53 runs in 34 balls",
    stats: {
      possession: [50, 50],
      shots: [14, 12],
      corners: [0, 0] // cricket doesn't have corners, but we show custom match-tracker stats if needed
    },
    odds: {
      home: 1.45,
      draw: 21.0, // Draw/Tie is very high odds in cricket
      away: 2.85
    }
  },
  {
    id: "tennis-1",
    sport: "Tennis",
    league: "French Open",
    homeTeam: "Carlos Alcaraz",
    awayTeam: "Jannik Sinner",
    homeScore: "2 | 40",
    awayScore: "1 | 30",
    time: "Set 3",
    status: "live",
    eventStatus: "Sinner serving - Break point chance",
    stats: {
      possession: [48, 52],
      shots: [42, 45],
      corners: [0, 0]
    },
    odds: {
      home: 1.80,
      draw: null, // Tennis has no draw
      away: 2.05
    }
  },
  {
    id: "basketball-1",
    sport: "Basketball",
    league: "NBA Playoffs",
    homeTeam: "Los Angeles Lakers",
    awayTeam: "Boston Celtics",
    homeScore: 94,
    awayScore: 98,
    time: "Q4 3:45",
    status: "live",
    eventStatus: "Lakers Ball - Free Throw",
    stats: {
      possession: [49, 51],
      shots: [78, 81],
      corners: [0, 0]
    },
    odds: {
      home: 2.45,
      draw: null,
      away: 1.57
    }
  },
  {
    id: "esports-1",
    sport: "Esports",
    league: "CS2 Major",
    homeTeam: "Natus Vincere",
    awayTeam: "FaZe Clan",
    homeScore: 11,
    awayScore: 12,
    time: "Map 3 - Rd 24",
    status: "live",
    eventStatus: "FaZe planted the bomb (B site)",
    stats: {
      possession: [45, 55],
      shots: [84, 89],
      corners: [0, 0]
    },
    odds: {
      home: 2.10,
      draw: null,
      away: 1.72
    }
  },

  // Upcoming Matches
  {
    id: "soccer-up-1",
    sport: "Soccer",
    league: "Champions League",
    homeTeam: "Real Madrid",
    awayTeam: "Manchester City",
    homeScore: 0,
    awayScore: 0,
    time: "Tomorrow 23:30",
    status: "upcoming",
    odds: {
      home: 2.50,
      draw: 3.30,
      away: 2.70
    }
  },
  {
    id: "cricket-up-1",
    sport: "Cricket",
    league: "T20 World Cup",
    homeTeam: "India",
    awayTeam: "Pakistan",
    homeScore: 0,
    awayScore: 0,
    time: "28 May 19:30",
    status: "upcoming",
    odds: {
      home: 1.55,
      draw: 19.00,
      away: 2.45
    }
  },
  {
    id: "tennis-up-1",
    sport: "Tennis",
    league: "Wimbledon",
    homeTeam: "Novak Djokovic",
    awayTeam: "Rafael Nadal",
    homeScore: 0,
    awayScore: 0,
    time: "29 May 15:00",
    status: "upcoming",
    odds: {
      home: 1.40,
      draw: null,
      away: 3.00
    }
  },
  {
    id: "basketball-up-1",
    sport: "Basketball",
    league: "NBA Regular Season",
    homeTeam: "Golden State Warriors",
    awayTeam: "Miami Heat",
    homeScore: 0,
    awayScore: 0,
    time: "30 May 06:30",
    status: "upcoming",
    odds: {
      home: 1.75,
      draw: null,
      away: 2.10
    }
  }
];

export const PROMOTIONS = [
  {
    id: "promo-1",
    title: "IPL Super Odds Boost",
    description: "Get 20% boosted returns on MI vs CSK match. Max stake $50.",
    image: "🏏",
    color: "linear-gradient(135deg, #0f3057 0%, #005a42 100%)"
  },
  {
    id: "promo-2",
    title: "Champions League Early Payout",
    description: "If your team goes 2 goals ahead, we pay out your bet immediately!",
    image: "⚽",
    color: "linear-gradient(135deg, #162447 0%, #1f4068 100%)"
  },
  {
    id: "promo-3",
    title: "Tennis Acca Insurance",
    description: "Get refund as free bet if one leg of your 5+ fold accumulator lets you down.",
    image: "🎾",
    color: "linear-gradient(135deg, #511845 0%, #900c3f 100%)"
  }
];

export const SPORTS_LIST = [
  { name: "Cricket", icon: "🏏", liveCount: 1 },
  { name: "Soccer", icon: "⚽", liveCount: 1 },
  { name: "Tennis", icon: "🎾", liveCount: 1 },
  { name: "Basketball", icon: "🏀", liveCount: 1 },
  { name: "Esports", icon: "🎮", liveCount: 1 },
  { name: "Horse Racing", icon: "🏇", liveCount: 0 },
  { name: "Golf", icon: "⛳", liveCount: 0 },
  { name: "Darts", icon: "🎯", liveCount: 0 },
  { name: "Ice Hockey", icon: "🏒", liveCount: 0 },
  { name: "Table Tennis", icon: "🏓", liveCount: 0 },
  { name: "Volleyball", icon: "🏐", liveCount: 0 }
];
