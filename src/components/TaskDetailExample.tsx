import TaskDetail from './TaskDetail';

const TaskDetailExample = () => {
  const sampleTask = {
    id: 1,
    title: 'Implement user authentication system',
    description: 'Create a comprehensive authentication system using Clerk that includes sign-in, sign-up, password reset, and social login functionality. The system should integrate seamlessly with our existing user management system and provide proper role-based access control.',
    label: 'Frontend Development',
    status: 'in-progress' as const,
    urgency: 'high' as const,
    deadline: 'March 15, 2024',
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <TaskDetail {...sampleTask} />
    </div>
  );
};

export default TaskDetailExample;
