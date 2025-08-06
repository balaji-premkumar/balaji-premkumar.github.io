// Project Data Types
export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  technologies: string[];
  features: string[];
  links: {
    live?: string | null;
    github?: string | null;
    demo?: string | null;
  };
  status: 'Production' | 'In Development' | 'Completed' | 'Archived';
  year: string;
  highlights?: string[];
  challenges?: string[];
  learnings?: string[];
}

// Project Categories for filtering
export const PROJECT_CATEGORIES = [
  "All",
  "Enterprise Application",
  "Full Stack Web Application",
  "Backend Service",
  "Mobile Development",
  "Web Development",
  "Frontend Development",
  "API Development",
  "E-commerce Platform"
] as const;

// Featured Projects Data
export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Enterprise .NET Core System",
    category: "Enterprise Application",
    description: "Large-scale enterprise application with 20+ modules including user management, reporting, and security features.",
    image: "/images/enterprise-system.jpg",
    technologies: [".NET Core", "C#", "SQL Server", "Azure", "Security", "JWT", "Entity Framework"],
    features: [
      "20+ interconnected modules",
      "Role-based access control",
      "Advanced security implementation",
      "Real-time reporting dashboard",
      "API integration layer",
      "Multi-tenant architecture",
      "Audit logging system",
      "Performance monitoring"
    ],
    links: {
      live: null,
      github: null // Private project
    },
    status: "Production",
    year: "2022-2024",
    highlights: [
      "Served 1000+ concurrent users",
      "99.9% uptime in production",
      "Reduced processing time by 40%"
    ],
    challenges: [
      "Complex business logic implementation",
      "Performance optimization for large datasets",
      "Security compliance requirements"
    ],
    learnings: [
      "Advanced .NET Core patterns",
      "Enterprise security best practices",
      "Scalable architecture design"
    ]
  },
  {
    id: 2,
    title: "CANSELL E-commerce Platform",
    category: "E-commerce Platform",
    description: "Complete e-commerce platform with real-time features, payment integration, and mobile app support.",
    image: "/images/cansell-platform.jpg",
    technologies: ["Node.js", "React.js", "MongoDB", "SignalR", "AWS", "Stripe", "Redux"],
    features: [
      "Real-time inventory management",
      "Multi-payment gateway integration",
      "WebSocket-based notifications",
      "Mobile-responsive design",
      "Admin dashboard with analytics",
      "Order tracking system",
      "User review and rating system",
      "Advanced search and filtering"
    ],
    links: {
      live: "https://cansell.example.com",
      github: null // Private project
    },
    status: "Production",
    year: "2019-2022",
    highlights: [
      "Processed $1M+ in transactions",
      "10k+ registered users",
      "Mobile app with 4.5+ rating"
    ],
    challenges: [
      "Real-time synchronization across platforms",
      "Payment gateway integration complexities",
      "Scalability for growing user base"
    ],
    learnings: [
      "E-commerce best practices",
      "Real-time system architecture",
      "Payment processing security"
    ]
  },
  {
    id: 3,
    title: "Real-time Notification Service",
    category: "Backend Service",
    description: "Scalable notification service using SignalR and WebSockets for real-time communication across multiple applications.",
    image: "/images/notification-service.jpg",
    technologies: ["SignalR", "WebSockets", ".NET Core", "Redis", "Azure", "Docker"],
    features: [
      "Real-time bi-directional communication",
      "Scalable to 10k+ concurrent connections",
      "Message queuing with Redis",
      "Cross-platform client support",
      "Monitoring and analytics dashboard",
      "Message delivery confirmation",
      "Push notification integration",
      "Load balancing support"
    ],
    links: {
      live: null,
      github: "https://github.com/balaji00710/signalr-notification-service"
    },
    status: "Production",
    year: "2021",
    highlights: [
      "99.95% message delivery rate",
      "Sub-second latency",
      "Auto-scaling capabilities"
    ],
    challenges: [
      "Connection state management",
      "Message ordering and reliability",
      "Cross-platform compatibility"
    ],
    learnings: [
      "Real-time communication patterns",
      "WebSocket optimization",
      "Distributed system design"
    ]
  },
  {
    id: 4,
    title: "Android App Performance Optimization",
    category: "Mobile Development",
    description: "Performance optimization project that improved Android app speed by 60% through code refactoring and architecture improvements.",
    image: "/images/android-optimization.jpg",
    technologies: ["Android", "Java", "SQLite", "Retrofit", "RxJava", "Performance Tools"],
    features: [
      "60% performance improvement",
      "Memory usage optimization",
      "Database query optimization",
      "UI/UX enhancements",
      "Crash reduction by 90%",
      "Battery usage optimization",
      "Network request optimization",
      "Image loading optimization"
    ],
    links: {
      live: "https://play.google.com/store/apps/details?id=com.example.app",
      github: null
    },
    status: "Production",
    year: "2020",
    highlights: [
      "App rating improved from 3.2 to 4.7",
      "Download increased by 200%",
      "Crash rate reduced to <0.1%"
    ],
    challenges: [
      "Legacy code optimization",
      "Memory leak identification",
      "Performance testing across devices"
    ],
    learnings: [
      "Android performance best practices",
      "Memory management techniques",
      "Profiling and debugging tools"
    ]
  },
  {
    id: 5,
    title: "WordPress Custom Solutions",
    category: "Web Development",
    description: "Collection of custom WordPress themes and plugins for various clients with payment gateway integrations.",
    image: "/images/wordpress-solutions.jpg",
    technologies: ["WordPress", "PHP", "MySQL", "jQuery", "Payment Gateways", "CSS3", "HTML5"],
    features: [
      "50+ custom WordPress sites",
      "Payment gateway integrations",
      "Custom theme development",
      "Plugin development",
      "SEO optimization",
      "Responsive design",
      "Performance optimization",
      "Security hardening"
    ],
    links: {
      live: null,
      github: "https://github.com/balaji00710/wordpress-custom-themes"
    },
    status: "Completed",
    year: "2012-2017",
    highlights: [
      "Delivered 50+ successful projects",
      "Client satisfaction rate: 98%",
      "Average site speed: <2 seconds"
    ],
    challenges: [
      "Client requirement variations",
      "Cross-browser compatibility",
      "Performance optimization"
    ],
    learnings: [
      "WordPress development patterns",
      "Client communication skills",
      "Project management"
    ]
  },
  {
    id: 6,
    title: "Interactive Portfolio Website",
    category: "Frontend Development",
    description: "This very portfolio website built with React.js and Tailwind CSS, featuring smooth animations and responsive design.",
    image: "/images/portfolio-website.jpg",
    technologies: ["React.js", "TypeScript", "Tailwind CSS", "Framer Motion", "GitHub Pages"],
    features: [
      "Responsive design",
      "Smooth animations",
      "Dark/Light mode toggle",
      "Interactive components",
      "GitHub Pages deployment",
      "SEO optimization",
      "Performance optimization",
      "Accessibility compliance"
    ],
    links: {
      live: "https://balaji00710.github.io/portfolio",
      github: "https://github.com/balaji00710/portfolio"
    },
    status: "In Development",
    year: "2024",
    highlights: [
      "100% responsive design",
      "95+ Lighthouse score",
      "Modern UI/UX design"
    ],
    challenges: [
      "Animation performance optimization",
      "Cross-browser compatibility",
      "Accessibility standards"
    ],
    learnings: [
      "Advanced React patterns",
      "Modern CSS techniques",
      "Performance optimization"
    ]
  },
  {
    id: 7,
    title: "REST API Gateway",
    category: "API Development",
    description: "Centralized API gateway for microservices with authentication, rate limiting, and monitoring capabilities.",
    image: "/images/api-gateway.jpg",
    technologies: ["Node.js", "Express.js", "JWT", "Redis", "MongoDB", "Docker", "Nginx"],
    features: [
      "API authentication and authorization",
      "Rate limiting and throttling",
      "Request/response logging",
      "API versioning support",
      "Health check endpoints",
      "Documentation generation",
      "Monitoring and analytics",
      "Load balancing"
    ],
    links: {
      live: null,
      github: "https://github.com/balaji00710/api-gateway"
    },
    status: "Completed",
    year: "2021",
    highlights: [
      "Handles 10k+ requests/minute",
      "99.9% uptime",
      "Sub-100ms response time"
    ],
    challenges: [
      "Microservices coordination",
      "Security implementation",
      "Performance optimization"
    ],
    learnings: [
      "API gateway patterns",
      "Microservices architecture",
      "System monitoring"
    ]
  },
  {
    id: 8,
    title: "Real-time Chat Application",
    category: "Full Stack Web Application",
    description: "Real-time chat application with file sharing, group chats, and emoji support using WebSockets.",
    image: "/images/chat-app.jpg",
    technologies: ["React.js", "Node.js", "Socket.io", "MongoDB", "Redis", "AWS S3"],
    features: [
      "Real-time messaging",
      "File and image sharing",
      "Group chat functionality",
      "Emoji and sticker support",
      "Message encryption",
      "Online status indicators",
      "Message history",
      "Push notifications"
    ],
    links: {
      live: "https://chat.example.com",
      github: "https://github.com/balaji00710/realtime-chat"
    },
    status: "Completed",
    year: "2020",
    highlights: [
      "1000+ concurrent users",
      "Message delivery <100ms",
      "End-to-end encryption"
    ],
    challenges: [
      "Real-time synchronization",
      "Message ordering",
      "Scalability optimization"
    ],
    learnings: [
      "WebSocket optimization",
      "Real-time system design",
      "Security best practices"
    ]
  }
];

// Project Statistics
export const PROJECT_STATS = {
  totalProjects: PROJECTS.length,
  completedProjects: PROJECTS.filter(p => p.status === 'Completed' || p.status === 'Production').length,
  inDevelopment: PROJECTS.filter(p => p.status === 'In Development').length,
  technologies: Array.from(new Set(PROJECTS.flatMap(p => p.technologies))).length,
  categories: Array.from(new Set(PROJECTS.map(p => p.category))).length
} as const;

// Featured Project IDs (for highlighting)
export const FEATURED_PROJECT_IDS = [1, 2, 3, 6] as const;
