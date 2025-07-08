// This retarded shit is for storing your precious data
class DatabaseManager {
    constructor(ocDocument) {
        this.ocDocument = ocDocument;
        
        // GitHub integration - OMG COME HERE LET ME KISS U MWAAAH
        this.githubAuth = null;
        this.githubStorage = null;
        /* @tweakable Force GitHub storage usage - no local fallbacks allowed for data persistence */
        this.useGitHubStorage = false;
        
        /* @tweakable GitHub username that has full administrative privileges over all users and pages */
        this.adminUsername = 'AlexanderAlexis01';
        
        /* @tweakable Whether to enforce strict admin privilege enforcement through GitHub identity verification */
        this.enforceAdminPrivileges = true;
        
        /* @tweakable Enable real-time GitHub synchronization for all data operations */
        this.enableRealTimeSync = true;
    }

    async setupDatabase() {
        // Initialize GitHub auth first - this retarded shit handles authentication
        this.githubAuth = new GitHubAuth();
        const isAuthenticated = await this.githubAuth.init();
        
        if (isAuthenticated) {
            /* @tweakable Force GitHub storage usage - all data must be stored in GitHub repositories */
            this.useGitHubStorage = true;
            this.githubStorage = new GitHubStorage(this.githubAuth);
            await this.githubStorage.init();
            
            // Check if user is banned before proceeding - this beautiful mess prevents banned users
            const isBanned = await this.checkUserBanStatus();
            if (isBanned && !this.isCurrentUserAdmin()) {
                this.showBannedUserUI();
                return;
            }
            
            // Load from GitHub - this beautiful mess loads your cloud data
            await this.loadFromGitHub();
            
            // Hide login overlay and show user info
            this.showAuthenticatedUI();
            
            // Initialize OC Document after successful authentication - OMG COME HERE LET ME KISS U MWAAAH
            window.ocDocument = new OCDocument();
        } else {
            // Show login overlay - this retarded shit forces you to sign in
            this.showLoginUI();
            return;
        }
    }

    /* @tweakable Whether to check admin status strictly based on GitHub username */
    isCurrentUserAdmin() {
        if (!this.enforceAdminPrivileges) return false;
        return this.githubAuth.getUsername() === this.adminUsername;
    }

    async checkUserBanStatus() {
        try {
            if (!this.githubStorage) return false;
            
            const userData = await this.githubStorage.getUserData();
            return userData?.content?.is_banned || false;
        } catch (error) {
            console.error('Failed to check ban status:', error);
            return false;
        }
    }

