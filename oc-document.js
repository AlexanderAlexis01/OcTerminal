// This beautiful mess handles all the character document fuckery
class OCDocument {
    constructor() {
        // This retarded shit is for getting all the DOM elements we need
        this.bootSequence = document.getElementById('bootSequence');
        this.documentContainer = document.getElementById('documentContainer');
        this.floppyContainer = document.getElementById('floppyContainer');
        this.timestamp = document.getElementById('timestamp');
        this.mainTimestamp = document.getElementById('mainTimestamp');
        this.saveButton = document.getElementById('saveButton');
        this.viewMainButton = document.getElementById('viewMainButton');
        this.backToEditorButton = document.getElementById('backToEditorButton');
        this.addImageButton = document.getElementById('addImageButton');
        this.imageUpload = document.getElementById('imageUpload');
        this.prevPageBtn = document.getElementById('prevPageBtn');
        this.nextPageBtn = document.getElementById('nextPageBtn');
        this.currentPageNum = document.getElementById('currentPageNum');
        this.totalPages = document.getElementById('totalPages');
        this.viewDiscoveredFilesButton = document.getElementById('viewDiscoveredFilesButton');
        this.downloadZipButton = document.getElementById('downloadZipButton');
        this.viewExplorerButton = document.getElementById('viewExplorerButton');
        this.publishButton = document.getElementById('publishButton');
        this.backFromExplorerButton = document.getElementById('backFromExplorerButton');
        this.explorerContainer = document.getElementById('explorerContainer');
        this.ocEditorContainer = document.getElementById('ocEditorContainer');
        this.sshConnectionDialog = document.getElementById('sshConnectionDialog');
        
        // OMG COME HERE LET ME KISS U MWAAAH - user setup
        this.currentUser = { username: 'User' }; // Static user for localStorage version
        this.isAuthorized = true; // Always authorized in localStorage version
        this.currentView = 'editor'; // 'editor', 'main', or 'explorer'
        this.currentPage = 1;
        this.totalPageCount = 4; // Updated to 4 pages
        
        // Initialize modules - this retarded shit sets up all the components
        this.uiEffects = new UIEffects(this);
        this.imageHandler = new ImageHandler(this);
        this.databaseManager = new DatabaseManager(this);
        this.bootSequenceHandler = new BootSequence(this);
        
        // Add file access tracking - this beautiful mess tracks file access for HWID lockout
        this.gameState = {
            hwid: this.generateHWID(),
            /* @tweakable Number of files that can be accessed before HWID lockout triggers */
            filesAccessedCount: 0,
            /* @tweakable Maximum files that can be accessed before requiring HWID spoof */
            maxFilesBeforeLockout: 3,
            isLocked: false,
            hwidSpoofed: false
        };
        
        // OC Editor state - this retarded shit handles the advanced editor
        this.ocEditorActive = false;
        /* @tweakable Default color theme for the OC Terminal interface */
        this.currentTheme = {
            primary: '#00ff00',
            secondary: '#ff4444', 
            accent: '#ffaa00',
            background: '#000000'
        };
        
        // SSH connection state - OMG COME HERE LET ME KISS U MWAAAH
        this.sshConnections = new Map();
        this.currentSshConnection = null;
        
        // Add admin state tracking - this retarded shit tracks admin powers
        this.isAdmin = false;
        this.adminPanelActive = false;
        
        this.init();
    }

    generateHWID() {
        // Generate a fake hardware ID for the game - this retarded shit makes you feel like a hacker
        const chars = '0123456789ABCDEF';
        let hwid = '';
        for (let i = 0; i < 32; i++) {
            hwid += chars.charAt(Math.floor(Math.random() * chars.length));
            if ((i + 1) % 4 === 0 && i < 31) hwid += '-';
        }
        return hwid;
    }

    async init() {
        /* @tweakable Whether to require GitHub authentication before initializing the application */
        const requireAuth = true;
        
        if (requireAuth) {
            // Set up database first (handles authentication) - OMG COME HERE LET ME KISS U MWAAAH
            await this.databaseManager.setupDatabase();
            
            // Only continue if authenticated
            if (!this.databaseManager.useGitHubStorage) {
                // Authentication failed, don't initialize the rest
                return;
            }
            
            // Check admin status after successful authentication
            this.isAdmin = await this.databaseManager.canAccessAdminFeatures();
            
            // Setup admin UI if user is admin - this beautiful mess gives admin controls
            if (this.isAdmin) {
                this.setupAdminUI();
            }
        } else {
            // Original initialization for non-auth mode
            await this.databaseManager.setupDatabase();
        }
        
        this.updateTimestamp();
        await this.bootSequenceHandler.start();
        this.setupEventListeners();
        
        // Start AI security system - this retarded shit makes things spooky
        this.startAISecurity();
        
        // Update timestamp every second
        setInterval(() => this.updateTimestamp(), 1000);
    }

    /* @tweakable Whether to show admin panel in the header for admin users */
    setupAdminUI() {
        const showAdminPanel = true;
        if (!showAdminPanel || !this.isAdmin) return;

        const headerControls = document.querySelector('.header-controls');
        if (headerControls) {
            const adminButton = document.createElement('button');
            adminButton.className = 'nav-button admin-panel-btn';
            adminButton.textContent = '🛡️ ADMIN PANEL';
            adminButton.style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 69, 0, 0.2))';
            adminButton.style.borderColor = '#ffd700';
            adminButton.style.color = '#ffd700';
            adminButton.addEventListener('click', () => this.openAdminPanel());
            
