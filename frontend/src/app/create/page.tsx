// src/app/create/page.tsx
import { CreateProjectForm } from '@/components/CreateProjectForm';

export default function CreateProjectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Create Your Project</h1>
        <CreateProjectForm />
      </div>
    </div>
  );
}