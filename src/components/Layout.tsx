'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-navy-900">
      <Sidebar />
      <main className="w-full lg:w-2/3 lg:ml-auto">
        {children}
      </main>
    </div>
  );
}
