import { db } from '@/libs/DB';
import { projectsSchema, subTasksSchema, tasksSchema } from '@/models/Schema';

export async function seedSampleTasks(userId: number) {
  // First create some sample projects
  const sampleProjects = [
    {
      userId,
      name: 'E-commerce Platform',
      description: 'Full-stack e-commerce platform with payment integration and inventory management',
      color: '#3b82f6',
    },
    {
      userId,
      name: 'Personal Finance App',
      description: 'Personal finance tracking app with budgeting and expense analysis features',
      color: '#10b981',
    },
    {
      userId,
      name: 'Task Management System',
      description: 'Complete project management tool with team collaboration and real-time updates',
      color: '#f59e0b',
    },
    {
      userId,
      name: 'Learning Platform',
      description: 'Online learning platform with video streaming and progress tracking',
      color: '#8b5cf6',
    },
    {
      userId,
      name: 'Social Media Dashboard',
      description: 'Social media analytics and management dashboard for businesses',
      color: '#ec4899',
    },
  ];

  const insertedProjects = await db
    .insert(projectsSchema)
    .values(sampleProjects)
    .returning();

  const [ecommerceProject, financeProject, taskProject, learningProject, socialProject] = insertedProjects;
  const sampleTasks = [
    // E-commerce Platform tasks
    {
      userId,
      projectId: ecommerceProject?.id,
      title: 'Design product catalog interface',
      description: 'Create comprehensive product catalog with advanced filtering, search, and sorting capabilities. Include product comparison and wishlist features.',
      label: 'Frontend',
      status: 'in-progress' as const,
      urgency: 'high' as const,
      deadline: new Date('2025-01-15'),
    },
    {
      userId,
      projectId: ecommerceProject?.id,
      title: 'Implement payment gateway integration',
      description: 'Integrate Stripe and PayPal payment systems with secure checkout flow. Include support for multiple currencies and payment methods.',
      label: 'Backend',
      status: 'todo' as const,
      urgency: 'critical' as const,
      deadline: new Date('2025-01-20'),
    },
    {
      userId,
      projectId: ecommerceProject?.id,
      title: 'Set up inventory management system',
      description: 'Build real-time inventory tracking with low-stock alerts, automated reordering, and supplier management.',
      label: 'Backend',
      status: 'done' as const,
      urgency: 'medium' as const,
      deadline: new Date('2024-12-10'),
    },

    // Personal Finance App tasks
    {
      userId,
      projectId: financeProject?.id,
      title: 'Build expense tracking dashboard',
      description: 'Create interactive dashboard with charts and analytics for expense tracking. Include category-wise breakdowns and spending trends.',
      label: 'Frontend',
      status: 'in-progress' as const,
      urgency: 'high' as const,
      deadline: new Date('2025-01-25'),
    },
    {
      userId,
      projectId: financeProject?.id,
      title: 'Implement budgeting system',
      description: 'Add budget creation, monitoring, and alert system. Include goal setting and progress tracking for financial objectives.',
      label: 'Feature',
      status: 'todo' as const,
      urgency: 'medium' as const,
      deadline: new Date('2025-02-01'),
    },
    {
      userId,
      projectId: financeProject?.id,
      title: 'Bank account synchronization',
      description: 'Integrate with banking APIs for automatic transaction import and account balance syncing.',
      label: 'Integration',
      status: 'cancelled' as const,
      urgency: 'low' as const,
      deadline: new Date('2025-03-01'),
    },

    // Task Management System tasks
    {
      userId,
      projectId: taskProject?.id,
      title: 'Real-time collaboration features',
      description: 'Implement WebSocket-based real-time updates for team collaboration. Include live editing, comments, and activity feeds.',
      label: 'Backend',
      status: 'in-progress' as const,
      urgency: 'high' as const,
      deadline: new Date('2025-01-30'),
    },
    {
      userId,
      projectId: taskProject?.id,
      title: 'Advanced project analytics',
      description: 'Build comprehensive analytics dashboard with project insights, team performance metrics, and productivity reports.',
      label: 'Analytics',
      status: 'todo' as const,
      urgency: 'medium' as const,
      deadline: new Date('2025-02-15'),
    },

    // Learning Platform tasks
    {
      userId,
      projectId: learningProject?.id,
      title: 'Video streaming infrastructure',
      description: 'Set up adaptive video streaming with CDN integration. Include subtitle support and video quality selection.',
      label: 'Infrastructure',
      status: 'done' as const,
      urgency: 'critical' as const,
      deadline: new Date('2024-12-20'),
    },
    {
      userId,
      projectId: learningProject?.id,
      title: 'Student progress tracking system',
      description: 'Build comprehensive progress tracking with completion certificates, skill assessments, and learning path recommendations.',
      label: 'Feature',
      status: 'todo' as const,
      urgency: 'medium' as const,
      deadline: new Date('2025-02-10'),
    },

    // Social Media Dashboard tasks
    {
      userId,
      projectId: socialProject?.id,
      title: 'Multi-platform API integration',
      description: 'Integrate with Facebook, Twitter, Instagram, and LinkedIn APIs for unified social media management.',
      label: 'Integration',
      status: 'in-progress' as const,
      urgency: 'high' as const,
      deadline: new Date('2025-01-18'),
    },
    {
      userId,
      projectId: socialProject?.id,
      title: 'Content scheduling system',
      description: 'Build advanced content scheduling with optimal posting time suggestions and bulk upload capabilities.',
      label: 'Feature',
      status: 'todo' as const,
      urgency: 'medium' as const,
      deadline: new Date('2025-02-05'),
    },

    // Tasks without projects (optional)
    {
      userId,
      projectId: null,
      title: 'Review team performance metrics',
      description: 'Conduct quarterly review of team performance and productivity metrics across all projects.',
      label: 'Management',
      status: 'todo' as const,
      urgency: 'low' as const,
      deadline: new Date('2025-01-31'),
    },
    {
      userId,
      projectId: null,
      title: 'Update development environment',
      description: 'Upgrade development tools, IDEs, and local environment setup for better productivity.',
      label: 'DevOps',
      status: 'done' as const,
      urgency: 'low' as const,
      deadline: new Date('2024-12-15'),
    },
  ];

  const insertedTasks = await db
    .insert(tasksSchema)
    .values(sampleTasks)
    .returning();

  // Create sub-tasks for some of the main tasks to showcase the feature
  const subTasksData = [
    // Sub-tasks for "Design product catalog interface" (task 0)
    { taskId: insertedTasks[0]?.id, title: 'Research competitor e-commerce sites', completed: true, order: 1 },
    { taskId: insertedTasks[0]?.id, title: 'Create wireframes for product listing', completed: true, order: 2 },
    { taskId: insertedTasks[0]?.id, title: 'Design filtering and search UI', completed: false, order: 3 },
    { taskId: insertedTasks[0]?.id, title: 'Implement product comparison feature', completed: false, order: 4 },
    { taskId: insertedTasks[0]?.id, title: 'Add wishlist functionality', completed: false, order: 5 },

    // Sub-tasks for "Implement payment gateway integration" (task 1)
    { taskId: insertedTasks[1]?.id, title: 'Set up Stripe API integration', completed: false, order: 1 },
    { taskId: insertedTasks[1]?.id, title: 'Implement PayPal checkout flow', completed: false, order: 2 },
    { taskId: insertedTasks[1]?.id, title: 'Add currency conversion support', completed: false, order: 3 },
    { taskId: insertedTasks[1]?.id, title: 'Implement secure payment validation', completed: false, order: 4 },
    { taskId: insertedTasks[1]?.id, title: 'Test payment processing workflow', completed: false, order: 5 },

    // Sub-tasks for "Build expense tracking dashboard" (task 3)
    { taskId: insertedTasks[3]?.id, title: 'Create expense entry form', completed: true, order: 1 },
    { taskId: insertedTasks[3]?.id, title: 'Design category management system', completed: true, order: 2 },
    { taskId: insertedTasks[3]?.id, title: 'Implement chart visualizations', completed: false, order: 3 },
    { taskId: insertedTasks[3]?.id, title: 'Add expense filtering and search', completed: false, order: 4 },

    // Sub-tasks for "Real-time collaboration features" (task 6)
    { taskId: insertedTasks[6]?.id, title: 'Set up WebSocket server', completed: true, order: 1 },
    { taskId: insertedTasks[6]?.id, title: 'Implement real-time task updates', completed: false, order: 2 },
    { taskId: insertedTasks[6]?.id, title: 'Add live comment system', completed: false, order: 3 },
    { taskId: insertedTasks[6]?.id, title: 'Create activity feed component', completed: false, order: 4 },

    // Sub-tasks for "Multi-platform API integration" (task 10)
    { taskId: insertedTasks[10]?.id, title: 'Integrate Facebook Graph API', completed: true, order: 1 },
    { taskId: insertedTasks[10]?.id, title: 'Connect Twitter API v2', completed: false, order: 2 },
    { taskId: insertedTasks[10]?.id, title: 'Implement Instagram Basic Display API', completed: false, order: 3 },
    { taskId: insertedTasks[10]?.id, title: 'Add LinkedIn API integration', completed: false, order: 4 },
  ];

  const validSubTasks = subTasksData.filter(
    (st): st is typeof st & { taskId: number } => typeof st.taskId === 'number',
  );

  await db
    .insert(subTasksSchema)
    .values(validSubTasks);

  return insertedTasks;
}
