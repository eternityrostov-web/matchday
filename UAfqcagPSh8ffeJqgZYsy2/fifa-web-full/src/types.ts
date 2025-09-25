// Report Types
export interface Report {
  id: string;
  createdAt: string;
  matchNumber: string;
  date: string;
  time: string;
  tournament: string;
  stadium: string;
  homeTeam: string;
  awayTeam: string;
  finalScore: string;
  venueManagerName: string;
  spectators: number;
  vipGuests: number;
  vvipGuests: number;
  mediaRepresentatives: number;
  photographers: number;
  functionalAreas: FunctionalArea[];
  generalIssues: string;
  drsCompliant: boolean;
  drsComment: string;
  additionalComments: string;
  status: 'completed' | 'issues';
  photos?: string[];
}

export interface FunctionalArea {
  name: string;
  status: boolean;
  comment: string;
}

export interface ReportFormData {
  matchNumber: string;
  date: string;
  time: string;
  tournament: string;
  stadium: string;
  homeTeam: string;
  awayTeam: string;
  finalScore: string;
  venueManagerName: string;
  spectators: number;
  vipGuests: number;
  vvipGuests: number;
  mediaRepresentatives: number;
  photographers: number;
  functionalAreas: FunctionalArea[];
  generalIssues: string;
  drsCompliant: boolean;
  drsComment: string;
  additionalComments: string;
  photos?: string[];
}