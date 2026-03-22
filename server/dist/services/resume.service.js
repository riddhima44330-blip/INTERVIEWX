"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeResume = analyzeResume;
function analyzeResume(text) {
    const lowerText = text.toLowerCase();
    const skills = [];
    // Skill keywords
    const skillMap = {
        beginner: ['html', 'css', 'javascript', 'sql', 'git'],
        intermediate: ['react', 'node', 'angular', 'vue', 'mongodb', 'express', 'python'],
        advanced: ['docker', 'kubernetes', 'aws', 'microservices', 'system design', 'kafka']
    };
    let score = 0;
    // Extract skills and calculate score
    Object.entries(skillMap).forEach(([level, keywords]) => {
        keywords.forEach(keyword => {
            if (lowerText.includes(keyword)) {
                skills.push(keyword.toUpperCase());
                score += level === 'beginner' ? 1 : level === 'intermediate' ? 2 : 3;
            }
        });
    });
    // Experience detection
    const expMatch = lowerText.match(/(\d+)\s*(?:years?|yrs?)/i);
    if (expMatch) {
        const years = parseInt(expMatch[1]);
        score += years >= 3 ? 3 : years >= 1 ? 2 : 1;
    }
    // Level determination
    const level = score >= 8 ? 'Advanced' : score >= 5 ? 'Intermediate' : 'Beginner';
    return { skills: skills.slice(0, 10), level };
}
