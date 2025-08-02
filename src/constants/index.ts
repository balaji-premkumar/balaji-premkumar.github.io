// Personal Information
export const PersonalInfo = {
  name: "Balaji Premkumar",
  title: "Full Stack Engineer",
  subtitle: "Code Pirate of the Digital Seas",
  description: "Self-taught Full Stack Engineer with 10+ years of experience in application and presentation layers, databases, and server technologies. Expertise in both front-end and back-end development, gained through hands-on work.",
  email: "balaji0710@gmail.com",
  phone: "8122708776",
  location: "Bangalore",
  github: "github.com/balaji0710",
  profileImage: "/images/mypic.jpg"
};

// Navigation Menu (One Piece themed)
export const NavigationMenu = {
  about: "Crew Member",
  experience: "Adventures",
  skills: "Devil Fruits",
  projects: "Treasures",
  contact: "Send Message"
};

// Experience/Work History
export const WorkExperience = [
  {
    id: 1,
    position: "Senior Software Engineer",
    company: "Canarys Automation Pvt Ltd",
    location: "Bangalore KA",
    duration: "07/2022 - Present",
    type: "Service based company working with multiple vendors",
    achievements: [
      "Oversaw the development of a Core project utilizing SQL Server, which consisted of 20+ modules. Contributed to all modules and focused on implementing key security measures to protect against potential attacks.",
      "Served as an advisor to a team in the development of a product, providing support from inception to completion.",
      "Effectively managed deployment, identifying and communicating server issues with ops."
    ],
    technologies: ["C#", ".Net Core"]
  },
  {
    id: 2,
    position: "Full Stack Engineer",
    company: "Startvis Technologies Pvt. Ltd.",
    location: "Bangalore KA",
    duration: "05/2017 - 06/2022",
    type: "Mother Firm of a product based company called \"CANSELL\"",
    achievements: [
      "I have experience in creating and integrating both backend and frontend components.",
      "Optimized and reduced the size of an existing Android application, implemented a notification service, and successfully released the updated version.",
      "I built the whole backend and frontend for the organization, as well as the relevant applications. Created our own notification service using the .net core SignalR using Websockets protocol."
    ],
    technologies: ["C#", ".Net Core", "SignalR", "WPF", "PHP", "Laravel", "Android", "jQuery", "Lodash", "MSSQL", "MySQL", "MongoDB", "Redis", "ELK", "Selenium", "PFSense", "Nginx", "Shell/Bash", "AWS", "Azure", "VMware", "React.JS", "Next.js", "Node.JS"]
  },
  {
    id: 3,
    position: "Web Developer",
    company: "Megasoft Computers",
    location: "Dindigul TN",
    duration: "09/2012 - 12/2015",
    type: "Software Training & Project Company",
    achievements: [
      "Worked on Core PHP & WordPress. Based on client requirements.",
      "Integrated third party payment gateway, SMS & Email service.",
      "Upskilled beginner level computer and networking knowledge to school and college students."
    ],
    technologies: ["PHP", "WordPress", "MySQL", "HTML", "CSS", "JavaScript", "jQuery"]
  }
];

