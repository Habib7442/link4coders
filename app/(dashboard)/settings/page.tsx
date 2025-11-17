'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuthStore } from '@/stores/useAuthStore';
import { getUserProfile, updateUserProfile } from '@/server/actions/profile.actions';
import { toast } from 'sonner';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield,
  Trash2,
  Save,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { createClient } from '@/lib/supabase-client';

export default function SettingsPage() {
  const { user, profile, logout, setProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    showGithubContributions: true,
    profilePublic: true
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (user) {
      setAccountSettings(prev => ({
        ...prev,
        email: user.email || ''
      }));
    }
    if (profile) {
      const p = profile as unknown as Record<string, unknown>;
      setPrivacySettings(prev => ({
        ...prev,
        showGithubContributions: (p.show_github_contributions as boolean) !== false,
        profilePublic: (p.profile_public as boolean) !== false
      }));
    }
  }, [user, profile]);

  const handleSaveAccount = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Validate passwords if changing
      if (accountSettings.newPassword) {
        if (!accountSettings.currentPassword) {
          toast.error('Please enter your current password');
          setLoading(false);
          return;
        }
        if (accountSettings.newPassword !== accountSettings.confirmPassword) {
          toast.error('New passwords do not match');
          setLoading(false);
          return;
        }
        if (accountSettings.newPassword.length < 6) {
          toast.error('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        // Update password using Supabase Auth
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({
          password: accountSettings.newPassword
        });

        if (error) {
          toast.error(error.message);
          setLoading(false);
          return;
        }

        toast.success('Password updated successfully');
      } else {
        toast.info('No changes to save');
      }
      
      // Clear password fields
      setAccountSettings(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const result = await updateUserProfile(user.id, {
        show_github_contributions: privacySettings.showGithubContributions,
        profile_public: privacySettings.profilePublic
      });

      if (result.success) {
        // Update local store
        if (result.data && setProfile) {
          setProfile(result.data);
        }
        toast.success('Privacy settings saved successfully');
      } else {
        toast.error(result.error || 'Failed to save privacy settings');
      }
    } catch (error) {
      toast.error('Failed to save privacy settings');
    } finally {
      setLoading(false);
    }
  };



  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    
    try {
      const supabase = createClient();
      
      // Delete user account
      const { error } = await supabase.rpc('delete_user_account', {
        user_id: user.id
      });

      if (error) {
        toast.error('Failed to delete account: ' + error.message);
        return;
      }

      toast.success('Account deleted successfully');
      await logout();
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-2 md:gap-3">
            <SettingsIcon className="w-6 h-6 md:w-8 md:h-8 text-[#54E0FF]" />
            Settings
          </h1>
          <p className="text-sm md:text-base text-gray-400">Manage your account preferences and settings</p>
        </div>

        {/* Account Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-white flex items-center gap-2">
              <User className="w-4 h-4 md:w-5 md:h-5 text-[#54E0FF]" />
              Account Settings
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Update your account information and password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email */}
            <div>
              <Label className="text-white text-sm md:text-base">Email Address</Label>
              <Input
                type="email"
                value={accountSettings.email}
                onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })}
                className="bg-white/5 border-white/10 text-white mt-1"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Password Change Section */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-white font-medium mb-4 text-sm md:text-base">Change Password</h3>
              
              <div className="space-y-4">
                {/* Current Password */}
                <div>
                  <Label className="text-white text-sm md:text-base">Current Password</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showPassword.current ? 'text' : 'password'}
                      value={accountSettings.currentPassword}
                      onChange={(e) => setAccountSettings({ ...accountSettings, currentPassword: e.target.value })}
                      className="bg-white/5 border-white/10 text-white pr-10"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <Label className="text-white text-sm md:text-base">New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showPassword.new ? 'text' : 'password'}
                      value={accountSettings.newPassword}
                      onChange={(e) => setAccountSettings({ ...accountSettings, newPassword: e.target.value })}
                      className="bg-white/5 border-white/10 text-white pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label className="text-white text-sm md:text-base">Confirm New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      type={showPassword.confirm ? 'text' : 'password'}
                      value={accountSettings.confirmPassword}
                      onChange={(e) => setAccountSettings({ ...accountSettings, confirmPassword: e.target.value })}
                      className="bg-white/5 border-white/10 text-white pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSaveAccount}
              disabled={loading}
              className="w-full md:w-auto bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] text-[#18181a] hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Account Settings
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-white flex items-center gap-2">
              <Shield className="w-4 h-4 md:w-5 md:h-5 text-[#54E0FF]" />
              Privacy Settings
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Control your profile visibility and data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profile Visibility */}
            <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-white/5">
              <div className="flex-1">
                <Label className="text-white text-sm md:text-base">Public Profile</Label>
                <p className="text-xs md:text-sm text-gray-400 mt-1">Make your profile visible to everyone</p>
              </div>
              <Switch
                checked={privacySettings.profilePublic}
                onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, profilePublic: checked })}
              />
            </div>

            {/* Show GitHub Contributions */}
            <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-white/5">
              <div className="flex-1">
                <Label className="text-white text-sm md:text-base">Show GitHub Contributions</Label>
                <p className="text-xs md:text-sm text-gray-400 mt-1">Display your GitHub contribution graph on your profile</p>
              </div>
              <Switch
                checked={privacySettings.showGithubContributions}
                onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, showGithubContributions: checked })}
              />
            </div>

            <Button
              onClick={handleSavePrivacy}
              disabled={loading}
              className="w-full md:w-auto bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] text-[#18181a] hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Privacy Settings
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-500/10 border-red-500/30">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl text-red-400 flex items-center gap-2">
              <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-xs md:text-sm text-red-300">Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 md:p-4 rounded-lg bg-white/5 border border-red-500/20">
              <h3 className="text-white font-medium mb-2 text-sm md:text-base">Delete Account</h3>
              <p className="text-xs md:text-sm text-gray-400 mb-4">
                Once you delete your account, there is no going back. All your data, including links, analytics, and profile information will be permanently deleted.
              </p>
              <Button
                onClick={() => setShowDeleteDialog(true)}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="bg-[#1e1e20] border-red-500/30">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}
