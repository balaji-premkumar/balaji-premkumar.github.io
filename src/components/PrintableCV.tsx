import { Phone } from 'lucide-react';
import { personalInfo, experiences, projects, socialLinks } from '../constants';

const PrintableCV = () => {
  return (
    <div className="bg-white text-black p-8 font-sans max-w-[900px] mx-auto hidden print:block text-[11px] leading-relaxed">
      {/* Header */}
      <header className="border-b-2 border-black pb-4 mb-4">
        <h1 className="text-3xl font-black mb-1 uppercase tracking-tight">{personalInfo.name.first} {personalInfo.name.last}</h1>
        <p className="text-sm text-gray-700 font-bold mb-3">{personalInfo.roles.join(' • ')}</p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-800">
          <div className="flex items-center gap-1.5">
            <Phone size={12} className="text-black" />
            <span>{personalInfo.contact.phone}</span>
          </div>
          {socialLinks.map((link) => {
            const Icon = link.Icon;
            let displayValue = link.href;
            
            if (link.href.startsWith('mailto:')) {
              displayValue = link.href.replace('mailto:', '');
            } else if (link.href.includes('github.com')) {
              displayValue = link.href.split('/').filter(Boolean).pop() || '';
            } else if (link.href.includes('linkedin.com')) {
              displayValue = link.href.split('/').filter(Boolean).pop() || '';
            }

            return (
              <div key={link.label} className="flex items-center gap-1.5">
                <Icon size={12} className="text-black" />
                <span>{displayValue}</span>
              </div>
            );
          })}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-5">
        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-2 text-black">Professional Summary</h2>
        <div className="space-y-1.5 text-gray-800">
          {personalInfo.about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Experience - 2 Column Layout */}
      <section className="mb-5">
        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-black">Experience</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {experiences.map((exp, idx) => (
            <div key={idx} className="break-inside-avoid">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-sm text-black">{exp.title}</h3>
                <span className="text-[10px] text-gray-600 font-mono font-bold">{exp.date}</span>
              </div>
              <div className="text-xs font-semibold text-gray-700 mb-1.5">{exp.company_name}</div>
              <ul className="list-disc list-outside ml-3 space-y-1 text-gray-800">
                {exp.points.map((point, pIdx) => (
                  <li key={pIdx} className="pl-1">{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3 text-black">Selected Projects</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          {projects.map((project, idx) => (
            <div key={idx} className="break-inside-avoid">
              <h3 className="font-bold text-[13px] mb-1 text-black">{project.name}</h3>
              <p className="text-gray-800 mb-1.5">{project.description}</p>
              <div className="text-[10px] text-gray-600">
                <span className="font-bold text-gray-900">Technologies:</span> {project.tech.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PrintableCV;