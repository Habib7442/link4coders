import { Suspense } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { TemplateSelector } from '@/components/dashboard/template-selector';
import { Loader2 } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function TemplatesLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 animate-spin text-[#54E0FF]" />
    </div>
  );
}

export default function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mobile-safe-area">
        {/* Template Selector */}
        <Suspense fallback={<TemplatesLoading />}>
          <TemplateSelector />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
