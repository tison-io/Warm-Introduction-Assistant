import WorkspaceDashboard from "@/app/components/dashboard/WorkspaceDashboard";

export default async function Page({ params }: { params: Promise<{ workspaceId: string }> }) {
  const resolvedParams = await params; // <--- You must await this now
  
  return (
    <main>
      <WorkspaceDashboard workspaceId={resolvedParams.workspaceId} />
    </main>
  );
}