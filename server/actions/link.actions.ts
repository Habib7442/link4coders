'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';

// GitHub API types
interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface GitHubUserStats {
  public_repos: number;
  total_stars: number;
  total_forks: number;
  languages: Record<string, number>;
  contributions: number;
}

// Fetch user's GitHub repositories
export async function fetchGitHubRepos(githubUsername: string) {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Link4Coders/1.0'
    };

    // Add token if available
    const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
    }

    // Fetch repositories
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'GitHub user not found' };
      }
      if (response.status === 403) {
        return { success: false, error: 'GitHub API rate limit exceeded' };
      }
      return { success: false, error: 'Failed to fetch GitHub repositories' };
    }

    const repos: GitHubRepo[] = await response.json();

    return {
      success: true,
      repos: repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated_at: repo.updated_at,
        topics: repo.topics || [],
        owner: repo.owner
      }))
    };
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return { success: false, error: 'Failed to fetch GitHub repositories' };
  }
}

// Fetch GitHub user statistics
export async function fetchGitHubStats(githubUsername: string) {
  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Link4Coders/1.0'
    };

    const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`;
    }

    // Fetch user data
    const userResponse = await fetch(
      `https://api.github.com/users/${githubUsername}`,
      { headers }
    );

    if (!userResponse.ok) {
      return { success: false, error: 'Failed to fetch GitHub user data' };
    }

    const userData = await userResponse.json();

    // Fetch repositories for stats
    const reposResponse = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?per_page=100`,
      { headers }
    );

    const repos: GitHubRepo[] = reposResponse.ok ? await reposResponse.json() : [];

    // Calculate stats
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
    const languages: Record<string, number> = {};

    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    const stats: GitHubUserStats = {
      public_repos: userData.public_repos || 0,
      total_stars: totalStars,
      total_forks: totalForks,
      languages,
      contributions: 0 // Would need separate API call or scraping
    };

    return { success: true, stats };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return { success: false, error: 'Failed to fetch GitHub statistics' };
  }
}

// Import selected GitHub repos as links
export async function importGitHubRepos(userId: string, repoIds: number[], githubUsername: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Fetch repos from GitHub
    const { success, repos, error } = await fetchGitHubRepos(githubUsername);
    
    if (!success || !repos) {
      return { success: false, error };
    }

    // Filter selected repos
    const selectedRepos = repos.filter(repo => repoIds.includes(repo.id));

    // Get current max position for projects category
    const { data: existingLinks } = await supabase
      .from('user_links')
      .select('position')
      .eq('user_id', userId)
      .eq('category', 'projects')
      .order('position', { ascending: false })
      .limit(1);

    const startPosition = existingLinks?.[0]?.position || 0;

    // Insert repos as links
    const linksToInsert = selectedRepos.map((repo, index) => ({
      user_id: userId,
      title: repo.name,
      url: repo.url,
      description: repo.description || `GitHub repository: ${repo.name}`,
      icon_type: 'github',
      category: 'projects',
      position: startPosition + index + 1,
      is_active: true,
      metadata: {
        type: 'github_repo',
        repo_name: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stars,
        forks: repo.forks,
        topics: repo.topics,
        updated_at: repo.updated_at,
        avatar_url: repo.owner.avatar_url,
        owner: {
          login: repo.owner.login,
          avatar_url: repo.owner.avatar_url
        },
        homepage: repo.homepage
      },
      live_project_url: repo.homepage || null,
      platform_detected: 'github',
      icon_selection_type: 'platform'
    }));

    const { data, error: insertError } = await supabase
      .from('user_links')
      .insert(linksToInsert)
      .select();

    if (insertError) {
      console.error('Error importing GitHub repos:', insertError);
      return { success: false, error: 'Failed to import repositories' };
    }

    return { success: true, data, count: linksToInsert.length };
  } catch (error) {
    console.error('Error importing GitHub repos:', error);
    return { success: false, error: 'Failed to import repositories' };
  }
}

// Get user's links
export async function getUserLinks(userId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('user_links')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching user links:', error);
      return { success: false, error: error.message };
    }

    // Group by category
    const groupedLinks = data.reduce((acc, link) => {
      const category = link.category || 'custom';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(link);
      return acc;
    }, {} as Record<string, typeof data>);

    return { success: true, data: groupedLinks };
  } catch (error) {
    console.error('Error fetching user links:', error);
    return { success: false, error: 'Failed to fetch links' };
  }
}

// Toggle link status
export async function toggleLinkStatus(userId: string, linkId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current status
    const { data: link } = await supabase
      .from('user_links')
      .select('is_active')
      .eq('id', linkId)
      .eq('user_id', userId)
      .single();

    if (!link) {
      return { success: false, error: 'Link not found' };
    }

    // Toggle status
    const { error } = await supabase
      .from('user_links')
      .update({ is_active: !link.is_active })
      .eq('id', linkId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error toggling link status:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error toggling link status:', error);
    return { success: false, error: 'Failed to toggle link status' };
  }
}

// Delete link
export async function deleteLink(userId: string, linkId: string) {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase
      .from('user_links')
      .delete()
      .eq('id', linkId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting link:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting link:', error);
    return { success: false, error: 'Failed to delete link' };
  }
}

// Get link analytics
export async function getLinkAnalytics(userId: string) {
  console.log('📊 [getLinkAnalytics] Fetching analytics for user:', userId);
  
  try {
    const supabase = await createServerSupabaseClient();

    const { data: links } = await supabase
      .from('user_links')
      .select('id, title, url, category, click_count')
      .eq('user_id', userId);

    console.log('📊 [getLinkAnalytics] Fetched links:', links?.length || 0);
    console.log('📊 [getLinkAnalytics] Links data:', links?.map(l => ({ title: l.title, clicks: l.click_count })));

    if (!links) {
      return { success: true, data: null };
    }

    const totalClicks = links.reduce((sum, link) => sum + (link.click_count || 0), 0);
    console.log('📊 [getLinkAnalytics] Total clicks calculated:', totalClicks);
    
    const linksByCategory = links.reduce((acc, link) => {
      const category = link.category || 'custom';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topLinks = links
      .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
      .slice(0, 5)
      .map(link => ({
        title: link.title,
        url: link.url,
        clicks: link.click_count || 0
      }));

    return {
      success: true,
      data: {
        totalClicks,
        linksByCategory,
        topLinks
      }
    };
  } catch (error) {
    console.error('Error fetching link analytics:', error);
    return { success: false, error: 'Failed to fetch analytics' };
  }
}

// Create new link
export async function createLink(
  userId: string,
  linkData: {
    title: string;
    url: string;
    description?: string;
    category: string;
    icon_type?: string;
    live_project_url?: string;
    link_image?: string;
  }
) {
  try {
    const supabase = await createServerSupabaseClient();

    // Get current max position for this category
    const { data: existingLinks } = await supabase
      .from('user_links')
      .select('position')
      .eq('user_id', userId)
      .eq('category', linkData.category)
      .order('position', { ascending: false })
      .limit(1);

    const position = existingLinks?.[0]?.position ? existingLinks[0].position + 1 : 0;

    const { data, error } = await supabase
      .from('user_links')
      .insert({
        user_id: userId,
        title: linkData.title,
        url: linkData.url,
        description: linkData.description,
        category: linkData.category,
        icon_type: linkData.icon_type || 'link',
        live_project_url: linkData.live_project_url,
        link_image: linkData.link_image,
        position,
        is_active: true,
        click_count: 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating link:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating link:', error);
    return { success: false, error: 'Failed to create link' };
  }
}

// Update existing link
export async function updateLink(
  userId: string,
  linkId: string,
  linkData: {
    title?: string;
    url?: string;
    description?: string;
    category?: string;
    icon_type?: string;
    live_project_url?: string;
    link_image?: string | null;
  }
) {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('user_links')
      .update({
        ...linkData,
        updated_at: new Date().toISOString()
      })
      .eq('id', linkId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating link:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error updating link:', error);
    return { success: false, error: 'Failed to update link' };
  }
}
