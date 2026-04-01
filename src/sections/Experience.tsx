'use client';

import Section from '@/components/Section';
import portfolioData from '@/data/portfolio.json';

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div className="space-y-12">
        {portfolioData.experience.map((job, index) => (
          <div
            key={job.id}
            className="opacity-0 animate-fade-in"
            style={{
              animationDelay: `${0.2 + index * 0.15}s`,
              animationFillMode: 'forwards',
            }}
          >
            <div className="group border-l-2 border-teal-400/30 pl-6 hover:border-teal-400 transition-colors duration-300 py-4">
              <a
                href={job.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <h3 className="text-slate-200 font-semibold group-hover:text-teal-400 transition-colors">
                  {job.position}
                  <span className="text-teal-400 ml-2">@</span>
                  <span className="text-teal-400 group-hover:underline">{job.company}</span>
                </h3>
              </a>
              <p className="text-slate-400 text-sm font-mono mt-1">
                {job.date}
              </p>
              <p className="text-slate-400 mt-3 leading-relaxed">
                {job.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {job.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono text-teal-400 bg-teal-400/10 px-3 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
