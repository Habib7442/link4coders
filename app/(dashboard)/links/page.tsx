'use client';

import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { LinkManager } from '@/components/dashboard/link-manager';

export default function LinksPage() {
  const handlePreviewRefresh = () => {
    // No-op since preview is removed
  };

  return (
    <DashboardLayout showPreview={false}>
      <div className="p-4 md:p-6">
        <div className="w-full mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-medium gradient-text-primary mb-2">
              Link Manager
            </h1>
            <p className="text-sm md:text-base text-gray-400">
              Organize your links by category and track their performance. Import GitHub projects automatically.
            </p>
          </div>

          {/* Link Manager Component */}
          <LinkManager onPreviewRefresh={handlePreviewRefresh} />
        </div>
      </div>
    </DashboardLayout>
  );
}
