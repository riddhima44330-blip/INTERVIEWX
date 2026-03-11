import mongoose from 'mongoose';
import connectDB from './src/db/connect';
import QuestionBank from './src/models/QuestionBank';
import dotenv from 'dotenv';
dotenv.config();

const domains = ['frontend', 'backend', 'data-science', 'ai-ml', 'system-design', 'behavioral'];
const levels = ['Beginner', 'Intermediate', 'Advanced'];

// Generator for 50 dummy-but-realistic questions per combo
function generateQuestions(domain: string, level: string): string[] {
    const list: string[] = [];
    for (let i = 1; i <= 50; i++) {
        if (domain === 'frontend') {
            if (level === 'Beginner') list.push(`What is the difference between inline and block elements in HTML? (Variation ${i})`);
            if (level === 'Intermediate') list.push(`Explain how the Virtual DOM works in React and why it optimizes performance. (Variation ${i})`);
            if (level === 'Advanced') list.push(`Describe the rendering pipeline of a modern browser and how you'd optimize critical rendering path. (Variation ${i})`);
        } else if (domain === 'backend') {
            if (level === 'Beginner') list.push(`What is a REST API and what are the main HTTP methods used? (Variation ${i})`);
            if (level === 'Intermediate') list.push(`How do you handle authentication and authorization in a Node.js Express application? (Variation ${i})`);
            if (level === 'Advanced') list.push(`Explain horizontal vs vertical scaling and how you would design a system to handle 100k requests/second. (Variation ${i})`);
        } else {
            // Generic for others to save space
            list.push(`[${level}] Can you explain a core concept in ${domain} and how you've applied it? (Variation ${i})`);
        }
    }
    return list;
}

const seedQuestions = async () => {
    try {
        await connectDB();
        console.log("Connected to DB, wiping existing question banks...");
        await QuestionBank.deleteMany({});
        
        console.log("Seeding new question banks...");
        for (const domain of domains) {
            for (const level of levels) {
                const questions = generateQuestions(domain, level);
                await QuestionBank.create({
                    domain,
                    level,
                    questionList: questions
                });
            }
        }
        console.log("Successfully seeded 50 questions for each domain/level combination!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding questions:", err);
        process.exit(1);
    }
};

seedQuestions();
