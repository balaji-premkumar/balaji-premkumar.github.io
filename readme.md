# Portfolio Configuration Guide

## 🚀 Easy Customization

This portfolio is designed to be easily customizable by updating just a few constants files. No need to hunt through components for hardcoded values!

## 📁 Configuration Files

### `src/constants/personalInfo.ts`
**Main personal information - Update this first!**

```typescript
export const PERSONAL_INFO = {
  name: 'Your Full Name',
  title: 'Your Job Title',
  subtitle: 'Your Professional Subtitle',
  location: 'Your City, Country',
  email: 'your.email@domain.com',          // ← Update with your real email
  githubUsername: 'your-github-username',   // ← Update with your GitHub username
  yearsOfExperience: 'X+',
  description: 'Your professional description...',
  status: 'Available for work', // or 'Currently employed', etc.
  statusMessage: 'Your current status message'
};
```

**Everything else is automatically generated from your `githubUsername`:**
- GitHub Profile URL: `https://github.com/{githubUsername}`
- Profile Picture: `https://github.com/{githubUsername}.png`
- GitHub API: `https://api.github.com/users/{githubUsername}`

### `src/constants/experience.ts`
Add your work experience:

```typescript
export const EXPERIENCES = [
  {
    company: 'Company Name',
    position: 'Your Position',
    period: 'Start Date - End Date',
    location: 'City, Country',
    description: 'What you did...',
    technologies: ['Tech1', 'Tech2'],
    achievements: ['Achievement 1', 'Achievement 2']
  }
];
```

### `src/constants/skills.ts`
Update your technical skills:

```typescript
export const SKILLS_DATA = {
  backend: {
    title: "Backend Technologies",
    skills: [
      { name: "Technology Name", level: 90, years: 5, icon: "code" }
    ]
  }
};
```

### `src/constants/projects.ts`
Showcase your projects:

```typescript
export const PROJECTS = [
  {
    title: 'Project Name',
    description: 'Project description...',
    technologies: ['React', 'Node.js'],
    category: 'Web Application',
    links: {
      github: 'https://github.com/username/repo',
      demo: 'https://demo-url.com'
    }
  }
];
```

## 🖼️ GitHub Profile Picture

Your GitHub profile picture is automatically fetched using GitHub's API for maximum reliability:

- **API Endpoint**: `https://api.github.com/users/{username}`
- **Automatic Sizing**: Dynamic size parameter support
- **Smart Fallbacks**: 
  1. First tries GitHub API for avatar_url
  2. Falls back to direct GitHub image URL if API fails
  3. Shows your initials if both methods fail
- **Loading States**: Smooth loading animations and placeholders
- **Real-time Updates**: Always shows your latest GitHub profile picture

### Benefits over Direct URL:
✅ **More Reliable**: GitHub API is more stable than direct image URLs  
✅ **Better Error Handling**: Multiple fallback strategies  
✅ **Loading States**: Professional loading animations  
✅ **Size Optimization**: Dynamic sizing based on component needs  
✅ **Auto-Updates**: Always shows your latest profile picture

## 🔗 Dynamic Links

All social links are automatically generated from your `githubUsername` and `email`:

```typescript
// Automatically generated:
export const SOCIAL_URLS = {
  github: `https://github.com/${PERSONAL_INFO.githubUsername}`,
  githubApi: `https://api.github.com/users/${PERSONAL_INFO.githubUsername}`,
  emailLink: `mailto:${PERSONAL_INFO.email}`
};

// GitHub profile picture is fetched dynamically via the GitHub API
// for better reliability and automatic updates
```

## 📊 GitHub Stats (Optional Feature)

The portfolio includes utilities to fetch live GitHub data:

### Available Data:
- Public repositories count
- Followers/following count
- Total stars across all repos
- Most used programming languages
- Member since year

### Usage:
```typescript
import { getGitHubStats, fetchGitHubProfile } from './utils/github';

// Fetch live GitHub stats
const stats = await getGitHubStats();
console.log(stats);
// Output: { repos: 42, followers: 123, totalStars: 456, ... }
```

## 🎨 Customization Steps

1. **Update Personal Info**: Edit `src/constants/personalInfo.ts`
   - Change `githubUsername` to your GitHub username
   - Update `email` to your real email address
   - Modify name, title, location, etc.

2. **Add Your Experience**: Edit `src/constants/experience.ts`
   - Add your work experience
   - Include education details
   - Highlight career achievements

3. **Update Skills**: Edit `src/constants/skills.ts`
   - Add technologies you know
   - Set skill levels (0-100)
   - Organize by categories

4. **Showcase Projects**: Edit `src/constants/projects.ts`
   - Add your best projects
   - Include GitHub links and demos
   - Categorize projects

5. **Optional - Enable Live GitHub Stats**: 
   - Use the GitHub utils to fetch live data
   - Display real-time repository and follower counts

## 🔧 Advanced GitHub Features

### Custom Profile Picture Sizes:
```typescript
import { GITHUB_PROFILE_SIZES } from './utils/github';

// Available sizes:
GITHUB_PROFILE_SIZES.small    // 80px
GITHUB_PROFILE_SIZES.medium   // 200px  
GITHUB_PROFILE_SIZES.large    // 460px
GITHUB_PROFILE_SIZES.xlarge   // 600px
```

### Fetch Live Repository Data:
```typescript
import { fetchGitHubRepos } from './utils/github';

const repos = await fetchGitHubRepos(10); // Get latest 10 repos
console.log(repos); // Array of repository objects with stars, forks, etc.
```

## 🌟 Benefits of This Approach

✅ **Single Source of Truth**: Update username in one place, everything else updates  
✅ **No Hardcoded URLs**: All links generated dynamically  
✅ **GitHub Integration**: Automatic profile picture and optional live stats  
✅ **Type Safety**: Full TypeScript support with interfaces  
✅ **Easy Maintenance**: Add new experience/projects in organized constants  
✅ **SEO Optimized**: Meta tags automatically use your information  

## 🚀 Deployment

The portfolio is configured for GitHub Pages deployment:

```bash
npm run deploy
```

Your portfolio will be available at: `https://{your-username}.github.io/portfolio`

---

**Need Help?** Check the `src/utils/github.ts` file for additional GitHub integration utilities!
