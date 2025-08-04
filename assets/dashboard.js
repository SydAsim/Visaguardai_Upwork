// Dashboard functionality

class Dashboard {
    constructor() {
        this.currentUser = null;
        this.connectedAccounts = {
            instagram: false,
            tiktok: false,
            linkedin: false,
            twitter: false
        };
        this.analysisData = null;
        
        this.init();
    }
    
    init() {
        // Check authentication
        if (!authManager.requireAuth()) return;
        
        // Load user data
        this.loadUserData();
        this.bindEvents();
        this.showSection('home');
    }
    
    loadUserData() {
        this.currentUser = authManager.getCurrentUser();
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        // Update UI with user data
        this.updateUserProfile();
        this.loadConnectedAccounts();
    }
    
    updateUserProfile() {
        const userEmail = document.getElementById('user-email');
        const userAvatar = document.getElementById('user-avatar');
        const userStatus = document.getElementById('user-status');
        const settingsEmail = document.getElementById('settings-email');
        
        if (userEmail) userEmail.textContent = this.currentUser.email;
        if (settingsEmail) settingsEmail.value = this.currentUser.email;
        
        if (userAvatar) {
            const initials = this.currentUser.email.substring(0, 2).toUpperCase();
            userAvatar.textContent = initials;
        }
        
        if (userStatus) {
            userStatus.textContent = this.currentUser.isPaid ? 'Premium User' : 'Free Trial';
        }
        
        // Load profile form data
        if (this.currentUser.profile) {
            const nameField = document.getElementById('user-name');
            const countryField = document.getElementById('user-country');
            const universityField = document.getElementById('user-university');
            
            if (nameField) nameField.value = this.currentUser.profile.name || '';
            if (countryField) countryField.value = this.currentUser.profile.country || '';
            if (universityField) universityField.value = this.currentUser.profile.university || '';
        }
    }
    
    loadConnectedAccounts() {
        if (this.currentUser.connectedAccounts) {
            this.connectedAccounts = { ...this.currentUser.connectedAccounts };
        }
        
        // Update UI for connected accounts
        Object.keys(this.connectedAccounts).forEach(platform => {
            const button = document.querySelector(`[data-platform="${platform}"]`);
            if (button) {
                const statusSpan = button.querySelector('span:last-child');
                if (this.connectedAccounts[platform]) {
                    button.className = button.className.replace('border-dashed border-gray-300 dark:border-gray-600', 'border-solid border-green-500 bg-green-50 dark:bg-green-900/20');
                    if (statusSpan) statusSpan.textContent = 'Connected';
                    if (statusSpan) statusSpan.className = 'text-xs text-green-600 dark:text-green-400 mt-1';
                }
            }
        });
        
        this.updateStartAnalysisButton();
    }
    
    updateStartAnalysisButton() {
        const startButton = document.getElementById('start-analysis-btn');
        if (!startButton) return;
        
        const connectedCount = Object.values(this.connectedAccounts).filter(Boolean).length;
        
        if (connectedCount > 0) {
            startButton.disabled = false;
            startButton.textContent = `Start Visa Risk Analysis (${connectedCount} platform${connectedCount > 1 ? 's' : ''})`;
        } else {
            startButton.disabled = true;
            startButton.textContent = 'Connect at least one platform to start';
        }
    }
    
