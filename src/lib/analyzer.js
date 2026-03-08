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

    const skillMap = {
        coreCS: "Core CS",
        languages: "Languages",
        web: "Web",
        data: "Data",
        cloud: "Cloud/DevOps",
        testing: "Testing"
    };

    const extractedSkills = {
        coreCS: [],
        languages: [],
        web: [],
        data: [],
        cloud: [],
        testing: [],
        other: []
    };

    Object.keys(skillMap).forEach(key => {
        const category = skillMap[key];
        const found = CATEGORIES[category].filter(kw => {
            const escaped = escapeRegExp(kw.toLowerCase());
            const regex = new RegExp(`(^|[^a-z0-9_])${escaped}([^a-z0-9_]|$)`, 'i');
            return regex.test(text);
        });
        extractedSkills[key] = found;
    });

    const allDetected = Object.values(extractedSkills).flat();
    const hasSkills = allDetected.length > 0;

    if (!hasSkills) {
        extractedSkills.other = ["Communication", "Problem solving", "Basic coding", "Projects"];
    }

    let baseScore = 35;
    const categoriesPresent = Object.values(extractedSkills).filter(arr => arr.length > 0).length;
    baseScore += Math.min(30, categoriesPresent * 5);
    if (company && company.trim().length > 0) baseScore += 10;
    if (role && role.trim().length > 0) baseScore += 10;
    if (jdText && jdText.trim().length > 800) baseScore += 10;
    if (baseScore > 100) baseScore = 100;

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

    if (extractedSkills.languages.length > 0) {
        round1.push(`Review core syntax and memory management for ${extractedSkills.languages[0].toUpperCase()}`);
        round2.push(`Practice standard libraries and collections in ${extractedSkills.languages[0].toUpperCase()}`);
    } else {
        round1.push("Review OOP concepts and design patterns");
        round2.push("Practice writing clean code on whiteboard/paper");
    }

    if (extractedSkills.web.length > 0) {
        round3.push(`Review component lifecycle, state, and rendering in ${extractedSkills.web[0].toUpperCase()}`);
        round3.push("Practice creating responsive layouts and RESTful interactions");
    } else if (!hasSkills) {
        round3.push("Practice common front-end tasks likely in basic coding tests");
    } else {
        round3.push("Practice explaining technical concepts simply");
    }

    if (extractedSkills.data.length > 0) {
        round3.push(`Practice writing complex queries and schema design for ${extractedSkills.data[0].toUpperCase()}`);
        round2.push("Review Normalization and ACID properties");
    }

    if (extractedSkills.cloud.length > 0) {
        round3.push(`Review deployment, scaling, and CI/CD pipelines using ${extractedSkills.cloud[0].toUpperCase()}`);
    }

    if (extractedSkills.coreCS.length > 0) {
        round2.push("Revise edge-case handling in data structure manipulations");
    }

    const padRound = (arr) => {
        while (arr.length < 5) arr.push("Review generic system design concepts");
        if (arr.length > 8) arr.length = 8;
    };
    padRound(round1); padRound(round2); padRound(round3); padRound(round4);

    const checklist = [
        { roundTitle: "Round 1: Aptitude / Basics", items: round1 },
        { roundTitle: "Round 2: DSA + Core CS", items: round2 },
        { roundTitle: "Round 3: Tech interview (projects + stack)", items: round3 },
        { roundTitle: "Round 4: Managerial / HR", items: round4 }
    ];

    let day5Tasks = ["Project + resume alignment"];
    if (extractedSkills.web.length > 0) {
        day5Tasks = [`Project + alignment (Focus: Frontend/Backend Web Stack)`];
    } else if (extractedSkills.cloud.length > 0) {
        day5Tasks = [`Project + alignment (Focus: Cloud infrastructure)`];
    } else if (extractedSkills.data.length > 0) {
        day5Tasks = [`Project + alignment (Focus: Database schema & queries)`];
    }

    const plan7Days = [
        { day: "Day 1–2", focus: "Basics + core CS revision", tasks: ["Revise CS fundamentals", "Quick syntax recap"] },
        { day: "Day 3–4", focus: "DSA + coding practice", tasks: ["Solve top 50 LeetCode patterns", "Time complexity drills"] },
        { day: "Day 5", focus: "Project + stack deep dive", tasks: day5Tasks },
        { day: "Day 6", focus: "Mock interview questions", tasks: ["Prepare 10 skill-based questions", "Behavioral prep"] },
        { day: "Day 7", focus: "Revision + weak areas", tasks: ["Final review of JD requirements", "Mental walkthrough"] }
    ];

    const questions = [];
    allDetected.forEach(skill => {
        if (Q_BANK[skill.toLowerCase()] && questions.length < 10 && !questions.includes(Q_BANK[skill.toLowerCase()])) {
            questions.push(Q_BANK[skill.toLowerCase()]);
        }
    });

    if (extractedSkills.web.length > 0 && questions.length < 10) questions.push("How do you ensure security in a web application?");
    if (extractedSkills.testing.length > 0 && questions.length < 10) questions.push(Q_BANK["testing"]);

    let i = 0;
    while (questions.length < 10 && i < GENERIC_QUESTIONS.length) {
        if (!questions.includes(GENERIC_QUESTIONS[i])) {
            questions.push(GENERIC_QUESTIONS[i]);
        }
        i++;
    }

    const enterprises = ["google", "amazon", "microsoft", "meta", "apple", "netflix", "tcs", "infosys", "wipro", "accenture", "cognizant", "ibm", "oracle", "salesforce", "adobe", "samsung", "walmart"];
    const lowerCompany = (company || "").toLowerCase();
    let isEnterprise = enterprises.some(e => lowerCompany.includes(e));

    const roundMapping = [];
    if (isEnterprise) {
        roundMapping.push({ roundTitle: "Round 1: Online Assessment", focusAreas: ["DSA", "Aptitude"], whyItMatters: "Used to filter thousands of applications at scale." });
        roundMapping.push({ roundTitle: "Round 2: Technical Interview I", focusAreas: ["DSA", "Algorithms"], whyItMatters: "Tests your ability to solve complex problems with code." });
        roundMapping.push({ roundTitle: "Round 3: Technical Interview II", focusAreas: ["Core CS", "Projects"], whyItMatters: "Ensures solid theoretical foundation in OS, DBMS, etc." });
        roundMapping.push({ roundTitle: "Round 4: Managerial / HR", focusAreas: ["Culture", "Behavioral"], whyItMatters: "Evaluates teamwork, ethics, and long-term stability." });
    } else {
        roundMapping.push({ roundTitle: "Round 1: Practical Screen", focusAreas: ["Machine Coding", "Task"], whyItMatters: "Verification that you can build features immediately." });
        roundMapping.push({ roundTitle: "Round 2: Technical Discussion", focusAreas: ["Stack Depth", "System Design"], whyItMatters: "Deep dive into your architectural understanding." });
        roundMapping.push({ roundTitle: "Round 3: Culture Fit", focusAreas: ["Founder Round", "Teamwork"], whyItMatters: "Small teams need perfect interpersonal alignment." });
    }

    const now = new Date().toISOString();
    return {
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
        company: company || "",
        role: role || "",
        jdText,
        extractedSkills,
        roundMapping,
        checklist,
        plan7Days,
        questions,
        baseScore,
        skillConfidenceMap: {},
        finalScore: baseScore
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
    try {
        const raw = localStorage.getItem("jd_history");
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        // Filter out corrupted entries (e.g. missing id)
        const validEntries = parsed.filter(entry => entry && entry.id);

        if (validEntries.length < parsed.length) {
            console.warn("Some corrupted history entries were skipped.");
            // We'll let the UI handle the specific message if needed, 
            // but we ensure the app doesn't crash.
        }
        return validEntries;
    } catch (e) {
        console.error("Failed to parse history:", e);
        return [];
    }
}

export function getHistoryEntry(id) {
    const history = getHistory();
    return history.find(e => e.id === id);
}