    /* @tweakable Message displayed to banned users when they try to access the system */
    showBannedUserUI() {
        const bannedMessage = `
            <div class="banned-user-overlay">
                <div class="banned-container">
                    <div class="banned-header">
                        <h2>⚠️ ACCESS RESTRICTED</h2>
                        <p>Your account has been suspended by system administrators</p>
                    </div>
                    <div class="banned-content">
                        <div class="banned-icon">🚫</div>
                        <div class="banned-text">
                            <p><strong>Account Status:</strong> BANNED</p>
                            <p><strong>Restrictions:</strong></p>
                            <ul>
                                <li>• Cannot edit or create pages</li>
                                <li>• Cannot publish content</li>
                                <li>• Cannot access OC Editor</li>
                                <li>• Read-only access to public content</li>
                            </ul>
                            <p>Contact the administrator if you believe this is an error.</p>
                        </div>
                        <button class="banned-logout-btn" onclick="window.location.reload()">Logout</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', bannedMessage);
    }

    showLoginUI() {
        const loginOverlay = document.getElementById('loginOverlay');
        const githubLoginBtn = document.getElementById('githubLoginBtn');
        
        if (loginOverlay) {
            loginOverlay.style.display = 'flex';
        }
        
        if (githubLoginBtn) {
            githubLoginBtn.addEventListener('click', () => {
                this.githubAuth.login();
            });
        }
    }

    showAuthenticatedUI() {
        const loginOverlay = document.getElementById('loginOverlay');
        const userInfo = document.getElementById('userInfo');
        const currentUsername = document.getElementById('currentUsername');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginOverlay) {
            loginOverlay.style.display = 'none';
        }
        
        if (userInfo && this.githubAuth.getCurrentUser()) {
            userInfo.style.display = 'flex';
            if (currentUsername) {
                currentUsername.textContent = this.githubAuth.getUsername();
            }
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.githubAuth.logout();
            });
        }
    }

    async loadFromGitHub() {
        try {
            const userData = await this.githubStorage.getUserData();
            if (userData && userData.content) {
                const data = userData.content;
                
                // Load character data - OMG COME HERE LET ME KISS U MWAAAH
                if (data.character_data) {
                    this.loadCharacterDataFromRecord(data.character_data);
                }
                
                // Load images - this retarded shit loads your pictures
                if (data.images) {
                    this.ocDocument.imageHandler.loadImages(data.images);
                }
                
                // Load game state
                if (data.game_state) {
                    Object.assign(this.ocDocument.gameState, data.game_state);
                }
                
                // Load discovered files
                if (data.discovered_files) {
                    localStorage.setItem('discoveredFiles', JSON.stringify(data.discovered_files));
                }
                
                // Load deleted files
                if (data.deleted_files) {
                    localStorage.setItem('deletedFiles', JSON.stringify(data.deleted_files));
                }
            }
        } catch (error) {
            console.error('Failed to load from GitHub:', error);
            this.ocDocument.uiEffects.updateStatus('Failed to load user data', 'error');
        }
    }

    async saveToGitHub() {
        /* @tweakable Require GitHub storage - no local fallbacks allowed */
        if (!this.useGitHubStorage) {
            throw new Error('GitHub storage is required - local storage not allowed');
        }
        
        try {
            const userData = await this.githubStorage.getUserData();
            const data = userData ? userData.content : {};
            
            // Update character data - this retarded shit saves your form data
            const fields = document.querySelectorAll('.editable-field');
            const characterData = {};
            
            fields.forEach((field, index) => {
                characterData[`field_${index}`] = field.innerHTML;
            });
            
            data.character_data = characterData;
            data.last_modified = new Date().toISOString();
            data.game_state = this.ocDocument.gameState;
            
            // Update discovered and deleted files
            data.discovered_files = JSON.parse(localStorage.getItem('discoveredFiles') || '[]');
            data.deleted_files = JSON.parse(localStorage.getItem('deletedFiles') || '[]');
            
            /* @tweakable Real-time GitHub commit for immediate data synchronization */
            if (this.enableRealTimeSync) {
                console.log('Performing real-time GitHub sync...');
            }
            
            await this.githubStorage.saveUserData(data);
            this.ocDocument.uiEffects.updateStatus('Saved to GitHub', 'success');
        } catch (error) {
            console.error('Failed to save to GitHub:', error);
            this.ocDocument.uiEffects.updateStatus('GitHub save failed', 'error');
            // Remove local fallback - force GitHub usage
            throw new Error('GitHub save required - operation failed');
        }
    }

    loadCharacterData() {
        /* @tweakable GitHub-only data loading - no local storage fallbacks */
        if (!this.useGitHubStorage) {
            throw new Error('GitHub authentication required for data access');
        }
        
        // Data already loaded in loadFromGitHub() - no local fallback
    }

    async saveCharacterData() {
        /* @tweakable Force GitHub storage usage for all save operations */
        if (!this.useGitHubStorage) {
            throw new Error('GitHub authentication required for saving data');
        }
        
        // Save to GitHub - OMG COME HERE LET ME KISS U MWAAAH
        await this.saveToGitHub();
    }

    getStoredImages() {
        /* @tweakable GitHub-only image storage - no local alternatives */
        if (!this.useGitHubStorage) {
            throw new Error('GitHub authentication required for image access');
        }
        
        // Images are loaded through loadFromGitHub() - no local fallback
        return [];
    }

    async saveImage(imageData) {
        if (this.useGitHubStorage) {
            try {
                // Save to GitHub - this retarded shit stores your beautiful images
                await this.githubStorage.saveImage(imageData);
                
                // Reload images from GitHub
                const userData = await this.githubStorage.getUserData();
                if (userData && userData.content && userData.content.images) {
                    this.ocDocument.imageHandler.loadImages(userData.content.images);
                }
                
                return { id: Date.now().toString(), ...imageData };
            } catch (error) {
                console.error('Failed to save image to GitHub:', error);
                throw error;
            }
        } else {
            // Fallback to localStorage
            const images = this.getStoredImages();
            imageData.id = Date.now().toString();
            images.push(imageData);
            localStorage.setItem(this.imagesDataKey, JSON.stringify(images));
            this.ocDocument.imageHandler.loadImages(images);
            return imageData;
        }
    }

    async deleteImage(imageId) {
        if (this.useGitHubStorage) {
            try {
                // Delete from GitHub - this beautiful mess removes your pictures
                await this.githubStorage.deleteImage(imageId);
                
                // Reload images from GitHub
                const userData = await this.githubStorage.getUserData();
                if (userData && userData.content && userData.content.images) {
                    this.ocDocument.imageHandler.loadImages(userData.content.images);
                }
            } catch (error) {
                console.error('Failed to delete image from GitHub:', error);
                throw error;
            }
        } else {
            // Fallback to localStorage
            const images = this.getStoredImages();
            const filteredImages = images.filter(img => img.id !== imageId);
            localStorage.setItem(this.imagesDataKey, JSON.stringify(filteredImages));
            this.ocDocument.imageHandler.loadImages(filteredImages);
        }
    }

    /* @tweakable Authentication requirement enforcement for application access */
    isAuthenticationRequired() {
        return true; // Always require GitHub authentication
    }

    /* @tweakable GitHub-based permission system for user access control */
    async hasEditPermission(targetUserId = null) {
        if (!this.useGitHubStorage) {
            throw new Error('GitHub authentication required for permission check');
        }
        
        const currentUserId = this.githubAuth.getUserId();
        
        // Admin can edit any page - this retarded shit gives admin full power
        if (this.isCurrentUserAdmin()) {
            return true;
        }
        
        // Check if current user is banned
        const isBanned = await this.checkUserBanStatus();
        if (isBanned) {
            return false;
        }
        
        // Regular users can only edit their own pages
        if (targetUserId) {
            return currentUserId === targetUserId;
        }
        
        return this.githubAuth.isAuthenticated;
    }

    /* @tweakable Whether to allow admin users to bypass normal restrictions */
    async canAccessAdminFeatures() {
        return this.isCurrentUserAdmin() && this.githubAuth.isAuthenticated;
    }

    /* @tweakable User session timeout in milliseconds */
    getSessionTimeout() {
        return 24 * 60 * 60 * 1000; // 24 hours
    }
}