import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skillGroups } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo('.skills-heading', 
        { clipPath: 'inset(100% 0 0 0)' },
        { 
          clipPath: 'inset(0% 0 0 0)', 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.skills-heading',
            start: 'top 80%',
          }
        }
      );

      // Stagger icons
      gsap.fromTo('.skill-icon-container',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 75%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="skills" className="py-32 px-6 bg-bg">
      <div className="max-w-7xl mx-auto">
        <h2 className="skills-heading font-display text-5xl md:text-7xl font-black mb-20 text-ink uppercase tracking-tighter">
          Technical <span className="text-accent italic">Arsenal</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {skillGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-6">
              <h3 className="font-mono text-xl text-muted uppercase tracking-widest border-b border-border-subtle pb-4">
                {group.label}
              </h3>
              <div className="flex flex-wrap gap-4">
                {group.icons.map((item, iconIdx) => (
                  <div 
                    key={iconIdx} 
                    className="skill-icon-container flex flex-col items-center gap-2 bg-card border border-border-subtle p-4 rounded-2xl hover:border-accent hover:bg-accent/10 hover:-translate-y-1 hover:scale-105 transition-all duration-300 backdrop-blur-md cursor-none"
                    title={item.name}
                  >
                    <item.Icon 
                      className="w-8 h-8 md:w-10 md:h-10 pointer-events-none"
                      style={{ color: item.color }} 
                    />
                    <span className="font-mono text-[10px] uppercase text-muted tracking-wider">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;