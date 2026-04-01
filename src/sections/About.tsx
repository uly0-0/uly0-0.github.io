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
      </div>
    </Section>
  );
}
