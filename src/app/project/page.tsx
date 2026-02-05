'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ProjectDetail } from '@/components/project-detail';

function ProjectContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  if (!id) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Proiect negăsit</h1>
          <p className="text-slate-600">ID-ul proiectului lipsește din URL.</p>
        </div>
      </div>
    );
  }

  return <ProjectDetail projectId={id} />;
}

export default function ProjectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <ProjectContent />
    </Suspense>
  );
}
