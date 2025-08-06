import React from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, Users, Calendar } from 'lucide-react';
import useGitHubAvatar from '../hooks/useGitHubAvatar';

interface GitHubStatsProps {
  showAvatar?: boolean;
  avatarSize?: number;
  className?: string;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ 
  showAvatar = true, 
  avatarSize = 60,
  className = ''
}) => {
  const { userInfo, isLoading, error } = useGitHubAvatar();

  if (isLoading) {
    return (
      <div className={`animate-pulse space-y-3 ${className}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !userInfo) {
    return null;
  }

  const stats = [
    {
      icon: Github,
      label: 'Repositories',
      value: userInfo.public_repos,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Users,
      label: 'Followers',
      value: userInfo.followers,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Users,
      label: 'Following',
      value: userInfo.following,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <motion.div 
      className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h3 className="font-semibold text-gray-900 dark:text-white">GitHub Stats</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 text-center">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="space-y-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Icon className={`w-4 h-4 mx-auto ${stat.color}`} />
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Bio (if available) */}
      {userInfo.bio && (
        <motion.div 
          className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            "{userInfo.bio}"
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GitHubStats;
