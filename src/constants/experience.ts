// Experience Data Types
export interface Experience {
  id: number;
  company: string;
  position: string;
  duration: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  type: 'current' | 'previous';
}

export interface Education {
  degree: string;
  institution: string;
  duration: string;
  description: string;
  skills: string[];
}

// Professional Experience Data
export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    company: "Canarys Automation",
    position: "Senior Software Engineer",
    duration: "2022 - Present",
    location: "Bangalore, India",
    description: "Leading development of enterprise-level .NET Core applications with 20+ modules, implementing robust security features and optimizing system performance.",
    achievements: [
      "Developed and maintained 20+ modules in a large-scale .NET Core project",
      "Implemented comprehensive security measures and authentication systems",
      "Optimized application performance resulting in 40% faster load times",
      "Led code reviews and mentored junior developers",
      "Integrated multiple third-party APIs and payment gateways",
      "Designed scalable database architecture for enterprise applications",
      "Implemented CI/CD pipelines reducing deployment time by 50%"
    ],
    technologies: [".NET Core", "C#", "SQL Server", "Azure", "API Development", "Security Implementation"],
    type: "current"
  },
  {
    id: 2,
    company: "Startvis Technologies",
    position: "Full Stack Engineer",
    duration: "2017 - 2022",
    location: "Bangalore, India",
    description: "Full-stack development of CANSELL platform, server architecture design, and mobile app optimization with real-time communication features.",
    achievements: [
      "Built and deployed the complete CANSELL e-commerce platform",
      "Designed scalable server architecture handling 10k+ concurrent users",
      "Optimized Android app performance by 60% through code refactoring",
      "Implemented real-time notifications using SignalR and WebSockets",
      "Developed RESTful APIs serving 100+ endpoints",
      "Set up CI/CD pipelines reducing deployment time by 80%",
      "Led a team of 5 developers on multiple projects",
      "Integrated payment gateways and third-party services"
    ],
    technologies: ["Node.js", "React.js", "MongoDB", "Android", "SignalR", "WebSockets", "AWS", "Docker"],
    type: "previous"
  },
  {
    id: 3,
    company: "Megasoft Computers",
    position: "Web Developer",
    duration: "2012 - 2015",
    location: "Chennai, India",
    description: "PHP and WordPress development, payment gateway integrations, and custom web application development for various clients.",
    achievements: [
      "Developed 50+ custom WordPress websites and themes",
      "Integrated multiple payment gateways (PayPal, Stripe, Razorpay)",
      "Built custom PHP applications for inventory management",
      "Optimized website performance achieving 95+ PageSpeed scores",
      "Managed hosting and server configurations",
      "Provided technical support and maintenance for client websites",
      "Created responsive designs for mobile compatibility",
      "Implemented SEO best practices increasing organic traffic by 200%"
    ],
    technologies: ["PHP", "WordPress", "MySQL", "jQuery", "CSS3", "HTML5", "Payment Gateways"],
    type: "previous"
  }
];

// Education Data
export const EDUCATION: Education[] = [
  {
    degree: "Self-Taught Full Stack Engineer",
    institution: "Continuous Learning & Practice",
    duration: "2012 - Present",
    description: "Self-directed learning across multiple programming languages, frameworks, and technologies through online resources, documentation, and hands-on projects.",
    skills: ["Problem Solving", "Self-Learning", "Adaptability", "Research", "Documentation"]
  }
];

// Career Highlights
export const CAREER_HIGHLIGHTS = [
  "10+ years of professional software development experience",
  "Led development of enterprise applications with 20+ modules",
  "Optimized mobile applications improving performance by 60%",
  "Designed and implemented scalable systems serving 10k+ users",
  "Built 100+ RESTful APIs for various applications",
  "Mentored and led teams of developers",
  "Expertise in full-stack development across multiple technologies"
] as const;
