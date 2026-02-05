import { ProjectDetail } from '@/components/project-detail';

// Generate static params for dynamic routes
export async function generateStaticParams(): Promise<{ id: string }[]> {
  // Return placeholder IDs for static generation
  // Actual project pages will be handled client-side
  return [
    { id: 'placeholder' }
  ];
}

export default function Page() {
  return <ProjectDetail />;
}
