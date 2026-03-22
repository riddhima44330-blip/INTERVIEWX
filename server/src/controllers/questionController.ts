import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';

const predefinedQuestions: Record<string, Record<string, string[]>> = {
  frontend: {
    Beginner: [
      "What is HTML?",
      "What is CSS?",
      "What is JavaScript?",
      "What is DOM?",
      "What is React?"
    ],
    Intermediate: [
      "Explain useState",
      "Explain useEffect",
      "What is props vs state?",
      "What is event handling?",
      "What is routing?"
    ],
    Advanced: [
      "Explain Virtual DOM",
      "Performance optimization in React",
      "How React rendering works?",
      "State management strategies",
      "Code splitting"
    ]
  },
  backend: {
    Beginner: [
      "What is server?",
      "What is API?",
      "What is Node.js?",
      "What is Express?",
      "What is database?"
    ],
    Intermediate: [
      "What is middleware?",
      "Explain REST API",
      "What is authentication?",
      "What is routing?",
      "What is MVC?"
    ],
    Advanced: [
      "Explain JWT flow",
      "Design scalable backend",
      "Microservices vs monolith",
      "Database optimization",
      "Caching strategies"
    ]
  },
  'data-science': {
    Beginner: [
      "What is Data Science?",
      "What is a dataset?",
      "What is meant by data cleaning?",
      "What is the difference between mean and median?",
      "What is Python used for in Data Science?"
    ],
    Intermediate: [
      "Explain the difference between supervised and unsupervised learning",
      "What is a correlation matrix?",
      "How do you handle missing values in a dataset?",
      "What is cross-validation?",
      "Explain the concept of overfitting"
    ],
    Advanced: [
      "How does Gradient Descent work?",
      "Explain the bias-variance tradeoff",
      "What is PCA and when would you use it?",
      "How do you deploy a machine learning model?",
      "Explain time series analysis"
    ]
  },
  'ai-ml': {
    Beginner: [
      "What is Artificial Intelligence?",
      "What is Machine Learning?",
      "What is a neural network?",
      "What is training data?",
      "What is a model?"
    ],
    Intermediate: [
      "Explain the concept of Deep Learning",
      "What are activation functions?",
      "What is backpropagation?",
      "What is the difference between epoch and batch size?",
      "How do convolutional neural networks work?"
    ],
    Advanced: [
      "Explain the architecture of a Transformer model",
      "How do Generative Adversarial Networks (GANs) work?",
      "What is Reinforcement Learning?",
      "Explain the vanishing gradient problem",
      "How do you optimize a large language model?"
    ]
  },
  'system-design': {
    Beginner: [
      "What is a client-server architecture?",
      "What is scalability?",
      "What is a database?",
      "What is an API?",
      "What is load balancing?"
    ],
    Intermediate: [
      "Explain the difference between vertical and horizontal scaling",
      "What is caching and how does it improve system performance?",
      "What is a Content Delivery Network (CDN)?",
      "Explain the concept of microservices",
      "What is database sharding?"
    ],
    Advanced: [
      "How would you design a system like Netflix?",
      "Explain the CAP theorem",
      "How do you design a rate limiter?",
      "What are the challenges of distributed transactions?",
      "How do you ensure high availability and fault tolerance?"
    ]
  },
  behavioral: {
    Beginner: [
      "Tell me about yourself",
      "Why do you want to work here?",
      "What is your greatest strength?",
      "What is your greatest weakness?",
      "Where do you see yourself in 5 years?"
    ],
    Intermediate: [
      "Describe a time you faced a challenge at work",
      "Tell me about a time you made a mistake",
      "How do you handle tight deadlines?",
      "Give an example of how you worked on a team",
      "How do you handle constructive criticism?"
    ],
    Advanced: [
      "Tell me about a time you resolved a conflict within your team",
      "Describe a situation where you had to lead a project under difficult circumstances",
      "How do you manage a team member who is underperforming?",
      "Tell me about a time you had to pivot your strategy completely",
      "How do you approach a situation where requirements are highly ambiguous?"
    ]
  }
};

export const getQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  const { domain, level } = req.params;
  try {
    const domainStr = domain as string;
    const levelStr = level as string;
    const domainKey = domainStr.toLowerCase();
    
    // Fallback logic
    if (!predefinedQuestions[domainKey] || !predefinedQuestions[domainKey][levelStr]) {
       const mockQs = Array.from({ length: 5 }, (_, i) => `${levelStr} ${domainStr} Question ${i + 1}`);
       res.json({ questions: mockQs });
       return;
    }

    const availableQuestions = predefinedQuestions[domainKey][levelStr];
    res.json({ questions: availableQuestions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