    bindEvents() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                // Implementation for mobile menu
            });
        }
        
        // Navigation menu
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });
        
        // Logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                authManager.logout();
                window.location.href = 'index.html';
            });
        }
    }
    
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('bg-primary-100', 'text-primary-700', 'dark:bg-primary-900', 'dark:text-primary-300');
            item.classList.add('text-gray-700', 'dark:text-gray-300');
        });
        
        const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeNav) {
            activeNav.classList.add('bg-primary-100', 'text-primary-700', 'dark:bg-primary-900', 'dark:text-primary-300');
            activeNav.classList.remove('text-gray-700', 'dark:text-gray-300');
        }
    }
    
    connectAccount(platform) {
        // Simulate account connection
        showMessage(`Connecting to ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`, 'info');
        
        setTimeout(() => {
            this.connectedAccounts[platform] = true;
            
            // Update user data
            authManager.updateUser({
                connectedAccounts: this.connectedAccounts
            });
            
            // Update UI
            const button = document.querySelector(`[data-platform="${platform}"]`);
            if (button) {
                button.className = button.className.replace('border-dashed border-gray-300 dark:border-gray-600', 'border-solid border-green-500 bg-green-50 dark:bg-green-900/20');
                const statusSpan = button.querySelector('span:last-child');
                if (statusSpan) {
                    statusSpan.textContent = 'Connected';
                    statusSpan.className = 'text-xs text-green-600 dark:text-green-400 mt-1';
                }
            }
            
            this.updateStartAnalysisButton();
            showMessage(`${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully!`, 'success');
        }, 1500);
    }
    
    startAnalysis() {
        const connectedCount = Object.values(this.connectedAccounts).filter(Boolean).length;
        if (connectedCount === 0) {
            showMessage('Please connect at least one social media platform', 'error');
            return;
        }
        
        // Show loading modal
        this.showLoadingModal();
        
        // Simulate analysis process
        this.runAnalysisSimulation();
    }
    
    showLoadingModal() {
        const modal = document.getElementById('loading-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    hideLoadingModal() {
        const modal = document.getElementById('loading-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    runAnalysisSimulation() {
        const messages = [
            "Connecting to platforms...",
            "Analyzing Instagram posts...",
            "Scanning TikTok content...",
            "Reviewing LinkedIn profile...",
            "Examining Twitter activity...",
            "Processing image content...",
            "Analyzing language patterns...",
            "Checking location data...",
            "Compiling risk assessment...",
            "Generating recommendations..."
        ];
        
        let currentMessage = 0;
        let progress = 0;
        
        const updateProgress = () => {
            const messageElement = document.getElementById('loading-message');
            const progressBar = document.getElementById('progress-bar');
            
            if (messageElement && currentMessage < messages.length) {
                messageElement.textContent = messages[currentMessage];
            }
            
            if (progressBar) {
                progress += 10;
                progressBar.style.width = `${Math.min(progress, 100)}%`;
            }
            
            currentMessage++;
            
            if (currentMessage <= messages.length) {
                setTimeout(updateProgress, 800);
            } else {
                // Analysis complete
                setTimeout(() => {
                    this.hideLoadingModal();
                    this.showAnalysisResults();
                }, 1000);
            }
        };
        
        updateProgress();
    }
    
    showAnalysisResults() {
        // Generate mock analysis data
        this.generateAnalysisData();
        
        // Show results section
        const resultsSection = document.getElementById('analysis-results');
        if (resultsSection) {
            resultsSection.classList.remove('hidden');
        }
        
        // Show appropriate results based on payment status
        if (this.currentUser.isPaid) {
            this.showFullResults();
        } else {
            this.showFreeTrialResults();
        }
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        showMessage('Analysis complete! Review your results below.', 'success');
    }
    
    generateAnalysisData() {
        const platforms = Object.keys(this.connectedAccounts).filter(p => this.connectedAccounts[p]);
        
        this.analysisData = {
            overallRisk: Math.floor(Math.random() * 30) + 10, // 10-40% risk
            approvalChance: Math.floor(Math.random() * 20) + 75, // 75-95% approval
            postsAnalyzed: Math.floor(Math.random() * 500) + 300,
            flaggedItems: Math.floor(Math.random() * 5) + 1,
            platforms: platforms.map(platform => ({
                name: platform,
                risk: Math.floor(Math.random() * 60) + 10,
                posts: Math.floor(Math.random() * 200) + 50
            })),
            categories: [
                { name: 'Political Content', risk: Math.floor(Math.random() * 30) + 5 },
                { name: 'Language Issues', risk: Math.floor(Math.random() * 25) + 10 },
                { name: 'Location Concerns', risk: Math.floor(Math.random() * 20) + 5 },
                { name: 'Professional Image', risk: Math.floor(Math.random() * 35) + 15 },
                { name: 'Cultural Sensitivity', risk: Math.floor(Math.random() * 40) + 10 }
            ],
            flaggedContent: [
                {
                    platform: 'Instagram',
                    content: 'Post about political rally attendance',
                    risk: 'Medium',
                    date: '2024-12-15'
                },
                {
                    platform: 'Twitter',
                    content: 'Tweet with strong political opinion',
                    risk: 'High',
                    date: '2024-12-10'
                },
                {
                    platform: 'LinkedIn',
                    content: 'Comment on controversial topic',
                    risk: 'Low',
                    date: '2024-12-08'
                }
            ]
        };
    }
    
    showFreeTrialResults() {
        const freeResults = document.getElementById('free-trial-results');
        const fullResults = document.getElementById('full-results');
        
        if (freeResults) freeResults.classList.remove('hidden');
        if (fullResults) fullResults.classList.add('hidden');
    }
    
    showFullResults() {
        const freeResults = document.getElementById('free-trial-results');
        const fullResults = document.getElementById('full-results');
        
        if (freeResults) freeResults.classList.add('hidden');
        if (fullResults) fullResults.classList.remove('hidden');
        
        this.populateFullResults();
    }
    
    populateFullResults() {
        if (!this.analysisData) return;
        
        // Update risk score
        const riskScore = document.getElementById('risk-score');
        const riskCircle = document.getElementById('risk-circle');
        
        if (riskScore) {
            riskScore.textContent = `${this.analysisData.overallRisk}%`;
            
            // Update color based on risk level
            if (this.analysisData.overallRisk < 30) {
                riskScore.className = 'text-3xl font-bold text-green-600';
            } else if (this.analysisData.overallRisk < 60) {
                riskScore.className = 'text-3xl font-bold text-yellow-600';
            } else {
                riskScore.className = 'text-3xl font-bold text-red-600';
            }
        }
        
        if (riskCircle) {
            const circumference = 2 * Math.PI * 40; // radius = 40
            const offset = circumference - (this.analysisData.overallRisk / 100) * circumference;
            riskCircle.style.strokeDashoffset = offset;
            
            // Update stroke color
            if (this.analysisData.overallRisk < 30) {
                riskCircle.setAttribute('stroke', '#10b981');
            } else if (this.analysisData.overallRisk < 60) {
                riskCircle.setAttribute('stroke', '#f59e0b');
            } else {
                riskCircle.setAttribute('stroke', '#ef4444');
            }
        }
        
        // Populate platform analysis
        this.populatePlatformAnalysis();
        
        // Populate risk categories
        this.populateRiskCategories();
        
        // Populate flagged content
        this.populateFlaggedContent();
    }
    
    populatePlatformAnalysis() {
        const container = document.getElementById('platform-analysis');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.analysisData.platforms.forEach(platform => {
            const riskLevel = platform.risk < 30 ? 'Low' : platform.risk < 60 ? 'Moderate' : 'High';
            const riskColor = platform.risk < 30 ? 'green' : platform.risk < 60 ? 'yellow' : 'red';
            const iconClass = this.getPlatformIcon(platform.name);
            
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg';
            div.innerHTML = `
                <div class="flex items-center space-x-4">
                    <i class="${iconClass}"></i>
                    <div>
                        <h4 class="font-medium text-gray-900 dark:text-white">${platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${platform.posts} posts analyzed</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div class="bg-${riskColor}-500 h-2 rounded-full" style="width: ${platform.risk}%"></div>
                    </div>
                    <span class="text-sm font-medium text-${riskColor}-600">${riskLevel}</span>
                </div>
            `;
            
            container.appendChild(div);
        });
    }
    
    populateRiskCategories() {
        const container = document.getElementById('risk-categories');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.analysisData.categories.forEach(category => {
            const riskColor = category.risk < 20 ? 'green' : category.risk < 40 ? 'yellow' : 'red';
            
            const div = document.createElement('div');
            div.className = `p-4 bg-${riskColor}-50 dark:bg-${riskColor}-900/20 rounded-lg border border-${riskColor}-200 dark:border-${riskColor}-700`;
            div.innerHTML = `
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">${category.name}</h4>
                <div class="flex items-center justify-between">
                    <div class="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div class="bg-${riskColor}-500 h-2 rounded-full" style="width: ${category.risk * 2}%"></div>
                    </div>
                    <span class="text-sm font-bold text-${riskColor}-600">${category.risk}%</span>
                </div>
            `;
            
            container.appendChild(div);
        });
    }
    
    populateFlaggedContent() {
        const container = document.getElementById('flagged-content');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.analysisData.flaggedContent.forEach(item => {
            const riskColor = item.risk === 'Low' ? 'green' : item.risk === 'Medium' ? 'yellow' : 'red';
            const iconClass = this.getPlatformIcon(item.platform.toLowerCase());
            
            const div = document.createElement('div');
            div.className = 'p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600';
            div.innerHTML = `
                <div class="flex items-start justify-between">
                    <div class="flex items-start space-x-3">
                        <i class="${iconClass}"></i>
                        <div>
                            <p class="text-sm font-medium text-gray-900 dark:text-white">${item.content}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${item.date}</p>
                        </div>
                    </div>
                    <span class="px-2 py-1 bg-${riskColor}-100 dark:bg-${riskColor}-900/20 text-${riskColor}-700 dark:text-${riskColor}-300 text-xs font-medium rounded">${item.risk} Risk</span>
                </div>
            `;
            
            container.appendChild(div);
        });
    }
    
    getPlatformIcon(platform) {
        const icons = {
            instagram: 'fab fa-instagram text-pink-500',
            tiktok: 'fab fa-tiktok text-black dark:text-white',
            linkedin: 'fab fa-linkedin text-blue-600',
            twitter: 'fab fa-twitter text-blue-400'
        };
        
        return icons[platform] || 'fas fa-globe text-gray-500';
    }
    
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNav = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }
        
        // Update section title
        const sectionTitle = document.getElementById('section-title');
        if (sectionTitle) {
            const titles = {
                home: 'Dashboard',
                results: 'My Results',
                settings: 'Settings'
            };
            sectionTitle.textContent = titles[sectionName] || 'Dashboard';
        }
        
        // Load section-specific data
        if (sectionName === 'results') {
            this.loadResultsHistory();
        }
    }
    
    loadResultsHistory() {
        const container = document.getElementById('results-history');
        if (!container) return;
        
        // Mock results history
        const history = [
            {
                date: '2024-01-28',
                risk: 'Low',
                platforms: 3,
                status: 'Complete'
            },
            {
                date: '2024-01-15',
                risk: 'Medium',
                platforms: 2,
                status: 'Complete'
            }
        ];
        
        container.innerHTML = '';
        
        if (history.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                    <i class="fas fa-chart-line text-4xl mb-4"></i>
                    <p>No analysis history yet</p>
                    <p class="text-sm">Your completed analyses will appear here</p>
                </div>
            `;
            return;
        }
        
        history.forEach(result => {
            const riskColor = result.risk === 'Low' ? 'green' : result.risk === 'Medium' ? 'yellow' : 'red';
            
            const div = document.createElement('div');
            div.className = 'p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer';
            div.innerHTML = `
                <div class="flex items-center justify-between">
                    <div>
                        <p class="font-medium text-gray-900 dark:text-white">Analysis - ${result.date}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${result.platforms} platforms analyzed</p>
                    </div>
                    <div class="text-right">
                        <span class="px-2 py-1 bg-${riskColor}-100 dark:bg-${riskColor}-900/20 text-${riskColor}-700 dark:text-${riskColor}-300 text-xs font-medium rounded">${result.risk} Risk</span>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">${result.status}</p>
                    </div>
                </div>
            `;
            
            container.appendChild(div);
        });
    }
    
    saveProfile() {
        const name = document.getElementById('user-name').value;
        const country = document.getElementById('user-country').value;
        const university = document.getElementById('user-university').value;
        
        try {
            authManager.updateUser({
                profile: {
                    name,
                    country,
                    university
                }
            });
            
            showMessage('Profile updated successfully!', 'success');
        } catch (error) {
            showMessage('Failed to update profile', 'error');
        }
    }
    
    changePassword() {
        showMessage('Password change functionality coming soon!', 'info');
    }
    
    downloadData() {
        showMessage('Data export initiated. You will receive an email shortly.', 'success');
    }
    
    deleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            showMessage('Account deletion requested. Please check your email to confirm.', 'info');
        }
    }
    
    downloadReport() {
        showMessage('Generating PDF report... Download will start shortly.', 'success');
        
        // Simulate PDF generation
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = '#';
            link.download = 'visa-risk-analysis-report.pdf';
            link.textContent = 'Download PDF Report';
            
            showMessage('Report generated successfully!', 'success');
        }, 2000);
    }
}

// Global functions for HTML onclick handlers
function showSection(sectionName) {
    if (window.dashboard) {
        window.dashboard.showSection(sectionName);
    }
}

function connectAccount(platform) {
    if (window.dashboard) {
        window.dashboard.connectAccount(platform);
    }
}

function startAnalysis() {
    if (window.dashboard) {
        window.dashboard.startAnalysis();
    }
}

function saveProfile() {
    if (window.dashboard) {
        window.dashboard.saveProfile();
    }
}

function changePassword() {
    if (window.dashboard) {
        window.dashboard.changePassword();
    }
}

function downloadData() {
    if (window.dashboard) {
        window.dashboard.downloadData();
    }
}

function deleteAccount() {
    if (window.dashboard) {
        window.dashboard.deleteAccount();
    }
}

function downloadReport() {
    if (window.dashboard) {
        window.dashboard.downloadReport();
    }
}

// Mobile sidebar functionality
function initMobileSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mobileToggle = document.getElementById('mobile-sidebar-toggle');
    const mobileClose = document.getElementById('mobile-sidebar-close');
    const overlay = document.createElement('div');
    
    // Create overlay
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 z-30 hidden md:hidden';
    overlay.id = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    function showSidebar() {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
    
    function hideSidebar() {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
    
    // Event listeners
    if (mobileToggle) {
        mobileToggle.addEventListener('click', showSidebar);
    }
    
    if (mobileClose) {
        mobileClose.addEventListener('click', hideSidebar);
    }
    
    overlay.addEventListener('click', hideSidebar);
    
    // Close sidebar when clicking on navigation items on mobile
    const navItems = sidebar.querySelectorAll('button[onclick]');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                hideSidebar();
            }
        });
    });
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
    initMobileSidebar();
});
