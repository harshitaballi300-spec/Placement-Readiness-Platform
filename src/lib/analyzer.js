export const CATEGORIES = {
    "Core CS": ["dsa", "oop", "dbms", "os", "networks", "object-oriented", "operating system"],
    "Languages": ["java", "python", "javascript", "typescript", "c", "c++", "c#", "go", "golang"],
    "Web": ["react", "next.js", "node.js", "express", "rest", "graphql", "frontend", "backend"],
    "Data": ["sql", "mongodb", "postgresql", "mysql", "redis", "nosql"],
    "Cloud/DevOps": ["aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "linux"],
    "Testing": ["selenium", "cypress", "playwright", "junit", "pytest", "jest"]
};

const Q_BANK = {
    "sql": "Explain indexing and when it helps.",
    "react": "Explain state management options in functional components.",
    "dsa": "How would you optimize search in sorted data?",
    "java": "Explain the difference between an interface and an abstract class.",
    "python": "What is the GIL and how does it affect concurrency?",
    "javascript": "Explain closures and the event loop.",
    "mongodb": "How does document nesting compare to relational joins?",
    "aws": "Differentiate between EC2 and serverless options like Lambda.",
    "docker": "Explain the difference between a container and an image.",
    "node.js": "How does Node process asynchronous operations via the Event Loop?",
    "oop": "Explain the four main pillars of OOP with real-world examples.",
    "dbms": "What are ACID properties in a database?",
    "os": "Explain the difference between a process and a thread.",
    "networks": "What happens when you type a URL into the browser?"
};

const GENERIC_QUESTIONS = [
    "Describe a time you solved a challenging technical problem.",
    "Why do you want to work for this company?",
    "How do you handle disagreements with team members?",
    "Explain your favorite project from your resume.",
    "Where do you see yourself in 5 years?",
    "How do you keep your technical skills updated?",
    "Describe a time you failed and what you learned.",
    "What is your preferred development environment?",
    "What is the most complex architecture you have designed?",
    "Do you have any questions for us?"
];

export function analyzeJD(company, role, jdText) {
    const text = (jdText || "").toLowerCase();

    const extractedSkills = {};
    Object.keys(CATEGORIES).forEach(category => {
        const found = CATEGORIES[category].filter(kw => text.includes(kw.toLowerCase()));
        if (found.length > 0) {
            extractedSkills[category] = found;
        }
    });

    const categoriesPresent = Object.keys(extractedSkills).length;

    let readinessScore = 35;
    readinessScore += Math.min(30, categoriesPresent * 5);
    if (company && company.trim().length > 0) readinessScore += 10;
    if (role && role.trim().length > 0) readinessScore += 10;
    if (jdText && jdText.trim().length > 800) readinessScore += 10;
    if (readinessScore > 100) readinessScore = 100;

    const allDetected = Object.values(extractedSkills).flat();
    const techStackStr = allDetected.length > 0 ? allDetected.join(", ").toUpperCase() : "General stack";

    const checklist = [
        {
            round: "Round 1: Aptitude / Basics",
            items: [
                "Revise quantitative aptitude and logical reasoning",
                "Practice speed-math and data interpretation",
                "Review Object Oriented Programming principles",
                "Brush up fundamentals (OS, DBMS, Networks)",
                "Complete 2-3 timed mock aptitude tests",
                "Review core syntax for chosen programming language"
            ]
        },
        {
            round: "Round 2: DSA + Core CS",
            items: [
                "Practice arrays, strings, and hash maps",
                "Revise sorting and searching algorithms",
                "Solve 5 medium-level tree/graph problems",
                "Review time and space complexity analysis",
                "Practice writing clean code on whiteboard/paper",
                "Prepare for edge cases in your algorithm"
            ]
        },
        {
            round: "Round 3: Tech interview (projects + stack)",
            items: [
                `Deep dive into projects using: ${techStackStr}`,
                "Prepare explanations for architectural choices",
                "Review common pitfalls of your core technologies",
                "Be ready to discuss API design and edge cases",
                "Practice explaining technical concepts simply",
                "Prepare system design basics (scalability, load balancing)"
            ]
        },
        {
            round: "Round 4: Managerial / HR",
            items: [
                "Prepare STAR method responses for behavioral questions",
                `Research ${company || "the company"} and its core values`,
                "Prepare 3 strong questions for the interviewer",
                "Review resume line-by-line for accuracy",
                "Practice elevator pitch/introduction"
            ]
        }
    ];

    let day5Focus = "Project + resume alignment";
    if (extractedSkills["Web"]) {
        day5Focus = `Project + alignment (Focus: Frontend/Backend Web Stack)`;
    } else if (extractedSkills["Cloud/DevOps"]) {
        day5Focus = `Project + alignment (Focus: Cloud infrastructure)`;
    } else if (extractedSkills["Data"]) {
        day5Focus = `Project + alignment (Focus: Database schema & queries)`;
    }

    const plan = [
        { day: "Day 1–2", task: "Basics + core CS revision" },
        { day: "Day 3–4", task: "DSA + coding practice" },
        { day: "Day 5", task: day5Focus },
        { day: "Day 6", task: "Mock interview questions" },
        { day: "Day 7", task: "Revision + weak areas" }
    ];

    const questions = [];
    allDetected.forEach(skill => {
        if (Q_BANK[skill.toLowerCase()] && questions.length < 5) {
            questions.push(Q_BANK[skill.toLowerCase()]);
        }
    });

    let i = 0;
    while (questions.length < 10 && i < GENERIC_QUESTIONS.length) {
        questions.push(GENERIC_QUESTIONS[i]);
        i++;
    }

    return {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        company: company || "Unknown Company",
        role: role || "Unknown Role",
        jdText,
        extractedSkills: Object.keys(extractedSkills).length === 0 ? { "General": ["General fresher stack"] } : extractedSkills,
        plan,
        checklist,
        questions,
        readinessScore
    };
}

export function saveHistory(entry) {
    const existing = JSON.parse(localStorage.getItem("jd_history") || "[]");
    existing.unshift(entry);
    localStorage.setItem("jd_history", JSON.stringify(existing));
}

export function getHistory() {
    return JSON.parse(localStorage.getItem("jd_history") || "[]");
}

export function getHistoryEntry(id) {
    const existing = JSON.parse(localStorage.getItem("jd_history") || "[]");
    return existing.find(e => e.id === id);
}
