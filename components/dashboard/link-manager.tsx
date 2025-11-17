'use client';

import { useState, useEffect } from 'react';
import { Plus, Github, BarChart3, Eye, EyeOff, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import {
  getUserLinks,
  toggleLinkStatus,
  deleteLink,
  getLinkAnalytics,
  fetchGitHubRepos,
  importGitHubRepos
} from '@/server/actions/link.actions';
import { AddLinkModal } from '@/components/dashboard/add-link-modal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  category: string;
  is_active: boolean;
  click_count: number;
  metadata?: {
    type?: string;
    stars?: number;
    forks?: number;
    language?: string;
  };
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  updated_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface LinkManagerProps {
  onPreviewRefresh: () => void;
}

export function LinkManager({ onPreviewRefresh }: LinkManagerProps) {
  const { user, profile } = useAuthStore();
  const [links, setLinks] = useState<Record<string, Link[]>>({});
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<{
    totalClicks: number;
    linksByCategory: Record<string, number>;
    topLinks: Array<{ title: string; url: string; clicks: number }>;
  } | null>(null);

  // GitHub import states
  const [showGitHubImport, setShowGitHubImport] = useState(false);
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);

  // Add/Edit link states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [defaultCategory, setDefaultCategory] = useState<string | undefined>();

  // Delete dialog
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    linkId: '',
    linkTitle: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadLinks();
      loadAnalytics();
    }
  }, [user?.id]);

  const loadLinks = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const result = await getUserLinks(user.id);

      if (result.success && result.data) {
        setLinks(result.data);
      }
    } catch (error) {
      console.error('Error loading links:', error);
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    if (!user?.id) return;

    try {
      const result = await getLinkAnalytics(user.id);
      if (result.success && result.data) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const handleToggleStatus = async (linkId: string) => {
    if (!user?.id) return;

    try {
      await toggleLinkStatus(user.id, linkId);
      await loadLinks();
      onPreviewRefresh();
      toast.success('Link status updated');
    } catch (error) {
      console.error('Error toggling link status:', error);
      toast.error('Failed to update link status');
    }
  };

  const handleDeleteLink = async () => {
    if (!user?.id) return;

    try {
      await deleteLink(user.id, deleteDialog.linkId);
      await loadLinks();
      onPreviewRefresh();
      toast.success('Link deleted successfully');
      setDeleteDialog({ isOpen: false, linkId: '', linkTitle: '' });
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    }
  };

  const handleGitHubImport = async () => {
    if (!profile?.github_username) {
      toast.error('GitHub username not found in profile');
      return;
    }

    try {
      setLoadingRepos(true);
      const result = await fetchGitHubRepos(profile.github_username);

      if (result.success && result.repos) {
        setGithubRepos(result.repos);
        setShowGitHubImport(true);
      } else {
        toast.error(result.error || 'Failed to fetch GitHub repositories');
      }
    } catch (error) {
      console.error('Error fetching GitHub repos:', error);
      toast.error('Failed to fetch GitHub repositories');
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleImportSelected = async () => {
    if (!user?.id || !profile?.github_username || selectedRepos.length === 0) {
      toast.error('Please select at least one repository');
      return;
    }

    try {
      const result = await importGitHubRepos(user.id, selectedRepos, profile.github_username);

      if (result.success) {
        toast.success(`Successfully imported ${result.count} repositories`);
        setShowGitHubImport(false);
        setSelectedRepos([]);
        await loadLinks();
        onPreviewRefresh();
      } else {
        toast.error(result.error || 'Failed to import repositories');
      }
    } catch (error) {
      console.error('Error importing repos:', error);
      toast.error('Failed to import repositories');
    }
  };

  const toggleRepoSelection = (repoId: number) => {
    setSelectedRepos(prev =>
      prev.includes(repoId)
        ? prev.filter(id => id !== repoId)
        : [...prev, repoId]
    );
  };

  const handleAddLink = (category?: string) => {
    setDefaultCategory(category);
    setEditingLink(null);
    setShowAddModal(true);
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setShowAddModal(true);
  };

  const categories = [
    { key: 'personal', label: 'Personal', icon: '👤' },
    { key: 'projects', label: 'Projects', icon: '💼' },
    { key: 'blogs', label: 'Blogs', icon: '📝' },
    { key: 'achievements', label: 'Achievements', icon: '🏆' },
    { key: 'contact', label: 'Contact', icon: '📧' },
    { key: 'social', label: 'Social', icon: '🌐' }
  ];

  const totalLinks = Object.values(links).reduce((sum, categoryLinks) => sum + categoryLinks.length, 0);
  const activeLinks = Object.values(links).reduce(
    (sum, categoryLinks) => sum + categoryLinks.filter(link => link.is_active).length,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-gray-400">Loading links...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glassmorphic rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Links</p>
              <p className="text-2xl font-bold text-white mt-1">{totalLinks}</p>
            </div>
            <ExternalLink className="w-8 h-8 text-[#54E0FF]" />
          </div>
        </div>
        <div className="glassmorphic rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Links</p>
              <p className="text-2xl font-bold text-white mt-1">{activeLinks}</p>
            </div>
            <Eye className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="glassmorphic rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Clicks</p>
              <p className="text-2xl font-bold text-white mt-1">{analytics?.totalClicks || 0}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={() => handleAddLink()}
          className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] text-[#18181a] hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
        <Button
          onClick={handleGitHubImport}
          disabled={!profile?.github_username || loadingRepos}
          variant="outline"
          className="border-[#54E0FF]/20 text-[#54E0FF] hover:bg-[#54E0FF]/10"
        >
          <Github className="w-4 h-4 mr-2" />
          {loadingRepos ? 'Loading...' : 'Import from GitHub'}
        </Button>
      </div>

      {/* Links by Category */}
      <div className="space-y-4">
        {categories.map(category => {
          const categoryLinks = links[category.key] || [];

          if (categoryLinks.length === 0) return null;

          return (
            <div key={category.key} className="glassmorphic rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.label}
                  <span className="text-sm text-gray-400">({categoryLinks.length})</span>
                </h3>
                <Button
                  size="sm"
                  onClick={() => handleAddLink(category.key)}
                  className="bg-white/5 hover:bg-white/10 text-[#54E0FF] border border-[#54E0FF]/20"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {categoryLinks.map(link => (
                  <div
                    key={link.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-[#54E0FF]/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-white font-medium truncate">{link.title}</h4>
                          {link.metadata?.type === 'github_repo' && (
                            <div className="flex items-center gap-2 text-xs">
                              {link.metadata.stars !== undefined && (
                                <span className="text-yellow-400">⭐ {link.metadata.stars}</span>
                              )}
                              {link.metadata.language && (
                                <span className="text-gray-400">{link.metadata.language}</span>
                              )}
                            </div>
                          )}
                        </div>
                        {link.description && (
                          <p className="text-sm text-gray-400 truncate">{link.description}</p>
                        )}
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#54E0FF] hover:underline truncate block"
                        >
                          {link.url}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleStatus(link.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          {link.is_active ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditLink(link)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setDeleteDialog({
                              isOpen: true,
                              linkId: link.id,
                              linkTitle: link.title
                            })
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* GitHub Import Dialog */}
      <Dialog open={showGitHubImport} onOpenChange={setShowGitHubImport}>
        <DialogContent className="glassmorphic max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white">Import GitHub Repositories</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select repositories to import as project links
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {githubRepos.map(repo => (
              <div
                key={repo.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-[#54E0FF]/30 transition-all"
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedRepos.includes(repo.id)}
                    onCheckedChange={() => toggleRepoSelection(repo.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Image
                        src={repo.owner.avatar_url}
                        alt={repo.owner.login}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <h4 className="text-white font-medium">{repo.full_name}</h4>
                    </div>
                    {repo.description && (
                      <p className="text-sm text-gray-400 mb-2">{repo.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs">
                      {repo.language && (
                        <span className="text-gray-400">{repo.language}</span>
                      )}
                      <span className="text-yellow-400">⭐ {repo.stars}</span>
                      <span className="text-gray-400">🍴 {repo.forks}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => {
                setShowGitHubImport(false);
                setSelectedRepos([]);
              }}
              className="border-white/20 text-gray-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImportSelected}
              disabled={selectedRepos.length === 0}
              className="bg-gradient-to-r from-[#54E0FF] to-[#29ADFF] text-[#18181a] hover:opacity-90"
            >
              Import {selectedRepos.length} {selectedRepos.length === 1 ? 'Repository' : 'Repositories'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Link Modal */}
      <AddLinkModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingLink(null);
          setDefaultCategory(undefined);
        }}
        onSuccess={async () => {
          await loadLinks();
          onPreviewRefresh();
        }}
        userId={user!.id}
        editLink={editingLink}
        defaultCategory={defaultCategory}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) => !open && setDeleteDialog({ isOpen: false, linkId: '', linkTitle: '' })}>
        <AlertDialogContent className="glassmorphic">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Link</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete &quot;{deleteDialog.linkTitle}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-gray-400 hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLink}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
