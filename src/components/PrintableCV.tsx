import { Phone } from 'lucide-react';
import { personalInfo, experiences, skillGroups, socialLinks } from '../constants';

const PrintableCV = () => {
  return (
    <div className="bg-white text-black py-4 px-8 font-sans max-w-[900px] mx-auto hidden print:block text-[10px] leading-snug">
      {/* Header */}
      <header className="border-b-2 border-black pb-2 mb-3">
        <h1 className="text-2xl font-black mb-0.5 uppercase tracking-tight">{personalInfo.name.first} {personalInfo.name.last}</h1>
        <p className="text-xs text-gray-700 font-bold mb-2">Full Stack Engineer</p>
        
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-800">
          <div className="flex items-center gap-1.5">
            <Phone size={10} className="text-black" />
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
                <Icon size={10} className="text-black" />
                <span>{displayValue}</span>
              </div>
            );
          })}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-0.5 mb-1.5 text-black">Professional Summary</h2>
        <div className="space-y-1 text-gray-800">
          {personalInfo.about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-3">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-0.5 mb-2 text-black">Skills</h2>
        <div className="flex flex-col gap-1.5">
          {skillGroups.map((group, idx) => (
            <div key={idx} className="flex items-start gap-2 break-inside-avoid">
              <span className="font-bold text-gray-900 min-w-[100px]">{group.label}:</span>
              <div className="flex flex-wrap gap-1">
                {group.icons.map((skill, sIdx) => (
                  <span key={sIdx} className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-[9px] text-gray-800 font-medium">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience - 2 Column Layout */}
      <section className="mb-2">
        <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-300 pb-0.5 mb-2 text-black">Experience</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {experiences.map((exp, idx) => (
            <div key={idx} className="break-inside-avoid">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-[11px] text-black">{exp.title}</h3>
                <span className="text-[9px] text-gray-600 font-mono font-bold">{exp.date}</span>
              </div>
              <div className="text-[10px] font-semibold text-gray-700 mb-1">{exp.company_name}</div>
              <ul className="list-disc list-outside ml-3 space-y-0.5 text-gray-800">
                {exp.points.map((point, pIdx) => (
                  <li key={pIdx} className="pl-0.5 leading-tight">{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default PrintableCV;