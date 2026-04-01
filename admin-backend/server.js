import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { syncGitHubRepos, getGitHubUserStats, validateGitHubUsername } from './github-sync.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'your-secret-token-change-this';
const DATA_FILE = join(__dirname, '..', 'portfolio-data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

// Helper function to read portfolio data
const readPortfolioData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading portfolio data:', error);
    return null;
  }
};

// Helper function to write portfolio data
const writePortfolioData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing portfolio data:', error);
    return false;
  }
};

// ===== PUBLIC ENDPOINTS =====

// Get all portfolio data
app.get('/api/portfolio', (req, res) => {
  const data = readPortfolioData();
  if (!data) {
    return res.status(500).json({ error: 'Failed to read portfolio data' });
  }
  res.json(data);
});

// Get specific section
app.get('/api/portfolio/:section', (req, res) => {
  const { section } = req.params;
  const data = readPortfolioData();

  if (!data) {
    return res.status(500).json({ error: 'Failed to read portfolio data' });
  }

  if (!data[section]) {
    return res.status(404).json({ error: `Section '${section}' not found` });
  }

  res.json({ [section]: data[section] });
});

// ===== PROTECTED ENDPOINTS =====

// Update entire section
app.post('/api/portfolio/:section', authenticate, (req, res) => {
  const { section } = req.params;
  const data = readPortfolioData();

  if (!data) {
    return res.status(500).json({ error: 'Failed to read portfolio data' });
  }

  data[section] = req.body;

  if (writePortfolioData(data)) {
    res.json({ success: true, message: `Section '${section}' updated successfully` });
  } else {
    res.status(500).json({ error: 'Failed to update portfolio data' });
  }
});

// Update specific item in array
app.put('/api/portfolio/:section/:id', authenticate, (req, res) => {
  const { section, id } = req.params;
  const data = readPortfolioData();

  if (!data) {
    return res.status(500).json({ error: 'Failed to read portfolio data' });
  }

  if (!Array.isArray(data[section])) {
    return res.status(400).json({ error: `Section '${section}' is not an array` });
  }

  const itemIndex = data[section].findIndex(item => item.id == id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: `Item with id '${id}' not found in section '${section}'` });
  }

  data[section][itemIndex] = { ...data[section][itemIndex], ...req.body };

  if (writePortfolioData(data)) {
    res.json({ success: true, message: `Item updated successfully`, item: data[section][itemIndex] });
  } else {
    res.status(500).json({ error: 'Failed to update portfolio data' });
  }
});

// Add new item to array section
app.post('/api/portfolio/:section/item', authenticate, (req, res) => {
  const { section } = req.params;
  const data = readPortfolioData();

  if (!data) {
    return res.status(500).json({ error: 'Failed to read portfolio data' });
  }

  if (!Array.isArray(data[section])) {
    return res.status(400).json({ error: `Section '${section}' is not an array` });
  }

  // Generate new ID
  const newId = Math.max(...data[section].map(item => item.id || 0), 0) + 1;
  const newItem = { id: newId, ...req.body };

  data[section].push(newItem);

  if (writePortfolioData(data)) {
    res.json({ success: true, message: 'Item added successfully', item: newItem });
  } else {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// Delete item from array
app.delete('/api/portfolio/:section/:id', authenticate, (req, res) => {
  const { section, id } = req.params;
  const data = readPortfolioData();

  if (!data) {
    return res.status(500).json({ error: 'Failed to read portfolio data' });
  }

  if (!Array.isArray(data[section])) {
    return res.status(400).json({ error: `Section '${section}' is not an array` });
  }

  const itemIndex = data[section].findIndex(item => item.id == id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: `Item with id '${id}' not found` });
  }

  const deletedItem = data[section].splice(itemIndex, 1);

  if (writePortfolioData(data)) {
    res.json({ success: true, message: 'Item deleted successfully', item: deletedItem[0] });
  } else {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ===== GITHUB SYNC =====

// Validate GitHub username
app.post('/api/github/validate', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username required' });
  }

  try {
    const isValid = await validateGitHubUsername(username);
    res.json({ valid: isValid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate username' });
  }
});

// Get GitHub user stats
app.get('/api/github/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const stats = await getGitHubUserStats(username);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch GitHub user stats' });
  }
});

// Get GitHub repos (public)
app.get('/api/github/repos/:username', async (req, res) => {
  const { username } = req.params;

  try {
    // Simulate fetching repos - actual sync happens with POST
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=10`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Portfolio-Admin'
      }
    });

    if (!response.ok) {
      throw new Error('GitHub API error');
    }

    const repos = await response.json();
    res.json(repos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// Sync GitHub repos (protected)
app.post('/api/github/sync', authenticate, async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'GitHub username required' });
  }

  try {
    const result = await syncGitHubRepos(username);
    res.json({
      success: true,
      message: `Synced ${result.count} repositories from GitHub`,
      count: result.count,
      repos: result.repos
    });
  } catch (error) {
    console.error('GitHub sync error:', error);
    res.status(500).json({ error: 'Failed to sync GitHub repositories' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Admin backend running on http://localhost:${PORT}`);
  console.log(`Make sure to set ADMIN_TOKEN environment variable for security`);
});
