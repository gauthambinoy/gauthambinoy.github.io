/**
 * GitHub Auto-Sync Module
 * Fetches repositories from GitHub API and syncs to portfolio data
 */

import fs from 'fs';
import { join } from 'path';

const DATA_FILE = join(process.cwd(), '..', 'portfolio-data.json');

// GitHub API configuration
const GITHUB_API_URL = 'https://api.github.com';

/**
 * Fetch repositories from GitHub
 */
export async function fetchGitHubRepos(username) {
    try {
        const response = await fetch(`${GITHUB_API_URL}/users/${username}/repos?sort=stars&per_page=100`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Portfolio-Admin'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const repos = await response.json();

        return repos.map((repo, index) => ({
            id: repo.id,
            num: String(index + 1).padStart(2, '0'),
            name: repo.name,
            category: repo.language || 'Open Source',
            description: repo.description || 'A GitHub project',
            stack: buildTechStack(repo),
            gradient: generateGradient(index),
            links: {
                github: repo.html_url,
                demo: repo.homepage || null
            },
            stats: {
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                topics: repo.topics || [],
                lastUpdated: repo.updated_at
            },
            synced: true,
            syncedAt: new Date().toISOString()
        }));
    } catch (error) {
        console.error('GitHub sync error:', error);
        throw error;
    }
}

/**
 * Build tech stack from repository languages
 */
function buildTechStack(repo) {
    const stack = [];

    // Add primary language
    if (repo.language) {
        stack.push(repo.language);
    }

    // Add topics as tags
    if (repo.topics && repo.topics.length > 0) {
        // Take first 3 topics
        stack.push(...repo.topics.slice(0, 3).map(t =>
            t.charAt(0).toUpperCase() + t.slice(1)
        ));
    }

    // Common frameworks detection
    if (repo.description) {
        const desc = repo.description.toLowerCase();
        const frameworks = [];

        if (desc.includes('react') || desc.includes('reactjs')) frameworks.push('React');
        if (desc.includes('node') || desc.includes('nodejs')) frameworks.push('Node.js');
        if (desc.includes('express')) frameworks.push('Express');
        if (desc.includes('vue')) frameworks.push('Vue');
        if (desc.includes('django')) frameworks.push('Django');
        if (desc.includes('fastapi')) frameworks.push('FastAPI');
        if (desc.includes('flask')) frameworks.push('Flask');
        if (desc.includes('next')) frameworks.push('Next.js');
        if (desc.includes('typescript')) frameworks.push('TypeScript');

        stack.push(...frameworks);
    }

    // Return unique tech stack (max 5 items)
    return [...new Set(stack)].slice(0, 5);
}

/**
 * Generate gradient color based on index
 */
function generateGradient(index) {
    const gradients = [
        'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',  // Blue
        'linear-gradient(135deg, #1a0a2e, #2d1b69, #5b2c8e)',  // Purple
        'linear-gradient(135deg, #0a1628, #1a3a5c, #2980b9)',  // Ocean
        'linear-gradient(135deg, #0a2610, #1a5c2e, #27ae60)',  // Green
        'linear-gradient(135deg, #2a0845, #6a1b9a, #ad1457)',  // Magenta
        'linear-gradient(135deg, #1a0033, #4a0080, #7f00ff)',  // Indigo
    ];

    return gradients[index % gradients.length];
}

/**
 * Sync GitHub repos to portfolio data
 */
export async function syncGitHubRepos(username) {
    try {
        // Fetch repos from GitHub
        const repos = await fetchGitHubRepos(username);

        // Read current portfolio data
        let data = { projects: [] };
        try {
            const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
            data = JSON.parse(fileData);
        } catch (error) {
            console.warn('Could not read portfolio data, creating new...');
        }

        // Merge with existing projects (keep manually added ones)
        const manualProjects = (data.projects || []).filter(p => !p.synced);
        const allProjects = [...repos, ...manualProjects];

        data.projects = allProjects;
        data.lastGitHubSync = new Date().toISOString();
        data.gitHubUsername = username;

        // Write back to file
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        console.log(`✅ Synced ${repos.length} repositories from GitHub`);
        return {
            success: true,
            count: repos.length,
            repos: repos
        };
    } catch (error) {
        console.error('GitHub sync failed:', error);
        throw error;
    }
}

/**
 * Get GitHub user stats
 */
export async function getGitHubUserStats(username) {
    try {
        const response = await fetch(`${GITHUB_API_URL}/users/${username}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Portfolio-Admin'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const user = await response.json();

        return {
            username: user.login,
            name: user.name,
            bio: user.bio,
            company: user.company,
            location: user.location,
            email: user.email,
            publicRepos: user.public_repos,
            followers: user.followers,
            following: user.following,
            avatarUrl: user.avatar_url,
            profileUrl: user.html_url,
            gitHubUrl: user.html_url,
            createdAt: user.created_at
        };
    } catch (error) {
        console.error('Error fetching GitHub user stats:', error);
        throw error;
    }
}

/**
 * Validate GitHub username
 */
export async function validateGitHubUsername(username) {
    try {
        const response = await fetch(`${GITHUB_API_URL}/users/${username}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Portfolio-Admin'
            }
        });

        return response.ok;
    } catch (error) {
        return false;
    }
}
