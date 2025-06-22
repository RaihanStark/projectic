import { db } from '@/libs/DB';
import { tasksSchema } from '@/models/Schema';

export async function seedSampleTasks(userId: number) {
  const sampleTasks = [
    {
      userId,
      title: 'Design the new landing page',
      description: 'Create comprehensive mockups for the new landing page in Figma. The design should focus on user experience and conversion optimization.',
      label: 'Design',
      status: 'in-progress' as const,
      urgency: 'high' as const,
      deadline: new Date('2024-03-15'),
    },
    {
      userId,
      title: 'Implement user authentication',
      description: 'Set up a complete authentication system using Clerk. This includes implementing sign-in, sign-up, password reset, and social login functionality.',
      label: 'Frontend Development',
      status: 'todo' as const,
      urgency: 'critical' as const,
      deadline: new Date('2024-03-20'),
    },
    {
      userId,
      title: 'Deploy the application to Vercel',
      description: 'Configure and deploy the application to Vercel with proper CI/CD pipeline setup. This includes setting up environment variables and monitoring.',
      label: 'DevOps',
      status: 'done' as const,
      urgency: 'medium' as const,
      deadline: new Date('2024-03-10'),
    },
    {
      userId,
      title: 'Write API documentation',
      description: 'Create comprehensive API documentation using OpenAPI/Swagger. Include examples, error codes, and authentication requirements.',
      label: 'Documentation',
      status: 'todo' as const,
      urgency: 'low' as const,
      deadline: new Date('2024-03-25'),
    },
  ];

  const insertedTasks = await db
    .insert(tasksSchema)
    .values(sampleTasks)
    .returning();
  return insertedTasks;
}
