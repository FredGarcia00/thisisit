'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EnhancedVideoCreator } from '@/components/video/enhanced-video-creator';

export default function CreateVideo() {
  return (
    <DashboardLayout>
      <EnhancedVideoCreator />
    </DashboardLayout>
  );
}