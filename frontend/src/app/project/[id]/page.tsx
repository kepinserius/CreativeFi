// src/app/project/[id]/page.tsx
import { ProjectDetail } from '@/components/ProjectDetail';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <ProjectDetail projectId={params.id} />
    </div>
  );
}