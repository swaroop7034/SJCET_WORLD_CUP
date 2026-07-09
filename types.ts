/** Shared TypeScript interfaces used across the app */

export interface Student {
  id: string;
  auth_id: string;
  name: string;
  branch: string;
  year: number;
  email: string;
  total_points: number;
}

export interface Match {
  id: string;
  team_a: string;
  team_b: string;
  stage: string;
  match_date: string;
  prediction_deadline: string;
  status: string;
}

export interface Player {
  id: string;
  name: string;
  branch: string;
  year: number;
  total_points: number;
  rank: number;
}
