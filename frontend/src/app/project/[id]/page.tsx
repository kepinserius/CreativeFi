// src/app/project/[id]/page.tsx
import { ProjectDetail } from '@/components/ProjectDetail';

type ProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <ProjectDetail projectId={id} />
    </div>
  );
}