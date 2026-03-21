export interface InterviewFeedback {
  confidence: number;
  communication: number;
  technical: number;
  clarity: number;
  suggestions: string[];
}

export interface Interview {
  _id: string;
  domain: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[];
  questions: string[];
  answers: string[];
  score: number;
  currentRound: number;
  feedback: InterviewFeedback;
  createdAt: string;
}
