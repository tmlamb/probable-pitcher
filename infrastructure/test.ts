const games = [
  {
    ref: 778869,
    date: "2025-02-20T20:05:00Z",
    away: {
      team: { ref: 112, name: "Chicago Cubs", abbreviation: "CHC" },
      pitcher: { ref: 547001, name: "Cody Poteet", team: 0 },
    },
    home: {
      team: { ref: 119, name: "Los Angeles Dodgers", abbreviation: "LAD" },
      pitcher: { ref: 808967, name: "Yoshinobu Yamamoto", team: 0 },
    },
  },
  {
    ref: 779055,
    date: "2025-02-21T18:05:00Z",
    away: {
      team: { ref: 139, name: "Tampa Bay Rays", abbreviation: "TB" },
      pitcher: { ref: 607216, name: "Joey Krehbiel", team: 0 },
    },
    home: {
      team: { ref: 147, name: "New York Yankees", abbreviation: "NYY" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778780,
    date: "2025-02-21T18:05:00Z",
    away: {
      team: { ref: 343, name: "Northeastern Huskies", abbreviation: "NEU" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 111, name: "Boston Red Sox", abbreviation: "BOS" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778760,
    date: "2025-02-21T20:05:00Z",
    away: {
      team: { ref: 119, name: "Los Angeles Dodgers", abbreviation: "LAD" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 112, name: "Chicago Cubs", abbreviation: "CHC" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778949,
    date: "2025-02-21T20:05:00Z",
    away: {
      team: { ref: 140, name: "Texas Rangers", abbreviation: "TEX" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 118, name: "Kansas City Royals", abbreviation: "KC" },
      pitcher: { ref: 663738, name: "Daniel Lynch IV", team: 0 },
    },
  },
  {
    ref: 787940,
    date: "2025-02-21T20:10:00Z",
    away: {
      team: { ref: 115, name: "Colorado Rockies", abbreviation: "COL" },
      pitcher: { ref: 687134, name: "Bradley Blalock", team: 0 },
    },
    home: {
      team: { ref: 109, name: "Arizona Diamondbacks", abbreviation: "AZ" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 788017,
    date: "2025-02-21T20:10:00Z",
    away: {
      team: { ref: 136, name: "Seattle Mariners", abbreviation: "SEA" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 135, name: "San Diego Padres", abbreviation: "SD" },
      pitcher: { ref: 686701, name: "Ryan Bergert", team: 0 },
    },
  },
  {
    ref: 778740,
    date: "2025-02-22T18:05:00Z",
    away: {
      team: { ref: 120, name: "Washington Nationals", abbreviation: "WSH" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 117, name: "Houston Astros", abbreviation: "HOU" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779135,
    date: "2025-02-22T18:05:00Z",
    away: {
      team: { ref: 134, name: "Pittsburgh Pirates", abbreviation: "PIT" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 110, name: "Baltimore Orioles", abbreviation: "BAL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778977,
    date: "2025-02-22T18:05:00Z",
    away: {
      team: { ref: 111, name: "Boston Red Sox", abbreviation: "BOS" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 139, name: "Tampa Bay Rays", abbreviation: "TB" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779117,
    date: "2025-02-22T18:05:00Z",
    away: {
      team: { ref: 143, name: "Philadelphia Phillies", abbreviation: "PHI" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 116, name: "Detroit Tigers", abbreviation: "DET" },
      pitcher: { ref: 628317, name: "Kenta Maeda", team: 0 },
    },
  },
  {
    ref: 778880,
    date: "2025-02-22T18:05:00Z",
    away: {
      team: { ref: 144, name: "Atlanta Braves", abbreviation: "ATL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 142, name: "Minnesota Twins", abbreviation: "MIN" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778963,
    date: "2025-02-22T18:07:00Z",
    away: {
      team: { ref: 147, name: "New York Yankees", abbreviation: "NYY" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 141, name: "Toronto Blue Jays", abbreviation: "TOR" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778898,
    date: "2025-02-22T18:10:00Z",
    away: {
      team: { ref: 117, name: "Houston Astros", abbreviation: "HOU" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 121, name: "New York Mets", abbreviation: "NYM" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779087,
    date: "2025-02-22T18:10:00Z",
    away: {
      team: { ref: 138, name: "St. Louis Cardinals", abbreviation: "STL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 146, name: "Miami Marlins", abbreviation: "MIA" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778840,
    date: "2025-02-22T20:05:00Z",
    away: {
      team: { ref: 114, name: "Cleveland Guardians", abbreviation: "CLE" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 113, name: "Cincinnati Reds", abbreviation: "CIN" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778867,
    date: "2025-02-22T20:05:00Z",
    away: {
      team: { ref: 118, name: "Kansas City Royals", abbreviation: "KC" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 119, name: "Los Angeles Dodgers", abbreviation: "LAD" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778944,
    date: "2025-02-22T20:05:00Z",
    away: {
      team: { ref: 137, name: "San Francisco Giants", abbreviation: "SF" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 140, name: "Texas Rangers", abbreviation: "TEX" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778757,
    date: "2025-02-22T20:05:00Z",
    away: {
      team: { ref: 145, name: "Chicago White Sox", abbreviation: "CWS" },
      pitcher: { ref: 694363, name: "Jared Shuster", team: 0 },
    },
    home: {
      team: { ref: 112, name: "Chicago Cubs", abbreviation: "CHC" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778808,
    date: "2025-02-22T20:10:00Z",
    away: {
      team: { ref: 109, name: "Arizona Diamondbacks", abbreviation: "AZ" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 115, name: "Colorado Rockies", abbreviation: "COL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779026,
    date: "2025-02-22T20:10:00Z",
    away: {
      team: { ref: 133, name: "Athletics", abbreviation: "ATH" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 135, name: "San Diego Padres", abbreviation: "SD" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779162,
    date: "2025-02-22T20:10:00Z",
    away: {
      team: { ref: 136, name: "Seattle Mariners", abbreviation: "SEA" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 108, name: "Los Angeles Angels", abbreviation: "LAA" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779103,
    date: "2025-02-22T20:10:00Z",
    away: {
      team: { ref: 113, name: "Cincinnati Reds", abbreviation: "CIN" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 158, name: "Milwaukee Brewers", abbreviation: "MIL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778742,
    date: "2025-02-23T18:05:00Z",
    away: {
      team: { ref: 121, name: "New York Mets", abbreviation: "NYM" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 120, name: "Washington Nationals", abbreviation: "WSH" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779085,
    date: "2025-02-23T18:05:00Z",
    away: {
      team: { ref: 117, name: "Houston Astros", abbreviation: "HOU" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 138, name: "St. Louis Cardinals", abbreviation: "STL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778778,
    date: "2025-02-23T18:05:00Z",
    away: {
      team: { ref: 141, name: "Toronto Blue Jays", abbreviation: "TOR" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 111, name: "Boston Red Sox", abbreviation: "BOS" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779039,
    date: "2025-02-23T18:05:00Z",
    away: {
      team: { ref: 142, name: "Minnesota Twins", abbreviation: "MIN" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 134, name: "Pittsburgh Pirates", abbreviation: "PIT" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778915,
    date: "2025-02-23T18:05:00Z",
    away: {
      team: { ref: 110, name: "Baltimore Orioles", abbreviation: "BAL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 143, name: "Philadelphia Phillies", abbreviation: "PHI" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778705,
    date: "2025-02-23T18:05:00Z",
    away: {
      team: { ref: 139, name: "Tampa Bay Rays", abbreviation: "TB" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 144, name: "Atlanta Braves", abbreviation: "ATL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779054,
    date: "2025-02-23T18:05:00Z",
    away: {
      team: { ref: 116, name: "Detroit Tigers", abbreviation: "DET" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 147, name: "New York Yankees", abbreviation: "NYY" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778897,
    date: "2025-02-23T18:10:00Z",
    away: {
      team: { ref: 146, name: "Miami Marlins", abbreviation: "MIA" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 121, name: "New York Mets", abbreviation: "NYM" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778842,
    date: "2025-02-23T20:05:00Z",
    away: {
      team: { ref: 108, name: "Los Angeles Angels", abbreviation: "LAA" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 114, name: "Cleveland Guardians", abbreviation: "CLE" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779143,
    date: "2025-02-23T20:05:00Z",
    away: {
      team: { ref: 115, name: "Colorado Rockies", abbreviation: "COL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 133, name: "Athletics", abbreviation: "ATH" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778864,
    date: "2025-02-23T20:05:00Z",
    away: {
      team: { ref: 135, name: "San Diego Padres", abbreviation: "SD" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 119, name: "Los Angeles Dodgers", abbreviation: "LAD" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778993,
    date: "2025-02-23T20:05:00Z",
    away: {
      team: { ref: 113, name: "Cincinnati Reds", abbreviation: "CIN" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 137, name: "San Francisco Giants", abbreviation: "SF" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778755,
    date: "2025-02-23T20:05:00Z",
    away: {
      team: { ref: 140, name: "Texas Rangers", abbreviation: "TEX" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 112, name: "Chicago Cubs", abbreviation: "CHC" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778941,
    date: "2025-02-23T20:05:00Z",
    away: {
      team: { ref: 145, name: "Chicago White Sox", abbreviation: "CWS" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 118, name: "Kansas City Royals", abbreviation: "KC" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779020,
    date: "2025-02-23T20:10:00Z",
    away: {
      team: { ref: 109, name: "Arizona Diamondbacks", abbreviation: "AZ" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 136, name: "Seattle Mariners", abbreviation: "SEA" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778807,
    date: "2025-02-23T20:10:00Z",
    away: {
      team: { ref: 158, name: "Milwaukee Brewers", abbreviation: "MIL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 115, name: "Colorado Rockies", abbreviation: "COL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779082,
    date: "2025-02-24T18:05:00Z",
    away: {
      team: { ref: 121, name: "New York Mets", abbreviation: "NYM" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 138, name: "St. Louis Cardinals", abbreviation: "STL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779114,
    date: "2025-02-24T18:05:00Z",
    away: {
      team: { ref: 141, name: "Toronto Blue Jays", abbreviation: "TOR" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 116, name: "Detroit Tigers", abbreviation: "DET" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778978,
    date: "2025-02-24T18:05:00Z",
    away: {
      team: { ref: 142, name: "Minnesota Twins", abbreviation: "MIN" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 139, name: "Tampa Bay Rays", abbreviation: "TB" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778913,
    date: "2025-02-24T18:05:00Z",
    away: {
      team: { ref: 134, name: "Pittsburgh Pirates", abbreviation: "PIT" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 143, name: "Philadelphia Phillies", abbreviation: "PHI" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779134,
    date: "2025-02-24T18:05:00Z",
    away: {
      team: { ref: 144, name: "Atlanta Braves", abbreviation: "ATL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 110, name: "Baltimore Orioles", abbreviation: "BAL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778737,
    date: "2025-02-24T18:05:00Z",
    away: {
      team: { ref: 146, name: "Miami Marlins", abbreviation: "MIA" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 117, name: "Houston Astros", abbreviation: "HOU" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778771,
    date: "2025-02-24T18:05:00Z",
    away: {
      team: { ref: 147, name: "New York Yankees", abbreviation: "NYY" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 111, name: "Boston Red Sox", abbreviation: "BOS" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778837,
    date: "2025-02-24T20:05:00Z",
    away: {
      team: { ref: 119, name: "Los Angeles Dodgers", abbreviation: "LAD" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 113, name: "Cincinnati Reds", abbreviation: "CIN" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778943,
    date: "2025-02-24T20:05:00Z",
    away: {
      team: { ref: 133, name: "Athletics", abbreviation: "ATH" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 118, name: "Kansas City Royals", abbreviation: "KC" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778994,
    date: "2025-02-24T20:05:00Z",
    away: {
      team: { ref: 115, name: "Colorado Rockies", abbreviation: "COL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 137, name: "San Francisco Giants", abbreviation: "SF" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778865,
    date: "2025-02-24T20:05:00Z",
    away: {
      team: { ref: 140, name: "Texas Rangers", abbreviation: "TEX" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 145, name: "Chicago White Sox", abbreviation: "CWS" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 778806,
    date: "2025-02-24T20:10:00Z",
    away: {
      team: { ref: 114, name: "Cleveland Guardians", abbreviation: "CLE" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 109, name: "Arizona Diamondbacks", abbreviation: "AZ" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779019,
    date: "2025-02-24T20:10:00Z",
    away: {
      team: { ref: 112, name: "Chicago Cubs", abbreviation: "CHC" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 135, name: "San Diego Padres", abbreviation: "SD" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779159,
    date: "2025-02-24T20:10:00Z",
    away: {
      team: { ref: 137, name: "San Francisco Giants", abbreviation: "SF" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 108, name: "Los Angeles Angels", abbreviation: "LAA" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
  {
    ref: 779104,
    date: "2025-02-24T20:10:00Z",
    away: {
      team: { ref: 136, name: "Seattle Mariners", abbreviation: "SEA" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
    home: {
      team: { ref: 158, name: "Milwaukee Brewers", abbreviation: "MIL" },
      pitcher: { ref: 0, name: "", team: 0 },
    },
  },
];
