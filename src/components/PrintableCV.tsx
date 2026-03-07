import { Phone } from 'lucide-react';
import { personalInfo, experiences, skillGroups, socialLinks } from '../constants';

const PrintableCV = () => {
  return (
    <div className="bg-[#f8f9fa] text-black py-6 px-10 font-sans max-w-[900px] mx-auto hidden print:block text-[10px] leading-snug">
      {/* Header */}
      <header className="border-b-2 border-black pb-3 mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black mb-1 uppercase tracking-tight text-[#111827]">{personalInfo.name.first} {personalInfo.name.last}</h1>
          <p className="text-[13px] text-[#2563eb] font-bold mb-0">Full Stack Engineer</p>
        </div>
        
        <div className="flex flex-col items-end gap-1 text-[9px] text-gray-700 font-medium">
          <div className="flex items-center gap-1.5 bg-gray-200 px-2 py-0.5 rounded-md">
            <Phone size={10} className="text-[#2563eb]" />
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
              <div key={link.label} className="flex items-center gap-1.5 bg-gray-200 px-2 py-0.5 rounded-md">
                <Icon size={10} className="text-[#2563eb]" />
                <span>{displayValue}</span>
              </div>
            );
          })}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-2 text-[#111827] flex items-center gap-2">
          <div className="w-2 h-2 bg-[#2563eb] rounded-sm"></div>
          Professional Summary
        </h2>
        <div className="space-y-1.5 text-gray-700 font-medium">
          {personalInfo.about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-3 text-[#111827] flex items-center gap-2">
          <div className="w-2 h-2 bg-[#2563eb] rounded-sm"></div>
          Skills
        </h2>
        <div className="flex flex-col gap-2">
          {skillGroups.map((group, idx) => (
            <div key={idx} className="flex items-start gap-3 break-inside-avoid">
              <span className="font-bold text-gray-800 min-w-[100px] text-right pt-0.5">{group.label}:</span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {group.icons.map((skill, sIdx) => (
                  <span key={sIdx} className="px-2 py-0.5 bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe] rounded text-[9px] font-semibold">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience - 2 Column Layout */}
      <section className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-200 pb-1 mb-3 text-[#111827] flex items-center gap-2">
          <div className="w-2 h-2 bg-[#2563eb] rounded-sm"></div>
          Experience
        </h2>
        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          {experiences.map((exp, idx) => (
            <div key={idx} className="break-inside-avoid relative pl-3 border-l-2 border-[#bfdbfe]">
              <div className="absolute w-2 h-2 bg-[#2563eb] rounded-full -left-[5px] top-1"></div>
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-[11px] text-[#111827]">{exp.title}</h3>
                <span className="text-[9px] text-[#2563eb] font-mono font-bold bg-[#eff6ff] px-1.5 py-0.5 rounded">{exp.date}</span>
              </div>
              <div className="text-[10px] font-bold text-gray-600 mb-1.5">{exp.company_name}</div>
              <ul className="list-disc list-outside ml-3 space-y-0.5 text-gray-700 font-medium text-[9.5px]">
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