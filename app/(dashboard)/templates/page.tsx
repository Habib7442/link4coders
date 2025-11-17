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
      <div className="w-full mx-auto dashboard-form-container mobile-safe-area">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-medium leading-[40px] tracking-[-0.96px] font-sharp-grotesk gradient-text-primary mb-2">
            Templates
          </h1>
          <p className="text-[14px] font-light leading-[20px] tracking-[-0.42px] text-[#7a7a83] font-sharp-grotesk">
            Choose a template that matches your style. Try premium templates free for 7 days!
          </p>
        </div>

        {/* Template Selector */}
        <Suspense fallback={<TemplatesLoading />}>
          <TemplateSelector />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
