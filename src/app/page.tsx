'use client';

import Layout from '@/components/Layout';
import About from '@/sections/About';
import Experience from '@/sections/Experience';
import Projects from '@/sections/Projects';
import Writing from '@/sections/Writing';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <Layout>
      {/* Sections */}
      <About />
      <Experience />
      <Projects />
      <Writing />

      {/* Footer */}
      <Footer />
    </Layout>
  );
}
