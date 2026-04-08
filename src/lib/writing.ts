import portfolioData from '@/data/portfolio.json';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export type WritingEntry = {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
  url: string;
  slug?: string;
  madeAt?: string;
  tags?: string[];
  featured: boolean;
};

export const writingEntries = portfolioData.writing as WritingEntry[];

export function isExternalUrl(url: string) {
  return url.startsWith('http://') || url.startsWith('https://');
}

export function getWritingHref(article: WritingEntry) {
  if (article.slug) {
    return `/writing/${article.slug}`;
  }

  return isExternalUrl(article.url) ? article.url : `${BASE}${article.url}`;
}

export function getWritingSourceHref(article: WritingEntry) {
  return isExternalUrl(article.url) ? article.url : `${BASE}${article.url}`;
}

export function getPublicAssetHref(assetPath: string) {
  return `${BASE}${assetPath}`;
}

export function getWritingLinkLabel(article: WritingEntry) {
  if (article.slug) {
    return 'Article';
  }

  if (isExternalUrl(article.url)) {
    return new URL(article.url).hostname.replace('www.', '');
  }

  return 'PDF';
}

export function getWritingSourceLabel(article: WritingEntry) {
  if (isExternalUrl(article.url)) {
    return new URL(article.url).hostname.replace('www.', '');
  }

  return 'PDF';
}