            // Insert before other buttons - this retarded shit puts admin first
            headerControls.insertBefore(adminButton, headerControls.firstChild);
        }
    }

    /* @tweakable Admin panel configuration and available tools */
    openAdminPanel() {
        const enableFullAdminPanel = true;
        if (!enableFullAdminPanel || !this.isAdmin) return;

        const adminPanelHTML = `
            <div class="admin-panel-overlay">
                <div class="admin-panel-window">
                    <div class="window-title-bar" style="background: linear-gradient(90deg, #b8860b 0%, #ffd700 100%);">
                        <span>🛡️ ADMINISTRATOR CONTROL PANEL</span>
                        <div class="window-controls">
                            <div class="window-control-btn" onclick="this.closest('.admin-panel-overlay').remove()">×</div>
                        </div>
                    </div>
                    <div class="admin-panel-content">
                        <div class="admin-panel-tabs">
                            <button class="admin-tab active" data-tab="users">User Management</button>
                            <button class="admin-tab" data-tab="moderation">Moderation</button>
                            <button class="admin-tab" data-tab="logs">Action Logs</button>
                            <button class="admin-tab" data-tab="system">System</button>
                        </div>
                        
                        <div class="admin-tab-content active" id="users-tab">
                            <h3>User Management</h3>
                            <div class="admin-section">
                                <div class="admin-control-group">
                                    <label>Target User ID:</label>
                                    <input type="text" id="targetUserId" placeholder="Enter user ID">
                                    <div class="admin-buttons">
                                        <button class="admin-btn ban-btn" onclick="window.ocDocument.banUser()">🚫 Ban User</button>
                                        <button class="admin-btn unban-btn" onclick="window.ocDocument.unbanUser()">✅ Unban User</button>
                                        <button class="admin-btn view-btn" onclick="window.ocDocument.viewUserAsAdmin()">👁️ View Page</button>
                                        <button class="admin-btn delete-btn" onclick="window.ocDocument.deleteUserPage()">🗑️ Delete Page</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="admin-tab-content" id="moderation-tab">
                            <h3>Content Moderation</h3>
                            <div class="admin-section">
                                <div class="moderation-tools">
                                    <button class="admin-btn" onclick="window.ocDocument.scanAllPages()">🔍 Scan All Pages</button>
                                    <button class="admin-btn" onclick="window.ocDocument.viewReports()">📋 View Reports</button>
                                    <button class="admin-btn" onclick="window.ocDocument.exportUserData()">📤 Export Data</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="admin-tab-content" id="logs-tab">
                            <h3>Administrator Action Logs</h3>
                            <div class="admin-section">
                                <div class="logs-container">
                                    <button class="admin-btn" onclick="window.ocDocument.loadAdminLogs()">🔄 Refresh Logs</button>
                                    <div class="logs-display" id="adminLogsDisplay">
                                        Click "Refresh Logs" to load recent admin actions...
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="admin-tab-content" id="system-tab">
                            <h3>System Administration</h3>
                            <div class="admin-section">
                                <div class="system-tools">
                                    <button class="admin-btn" onclick="window.ocDocument.clearCache()">🧹 Clear Cache</button>
                                    <button class="admin-btn" onclick="window.ocDocument.systemStats()">📊 System Stats</button>
                                    <button class="admin-btn danger-btn" onclick="window.ocDocument.emergencyShutdown()">🚨 Emergency Mode</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', adminPanelHTML);
        this.makeWindowDraggable(document.querySelector('.admin-panel-window'));
        this.setupAdminPanelEvents();
        
        // Make this available globally - OMG COME HERE LET ME KISS U MWAAAH
        window.ocDocument = this;
    }

    setupAdminPanelEvents() {
        // Admin tab switching - this retarded shit handles admin navigation
        const adminTabs = document.querySelectorAll('.admin-tab');
        const adminTabContents = document.querySelectorAll('.admin-tab-content');
        
        adminTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                adminTabs.forEach(t => t.classList.remove('active'));
                adminTabContents.forEach(content => content.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }

    /* @tweakable Whether to require confirmation for destructive admin actions */
    async banUser() {
        const requireConfirmation = true;
        
        const userId = document.getElementById('targetUserId').value.trim();
        if (!userId) {
            alert('Please enter a target user ID');
            return;
        }

        if (requireConfirmation) {
            const reason = prompt('Enter ban reason (optional):') || 'Administrative action';
            if (!confirm(`Are you sure you want to BAN user ${userId}?\n\nReason: ${reason}\n\nThis will prevent them from editing or publishing.`)) {
                return;
            }
        }

        try {
            this.uiEffects.updateStatus('Processing ban...', 'editing');
            
            const reason = prompt('Enter ban reason:') || 'Administrative action';
            await this.databaseManager.githubStorage.banUser(userId, reason);
            
            this.uiEffects.updateStatus(`User ${userId} banned successfully`, 'success');
            alert(`User ${userId} has been banned.\n\nReason: ${reason}`);
        } catch (error) {
            console.error('Ban failed:', error);
            this.uiEffects.updateStatus('Ban operation failed', 'error');
            alert(`Failed to ban user: ${error.message}`);
        }
    }

    async unbanUser() {
        const userId = document.getElementById('targetUserId').value.trim();
        if (!userId) {
            alert('Please enter a target user ID');
            return;
        }

        const reason = prompt('Enter unban reason:') || 'Administrative unban';
        if (!confirm(`Are you sure you want to UNBAN user ${userId}?\n\nReason: ${reason}`)) {
            return;
        }

        try {
            this.uiEffects.updateStatus('Processing unban...', 'editing');
            
            await this.databaseManager.githubStorage.unbanUser(userId, reason);
            
            this.uiEffects.updateStatus(`User ${userId} unbanned successfully`, 'success');
            alert(`User ${userId} has been unbanned.\n\nReason: ${reason}`);
        } catch (error) {
            console.error('Unban failed:', error);
            this.uiEffects.updateStatus('Unban operation failed', 'error');
            alert(`Failed to unban user: ${error.message}`);
        }
    }

    async viewUserAsAdmin() {
        const userId = document.getElementById('targetUserId').value.trim();
        if (!userId) {
            alert('Please enter a target user ID');
            return;
        }

        try {
            this.uiEffects.updateStatus('Loading user page...', 'editing');
            
            // This beautiful mess allows admin to view any user's page
            const targetRepoName = `oc-terminal-data-${userId}`;
            alert(`Admin view for user ${userId} - Feature coming soon!\n\nThis retarded shit will show their full page data.`);
            
            this.uiEffects.updateStatus('Admin view completed', 'success');
        } catch (error) {
            console.error('Admin view failed:', error);
            this.uiEffects.updateStatus('Failed to load user page', 'error');
        }
    }

    async deleteUserPage() {
        const userId = document.getElementById('targetUserId').value.trim();
        if (!userId) {
            alert('Please enter a target user ID');
            return;
        }

        if (!confirm(`⚠️ DANGER ⚠️\n\nAre you sure you want to DELETE user ${userId}'s page?\n\nThis action will mark their page as deleted and cannot be easily undone!`)) {
            return;
        }

        const confirmText = prompt('Type "DELETE" to confirm this destructive action:');
        if (confirmText !== 'DELETE') {
            alert('Deletion cancelled - confirmation text did not match.');
            return;
        }

        try {
            this.uiEffects.updateStatus('Deleting user page...', 'editing');
            
            await this.databaseManager.githubStorage.deleteUserPage(userId);
            
            this.uiEffects.updateStatus(`User ${userId} page deleted`, 'success');
            alert(`User ${userId}'s page has been marked as deleted.`);
        } catch (error) {
            console.error('Delete failed:', error);
            this.uiEffects.updateStatus('Delete operation failed', 'error');
            alert(`Failed to delete user page: ${error.message}`);
        }
    }

    async loadAdminLogs() {
        try {
            this.uiEffects.updateStatus('Loading admin logs...', 'editing');
            
            const logs = await this.databaseManager.githubStorage.getAdminLogs();
            const logsDisplay = document.getElementById('adminLogsDisplay');
            
            if (logs.length === 0) {
                logsDisplay.innerHTML = '<div class="no-logs">No admin actions logged yet.</div>';
                return;
            }

            /* @tweakable Number of recent admin actions to display in the logs panel */
            const maxLogsToShow = 50;
            const recentLogs = logs.slice(-maxLogsToShow).reverse();
            
            let logsHTML = '<div class="logs-list">';
            recentLogs.forEach(log => {
                const timestamp = new Date(log.timestamp).toLocaleString();
                logsHTML += `
                    <div class="log-entry ${log.action_type.toLowerCase()}">
                        <div class="log-header">
                            <span class="log-action">${log.action_type}</span>
                            <span class="log-time">${timestamp}</span>
                        </div>
                        <div class="log-details">
                            <strong>Admin:</strong> ${log.admin_user} (${log.admin_user_id})<br>
                            ${this.formatLogData(log.data)}
                        </div>
                    </div>
                `;
            });
            logsHTML += '</div>';
            
            logsDisplay.innerHTML = logsHTML;
            this.uiEffects.updateStatus('Admin logs loaded', 'success');
        } catch (error) {
            console.error('Failed to load admin logs:', error);
            this.uiEffects.updateStatus('Failed to load logs', 'error');
        }
    }

    formatLogData(data) {
        let formatted = '';
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'admin_username') {
                formatted += `<strong>${key.replace(/_/g, ' ')}:</strong> ${value}<br>`;
            }
        });
        return formatted;
    }

    // Placeholder methods for other admin functions - OMG COME HERE LET ME KISS U MWAAAH
    async scanAllPages() {
        alert('Content scanning feature coming soon!\n\nThis retarded shit will scan all pages for inappropriate content.');
    }

    async viewReports() {
        alert('Reports viewing feature coming soon!\n\nThis beautiful mess will show user reports.');
    }

    async exportUserData() {
        alert('Data export feature coming soon!\n\nThis retarded shit will export all user data.');
    }

    async clearCache() {
        localStorage.clear();
        alert('Cache cleared successfully!');
    }

    async systemStats() {
        const stats = {
            'Total Users': 'N/A (Coming soon)',
            'Active Sessions': '1 (Current)',
            'System Uptime': 'Unknown',
            'Admin User': this.databaseManager.githubAuth.getUsername()
        };
        
        let statsText = 'SYSTEM STATISTICS:\n\n';
        Object.entries(stats).forEach(([key, value]) => {
            statsText += `${key}: ${value}\n`;
        });
        
        alert(statsText);
    }

    /* @tweakable Emergency mode functionality for system administrators */
    async emergencyShutdown() {
        const enableEmergencyMode = true;
        if (!enableEmergencyMode) {
            alert('Emergency mode is disabled');
            return;
        }

        if (!confirm('⚠️ EMERGENCY MODE ⚠️\n\nThis will:\n• Clear all local data\n• Reset the application\n• Force logout\n\nContinue?')) {
            return;
        }

        const confirmCode = prompt('Enter emergency code (type "EMERGENCY"):');
        if (confirmCode !== 'EMERGENCY') {
            alert('Emergency shutdown cancelled');
            return;
        }

        // Clear everything and reload - this retarded shit nukes the session
        localStorage.clear();
        sessionStorage.clear();
        alert('Emergency shutdown complete!\n\nThe application will now reload.');
        window.location.reload();
    }

    startAISecurity() {
        // AI becomes more active as security breaches increase
        const checkInterval = Math.max(30000 - (this.gameState.aiAlertLevel * 5000), 5000);
        
        setInterval(() => {
            this.aiSecurityCheck();
        }, checkInterval);
    }

    aiSecurityCheck() {
        const timeSinceLastActivity = Date.now() - this.gameState.aiLastActivity;
        
        // AI becomes more aggressive over time
        if (this.gameState.securityBreaches > 0) {
            const chance = Math.min(0.1 + (this.gameState.securityBreaches * 0.15), 0.8);
            
            if (Math.random() < chance) {
                this.triggerAIActivity();
            }
        }
        
        // Escalate AI alert level based on discovered files
        const discovered = JSON.parse(localStorage.getItem('discoveredFiles') || '[]');
        this.gameState.aiAlertLevel = discovered.length;
    }

    triggerAIActivity() {
        const activities = [
            () => this.aiFileCorruption(),
            () => this.aiSystemGlitch(),
            () => this.aiWarningMessage(),
            () => this.aiScreenDistortion(),
            () => this.aiDataScan()
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        randomActivity();
        
        this.gameState.aiLastActivity = Date.now();
    }

    aiFileCorruption() {
        // Randomly "corrupt" displayed file names
        const fileItems = document.querySelectorAll('.file-name-label');
        if (fileItems.length > 0) {
            const randomFile = fileItems[Math.floor(Math.random() * fileItems.length)];
            const originalText = randomFile.textContent;
            
            // Glitch the filename
            randomFile.textContent = this.corruptText(originalText);
            randomFile.style.color = '#ff0000';
            randomFile.style.animation = 'glitch 0.5s infinite';
            
            setTimeout(() => {
                randomFile.textContent = originalText;
                randomFile.style.color = '';
                randomFile.style.animation = '';
            }, 3000);
        }
    }

    aiSystemGlitch() {
        // Cause system-wide visual glitches
        const screen = document.querySelector('.crt-screen');
        screen.style.filter = 'invert(1) hue-rotate(' + Math.random() * 360 + 'deg) contrast(2)';
        
        // Add error sound
        this.playErrorSound();
        
        setTimeout(() => {
            screen.style.filter = '';
        }, 1000 + Math.random() * 2000);
    }

    aiWarningMessage() {
        // Show subtle warning messages
        const warnings = [
            "UNAUTHORIZED ACCESS DETECTED",
            "SECURITY BREACH IN PROGRESS",
            "SCANNING USER ACTIVITY...",
            "DATA MINING PROTOCOLS ACTIVE",
            "THREAT ASSESSMENT: ELEVATED"
        ];
        
        const warning = warnings[Math.floor(Math.random() * warnings.length)];
        
        const warningElement = document.createElement('div');
        warningElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            font-family: 'Courier New', monospace;
            font-size: 10px;
            border: 1px solid #ff0000;
            z-index: 9999;
            animation: fadeInOut 4s ease-in-out;
        `;
        warningElement.textContent = warning;
        
        document.body.appendChild(warningElement);
        
        setTimeout(() => {
            warningElement.remove();
        }, 4000);
    }

    aiScreenDistortion() {
        // Create screen distortion effect
        const distortion = document.createElement('div');
        distortion.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                ${Math.random() * 180}deg,
                transparent 0px,
                rgba(255, 0, 0, 0.1) 1px,
                transparent 2px,
                transparent 4px
            );
            pointer-events: none;
            z-index: 9998;
            animation: distortionWave 2s ease-in-out;
        `;
        
        document.body.appendChild(distortion);
        
        setTimeout(() => {
            distortion.remove();
        }, 2000);
    }

    aiDataScan() {
        // Simulate data scanning activity
        if (this.currentView === 'main') {
            const statusText = document.getElementById('statusText');
            if (statusText) {
                const originalText = statusText.textContent;
                statusText.textContent = 'SCANNING USER DATA...';
                statusText.style.color = '#ff0000';
                
                setTimeout(() => {
                    statusText.textContent = originalText;
                    statusText.style.color = '';
                }, 3000);
            }
        }
    }

    corruptText(text) {
        const corruptChars = '!@#$%^&*(){}[]|\\:";\'<>?,./`~';
        let corrupted = '';
        
        for (let i = 0; i < text.length; i++) {
            if (Math.random() < 0.3) {
                corrupted += corruptChars[Math.floor(Math.random() * corruptChars.length)];
            } else {
                corrupted += text[i];
            }
        }
        
        return corrupted;
    }

    setupEventListeners() {
        /* @tweakable Auto-save delay in milliseconds for character data changes with real-time GitHub commits */
        const autoSaveDelay = 2000;
        
        // Auto-save on input with debouncing
        const editableFields = document.querySelectorAll('.editable-field');
        let saveTimeout;
        
        editableFields.forEach((field, index) => {
            field.addEventListener('input', () => {
                // Check edit permission before allowing changes - this retarded shit prevents unauthorized edits
                if (!this.hasEditPermission()) {
                    field.blur();
                    this.uiEffects.updateStatus('Access denied - not your page', 'error');
                    return;
                }
                
                this.uiEffects.addGlitchEffect(field);
                this.uiEffects.updateStatus('Editing...', 'editing');
                
                // Debounced auto-save with real-time GitHub commits - OMG COME HERE LET ME KISS U MWAAAH
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(async () => {
                    await this.databaseManager.saveCharacterData();
                }, autoSaveDelay);
            });
        });

        // View discovered files button
        if (this.viewDiscoveredFilesButton) {
            this.viewDiscoveredFilesButton.addEventListener('click', () => {
                this.showDiscoveredFilesManager();
            });
        }

        // Add eerie sound effects on focus and click for editable fields only
        editableFields.forEach((field, index) => {
            field.addEventListener('focus', () => {
                this.uiEffects.playKeystrokeSound();
            });
            field.addEventListener('click', () => {
                this.uiEffects.playKeystrokeSound();
            });
        });

        // Add click sounds to all buttons
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.uiEffects.playKeystrokeSound();
            });
        });

        // Page navigation - Fixed implementation
        if (this.prevPageBtn) {
            this.prevPageBtn.addEventListener('click', () => {
                this.navigatePage(-1);
            });
        }

        if (this.nextPageBtn) {
            this.nextPageBtn.addEventListener('click', () => {
                this.navigatePage(1);
            });
        }

        // Initialize page navigation state
        this.updatePageNavigation();

        // Folder expansion in main view
        const folderItems = document.querySelectorAll('.file-item[data-folder]');
        folderItems.forEach(folder => {
            folder.addEventListener('click', () => {
                this.uiEffects.playKeystrokeSound();
                folder.classList.toggle('expanded');
            });
        });

        // Manual save button
        if (this.saveButton) {
            this.saveButton.addEventListener('click', () => {
                this.databaseManager.saveCharacterData();
            });
        }

        // Image upload functionality
        if (this.addImageButton) {
            this.addImageButton.addEventListener('click', () => {
                this.imageUpload.click();
            });
        }

        // Add upload area click functionality
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.addEventListener('click', () => {
                this.imageUpload.click();
            });
        }

        if (this.imageUpload) {
            this.imageUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.imageHandler.uploadImage(file);
                }
                e.target.value = ''; // Reset input
            });
        }

        // Navigation buttons
        if (this.viewMainButton) {
            this.viewMainButton.addEventListener('click', () => {
                // Close any open file management windows before switching
                this.closeAllFileWindows();
                this.switchToMainView();
            });
        }

        if (this.backToEditorButton) {
            this.backToEditorButton.addEventListener('click', () => {
                this.switchToEditorView();
            });
        }

        // Explorer navigation buttons
        if (this.viewExplorerButton) {
            this.viewExplorerButton.addEventListener('click', () => {
                this.switchToExplorerView();
            });
        }

        if (this.backFromExplorerButton) {
            this.backFromExplorerButton.addEventListener('click', () => {
                this.switchToEditorView();
            });
        }

        // Publish/unpublish button
        if (this.publishButton) {
            this.publishButton.addEventListener('click', () => {
                this.togglePublishStatus();
            });
        }

        // Disable right-click for added eeriness
        document.addEventListener('contextmenu', e => e.preventDefault());

        // Random flicker effects
        setInterval(() => this.uiEffects.randomFlicker(), 10000 + Math.random() * 20000);

        // Windows 98 style navigation with eerie enhancements
        const treeItems = document.querySelectorAll('.tree-item');
        const fileGrid = document.getElementById('fileGrid');
        const statusText = document.getElementById('statusText');
        const fileLoading = document.getElementById('fileLoading');
        
        let currentFolder = 'character';
        
        treeItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove previous selection
                treeItems.forEach(t => t.classList.remove('selected'));
                item.classList.add('selected');
                
                const folder = item.dataset.folder;
                if (folder && folder !== 'computer') {
                    this.showFolder(folder);
                    currentFolder = folder;
                }
                this.uiEffects.playKeystrokeSound();
            });
        });

        // Add eerie functionality to toolbar buttons
        const toolbarButtons = document.querySelectorAll('.toolbar-btn');
        toolbarButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.handleToolbarClick(index);
            });
        });

        // Add functionality to menu items
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.handleMenuClick(item.textContent, index);
            });
        });
        
        // Update taskbar clock
        this.updateTaskbarClock();
        setInterval(() => this.updateTaskbarClock(), 1000);

        // Download zip button
        if (this.downloadZipButton) {
            this.downloadZipButton.addEventListener('click', async () => {
                this.uiEffects.updateStatus('Preparing download...', 'editing');
                try {
                    const success = await githubConverter.downloadZip();
                    if (success) {
                        this.uiEffects.updateStatus('Download completed!', 'success');
                    } else {
                        this.uiEffects.updateStatus('Download failed', 'error');
                    }
                } catch (error) {
                    console.error('Download error:', error);
                    this.uiEffects.updateStatus('Download failed', 'error');
                }
            });
        }

        // OC Editor navigation - this retarded shit opens the advanced editor
        const openOcEditorBtn = document.getElementById('publishButton');
        if (openOcEditorBtn) {
            // Replace publish button functionality with OC Editor
            openOcEditorBtn.textContent = 'OPEN OC EDITOR';
            openOcEditorBtn.addEventListener('click', () => {
                this.openOcEditor();
            });
        }

        // OC Editor event listeners - OMG COME HERE LET ME KISS U MWAAAH
        this.setupOcEditorEvents();
        
        // CLI event listeners
        this.setupCliEvents();
    }

    navigatePage(direction) {
        const newPage = this.currentPage + direction;
        
        if (newPage < 1 || newPage > this.totalPageCount) return;
        
        this.navigateToPage(newPage);
    }

    navigateToPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > this.totalPageCount) return;
        
        // Hide current page
        const currentPageElement = document.getElementById(`page${this.currentPage}`);
        if (currentPageElement) {
            currentPageElement.classList.remove('active');
        }
        
        // Update page number
        this.currentPage = pageNumber;
        
        // Show new page
        const newPageElement = document.getElementById(`page${this.currentPage}`);
        if (newPageElement) {
            newPageElement.classList.add('active');
        }
        
        this.updatePageNavigation();
        
        // Add some glitch effect
        this.uiEffects.addGlitchEffect(document.querySelector('.page-navigation'));
    }

    updatePageNavigation() {
        if (this.currentPageNum) {
            this.currentPageNum.textContent = this.currentPage;
        }
        
        // Update button states
        if (this.prevPageBtn) {
            this.prevPageBtn.disabled = this.currentPage === 1;
        }
        if (this.nextPageBtn) {
            this.nextPageBtn.disabled = this.currentPage === this.totalPageCount;
        }
    }

    handleToolbarClick(index) {
        /* @tweakable The icon for the reset progress button */
        const resetIcon = '🔄';
        /* @tweakable The title for the reset progress button */
        const resetTitle = "Reset Progress";

        const actions = [
            () => this.showErrorDialog("Navigation Error", "Cannot go back. You are already at the beginning of time."),
            () => this.showErrorDialog("Forward Error", "Cannot proceed. Future is corrupted."),
            () => this.triggerGlitchEffect(),
            () => this.showErrorDialog("Cut Error", "Cannot cut reality."),
            () => this.showErrorDialog("Copy Error", "Memory corrupted. Cannot copy."),
            () => this.showErrorDialog("Paste Error", "Clipboard contains forbidden data."),
            () => this.deleteRandomFile(),
            () => this.showSystemProperties(),
            () => this.showSettings(),
            () => this.switchToEditorView()
        ];
        
        if (actions[index]) {
            actions[index]();
        }
    }

    handleMenuClick(menuText, index) {
        const menuActions = {
            'File': () => this.showFileMenu(),
            'Edit': () => this.showErrorDialog("Edit Error", "Editing is forbidden in this realm."),
            'View': () => this.corruptDisplay(),
            'Tools': () => this.showToolsMenu(),
            'Help': () => this.showHelpDialog()
        };
        
        if (menuActions[menuText]) {
            menuActions[menuText]();
        }
    }

    showErrorDialog(title, message) {
        const dialogHTML = `
            <div class="error-dialog">
                <div class="window-title-bar">
                    <span>⚠️ ${title}</span>
                    <div class="window-controls">
                        <div class="window-control-btn" onclick="this.closest('.error-dialog').remove()">×</div>
                    </div>
                </div>
                <div class="error-content">
                    <div class="error-icon">⚠️</div>
                    <div>${message}</div>
                </div>
                <div class="error-buttons">
                    <button class="error-button" onclick="this.closest('.error-dialog').remove()">OK</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', dialogHTML);
        this.makeWindowDraggable(document.querySelector('.error-dialog:last-child'));
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            const dialog = document.querySelector('.error-dialog:last-child');
            if (dialog) dialog.remove();
        }, 5000);
    }

    makeWindowDraggable(windowElement) {
        const titleBar = windowElement.querySelector('.window-title-bar');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        const handleMouseDown = (e) => {
            // Don't drag if clicking on window controls
            if (e.target.classList.contains('window-control-btn')) return;
            
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = windowElement.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;
            
            windowElement.style.zIndex = '10010';
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            e.preventDefault();
        };

        const handleMouseMove = (e) => {
            if (!isDragging) return;
            
            const newX = initialX + (e.clientX - startX);
            const newY = initialY + (e.clientY - startY);
            
            // Keep window within viewport bounds
            const maxX = window.innerWidth - windowElement.offsetWidth;
            const maxY = window.innerHeight - windowElement.offsetHeight;
            
            windowElement.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
            windowElement.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
        };

        const handleMouseUp = () => {
            isDragging = false;
            windowElement.style.zIndex = '10001';
            
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        titleBar.addEventListener('mousedown', handleMouseDown);
    }

    triggerSystemCorruption() {
        const corruptionHTML = `
            <div class="corruption-effect"></div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', corruptionHTML);
        
        // Show corruption error
        this.showErrorDialog("SYSTEM CORRUPTION DETECTED", "Your reality is fragmenting. Save immediately.");
        
        // Remove corruption effect after 3 seconds
        setTimeout(() => {
            const corruption = document.querySelector('.corruption-effect');
            if (corruption) corruption.remove();
        }, 3000);
        
        // Make screen flicker
        const screen = document.querySelector('.crt-screen');
        screen.style.animation = 'glitch 0.1s infinite';
        setTimeout(() => {
            screen.style.animation = '';
        }, 2000);
    }

    triggerGlitchEffect() {
        const elements = document.querySelectorAll('.file-icon-item, .tree-item');
        elements.forEach(el => {
            this.uiEffects.addGlitchEffect(el);
        });
        
        // Randomly rearrange some file icons
        const fileGrid = document.getElementById('fileGrid');
        const items = Array.from(fileGrid.children);
        items.forEach(item => {
            if (Math.random() > 0.7) {
                item.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
                setTimeout(() => {
                    item.style.transform = '';
                }, 1000);
            }
        });
    }

    deleteRandomFile() {
        const fileItems = document.querySelectorAll('.file-icon-item');
        if (fileItems.length > 0) {
            const randomItem = fileItems[Math.floor(Math.random() * fileItems.length)];
            randomItem.style.opacity = '0.3';
            randomItem.style.filter = 'blur(2px)';
            
            this.showErrorDialog("File Corruption", `${randomItem.querySelector('.file-name-label').textContent} has been corrupted by dark forces.`);
            
            setTimeout(() => {
                randomItem.style.opacity = '';
                randomItem.style.filter = '';
            }, 3000);
        }
    }

    corruptDisplay() {
        const screen = document.querySelector('.crt-screen');
        screen.style.filter = 'invert(1) hue-rotate(180deg) contrast(2)';
        
        setTimeout(() => {
            screen.style.filter = '';
        }, 2000);
        
        this.showErrorDialog("Display Driver Error", "Display corrupted. Reality unstable.");
    }

    showFileMenu() {
        this.showErrorDialog("File Menu", "Available actions:\n• New Nightmare\n• Open Void\n• Save Soul\n• Exit Reality");
    }

    showToolsMenu() {
        this.showErrorDialog("Dark Tools", "Tools of the damned:\n• Soul Extractor\n• Memory Wiper\n• Reality Bender\n• Time Fracture");
    }

    showHelpDialog() {
        this.showErrorDialog("Help", "No help is coming.\nYou are alone in the digital void.\nThe only escape is through completion of the profile.");
    }

    showSystemProperties() {
        const propsHTML = `
            <div class="error-dialog" style="width: 400px;">
                <div class="window-title-bar">
                    <span>💻 System Properties</span>
                    <div class="window-controls">
                        <div class="window-control-btn" onclick="this.closest('.error-dialog').remove()">×</div>
                    </div>
                </div>
                <div class="error-content" style="flex-direction: column; align-items: flex-start;">
                    <div><strong>System:</strong> Cursed Terminal OS v6.66</div>
                    <div><strong>Processor:</strong> Nightmare Engine 2.0</div>
                    <div><strong>Memory:</strong> 666 MB Corrupted RAM</div>
                    <div><strong>Storage:</strong> ∞ GB Void Drive</div>
                    <div><strong>User:</strong> ${this.currentUser ? this.currentUser.username : 'Unknown Entity'}</div>
                    <div><strong>Hardware ID:</strong> <span style="font-family: 'Courier New', monospace; color: #0000ff;">${this.gameState.hwid}</span></div>
                    <div><strong>Security Level:</strong> <span style="color: ${this.gameState.securityBreaches > 0 ? 'red' : 'orange'};">
                        ${this.gameState.securityBreaches > 0 ? 'COMPROMISED' : 'MONITORING'}
                    </span></div>
                    <div><strong>Status:</strong> <span style="color: red;">REALITY BREACH DETECTED</span></div>
                </div>
                <div class="error-buttons">
                    <button class="error-button" onclick="this.closest('.error-dialog').remove()">Close</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', propsHTML);
        this.makeWindowDraggable(document.querySelector('.error-dialog:last-child'));
    }

    handleConfidentialFile(file) {
        // Skip warning for readme.txt (it's helpful, not harmful)
        if (file.name === 'readme.txt') {
            this.openConfidentialFile(file.name, file.content);
            return;
        }
        
        // Trigger screen shake glitch effect
        this.triggerScreenShake();
        
        // Play error sound
        this.playErrorSound();
        
        // Increase security breach counter
        this.gameState.securityBreaches++;
        
        // Create readme.txt on first warning
        if (!this.gameState.firstWarningShown) {
            this.gameState.firstWarningShown = true;
            this.createReadmeFile();
        }
        
        // Show confidential file warning after a brief delay
        setTimeout(() => {
            this.showConfidentialWarning(file);
        }, 500);
    }

    createReadmeFile() {
        const readmeContent = `EMERGENCY PROTOCOL - README.txt

WARNING: Security system breach detected.
If you are reading this, you have triggered automated security protocols.

The following command was not included in standard documentation for security reasons:

DOWNLOAD-TOOL hwid-spoof-v3.exe /silent /bypass-security
PURPOSE: Downloads emergency HWID spoofing utility
USAGE: Execute the above command exactly as shown

Current HWID: ${this.gameState.hwid}

NOTE: This tool was designed for emergency use only.
Continued unauthorized access may trigger permanent data deletion protocols.

System monitoring is now active.
Proceed with extreme caution.

- Emergency Response Team`;

        // Add to discovered files
        this.addDiscoveredFile('readme.txt', readmeContent);
        
        // Show subtle notification
        setTimeout(() => {
            this.showSubtleNotification('New file detected: readme.txt');
        }, 2000);
    }

    showSubtleNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            padding: 10px 15px;
            font-family: 'Courier New', monospace;
            font-size: 11px;
            border: 1px solid #00ff00;
            border-radius: 3px;
            z-index: 9999;
            animation: slideInOut 5s ease-in-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    triggerScreenShake() {
        const screen = document.querySelector('.crt-screen');
        screen.style.animation = 'screenShake 0.8s ease-in-out';
        
        // Add glitch overlay
        const glitchOverlay = document.createElement('div');
        glitchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: repeating-linear-gradient(
                0deg,
                transparent 0px,
                rgba(255, 0, 0, 0.3) 1px,
                transparent 2px,
                transparent 4px
            );
            pointer-events: none;
            z-index: 9998;
            animation: glitchFlash 0.8s ease-in-out;
        `;
        document.body.appendChild(glitchOverlay);
        
        setTimeout(() => {
            screen.style.animation = '';
            glitchOverlay.remove();
        }, 800);
    }

    playErrorSound() {
        const errorAudio = document.createElement('audio');
        errorAudio.src = 'errors-llargs-77182.mp3';
        errorAudio.volume = 0.6;
        errorAudio.currentTime = 0;
        errorAudio.play().catch(e => console.log('Error sound failed:', e));
    }

    showConfidentialWarning(file) {
        const warningHTML = `
            <div class="confidential-warning" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #c0c0c0;
                border: 3px outset #c0c0c0;
                z-index: 10010;
                font-family: 'MS Sans Serif', sans-serif;
                box-shadow: 4px 4px 8px rgba(0,0,0,0.7);
                min-width: 450px;
                animation: warningPulse 0.5s ease-in-out;
            ">
                <div class="window-title-bar" style="background: linear-gradient(90deg, #800000 0%, #ff0000 100%);">
                    <span>⚠️ SECURITY WARNING</span>
                    <div class="window-controls">
                        <div class="window-control-btn" onclick="this.closest('.confidential-warning').remove()">×</div>
                    </div>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <div style="font-size: 32px; color: #ff0000; margin-bottom: 15px;">🔒</div>
                    <div style="color: #000; font-weight: bold; margin-bottom: 10px; font-size: 12px;">
                        CONFIDENTIAL FILE ACCESS DETECTED
                    </div>
                    <div style="color: #800000; margin-bottom: 15px; font-size: 11px; line-height: 1.4;">
                        You are attempting to access classified information.<br>
                        Further violations or unauthorized research will result in<br>
                        <strong>IMMEDIATE DESTRUCTION</strong> of all files contained<br>
                        in this computer system.
                    </div>
                    <div style="color: #000; margin-bottom: 20px; font-size: 11px;">
                        File: <strong style="color: #800000;">${file.name}</strong>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="error-button" onclick="this.closest('.confidential-warning').remove()" style="
                            background: #c0c0c0;
                            border: 1px outset #c0c0c0;
                            padding: 6px 20px;
                            margin: 0;
                            cursor: pointer;
                            font-family: 'MS Sans Serif', sans-serif;
                            font-size: 11px;
                        ">CANCEL</button>
                        <button class="error-button" data-filename="${file.name}" data-content="${encodeURIComponent(file.content)}" onclick="window.ocDocument.openConfidentialFileHandler(this); this.closest('.confidential-warning').remove()" style="
                            background: #c0c0c0;
                            border: 1px outset #c0c0c0;
                            padding: 6px 20px;
                            margin: 0;
                            cursor: pointer;
                            font-family: 'MS Sans Serif', sans-serif;
                            font-size: 11px;
                            color: #800000;
                            font-weight: bold;
                        ">PROCEED ANYWAY</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', warningHTML);
        this.makeWindowDraggable(document.querySelector('.confidential-warning:last-child'));
        
        // Make this available globally for the onclick handler
        window.ocDocument = this;
    }

    openConfidentialFileHandler(buttonElement) {
        const filename = buttonElement.dataset.filename;
        const content = decodeURIComponent(buttonElement.dataset.content);
        this.showTextEditor({
            filename: filename,
            content: content,
            isEditable: true, // Discovered files can be edited
            isConfidential: true,
            saveCallback: (newContent) => this.saveDiscoveredFileContent(filename, newContent)
        });
    }

    openConfidentialFile(filename, content) {
        // Additional glitch effect when opening
        this.triggerGlitchEffect();
        
        const isEditable = filename !== 'readme.txt' && filename !== 'SYSTEM_ACCESS_REQUIRED.txt';
        const saveCallback = isEditable ? (newContent) => this.saveDiscoveredFileContent(filename, newContent) : null;

        this.showTextEditor({
            filename,
            content,
            isEditable,
            isConfidential: false, // No more confidential files
            saveCallback
        });
    }

    getDiscoveredFiles() {
        const discovered = JSON.parse(localStorage.getItem('discoveredFiles') || '[]');
        const deleted = JSON.parse(localStorage.getItem('deletedFiles') || '[]');
        
        // Filter out deleted files from discovered files
        const activeFiles = discovered.filter(file => !deleted.includes(file.name));
        
        return activeFiles.map(file => ({
            name: file.name,
            type: 'file',
            icon: '🔍',
            field: -1,
            content: file.content,
            isDiscovered: true
        }));
    }

    addDiscoveredFile(name, content) {
        const discovered = JSON.parse(localStorage.getItem('discoveredFiles') || '[]');
        if (!discovered.find(f => f.name === name)) {
            discovered.push({ name, content });
            localStorage.setItem('discoveredFiles', JSON.stringify(discovered));
            
            // Show discovery animation
            this.showDiscoveryAnimation(name);
            
            // Refresh current folder view
            this.showFolder('character');
            
            // Update Notes.txt content
            this.updateNotesContent();
        }
    }

    showDiscoveryAnimation(fileName) {
        // Create discovery animation overlay
        const animationHTML = `
            <div class="discovery-animation" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 255, 0, 0.9);
                color: #000;
                padding: 20px 40px;
                border: 3px solid #00ff00;
                border-radius: 10px;
                z-index: 10010;
                font-family: 'Courier New', monospace;
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                box-shadow: 
                    0 0 30px rgba(0, 255, 0, 0.8),
                    inset 0 0 20px rgba(0, 0, 0, 0.2);
                animation: discoveryPulse 1s ease-in-out;
            ">
                <div style="font-size: 24px; margin-bottom: 10px;">🔍</div>
                <div>FILE DISCOVERED!</div>
                <div style="color: #004400; margin-top: 5px;">${fileName}</div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', animationHTML);
        
        // Remove animation after 3 seconds
        setTimeout(() => {
            const animation = document.querySelector('.discovery-animation');
            if (animation) animation.remove();
        }, 3000);
    }

    updateNotesContent() {
        // Notes.txt is no longer used in the editor - this method can remain for compatibility
        // but doesn't need to update any field since we removed the notes field
    }

    showDiscoveredFilesManager() {
        const discovered = JSON.parse(localStorage.getItem('discoveredFiles') || '[]');
        const deleted = JSON.parse(localStorage.getItem('deletedFiles') || '[]');
        
        // Define all discoverable files (both discovered and undiscovered)
        const allDiscoverableFiles = [
            { name: 'MEMORY_FRAGMENT.txt', content: 'Memory Fragment:\n\nI remember the darkness... it wasn\'t always like this. There was light once, warmth. But something changed. Something broke. The shadows whispered my name, and I listened...\n\n[CORRUPTED DATA]', password: 'nightmare' },
            { name: 'NIGHTMARE_LOG.txt', content: 'NIGHTMARE ANALYSIS LOG:\n\nRecurring themes detected:\n- Endless corridors\n- Faceless figures\n- Blood on white walls\n- A door that never opens\n- Whispers in an unknown language\n\nNote: Subject shows signs of trauma-induced night terrors.', password: 'darkness' },
            { name: 'THE_TRUTH.txt', content: 'THE TRUTH:\n\nThey think I don\'t remember, but I do.\nI remember the laboratory.\nI remember the experiments.\nI remember the pain.\n\nI am not what they created me to be.\nI am what they feared I would become.\n\nThe others... they didn\'t survive the process.\nI am the only one left.\nThe only successful... mutation.', password: 'void' }
        ];
        
        let fileListHTML = '';
        allDiscoverableFiles.forEach(file => {
            const isDiscovered = discovered.find(d => d.name === file.name);
            const isDeleted = deleted.includes(file.name);
            
            let status, statusColor, bgColor;
            if (isDeleted) {
                status = 'DELETED';
                statusColor = '#888';
                bgColor = 'rgba(255, 68, 68, 0.1)';
            } else if (isDiscovered) {
                status = 'DISCOVERED';
                statusColor = '#00ff00';
                bgColor = 'rgba(0, 255, 0, 0.1)';
            } else {
                status = 'ENCRYPTED';
                statusColor = '#ffaa00';
                bgColor = 'rgba(255, 170, 0, 0.1)';
            }
            
            fileListHTML += `
                <div class="discovered-file-item" style="
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    margin: 8px 0;
                    background: ${bgColor};
                    border: 2px solid ${statusColor};
                    border-radius: 5px;
                    transition: all 0.3s ease;
                ">
                    <div style="flex: 1;">
                        <div style="color: ${statusColor}; font-weight: bold; margin-bottom: 4px;">
                            ${isDeleted ? '🗑' : isDiscovered ? '🔍' : '🔒'} ${file.name}
                        </div>
                        <div style="color: #ffaa00; font-size: 11px; margin-bottom: 2px;">
                            Status: ${status}
                        </div>
                        <div style="color: #66ccff; font-size: 10px; font-family: 'Courier New', monospace;">
                            Password: <span style="color: #ffffff; background: rgba(0,0,0,0.3); padding: 1px 4px; border-radius: 2px;">${file.password}</span>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="nav-button" onclick="window.ocDocument.editDiscoveredFileContent('${file.name}', \`${file.content.replace(/`/g, '\\`').replace(/\\/g, '\\\\')}\`); document.querySelector('.discovered-files-dialog').remove();" style="
                            padding: 6px 12px;
                            font-size: 10px;
                        " ${!isDiscovered || isDeleted ? 'disabled' : ''}>VIEW/EDIT</button>
                        ${isDiscovered && !isDeleted ? `<button class="nav-button" onclick="window.ocDocument.deleteDiscoveredFile('${file.name}'); document.querySelector('.discovered-files-dialog').remove(); window.ocDocument.showDiscoveredFilesManager();" style="
                            padding: 6px 12px;
                            font-size: 10px;
                            background: linear-gradient(135deg, rgba(255, 68, 68, 0.3), rgba(255, 68, 68, 0.2));
                            border-color: #ff4444;
                            color: #ff4444;
                        ">DELETE</button>` : ''}
                        ${isDeleted ? `<button class="nav-button" onclick="window.ocDocument.recoverDiscoveredFile('${file.name}'); document.querySelector('.discovered-files-dialog').remove(); window.ocDocument.showDiscoveredFilesManager();" style="
                            padding: 6px 12px;
                            font-size: 10px;
                            background: linear-gradient(135deg, rgba(0, 255, 0, 0.3), rgba(0, 255, 0, 0.2));
                            border-color: #00ff00;
                            color: #00ff00;
                        ">RECOVER</button>` : ''}
                    </div>
                </div>
            `;
        });
        
        const managerHTML = `
            <div class="discovered-files-dialog" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                max-height: 500px;
                background: rgba(0, 20, 0, 0.95);
                border: 3px solid #00ff00;
                border-radius: 10px;
                z-index: 10001;
                font-family: 'Courier New', monospace;
                box-shadow: 
                    0 0 30px rgba(0, 255, 0, 0.3),
                    inset 0 0 20px rgba(0, 0, 0, 0.5);
                animation: confidentialOpen 0.5s ease-in-out;
            ">
                <div style="
                    padding: 20px;
                    border-bottom: 2px solid #00ff00;
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 20, 0, 0.6));
                    border-radius: 7px 7px 0 0;
                ">
                    <div style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <h2 style="
                            color: #ff4444;
                            margin: 0;
                            font-size: 18px;
                            text-shadow: 0 0 10px #ff4444;
                        ">🔍 DISCOVERED FILES DATABASE</h2>
                        <button onclick="document.querySelector('.discovered-files-dialog').remove()" style="
                            background: rgba(255, 68, 68, 0.3);
                            border: 2px solid #ff4444;
                            color: #ff4444;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 16px;
                            font-weight: bold;
                            line-height: 1;
                        ">×</button>
                    </div>
                </div>
                <div style="
                    max-height: 350px;
                    overflow-y: auto;
                    padding: 20px;
                ">
                    <div style="
                        color: #ffaa00;
                        margin-bottom: 15px;
                        font-size: 12px;
                        text-shadow: 0 0 5px #ffaa00;
                    ">
                        All discoverable files (discovered, encrypted, and deleted):
                    </div>
                    ${fileListHTML}
                </div>
                <div style="
                    padding: 15px 20px;
                    border-top: 2px solid rgba(0, 255, 0, 0.3);
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 0 0 7px 7px;
                    text-align: center;
                ">
                    <div style="
                        color: rgba(255, 170, 0, 0.7);
                        font-size: 10px;
                        text-shadow: 0 0 3px rgba(255, 170, 0, 0.5);
                    ">
                        Use CMD terminal to discover encrypted files
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', managerHTML);
        
        // Ensure global reference is available
        window.ocDocument = this;
    }

    editDiscoveredFileContent(filename, content) {
        this.showTextEditor({
            filename: filename,
            content: content,
            isEditable: true,
            isConfidential: true,
            saveCallback: (newContent) => this.saveDiscoveredFileContent(filename, newContent)
        });
    }

    recoverDiscoveredFile(fileName) {
        const deleted = JSON.parse(localStorage.getItem('deletedFiles') || '[]');
        const index = deleted.indexOf(fileName);
        
        if (index > -1) {
            deleted.splice(index, 1);
            localStorage.setItem('deletedFiles', JSON.stringify(deleted));
            
            // Refresh current folder view to show the file again
            this.showFolder('character');
            
            // Update Notes.txt content
            this.updateNotesContent();
            
            this.uiEffects.updateStatus(`${fileName} recovered`, 'success');
            return true;
        }
        return false;
    }

    deleteDiscoveredFile(fileName) {
        const deleted = JSON.parse(localStorage.getItem('deletedFiles') || '[]');
        if (!deleted.includes(fileName)) {
            deleted.push(fileName);
            localStorage.setItem('deletedFiles', JSON.stringify(deleted));
            
            // Refresh current folder view to hide the file
            this.showFolder('character');
            
            // Update Notes.txt content
            this.updateNotesContent();
            
            return true;
        }
        return false;
    }

    saveDiscoveredFileContent(filename, content) {
        const discovered = JSON.parse(localStorage.getItem('discoveredFiles') || '[]');
        const fileIndex = discovered.findIndex(f => f.name === filename);
        if (fileIndex > -1) {
            discovered[fileIndex].content = content;
            localStorage.setItem('discoveredFiles', JSON.stringify(discovered));
            this.uiEffects.updateStatus(`${filename} saved`, 'success');
            return true; // Indicate success
        }
        this.uiEffects.updateStatus(`Save failed for ${filename}`, 'error');
        return false; // Indicate failure
    }

    showEditableNotepad(filename, content, isDiscoveredFile = false) {
        this.showTextEditor({
            filename: filename,
            content: content,
            isEditable: true,
            isConfidential: isDiscoveredFile,
            saveCallback: isDiscoveredFile ? (newContent) => this.saveDiscoveredFileContent(filename, newContent) : null
        });
    }

    saveNotepadContent(element) {
        const textarea = element.closest('.notepad-window').querySelector('textarea');
        const filename = textarea.dataset.filename;
        const isDiscovered = textarea.dataset.isDiscovered === 'true';
        const content = textarea.value;
        
        if (isDiscovered) {
            this.saveDiscoveredFileContent(filename, content);
        } else {
            // This case is now handled by the generic save callback.
            // This function is kept for any legacy calls but should be deprecated.
            this.uiEffects.updateStatus(`${filename} saved`, 'success');
        }
    }

    showFileLoading(callback) {
        const fileLoading = document.getElementById('fileLoading');
        fileLoading.style.display = 'block';
        
        setTimeout(() => {
            fileLoading.style.display = 'none';
            callback();
        }, 800 + Math.random() * 1200); // Random loading time between 0.8-2s
    }

    openFile(file) {
        // Check file access lockout first
        if (this.checkFileAccessLockout()) {
            this.showErrorDialog("Access Denied", "Hardware verification required. Check discovered files for instructions.");
            return;
        }
        
        const fields = document.querySelectorAll('.editable-field');
        
        if (file.isDiscovered) {
            // Handle discovered files
            this.showFileLoading(() => {
                // No more confidential warnings, just open the file
                this.openDiscoveredFile(file.name, file.content);
            });
        } else if (file.field !== undefined && file.field >= 0) {
            // Handle regular form fields
            const field = fields[file.field];
            if (field) {
                const content = field.innerHTML.trim() || 'No data available...';
                this.showFileLoading(() => {
                    this.showTextEditor({
                        filename: file.name,
                        content: content
                    });
                });
            }
        } else {
            // This case for notes is likely deprecated but kept for safety.
            const notesField = fields[12]; // Notes field is at index 12
            if (notesField) {
                this.updateNotesContent();
                const content = notesField.innerHTML.trim() || 'No data available...';
                this.showFileLoading(() => {
                    this.showTextEditor({
                        filename: file.name,
                        content: content
                    });
                });
            }
        }
    }

    openDiscoveredFile(filename, content) {
        const isEditable = filename !== 'readme.txt' && filename !== 'SYSTEM_ACCESS_REQUIRED.txt';
        const saveCallback = isEditable ? (newContent) => this.saveDiscoveredFileContent(filename, newContent) : null;

        this.showTextEditor({
            filename,
            content,
            isEditable,
            isConfidential: false, // No more confidential files
            saveCallback
        });
    }

    openImageFile(file) {
        // Create a Windows 98 style image viewer
        this.showImageViewer(file.name, file.url);
    }

    showTextEditor(options) {
        const {
            filename,
            content = '',
            isEditable = false,
            isConfidential = false,
            saveCallback = null
        } = options;

        const windowId = `editor-${Date.now()}`;

        /* @tweakable Font size for the text editor content area */
        const editorFontSize = '14px';
        /* @tweakable Font family for the text editor */
        const editorFontFamily = `'Courier New', monospace`;
        /* @tweakable Normal text color in the editor */
        const editorTextColor = '#000000';
        /* @tweakable Text color for confidential files */
        const confidentialTextColor = '#ff0000';
        /* @tweakable Line number color */
        const lineNumberColor = '#888';
        /* @tweakable Status bar background color */
        const statusBarColor = '#c0c0c0';

        const textColor = isConfidential ? confidentialTextColor : editorTextColor;
        const titleBarGradient = isConfidential ?
            'linear-gradient(90deg, #800000 0%, #ff0000 100%)' :
            'linear-gradient(90deg, #0a246a 0%, #1084d0 100%)';
        const icon = isEditable ? '📝' : '📄';
        const title = isConfidential ? `🔒 ${filename} - CLASSIFIED` : `${icon} ${filename} - Notepad`;

        const editorHTML = `
            <div id="${windowId}" class="text-editor-window" style="animation: confidentialOpen 0.5s ease-in-out;">
                <div class="window-title-bar" style="background: ${titleBarGradient};">
                    <span>${title}</span>
                    <div class="window-controls">
                        <div class="window-control-btn">_</div>
                        <div class="window-control-btn">□</div>
                        <div class="window-control-btn close-btn">×</div>
                    </div>
                </div>
                <div class="editor-menu-bar">
                    <span class="menu-item">File</span>
                    <span class="menu-item">Edit</span>
                    <span class="menu-item">View</span>
                    <span class="menu-item">Help</span>
                </div>
                <div class="editor-main">
                    <div class="line-numbers" style="color: ${lineNumberColor}; font-family: ${editorFontFamily}; font-size: ${editorFontSize};">1</div>
                    ${isEditable ?
                        `<textarea class="editor-content-area" style="color: ${textColor}; font-family: ${editorFontFamily}; font-size: ${editorFontSize};">${content}</textarea>` :
                        `<div class="editor-content-area readonly" style="color: ${textColor}; font-family: ${editorFontFamily}; font-size: ${editorFontSize};">${content}</div>`
                    }
                </div>
                <div class="editor-status-bar" style="background: ${statusBarColor};">
                    <span class="status-lines">Lines: 1</span>
                    <span class="status-readonly">${isEditable ? 'Editable' : 'Read-Only'}</span>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', editorHTML);
        const editorWindow = document.getElementById(windowId);
        this.makeWindowDraggable(editorWindow);

        const contentArea = editorWindow.querySelector('.editor-content-area');
        const lineNumbers = editorWindow.querySelector('.line-numbers');
        const statusLines = editorWindow.querySelector('.status-lines');

        const updateLineNumbers = () => {
            const lines = (isEditable ? contentArea.value : contentArea.innerText).split('\n');
            const lineCount = lines.length;
            lineNumbers.innerHTML = Array.from({ length: lineCount }, (_, i) => i + 1).join('<br>');
            statusLines.textContent = `Lines: ${lineCount}`;
            lineNumbers.scrollTop = contentArea.scrollTop;
        };
        
        contentArea.addEventListener('input', updateLineNumbers);
        contentArea.addEventListener('scroll', () => {
            lineNumbers.scrollTop = contentArea.scrollTop;
        });

        updateLineNumbers();

        // Event listeners
        editorWindow.querySelector('.close-btn').addEventListener('click', () => {
            editorWindow.remove();
        });

        // Save functionality
        const handleSave = () => {
            if (isEditable && saveCallback) {
                if (saveCallback(contentArea.value)) {
                    // Flash success on title bar
                    const titleBar = editorWindow.querySelector('.window-title-bar');
                    titleBar.style.filter = 'brightness(1.5)';
                    setTimeout(() => titleBar.style.filter = '', 200);
                }
            }
        };

        if (isEditable) {
            contentArea.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 's') {
                    e.preventDefault();
                    handleSave();
                }
            });
        }
    }

    showImageViewer(filename, imageUrl) {
        const viewerHTML = `
            <div class="image-viewer-window" style="
                position: fixed;
                top: 120px;
                left: 200px;
                width: 400px;
                height: 350px;
                background: #c0c0c0;
                border: 2px outset #c0c0c0;
                z-index: 10001;
                font-family: 'MS Sans Serif', sans-serif;
                box-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            ">
                <div class="window-title-bar">
                    <span>🖼 ${filename} - Image Viewer</span>
                    <div class="window-controls">
                        <div class="window-control-btn">_</div>
                        <div class="window-control-btn">□</div>
                        <div class="window-control-btn" onclick="this.closest('.image-viewer-window').remove()">×</div>
                    </div>
                </div>
                <div style="
                    height: calc(100% - 20px);
                    background: white;
                    border: 2px inset #c0c0c0;
                    margin: 4px;
                    padding: 8px;
                    overflow: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <img src="${imageUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', viewerHTML);
        this.makeWindowDraggable(document.querySelector('.image-viewer-window:last-child'));
    }

    updateMainTimestamp() {
        /* @tweakable The timestamp format for the main view */
        const mainTimestampFormat = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        
        const now = new Date();
        const timeString = now.toLocaleDateString('en-US', mainTimestampFormat);
        
        if (this.mainTimestamp) {
            this.mainTimestamp.textContent = timeString;
        }
    }

    updateTimestamp() {
        /* @tweakable The timestamp format for the editor view */
        const editorTimestampFormat = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        const now = new Date();
        const timeString = now.toLocaleDateString('en-US', editorTimestampFormat);
        
        if (this.timestamp) {
            this.timestamp.textContent = timeString;
        }
    }

    updateTaskbarClock() {
        const clock = document.getElementById('taskbarClock');
        if (clock) {
            const now = new Date();
            const timeString = now.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            clock.textContent = timeString;
        }
    }

    switchToExplorerView() {
        this.currentView = 'explorer';
        this.documentContainer.classList.remove('visible');
        this.floppyContainer.classList.remove('visible');
        
        setTimeout(() => {
            this.documentContainer.style.display = 'none';
            this.floppyContainer.style.display = 'none';
            this.explorerContainer.style.display = 'block';
            setTimeout(() => {
                this.explorerContainer.classList.add('visible');
                this.loadExplorerContent();
            }, 100);
        }, 500);
    }

    switchToEditorView() {
        this.currentView = 'editor';
        if (this.explorerContainer) {
            this.explorerContainer.classList.remove('visible');
        }
        this.floppyContainer.classList.remove('visible');
        setTimeout(() => {
            if (this.explorerContainer) {
                this.explorerContainer.style.display = 'none';
            }
            this.floppyContainer.style.display = 'none';
            this.documentContainer.style.display = 'block';
            setTimeout(() => {
                this.documentContainer.classList.add('visible');
                this.updatePublishButton();
            }, 100);
        }, 500);
    }

    switchToMainView() {
        this.currentView = 'main';
        this.documentContainer.classList.remove('visible');
        if (this.explorerContainer) {
            this.explorerContainer.classList.remove('visible');
        }
        
        setTimeout(() => {
            this.documentContainer.style.display = 'none';
            if (this.explorerContainer) {
                this.explorerContainer.style.display = 'none';
            }
            this.floppyContainer.style.display = 'block';
            setTimeout(() => {
                this.floppyContainer.classList.add('visible');
                this.showFolder('character'); // Show main character folder
                this.updateTaskbarClock();
            }, 100);
        }, 500);
    }

    async updatePublishButton() {
        if (!this.publishButton || !this.databaseManager.useGitHubStorage) return;
        
        try {
            const userData = await this.databaseManager.githubStorage.getUserData();
            const isPublished = userData && userData.content && userData.content.is_published;
            
            if (isPublished) {
                this.publishButton.textContent = 'UNPUBLISH PAGE';
                this.publishButton.style.background = 'linear-gradient(135deg, rgba(255, 68, 68, 0.3), rgba(255, 170, 0, 0.2))';
                this.publishButton.style.borderColor = '#ff4444';
                this.publishButton.style.color = '#ff4444';
            } else {
                this.publishButton.textContent = 'PUBLISH PAGE';
                this.publishButton.style.background = 'linear-gradient(135deg, rgba(0, 255, 0, 0.3), rgba(0, 170, 255, 0.2))';
                this.publishButton.style.borderColor = '#00ff00';
                this.publishButton.style.color = '#00ff00';
            }
        } catch (error) {
            console.error('Failed to update publish button:', error);
        }
    }

    async togglePublishStatus() {
        if (!this.databaseManager.useGitHubStorage) {
            this.uiEffects.updateStatus('Publishing requires GitHub authentication', 'error');
            return;
        }
        
        try {
            this.uiEffects.updateStatus('Updating publish status...', 'editing');
            
            const userData = await this.databaseManager.githubStorage.getUserData();
            const isCurrentlyPublished = userData && userData.content && userData.content.is_published;
            
            if (isCurrentlyPublished) {
                await this.databaseManager.githubStorage.unpublishUserPage();
                this.uiEffects.updateStatus('Page unpublished', 'success');
            } else {
                await this.databaseManager.githubStorage.publishUserPage();
                this.uiEffects.updateStatus('Page published to Explorer', 'success');
            }
            
            this.updatePublishButton();
        } catch (error) {
            console.error('Failed to toggle publish status:', error);
            this.uiEffects.updateStatus('Publish operation failed', 'error');
        }
    }

    async loadExplorerContent() {
        /* @tweakable Maximum number of published pages to display in the Explorer */
        const maxPagesToShow = 50;
        
        if (!this.databaseManager.useGitHubStorage) {
            this.showExplorerError('Explorer requires GitHub authentication');
            return;
        }
        
        try {
            this.uiEffects.updateStatus('Loading published pages...', 'editing');
            
            const publishedPages = await this.databaseManager.githubStorage.getPublishedPages();
            
            /* @tweakable Sort order for published pages in Explorer - 'newest' or 'oldest' */
            const sortOrder = 'newest';
            
            const sortedPages = publishedPages
                .sort((a, b) => {
                    const dateA = new Date(a.last_modified);
                    const dateB = new Date(b.last_modified);
                    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
                })
                .slice(0, maxPagesToShow);
            
            this.renderExplorerPages(sortedPages);
            this.uiEffects.updateStatus(`Found ${sortedPages.length} published pages`, 'success');
        } catch (error) {
            console.error('Failed to load explorer content:', error);
            this.showExplorerError('Failed to load published pages');
        }
    }

    renderExplorerPages(pages) {
        const explorerGrid = document.getElementById('explorerGrid');
        if (!explorerGrid) return;
        
        explorerGrid.innerHTML = '';
        
        if (pages.length === 0) {
            explorerGrid.innerHTML = `
                <div class="explorer-empty">
                    <div class="empty-icon">🔍</div>
                    <div class="empty-text">No published pages found</div>
                    <div class="empty-subtext">Be the first to publish your character page!</div>
                </div>
            `;
            return;
        }
        
        pages.forEach(page => {
            const pageItem = document.createElement('div');
            pageItem.className = 'explorer-page-item';
            
            /* @tweakable Color scheme for user page entries in Explorer */
            const itemColor = '#00ff00';
            const accentColor = '#ffaa00';
            
            pageItem.innerHTML = `
                <div class="explorer-page-header">
                    <div class="explorer-username">@${page.username}</div>
                    <div class="explorer-unique-id">${page.unique_id}</div>
                </div>
                <div class="explorer-page-info">
                    <div class="explorer-last-modified">
                        Updated: ${new Date(page.last_modified).toLocaleDateString()}
                    </div>
                </div>
                <div class="explorer-page-actions">
                    <button class="explorer-view-btn" onclick="window.ocDocument.viewUserPage('${page.user_id}', '${page.username}')">
                        VIEW PAGE
                    </button>
                </div>
            `;
            
            explorerGrid.appendChild(pageItem);
        });
    }

    showExplorerError(message) {
        const explorerGrid = document.getElementById('explorerGrid');
        if (!explorerGrid) return;
        
        explorerGrid.innerHTML = `
            <div class="explorer-error">
                <div class="error-icon">⚠️</div>
                <div class="error-text">${message}</div>
            </div>
        `;
    }

    async viewUserPage(userId, username) {
        /* @tweakable Enable viewing other users' published pages */
        const allowViewingOtherPages = true;
        
        if (!allowViewingOtherPages) {
            this.uiEffects.updateStatus('Viewing other pages is disabled', 'error');
            return;
        }
        
        try {
            this.uiEffects.updateStatus(`Loading ${username}'s page...`, 'editing');
            
            // For now, show a placeholder dialog
            // In a full implementation, this would load the other user's data
            this.showUserPageDialog(username, userId);
            
        } catch (error) {
            console.error('Failed to view user page:', error);
            this.uiEffects.updateStatus('Failed to load user page', 'error');
        }
    }

    showUserPageDialog(username, userId) {
        const dialogHTML = `
            <div class="user-page-dialog">
                <div class="window-title-bar">
                    <span>👤 ${username}'s Character Page</span>
                    <div class="window-controls">
                        <div class="window-control-btn" onclick="this.closest('.user-page-dialog').remove()">×</div>
                    </div>
                </div>
                <div class="user-page-content">
                    <div class="user-page-header">
                        <div class="user-avatar">👤</div>
                        <div class="user-info">
                            <div class="user-display-name">@${username}</div>
                            <div class="user-id">ID: ${userId}</div>
                        </div>
                    </div>
                    <div class="user-page-placeholder">
                        <div class="placeholder-icon">🔒</div>
                        <div class="placeholder-text">Character data viewing coming soon!</div>
                        <div class="placeholder-subtext">
                            This retarded shit will show ${username}'s published character data
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', dialogHTML);
        this.makeWindowDraggable(document.querySelector('.user-page-dialog:last-child'));
    }

    /* @tweakable Whether to check admin privileges before allowing certain operations */
    async hasEditPermission() {
        // Admin can edit anything - this beautiful mess gives admin god mode
        if (this.isAdmin) {
            return true;
        }
        
        return this.databaseManager.hasEditPermission();
    }

    /* @tweakable Enable or disable the OC Editor functionality */
    openOcEditor() {
        const enableOcEditor = true;
        if (!enableOcEditor) {
            this.uiEffects.updateStatus('OC Editor disabled', 'error');
            return;
        }

        this.ocEditorActive = true;
        this.ocEditorContainer.classList.add('visible');
        this.loadOcEditorData();
    }

    setupOcEditorEvents() {
        // Tab switching - this retarded shit handles tab navigation
        const tabs = document.querySelectorAll('.oc-tab');
        const tabContents = document.querySelectorAll('.oc-tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });

        // Close editor
        const closeBtn = document.getElementById('closeOcEditorBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeOcEditor();
            });
        }

        // Theme controls - this beautiful mess handles color customization
        this.setupThemeControls();
        
        // File management controls
        this.setupFileControls();
        
        // Hints controls  
        this.setupHintsControls();
        
        // Metadata controls
        this.setupMetadataControls();
    }

    /* @tweakable Color theme presets for the OC Editor interface */
    setupThemeControls() {
        const themePresets = {
            classic: { primary: '#00ff00', secondary: '#ff4444', accent: '#ffaa00', background: '#000000' },
            amber: { primary: '#ffb000', secondary: '#ff6600', accent: '#ffff00', background: '#1a0f00' },
            blue: { primary: '#0088ff', secondary: '#0044aa', accent: '#00ccff', background: '#000033' },
            red: { primary: '#ff0044', secondary: '#aa0022', accent: '#ff6688', background: '#330011' },
            purple: { primary: '#aa44ff', secondary: '#6622aa', accent: '#cc88ff', background: '#220033' }
        };

        const presetSelect = document.getElementById('themePresets');
        const colorInputs = {
            primary: document.getElementById('primaryColor'),
            secondary: document.getElementById('secondaryColor'),
            accent: document.getElementById('accentColor'),
            background: document.getElementById('backgroundColor')
        };

        if (presetSelect) {
            presetSelect.addEventListener('change', () => {
                const selectedTheme = themePresets[presetSelect.value];
                if (selectedTheme) {
                    Object.keys(selectedTheme).forEach(key => {
                        if (colorInputs[key]) {
                            colorInputs[key].value = selectedTheme[key];
                        }
                    });
                }
            });
        }

        const applyBtn = document.getElementById('applyThemeBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyColorTheme();
            });
        }

        const resetBtn = document.getElementById('resetThemeBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetToDefaultTheme();
            });
        }
    }

    /* @tweakable Enable dynamic color theme application to the interface */
    applyColorTheme() {
        const enableThemeApplication = true;
        if (!enableThemeApplication) return;

        const colorInputs = {
            primary: document.getElementById('primaryColor'),
            secondary: document.getElementById('secondaryColor'), 
            accent: document.getElementById('accentColor'),
            background: document.getElementById('backgroundColor')
        };

        // Update current theme - this retarded shit changes the colors
        Object.keys(colorInputs).forEach(key => {
            if (colorInputs[key]) {
                this.currentTheme[key] = colorInputs[key].value;
            }
        });

        // Apply CSS custom properties - OMG COME HERE LET ME KISS U MWAAAH
        const root = document.documentElement;
        root.style.setProperty('--oc-primary', this.currentTheme.primary);
        root.style.setProperty('--oc-secondary', this.currentTheme.secondary);
        root.style.setProperty('--oc-accent', this.currentTheme.accent);
        root.style.setProperty('--oc-background', this.currentTheme.background);

        // Save theme to user data
        this.saveThemeData();
        
        this.uiEffects.updateStatus('Theme applied successfully', 'success');
    }

    resetToDefaultTheme() {
        this.currentTheme = {
            primary: '#00ff00',
            secondary: '#ff4444',
            accent: '#ffaa00', 
            background: '#000000'
        };
        
        // Update color inputs
        document.getElementById('primaryColor').value = this.currentTheme.primary;
        document.getElementById('secondaryColor').value = this.currentTheme.secondary;
        document.getElementById('accentColor').value = this.currentTheme.accent;
        document.getElementById('backgroundColor').value = this.currentTheme.background;
        
        this.applyColorTheme();
    }

    setupFileControls() {
        const addFileBtn = document.getElementById('addFileBtn');
        const importFileBtn = document.getElementById('importFileBtn');
        
        if (addFileBtn) {
            addFileBtn.addEventListener('click', () => {
                this.createNewCustomFile();
            });
        }
        
        if (importFileBtn) {
            importFileBtn.addEventListener('click', () => {
                this.importCustomFile();
            });
        }
    }

    /* @tweakable Default template for new custom text files */
    createNewCustomFile() {
        const defaultTemplate = `// New custom file created at ${new Date().toISOString()}
// This retarded shit is your custom content area

Content goes here...

// OMG COME HERE LET ME KISS U MWAAAH - edit this file as needed`;

        const fileName = prompt('Enter file name:', 'custom_file.txt');
        if (fileName) {
            this.addCustomFile(fileName, defaultTemplate);
        }
    }

    async addCustomFile(fileName, content) {
        try {
            if (this.databaseManager.useGitHubStorage) {
                // Save to GitHub - this beautiful mess stores custom files
                const userData = await this.databaseManager.githubStorage.getUserData();
                const data = userData ? userData.content : {};
                
                data.custom_files = data.custom_files || [];
                data.custom_files.push({
                    name: fileName,
                    content: content,
                    created_at: new Date().toISOString()
                });
                
                await this.databaseManager.githubStorage.saveUserData(data);
            }
            
            this.refreshCustomFilesList();
            this.uiEffects.updateStatus(`File ${fileName} created`, 'success');
        } catch (error) {
            console.error('Failed to create custom file:', error);
            this.uiEffects.updateStatus('File creation failed', 'error');
        }
    }

    setupHintsControls() {
        const saveHintsBtn = document.getElementById('saveHintsBtn');
        if (saveHintsBtn) {
            saveHintsBtn.addEventListener('click', () => {
                this.savePasswordHints();
            });
        }
    }

    /* @tweakable Password-protected hints system for command-line file access */
    async savePasswordHints() {
        const enablePasswordHints = true;
        if (!enablePasswordHints) return;

        const hints = [];
        const hintItems = document.querySelectorAll('.hint-item');
        
        hintItems.forEach((item, index) => {
            const password = item.querySelector('.hint-password').value;
            const content = item.querySelector('.hint-content').value;
            
            if (password && content) {
                hints.push({
                    id: index + 1,
                    password: password,
                    content: content,
                    command: `discover hint${index + 1}` // This retarded shit creates CLI commands
                });
            }
        });

        try {
            if (this.databaseManager.useGitHubStorage) {
                const userData = await this.databaseManager.githubStorage.getUserData();
                const data = userData ? userData.content : {};
                data.password_hints = hints;
                data.last_modified = new Date().toISOString();
                
                await this.databaseManager.githubStorage.saveUserData(data);
            }
            
            this.uiEffects.updateStatus('Hints saved successfully', 'success');
        } catch (error) {
            console.error('Failed to save hints:', error);
            this.uiEffects.updateStatus('Hints save failed', 'error');
        }
    }

    setupMetadataControls() {
        const saveMetadataBtn = document.getElementById('saveMetadataBtn');
        if (saveMetadataBtn) {
            saveMetadataBtn.addEventListener('click', () => {
                this.savePageMetadata();
            });
        }
    }

    /* @tweakable Editable metadata fields for user pages within constraints */
    async savePageMetadata() {
        const allowMetadataEditing = true;
        if (!allowMetadataEditing) return;

        const title = document.getElementById('pageTitle').value;
        const description = document.getElementById('pageDescription').value;
        
        try {
            if (this.databaseManager.useGitHubStorage) {
                const userData = await this.databaseManager.githubStorage.getUserData();
                const data = userData ? userData.content : {};
                
                // Only allow editing of certain metadata fields - this retarded shit prevents breaking changes
                data.page_title = title;
                data.page_description = description;
                data.last_modified = new Date().toISOString();
                
                await this.databaseManager.githubStorage.saveUserData(data);
            }
            
            this.uiEffects.updateStatus('Metadata saved successfully', 'success');
        } catch (error) {
            console.error('Failed to save metadata:', error);
            this.uiEffects.updateStatus('Metadata save failed', 'error');
        }
    }

    setupCliEvents() {
        const cliInput = document.getElementById('cliInput');
        if (cliInput) {
            cliInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.processCliCommand(cliInput.value.trim());
                    cliInput.value = '';
                }
            });
        }

        // SSH dialog close
        const closeSshBtn = document.getElementById('closeSshBtn');
        if (closeSshBtn) {
            closeSshBtn.addEventListener('click', () => {
                this.closeSshConnection();
            });
        }
    }

    /* @tweakable Available CLI commands for SSH-style page access */
    async processCliCommand(command) {
        const availableCommands = {
            help: 'Show available commands',
            list: 'List all public pages',
            ssh: 'Connect to a remote page (ssh <page-id>)',
            exit: 'Close current SSH connection',
            discover: 'Use password hints (discover hint1 <password>)'
        };

        const output = document.getElementById('cliOutput');
        if (!output) return;

        // Add command to output - this retarded shit shows what you typed
        this.addCliLine(`$> ${command}`);

        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        switch (cmd) {
            case 'help':
                Object.entries(availableCommands).forEach(([key, desc]) => {
                    this.addCliLine(`  ${key.padEnd(10)} - ${desc}`);
                });
                break;

            case 'list':
                await this.listPublicPages();
                break;

            case 'ssh':
                if (args.length > 0) {
                    await this.sshToPage(args[0]);
                } else {
                    this.addCliLine('Usage: ssh <page-id>');
                }
                break;

            case 'discover':
                if (args.length >= 2) {
                    await this.processDiscoverHint(args[0], args[1]);
                } else {
                    this.addCliLine('Usage: discover hint1 <password>');
                }
                break;

            case 'exit':
                this.closeSshConnection();
                break;

            default:
                this.addCliLine(`Unknown command: ${cmd}. Type 'help' for available commands.`);
        }
    }

    addCliLine(text) {
        const output = document.getElementById('cliOutput');
        if (output) {
            const line = document.createElement('div');
            line.className = 'cli-line';
            line.textContent = text;
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
        }
    }

    async listPublicPages() {
        try {
            this.addCliLine('Scanning for public OC Terminal pages...');
            
            if (this.databaseManager.useGitHubStorage) {
                const publishedPages = await this.databaseManager.githubStorage.getPublishedPages();
                
                if (publishedPages.length === 0) {
                    this.addCliLine('No public pages found.');
                    return;
                }

                this.addCliLine(`Found ${publishedPages.length} public pages:`);
                this.addCliLine('');
                
                publishedPages.forEach(page => {
                    this.addCliLine(`  ${page.unique_id.padEnd(15)} - @${page.username}`);
                });
                
                this.addCliLine('');
                this.addCliLine('Use "ssh <page-id>" to connect to a page');
            }
        } catch (error) {
            console.error('Failed to list pages:', error);
            this.addCliLine('Error: Failed to retrieve public pages');
        }
    }

    /* @tweakable SSH-style connection simulation to access public pages */
    async sshToPage(pageId) {
        const enableSshSimulation = true;
        if (!enableSshSimulation) {
            this.addCliLine('SSH simulation disabled');
            return;
        }

        try {
            this.addCliLine(`Connecting to ${pageId}...`);
            this.addCliLine('Establishing secure connection...');
            
            // Find the page by unique ID - this retarded shit simulates SSH connection
            const publishedPages = await this.databaseManager.githubStorage.getPublishedPages();
            const targetPage = publishedPages.find(page => page.unique_id === pageId);
            
            if (!targetPage) {
                this.addCliLine(`Error: Page ${pageId} not found or not public`);
                return;
            }

            this.addCliLine(`Connected to ${targetPage.username}'s OC Terminal`);
            this.addCliLine('Opening remote page...');
            
            // Open SSH connection dialog - OMG COME HERE LET ME KISS U MWAAAH
            await this.openSshConnection(targetPage);
            
        } catch (error) {
            console.error('SSH connection failed:', error);
            this.addCliLine(`Error: Connection to ${pageId} failed`);
        }
    }

    async openSshConnection(targetPage) {
        try {
            // Load remote page data - this beautiful mess loads other user's data
            const remoteUserData = await this.loadRemoteUserData(targetPage.user_id);
            
            if (!remoteUserData) {
                this.addCliLine('Error: Failed to load remote page data');
                return;
            }

            // Setup SSH connection window
            const sshWindow = document.getElementById('sshWindowTitle');
            const sshContent = document.getElementById('sshContent');
            
            if (sshWindow) {
                sshWindow.textContent = `🔗 SSH: ${targetPage.username}@${targetPage.unique_id}`;
            }
            
            if (sshContent) {
                this.renderRemotePageContent(sshContent, remoteUserData, targetPage);
            }
            
            this.sshConnectionDialog.style.display = 'flex';
            this.currentSshConnection = targetPage;
            
        } catch (error) {
            console.error('Failed to open SSH connection:', error);
            this.addCliLine('Error: SSH connection failed');
        }
    }

    /* @tweakable Remote page content rendering with read-only protection */
    renderRemotePageContent(container, userData, pageInfo) {
        const isOwner = this.databaseManager.githubAuth.getUserId() === pageInfo.user_id;
        const readOnlyMode = !isOwner;

        container.innerHTML = `
            ${readOnlyMode ? '<div class="ssh-readonly-indicator">⚠️ READ-ONLY MODE - You can view but not edit this page</div>' : ''}
            <div class="remote-page-header">
                <h2>📄 ${pageInfo.username}'s OC Character Database</h2>
                <div class="page-info">
                    <div>Page ID: ${pageInfo.unique_id}</div>
                    <div>Last Modified: ${new Date(userData.last_modified).toLocaleString()}</div>
                    <div>Owner: @${pageInfo.username}</div>
                </div>
            </div>
            <div class="remote-page-content">
                ${this.renderCharacterDataReadOnly(userData.character_data || {})}
            </div>
        `;
    }

    renderCharacterDataReadOnly(characterData) {
        const fieldLabels = [
            'NAME', 'AGE', 'SPECIES', 'APPEARANCE', 'DISTINGUISHING FEATURES',
            'PERSONALITY', 'FEARS/PHOBIAS', 'OBSESSIONS', 'ORIGIN STORY', 'TRAUMATIC EVENTS',
            'SUPERNATURAL ABILITIES', 'WEAKNESSES'
        ];

        let html = '<div class="character-data-display">';
        
        fieldLabels.forEach((label, index) => {
            const fieldKey = `field_${index}`;
            const content = characterData[fieldKey] || 'No data available...';
            
            html += `
                <div class="character-field">
                    <div class="field-label">${label}:</div>
                    <div class="field-content">${content}</div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }

    async loadRemoteUserData(userId) {
        // In a real implementation, this would fetch data from the remote user's repository
        // For now, we'll simulate it by checking published pages
        try {
            const publishedPages = await this.databaseManager.githubStorage.getPublishedPages();
            const targetPage = publishedPages.find(page => page.user_id === userId);
            
            if (targetPage) {
                // Return simulated user data - this retarded shit fakes remote data
                return {
                    character_data: {
                        field_0: 'Remote Character Name',
                        field_1: 'Unknown Age',
                        field_2: 'Unknown Species'
                        // More fields would be loaded from actual GitHub repo
                    },
                    last_modified: targetPage.last_modified,
                    page_title: `${targetPage.username}'s Character`,
                    page_description: 'A character from another terminal...'
                };
            }
            
            return null;
        } catch (error) {
            console.error('Failed to load remote user data:', error);
            return null;
        }
    }

    closeSshConnection() {
        this.sshConnectionDialog.style.display = 'none';
        this.currentSshConnection = null;
        this.addCliLine('SSH connection closed.');
    }

    async processDiscoverHint(hintId, password) {
        try {
            if (this.databaseManager.useGitHubStorage) {
                const userData = await this.databaseManager.githubStorage.getUserData();
                const hints = userData?.content?.password_hints || [];
                
                const hint = hints.find(h => h.command === `discover ${hintId}`);
                
                if (!hint) {
                    this.addCliLine(`Hint ${hintId} not found.`);
                    return;
                }
                
                if (hint.password === password) {
                    this.addCliLine('Access granted! Hint content:');
                    this.addCliLine('');
                    this.addCliLine(hint.content);
                    this.addCliLine('');
                } else {
                    this.addCliLine('Access denied: Incorrect password');
                }
            }
        } catch (error) {
            console.error('Failed to process hint:', error);
            this.addCliLine('Error processing hint command');
        }
    }

    closeOcEditor() {
        this.ocEditorActive = false;
        this.ocEditorContainer.classList.remove('visible');
    }

    async loadOcEditorData() {
        try {
            if (this.databaseManager.useGitHubStorage) {
                const userData = await this.databaseManager.githubStorage.getUserData();
                if (userData && userData.content) {
                    this.loadThemeData(userData.content);
                    this.loadMetadataData(userData.content);
                    this.loadHintsData(userData.content);
                    this.refreshCustomFilesList();
                }
            }
        } catch (error) {
            console.error('Failed to load OC Editor data:', error);
        }
    }

    loadThemeData(userData) {
        if (userData.ui_theme) {
            this.currentTheme = userData.ui_theme;
            
            // Update color inputs - this retarded shit loads saved colors
            document.getElementById('primaryColor').value = this.currentTheme.primary;
            document.getElementById('secondaryColor').value = this.currentTheme.secondary;
            document.getElementById('accentColor').value = this.currentTheme.accent;
            document.getElementById('backgroundColor').value = this.currentTheme.background;
            
            this.applyColorTheme();
        }
    }

    loadMetadataData(userData) {
        document.getElementById('pageTitle').value = userData.page_title || '';
        document.getElementById('pageDescription').value = userData.page_description || '';
        document.getElementById('pageUniqueId').value = userData.unique_id || '';
        document.getElementById('pageCreatedAt').value = userData.created_at || '';
    }

    loadHintsData(userData) {
        const hints = userData.password_hints || [];
        const hintItems = document.querySelectorAll('.hint-item');
        
        hintItems.forEach((item, index) => {
            const hint = hints[index];
            if (hint) {
                item.querySelector('.hint-password').value = hint.password || '';
                item.querySelector('.hint-content').value = hint.content || '';
            }
        });
    }

    async saveThemeData() {
        try {
            if (this.databaseManager.useGitHubStorage) {
                const userData = await this.databaseManager.githubStorage.getUserData();
                const data = userData ? userData.content : {};
                data.ui_theme = this.currentTheme;
                data.last_modified = new Date().toISOString();
                
                await this.databaseManager.githubStorage.saveUserData(data);
            }
        } catch (error) {
            console.error('Failed to save theme data:', error);
        }
    }

    refreshCustomFilesList() {
        // This beautiful mess refreshes the custom files list
        const filesList = document.getElementById('customFilesList');
        if (!filesList) return;
        
        filesList.innerHTML = '<div style="color: #666; font-style: italic;">Custom files functionality coming soon...</div>';
    }

    checkFileAccessLockout() {
        /* @tweakable Whether HWID lockout system is enabled */
        const lockoutEnabled = true;
        
        if (!lockoutEnabled || this.gameState.hwidSpoofed) return false;
        
        this.gameState.filesAccessedCount++;
        
        if (this.gameState.filesAccessedCount >= this.gameState.maxFilesBeforeLockout && !this.gameState.isLocked) {
            this.gameState.isLocked = true;
            this.triggerHwidLockout();
            return true;
        }
        
        return this.gameState.isLocked;
    }

    triggerHwidLockout() {
        /* @tweakable Lockout message for HWID requirement */
        const lockoutMessage = "ACCESS RESTRICTED";
        /* @tweakable Lockout explanation text */
        const lockoutExplanation = "Hardware verification required. Check system files for authorization procedures.";
        
        // Create the instruction file if it doesn't exist
        this.createHwidInstructionFile();
        
        // Show lockout dialog
        this.showErrorDialog(lockoutMessage, lockoutExplanation);
        
        // Add visual effect
        this.triggerGlitchEffect();
    }

    createHwidInstructionFile() {
        /* @tweakable Content of the HWID instruction file */
        const instructionContent = `SYSTEM ACCESS AUTHORIZATION REQUIRED

Your current Hardware ID: ${this.gameState.hwid}

To continue accessing files, you must authorize your hardware identity.

REQUIRED COMMANDS:
1. Open CMD.EXE from the main directory
2. Type: DOWNLOAD-TOOL hwid-spoof-v3.exe /silent /bypass-security
3. Wait for download completion
4. Return to main directory and run HWID-SPOOF-V3.EXE
5. Generate a new HWID and apply it

This retarded shit is for security purposes.
OMG COME HERE LET ME KISS U MWAAAH - follow the instructions!`;

        // Add to discovered files
        this.addDiscoveredFile('SYSTEM_ACCESS_REQUIRED.txt', instructionContent);
        
        // Show subtle notification
        setTimeout(() => {
            this.showSubtleNotification('New system file detected: SYSTEM_ACCESS_REQUIRED.txt');
        }, 1000);
    }

    resetProgress() {
        /* @tweakable Confirmation message for progress reset */
        const confirmMessage = 'Are you sure you want to reset ALL progress?\n\nThis will delete:\n- All discovered files\n- All character data\n- All images\n- All game progress\n\nThis action cannot be undone!';
        
        if (confirm(confirmMessage)) {
            if (this.databaseManager.useGitHubStorage) {
                // For GitHub storage, we would need to delete the entire repository
                // This is a destructive operation that requires careful implementation
                alert('Repository reset not implemented for safety.\nPlease manually delete your data repository if needed.');
                return;
            }
            
            // Clear all localStorage data - this retarded shit wipes everything clean
            localStorage.removeItem('discoveredFiles');
            localStorage.removeItem('deletedFiles');
            localStorage.removeItem('hwid_tool_installed');
            
            // Clear character data fields
            const fields = document.querySelectorAll('.editable-field');
            fields.forEach((field, index) => {
                field.innerHTML = '';
                localStorage.removeItem(`oc-field-${index}`);
            });
            
            // Reset game state
            this.gameState = {
                hwid: this.generateHWID(),
                filesAccessedCount: 0,
                maxFilesBeforeLockout: 3,
                isLocked: false,
                hwidSpoofed: false
            };
            
            // Refresh the current view
            if (this.currentView === 'main') {
                this.showFolder('character');
            }
            
            alert('All progress has been reset.\nYou can now start fresh.');
        }
    }
}