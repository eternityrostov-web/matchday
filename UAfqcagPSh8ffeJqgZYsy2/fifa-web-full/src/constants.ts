export const functionalAreas = [
  'Ticketing Office',
  'Security Control Room', 
  'Media Center',
  'VIP Lounge',
  'VVIP Lounge',
  'First Aid Station',
  'Broadcast Compound',
  'Team Dressing Rooms',
  'Referee Dressing Room',
  'Stadium Lighting',
  'Sound System',
  'Field Condition',
  'Parking Areas',
  'Concession Stands',
  'Emergency Exits'
];

export const tournaments = [
  'FIFA World Cup 2026',
  'Qualifiers',
  'Friendlies',
  'Nations League',
  'Confederation Cup'
];

export const defaultReport = {
  matchNumber: '',
  date: '',
  time: '',
  tournament: 'FIFA World Cup 2026',
  stadium: '',
  homeTeam: '',
  awayTeam: '',
  finalScore: '',
  venueManagerName: '',
  spectators: 0,
  vipGuests: 0,
  vvipGuests: 0,
  mediaRepresentatives: 0,
  photographers: 0,
  functionalAreas: functionalAreas.map(area => ({
    name: area,
    status: true,
    comment: ''
  })),
  generalIssues: '',
  drsCompliant: true,
  drsComment: '',
  additionalComments: '',
  photos: []
};