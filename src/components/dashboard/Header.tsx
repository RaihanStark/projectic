'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { Bell, Search, Settings } from 'lucide-react';

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Tasks</h1>
      </div>
      <div className="relative ml-auto w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg border border-gray-200 bg-gray-100 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none"
        />
      </div>
      <div className="ml-auto flex items-center gap-4">
        <button
          type="button"
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <Settings className="h-5 w-5" />
        </button>
        {isSignedIn && <UserButton afterSignOutUrl="/" />}
      </div>
    </header>
  );
};

export default Header;
