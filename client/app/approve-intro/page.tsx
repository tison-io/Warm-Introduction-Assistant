import { Suspense } from "react";
import ApproveIntroClient from "../components/intros/ApproveIntroClient";

export default function ApproveIntroPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <ApproveIntroClient />
    </Suspense>
  );
}
