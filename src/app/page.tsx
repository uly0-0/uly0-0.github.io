'use client';

import About from '@/sections/About';
import Experience from '@/sections/Experience';
import Projects from '@/sections/Projects';
import Writing from '@/sections/Writing';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 sm:py-32 lg:py-40 px-6 sm:px-12 lg:px-16 max-w-4xl mx-auto">
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
            <span className="text-slate-200">Hey, I'm </span>
            <span className="text-gradient">Your Name</span>
          </h1>
          <p className="text-xl sm:text-2xl text-slate-400 max-w-2xl leading-relaxed">
            I build accessible, pixel-perfect digital experiences for the web.
          </p>
          <p className="text-slate-400 max-w-2xl leading-relaxed">
            Currently specializing in full-stack development with a focus on creating intuitive user interfaces and scalable backend systems.
          </p>
          <div className="pt-4 flex gap-4">
            <a
              href="#experience"
              className="px-8 py-3 border border-teal-400 text-teal-400 rounded hover:bg-teal-400/10 transition-colors font-mono text-sm"
            >
              Check out my work
            </a>
            <a
              href="mailto:hello@example.com"
              className="px-8 py-3 border border-teal-400 text-teal-400 rounded hover:bg-teal-400/10 transition-colors font-mono text-sm"
            >
              Get in touch
            </a>
          </div>
        </div>
      </section>

      {/* Sections */}
      <About />
      <Experience />
      <Projects />
      <Writing />
      
      {/* Footer */}
      <Footer />
    </>
  );
}
