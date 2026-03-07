import { personalInfo, experiences, projects, socialLinks } from '../constants';

const PrintableCV = () => {
  return (
    <div className="bg-white text-black p-8 font-sans max-w-[800px] mx-auto hidden print:block">
      {/* Header */}
      <header className="border-b-2 border-black pb-4 mb-6">
        <h1 className="text-4xl font-bold mb-2">{personalInfo.name.first} {personalInfo.name.last}</h1>
        <p className="text-lg text-gray-700 mb-2">{personalInfo.roles.join(' • ')}</p>
        <div className="flex gap-4 text-sm text-gray-600">
          {socialLinks.map((link) => (
            <span key={link.label}>
              {link.label}: {link.href.replace('mailto:', '').replace('https://', '')}
            </span>
          ))}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Professional Summary</h2>
        <div className="text-sm leading-relaxed space-y-2">
          {personalInfo.about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Experience</h2>
        <div className="space-y-4">
          {experiences.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-base">{exp.title}</h3>
                <span className="text-sm text-gray-600 font-mono">{exp.date}</span>
              </div>
              <div className="text-sm font-medium text-gray-700 mb-2">{exp.company_name}</div>
              <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                {exp.points.map((point, pIdx) => (
                  <li key={pIdx} className="text-gray-800">{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-6">
        <h2 className="text-xl font-bold uppercase tracking-widest border-b border-gray-300 pb-1 mb-3">Selected Projects</h2>
        <div className="space-y-4">
          {projects.map((project, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-base mb-1">{project.name}</h3>
              <p className="text-sm text-gray-800 mb-1">{project.description}</p>
              <div className="text-xs text-gray-600">
                <span className="font-bold">Technologies:</span> {project.tech.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PrintableCV;