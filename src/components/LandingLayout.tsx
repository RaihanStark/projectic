import Link from 'next/link';
import { AppConfig } from '@/utils/AppConfig';

export const LandingLayout = (props: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{AppConfig.name}</span>
              </Link>
            </div>

            {/* Auth Links */}
            <div className="flex items-center space-x-4">
              <Link
                href="/sign-in"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              >
                Sign in
              </Link>
              <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{props.children}</main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{AppConfig.name}</span>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Modern task management platform designed to help teams stay organized and productive.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Account
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/sign-in" className="text-gray-600 hover:text-gray-900 transition-colors">
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8">
            <p className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} {AppConfig.name}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};