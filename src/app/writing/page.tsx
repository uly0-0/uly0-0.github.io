'use client';

import Link from 'next/link';
import {
  getWritingHref,
  getWritingLinkLabel,
  writingEntries,
} from '@/lib/writing';

export default function AllWriting() {
  const articles = writingEntries;

  return (
    <div className="min-h-screen bg-navy-900 px-6 sm:px-12 lg:px-24 py-16">
      {/* Back link */}
      <div className="mb-10">
        <Link
          href="/"
          className="text-skyblue-400 hover:text-skyblue-500 transition-colors text-sm font-mono flex items-center gap-1 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          Ulysses Ochoa
        </Link>
      </div>

      <h1 className="text-4xl font-bold text-slate-200 mb-16">All Articles</h1>

      {/* Table */}
      <div className="w-full">
        {/* Header row */}
        <div className="grid grid-cols-[80px_1fr_140px_1fr_120px] gap-4 mb-4 pb-3 border-b border-navy-700">
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Year</span>
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Article</span>
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest hidden sm:block">Published At</span>
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest hidden md:block">Topics</span>
          <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Link</span>
        </div>

        {/* Rows */}
        {articles.map((article, index) => {
          const href = getWritingHref(article);
          const isLocalArticle = Boolean(article.slug);

          const row = (
            <>
              {/* Year */}
              <span className="text-slate-500 text-sm font-mono self-center">{article.date}</span>

              {/* Title */}
              <span className="text-slate-200 font-semibold text-sm group-hover:text-skyblue-400 transition-colors self-center">
                {article.title}
              </span>

              {/* Made at */}
              <span className="text-slate-400 text-sm hidden sm:block self-center">{article.madeAt || '—'}</span>

              {/* Tags */}
              <div className="hidden md:flex flex-wrap gap-2 self-center">
                {(article.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs rounded-full border border-skyblue-700 text-skyblue-400 font-mono whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Link */}
              <span className="text-skyblue-400 text-sm font-mono self-center flex items-center gap-1 group-hover:text-skyblue-500 transition-colors">
                {getWritingLinkLabel(article)}
                <span className="text-xs">↗</span>
              </span>
            </>
          );

          if (isLocalArticle) {
            return (
              <Link
                key={article.id}
                href={href}
                className="grid grid-cols-[80px_1fr_140px_1fr_120px] gap-4 py-4 border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors duration-200 group rounded px-2 -mx-2 opacity-0 animate-fade-in"
                style={{
                  animationDelay: `${0.1 + index * 0.08}s`,
                  animationFillMode: 'forwards',
                }}
              >
                {row}
              </Link>
            );
          }

          return (
            <a
              key={article.id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="grid grid-cols-[80px_1fr_140px_1fr_120px] gap-4 py-4 border-b border-navy-700/50 hover:bg-navy-700/30 transition-colors duration-200 group rounded px-2 -mx-2 opacity-0 animate-fade-in"
              style={{
                animationDelay: `${0.1 + index * 0.08}s`,
                animationFillMode: 'forwards',
              }}
            >
              {row}
            </a>
          );
        })}
      </div>
    </div>
  );
}
