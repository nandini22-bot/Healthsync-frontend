import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import FooterModalWrapper from '@/components/layout/FooterModalWrapper';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userEmail = 'alex.patient@healthsync.com';

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <Sidebar userEmail={userEmail} />
      <main className="flex-1 pt-20 px-4 md:px-8 pb-8 max-w-7xl mx-auto w-full animate-fade-in">
        {children}
      </main>
      <footer suppressHydrationWarning className="border-t flex flex-col items-center justify-center py-4 text-[10px] font-bold shrink-0" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }}>
        <span>© 2026 HealthSync. All rights reserved.</span>
        <FooterModalWrapper />
      </footer>
    </div>
  );
}
