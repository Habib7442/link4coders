import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ProfileEditor } from '@/components/dashboard/profile-editor';
import { LivePreview } from '@/components/dashboard/live-preview';
import { getUserProfile } from '@/server/actions/profile.actions';

// Force dynamic rendering (no prerendering/caching)
export const dynamic = 'force-dynamic';

// Server-side function to get user profile
async function getProfileData() {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Get the current user with authenticated session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return null;
    }
    
    // Get user profile data
    const profileResult = await getUserProfile(user.id);
    
    if (!profileResult.success) {
      console.error('Error fetching profile:', profileResult.error);
      return null;
    }
    
    return profileResult.data;
  } catch (error) {
    console.error('Error in getProfileData:', error);
    return null;
  }
}

// Loading component
function ProfileLoading() {
  return (
    <DashboardLayout>
      <div className="w-full mx-auto dashboard-form-container mobile-safe-area">
        <div className="mb-4 md:mb-6">
          <div className="h-8 bg-white/10 rounded-lg w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-white/10 rounded-lg w-96 animate-pulse"></div>
        </div>
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-lg">
          <div className="space-y-6">
            <div className="h-32 bg-white/10 rounded-lg animate-pulse"></div>
            <div className="h-10 bg-white/10 rounded-lg animate-pulse"></div>
            <div className="h-10 bg-white/10 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Profile content component
async function ProfileContent() {
  const profileData = await getProfileData();
  
  // Redirect to login if user is not authenticated
  if (!profileData) {
    redirect('/login');
  }
  
  // Transform the profile data to match the component's expected structure
  const transformedProfileData = profileData ? {
    name: profileData.full_name || '',
    username: profileData.github_username || profileData.profile_slug || '',
    title: profileData.profile_title || '',
    bio: profileData.bio || '',
    avatar_url: profileData.avatar_url || '',
    github_url: profileData.github_url || '',
    linkedin_url: profileData.linkedin_url || '',
    twitter_url: profileData.twitter_username ? `https://x.com/${profileData.twitter_username}` : '',
    website_url: profileData.website_url || '',
    tech_stacks: profileData.tech_stacks || []
  } : undefined;
  
  // Create preview content
  const previewContent = (
    <LivePreview
      profileData={transformedProfileData}
    />
  );

  return (
    <DashboardLayout showPreview={true} previewContent={previewContent}>
      <div>
        <div className="w-full mx-auto dashboard-form-container mobile-safe-area">
          {/* Page Header */}
          <div className="mb-4 md:mb-6">
            <h1 className="text-[20px] md:text-[24px] lg:text-[32px] font-medium leading-[24px] md:leading-[30px] lg:leading-[40px] tracking-[-0.6px] md:tracking-[-0.72px] lg:tracking-[-0.96px] font-sharp-grotesk gradient-text-primary mb-1 md:mb-2">
              Profile Editor
            </h1>
            <p className="text-[12px] md:text-[14px] font-light leading-[16px] md:leading-[20px] tracking-[-0.36px] md:tracking-[-0.42px] text-[#7a7a83] font-sharp-grotesk">
              Customize your developer profile and make it stand out to recruiters and fellow developers.
            </p>
          </div>

          {/* Profile Editor Component */}
          <ProfileEditor initialData={transformedProfileData} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default async function ProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  );
}