// Technical Skills organized by categories with map coordinates
export const TechnicalSkills = {
  languages: [
    { name: "C#", level: 90, icon: "SiCsharp", color: "#239120", ship: "🚢", mapPosition: { x: 15, y: 20 } },
    { name: "PHP", level: 80, icon: "SiPhp", color: "#777BB4", ship: "⛵", mapPosition: { x: 75, y: 35 } },
    { name: "JavaScript", level: 85, icon: "SiJavascript", color: "#F7DF1E", ship: "🛥️", mapPosition: { x: 85, y: 15 } },
    { name: "TypeScript", level: 80, icon: "SiTypescript", color: "#3178C6", ship: "⛵", mapPosition: { x: 65, y: 75 } },
    { name: "Java", level: 70, icon: "SiJava", color: "#ED8B00", ship: "🚤", mapPosition: { x: 25, y: 80 } },
    { name: "HTML", level: 90, icon: "SiHtml5", color: "#E34F26", ship: "🚢", mapPosition: { x: 90, y: 60 } },
    { name: "CSS", level: 85, icon: "SiCss3", color: "#1572B6", ship: "🛥️", mapPosition: { x: 45, y: 25 } },
    { name: "Shell/Bash", level: 70, icon: "SiGnubash", color: "#4EAA25", ship: "🚤", mapPosition: { x: 55, y: 90 } }
  ],
  frameworks: [
    { name: ".Net Core", level: 90, icon: "SiDotnet", color: "#512BD4", ship: "🚢", mapPosition: { x: 20, y: 45 } },
    { name: "React.JS", level: 85, icon: "SiReact", color: "#61DAFB", ship: "🛥️", mapPosition: { x: 80, y: 80 } },
    { name: "Next.js", level: 80, icon: "SiNextdotjs", color: "#000000", ship: "⛵", mapPosition: { x: 70, y: 30 } },
    { name: "Node.JS", level: 75, icon: "SiNodedotjs", color: "#339933", ship: "🚤", mapPosition: { x: 30, y: 70 } },
    { name: "Laravel", level: 75, icon: "SiLaravel", color: "#FF2D20", ship: "🚤", mapPosition: { x: 85, y: 45 } },
    { name: "CodeIgniter", level: 75, icon: "SiCodeigniter", color: "#EF4223", ship: "🚤", mapPosition: { x: 40, y: 60 } },
    { name: "jQuery", level: 85, icon: "SiJquery", color: "#0769AD", ship: "🛥️", mapPosition: { x: 15, y: 75 } },
    { name: "SignalR", level: 85, icon: "SiMicrosoft", color: "#0078D4", ship: "🛥️", mapPosition: { x: 75, y: 65 } },
    { name: "WPF", level: 85, icon: "SiMicrosoft", color: "#0078D4", ship: "🛥️", mapPosition: { x: 60, y: 40 } },
    { name: "Android SDK", level: 70, icon: "SiAndroid", color: "#3DDC84", ship: "🚤", mapPosition: { x: 50, y: 85 } }
  ],
  databases: [
    { name: "SQL Server", level: 90, icon: "SiMicrosoftsqlserver", color: "#CC2927", ship: "🚢", mapPosition: { x: 25, y: 30 } },
    { name: "MySQL", level: 85, icon: "SiMysql", color: "#4479A1", ship: "🛥️", mapPosition: { x: 70, y: 50 } },
    { name: "MongoDB", level: 80, icon: "SiMongodb", color: "#47A248", ship: "⛵", mapPosition: { x: 80, y: 25 } },
    { name: "Redis", level: 75, icon: "SiRedis", color: "#DC382D", ship: "🚤", mapPosition: { x: 35, y: 85 } },
    { name: "PostgreSQL", level: 70, icon: "SiPostgresql", color: "#336791", ship: "🚤", mapPosition: { x: 90, y: 70 } }
  ],
  tools: [
    { name: "Git", level: 90, icon: "SiGit", color: "#F05032", ship: "🚢", mapPosition: { x: 10, y: 60 } },
    { name: "Visual Studio", level: 90, icon: "SiVisualstudio", color: "#5C2D91", ship: "🚢", mapPosition: { x: 85, y: 35 } },
    { name: "VS Code", level: 95, icon: "SiVisualstudiocode", color: "#007ACC", ship: "🏴‍☠️", mapPosition: { x: 50, y: 20 } },
    { name: "Nginx", level: 75, icon: "SiNginx", color: "#009639", ship: "🚤", mapPosition: { x: 65, y: 85 } },
    { name: "ELK Stack", level: 70, icon: "SiElastic", color: "#005571", ship: "🚤", mapPosition: { x: 20, y: 90 } },
    { name: "Selenium", level: 75, icon: "SiSelenium", color: "#43B02A", ship: "🚤", mapPosition: { x: 75, y: 20 } },
    { name: "PFSense", level: 65, icon: "SiPfsense", color: "#212121", ship: "🛶", mapPosition: { x: 40, y: 95 } },
    { name: "Docker", level: 70, icon: "SiDocker", color: "#2496ED", ship: "🚤", mapPosition: { x: 90, y: 85 } },
    { name: "Postman", level: 85, icon: "SiPostman", color: "#FF6C37", ship: "🛥️", mapPosition: { x: 15, y: 40 } }
  ],
  cloud: [
    { name: "AWS", level: 75, icon: "SiAmazonaws", color: "#232F3E", ship: "🚤", mapPosition: { x: 60, y: 70 } },
    { name: "Azure", level: 80, icon: "SiMicrosoftazure", color: "#0078D4", ship: "⛵", mapPosition: { x: 30, y: 50 } },
    { name: "VMware", level: 70, icon: "SiVmware", color: "#607078", ship: "🚤", mapPosition: { x: 80, y: 90 } },
    { name: "GitHub", level: 90, icon: "SiGithub", color: "#181717", ship: "🚢", mapPosition: { x: 45, y: 75 } },
    { name: "Firebase", level: 65, icon: "SiFirebase", color: "#FFCA28", ship: "🛶", mapPosition: { x: 70, y: 95 } }
  ]
};

// Ship types based on skill level
export const getShipByLevel = (level: number): string => {
  if (level >= 90) return "🏴‍☠️"; // Pirate ship for mastery
  if (level >= 80) return "🚢"; // Large ship for advanced
  if (level >= 75) return "🛥️"; // Medium boat for intermediate
  if (level >= 70) return "⛵"; // Sailboat for good
  if (level >= 65) return "🚤"; // Small boat for basic
  return "🛶"; // Canoe for beginner
};

// Skill level descriptions
export const getSkillDescription = (level: number): string => {
  if (level >= 90) return "Captain Level";
  if (level >= 80) return "First Mate";
  if (level >= 75) return "Navigator";
  if (level >= 70) return "Crew Member";
  if (level >= 65) return "Apprentice";
  return "Rookie";
};

