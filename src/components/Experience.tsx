import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experiences } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo('.exp-heading', 
        { clipPath: 'inset(100% 0 0 0)' },
        { 
          clipPath: 'inset(0% 0 0 0)', 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.exp-heading',
            start: 'top 80%',
          }
        }
      );

      // Line draw
      if (lineRef.current) {
        gsap.fromTo(lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: '.timeline-container',
              start: "top 60%",
              end: "bottom 80%",
              scrub: 1,
            }
          }
        );
      }

      // Alternating items
      const items = gsap.utils.toArray('.timeline-item') as HTMLElement[];
      items.forEach((item, i) => {
        const isLeft = i % 2 === 0;
        gsap.fromTo(item,
          { x: isLeft ? -50 : 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="experience" className="py-32 px-6 bg-bg overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="exp-heading font-display text-5xl md:text-7xl font-black mb-24 text-ink uppercase tracking-tighter text-center">
          Career <span className="text-accent italic">Path.</span>
        </h2>

        <div className="timeline-container relative max-w-4xl mx-auto">
          {/* Center Line for Desktop, Left for Mobile */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border-subtle -translate-x-1/2" />
          <div 
            ref={lineRef}
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-accent -translate-x-1/2 z-10" 
          />

          {experiences.map((exp, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div 
                key={index}
                className={`timeline-item relative flex flex-col md:flex-row gap-8 md:gap-0 w-full mb-16 last:mb-0 ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-1/2 top-0 w-4 h-4 bg-bg border-2 border-accent rounded-full -translate-x-1/2 z-20" />

                {/* Content Card */}
                <div className={`w-full md:w-[45%] pl-16 md:pl-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-surface border border-border-subtle p-8 rounded-3xl hover:border-accent/50 transition-colors">
                    <span className="font-mono text-xs text-accent uppercase tracking-widest mb-4 block">
                      {exp.date}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-ink mb-1">
                      {exp.title}
                    </h3>
                    <h4 className="font-mono text-muted mb-6">
                      {exp.company_name}
                    </h4>
                    
                    <ul className="space-y-3">
                      {exp.points.map((point, pIdx) => (
                        <li key={pIdx} className="flex gap-3 text-sm text-muted">
                          <span className="text-accent mt-1">▹</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;