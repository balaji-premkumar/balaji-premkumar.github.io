import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ExternalLink } from 'lucide-react';
import { projects } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo('.projects-heading', 
        { clipPath: 'inset(100% 0 0 0)' },
        { 
          clipPath: 'inset(0% 0 0 0)', 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.projects-heading',
            start: 'top 80%',
          }
        }
      );

      // Stagger cards
      gsap.fromTo('.project-card',
        { y: 60, rotateX: 8, opacity: 0 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.project-grid',
            start: 'top 75%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="projects" className="py-32 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <h2 className="projects-heading font-display text-5xl md:text-7xl font-black text-ink uppercase tracking-tighter">
            Selected <span className="text-accent italic">Work.</span>
          </h2>
          <a 
            href="https://github.com/balaji-premkumar"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-accent uppercase tracking-widest border-b border-transparent hover:border-accent transition-colors pb-1 flex items-center gap-2 cursor-none"
          >
            View Full GitHub
            <ExternalLink size={16} />
          </a>
        </div>

        <div className="project-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ perspective: "1000px" }}>
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="project-card group flex flex-col bg-card border border-border-subtle rounded-3xl p-8 hover:border-accent hover:shadow-[0_0_30px_rgba(200,240,96,0.15)] transition-all duration-500 backdrop-blur-sm transform-gpu"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-surface rounded-xl border border-border-subtle">
                  <span className="font-mono text-xs text-accent uppercase tracking-widest">
                    Featured
                  </span>
                </div>
                <div className="flex gap-4">
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-muted hover:text-accent transition-colors cursor-none"
                    aria-label="View Source"
                  >
                    <Github size={24} />
                  </a>
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-muted hover:text-accent transition-colors cursor-none"
                    aria-label="Live Demo"
                  >
                    <ExternalLink size={24} />
                  </a>
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold text-ink mb-4 group-hover:text-accent transition-colors">
                {project.name}
              </h3>
              
              <p className="font-mono text-sm text-muted leading-relaxed mb-8 flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-6 border-t border-border-subtle">
                {project.tech.map((techItem, techIdx) => (
                  <span 
                    key={techIdx}
                    className="px-3 py-1 rounded-full bg-surface border border-border-subtle font-mono text-xs text-ink uppercase tracking-wider"
                  >
                    {techItem}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;