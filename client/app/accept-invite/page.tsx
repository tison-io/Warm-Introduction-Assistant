'use client';

import { Suspense } from 'react';
import InviteDetails from './InviteDetails';

export default function AcceptInvitePage() {

  return (
    <section>
      <Suspense fallback={<div>Loading invite...</div>}>
        <InviteDetails />
      </Suspense>
    </section>
  );
}