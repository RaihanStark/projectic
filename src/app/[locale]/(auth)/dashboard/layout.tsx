import type { ReactNode } from 'react';
import { auth } from '@clerk/nextjs/server';
import { setRequestLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';

import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function DashboardLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
