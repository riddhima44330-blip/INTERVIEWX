export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  level?: number;
  xp?: number;
  streak?: number;
  badges?: string[];
}
