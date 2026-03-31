'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-6 sm:px-12 lg:px-16 max-w-4xl mx-auto border-t border-navy-700">
      <div className="text-center text-slate-500 text-sm space-y-4">
        <p>
          Designed & built by <span className="text-teal-400">Your Name</span>
        </p>
        <p>
          © {currentYear}. All rights reserved.
        </p>
        <p className="text-xs pt-4">
          Made with React, Next.js, Tailwind CSS, and a cup of coffee ☕
        </p>
      </div>
    </footer>
  );
}
