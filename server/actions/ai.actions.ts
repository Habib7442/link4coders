'use server';

import { getOpenAIClient, getAnthropicClient } from '@/lib/ai-client';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { unstable_cacheLife as cacheLife } from 'next/cache';

interface GitHubData {
  name?: string;
  login?: string;
  bio?: string;
  company?: string;
  location?: string;
  email?: string;
  blog?: string;
  repos?: Array<{
    name: string;
    description?: string;
    language?: string;
    stargazers_count: number;
    forks_count: number;
  }>;
}

interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  skills: string[];
}

// Generate AI-powered project description
export async function generateProjectDescription(projectData: {
  name: string;
  techStack: string[];
  description?: string;
}) {
  const aiClient = getOpenAIClient();
  
  const prompt = `Enhance this project description to be more recruiter-friendly:
  
  Project Name: ${projectData.name}
  Technologies: ${projectData.techStack.join(', ')}
  Current Description: ${projectData.description || 'No description provided'}
  
  Please provide:
  1. A compelling project summary (2-3 sentences)
  2. Key technical challenges and solutions
  3. Business impact or user value
  4. Metrics or achievements if applicable`;
  
  const response = await aiClient.generateText(prompt, {
    maxTokens: 500,
    temperature: 0.7
  });
  
  if (!response.success) {
    return { success: false, error: response.text };
  }
  
  return { success: true, description: response.text };
}

// Generate AI resume from GitHub data
export async function generateResumeFromGitHub(githubData: GitHubData) {
  const aiClient = getOpenAIClient();
  
  const response = await aiClient.generateResume(githubData);
  
  if (!response.success) {
    return { success: false, error: 'Failed to generate resume' };
  }
  
  return { success: true, resume: response.resume };
}

// Analyze portfolio for optimization
export async function analyzePortfolio(portfolioData: {
  name: string;
  title: string;
  bio: string;
  projects: Array<{ name: string; description: string }>;
  skills: string[];
}) {
  const aiClient = getAnthropicClient();
  
  const content = `Portfolio Analysis Request:
  
  Name: ${portfolioData.name}
  Title: ${portfolioData.title}
  Bio: ${portfolioData.bio}
  
  Projects:
  ${portfolioData.projects.map(p => `- ${p.name}: ${p.description}`).join('\n')}
  
  Skills: ${portfolioData.skills.join(', ')}`;
  
  const response = await aiClient.analyzePortfolio(content);
  
  if (!response.success) {
    return { success: false, error: 'Failed to analyze portfolio' };
  }
  
  return { success: true, analysis: response };
}

// Generate cover letter
export async function generateCoverLetter(jobData: {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  portfolioData: PortfolioData;
}) {
  const aiClient = getOpenAIClient();
  
  const prompt = `Write a personalized cover letter for the following position:
  
  Company: ${jobData.companyName}
  Position: ${jobData.jobTitle}
  Job Description: ${jobData.jobDescription}
  
  Applicant Background:
  Name: ${jobData.portfolioData.name}
  Title: ${jobData.portfolioData.title}
  Bio: ${jobData.portfolioData.bio}
  Skills: ${jobData.portfolioData.skills.join(', ')}
  
  Please write a professional, concise cover letter (3-4 paragraphs) that:
  1. Expresses interest in the position
  2. Highlights relevant skills and experience
  3. Shows enthusiasm for the company
  4. Requests an interview`;
  
  const response = await aiClient.generateText(prompt, {
    maxTokens: 800,
    temperature: 0.7
  });
  
  if (!response.success) {
    return { success: false, error: response.text };
  }
  
  return { success: true, coverLetter: response.text };
}

// Generate GitHub activity summary with caching
export async function generateGitHubSummary(githubData: GitHubData) {
  'use cache';
  cacheLife('hours');
  
  const aiClient = getOpenAIClient();
  
  const prompt = `Summarize the following GitHub activity in an engaging way for a developer portfolio:
  
  User: ${githubData.name || githubData.login}
  Repositories: ${githubData.repos?.length || 0}
  
  Top Repositories:
  ${githubData.repos?.slice(0, 5).map((repo) => `- ${repo.name}: ${repo.description || 'No description'} (${repo.stargazers_count} stars)`).join('\n') || 'No repositories found'}
  
  Please provide:
  1. A brief summary of the developer's coding activity
  2. Highlight notable projects and achievements
  3. Identify technical strengths and interests
  4. Suggest areas for growth or improvement`;
  
  const response = await aiClient.generateText(prompt, {
    maxTokens: 600,
    temperature: 0.7
  });
  
  if (!response.success) {
    return { success: false, error: response.text };
  }
  
  return { success: true, summary: response.text };
}