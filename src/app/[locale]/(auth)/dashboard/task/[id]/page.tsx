import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import TaskDetail from '@/components/TaskDetail';

// Mock data - in a real app, this would come from your database
const mockTasks = [
  {
    id: 1,
    title: 'Design the new landing page',
    description: 'Create comprehensive mockups for the new landing page in Figma. The design should focus on user experience and conversion optimization. Include mobile-responsive layouts and ensure the design aligns with our brand guidelines. The mockups should cover all major sections including hero, features, testimonials, and call-to-action areas.',
    label: 'Design',
    status: 'in-progress' as const,
    urgency: 'high' as const,
    deadline: 'Mar 15, 2024',
  },
  {
    id: 2,
    title: 'Implement user authentication',
    description: 'Set up a complete authentication system using Clerk. This includes implementing sign-in, sign-up, password reset, and social login functionality. The system should integrate seamlessly with our existing user management system and provide proper role-based access control. Also implement session management and security best practices.',
    label: 'Frontend Development',
    status: 'todo' as const,
    urgency: 'critical' as const,
    deadline: 'Mar 20, 2024',
  },
  {
    id: 3,
    title: 'Deploy the application to Vercel',
    description: 'Configure and deploy the application to Vercel with proper CI/CD pipeline setup. This includes setting up environment variables, configuring build settings, and ensuring proper deployment workflows. Also set up monitoring and error tracking for production.',
    label: 'DevOps',
    status: 'done' as const,
    urgency: 'medium' as const,
    deadline: 'Mar 10, 2024',
  },
];

export async function generateMetadata(props: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  const task = mockTasks.find(t => t.id === Number.parseInt(props.params.id));

  return {
    title: task ? `${task.title} - ${t('meta_title')}` : 'Task Not Found',
  };
}

export default function TaskDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const task = mockTasks.find(t => t.id === Number.parseInt(params.id));

  if (!task) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <TaskDetail {...task} />
    </div>
  );
}
