class GitHubStorage {
    constructor(auth) {
        this.auth = auth;
        /* @tweakable Repository name pattern for user data storage - each user gets their own private repo */
        this.repoNamePrefix = 'oc-terminal-data';
        /* @tweakable Main data file name in the repository for character information */
        this.dataFileName = 'character-data.json';
        /* @tweakable Images folder name in the repository for user uploads */
        this.imagesFolderName = 'images';
        /* @tweakable Repository visibility - true for private repos to protect user data */
        this.isPrivateRepo = true;
        /* @tweakable Enable real-time commits for immediate GitHub synchronization */
        this.enableRealTimeCommits = true;
        /* @tweakable Commit message template for character data updates */
        this.commitMessageTemplate = 'Update character data - {timestamp}';
        /* @tweakable Auto-commit delay in milliseconds for batching rapid changes */
        this.autoCommitDelay = 5000;
        
        /* @tweakable Admin username for cross-user operations and system administration */
        this.adminUsername = 'AlexanderAlexis01';
        /* @tweakable Repository name for storing admin actions and ban list */
        this.adminRepoName = 'oc-terminal-admin-data';
        /* @tweakable Enable detailed logging of all admin actions for audit trail */
        this.enableAdminLogging = true;
        
        this.userRepoName = null;
        this.pendingCommits = new Map();
    }

    async init() {
        if (!this.auth.isAuthenticated) {
            throw new Error('User must be authenticated to access GitHub storage');
        }
        
        const userId = this.auth.getUserId();
        /* @tweakable Repository naming format - combines prefix with user ID */
        this.userRepoName = `${this.repoNamePrefix}-${userId}`;
        
        // Ensure user repository exists
        await this.ensureUserRepository();
    }

    async ensureUserRepository() {
        const token = this.auth.getToken();
        const username = this.auth.getUsername();
        
        try {
            // Check if repository exists
            const checkResponse = await fetch(`https://api.github.com/repos/${username}/${this.userRepoName}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (checkResponse.status === 404) {
                // Repository doesn't exist, create it
                await this.createUserRepository();
            } else if (!checkResponse.ok) {
                throw new Error(`Failed to check repository: ${checkResponse.status}`);
            }
        } catch (error) {
            console.error('Repository check failed:', error);
            throw error;
        }
    }

    async createUserRepository() {
        const token = this.auth.getToken();
        
        /* @tweakable Repository description for user data repositories */
        const repoDescription = 'Personal OC Terminal character database - Private user data';
        
        const createPayload = {
            name: this.userRepoName,
            description: repoDescription,
            private: this.isPrivateRepo,
            auto_init: true,
            license_template: 'mit'
        };
        
        const response = await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(createPayload)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to create repository: ${error.message}`);
        }
        
        // Initialize with default data structure
        await this.initializeUserData();
    }

    async initializeUserData() {
        const defaultData = {
            version: '1.0',
            created_at: new Date().toISOString(),
            last_modified: new Date().toISOString(),
            user_id: this.auth.getUserId(),
            username: this.auth.getUsername(),
            /* @tweakable Whether the user's page is published and visible to others in the Explorer */
            is_published: false,
            /* @tweakable Unique IP-like identifier for the user's published page */
            unique_id: this.generateUniqueId(),
            character_data: {},
            discovered_files: [],
            deleted_files: [],
            images: [],
            game_state: {
                hwid: this.generateHWID(),
                files_accessed_count: 0,
                max_files_before_lockout: 3,
                is_locked: false,
                hwid_spoofed: false
            }
        };
        
        await this.saveUserData(defaultData);
    }

    generateHWID() {
        const chars = '0123456789ABCDEF';
        let hwid = '';
        for (let i = 0; i < 32; i++) {
            hwid += chars.charAt(Math.floor(Math.random() * chars.length));
            if ((i + 1) % 4 === 0 && i < 31) hwid += '-';
        }
        return hwid;
    }

    generateUniqueId() {
        /* @tweakable Format pattern for generating unique IP-like identifiers */
        const segments = 4;
        /* @tweakable Range for each segment of the IP-like identifier (0-255) */
        const maxSegmentValue = 255;
        
        const id = Array.from({ length: segments }, () => 
            Math.floor(Math.random() * (maxSegmentValue + 1))
        ).join('.');
        
        return id;
    }

