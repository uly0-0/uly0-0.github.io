'use client';

import Section from '@/components/Section';
import portfolioData from '@/data/portfolio.json';

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="space-y-6">
        <p className="text-slate-400 leading-relaxed">
          {portfolioData.about.intro}
        </p>
        <p className="text-slate-400 leading-relaxed">
          {portfolioData.about.bio}
        </p>
        <div className="pt-4">
          <h3 className="text-slate-300 font-semibold mb-4 text-sm">
            Here are some of the technologies I've worked with:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {portfolioData.about.highlights.map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 rounded border border-teal-400/30 text-teal-400 text-sm font-mono hover:bg-teal-400/10 transition-colors"
              >
                ▸ {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
