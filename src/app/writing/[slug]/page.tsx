import fs from 'fs';
import path from 'path';
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

function renderInlineMarkdown(text: string) {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const pushText = (value: string) => {
    if (value) {
      parts.push(value);
    }
  };

  while (remaining.length > 0) {
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    const strongMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    const emMatch = remaining.match(/^\*([^*]+)\*/);
    const codeMatch = remaining.match(/^`([^`]+)`/);

    if (linkMatch) {
      parts.push(
        <a
          key={`link-${key++}`}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-skyblue-400 hover:text-skyblue-500 transition-colors underline underline-offset-2"
        >
          {linkMatch[1]}
        </a>,
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    if (strongMatch) {
      parts.push(
        <strong key={`strong-${key++}`} className="text-slate-300 font-semibold">
          {strongMatch[1]}
        </strong>,
      );
      remaining = remaining.slice(strongMatch[0].length);
      continue;
    }

    if (emMatch) {
      parts.push(
        <em key={`em-${key++}`} className="text-slate-400 italic">
          {emMatch[1]}
        </em>,
      );
      remaining = remaining.slice(emMatch[0].length);
      continue;
    }

    if (codeMatch) {
      parts.push(
        <code key={`code-${key++}`} className="bg-navy-900 text-skyblue-400 font-mono text-sm px-1.5 py-0.5 rounded">
          {codeMatch[1]}
        </code>,
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    const nextSpecial = remaining.search(/\[|\*|`/);
    if (nextSpecial === -1) {
      pushText(remaining);
      break;
    }

    if (nextSpecial === 0) {
      // Special char didn't match any pattern — emit it literally and advance
      pushText(remaining[0]);
      remaining = remaining.slice(1);
    } else {
      pushText(remaining.slice(0, nextSpecial));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return parts;
}

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  const isListItem = (line: string) => /^(-|\d+\.)\s+/.test(line);
  const isTableSeparator = (line: string) => {
    const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());

    return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/.test(cell));
  };

  const parseTableRow = (line: string) => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim());

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      nodes.push(
        <pre key={`pre-${key++}`} className="mb-4 rounded-lg overflow-x-auto">
          <code className="block bg-navy-900 text-skyblue-400 font-mono text-sm p-4 rounded-lg overflow-x-auto whitespace-pre">
            {codeLines.join('\n')}
          </code>
        </pre>,
      );
      continue;
    }

    if (line.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const headers = parseTableRow(line);
      const rows: string[][] = [];
      i += 2;

      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        rows.push(parseTableRow(lines[i]));
        i += 1;
      }

      nodes.push(
        <div key={`table-${key++}`} className="mb-6 overflow-x-auto rounded-lg border border-navy-700">
          <table className="min-w-full border-collapse text-sm">
            <thead className="bg-navy-900/80">
              <tr>
                {headers.map((header, headerIndex) => (
                  <th
                    key={`th-${key++}-${headerIndex}`}
                    className="border-b border-navy-700 px-4 py-3 text-left font-semibold text-slate-200"
                  >
                    {renderInlineMarkdown(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={`tr-${key++}-${rowIndex}`} className="odd:bg-navy-800/40 even:bg-navy-800/20">
                  {headers.map((_, cellIndex) => (
                    <td key={`td-${key++}-${rowIndex}-${cellIndex}`} className="border-b border-navy-700 px-4 py-3 text-slate-400 align-top">
                      {renderInlineMarkdown(row[cellIndex] || '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (line.startsWith('# ')) {
      nodes.push(
        <h1 key={`h1-${key++}`} className="text-3xl font-bold text-slate-200 mb-6 mt-8 first:mt-0">
          {renderInlineMarkdown(line.slice(2))}
        </h1>,
      );
      i += 1;
      continue;
    }

    if (line.startsWith('## ')) {
      nodes.push(
        <h2 key={`h2-${key++}`} className="text-2xl font-semibold text-slate-200 mb-4 mt-8">
          {renderInlineMarkdown(line.slice(3))}
        </h2>,
      );
      i += 1;
      continue;
    }

    if (line.startsWith('### ')) {
      nodes.push(
        <h3 key={`h3-${key++}`} className="text-lg font-semibold text-slate-300 mb-3 mt-6">
          {renderInlineMarkdown(line.slice(4))}
        </h3>,
      );
      i += 1;
      continue;
    }

    if (line.startsWith('> ')) {
      const quoteLines = [line.slice(2)];
      i += 1;
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2));
        i += 1;
      }
      nodes.push(
        <blockquote key={`quote-${key++}`} className="border-l-2 border-skyblue-700 pl-4 my-4 text-slate-400 italic">
          <p className="text-slate-400 leading-7 mb-4">{renderInlineMarkdown(quoteLines.join(' '))}</p>
        </blockquote>,
      );
      continue;
    }

    if (line === '---') {
      nodes.push(<hr key={`hr-${key++}`} className="border-navy-700 my-8" />);
      i += 1;
      continue;
    }

    if (isListItem(line)) {
      const ordered = /^\d+\./.test(line);
      const items: React.ReactNode[] = [];
      while (i < lines.length && isListItem(lines[i])) {
        items.push(
          <li key={`li-${key++}`} className="text-slate-400 leading-7">
            {renderInlineMarkdown(lines[i].replace(/^(-|\d+\.)\s+/, ''))}
          </li>,
        );
        i += 1;
      }
      nodes.push(
        ordered ? (
          <ol key={`ol-${key++}`} className="list-decimal list-inside text-slate-400 mb-4 space-y-1">
            {items}
          </ol>
        ) : (
          <ul key={`ul-${key++}`} className="list-disc list-inside text-slate-400 mb-4 space-y-1">
            {items}
          </ul>
        ),
      );
      continue;
    }

    const paragraphLines = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !lines[i].startsWith('# ') && !lines[i].startsWith('## ') && !lines[i].startsWith('### ') && !lines[i].startsWith('> ') && lines[i] !== '---' && !lines[i].startsWith('```') && !isListItem(lines[i])) {
      paragraphLines.push(lines[i]);
      i += 1;
    }

    nodes.push(
      <p key={`p-${key++}`} className="text-slate-400 leading-7 mb-4">
        {renderInlineMarkdown(paragraphLines.join(' '))}
      </p>,
    );
  }

  return nodes;
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
            {renderMarkdown(markdownContent)}
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
