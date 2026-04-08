import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getPublicAssetHref,
  getWritingSourceHref,
  getWritingSourceLabel,
  isExternalUrl,
  writingEntries,
} from '@/lib/writing';

export const dynamicParams = false;

export function generateStaticParams() {
  return writingEntries
    .filter((article) => article.slug)
    .map((article) => ({
      slug: article.slug as string,
    }));
}

export default function WritingArticlePage({ params }: { params: { slug: string } }) {
  const article = writingEntries.find((entry) => entry.slug === params.slug);

  if (!article || !article.slug) {
    notFound();
  }

  const sourceHref = getWritingSourceHref(article);
  const sourceLabel = getWritingSourceLabel(article);

  return (
    <div className="min-h-screen bg-navy-900 px-6 sm:px-12 lg:px-24 py-16">
      <div className="mb-10">
        <Link
          href="/writing"
          className="text-skyblue-400 hover:text-skyblue-500 transition-colors text-sm font-mono flex items-center gap-1 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
          All Articles
        </Link>
      </div>

      <article className="max-w-4xl">
        <p className="text-slate-500 text-sm font-mono mb-4">{article.date}</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-200 mb-6 leading-tight">
          {article.title}
        </h1>
        <p className="text-slate-300 text-lg leading-8 mb-8 max-w-3xl">
          {article.description}
        </p>

        {article.image ? (
          <div className="mb-10 overflow-hidden rounded-2xl border border-navy-700 bg-navy-800/40">
            <img
              src={getPublicAssetHref(article.image)}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 mb-10">
          {(article.tags || []).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-xs rounded-full border border-skyblue-700 text-skyblue-400 font-mono whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <section className="rounded-2xl border border-navy-700 bg-navy-800/40 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Article Notes</h2>
            <p className="text-slate-400 leading-7">
              This route is the canonical home for the article. You can expand it later with full written content,
              additional sections, code samples, or embedded visuals without changing the URL structure.
            </p>
          </section>

          <section className="rounded-2xl border border-navy-700 bg-navy-800/40 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">Source</h2>
            <p className="text-slate-400 text-sm leading-6 mb-4">
              The original version remains available as a {isExternalUrl(article.url) ? 'published article' : 'PDF'}.
            </p>
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-skyblue-400 hover:text-skyblue-500 transition-colors font-mono text-sm"
            >
              {sourceLabel}
              <span className="text-xs">↗</span>
            </a>
          </section>
        </div>

        {article.madeAt ? (
          <p className="text-slate-500 text-sm font-mono mt-8">Made at {article.madeAt}</p>
        ) : null}
      </article>
    </div>
  );
}