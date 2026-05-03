'use client';
import Link from 'next/link';
import portfolioData from '@/data/portfolio.json';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function Sidebar() {
  const getIconPath = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      github: `${BASE}/icons/github.svg`,
      linkedin: `${BASE}/icons/linkedin.svg`,
      mail: `${BASE}/icons/email.svg`,
    };
    return iconMap[iconName] || null;
  };

  const navItems = [
    { label: 'about', id: 'about', href: null },
    { label: 'experience', id: 'experience', href: null },
    { label: 'projects', id: 'projects', href: null },
    { label: 'Blog', id: 'writing', href: '/writing' },
  ];

  return (
    <>
      <style>{`
        .icon-wrapper {
          display: inline-block;
          transition: filter 0.3s ease;
        }
        a:hover .icon-wrapper {
          filter: brightness(0.9) saturate(1) hue-rotate(180deg) !important;
        }
      `}</style>
      {/* Desktop Sidebar — sticky */}
      <aside className="hidden lg:flex lg:flex-col lg:justify-between lg:sticky lg:top-0 lg:h-screen lg:w-1/3 lg:px-12 lg:py-24 bg-navy-900">
        <div>
          <h1 className="text-4xl font-bold text-slate-200 mb-2">
            {portfolioData.header.name}
          </h1>
          <h2 className="text-xl text-skyblue-500 font-medium mb-6">
            {portfolioData.header.title}
          </h2>
          <p className="text-slate-400 max-w-xs leading-relaxed text-sm mb-12">
            {portfolioData.header.tagline}
          </p>

          {/* Navigation with line hover effect */}
          <nav>
            <ul className="space-y-5">
              {navItems.map((item) => (
                <li key={item.id}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="group flex items-center gap-4 text-slate-500 hover:text-slate-200 transition-all duration-300 font-medium uppercase tracking-widest text-xs"
                    >
                      <span className="block h-px w-8 bg-slate-600 group-hover:w-16 group-hover:bg-slate-200 transition-all duration-300" />
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={`#${item.id}`}
                      className="group flex items-center gap-4 text-slate-500 hover:text-slate-200 transition-all duration-300 font-medium uppercase tracking-widest text-xs"
                    >
                      <span className="block h-px w-8 bg-slate-600 group-hover:w-16 group-hover:bg-slate-200 transition-all duration-300" />
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Social Links */}
        <div className="flex gap-6">
          {portfolioData.social.map((link) => {
            const iconPath = getIconPath(link.icon);
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
                className="text-slate-400 hover:text-teal-400 transition-colors hover:scale-110 duration-300"
              >
                {iconPath && (
                  <div className="icon-wrapper" style={{ filter: 'brightness(0.6) saturate(0.8)' }}>
                    <img src={iconPath} alt={link.name} width={24} height={24} />
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </aside>

      {/* Mobile — full profile at top, no hamburger */}
      <header className="lg:hidden bg-navy-900 px-6 pt-10 pb-8">
        <h1 className="text-3xl font-bold text-slate-200 mb-1">
          {portfolioData.header.name}
        </h1>
        <h2 className="text-base text-skyblue-500 font-medium mb-4">
          {portfolioData.header.title}
        </h2>
        <p className="text-slate-400 leading-relaxed text-sm mb-6">
          {portfolioData.header.tagline}
        </p>

        <div className="flex gap-5">
          {portfolioData.social.map((link) => {
            const iconPath = getIconPath(link.icon);
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.name}
                className="text-slate-400 hover:text-teal-400 transition-colors"
              >
                {iconPath && (
                  <div className="icon-wrapper" style={{ filter: 'brightness(0.6) saturate(0.8)' }}>
                    <img src={iconPath} alt={link.name} width={20} height={20} />
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </header>
    </>
  );
}
