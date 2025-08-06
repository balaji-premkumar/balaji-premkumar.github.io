// Skills Data Types
export interface Skill {
  name: string;
  level: number; // 1-100
  years: number;
  icon: string;
  category?: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface TechStack {
  category: string;
  technologies: Technology[];
}

export interface Technology {
  name: string;
  icon: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
  description?: string;
}

// Skills organized by categories
export const SKILLS_DATA: Record<string, SkillCategory> = {
  backend: {
    title: "Backend Technologies",
    skills: [
      { name: "C# .NET Core", level: 95, years: 8, icon: "code" },
      { name: "Node.js", level: 90, years: 6, icon: "server" },
      { name: "PHP", level: 85, years: 10, icon: "globe" },
      { name: "Laravel", level: 80, years: 4, icon: "layers" },
      { name: "CodeIgniter", level: 75, years: 3, icon: "box" },
      { name: "Express.js", level: 85, years: 5, icon: "zap" },
      { name: "ASP.NET MVC", level: 90, years: 6, icon: "code" }
    ]
  },
  frontend: {
    title: "Frontend Technologies",
    skills: [
      { name: "React.js", level: 90, years: 5, icon: "cpu" },
      { name: "Next.js", level: 85, years: 3, icon: "zap" },
      { name: "TypeScript", level: 80, years: 3, icon: "file-text" },
      { name: "JavaScript", level: 95, years: 10, icon: "code" },
      { name: "jQuery", level: 85, years: 8, icon: "mouse-pointer" },
      { name: "Tailwind CSS", level: 85, years: 2, icon: "palette" },
      { name: "CSS3", level: 90, years: 10, icon: "brush" },
      { name: "HTML5", level: 95, years: 10, icon: "layout" },
      { name: "Bootstrap", level: 85, years: 6, icon: "grid" },
      { name: "Vue.js", level: 70, years: 2, icon: "cpu" }
    ]
  },
  database: {
    title: "Databases & Storage",
    skills: [
      { name: "MSSQL", level: 90, years: 8, icon: "database" },
      { name: "MySQL", level: 85, years: 10, icon: "database" },
      { name: "MongoDB", level: 80, years: 4, icon: "database" },
      { name: "Redis", level: 75, years: 3, icon: "zap" },
      { name: "PostgreSQL", level: 70, years: 2, icon: "database" },
      { name: "SQLite", level: 80, years: 5, icon: "database" }
    ]
  },
  devops: {
    title: "DevOps & Cloud",
    skills: [
      { name: "AWS", level: 80, years: 4, icon: "cloud" },
      { name: "Azure", level: 75, years: 3, icon: "cloud" },
      { name: "Docker", level: 70, years: 2, icon: "package" },
      { name: "VMware", level: 85, years: 5, icon: "server" },
      { name: "Nginx", level: 80, years: 4, icon: "globe" },
      { name: "PFSense", level: 70, years: 2, icon: "shield" },
      { name: "Jenkins", level: 75, years: 3, icon: "settings" },
      { name: "GitHub Actions", level: 80, years: 2, icon: "git-branch" }
    ]
  },
  tools: {
    title: "Development Tools & Others",
    skills: [
      { name: "Git", level: 90, years: 8, icon: "git-branch" },
      { name: "Android Development", level: 75, years: 3, icon: "smartphone" },
      { name: "Selenium", level: 70, years: 2, icon: "play-circle" },
      { name: "SignalR", level: 85, years: 4, icon: "radio" },
      { name: "WebSockets", level: 80, years: 4, icon: "wifi" },
      { name: "RESTful APIs", level: 95, years: 8, icon: "link" },
      { name: "GraphQL", level: 65, years: 1, icon: "share-2" },
      { name: "Postman", level: 90, years: 6, icon: "send" }
    ]
  }
};

// Technology Stack organized by type
export const TECH_STACK: TechStack[] = [
  {
    category: "Programming Languages",
    technologies: [
      { name: "C#", icon: "code", proficiency: "expert", yearsOfExperience: 8 },
      { name: "JavaScript", icon: "code", proficiency: "expert", yearsOfExperience: 10 },
      { name: "TypeScript", icon: "file-text", proficiency: "advanced", yearsOfExperience: 3 },
      { name: "PHP", icon: "globe", proficiency: "advanced", yearsOfExperience: 10 },
      { name: "Java", icon: "coffee", proficiency: "intermediate", yearsOfExperience: 3 },
      { name: "Python", icon: "code", proficiency: "intermediate", yearsOfExperience: 2 }
    ]
  },
  {
    category: "Frontend Frameworks",
    technologies: [
      { name: "React.js", icon: "cpu", proficiency: "expert", yearsOfExperience: 5 },
      { name: "Next.js", icon: "zap", proficiency: "advanced", yearsOfExperience: 3 },
      { name: "Vue.js", icon: "cpu", proficiency: "intermediate", yearsOfExperience: 2 },
      { name: "Angular", icon: "cpu", proficiency: "beginner", yearsOfExperience: 1 }
    ]
  },
  {
    category: "Backend Frameworks",
    technologies: [
      { name: ".NET Core", icon: "code", proficiency: "expert", yearsOfExperience: 8 },
      { name: "Node.js", icon: "server", proficiency: "expert", yearsOfExperience: 6 },
      { name: "Laravel", icon: "layers", proficiency: "advanced", yearsOfExperience: 4 },
      { name: "Express.js", icon: "zap", proficiency: "advanced", yearsOfExperience: 5 }
    ]
  },
  {
    category: "Databases",
    technologies: [
      { name: "SQL Server", icon: "database", proficiency: "expert", yearsOfExperience: 8 },
      { name: "MySQL", icon: "database", proficiency: "advanced", yearsOfExperience: 10 },
      { name: "MongoDB", icon: "database", proficiency: "advanced", yearsOfExperience: 4 },
      { name: "Redis", icon: "zap", proficiency: "intermediate", yearsOfExperience: 3 }
    ]
  },
  {
    category: "Cloud & DevOps",
    technologies: [
      { name: "AWS", icon: "cloud", proficiency: "advanced", yearsOfExperience: 4 },
      { name: "Azure", icon: "cloud", proficiency: "intermediate", yearsOfExperience: 3 },
      { name: "Docker", icon: "package", proficiency: "intermediate", yearsOfExperience: 2 },
      { name: "Kubernetes", icon: "server", proficiency: "beginner", yearsOfExperience: 1 }
    ]
  }
];

// Core Competencies
export const CORE_COMPETENCIES = [
  "Full Stack Development",
  "Enterprise Application Development",
  "RESTful API Design & Development",
  "Database Design & Optimization",
  "Cloud Architecture",
  "Mobile Application Development",
  "Real-time Communication (SignalR, WebSockets)",
  "Performance Optimization",
  "Code Review & Mentoring",
  "Agile Development",
  "CI/CD Implementation",
  "Security Best Practices"
] as const;

// Certifications and Achievements
export const CERTIFICATIONS = [
  {
    name: "Microsoft Certified: Azure Developer Associate",
    issuer: "Microsoft",
    year: "2023",
    credentialId: "MC-AZ204-2023"
  },
  {
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    year: "2022",
    credentialId: "AWS-SAA-2022"
  }
] as const;

// Areas of Expertise for About section
export const EXPERTISE_AREAS = [
  {
    icon: "code",
    title: "Frontend Excellence",
    description: "Expert in React.js, Next.js, and modern CSS frameworks like Tailwind CSS"
  },
  {
    icon: "server",
    title: "Backend Mastery",
    description: "Proficient in .NET Core, Node.js, and PHP with scalable architecture design"
  },
  {
    icon: "database",
    title: "Database Design",
    description: "Experience with MSSQL, MySQL, MongoDB, and Redis for optimal data solutions"
  },
  {
    icon: "cloud",
    title: "Cloud & DevOps",
    description: "AWS and Azure deployment with CI/CD pipelines and containerization"
  },
  {
    icon: "smartphone",
    title: "Mobile Development",
    description: "Android app development and optimization for better performance"
  },
  {
    icon: "award",
    title: "Quality Focus",
    description: "Committed to clean code, best practices, and continuous improvement"
  }
] as const;
