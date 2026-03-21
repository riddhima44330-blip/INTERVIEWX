export interface ResumeData {
  skills: string[];
  technologies: string[];
  experienceKeywords: string[];
}

export interface ResumeAnalysisResponse {
  resumeData: ResumeData;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}
