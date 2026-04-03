'use client';

import Section from '@/components/Section';
import portfolioData from '@/data/portfolio.json';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function Writing() {
  const featuredWrites = portfolioData.writing.filter((w) => w.featured);

  return (
    <Section id="writing" title="Blog & Writing">
      <div className="space-y-12">
        {featuredWrites.map((article, index) => (
          <a
            key={article.id}
            href={`${BASE}${article.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-0 animate-fade-in block group"
            style={{
              animationDelay: `${0.2 + index * 0.15}s`,
              animationFillMode: 'forwards',
            }}
          >
            <div className="flex gap-6 items-start transition-colors">
              <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-navy-700 to-navy-900 rounded overflow-hidden">
                {article.image ? (
                  <img
                    src={`${BASE}${article.image}`}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    img
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-skyblue-700 font-semibold group-hover:text-skyblue-500 transition-colors">
                    {article.title}
                  </h3>
                  <span className="text-skyblue-700 group-hover:text-skyblue-500 transition-colors text-sm">↗</span>
                </div>
                <p className="text-slate-400 text-sm mb-2">
                  {article.description}
                </p>
                <p className="text-slate-500 text-xs font-mono">
                  {article.date}
                </p>
              </div>
            </div>
          </a>
        ))}

        {/* View All Writing Link */}
        <div className="text-center pt-8 border-t border-navy-700 mt-12">
          <a
            href="#"
            className="inline-block px-8 py-3 border border-skyblue-700 text-skyblue-700 rounded hover:border-skyblue-500 hover:text-skyblue-500 hover:bg-skyblue-500/10 transition-colors font-mono text-sm"
          >
            View All Writing
          </a>
        </div>
      </div>
    </Section>
  );
}
