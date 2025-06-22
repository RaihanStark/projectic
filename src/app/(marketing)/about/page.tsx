export async function generateMetadata() {
  return {
    title: 'About - Projectic',
    description: 'Learn more about Projectic, the modern task management platform for teams.',
  };
}

export default function About() {
  return (
    <>
      <h1 className="text-3xl font-bold mb-6">About Projectic</h1>
      <p className="text-lg text-gray-600 mb-6">
        Projectic is a modern task management platform designed to help teams organize their work, 
        track progress, and boost productivity. Built with simplicity and efficiency in mind, 
        our platform provides all the essential features you need without the complexity.
      </p>
      
      <h2 className="text-2xl font-bold mb-4">Key Features</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-600">
        <li>Task management with urgency levels and deadlines</li>
        <li>Labels and categories for better organization</li>
        <li>Star important tasks for quick access</li>
        <li>Clean, intuitive interface</li>
        <li>Secure authentication</li>
      </ul>
    </>
  );
};
