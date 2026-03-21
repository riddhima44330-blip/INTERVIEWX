const fs = require('fs');
const path = require('path');

const domains = [
  'Frontend development',
  'Backend development',
  'Data Science',
  'AI/Machine learning',
  'System Design',
  'Behavioural interviews',
];
const levels = ['Beginner', 'Intermediate', 'Advanced'];
const totalEachLevel = 50;

const sanitize = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const questions = [];

domains.forEach((domain) => {
  const domainKey = sanitize(domain).split('-').map((word) => word[0]).join('').toUpperCase();

  levels.forEach((level) => {
    for (let i = 1; i <= totalEachLevel; i++) {
      const id = `${domainKey}-${level[0]}-${i}`;
      const questionText = `(${domain} / ${level}) Question ${i}: Which statement best describes this topic?`;

      const options = {
        A: `Option A for ${domain} ${level} ${i}`,
        B: `Option B for ${domain} ${level} ${i}`,
        C: `Option C for ${domain} ${level} ${i}`,
        D: `Option D for ${domain} ${level} ${i}`,
      };

      const answerLetters = ['A', 'B', 'C', 'D'];
      const correctAnswer = answerLetters[(i - 1) % 4];

      questions.push({
        id,
        question: questionText,
        options,
        correctAnswer,
      });
    }
  });
});

const outputPath = path.join(__dirname, '..', 'data', 'questions.json');
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), 'utf8');

console.log(`Generated questions and saved to ${outputPath}`);