    async saveUserData(data) {
        const token = this.auth.getToken();
        const username = this.auth.getUsername();
        
        try {
            // Get current file SHA (required for updates)
            const currentFile = await this.getUserData();
            const sha = currentFile ? currentFile.sha : undefined;
            
            const content = btoa(JSON.stringify(data, null, 2));
            
            /* @tweakable Commit message format for GitHub data updates with timestamp */
            const commitMessage = this.commitMessageTemplate.replace('{timestamp}', new Date().toISOString());
            
            const payload = {
                message: commitMessage,
                content: content,
                sha: sha
            };
            
            const response = await fetch(`https://api.github.com/repos/${username}/${this.userRepoName}/contents/${this.dataFileName}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Failed to save data: ${error.message}`);
            }
            
            /* @tweakable Enable real-time commit notifications for immediate feedback */
            if (this.enableRealTimeCommits) {
                console.log(`Real-time commit successful: ${commitMessage}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Save failed:', error);
            throw error;
        }
    }

    async getUserData() {
        const token = this.auth.getToken();
        const username = this.auth.getUsername();
        
        try {
            const response = await fetch(`https://api.github.com/repos/${username}/${this.userRepoName}/contents/${this.dataFileName}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.status === 404) {
                // File doesn't exist yet
                return null;
            }
            
            if (!response.ok) {
                throw new Error(`Failed to get data: ${response.status}`);
            }
            
            const fileData = await response.json();
            const content = JSON.parse(atob(fileData.content));
            
            return {
                content: content,
                sha: fileData.sha
            };
        } catch (error) {
            console.error('Get data failed:', error);
            throw error;
        }
    }

