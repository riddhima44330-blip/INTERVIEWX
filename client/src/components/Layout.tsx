import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-[var(--color-brand-background)] text-[var(--color-brand-text-primary)]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden border-b border-[#2A2A35] bg-[var(--color-brand-panel)] p-4 flex items-center justify-between sticky top-0 z-50">
          <h1 className="text-xl font-bold bg-gradient-primary -webkit-background-clip-text text-transparent bg-clip-text text-gradient">
            InterviewX
          </h1>
          <button className="text-[var(--color-brand-text-secondary)] hover:text-white">
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
