'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { EnhancedDashboardContent } from '@/components/dashboard/enhanced-dashboard-content';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <EnhancedDashboardContent />
    </DashboardLayout>
  );
}