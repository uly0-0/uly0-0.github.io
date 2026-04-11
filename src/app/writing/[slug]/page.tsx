import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
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

export default async function WritingArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = writingEntries.find((entry) => entry.slug === slug);

  if (!article) {
    notFound();
  }

  let markdownContent: string | null = null;
  if (article.mdFile) {
    const filePath = path.join(process.cwd(), 'public', 'writing', article.mdFile);
    markdownContent = fs.readFileSync(filePath, 'utf-8');
  }

  const sourceHref = article.url ? getWritingSourceHref(article) : null;
  const sourceLabel = article.url ? getWritingSourceLabel(article) : null;

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

        {markdownContent ? (
          <div className="rounded-2xl border border-navy-700 bg-navy-800/40 p-6 sm:p-10">
            <ReactMarkdown
              components={{
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-slate-200 mb-6 mt-8 first:mt-0">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold text-slate-200 mb-4 mt-8">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold text-slate-300 mb-3 mt-6">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-slate-400 leading-7 mb-4">{children}</p>
                ),
                strong: ({ children }) => (
                  <strong className="text-slate-300 font-semibold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="text-slate-400 italic">{children}</em>
                ),
                code: ({ children, className }) => {
                  const isBlock = className?.startsWith('language-');
                  if (isBlock) {
                    return (
                      <code className="block bg-navy-900 text-skyblue-400 font-mono text-sm p-4 rounded-lg overflow-x-auto whitespace-pre">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="bg-navy-900 text-skyblue-400 font-mono text-sm px-1.5 py-0.5 rounded">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="mb-4 rounded-lg overflow-x-auto">{children}</pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-skyblue-700 pl-4 my-4 text-slate-400 italic">
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside text-slate-400 mb-4 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside text-slate-400 mb-4 space-y-1">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-slate-400 leading-7">{children}</li>
                ),
                hr: () => (
                  <hr className="border-navy-700 my-8" />
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm text-slate-400 border-collapse">{children}</table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="text-slate-300 border-b border-navy-700">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="text-left py-2 pr-6 font-semibold text-slate-300">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="py-2 pr-6 border-b border-navy-700/50">{children}</td>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-skyblue-400 hover:text-skyblue-500 transition-colors underline underline-offset-2"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <section className="rounded-2xl border border-navy-700 bg-navy-800/40 p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-slate-200 mb-4">Article Notes</h2>
              <p className="text-slate-400 leading-7">
                This route is the canonical home for the article. You can expand it later with full written content,
                additional sections, code samples, or embedded visuals without changing the URL structure.
              </p>
            </section>

            {sourceHref && (
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
            )}
          </div>
        )}

        {article.madeAt ? (
          <p className="text-slate-500 text-sm font-mono mt-8">Made at {article.madeAt}</p>
        ) : null}
      </article>
    </div>
  );
}
