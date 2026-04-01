let backendUrl = '';
let adminToken = '';
let currentExperienceId = null;
let currentEducationId = null;
let currentProjectId = null;

// ===== Authentication =====

function login() {
    backendUrl = document.getElementById('backendUrl').value;
    adminToken = document.getElementById('adminToken').value;

    if (!backendUrl || !adminToken) {
        showAlert('Please enter both backend URL and admin token', 'error');
        return;
    }

    localStorage.setItem('backendUrl', backendUrl);
    localStorage.setItem('adminToken', adminToken);

    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('settingsBackendUrl').value = backendUrl;

    loadAllData();
}

function logout() {
    localStorage.removeItem('backendUrl');
    localStorage.removeItem('adminToken');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    backendUrl = '';
    adminToken = '';
}

function initializeSession() {
    backendUrl = localStorage.getItem('backendUrl');
    adminToken = localStorage.getItem('adminToken');

    if (backendUrl && adminToken) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('settingsBackendUrl').value = backendUrl;
        loadAllData();
    }
}

// ===== API Calls =====

async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${backendUrl}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showAlert(`API Error: ${error.message}`, 'error');
        throw error;
    }
}

async function getPortfolioData() {
    return await apiCall('/api/portfolio');
}

// ===== Data Loading =====

async function loadAllData() {
    try {
        const data = await getPortfolioData();

        // Load Profile
        if (data.profile) {
            document.getElementById('profileName').value = data.profile.name || '';
            document.getElementById('profileTitle').value = data.profile.title || '';
            document.getElementById('profileRole').value = data.profile.role || '';
            document.getElementById('profileLocation').value = data.profile.location || '';
            document.getElementById('profileEmail').value = data.profile.email || '';
            document.getElementById('profilePhone').value = data.profile.phone || '';
            document.getElementById('profileSummary').value = data.profile.summary || '';
            document.getElementById('profileBio').value = data.profile.bio || '';
        }

        // Load Experience
        if (data.experience) {
            renderExperienceList(data.experience);
        }

        // Load Education
        if (data.education) {
            renderEducationList(data.education);
        }

        // Load Skills
        if (data.skills) {
            document.getElementById('skillsLanguages').value = (data.skills.languages || []).join(', ');
            document.getElementById('skillsFrameworks').value = (data.skills.frameworks || []).join(', ');
            document.getElementById('skillsInfrastructure').value = (data.skills.infrastructure || []).join(', ');
            document.getElementById('skillsAiMl').value = (data.skills.ai_ml || []).join(', ');
        }

        // Load Projects
        if (data.projects) {
            renderProjectsList(data.projects);
        }

        showAlert('Data loaded successfully', 'success');
    } catch (error) {
        showAlert('Failed to load data', 'error');
    }
}

// ===== Profile =====

async function saveProfile() {
    const profile = {
        name: document.getElementById('profileName').value,
        title: document.getElementById('profileTitle').value,
        role: document.getElementById('profileRole').value,
        location: document.getElementById('profileLocation').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        summary: document.getElementById('profileSummary').value,
        bio: document.getElementById('profileBio').value
    };

    try {
        await apiCall('/api/portfolio/profile', 'POST', profile);
        showAlert('Profile saved successfully', 'success');
    } catch (error) {
        showAlert('Failed to save profile', 'error');
    }
}

// ===== Experience =====

