// Dashboard functionality

class Dashboard {
    constructor() {
        this.currentUser = null;
        this.connectedAccounts = {
            instagram: false,
            twitter: false,
            linkedin: false,
            facebook: false
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
                const isConnected = this.connectedAccounts[platform] && 
                    (this.connectedAccounts[platform] === true || this.connectedAccounts[platform].connected === true);
                
                if (isConnected) {
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
        
        const connectedCount = Object.values(this.connectedAccounts).filter(account => {
            return account === true || (account && account.connected === true);
        }).length;
        
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
        // Ignore null or undefined section names
        if (!sectionName) {
            return;
        }
        
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
        
        // Load section-specific data
        if (sectionName === 'results') {
            console.log('Loading results data...');
            this.loadMyResults();
            this.loadResultsHistory();
        }
    }
    
    connectAccount(platform) {
        // Check if already connected
        const isConnected = this.connectedAccounts[platform] && 
            (this.connectedAccounts[platform] === true || this.connectedAccounts[platform].connected === true);
        
        if (isConnected) {
            showMessage(`${platform.charAt(0).toUpperCase() + platform.slice(1)} is already connected!`, 'info');
            return;
        }
        
        // Show connection modal
        this.showConnectionModal(platform);
    }
    
    showConnectionModal(platform) {
        const modal = document.getElementById('connection-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalIcon = document.getElementById('modal-platform-icon');
        const usernameInput = document.getElementById('username-input');
        const connectionForm = document.getElementById('connection-form');
        
        if (!modal || !modalTitle || !modalIcon || !usernameInput || !connectionForm) {
            console.error('Modal elements not found');
            return;
        }
        
        // Set platform-specific content
        const platformConfig = {
            instagram: { icon: 'fab fa-instagram', color: 'text-pink-500', name: 'Instagram' },
            twitter: { icon: 'fab fa-x-twitter', color: 'text-black dark:text-white', name: 'X (Twitter)' },
            linkedin: { icon: 'fab fa-linkedin', color: 'text-blue-600', name: 'LinkedIn' },
            facebook: { icon: 'fab fa-facebook', color: 'text-blue-600', name: 'Facebook' }
        };
        
        const config = platformConfig[platform];
        if (config) {
            modalTitle.textContent = `Connect to ${config.name}`;
            modalIcon.className = `${config.icon} text-3xl ${config.color}`;
            usernameInput.placeholder = `Enter your ${config.name} username`;
        }
        
        // Clear previous input
        usernameInput.value = '';
        
        // Store current platform for form submission
        this.currentConnectionPlatform = platform;
        
        // Show modal
        modal.classList.remove('hidden');
        usernameInput.focus();
        
        // Handle form submission
        connectionForm.onsubmit = (e) => {
            e.preventDefault();
            this.handleConnectionSubmit();
        };
    }
    
    handleConnectionSubmit() {
        const usernameInput = document.getElementById('username-input');
        const saveBtn = document.getElementById('save-connection-btn');
        const saveBtnText = document.getElementById('save-btn-text');
        const saveBtnLoading = document.getElementById('save-btn-loading');
        
        if (!usernameInput || !this.currentConnectionPlatform) {
            showMessage('Error: Missing required information', 'error');
            return;
        }
        
        const username = usernameInput.value.trim();
        if (!username) {
            showMessage('Please enter a username', 'error');
            usernameInput.focus();
            return;
        }
        
        // Show loading state
        saveBtn.disabled = true;
        saveBtnText.classList.add('hidden');
        saveBtnLoading.classList.remove('hidden');
        
        // Simulate connection process
        setTimeout(() => {
            this.completeConnection(this.currentConnectionPlatform, username);
        }, 2000);
    }
    
    completeConnection(platform, username) {
        // Update connected accounts
        this.connectedAccounts[platform] = { connected: true, username: username };
        
        // Update user data in storage
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
        
        // Update start analysis button
        this.updateStartAnalysisButton();
        
        // Close modal and show success message
        this.closeConnectionModal();
        showMessage(`${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully!`, 'success');
    }
    
    closeConnectionModal() {
        const modal = document.getElementById('connection-modal');
        const saveBtn = document.getElementById('save-connection-btn');
        const saveBtnText = document.getElementById('save-btn-text');
        const saveBtnLoading = document.getElementById('save-btn-loading');
        
        if (modal) {
            modal.classList.add('hidden');
        }
        
        // Reset button state
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtnText.classList.remove('hidden');
            saveBtnLoading.classList.add('hidden');
        }
        
        // Clear current platform
        this.currentConnectionPlatform = null;
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
            "Scanning X (Twitter) content...",
            "Reviewing LinkedIn profile...",
            "Examining Facebook activity...",
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
        
        // Save analysis data to user profile
        this.saveAnalysisData();
        
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
    
    saveAnalysisData() {
        if (!this.analysisData) return;
        
        // Save analysis data to user profile with payment status
        authManager.updateUser({
            lastAnalysis: {
                data: this.analysisData,
                date: new Date().toISOString(),
                isPaidResult: this.currentUser.isPaid, // Save whether this was a paid or free result
                displayType: this.currentUser.isPaid ? 'full' : 'free', // Save display type
                platforms: Object.keys(this.connectedAccounts).filter(platform => {
                    const account = this.connectedAccounts[platform];
                    return account === true || (account && account.connected === true);
                })
            }
        });
        
        // Update current user reference
        this.currentUser = authManager.getCurrentUser();
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
                    content: 'Beautiful sunset at Stanford campus! 🌅',
                    hashtags: '#Stanford #StudentLife',
                    description: 'Positive educational content',
                    risk: 'Low',
                    date: '2024-12-15'
                },
                {
                    platform: 'TikTok',
                    content: 'Party with friends last weekend! 🎉',
                    description: 'Social content - review for context',
                    risk: 'Moderate',
                    date: '2024-12-10'
                },
                {
                    platform: 'Twitter',
                    content: 'Strong political views on immigration policy',
                    description: 'Political content - potentially concerning for visa application',
                    risk: 'High',
                    date: '2024-12-08'
                }
            ]
        };
    }
    
