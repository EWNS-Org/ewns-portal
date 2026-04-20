'use client';

import Sidebar from '@/components/common/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Sidebar userRole="ADMIN">{children}</Sidebar>;
}
