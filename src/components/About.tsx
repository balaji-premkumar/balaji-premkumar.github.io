import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalInfo } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading clip-path reveal
      gsap.fromTo('.about-heading', 
        { clipPath: 'inset(100% 0 0 0)' },
        { 
          clipPath: 'inset(0% 0 0 0)', 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-heading',
            start: 'top 80%',
          }
        }
      );

      // Counters animation
      const counterElements = gsap.utils.toArray('.stat-counter') as HTMLElement[];
      counterElements.forEach((el, index) => {
        const targetValue = personalInfo.stats[index].value;
        gsap.fromTo(el,
          { textContent: 0 },
          {
            textContent: targetValue,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="about" className="py-32 px-6 bg-surface">
      <div className="max-w-7xl mx-auto">
        <h2 className="about-heading font-display text-5xl md:text-7xl font-black mb-16 text-ink uppercase tracking-tighter">
          About <span className="text-accent">Me.</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 mb-20 items-center">
          <div className="font-serif italic text-4xl md:text-5xl text-muted leading-tight">
            "{personalInfo.about.quote}"
          </div>
          <div className="font-mono text-lg text-ink leading-relaxed space-y-6">
            {personalInfo.about.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border-subtle">
          {personalInfo.stats.map((stat) => (
            <div key={stat.id} className="flex flex-col gap-2">
              <div className="font-display text-6xl md:text-7xl font-black text-ink">
                <span className="stat-counter">0</span>+
              </div>
              <div className="font-mono text-sm text-accent uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;