    async saveImage(imageData) {
        const token = this.auth.getToken();
        const username = this.auth.getUsername();
        
        try {
            // Convert base64 to blob data
            const base64Data = imageData.url.split(',')[1];
            const fileName = imageData.filename || `image_${Date.now()}.jpg`;
            const filePath = `${this.imagesFolderName}/${fileName}`;
            
            /* @tweakable Commit message for image uploads with GitHub integration */
            const imageCommitMessage = `Add image: ${fileName} - ${new Date().toISOString()}`;
            
            const payload = {
                message: imageCommitMessage,
                content: base64Data
            };
            
            const response = await fetch(`https://api.github.com/repos/${username}/${this.userRepoName}/contents/${filePath}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Failed to save image: ${error.message}`);
            }
            
            const result = await response.json();
            
            // Update user data with image reference and commit immediately
            const userData = await this.getUserData();
            if (userData) {
                const data = userData.content;
                data.images = data.images || [];
                data.images.push({
                    id: Date.now().toString(),
                    filename: fileName,
                    url: result.content.download_url,
                    uploaded_at: new Date().toISOString()
                });
                data.last_modified = new Date().toISOString();
                
                await this.saveUserData(data);
            }
            
            return result;
        } catch (error) {
            console.error('Image save failed:', error);
            throw error;
        }
    }

    async deleteImage(imageId) {
        const userData = await this.getUserData();
        if (!userData) return false;
        
        const data = userData.content;
        const imageIndex = data.images.findIndex(img => img.id === imageId);
        
        if (imageIndex === -1) return false;
        
        const image = data.images[imageIndex];
        
        try {
            // Delete from GitHub
            const token = this.auth.getToken();
            const username = this.auth.getUsername();
            const filePath = `${this.imagesFolderName}/${image.filename}`;
            
            // Get file SHA first
            const fileResponse = await fetch(`https://api.github.com/repos/${username}/${this.userRepoName}/contents/${filePath}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (fileResponse.ok) {
                const fileData = await fileResponse.json();
                
                const deleteResponse = await fetch(`https://api.github.com/repos/${username}/${this.userRepoName}/contents/${filePath}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `Delete image: ${image.filename}`,
                        sha: fileData.sha
                    })
                });
                
                if (!deleteResponse.ok) {
                    console.warn('Failed to delete image file from GitHub');
                }
            }
            
            // Remove from data
            data.images.splice(imageIndex, 1);
            data.last_modified = new Date().toISOString();
            
            await this.saveUserData(data);
            return true;
        } catch (error) {
            console.error('Image delete failed:', error);
            throw error;
        }
    }

    async publishUserPage() {
        const userData = await this.getUserData();
        if (!userData) throw new Error('No user data found');
        
        const data = userData.content;
        data.is_published = true;
        data.last_modified = new Date().toISOString();
        /* @tweakable Commit message for page publishing events */
        data.publish_commit_message = `Published page to public Explorer - ${new Date().toISOString()}`;
        
        await this.saveUserData(data);
        
        // Also create a public registry entry with real-time commit
        await this.addToPublicRegistry(data);
    }

    async unpublishUserPage() {
        const userData = await this.getUserData();
        if (!userData) throw new Error('No user data found');
        
        const data = userData.content;
        data.is_published = false;
        data.last_modified = new Date().toISOString();
        /* @tweakable Commit message for page unpublishing events */
        data.unpublish_commit_message = `Unpublished page from public Explorer - ${new Date().toISOString()}`;
        
        await this.saveUserData(data);
        
        // Remove from public registry
        await this.removeFromPublicRegistry(data.user_id);
    }

    async addToPublicRegistry(userData) {
        /* @tweakable Repository name for storing the public page registry */
        const registryRepo = 'oc-terminal-public-registry';
        /* @tweakable Organization or username that owns the public registry repository */
        const registryOwner = 'oc-terminal-app'; // This would need to be a real org/user
        
        const token = this.auth.getToken();
        
        const registryEntry = {
            user_id: userData.user_id,
            username: userData.username,
            unique_id: userData.unique_id,
            last_modified: userData.last_modified,
            repository_name: this.userRepoName
        };
        
        const fileName = `users/${userData.user_id}.json`;
        
        try {
            // For now, we'll store this in the user's own repo as a public indicator
            // In a real implementation, this would go to a central registry
            const payload = {
                message: `Publish page for ${userData.username}`,
                content: btoa(JSON.stringify(registryEntry, null, 2))
            };
            
            const response = await fetch(`https://api.github.com/repos/${this.auth.getUsername()}/${this.userRepoName}/contents/public-registry.json`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                console.warn('Failed to add to public registry');
            }
        } catch (error) {
            console.error('Registry update failed:', error);
        }
    }

    async removeFromPublicRegistry(userId) {
        const token = this.auth.getToken();
        
        try {
            // Get current registry file
            const response = await fetch(`https://api.github.com/repos/${this.auth.getUsername()}/${this.userRepoName}/contents/public-registry.json`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const fileData = await response.json();
                
                const deleteResponse = await fetch(`https://api.github.com/repos/${this.auth.getUsername()}/${this.userRepoName}/contents/public-registry.json`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `Unpublish page`,
                        sha: fileData.sha
                    })
                });
                
                if (!deleteResponse.ok) {
                    console.warn('Failed to remove from public registry');
                }
            }
        } catch (error) {
            console.error('Registry removal failed:', error);
        }
    }

    /* @tweakable GitHub search query parameters for finding published OC Terminal pages across repositories */
    async getPublishedPages() {
        const searchQuery = 'oc-terminal-data filename:public-registry.json';
        /* @tweakable Maximum number of search results to process for published pages */
        const maxSearchResults = 100;
        
        try {
            const response = await fetch(`https://api.github.com/search/code?q=${encodeURIComponent(searchQuery)}&per_page=${maxSearchResults}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to search for published pages');
            }
            
            const searchResults = await response.json();
            const publishedPages = [];
            
            // Process search results to extract user data with real-time GitHub access
            for (const item of searchResults.items) {
                try {
                    const contentResponse = await fetch(item.url, {
                        headers: {
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    });
                    
                    if (contentResponse.ok) {
                        const contentData = await contentResponse.json();
                        const registryData = JSON.parse(atob(contentData.content));
                        publishedPages.push(registryData);
                    }
                } catch (error) {
                    console.warn('Failed to load registry entry:', error);
                }
            }
            
            return publishedPages;
        } catch (error) {
            console.error('Failed to get published pages:', error);
            return [];
        }
    }

    /* @tweakable Whether the current user has admin privileges for cross-user operations */
    isCurrentUserAdmin() {
        return this.auth.getUsername() === this.adminUsername;
    }

    async banUser(targetUserId, reason = 'Administrative action') {
        if (!this.isCurrentUserAdmin()) {
            throw new Error('Only administrators can ban users');
        }

        try {
            // Get target user's repository name
            const targetRepoName = `${this.repoNamePrefix}-${targetUserId}`;
            const targetUsername = await this.getTargetUsername(targetUserId);
            
            // Update target user's data to mark as banned
            const userData = await this.getTargetUserData(targetUsername, targetRepoName);
            if (userData) {
                const data = userData.content;
                data.is_banned = true;
                data.ban_reason = reason;
                data.banned_at = new Date().toISOString();
                data.banned_by = this.auth.getUsername();
                data.last_modified = new Date().toISOString();
                
                await this.saveTargetUserData(targetUsername, targetRepoName, data, userData.sha);
            }
            
            // Log admin action - this retarded shit tracks what admin does
            await this.logAdminAction('BAN_USER', {
                target_user_id: targetUserId,
                target_username: targetUsername,
                reason: reason,
                admin_username: this.auth.getUsername()
            });
            
            return true;
        } catch (error) {
            console.error('Failed to ban user:', error);
            throw error;
        }
    }

    async unbanUser(targetUserId, reason = 'Administrative unban') {
        if (!this.isCurrentUserAdmin()) {
            throw new Error('Only administrators can unban users');
        }

        try {
            const targetRepoName = `${this.repoNamePrefix}-${targetUserId}`;
            const targetUsername = await this.getTargetUsername(targetUserId);
            
            const userData = await this.getTargetUserData(targetUsername, targetRepoName);
            if (userData) {
                const data = userData.content;
                data.is_banned = false;
                data.unban_reason = reason;
                data.unbanned_at = new Date().toISOString();
                data.unbanned_by = this.auth.getUsername();
                data.last_modified = new Date().toISOString();
                
                await this.saveTargetUserData(targetUsername, targetRepoName, data, userData.sha);
            }
            
            // Log admin action - OMG COME HERE LET ME KISS U MWAAAH
            await this.logAdminAction('UNBAN_USER', {
                target_user_id: targetUserId,
                target_username: targetUsername,
                reason: reason,
                admin_username: this.auth.getUsername()
            });
            
            return true;
        } catch (error) {
            console.error('Failed to unban user:', error);
            throw error;
        }
    }

    async getTargetUserData(targetUsername, targetRepoName) {
        const token = this.auth.getToken();
        
        try {
            const response = await fetch(`https://api.github.com/repos/${targetUsername}/${targetRepoName}/contents/${this.dataFileName}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.status === 404) {
                return null;
            }
            
            if (!response.ok) {
                throw new Error(`Failed to get target user data: ${response.status}`);
            }
            
            const fileData = await response.json();
            const content = JSON.parse(atob(fileData.content));
            
            return {
                content: content,
                sha: fileData.sha
            };
        } catch (error) {
            console.error('Get target user data failed:', error);
            throw error;
        }
    }

    async saveTargetUserData(targetUsername, targetRepoName, data, sha) {
        const token = this.auth.getToken();
        
        try {
            const content = btoa(JSON.stringify(data, null, 2));
            
            const payload = {
                message: `Admin action by ${this.auth.getUsername()} - ${new Date().toISOString()}`,
                content: content,
                sha: sha
            };
            
            const response = await fetch(`https://api.github.com/repos/${targetUsername}/${targetRepoName}/contents/${this.dataFileName}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Failed to save target user data: ${error.message}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Save target user data failed:', error);
            throw error;
        }
    }

    /* @tweakable Enable comprehensive logging of all admin actions with GitHub commit tracking */
    async logAdminAction(actionType, actionData) {
        if (!this.enableAdminLogging || !this.isCurrentUserAdmin()) return;

        try {
            const logEntry = {
                timestamp: new Date().toISOString(),
                action_type: actionType,
                admin_user: this.auth.getUsername(),
                admin_user_id: this.auth.getUserId(),
                data: actionData,
                user_agent: navigator.userAgent,
                ip_hash: await this.hashIP(),
                /* @tweakable GitHub commit hash tracking for admin action audit trail */
                commit_context: `Admin action: ${actionType} by ${this.auth.getUsername()}`
            };
            
            // Try to create/update admin log repository
            await this.ensureAdminRepository();
            
            // Append to admin log file
            const currentLogs = await this.getAdminLogs();
            currentLogs.push(logEntry);
            
            /* @tweakable Maximum number of admin log entries to retain in GitHub repository */
            const maxLogEntries = 1000;
            // Keep only last entries to prevent repo bloat
            if (currentLogs.length > maxLogEntries) {
                currentLogs.splice(0, currentLogs.length - maxLogEntries);
            }
            
            await this.saveAdminLogs(currentLogs);
            
        } catch (error) {
            console.error('Failed to log admin action:', error);
            // Don't throw - logging failure shouldn't break admin operations
        }
    }

    async ensureAdminRepository() {
        const token = this.auth.getToken();
        const username = this.auth.getUsername();
        
        try {
            // Check if admin repository exists
            const checkResponse = await fetch(`https://api.github.com/repos/${username}/${this.adminRepoName}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (checkResponse.status === 404) {
                // Create admin repository - this beautiful mess stores admin logs
                const createPayload = {
                    name: this.adminRepoName,
                    description: 'OC Terminal Admin Actions Log - Private',
                    private: true,
                    auto_init: true
                };
                
                const response = await fetch('https://api.github.com/user/repos', {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(createPayload)
                });
                
                if (!response.ok) {
                    throw new Error('Failed to create admin repository');
                }
            }
        } catch (error) {
            console.error('Admin repository setup failed:', error);
            throw error;
        }
    }

    async getAdminLogs() {
        const token = this.auth.getToken();
        const username = this.auth.getUsername();
        
        try {
            const response = await fetch(`https://api.github.com/repos/${username}/${this.adminRepoName}/contents/admin-actions.json`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.status === 404) {
                return []; // No logs yet
            }
            
            if (!response.ok) {
                throw new Error('Failed to get admin logs');
            }
            
            const fileData = await response.json();
            return JSON.parse(atob(fileData.content));
        } catch (error) {
            console.error('Get admin logs failed:', error);
            return [];
        }
    }

    async saveAdminLogs(logs) {
        const token = this.auth.getToken();
        const username = this.auth.getUsername();
        
        try {
            // Get current file SHA if it exists
            let sha;
            try {
                const currentFile = await fetch(`https://api.github.com/repos/${username}/${this.adminRepoName}/contents/admin-actions.json`, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                if (currentFile.ok) {
                    const fileData = await currentFile.json();
                    sha = fileData.sha;
                }
            } catch (e) {
                // File doesn't exist yet, no SHA needed
            }
            
            const content = btoa(JSON.stringify(logs, null, 2));
            
            const payload = {
                message: `Admin actions log update - ${new Date().toISOString()}`,
                content: content
            };
            
            if (sha) {
                payload.sha = sha;
            }
            
            const response = await fetch(`https://api.github.com/repos/${username}/${this.adminRepoName}/contents/admin-actions.json`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) {
                throw new Error('Failed to save admin logs');
            }
        } catch (error) {
            console.error('Save admin logs failed:', error);
            throw error;
        }
    }

    async hashIP() {
        // Simple IP hash for privacy - this retarded shit hides real IPs
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const encoder = new TextEncoder();
            const data_encoded = encoder.encode(data.ip + 'salt');
            const hashBuffer = await crypto.subtle.digest('SHA-256', data_encoded);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
        } catch (error) {
            return 'unknown';
        }
    }

    async getTargetUsername(userId) {
        // This would need a mapping service or search through GitHub users
        // For now, return a placeholder - this retarded shit needs better implementation
        return `user-${userId}`;
    }

    async deleteUserPage(targetUserId) {
        if (!this.isCurrentUserAdmin()) {
            throw new Error('Only administrators can delete user pages');
        }

        try {
            const targetRepoName = `${this.repoNamePrefix}-${targetUserId}`;
            const targetUsername = await this.getTargetUsername(targetUserId);
            
            // This would require deleting the entire repository
            // For safety, we'll mark it as deleted instead - OMG COME HERE LET ME KISS U MWAAAH
            const userData = await this.getTargetUserData(targetUsername, targetRepoName);
            if (userData) {
                const data = userData.content;
                data.is_deleted = true;
                data.deleted_at = new Date().toISOString();
                data.deleted_by = this.auth.getUsername();
                data.last_modified = new Date().toISOString();
                
                await this.saveTargetUserData(targetUsername, targetRepoName, data, userData.sha);
            }
            
            // Log admin action
            await this.logAdminAction('DELETE_PAGE', {
                target_user_id: targetUserId,
                target_username: targetUsername,
                admin_username: this.auth.getUsername()
            });
            
            return true;
        } catch (error) {
            console.error('Failed to delete user page:', error);
            throw error;
        }
    }
}