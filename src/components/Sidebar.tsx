'use client';

import { useState } from 'react';
import portfolioData from '@/data/portfolio.json';

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navItems = ['about', 'experience', 'projects', 'writing'];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:flex lg:h-screen lg:w-1/3 lg:flex-col lg:justify-between lg:px-12 lg:py-24 bg-navy-900">
        {/* Header Section */}
        <div>
          <h1 className="text-4xl font-bold text-slate-200 mb-2">
            {portfolioData.header.name}
          </h1>
          <h2 className="text-xl text-teal-400 font-medium mb-6">
            {portfolioData.header.title}
          </h2>
          <p className="text-slate-400 max-w-xs leading-relaxed text-sm mb-12">
            {portfolioData.header.tagline}
          </p>

          {/* Navigation Links */}
          <nav className="mb-16">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollToSection(item)}
                    className="text-slate-400 hover:text-teal-400 transition-colors font-medium capitalize text-sm hover:translate-x-1 transition-transform duration-300"
                  >
                    0{navItems.indexOf(item) + 1}. {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Social Links */}
        <div className="flex gap-6">
          {portfolioData.social.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={link.name}
              className="text-slate-400 hover:text-teal-400 transition-colors hover:scale-110 transition-transform duration-300"
            >
              <span className="text-xl">
                {link.icon === 'github' && '𝗚'}
                {link.icon === 'linkedin' && '𝗟'}
                {link.icon === 'twitter' && '𝗧'}
                {link.icon === 'mail' && '✉'}
              </span>
            </a>
          ))}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-navy-900 border-b border-navy-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-200">
          {portfolioData.header.name.split(' ')[0]}
        </h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-teal-400 hover:text-teal-300 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="lg:hidden fixed top-16 left-0 right-0 bg-navy-900 border-b border-navy-700 px-6 py-4 z-40">
          <ul className="space-y-3">
            {navItems.map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollToSection(item)}
                  className="text-slate-400 hover:text-teal-400 transition-colors capitalize font-medium block w-full text-left py-2"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
}
