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
    "networks": "What happens when you type a URL into the browser?",
    "c++": "Explain the concepts of pointers and references. How do they differ?",
    "c#": "What is the difference between value types and reference types?",
    "typescript": "How do Interfaces differ from Type Aliases in TypeScript?",
    "next.js": "Can you explain Server-Side Rendering (SSR) vs Static Site Generation (SSG)?",
    "express": "How do middleware functions work in Express?",
    "redis": "What are some common use cases for Redis in a scalable application?",
    "kubernetes": "Explain the concept of a Pod in Kubernetes.",
    "linux": "How would you find and kill a process that is consuming too much memory?",
    "testing": "What is the difference between Unit testing and Integration testing?"
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

// Helper to escape regex chars
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function analyzeJD(company, role, jdText) {
    const text = (jdText || "").toLowerCase();

    const extractedSkills = {};
    Object.keys(CATEGORIES).forEach(category => {
        const found = CATEGORIES[category].filter(kw => {
            const escaped = escapeRegExp(kw.toLowerCase());
            const regex = new RegExp(`(^|[^a-z0-9_])${escaped}([^a-z0-9_]|$)`, 'i');
            return regex.test(text);
        });
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
    const hasSkills = allDetected.length > 0;
    if (!hasSkills) {
        extractedSkills["General"] = ["General fresher stack"];
    }

    // Generate 5-8 round items based on skills
    const round1 = [
        "Revise quantitative aptitude and logical reasoning",
        "Practice speed-math and data interpretation",
        "Complete 2-3 timed mock aptitude tests",
        "Brush up fundamentals (OS, DBMS, Networks)",
        "Review core syntax for chosen programming language"
    ];

    const round2 = [
        "Practice arrays, strings, and hash maps",
        "Revise sorting and searching algorithms",
        "Solve 5 medium-level tree/graph problems",
        "Review time and space complexity analysis"
    ];

    const round3 = [
        hasSkills ? `Deep dive into projects using: ${allDetected.slice(0, 4).join(", ").toUpperCase()}` : "Deep dive into your resume projects",
        "Prepare explanations for architectural choices",
        "Be ready to discuss API design and edge cases",
        "Prepare system design basics (scalability, load balancing)"
    ];

    const round4 = [
        "Prepare STAR method responses for behavioral questions",
        `Research ${company || "the company"} and its core values`,
        "Prepare 3 strong questions for the interviewer",
        "Review resume line-by-line for accuracy",
        "Practice elevator pitch/introduction"
    ];

    if (extractedSkills["Languages"]) {
        round1.push(`Review core syntax and memory management for ${extractedSkills["Languages"][0].toUpperCase()}`);
        round2.push(`Practice standard libraries and collections in ${extractedSkills["Languages"][0].toUpperCase()}`);
    } else {
        round1.push("Review OOP concepts and design patterns");
        round2.push("Practice writing clean code on whiteboard/paper");
    }

    if (extractedSkills["Web"]) {
        round3.push(`Review component lifecycle, state, and rendering in ${extractedSkills["Web"][0].toUpperCase()}`);
        round3.push("Practice creating responsive layouts and RESTful interactions");
    } else {
        round3.push("Practice explaining technical concepts simply");
    }

    if (extractedSkills["Data"]) {
        round3.push(`Practice writing complex queries and schema design for ${extractedSkills["Data"][0].toUpperCase()}`);
        round2.push("Review Normalization and ACID properties");
    }

    if (extractedSkills["Cloud/DevOps"]) {
        round3.push(`Review deployment, scaling, and CI/CD pipelines using ${extractedSkills["Cloud/DevOps"][0].toUpperCase()}`);
    }

    if (extractedSkills["Core CS"]) {
        round2.push("Revise edge-case handling in data structure manipulations");
    }

    // Ensure lengths are between 5-8
    const padRound = (arr, max) => {
        while (arr.length < 5) arr.push("Review generic system design concepts");
        if (arr.length > 8) arr.length = 8;
    };
    padRound(round1); padRound(round2); padRound(round3); padRound(round4);

    const checklist = [
        { round: "Round 1: Aptitude / Basics", items: round1 },
        { round: "Round 2: DSA + Core CS", items: round2 },
        { round: "Round 3: Tech interview (projects + stack)", items: round3 },
        { round: "Round 4: Managerial / HR", items: round4 }
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

    // Exactly 10 questions based on skills
    const questions = [];
    allDetected.forEach(skill => {
        if (Q_BANK[skill.toLowerCase()] && questions.length < 10 && !questions.includes(Q_BANK[skill.toLowerCase()])) {
            questions.push(Q_BANK[skill.toLowerCase()]);
        }
    });

    // fallback to generic categories
    if (extractedSkills["Web"] && questions.length < 10) questions.push("How do you ensure security in a web application?");
    if (extractedSkills["Testing"] && questions.length < 10) questions.push(Q_BANK["testing"]);

    let i = 0;
    while (questions.length < 10 && i < GENERIC_QUESTIONS.length) {
        if (!questions.includes(GENERIC_QUESTIONS[i])) {
            questions.push(GENERIC_QUESTIONS[i]);
        }
        i++;
    }

    return {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        company: company || "Unknown Company",
        role: role || "Unknown Role",
        jdText,
        extractedSkills,
        skillConfidenceMap: {}, // Initialize empty
        plan,
        checklist,
        questions,
        readinessScore,
        originalReadinessScore: readinessScore // Store base score
    };
}

export function saveHistory(entry) {
    const existing = JSON.parse(localStorage.getItem("jd_history") || "[]");
    existing.unshift(entry);
    localStorage.setItem("jd_history", JSON.stringify(existing));
}

export function updateHistoryEntry(updatedEntry) {
    const existing = JSON.parse(localStorage.getItem("jd_history") || "[]");
    const index = existing.findIndex(e => e.id === updatedEntry.id);
    if (index !== -1) {
        existing[index] = updatedEntry;
        localStorage.setItem("jd_history", JSON.stringify(existing));
    }
}

export function getHistory() {
    return JSON.parse(localStorage.getItem("jd_history") || "[]");
}

export function getHistoryEntry(id) {
    const existing = JSON.parse(localStorage.getItem("jd_history") || "[]");
    return existing.find(e => e.id === id);
}
