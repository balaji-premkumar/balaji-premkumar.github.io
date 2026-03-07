import { TbBrandCSharp } from 'react-icons/tb';
import { 
  SiTypescript, 
  SiJavascript, 
  SiPython, 
  SiReact, 
  SiTailwindcss, 
  SiHtml5, 
  SiDotnet, 
  SiNodedotjs, 
  SiPostgresql, 
  SiMongodb, 
  SiDocker, 
  SiGit, 
  SiGithub, 
  SiGmail, 
  SiBootstrap,
  SiPfsense,
  SiAngular,
  SiVmware,
  SiPhp,
  SiRedis,
  SiRabbitmq,
  SiJquery,
  SiNextdotjs,
  SiAndroid,
  SiFlutter,
  SiLodash,
  SiMysql,
  SiLaravel,
  SiCodeigniter,
  SiNginx,
  SiSelenium,
  SiElastic,
  SiGooglegemini
} from 'react-icons/si';
import { FaDatabase, FaCss3Alt, FaLinkedin, FaAws, FaJava, FaTerminal, FaWindows, FaSignal } from 'react-icons/fa';
import { MdFactory } from 'react-icons/md';
import { DiMsqlServer } from 'react-icons/di';
import { VscAzure } from 'react-icons/vsc';


export const personalInfo = {
  name: {
    first: "Balaji",
    last: "Premkumar"
  },
  contact: {
    phone: "+91 8122708776", // Update this with your actual number
  },
  roles: [
    "Senior Software Engineer",
    "Full Stack Engineer",
    ".NET Core Expert",
    "React Enthusiast",
    "Enterprise Solution Architect"
  ],
  about: {
    quote: "Bridging the gap between complex enterprise logic and seamless user experiences.",
    paragraphs: [
      "I am a Senior Software Engineer specializing in architecting robust enterprise solutions. With deep expertise in .NET Core and React, I focus on building high-performance backend systems that power exceptional frontend interfaces.",
      "My journey involves transforming challenging business requirements into scalable, secure, and maintainable architectures. I thrive in environments that demand both technical rigor and creative problem-solving."
    ]
  },
  stats: [
    { id: 1, value: 12, label: 'Years Experience' },
    { id: 2, value: 25, label: 'Projects Delivered' },
    { id: 3, value: 20, label: 'Technologies' },
  ]
};

export const navLinks = [
  { id: "about", title: "About" },
  { id: "skills", title: "Skills" },
  { id: "projects", title: "Projects" },
  { id: "experience", title: "Experience" },
  { id: "contact", title: "Contact" },
];

