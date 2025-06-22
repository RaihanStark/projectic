import { Calendar, CheckCircle, Users, Zap } from 'lucide-react';
import { WaitlistForm } from '@/components/WaitlistForm';

export async function generateMetadata() {
  return {
    title: 'Projectic - Modern Task Management',
    description: 'Streamline your workflow with our intuitive task management platform. Track progress, collaborate with teams, and boost productivity.',
  };
}

export default function Index() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 lg:py-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-gray-900/[0.04] bg-[size:20px_20px]" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
              🚀 Coming Soon
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Streamline Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Workflow</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Organize tasks, track progress, and collaborate with your team using our intuitive task management platform.
              Built for modern teams who value simplicity and efficiency.
            </p>
            <div className="mb-12">
              <WaitlistForm />
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl transform rotate-1"></div>
              <div className="relative transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <img
                  src="/assets/images/hero.png"
                  alt="Projectic Dashboard Preview"
                  className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to stay
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> organized</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help you and your team work more efficiently and achieve your goals faster
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Task Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Create, organize, and track tasks with deadlines, priorities, and status updates.
                Never miss an important deadline again.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Team Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Work together seamlessly with shared projects, comments, and real-time updates.
                Keep everyone on the same page.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Smart Scheduling</h3>
              <p className="text-gray-600 leading-relaxed">
                Intelligent deadline management with calendar integration and automated reminders.
                Stay ahead of your schedule.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-orange-50/30">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Built with modern technology for instant loading and real-time updates.
                No more waiting around.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-red-50/30">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Priority Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Set priorities and urgency levels to focus on what matters most.
                Visual indicators keep you focused.
              </p>
            </div>

            <div className="group text-center p-8 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/30">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Private</h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is protected with enterprise-grade security and privacy controls.
                Work with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to boost your productivity?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Be among the first to experience the future of task management
          </p>
          <WaitlistForm variant="dark" />
        </div>
      </section>
    </>
  );
};