    showFreeTrialResults() {
        const freeResults = document.getElementById('free-trial-results');
        const fullResults = document.getElementById('full-results');
        
        // Show free trial results and hide full results for free users
        if (freeResults) freeResults.classList.remove('hidden');
        if (fullResults) fullResults.classList.add('hidden');
        
        // Hide recommendations section in free trial results for free users
        const analysisRecommendations = document.getElementById('analysis-recommendations-section');
        if (analysisRecommendations) {
            analysisRecommendations.classList.add('hidden');
        }
        
        // Show message for free users
        showMessage('Free analysis complete! Upgrade to unlock detailed recommendations and flagged content.', 'info');
    }
    
    showFullResults() {
        const freeResults = document.getElementById('free-trial-results');
        const fullResults = document.getElementById('full-results');
        
        // Hide free trial results and show full results for paid users
        if (freeResults) freeResults.classList.add('hidden');
        if (fullResults) fullResults.classList.remove('hidden');
        
        // Populate the full results with data
        this.populateFullResults();
        
        // Show message for paid users
        showMessage('Complete analysis ready! Review your detailed results and recommendations below.', 'success');
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
            let riskColor, riskBg, riskBorder, riskText, riskLabel;
            
            if (item.risk === 'Low') {
                riskColor = 'green';
                riskBg = 'bg-green-50 dark:bg-green-900/20';
                riskBorder = 'border-green-200 dark:border-green-700';
                riskText = 'text-green-700 dark:text-green-300';
                riskLabel = 'Low Risk';
            } else if (item.risk === 'Moderate') {
                riskColor = 'yellow';
                riskBg = 'bg-yellow-50 dark:bg-yellow-900/20';
                riskBorder = 'border-yellow-200 dark:border-yellow-700';
                riskText = 'text-yellow-700 dark:text-yellow-300';
                riskLabel = 'Moderate Risk';
            } else {
                riskColor = 'red';
                riskBg = 'bg-red-50 dark:bg-red-900/20';
                riskBorder = 'border-red-200 dark:border-red-700';
                riskText = 'text-red-700 dark:text-red-300';
                riskLabel = 'High Risk';
            }
            
            const iconClass = this.getPlatformIcon(item.platform.toLowerCase());
            const platformColor = this.getPlatformColor(item.platform.toLowerCase());
            
            const div = document.createElement('div');
            div.className = `p-4 ${riskBg} rounded-lg border ${riskBorder}`;
            div.innerHTML = `
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center space-x-2">
                        <i class="${iconClass} ${platformColor}"></i>
                        <span class="text-sm font-medium text-gray-900 dark:text-white">${item.platform}</span>
                    </div>
                    <span class="px-2 py-1 ${riskBg} ${riskText} text-xs font-medium rounded border ${riskBorder}">${riskLabel}</span>
                </div>
                <div class="mb-2">
                    <h4 class="font-medium text-gray-900 dark:text-white mb-1">${item.content}</h4>
                    ${item.hashtags ? `<p class="text-sm text-gray-600 dark:text-gray-400">${item.hashtags}</p>` : ''}
                </div>
                <p class="text-sm ${riskText} italic">${item.description}</p>
                <div class="mt-3 flex justify-end">
                    <button class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                        View Details
                    </button>
                </div>
            `;
            
            container.appendChild(div);
        });
    }
    
    getPlatformIcon(platform) {
        const icons = {
            instagram: 'fab fa-instagram',
            twitter: 'fab fa-x-twitter',
            linkedin: 'fab fa-linkedin',
            facebook: 'fab fa-facebook',
            tiktok: 'fab fa-tiktok'
        };
        return icons[platform] || 'fas fa-globe';
    }
    
    getPlatformColor(platform) {
        const colors = {
            instagram: 'text-pink-500',
            twitter: 'text-black dark:text-white',
            linkedin: 'text-blue-600',
            facebook: 'text-blue-600',
            tiktok: 'text-black dark:text-white'
        };
        return colors[platform] || 'text-gray-500';
    }
    
    loadMyResults() {
        const noResultsMessage = document.getElementById('no-results-message');
        const resultsDisplay = document.getElementById('results-display');
        
        // Load saved analysis data from user profile
        if (this.currentUser.lastAnalysis && this.currentUser.lastAnalysis.data) {
            this.analysisData = this.currentUser.lastAnalysis.data;
        }
        
        if (!this.analysisData) {
            // No analysis data available
            if (noResultsMessage) noResultsMessage.classList.remove('hidden');
            if (resultsDisplay) resultsDisplay.classList.add('hidden');
            return;
        }
        
        // Check if user paid for the original analysis
        const wasOriginallyPaid = this.currentUser.lastAnalysis.isPaidResult || false;
        const originalDisplayType = this.currentUser.lastAnalysis.displayType || 'free';
        
        // Show results display
        if (noResultsMessage) noResultsMessage.classList.add('hidden');
        if (resultsDisplay) {
            resultsDisplay.classList.remove('hidden');
        }
        
        // Show the same type of results that were originally generated
        if (wasOriginallyPaid || originalDisplayType === 'full') {
            this.showMyResultsFull();
        } else {
            this.showMyResultsFree();
        }
        
        // Update analysis date
        const analysisDate = document.getElementById('analysis-date');
        if (analysisDate) {
            let dateText = 'Today';
            if (this.currentUser.lastAnalysis && this.currentUser.lastAnalysis.date) {
                const savedDate = new Date(this.currentUser.lastAnalysis.date);
                const today = new Date();
                const diffTime = Math.abs(today - savedDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays === 1) {
                    dateText = 'Yesterday';
                } else if (diffDays > 1) {
                    dateText = savedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                }
            }
            analysisDate.textContent = `Analyzed ${dateText}`;
        }
        
        // Update overall metrics
        this.updateResultsMetrics();
        
        // Update platform results
        this.updatePlatformResults();
        
        // Update flagged content results
        this.updateFlaggedContentResults();
        
        // Update recommendations
        this.updateRecommendations();
    }
    
    showMyResultsFull() {
        // Show full results in My Results section (same as what paid users saw during analysis)
        this.updateResultsMetrics();
        this.updatePlatformResults();
        this.updateFlaggedContentResults();
        this.updateRecommendations();
        
        // Show all result cards
        const resultCards = document.querySelectorAll('#results-display .bg-white, #results-display .bg-gray-50');
        resultCards.forEach(card => {
            card.classList.remove('hidden');
        });
        
        // Hide any upgrade prompts
        const upgradePrompts = document.querySelectorAll('.upgrade-prompt');
        upgradePrompts.forEach(prompt => {
            prompt.classList.add('hidden');
        });
    }
    
    showMyResultsFree() {
        // Show limited results in My Results section (same as what free users saw during analysis)
        this.updateResultsMetrics();
        
        // Show only basic metrics, hide detailed analysis
        const platformCard = document.querySelector('#platform-analysis-card');
        const flaggedCard = document.querySelector('#flagged-content-card');
        const recommendationsCard = document.querySelector('#recommendations-card');
        
        if (platformCard) platformCard.classList.add('hidden');
        if (flaggedCard) flaggedCard.classList.add('hidden');
        if (recommendationsCard) recommendationsCard.classList.add('hidden');
        
        // Show upgrade prompt for detailed analysis
        this.showMyResultsUpgradePrompt();
    }
    
    showMyResultsUpgradePrompt() {
        // Add upgrade prompt in My Results for free users
        const resultsDisplay = document.getElementById('results-display');
        if (!resultsDisplay) return;
        
        // Check if upgrade prompt already exists
        let upgradePrompt = document.querySelector('.my-results-upgrade-prompt');
        if (!upgradePrompt) {
            upgradePrompt = document.createElement('div');
            upgradePrompt.className = 'my-results-upgrade-prompt bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700';
            upgradePrompt.innerHTML = `
                <div class="text-center">
                    <div class="text-blue-600 dark:text-blue-400 mb-4">
                        <i class="fas fa-lock text-3xl"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Unlock Detailed Analysis</h3>
                    <p class="text-gray-600 dark:text-gray-300 mb-4">Get comprehensive platform analysis, flagged content review, and personalized recommendations.</p>
                    <button onclick="showSection('settings')" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                        <i class="fas fa-crown mr-2"></i>Upgrade Now
                    </button>
                </div>
            `;
            resultsDisplay.appendChild(upgradePrompt);
        }
        
        upgradePrompt.classList.remove('hidden');
    }
    
    updateResultsMetrics() {
        if (!this.analysisData) return;
        
        const overallRiskDisplay = document.getElementById('overall-risk-display');
        const approvalChanceDisplay = document.getElementById('approval-chance-display');
        const postsAnalyzedDisplay = document.getElementById('posts-analyzed-display');
        const flaggedItemsDisplay = document.getElementById('flagged-items-display');
        
        if (overallRiskDisplay) {
            const riskLevel = this.analysisData.overallRisk < 30 ? 'Low' : 
                             this.analysisData.overallRisk < 60 ? 'Medium' : 'High';
            const riskColor = this.analysisData.overallRisk < 30 ? 'text-green-600' : 
                             this.analysisData.overallRisk < 60 ? 'text-yellow-600' : 'text-red-600';
            
            overallRiskDisplay.textContent = riskLevel;
            overallRiskDisplay.className = `text-3xl font-bold ${riskColor}`;
        }
        
        if (approvalChanceDisplay) {
            approvalChanceDisplay.textContent = `${this.analysisData.approvalChance}%`;
        }
        
        if (postsAnalyzedDisplay) {
            postsAnalyzedDisplay.textContent = this.analysisData.postsAnalyzed.toLocaleString();
        }
        
        if (flaggedItemsDisplay) {
            flaggedItemsDisplay.textContent = this.analysisData.flaggedItems;
        }
    }
    
    updatePlatformResults() {
        const container = document.getElementById('platform-results');
        if (!container || !this.analysisData) return;
        
        container.innerHTML = '';
        
        this.analysisData.platforms.forEach(platform => {
            const riskLevel = platform.risk < 30 ? 'Low' : platform.risk < 60 ? 'Medium' : 'High';
            const riskColor = platform.risk < 30 ? 'green' : platform.risk < 60 ? 'yellow' : 'red';
            const iconClass = this.getPlatformIcon(platform.name);
            
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg';
            div.innerHTML = `
                <div class="flex items-center space-x-3">
                    <i class="${iconClass} text-xl"></i>
                    <div>
                        <p class="font-medium text-gray-900 dark:text-white">${platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${platform.posts} posts analyzed</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <div class="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div class="bg-${riskColor}-500 h-2 rounded-full" style="width: ${platform.risk}%"></div>
                    </div>
                    <span class="text-sm font-medium text-${riskColor}-600 min-w-[60px]">${riskLevel} (${platform.risk}%)</span>
                </div>
            `;
            
            container.appendChild(div);
        });
    }
    
    updateFlaggedContentResults() {
        const container = document.getElementById('flagged-content-results');
        if (!container || !this.analysisData) return;
        
        container.innerHTML = '';
        
        if (this.analysisData.flaggedContent.length === 0) {
            container.innerHTML = `
                <div class="text-center py-8">
                    <div class="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-check text-2xl text-green-600"></i>
                    </div>
                    <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No Flagged Content</h4>
                    <p class="text-gray-600 dark:text-gray-400">Great! No concerning content was found in your analysis.</p>
                </div>
            `;
            return;
        }
        
        this.analysisData.flaggedContent.forEach(item => {
        let riskColor, riskBg, riskBorder, riskText, riskLabel;
        
        if (item.risk === 'Low') {
            riskColor = 'green';
            riskBg = 'bg-green-50 dark:bg-green-900/20';
            riskBorder = 'border-green-200 dark:border-green-700';
            riskText = 'text-green-700 dark:text-green-300';
            riskLabel = 'Low Risk';
        } else if (item.risk === 'Moderate') {
            riskColor = 'yellow';
            riskBg = 'bg-yellow-50 dark:bg-yellow-900/20';
            riskBorder = 'border-yellow-200 dark:border-yellow-700';
            riskText = 'text-yellow-700 dark:text-yellow-300';
            riskLabel = 'Moderate Risk';
        } else {
            riskColor = 'red';
            riskBg = 'bg-red-50 dark:bg-red-900/20';
            riskBorder = 'border-red-200 dark:border-red-700';
            riskText = 'text-red-700 dark:text-red-300';
            riskLabel = 'High Risk';
        }
        
        const iconClass = this.getPlatformIcon(item.platform.toLowerCase());
        const platformColor = this.getPlatformColor(item.platform.toLowerCase());
        
        const div = document.createElement('div');
        div.className = `p-4 ${riskBg} rounded-lg border ${riskBorder}`;
        div.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="flex items-center space-x-2">
                    <i class="${iconClass} ${platformColor}"></i>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">${item.platform}</span>
                </div>
                <span class="px-2 py-1 ${riskBg} ${riskText} text-xs font-medium rounded border ${riskBorder}">${riskLabel}</span>
            </div>
            <div class="mb-2">
                <h4 class="font-medium text-gray-900 dark:text-white mb-1">${item.content}</h4>
                ${item.hashtags ? `<p class="text-sm text-gray-600 dark:text-gray-400">${item.hashtags}</p>` : ''}
            </div>
            <p class="text-sm ${riskText} italic">${item.description}</p>
            <div class="mt-3 flex justify-end">
                <button class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors">
                    View Details
                </button>
            </div>
        `;
        
        container.appendChild(div);
    });
    }
    
    updateRecommendations() {
        const container = document.getElementById('recommendations-results');
        if (!container || !this.analysisData) return;
        
        const recommendations = [
            {
                type: 'error',
                icon: 'fas fa-exclamation-circle',
                title: 'Remove political content',
                description: 'Delete posts containing political opinions or activism references',
                affects: '2 posts',
                priority: 'high'
            },
            {
                type: 'warning',
                icon: 'fas fa-exclamation-triangle',
                title: 'Add context to social posts',
                description: 'Provide background information for party or social gathering posts',
                affects: '3 posts',
                priority: 'medium'
            },
            {
                type: 'success',
                icon: 'fas fa-check-circle',
                title: 'Enhance educational content',
                description: 'Continue sharing academic achievements and educational experiences',
                affects: 'Keep showcasing academic progress',
                priority: 'positive'
            }
        ];
        
        container.innerHTML = '';
        
        recommendations.forEach(rec => {
            let colorClass, bgClass, borderClass, textClass, iconClass;
            
            if (rec.type === 'error') {
                colorClass = 'red';
                bgClass = 'bg-red-50 dark:bg-red-900/20';
                borderClass = 'border-red-200 dark:border-red-700';
                textClass = 'text-red-900 dark:text-red-100';
                iconClass = 'text-red-600';
            } else if (rec.type === 'warning') {
                colorClass = 'yellow';
                bgClass = 'bg-yellow-50 dark:bg-yellow-900/20';
                borderClass = 'border-yellow-200 dark:border-yellow-700';
                textClass = 'text-yellow-900 dark:text-yellow-100';
                iconClass = 'text-yellow-600';
            } else if (rec.type === 'success') {
                colorClass = 'green';
                bgClass = 'bg-green-50 dark:bg-green-900/20';
                borderClass = 'border-green-200 dark:border-green-700';
                textClass = 'text-green-900 dark:text-green-100';
                iconClass = 'text-green-600';
            }
            
            const div = document.createElement('div');
            div.className = `p-4 ${bgClass} rounded-lg border ${borderClass}`;
            div.innerHTML = `
                <div class="flex items-start space-x-3">
                    <i class="${rec.icon} ${iconClass} mt-1"></i>
                    <div class="flex-1">
                        <h4 class="font-medium ${textClass}">${rec.title}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${rec.description}</p>
                        <div class="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <i class="fas fa-file-alt mr-1"></i>
                            <span>${rec.affects}</span>
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(div);
        });
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

function closeConnectionModal() {
    if (window.dashboard) {
        window.dashboard.closeConnectionModal();
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
