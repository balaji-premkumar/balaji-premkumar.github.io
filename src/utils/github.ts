// GitHub API utilities
import { PERSONAL_INFO, SOCIAL_URLS } from '../constants';

export interface GitHubProfile {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  email: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  html_url: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}

/**
 * Fetch GitHub profile information
 */
export const fetchGitHubProfile = async (): Promise<GitHubProfile | null> => {
  try {
    const response = await fetch(SOCIAL_URLS.githubApi);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    return null;
  }
};

/**
 * Fetch GitHub repositories
 */
export const fetchGitHubRepos = async (limit: number = 10): Promise<GitHubRepo[]> => {
  try {
    const response = await fetch(`${SOCIAL_URLS.githubApi}/repos?sort=updated&per_page=${limit}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return [];
  }
};

/**
 * Get dynamic profile image URL with fallback options
 */
export const getProfileImageUrl = (size: number = 460): string => {
  return `https://github.com/${PERSONAL_INFO.githubUsername}.png?size=${size}`;
};

/**
 * GitHub profile image URL with different sizes
 */
export const GITHUB_PROFILE_SIZES = {
  small: getProfileImageUrl(80),
  medium: getProfileImageUrl(200),
  large: getProfileImageUrl(460),
  xlarge: getProfileImageUrl(600)
} as const;

/**
 * Dynamic GitHub stats that can be fetched
 */
export const getGitHubStats = async () => {
  const profile = await fetchGitHubProfile();
  const repos = await fetchGitHubRepos(100); // Get all repos for stats
  
  if (!profile) return null;
  
  // Calculate total stars across all repos
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  
  // Get most used languages
  const languages = repos
    .filter(repo => repo.language)
    .reduce((acc, repo) => {
      acc[repo.language] = (acc[repo.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  
  return {
    repos: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    totalStars,
    topLanguages: Object.entries(languages)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([lang, count]) => ({ language: lang, count })),
    memberSince: new Date(profile.created_at).getFullYear()
  };
};
