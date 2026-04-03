'use client';

import Section from '@/components/Section';
import portfolioData from '@/data/portfolio.json';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function Projects() {
  const featuredProjects = portfolioData.projects.filter((p) => p.featured);

  return (
    <Section id="projects" title="Projects">
      <div className="space-y-20">
        {featuredProjects.map((project, index) => (
          <div
            key={project.id}
            className="opacity-0 animate-fade-in"
            style={{
              animationDelay: `${0.2 + index * 0.15}s`,
              animationFillMode: 'forwards',
            }}
          >
            <div
              className="group relative cursor-pointer"
              onClick={() => window.open(project.external || project.github || '#', '_blank', 'noopener,noreferrer')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-slate-400/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-navy-800 rounded-lg p-6 border border-skyblue-700/30 group-hover:border-skyblue-500/50 transition-colors duration-300">
                {/* Project Image Placeholder */}
                <div className="h-60 bg-gradient-to-br from-navy-700 to-navy-900 rounded mb-6 flex items-center justify-center text-slate-500">
                  {project.image ? (
                    <img
                      src={`${BASE}${project.image}`}
                      alt={project.title}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <span>[Project Image]</span>
                  )}
                </div>

                <h3 className="text-skyblue-700 font-semibold text-xl mb-2 group-hover:text-skyblue-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono text-skyblue-700 bg-skyblue-700/10 px-3 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-skyblue-700 hover:text-skyblue-500 transition-colors font-mono text-sm flex items-center gap-2"
                    >
                      ↗ GitHub
                    </a>
                  )}
                  {project.external && (
                    <a
                      href={project.external}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-skyblue-700 hover:text-skyblue-500 transition-colors font-mono text-sm flex items-center gap-2"
                    >
                      ↗ Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* View All Projects Link */}
        <div className="text-center pt-8 border-t border-navy-700">
          <p className="text-slate-400 mb-4">
            Want to see more projects?
          </p>
          <a
            href="https://github.com/uly0-0"
            className="inline-block px-8 py-3 border border-skyblue-700 text-skyblue-700 rounded hover:border-skyblue-500 hover:text-skyblue-500 hover:bg-skyblue-500/10 transition-colors font-mono text-sm"
          >
            View All Projects
          </a>
        </div>
      </div>
    </Section>
  );
}
