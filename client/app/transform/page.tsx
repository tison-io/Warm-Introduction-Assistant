import { Suspense } from "react";
import GeneratedIntroPage from "../components/Transformpage";

export default function TransformPage() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <GeneratedIntroPage />
    </Suspense>
  );
}
