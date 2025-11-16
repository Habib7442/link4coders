import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { ProfileEditor } from '@/components/dashboard/profile-editor';
import { LivePreview } from '@/components/dashboard/live-preview';
import { getUserProfile } from '@/server/actions/profile.actions';

// Cache the profile data for 60 seconds
export const revalidate = 60;

// Server-side function to get user profile with caching
async function getProfileData() {
  // Get the session from cookies
  const cookieStore = cookies();
  const supabase = await createServerSupabaseClient();
  
  // Get the current user
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }
  
  // Get user profile data
  const profileResult = await getUserProfile(session.user.id);
  
  if (!profileResult.success) {
    console.error('Error fetching profile:', profileResult.error);
    return null;
  }
  
  return profileResult.data;
}

export default async function ProfilePage() {
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
    twitter_url: profileData.twitter_username ? `https://twitter.com/${profileData.twitter_username}` : '',
    website_url: profileData.website_url || ''
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