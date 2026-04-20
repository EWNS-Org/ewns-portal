'use client';

import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/common/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userRole } = useAuth();

  return <Sidebar userRole={userRole}>{children}</Sidebar>;
}
