import WorkspaceDashboard from "@/app/components/dashboard/WorkspaceDashboard";

export default async function Page({ params }: { params: Promise<{ workspaceId: string }> }) {
  const resolvedParams = await params; 
  
  return (
    <main>
      <WorkspaceDashboard workspaceId={resolvedParams.workspaceId} />
    </main>
  );
}