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
            <div className="group relative border-l-2 border-skyblue-700 pl-6 hover:border-skyblue-500 transition-colors duration-300 py-4 rounded-r-lg hover:bg-skyblue-500/5 hover:shadow-[inset_0_0_0_1px_rgba(100,190,255,0.08)]">
              <a
                href={job.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <h3 className="text-slate-200 font-semibold group-hover:text-skyblue-500 transition-colors">
                  {job.position}
                  <span className="text-skyblue-700 ml-2">@</span>
                  <span className="text-skyblue-400 group-hover:underline">{job.company}</span>
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
                    className="text-xs font-mono text-skyblue-700 bg-skyblue-700/10 px-3 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        {/* View Resume Link */}
        <div className="text-center pt-8 border-t border-navy-700">
          <a
            href="/resume/UlyssesOchoaResume.pdf"
            download
            className="inline-block px-8 py-3 border border-skyblue-700 text-skyblue-700 rounded hover:border-skyblue-500 hover:text-skyblue-500 hover:bg-skyblue-500/10 transition-colors font-mono text-sm"
          >
            View My Resume
          </a>
        </div>
      </div>
    </Section>
  );
}
