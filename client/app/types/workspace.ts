export interface WorkspaceMember {
    memberId: string;
    name: string;
    email: string;
    role: 'owner' | 'member';
    joinedAt: string;
    isOnline: boolean;
    lastActive: string;
}

export interface Workspace {
    _id: string;
    name: string;
    slug: string;
    ownerId: string;
    members: WorkspaceMember[];
    blurb: string;
    createdAt: string;
}