// Projects Portfolio
export const Projects = [
  {
    id: 1,
    title: "Enterprise Security Platform",
    description: "Core security platform with 20+ modules handling authentication, authorization, and threat detection",
    technologies: ["C#", ".Net Core", "React.JS", "SQL Server", "Redis"],
    features: [
      "Multi-module architecture",
      "Advanced security implementation",
      "Real-time threat detection",
      "Scalable microservices"
    ],
    status: "Production",
    type: "Enterprise Application"
  },
  {
    id: 2,
    title: "Real-time Notification System",
    description: "Custom notification service using SignalR and WebSockets for real-time communication",
    technologies: ["SignalR", ".Net Core", "WebSockets", "Redis"],
    features: [
      "Real-time messaging",
      "Multi-platform support",
      "Scalable architecture",
      "Custom protocol implementation"
    ],
    status: "Production",
    type: "System Service"
  },
  {
    id: 3,
    title: "Mobile Commerce Platform",
    description: "Full-stack e-commerce solution with mobile app optimization and payment integration",
    technologies: ["Android", "PHP", "Laravel", "MySQL", "Payment Gateways"],
    features: [
      "Mobile-first design",
      "Payment gateway integration",
      "Inventory management",
      "Order tracking system"
    ],
    status: "Production",
    type: "E-commerce Platform"
  }
];

// Education
export const Education = {
  degree: "DECE",
  institution: "Aravindar Polytechnic College",
  year: "2010-2013",
  field: "Diploma in Electronics and Communication Engineering"
};

// Languages
export const Languages = [
  { name: "Tamil", proficiency: "Native Bilingual Proficiency" },
  { name: "English", proficiency: "Full Professional Proficiency" },
  { name: "Kannada", proficiency: "Limited Working Proficiency" },
  { name: "Sourashtra", proficiency: "Limited Working Proficiency" }
];

// Interests (One Piece themed)
export const Interests = [
  { name: "Anime", description: "Exploring new worlds and adventures", icon: "🏴‍☠️" },
  { name: "Gaming", description: "Strategic thinking and problem solving", icon: "🎮" },
  { name: "AI & ML", description: "Discovering new technologies", icon: "🤖" },
  { name: "Web3 Technologies", description: "Navigating the digital seas", icon: "⚓" }
];

// Social Links
export const SocialLinks = {
  github: "https://github.com/balaji0710",
  linkedin: "https://linkedin.com/in/balaji-premkumar",
  email: "mailto:balaji0710@gmail.com",
  phone: "tel:+918122708776"
};

// One Piece themed quotes for different sections
export const OnePieceQuotes = {
  hero: "I'm gonna be the King of the Pirates!",
  about: "A man's dream will never die!",
  experience: "The seas are vast, and adventures await!",
  skills: "Power isn't determined by your size, but the size of your heart and dreams!",
  projects: "Wealth, fame, power... I found everything the world had to offer!",
  contact: "Let's set sail together towards new adventures!"
};

// One Piece Characters for each section
export const OnePieceCharacters = {
  hero: {
    name: "Luffy",
    emoji: "👒",
    power: "Gomu Gomu no Mi",
    color: "#DC143C",
    ability: "Rubber stretching arms",
    quote: "I'm gonna be the King of the Pirates!"
  },
  about: {
    name: "Nami",
    emoji: "🧭",
    power: "Clima-Tact",
    color: "#FF8C00",
    ability: "Weather manipulation",
    quote: "I'll draw a map of the whole world!"
  },
  experience: {
    name: "Zoro",
    emoji: "⚔️",
    power: "Three Sword Style",
    color: "#228B22",
    ability: "Three sword technique",
    quote: "I'll become the world's greatest swordsman!"
  },
  skills: {
    name: "Sanji",
    emoji: "👨‍🍳",
    power: "Black Leg Style",
    color: "#FFD700",
    ability: "Cooking and kicking",
    quote: "I'll find the All Blue!"
  },
  projects: {
    name: "Usopp",
    emoji: "🎯",
    power: "Slingshot Mastery",
    color: "#ADFF2F",
    ability: "Precise shooting",
    quote: "I'm a brave warrior of the sea!"
  },
  contact: {
    name: "Chopper",
    emoji: "🦌",
    power: "Human-Human Fruit",
    color: "#FFB6C1",
    ability: "Transformation healing",
    quote: "I want to cure any disease!"
  }
};

// Animation and theme configurations
export const ThemeConfig = {
  primaryColors: {
    ocean: "#003366",
    deepBlue: "#001a33",
    gold: "#FFD700",
    sunset: "#FF6B35",
    strawHat: "#F4A460",
    treasure: "#DAA520"
  },
  animations: {
    floatDuration: "3s",
    waveDuration: "2s",
    glowDuration: "2s"
  }
};
