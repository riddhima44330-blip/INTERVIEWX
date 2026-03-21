export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer?: string;
  correctAnswerIndex: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}
