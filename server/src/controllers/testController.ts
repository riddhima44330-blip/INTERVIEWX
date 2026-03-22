import { Request, Response } from 'express';

const testQuestions: Record<string, any[]> = {
  'frontend': [
    { text: "What is HTML?", options: ["A programming language", "HyperText Markup Language", "Database", "Server"], correctAnswerIndex: 1 },
    { text: "What does CSS do?", options: ["Handles logic", "Styles the web pages", "Stores data", "Manages routing"], correctAnswerIndex: 1 },
    { text: "What is DOM?", options: ["Data Object Model", "Document Object Model", "Design Object Model", "Direct Object Management"], correctAnswerIndex: 1 },
    { text: "What is React?", options: ["A database", "A JavaScript library for building UIs", "A CSS framework", "An operating system"], correctAnswerIndex: 1 },
    { text: "What is JSX?", options: ["JavaScript XML parser", "JavaScript XML extension for React", "Java tool", "Backend API"], correctAnswerIndex: 1 },
    { text: "What is useState?", options: ["Routing handler", "A React Hook for managing state", "An API library", "CSS-in-JS utility"], correctAnswerIndex: 1 },
    { text: "What is useEffect?", options: ["Handles styles", "A Hook for side effects in functional components", "Render method", "Form validation"], correctAnswerIndex: 1 },
    { text: "What is Virtual DOM?", options: ["A physical structure", "A lightweight abstraction of the Real DOM in React", "Database instance", "Window object"], correctAnswerIndex: 1 },
    { text: "What is event handling?", options: ["Data fetching", "Handling user interactions like clicks and form submissions", "Animation tool", "Server routing"], correctAnswerIndex: 1 },
    { text: "What is props?", options: ["A state manager", "Arguments passed into React components", "Internal component state", "HTML attributes"], correctAnswerIndex: 1 }
  ],
  'backend': [
    { text: "What is API?", options: ["A styling tool", "Application Programming Interface", "A database system", "Web browser module"], correctAnswerIndex: 1 },
    { text: "What is Node.js?", options: ["A frontend library", "A JavaScript runtime built on Chrome's V8 Engine", "A database server", "CSS framework"], correctAnswerIndex: 1 },
    { text: "What is Express?", options: ["A database", "A minimal web framework for Node.js", "A frontend tool", "API client"], correctAnswerIndex: 1 },
    { text: "What is middleware?", options: ["A database layer", "Functions that have access to request and response objects", "A styling tool", "Frontend UI element"], correctAnswerIndex: 1 },
    { text: "What is REST?", options: ["A time-out function", "Representational State Transfer architectural style", "A browser feature", "JavaScript library"], correctAnswerIndex: 1 },
    { text: "What is JWT?", options: ["Java Web Tool", "JSON Web Token for secure data transmission", "A database table", "Routing module"], correctAnswerIndex: 1 },
    { text: "What is authentication?", options: ["Data deletion", "Verifying the identity of a user or system", "Styling websites", "Structuring HTML"], correctAnswerIndex: 1 },
    { text: "What is database?", options: ["Memory leak", "An organized collection of structured information or data", "A frontend state manager", "User input field"], correctAnswerIndex: 1 },
    { text: "What is server?", options: ["A CSS utility", "A device or program that provides services to other programs", "JavaScript operator", "HTML tag"], correctAnswerIndex: 1 },
    { text: "What is routing?", options: ["Drawing lines", "Determining how an application responds to a client request to a particular endpoint", "Storing files", "Connecting CSS"], correctAnswerIndex: 1 }
  ],
  'data-science': [
    { text: "What is data analysis?", options: ["Building UIs", "Process of inspecting, cleansing, transforming, and modeling data", "Managing servers", "Styling pages"], correctAnswerIndex: 1 },
    { text: "What is pandas?", options: ["An animal", "A fast, powerful, flexible data analysis library for Python", "A JavaScript framework", "A database server"], correctAnswerIndex: 1 },
    { text: "What is numpy?", options: ["Number parser", "Library for the Python programming language adding support for large arrays and matrices", "A CSS preprocessor", "Node.js package"], correctAnswerIndex: 1 },
    { text: "What is regression?", options: ["Moving backwards", "A statistical method used in finance, investing, and other disciplines to determine strength and character of relationship", "A sorting algorithm", "A web framework"], correctAnswerIndex: 1 },
    { text: "What is visualization?", options: ["Imagining things", "The graphical representation of information and data", "A testing method", "Coding practice"], correctAnswerIndex: 1 },
    { text: "What is data cleaning?", options: ["Deleting code", "The process of fixing or removing incorrect, corrupted, incorrectly formatted data", "Formatting hard drives", "Writing tests"], correctAnswerIndex: 1 },
    { text: "What is mean?", options: ["Being aggressive", "The average of a set of numbers", "A CSS property", "A database query"], correctAnswerIndex: 1 },
    { text: "What is median?", options: ["Center of road", "The middle value in a given set of numbers or data", "High point", "Low point"], correctAnswerIndex: 1 },
    { text: "What is standard deviation?", options: ["A wrong turn", "A measure of the amount of variation or dispersion of a set of values", "A software bug", "Operating system feature"], correctAnswerIndex: 1 },
    { text: "What is dataset?", options: ["Code files", "A collection of related sets of information that is composed of separate elements", "Configuration file", "System logs"], correctAnswerIndex: 1 }
  ],
  'ai-ml': [
    { text: "What is machine learning?", options: ["Robots building things", "A branch of AI that focuses on building applications that learn from data", "Writing raw binary", "Web scraping"], correctAnswerIndex: 1 },
    { text: "What is supervised learning?", options: ["Watching users click", "Machine learning task of learning a function that maps an input to an output based on example input-output pairs", "Manual coding", "Database querying"], correctAnswerIndex: 1 },
    { text: "What is unsupervised learning?", options: ["Running scripts blindly", "A type of machine learning that looks for previously undetected patterns in a data set with no pre-existing labels", "Deleting logs", "Formatting HTML"], correctAnswerIndex: 1 },
    { text: "What is neural network?", options: ["Brain biology", "A series of algorithms that endeavors to recognize underlying relationships in a set of data", "Computer hardware", "Internet cable"], correctAnswerIndex: 1 },
    { text: "What is deep learning?", options: ["Studying hard", "A subset of machine learning based on artificial neural networks with multiple layers", "A recursive function", "Complex SQL query"], correctAnswerIndex: 1 },
    { text: "What is training data?", options: ["Workout stats", "The initial data used to train machine learning models", "User profiles", "Cache files"], correctAnswerIndex: 1 },
    { text: "What is model?", options: ["Fashion worker", "A mathematically based representation of a real-world process in machine learning", "A UI component", "CSS layout"], correctAnswerIndex: 1 },
    { text: "What is prediction?", options: ["Guessing", "The output of an algorithm after it has been trained on a historical dataset", "Reading the future", "Hardcoded string"], correctAnswerIndex: 1 },
    { text: "What is classification?", options: ["Sorting boxes", "A predictive modeling problem where a class label is predicted for a given example", "CSS class naming", "Organizing files"], correctAnswerIndex: 1 },
    { text: "What is regression?", options: ["Reversing", "A type of predictive modeling technique which investigates the relationship between a dependent and independent variable", "A software bug test", "Rolling back DB"], correctAnswerIndex: 1 }
  ],
  'system-design': [
    { text: "What is scalability?", options: ["Weighing things", "The property of a system to handle a growing amount of work by adding resources", "A CSS scaling property", "Database relationship"], correctAnswerIndex: 1 },
    { text: "What is load balancing?", options: ["Carrying weights", "The process of distributing network traffic across multiple servers", "Checking bank accounts", "Structuring HTML"], correctAnswerIndex: 1 },
    { text: "What is caching?", options: ["Banking money", "A technique that stores a copy of a given resource and serves it back when requested", "A security flaw", "Writing code"], correctAnswerIndex: 1 },
    { text: "What is database sharding?", options: ["Breaking glass", "A type of database partitioning that separates very large databases into smaller, faster, more easily managed parts", "Deleting tables", "Creating backups"], correctAnswerIndex: 1 },
    { text: "What is microservices?", options: ["Small computers", "An architectural style that structures an application as a collection of services", "A UI design pattern", "A JavaScript library"], correctAnswerIndex: 1 },
    { text: "What is API gateway?", options: ["A physical door", "An API management tool that sits between a client and a collection of backend services", "A UI element", "A router"], correctAnswerIndex: 1 },
    { text: "What is CDN?", options: ["C++ Data Node", "Content Delivery Network, a geographically distributed group of servers", "Cascading Data Nodes", "Central Database Network"], correctAnswerIndex: 1 },
    { text: "What is latency?", options: ["Being late", "The time it takes for data or a request to go from the source to the destination", "A networking cable", "Programming error"], correctAnswerIndex: 1 },
    { text: "What is throughput?", options: ["Punching holes", "The amount of a product or service that a company can produce and deliver to a client within a specified period of time", "A storage unit", "Processor speed"], correctAnswerIndex: 1 },
    { text: "What is fault tolerance?", options: ["Allowing mistakes", "The property that enables a system to continue operating properly in the event of the failure of some of its components", "A forgiving coworker", "Debugging method"], correctAnswerIndex: 1 }
  ],
  'behavioral': [
    { text: "Tell me about yourself", options: ["I like food", "Professional summary focusing on relevant experience and career trajectory", "A novel of my life", "Nothing much"], correctAnswerIndex: 1 },
    { text: "Why should we hire you?", options: ["I need a job", "An explanation of how my skills and experience align perfectly with the role's requirements", "I am cool", "I live nearby"], correctAnswerIndex: 1 },
    { text: "What is your strength?", options: ["Lifting weights", "Highlighting key professional attributes supported by specific examples", "Sleeping", "Eating"], correctAnswerIndex: 1 },
    { text: "What is your weakness?", options: ["I have none", "A genuine area of improvement accompanied by steps I'm actively taking to address it", "Kryptonite", "Waking up early"], correctAnswerIndex: 1 },
    { text: "Describe a challenge", options: ["A math problem", "A specific workplace obstacle and how I collaborated or problem-solved to overcome it", "A video game level", "Cooking"], correctAnswerIndex: 1 },
    { text: "Leadership example", options: ["Yelling at people", "A situation where I guided a team or initiative to a successful outcome", "Being bossy", "Ignoring team"], correctAnswerIndex: 1 },
    { text: "Conflict resolution", options: ["Starting fights", "A methodical approach to understanding differing viewpoints and finding a constructive compromise", "Running away", "Complaining"], correctAnswerIndex: 1 },
    { text: "Failure experience", options: ["I never fail", "A situation where things didn't go as planned and the important lessons I learned from it", "Losing my keys", "Forgetting names"], correctAnswerIndex: 1 },
    { text: "Teamwork example", options: ["Working alone", "A scenario demonstrating how I effectively collaborate, communicate, and support my colleagues", "Doing all the work myself", "Avoiding meetings"], correctAnswerIndex: 1 },
    { text: "Career goals", options: ["Retiring rich", "My professional aspirations and how this role fits into my long-term trajectory", "Becoming president", "I don't know"], correctAnswerIndex: 1 }
  ]
};

export const startTest = async (req: Request, res: Response) => {
  try {
    const { domain } = req.body;
    
    if (!domain || !testQuestions[domain]) {
      return res.status(400).json({ message: 'Invalid or missing domain' });
    }

    // Return the 10 questions for the selected domain
    res.status(200).json({ questions: testQuestions[domain] });
  } catch (error) {
    console.error('Error starting test:', error);
    res.status(500).json({ message: 'Failed to start test' });
  }
};

export const submitTest = async (req: Request, res: Response) => {
  try {
    const { score } = req.body;
    
    // Validate score
    if (typeof score !== 'number' || score < 0 || score > 10) {
      return res.status(400).json({ message: 'Invalid score' });
    }

    // Level calculation
    // 0-3: Beginner
    // 4-6: Intermediate
    // 7-10: Advanced
    let level = 'Beginner';
    if (score >= 7) {
      level = 'Advanced';
    } else if (score >= 4) {
      level = 'Intermediate';
    }

    res.status(200).json({ level });
  } catch (error) {
    console.error('Error submitting test:', error);
    res.status(500).json({ message: 'Failed to submit test' });
  }
};