export const skillGroups = [
  {
    label: 'Languages',
    icons: [
      { name: 'C#', Icon: TbBrandCSharp, color: '#239120' },
      { name: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
      { name: 'JavaScript', Icon: SiJavascript, color: '#F7DF1E' },
      { name: 'Python', Icon: SiPython, color: '#3776AB' },
      { name: 'SQL', Icon: FaDatabase, color: '#F29111' },
      { name: 'Core Java', Icon: FaJava, color: '#007396' },
      { name: 'Shell/Bash', Icon: FaTerminal, color: '#4EAA25' },
    ],
  },
  {
    label: 'Frontend',
    icons: [
      { name: 'React.JS', Icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', Icon: SiNextdotjs, color: '#ffffff'},
      { name: 'Angular JS', Icon: SiAngular, color: '#DD0031'},
      { name: 'WPF', Icon: FaWindows, color: '#0078D7' },
      { name: 'Android', Icon: SiAndroid, color: '#3DDC84' },
      { name: 'Flutter', Icon: SiFlutter, color: '#02569B' },
      { name: 'JQuery', Icon: SiJquery, color: '#0769AD'},
      { name: 'Lodash', Icon: SiLodash, color: '#3492FF' },
      { name: 'Tailwind', Icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'Bootstrap', Icon: SiBootstrap, color: '#563D7C' },
      { name: 'HTML5', Icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS3', Icon: FaCss3Alt, color: '#1572B6' },
    ],
  },
  {
    label: 'Backend & Database',
    icons: [
      { name: '.Net Core', Icon: SiDotnet, color: '#512BD4' },
      { name: 'Node.JS', Icon: SiNodedotjs, color: '#339933' },
      { name: 'SignalR', Icon: FaSignal, color: '#00A4EF' },
      { name: 'PHP', Icon: SiPhp, color: '#777BB4'},
      { name: 'Laravel', Icon: SiLaravel, color: '#FF2D20' },
      { name: 'Codeigniter', Icon: SiCodeigniter, color: '#EF4223' },
      { name: 'MSSQL', Icon: DiMsqlServer, color: '#CC2927' },
      { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
      { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
      { name: 'Redis', Icon: SiRedis, color: '#DC382D'},
      { name: 'PostgreSQL', Icon: SiPostgresql, color: '#4169E1' },
      { name: 'RabbitMQ', Icon: SiRabbitmq, color: '#FF6600'},
    ],
  },
  {
    label: 'DevOps & Cloud',
    icons: [
      { name: 'AWS', Icon: FaAws, color: '#FF9900' },
      { name: 'Azure', Icon: VscAzure, color: '#0078D4' },
      { name: 'Docker', Icon: SiDocker, color: '#2496ED' },
      { name: 'Git', Icon: SiGit, color: '#F05032' },
      { name: 'GitHub', Icon: SiGithub, color: '#ffffff' },
      { name: 'ELK', Icon: SiElastic, color: '#005571' },
      { name: 'Nginx', Icon: SiNginx, color: '#009639' },
      { name: 'Selenium', Icon: SiSelenium, color: '#43B02A' },
      { name: 'PFSense', Icon: SiPfsense, color: '#1E90FF' },
      { name: 'VMWare', Icon: SiVmware, color: '#607078'}
    ],
  },
  {
    label: 'AI & Automation',
    icons: [
      { name: 'Factory AI (custom droids)', Icon: MdFactory, color: '#f59e0b' },
      { name: 'Gemini CLI', Icon: SiGooglegemini, color: '#1B6BFB' }
    ]
  }
];

export const experiences = [
  {
    title: 'Supervising Associate',
    company_name: 'EY GDS India LLP',
    date: '2023 - Present',
    points: [
      "Working on full-stack applications using .NET 10 and React.",
      "Implementing and maintaining backend services utilizing Message Queues and MSSQL.",
      "Setting up and managing CI/CD pipelines with Azure DevOps and GitHub Actions.",
      "Leveraging AI tools for development automation to increase overall efficiency."
    ],
  },
  {
    title: "Senior Software Engineer",
    company_name: "Canarys Automation",
    date: "2022 - 2023",
    points: [
      "Leading development of enterprise-level .NET Core applications with 20+ modules.",
      "Architecting scalable backend systems using C#, SQL Server, and Azure.",
      "Optimizing system performance and implementing robust security features.",
      "Developing responsive frontends with React.js and modern CSS frameworks.",
    ],
  },
  {
    title: "Full Stack Engineer",
    company_name: "Startvis Technologies",
    date: "2017 - 2022",
    points: [
      "Full-stack development of CANSELL platform.",
      "Designed server architecture and optimized mobile app communication.",
      "Implemented real-time features using SignalR and WebSockets.",
      "Worked with Node.js, React.js, MongoDB, and AWS.",
    ],
  },
  {
    title: "Web Developer",
    company_name: "Megasoft Computers",
    date: "2012 - 2017",
    points: [
      "Developed custom web applications for clients using PHP and MySQL.",
      "Maintained and enhanced existing client websites.",
      "Collaborated with designers to create user-friendly interfaces.",
      "Provided technical support and training to clients.",
    ],
  }
];

export const projects = [
  {
    name: "Enterprise .NET Core System",
    description: "A comprehensive enterprise system featuring 20+ modules including user management, reporting, and high-security protocols.",
    tech: ['dotnet', 'sqlserver', 'azure'],
  },
  {
    name: "CANSELL E-commerce",
    description: "A full-scale e-commerce platform with real-time order tracking, payment gateway integration, and a mobile-optimized frontend.",
    tech: ['react', 'nodejs', 'mongodb'],
    demo: "https://github.com/",
  },
  {
    name: "Real-time Notification Hub",
    description: "A highly scalable notification service providing real-time updates across multiple enterprise applications using SignalR.",
    tech: ['cs', 'react', 'azure'],
    link: "https://github.com/",
  },
];

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/balaji-premkumar", Icon: SiGithub, color: '#ffffff' },
  { label: "LinkedIn", href: "https://linkedin.com/in/balaji--premkumar", Icon: FaLinkedin, color: '#0A66C2' },
  { label: "Email", href: "mailto:balaji00710@gmail.com", Icon: SiGmail, color: '#EA4335' },
];