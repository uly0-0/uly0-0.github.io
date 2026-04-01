import { useInView } from 'react-intersection-observer';
import { ReactNode } from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export default function Section({ id, title, children }: SectionProps) {
  const { ref } = useInView({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  });

  return (
    <section
      id={id}
      ref={ref}
      className="py-20 px-6 sm:px-12 lg:px-16 max-w-4xl mx-auto opacity-0 animate-fade-in"
      style={{
        animationDelay: '0.2s',
        animationFillMode: 'forwards',
      }}
    >
      <div className="flex items-center mb-12 gap-4 lg:hidden">
        <span className="text-teal-400 font-mono text-lg">
          0{[1, 2, 3, 4].indexOf(['about', 'experience', 'projects', 'writing'].indexOf(id)) + 1}.
        </span>
        <h2 className="text-3xl font-bold text-slate-200">{title}</h2>
        <div className="hidden sm:flex-1 sm:h-0.5 sm:bg-gradient-to-r sm:from-teal-400 sm:to-transparent sm:ml-4"></div>
      </div>
      {children}
    </section>
  );
}
