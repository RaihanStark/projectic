import { db } from '@/libs/DB';
import { tasksSchema, subTasksSchema, projectsSchema } from '@/models/Schema';

export async function seedSampleTasks(userId: number) {
  // First create some sample projects
  const sampleProjects = [
    {
      userId,
      name: 'Work Website',
      description: 'Website redesign and development project',
      color: '#3b82f6',
    },
    {
      userId,
      name: 'Personal',
      description: 'Personal tasks and daily activities',
      color: '#10b981',
    },
    {
      userId,
      name: 'Mobile App',
      description: 'Complete redesign of mobile application',
      color: '#f59e0b',
    },
  ];

  const insertedProjects = await db
    .insert(projectsSchema)
    .values(sampleProjects)
    .returning();

  const [workProject, personalProject, mobileProject] = insertedProjects;
  const sampleTasks = [
    {
      userId,
      projectId: workProject?.id,
      title: 'Design the new landing page',
      description: 'Create comprehensive mockups for the new landing page in Figma. The design should focus on user experience and conversion optimization.',
      label: 'Design',
      status: 'in-progress' as const,
      urgency: 'high' as const,
      deadline: new Date('2025-01-15'),
    },
    {
      userId,
      projectId: workProject?.id,
      title: 'Implement user authentication system',
      description: 'Set up a complete authentication system with JWT. This includes implementing sign-in, sign-up, password reset, and session management.',
      label: 'Backend',
      status: 'in-progress' as const,
      urgency: 'critical' as const,
      deadline: new Date('2025-01-20'),
    },
    {
      userId,
      projectId: workProject?.id,
      title: 'Deploy application to production',
      description: 'Configure and deploy the application to production with proper CI/CD pipeline setup. This includes setting up environment variables and monitoring.',
      label: 'DevOps',
      status: 'done' as const,
      urgency: 'medium' as const,
      deadline: new Date('2024-12-10'),
    },
    {
      userId,
      projectId: personalProject?.id,
      title: 'Write comprehensive API documentation',
      description: 'Create detailed API documentation using OpenAPI/Swagger. Include examples, error codes, and authentication requirements for all endpoints.',
      label: 'Documentation',
      status: 'todo' as const,
      urgency: 'low' as const,
      deadline: new Date('2025-02-01'),
    },
    {
      userId,
      projectId: mobileProject?.id,
      title: 'Implement real-time notifications',
      description: 'Add WebSocket support for real-time notifications. Users should receive instant updates for task assignments, comments, and status changes.',
      label: 'Feature',
      status: 'todo' as const,
      urgency: 'medium' as const,
      deadline: new Date('2025-01-30'),
    },
    {
      userId,
      projectId: workProject?.id,
      title: 'Set up automated testing pipeline',
      description: 'Configure comprehensive testing including unit tests, integration tests, and E2E tests. Set up GitHub Actions for automated testing on PRs.',
      label: 'Testing',
      status: 'in-progress' as const,
      urgency: 'high' as const,
      deadline: new Date('2025-01-25'),
    },
    {
      userId,
      projectId: workProject?.id,
      title: 'Database performance optimization',
      description: 'Analyze and optimize database queries, add proper indexes, and implement caching strategies to improve application performance.',
      label: 'Performance',
      status: 'todo' as const,
      urgency: 'medium' as const,
      deadline: new Date('2025-02-15'),
    },
    {
      userId,
      projectId: mobileProject?.id,
      title: 'Mobile responsive design',
      description: 'Ensure the application works perfectly on mobile devices. Test and optimize for various screen sizes and touch interactions.',
      label: 'Frontend',
      status: 'done' as const,
      urgency: 'high' as const,
      deadline: new Date('2024-12-20'),
    },
    {
      userId,
      projectId: workProject?.id,
      title: 'Security audit and penetration testing',
      description: 'Conduct thorough security audit, implement security headers, and perform penetration testing to identify vulnerabilities.',
      label: 'Security',
      status: 'cancelled' as const,
      urgency: 'critical' as const,
      deadline: new Date('2025-01-10'),
    },
    {
      userId,
      projectId: mobileProject?.id,
      title: 'User onboarding flow',
      description: 'Design and implement an intuitive onboarding process for new users. Include guided tours, tooltips, and progressive disclosure.',
      label: 'UX',
      status: 'todo' as const,
      urgency: 'low' as const,
      deadline: new Date('2025-03-01'),
    },
  ];

  const insertedTasks = await db
    .insert(tasksSchema)
    .values(sampleTasks)
    .returning();

  // Create sub-tasks for some of the main tasks to showcase the feature
  const subTasksData = [
    // Sub-tasks for "Design the new landing page" (task 1)
    { taskId: insertedTasks[0].id, title: 'Research competitor landing pages', completed: true, order: 1 },
    { taskId: insertedTasks[0].id, title: 'Create wireframes in Figma', completed: true, order: 2 },
    { taskId: insertedTasks[0].id, title: 'Design hero section', completed: false, order: 3 },
    { taskId: insertedTasks[0].id, title: 'Design features section', completed: false, order: 4 },
    { taskId: insertedTasks[0].id, title: 'Create mobile mockups', completed: false, order: 5 },

    // Sub-tasks for "Implement user authentication system" (task 2)
    { taskId: insertedTasks[1].id, title: 'Set up JWT middleware', completed: true, order: 1 },
    { taskId: insertedTasks[1].id, title: 'Create sign-up API endpoint', completed: true, order: 2 },
    { taskId: insertedTasks[1].id, title: 'Create sign-in API endpoint', completed: false, order: 3 },
    { taskId: insertedTasks[1].id, title: 'Implement password hashing', completed: false, order: 4 },
    { taskId: insertedTasks[1].id, title: 'Add session management', completed: false, order: 5 },
    { taskId: insertedTasks[1].id, title: 'Create protected route middleware', completed: false, order: 6 },

    // Sub-tasks for "Set up automated testing pipeline" (task 6)
    { taskId: insertedTasks[5].id, title: 'Configure Vitest for unit tests', completed: true, order: 1 },
    { taskId: insertedTasks[5].id, title: 'Write API endpoint tests', completed: false, order: 2 },
    { taskId: insertedTasks[5].id, title: 'Set up Playwright for E2E tests', completed: false, order: 3 },
    { taskId: insertedTasks[5].id, title: 'Configure GitHub Actions workflow', completed: false, order: 4 },

    // Sub-tasks for "User onboarding flow" (task 10)
    { taskId: insertedTasks[9].id, title: 'Design onboarding screens', completed: false, order: 1 },
    { taskId: insertedTasks[9].id, title: 'Implement guided tour component', completed: false, order: 2 },
    { taskId: insertedTasks[9].id, title: 'Add interactive tooltips', completed: false, order: 3 },
    { taskId: insertedTasks[9].id, title: 'Create progress tracking', completed: false, order: 4 },
  ];

  await db
    .insert(subTasksSchema)
    .values(subTasksData);

  return insertedTasks;
}
