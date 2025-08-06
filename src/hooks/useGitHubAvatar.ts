import { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../constants/personalInfo';

interface GitHubUser {
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export const useGitHubAvatar = (size: number = 200) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<GitHubUser | null>(null);

  useEffect(() => {
    const fetchGitHubProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`https://api.github.com/users/${PERSONAL_INFO.githubUsername}`);
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const data: GitHubUser = await response.json();
        
        // GitHub API returns avatar URLs with size parameter
        const sizedAvatarUrl = `${data.avatar_url}&s=${size}`;
        
        setAvatarUrl(sizedAvatarUrl);
        setUserInfo(data);
      } catch (err) {
        console.error('Failed to fetch GitHub profile:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
        
        // Fallback to the direct GitHub avatar URL (even though it might not work)
        setAvatarUrl(`https://github.com/${PERSONAL_INFO.githubUsername}.png?size=${size}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (PERSONAL_INFO.githubUsername) {
      fetchGitHubProfile();
    } else {
      setIsLoading(false);
      setError('No GitHub username provided');
    }
  }, [size]);

  // Generate initials as fallback
  const getInitials = () => {
    return PERSONAL_INFO.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return {
    avatarUrl,
    isLoading,
    error,
    userInfo,
    initials: getInitials(),
    fallbackUrl: `https://github.com/${PERSONAL_INFO.githubUsername}.png?size=${size}`
  };
};

export default useGitHubAvatar;