function renderExperienceList(experiences) {
    const list = document.getElementById('experienceList');
    list.innerHTML = '';

    experiences.forEach(exp => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${exp.role}</div>
                    <p style="color: #888; margin-top: 0.3rem;">${exp.company}</p>
                    <p style="color: #555; font-size: 0.85rem;">${exp.duration}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-secondary" onclick="editExperience(${exp.id})">Edit</button>
                    <button class="btn-danger" onclick="deleteExperience(${exp.id})">Delete</button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function openExperienceModal() {
    currentExperienceId = null;
    document.getElementById('experienceModalTitle').textContent = 'Add Experience';
    document.getElementById('expCompany').value = '';
    document.getElementById('expRole').value = '';
    document.getElementById('expDuration').value = '';
    document.getElementById('expLocation').value = '';
    document.getElementById('expDescription').value = '';
    document.getElementById('experienceModal').classList.add('active');
}

function closeExperienceModal() {
    document.getElementById('experienceModal').classList.remove('active');
}

async function editExperience(id) {
    const data = await getPortfolioData();
    const exp = data.experience.find(e => e.id === id);

    currentExperienceId = id;
    document.getElementById('experienceModalTitle').textContent = 'Edit Experience';
    document.getElementById('expCompany').value = exp.company;
    document.getElementById('expRole').value = exp.role;
    document.getElementById('expDuration').value = exp.duration;
    document.getElementById('expLocation').value = exp.location;
    document.getElementById('expDescription').value = exp.description || '';
    document.getElementById('experienceModal').classList.add('active');
}

async function saveExperience() {
    const experience = {
        company: document.getElementById('expCompany').value,
        role: document.getElementById('expRole').value,
        duration: document.getElementById('expDuration').value,
        location: document.getElementById('expLocation').value,
        description: document.getElementById('expDescription').value
    };

    try {
        if (currentExperienceId) {
            await apiCall(`/api/portfolio/experience/${currentExperienceId}`, 'PUT', experience);
            showAlert('Experience updated successfully', 'success');
        } else {
            await apiCall('/api/portfolio/experience/item', 'POST', experience);
            showAlert('Experience added successfully', 'success');
        }
        closeExperienceModal();
        loadAllData();
    } catch (error) {
        showAlert('Failed to save experience', 'error');
    }
}

async function deleteExperience(id) {
    if (!confirm('Are you sure you want to delete this experience?')) return;

    try {
        await apiCall(`/api/portfolio/experience/${id}`, 'DELETE');
        showAlert('Experience deleted successfully', 'success');
        loadAllData();
    } catch (error) {
        showAlert('Failed to delete experience', 'error');
    }
}

// ===== Education =====

function renderEducationList(educations) {
    const list = document.getElementById('educationList');
    list.innerHTML = '';

    educations.forEach(edu => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${edu.degree} - ${edu.field}</div>
                    <p style="color: #888; margin-top: 0.3rem;">${edu.school}</p>
                    <p style="color: #555; font-size: 0.85rem;">${edu.period}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-secondary" onclick="editEducation(${edu.id})">Edit</button>
                    <button class="btn-danger" onclick="deleteEducation(${edu.id})">Delete</button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function openEducationModal() {
    currentEducationId = null;
    document.getElementById('educationModalTitle').textContent = 'Add Education';
    document.getElementById('eduSchool').value = '';
    document.getElementById('eduDegree').value = '';
    document.getElementById('eduField').value = '';
    document.getElementById('eduPeriod').value = '';
    document.getElementById('educationModal').classList.add('active');
}

function closeEducationModal() {
    document.getElementById('educationModal').classList.remove('active');
}

async function editEducation(id) {
    const data = await getPortfolioData();
    const edu = data.education.find(e => e.id === id);

    currentEducationId = id;
    document.getElementById('educationModalTitle').textContent = 'Edit Education';
    document.getElementById('eduSchool').value = edu.school;
    document.getElementById('eduDegree').value = edu.degree;
    document.getElementById('eduField').value = edu.field;
    document.getElementById('eduPeriod').value = edu.period;
    document.getElementById('educationModal').classList.add('active');
}

async function saveEducation() {
    const education = {
        school: document.getElementById('eduSchool').value,
        degree: document.getElementById('eduDegree').value,
        field: document.getElementById('eduField').value,
        period: document.getElementById('eduPeriod').value
    };

    try {
        if (currentEducationId) {
            await apiCall(`/api/portfolio/education/${currentEducationId}`, 'PUT', education);
            showAlert('Education updated successfully', 'success');
        } else {
            await apiCall('/api/portfolio/education/item', 'POST', education);
            showAlert('Education added successfully', 'success');
        }
        closeEducationModal();
        loadAllData();
    } catch (error) {
        showAlert('Failed to save education', 'error');
    }
}

async function deleteEducation(id) {
    if (!confirm('Are you sure you want to delete this education entry?')) return;

    try {
        await apiCall(`/api/portfolio/education/${id}`, 'DELETE');
        showAlert('Education deleted successfully', 'success');
        loadAllData();
    } catch (error) {
        showAlert('Failed to delete education', 'error');
    }
}

// ===== Skills =====

async function saveSkills() {
    const skills = {
        languages: document.getElementById('skillsLanguages').value.split(',').map(s => s.trim()).filter(s => s),
        frameworks: document.getElementById('skillsFrameworks').value.split(',').map(s => s.trim()).filter(s => s),
        infrastructure: document.getElementById('skillsInfrastructure').value.split(',').map(s => s.trim()).filter(s => s),
        ai_ml: document.getElementById('skillsAiMl').value.split(',').map(s => s.trim()).filter(s => s)
    };

    try {
        await apiCall('/api/portfolio/skills', 'POST', skills);
        showAlert('Skills saved successfully', 'success');
    } catch (error) {
        showAlert('Failed to save skills', 'error');
    }
}

// ===== Projects =====

function renderProjectsList(projects) {
    const list = document.getElementById('projectsList');
    list.innerHTML = '';

    projects.forEach(proj => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div class="item-header">
                <div>
                    <div class="item-title">${proj.name}</div>
                    <p style="color: #888; margin-top: 0.3rem;">${proj.category}</p>
                    <p style="color: #555; font-size: 0.85rem; margin-top: 0.5rem;">${(proj.stack || []).join(', ')}</p>
                </div>
                <div class="item-actions">
                    <button class="btn-secondary" onclick="editProject(${proj.id})">Edit</button>
                    <button class="btn-danger" onclick="deleteProject(${proj.id})">Delete</button>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

function openProjectModal() {
    currentProjectId = null;
    document.getElementById('projectModalTitle').textContent = 'Add Project';
    document.getElementById('projName').value = '';
    document.getElementById('projCategory').value = '';
    document.getElementById('projDescription').value = '';
    document.getElementById('projStack').value = '';
    document.getElementById('projGithub').value = '';
    document.getElementById('projDemo').value = '';
    document.getElementById('projectModal').classList.add('active');
}

function closeProjectModal() {
    document.getElementById('projectModal').classList.remove('active');
}

async function editProject(id) {
    const data = await getPortfolioData();
    const proj = data.projects.find(p => p.id === id);

    currentProjectId = id;
    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    document.getElementById('projName').value = proj.name;
    document.getElementById('projCategory').value = proj.category;
    document.getElementById('projDescription').value = proj.description;
    document.getElementById('projStack').value = (proj.stack || []).join(', ');
    document.getElementById('projGithub').value = proj.links?.github || '';
    document.getElementById('projDemo').value = proj.links?.demo || '';
    document.getElementById('projectModal').classList.add('active');
}

async function saveProject() {
    const project = {
        name: document.getElementById('projName').value,
        category: document.getElementById('projCategory').value,
        description: document.getElementById('projDescription').value,
        stack: document.getElementById('projStack').value.split(',').map(s => s.trim()).filter(s => s),
        links: {
            github: document.getElementById('projGithub').value,
            demo: document.getElementById('projDemo').value
        }
    };

    try {
        if (currentProjectId) {
            await apiCall(`/api/portfolio/projects/${currentProjectId}`, 'PUT', project);
            showAlert('Project updated successfully', 'success');
        } else {
            await apiCall('/api/portfolio/projects/item', 'POST', project);
            showAlert('Project added successfully', 'success');
        }
        closeProjectModal();
        loadAllData();
    } catch (error) {
        showAlert('Failed to save project', 'error');
    }
}

async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
        await apiCall(`/api/portfolio/projects/${id}`, 'DELETE');
        showAlert('Project deleted successfully', 'success');
        loadAllData();
    } catch (error) {
        showAlert('Failed to delete project', 'error');
    }
}

// ===== UI Helpers =====

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');

    // Mark button as active
    event.target.classList.add('active');
}

function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = `alert show alert-${type}`;

    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}

async function testConnection() {
    try {
        const response = await fetch(`${backendUrl}/health`);
        if (response.ok) {
            document.getElementById('connectionStatus').innerHTML = '<span style="color: #00ff00;">✓ Connection successful</span>';
        } else {
            document.getElementById('connectionStatus').innerHTML = '<span style="color: #ff6b6b;">✗ Connection failed</span>';
        }
    } catch (error) {
        document.getElementById('connectionStatus').innerHTML = `<span style="color: #ff6b6b;">✗ Error: ${error.message}</span>`;
    }
}

// ===== GitHub Sync =====

async function validateAndLoadGitHub() {
    const username = document.getElementById('gitHubUsername').value.trim();

    if (!username) {
        showAlert('Please enter a GitHub username', 'error');
        return;
    }

    try {
        // Validate username
        const validateResponse = await fetch(`${backendUrl}/api/github/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        const validateData = await validateResponse.json();

        if (!validateData.valid) {
            showAlert('GitHub username not found. Please check and try again.', 'error');
            return;
        }

        // Get user stats
        const statsResponse = await fetch(`${backendUrl}/api/github/user/${username}`);
        const stats = await statsResponse.json();

        // Get repos list
        const reposResponse = await fetch(`${backendUrl}/api/github/repos/${username}`);
        const repos = await reposResponse.json();

        // Display stats
        document.getElementById('gitHubStats').style.display = 'block';
        document.getElementById('githubRepoCount').textContent = stats.publicRepos;
        document.getElementById('githubFollowers').textContent = stats.followers;
        document.getElementById('githubFollowing').textContent = stats.following;
        document.getElementById('githubReposToSync').textContent = repos.length;

        // Display repos preview
        displayReposPreview(repos);

        // Show sync button
        document.getElementById('syncBtn').style.display = 'inline-block';
        showAlert('GitHub profile loaded successfully!', 'success');
    } catch (error) {
        console.error('GitHub load error:', error);
        showAlert('Failed to load GitHub profile. Make sure your username is correct.', 'error');
    }
}

function displayReposPreview(repos) {
    const previewEl = document.getElementById('reposPreview');
    document.getElementById('gitHubReposList').style.display = 'block';

    previewEl.innerHTML = repos.slice(0, 10).map(repo => `
        <div style="padding: 1rem; margin-bottom: 0.5rem; background: #0a0a0a; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <p style="font-weight: 600; color: #c8ff00; margin: 0;">${repo.name}</p>
                    <p style="color: #888; font-size: 0.85rem; margin: 0.25rem 0 0;">${repo.description || 'No description'}</p>
                    <div style="margin-top: 0.5rem; display: flex; gap: 1rem; font-size: 0.8rem; color: #555;">
                        ${repo.language ? `<span>📝 ${repo.language}</span>` : ''}
                        <span>⭐ ${repo.stargazers_count}</span>
                        <span>🔀 ${repo.forks_count}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    if (repos.length > 10) {
        previewEl.innerHTML += `
            <div style="padding: 1rem; text-align: center; color: #555;">
                ... and ${repos.length - 10} more repositories
            </div>
        `;
    }
}

async function syncGitHubProjects() {
    const username = document.getElementById('gitHubUsername').value.trim();

    if (!username) {
        showAlert('Please enter a GitHub username', 'error');
        return;
    }

    if (!confirm(`Sync ${username}'s repositories to your portfolio?\n\nYour manually added projects will be preserved.`)) {
        return;
    }

    try {
        const response = await apiCall('/api/github/sync', 'POST', { username });

        showAlert(`✅ Synced ${response.count} repositories from GitHub!`, 'success');

        // Reload all data to show updated projects
        setTimeout(() => {
            loadAllData();
        }, 500);
    } catch (error) {
        showAlert('Failed to sync GitHub repositories', 'error');
    }
}

// ===== Initialize =====

window.addEventListener('DOMContentLoaded', initializeSession);
