import RemindersPage from '../../../reminders/page';

export default async function Page({ params }: { params: Promise<{ workspaceId: string }> }) {
    const resolvedParams = await params;
    
    return <RemindersPage workspaceId={resolvedParams.workspaceId} />;
}