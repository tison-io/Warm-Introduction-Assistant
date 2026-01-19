'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkspacePage() {
  const router = useRouter();

  useEffect(() => {
    const activeWorkspaceId = localStorage.getItem('lastWorkspaceId') || 'default';
    router.replace(`/workspace/${activeWorkspaceId}/dashboard`);
  }, [router]);

  return null;
}