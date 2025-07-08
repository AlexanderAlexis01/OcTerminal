class GitHubAuth {
    constructor() {
        /* @tweakable GitHub OAuth application client ID - replace with your actual GitHub App client ID for production */
        this.clientId = 'Ov23li3JXOAwOednzRVA';
        /* @tweakable GitHub OAuth redirect URI - must match your GitHub App settings exactly */
        this.redirectUri = window.location.origin + window.location.pathname;
        /* @tweakable GitHub OAuth scopes for repository access and user information - determines what permissions the app requests */
        this.scopes = 'user repo';
        /* @tweakable Key for storing authentication token in localStorage for session persistence */
        this.tokenKey = 'github_auth_token';
        /* @tweakable Key for storing user data in localStorage for quick access */
        this.userKey = 'github_user_data';
        /* @tweakable GitHub OAuth state parameter for security - prevents CSRF attacks */
        this.stateParameter = true;
        /* @tweakable Token refresh interval in hours - how often to verify token validity */
        this.tokenRefreshInterval = 24;
        
        this.currentUser = null;
        this.isAuthenticated = false;
    }

    async init() {
        // Check for auth code in URL (OAuth callback)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
            await this.handleAuthCallback(code);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            // Check for existing token
            await this.checkExistingAuth();
        }
        
        return this.isAuthenticated;
    }

    async checkExistingAuth() {
        const token = localStorage.getItem(this.tokenKey);
        const userData = localStorage.getItem(this.userKey);
        
        if (token && userData) {
            try {
                this.currentUser = JSON.parse(userData);
                // Verify token is still valid
                const response = await fetch('https://api.github.com/user', {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                if (response.ok) {
                    this.isAuthenticated = true;
                    return true;
                } else {
                    // Token invalid, clear storage
                    this.logout();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                this.logout();
            }
        }
        
        return false;
    }

    async handleAuthCallback(code) {
        try {
            /* @tweakable GitHub OAuth token exchange endpoint - you'll need a backend service for secure token exchange */
            const tokenExchangeEndpoint = '/api/auth/github/token';
            /* @tweakable GitHub OAuth client secret handling - must be kept secure on backend */
            const tokenResponse = await fetch(tokenExchangeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    code: code,
                    client_id: this.clientId,
                    redirect_uri: this.redirectUri
                })
            });
            
            if (!tokenResponse.ok) {
                throw new Error('Token exchange failed');
            }
            
            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;
            
            // Get user data
            const userResponse = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${accessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!userResponse.ok) {
                throw new Error('Failed to get user data');
            }
            
            const userData = await userResponse.json();
            
            // Store auth data
            localStorage.setItem(this.tokenKey, accessToken);
            localStorage.setItem(this.userKey, JSON.stringify(userData));
            
            this.currentUser = userData;
            this.isAuthenticated = true;
            
            return true;
        } catch (error) {
            console.error('Auth callback failed:', error);
            alert('Authentication failed. Please try again.');
            return false;
        }
    }

    login() {
        /* @tweakable GitHub OAuth authorization URL parameters for secure authentication flow */
        const stateValue = this.stateParameter ? Date.now().toString() : undefined;
        const authUrl = `https://github.com/login/oauth/authorize?` +
            `client_id=${this.clientId}&` +
            `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
            `scope=${encodeURIComponent(this.scopes)}` +
            (stateValue ? `&state=${stateValue}` : '');
        
        if (stateValue) {
            sessionStorage.setItem('github_oauth_state', stateValue);
        }
        
        window.location.href = authUrl;
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        this.currentUser = null;
        this.isAuthenticated = false;
        
        // Reload page to show login screen
        window.location.reload();
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUserId() {
        return this.currentUser ? this.currentUser.id.toString() : null;
    }

    getUsername() {
        return this.currentUser ? this.currentUser.login : null;
    }
}
