/**
 * Portfolio Data Loader
 * Fetches portfolio data from backend API and populates the website
 * Falls back to portfolio-data.json if backend is unavailable
 */

const DATA_LOADER = {
    backendUrl: process.env.VITE_BACKEND_URL || 'http://localhost:5000',
    localDataUrl: './portfolio-data.json',
    data: null,

    /**
     * Initialize the data loader
     */
    async init() {
        try {
            // Try to fetch from backend first
            this.data = await this.fetchFromBackend();
        } catch (error) {
            console.warn('Backend unavailable, falling back to local data:', error);
            try {
                // Fall back to local JSON file
                this.data = await this.fetchLocalData();
            } catch (fallbackError) {
                console.error('Failed to load data:', fallbackError);
                return false;
            }
        }

        // Populate the DOM with data
        this.populateDOM();
        return true;
    },

    /**
     * Fetch data from backend API
     */
    async fetchFromBackend() {
        const response = await fetch(`${this.backendUrl}/api/portfolio`);
        if (!response.ok) throw new Error('Backend request failed');
        return response.json();
    },

    /**
     * Fetch data from local JSON file
     */
    async fetchLocalData() {
        const response = await fetch(this.localDataUrl);
        if (!response.ok) throw new Error('Local data request failed');
        return response.json();
    },

    /**
     * Populate the DOM with portfolio data
     */
    populateDOM() {
        if (!this.data) return;

        this.updateProfile();
        this.updateExperience();
        this.updateEducation();
        this.updateSkills();
        this.updateProjects();
    },

    /**
     * Update profile information
     */
    updateProfile() {
        if (!this.data.profile) return;

        const profile = this.data.profile;

        // Update location
        const locationEl = document.querySelector('.hero-location span');
        if (locationEl) {
            locationEl.textContent = `Based in ${profile.location}`;
        }

        // Update email links
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            link.href = `mailto:${profile.email}`;
        });

        // Update about section
        const aboutTexts = document.querySelectorAll('.about-text');
        if (aboutTexts.length >= 2) {
            aboutTexts[0].innerHTML = profile.summary;
            aboutTexts[1].innerHTML = profile.bio;
        }
    },

    /**
     * Update experience section dynamically
     */
    updateExperience() {
        if (!this.data.experience) return;

        const experienceList = document.getElementById('experience-list') ||
                              this.createExperienceSection();

        if (!experienceList) return;

        experienceList.innerHTML = this.data.experience
            .map(exp => `
                <div class="experience-item fade-up">
                    <div class="experience-date">${exp.duration}</div>
                    <div class="experience-content">
                        <h4 class="experience-role">${exp.role}</h4>
                        <p class="experience-company">${exp.company}</p>
                        <p class="experience-location">${exp.location}</p>
                    </div>
                </div>
            `)
            .join('');
    },

    /**
     * Update education section dynamically
     */
    updateEducation() {
        if (!this.data.education) return;

        const educationList = document.getElementById('education-list') ||
                             this.createEducationSection();

        if (!educationList) return;

        educationList.innerHTML = this.data.education
            .map(edu => `
                <div class="education-item fade-up">
                    <div class="education-degree">${edu.degree} - ${edu.field}</div>
                    <p class="education-school">${edu.school}</p>
                    <p class="education-period">${edu.period}</p>
                </div>
            `)
            .join('');
    },

    /**
     * Update skills section
     */
    updateSkills() {
        if (!this.data.skills) return;

        const skills = this.data.skills;
        const skillCols = document.querySelectorAll('.skill-col');

        if (skillCols.length === 0) return;

        const skillsData = [
            { heading: 'Languages', skills: skills.languages || [] },
            { heading: 'Frameworks', skills: skills.frameworks || [] },
            { heading: 'Infrastructure', skills: skills.infrastructure || [] },
            { heading: 'AI / ML', skills: skills.ai_ml || [] }
        ];

        skillCols.forEach((col, index) => {
            if (skillsData[index]) {
                col.innerHTML = `
                    <h4 class="skill-heading">${skillsData[index].heading}</h4>
                    <div class="skill-list">
                        ${skillsData[index].skills
                            .map(skill => `<span class="skill-pill" data-splitting>${skill}</span>`)
                            .join('')}
                    </div>
                `;
            }
        });

        // Re-initialize splitting if it's loaded
        if (window.Splitting) {
            Splitting();
        }
    },

    /**
     * Update projects section
     */
    updateProjects() {
        if (!this.data.projects) return;

        const workTrack = document.getElementById('work-track');
        if (!workTrack) return;

        workTrack.innerHTML = this.data.projects
            .map(proj => `
                <article class="project-panel">
                    <div class="project-img">
                        <div class="project-img-inner" data-cursor="View" style="background: ${proj.gradient || 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)'};">
                            <span class="project-num">${proj.num}</span>
                        </div>
                    </div>
                    <div class="project-details">
                        <span class="project-cat">${proj.category}</span>
                        <h3 class="project-name" data-splitting>${proj.name}</h3>
                        <p class="project-desc">${proj.description}</p>
                        <div class="project-stack">${proj.stack.map(tech => `<span>${tech}</span>`).join('')}</div>
                        ${this.buildProjectLinks(proj.links)}
                    </div>
                </article>
            `)
            .join('');

        // Re-initialize GSAP and other animations if needed
        if (window.Splitting) {
            Splitting();
        }
    },

    /**
     * Build project links HTML
     */
    buildProjectLinks(links) {
        if (!links) return '';

        const hasMultiple = links.github && links.demo;

        if (hasMultiple) {
            return `
                <div class="project-links-row">
                    ${links.github ? `
                        <a href="${links.github}" target="_blank" class="project-cta" data-magnetic data-cursor="Open">
                            <span>Code</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                        </a>
                    ` : ''}
                    ${links.demo ? `
                        <a href="${links.demo}" target="_blank" class="project-cta" data-magnetic data-cursor="Open">
                            <span>Live Demo</span>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                        </a>
                    ` : ''}
                </div>
            `;
        }

        const link = links.github || links.demo;
        const label = links.github ? 'View Project' : 'Live Demo';

        return `
            <a href="${link}" target="_blank" class="project-cta" data-magnetic data-cursor="Open">
                <span>${label}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
            </a>
        `;
    },

    /**
     * Create experience section if it doesn't exist
     */
    createExperienceSection() {
        const experienceSection = document.getElementById('experience');
        if (experienceSection) {
            let list = document.getElementById('experience-list');
            if (!list) {
                list = document.createElement('div');
                list.id = 'experience-list';
                list.className = 'experience-timeline';
                experienceSection.appendChild(list);
            }
            return list;
        }
        return null;
    },

    /**
     * Create education section if it doesn't exist
     */
    createEducationSection() {
        const educationSection = document.getElementById('education');
        if (educationSection) {
            let list = document.getElementById('education-list');
            if (!list) {
                list = document.createElement('div');
                list.id = 'education-list';
                list.className = 'education-list';
                educationSection.appendChild(list);
            }
            return list;
        }
        return null;
    }
};

// Initialize data loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    DATA_LOADER.init();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DATA_LOADER;
}
