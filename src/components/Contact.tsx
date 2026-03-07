import { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { socialLinks } from '../constants';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo('.contact-heading', 
        { clipPath: 'inset(100% 0 0 0)' },
        { 
          clipPath: 'inset(0% 0 0 0)', 
          duration: 1, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-heading',
            start: 'top 80%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={containerRef} id="contact" className="relative py-32 px-6 bg-surface overflow-hidden print:hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-accent/5 rounded-[100%] blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="contact-heading font-display text-6xl md:text-8xl font-black text-ink leading-none tracking-tighter mb-8">
              Let's <br />
              <span className="text-accent italic">Talk.</span>
            </h2>
            <p className="font-mono text-muted text-lg max-w-md">
              Available for interesting enterprise projects and full-stack collaborations. Let's build something extraordinary together.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-6 p-4 rounded-3xl border border-border-subtle bg-card hover:border-accent transition-colors w-full md:w-max cursor-none"
                whileHover="hover"
                initial="initial"
              >
                <div className="w-16 h-16 rounded-2xl bg-surface border border-border-subtle flex items-center justify-center group-hover:scale-110 transition-transform">
                  <social.Icon 
                    className="w-8 h-8 pointer-events-none"
                    style={{ color: social.color }}
                  />
                </div>
                <div className="overflow-hidden">
                  <motion.span 
                    variants={{
                      initial: { x: -20, opacity: 0 },
                      hover: { x: 0, opacity: 1 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="font-mono text-xl font-bold text-ink group-hover:text-accent transition-colors block"
                  >
                    {social.label}
                  </motion.span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Print-only simple contact block */}
      <section className="hidden print:block py-10 px-6 mt-10 border-t border-gray-300 break-inside-avoid">
        <h2 className="text-3xl font-bold mb-6 text-black">Contact Information</h2>
        <ul className="flex flex-col gap-4 text-black text-lg font-mono">
          {socialLinks.map((social, index) => (
            <li key={index} className="flex gap-2 items-center">
              <strong className="min-w-[100px]">{social.label}:</strong>
              <span className="text-blue-700 break-all">{social.href.replace('mailto:', '')}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Contact;