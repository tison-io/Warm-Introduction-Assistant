export interface WorkspaceMember {
    memberId: string;
    name: string;
    email: string;
    role: 'owner' | 'member';
    joinedAt: string;
    isOnline: boolean;
    lastActive: string;
}