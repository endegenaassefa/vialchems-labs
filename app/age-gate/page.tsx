import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AgeGateClient } from '@/components/age-gate/AgeGateClient';

export const metadata: Metadata = {
  title: 'Age Verification',
  description:
    'Confirm age and research-use eligibility before entering vialchemlabs.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AgeGatePage() {
  return (
    <Suspense fallback={null}>
      <AgeGateClient />
    </Suspense>
  );
}
