// This retarded shit is for the main brain operations - OMG COME HERE LET ME KISS U MWAAAH
// Add glitch animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes glitch {
        0% { transform: translateX(0); }
        20% { transform: translateX(-2px); }
        40% { transform: translateX(2px); }
        60% { transform: translateX(-1px); }
        80% { transform: translateX(1px); }
        100% { transform: translateX(0); }
    }
`;
document.head.appendChild(style);

/* @tweakable Enable GitHub authentication and per-user storage with real-time synchronization */
const ENABLE_GITHUB_AUTH = true;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    if (ENABLE_GITHUB_AUTH) {
        // Authentication and OC Document initialization is now handled in database-manager.js
        // This retarded shit ensures proper GitHub-first initialization order
        console.log('GitHub authentication system active with real-time sync...');
        
        // @tweakable Setup download project button for source code access on live version only
        setupDownloadProjectButton();
    } else {
        throw new Error('GitHub authentication is required - local mode disabled');
    }
});

/* @tweakable Download project functionality - only available on live hosted version for developers */
function setupDownloadProjectButton() {
    const downloadBtn = document.getElementById('downloadProjectBtn');
    const downloadSection = document.getElementById('downloadProjectSection');
    
    // @tweakable Detection method for determining if running on live hosted version vs downloaded copy
    const isLiveHostedVersion = window.location.hostname !== 'localhost' && 
                               window.location.hostname !== '127.0.0.1' && 
                               !window.location.hostname.includes('file://') &&
                               !document.querySelector('meta[name="downloaded-version"]');
    
    if (!isLiveHostedVersion && downloadSection) {
        // @tweakable Hide download button on downloaded/local versions to prevent recursion
        downloadSection.style.display = 'none';
        return;
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            try {
                downloadBtn.disabled = true;
                downloadBtn.textContent = 'Generating Download...';
                
                // @tweakable Use existing zip generation system for project download
                if (!githubConverter) {
                    githubConverter = new GitHubPagesConverter();
                }
                
                const success = await githubConverter.downloadZip();
                
                if (success) {
                    downloadBtn.textContent = 'Download Complete!';
                    setTimeout(() => {
                        downloadBtn.disabled = false;
                        downloadBtn.innerHTML = `
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                                <polyline points="14,2 14,8 20,8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                                <polyline points="10,9 9,9 8,9"/>
                            </svg>
                            Download Project (GitHub Ready)
                        `;
                    }, 3000);
                } else {
                    downloadBtn.textContent = 'Download Failed - Try Again';
                    downloadBtn.disabled = false;
                }
            } catch (error) {
                console.error('Download project failed:', error);
                downloadBtn.textContent = 'Download Failed - Try Again';
                downloadBtn.disabled = false;
            }
        });
    }
}

// Add some creepy Easter eggs
document.addEventListener('keydown', (e) => {
    // Konami code or specific key combinations for hidden features
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 2000);
    }
});

// GitHub Pages Zip Download System - updated for GitHub auth
class GitHubPagesConverter {
    constructor() {
        /* @tweakable Files to include in the GitHub Pages zip download */
        this.filesToInclude = [
            'index.html',
            'styles.css', 
            'main.js',
            'database-manager.js',
            'image-handler.js',
            'oc-document.js',
            'boot-sequence.js',
            'ui-effects.js',
            'github-auth.js',
            'github-storage.js'
        ];
        
        /* @tweakable Audio files to include in the zip - this retarded shit is for making noise */
        this.audioFiles = [
            'ambient.mp3',
            'boot.mp3', 
            'old-computer-click-152513.mp3',
            'errors-llargs-77182.mp3',
            'old-desktop-pc-booting-24280.mp3',
            'computer-startup-sound-effect-312870.mp3',
            'computer-idle-ambient-loop-001-8420.mp3',
            'SqueakyToy.opus',
            'Roblox Explosion Sound Effect.mp3'
        ];
        
        /* @tweakable Image files to include in the zip - this beautiful mess handles the pretty pictures */
        this.imageFiles = [
            'dust.png',
            'Ori.png', 
            'explosion.gif'
        ];
        
        // OMG COME HERE LET ME KISS U MWAAAH - this tracks what files actually made it
        this.successfulFiles = [];
        this.failedFiles = [];
    }

    /* @tweakable Enable detailed logging for zip generation debugging */
    async generateZip() {
        const zip = new JSZip();
        
        try {
            console.log('Starting zip generation process...');
            
            // Add HTML file (modified to remove download button)
            try {
                const htmlContent = await this.getModifiedHTML();
                zip.file('index.html', htmlContent);
                this.successfulFiles.push('index.html');
                console.log('✓ HTML file added successfully');
            } catch (error) {
                console.error('✗ HTML file failed:', error);
                this.failedFiles.push('index.html');
                // Create a basic HTML fallback
                zip.file('index.html', '<!DOCTYPE html><html><head><title>OC Terminal</title></head><body><h1>OC Terminal - HTML generation failed</h1><p>Please check the console for errors.</p></body></html>');
            }
            
            // Add JavaScript files - this retarded shit is for the brain of the operation
            for (const file of this.filesToInclude.filter(f => f.endsWith('.js'))) {
                try {
                    console.log(`Fetching JavaScript file: ${file}`);
                    const content = await this.fetchFileContent(file);
                    // Add some spicy comments to the JS files
                    const commentedContent = this.addFunnyComments(content, file);
                    zip.file(file, commentedContent);
                    this.successfulFiles.push(file);
                    console.log(`✓ ${file} added successfully`);
                } catch (error) {
                    console.warn(`✗ JavaScript file ${file} failed to load:`, error);
                    this.failedFiles.push(file);
                    // Create a placeholder file so things don't break completely
                    zip.file(file, `// Failed to load ${file} - this happens sometimes, deal with it\nconsole.error('${file} could not be loaded');\n// Error: ${error.message}`);
                }
            }
            
            // Add CSS file - this retarded shit is for making things pretty
            try {
                console.log('Fetching CSS file...');
                const cssContent = await this.fetchFileContent('styles.css');
                const commentedCSS = this.addFunnyCSSComments(cssContent);
                zip.file('styles.css', commentedCSS);
                this.successfulFiles.push('styles.css');
                console.log('✓ CSS file added successfully');
            } catch (error) {
                console.warn('✗ CSS file failed to load:', error);
                this.failedFiles.push('styles.css');
                zip.file('styles.css', '/* CSS failed to load - your site will look like garbage */\nbody { font-family: Comic Sans MS; }');
            }
            
            // Add audio files with better error handling - OMG COME HERE LET ME KISS U MWAAAH
            for (const file of this.audioFiles) {
                try {
                    console.log(`Fetching audio file: ${file}`);
                    const blob = await this.fetchFileAsBlob(file);
                    if (blob && blob.size > 0) {
                        zip.file(file, blob);
                        this.successfulFiles.push(file);
                        console.log(`✓ ${file} added successfully (${blob.size} bytes)`);
                    } else {
                        throw new Error('Empty or invalid file');
                    }
                } catch (error) {
                    console.warn(`✗ Audio file ${file} failed to load:`, error);
                    this.failedFiles.push(file);
                    // Create a silent audio placeholder
                    await this.createSilentAudioPlaceholder(zip, file);
                }
            }
            
            // Add image files with better error handling - this retarded shit is for the eye candy
            for (const file of this.imageFiles) {
                try {
                    console.log(`Fetching image file: ${file}`);
                    const blob = await this.fetchFileAsBlob(file);
                    if (blob && blob.size > 0) {
                        zip.file(file, blob);
                        this.successfulFiles.push(file);
                        console.log(`✓ ${file} added successfully (${blob.size} bytes)`);
                    } else {
                        throw new Error('Empty or invalid image file');
                    }
                } catch (error) {
                    console.warn(`✗ Image file ${file} failed to load:`, error);
                    this.failedFiles.push(file);
                    // Create a placeholder image
                    await this.createImagePlaceholder(zip, file);
                }
            }
            
            // Add user-uploaded images from localStorage
            try {
                const userImages = JSON.parse(localStorage.getItem('oc_images') || '[]');
                if (userImages.length > 0) {
                    const imagesFolder = zip.folder('user_images');
                    userImages.forEach((img, index) => {
                        if (img.url && img.url.startsWith('data:')) {
                            const base64Data = img.url.split(',')[1];
                            const filename = img.filename || `image_${index}.jpg`;
                            imagesFolder.file(filename, base64Data, {base64: true});
                        }
                    });
                    console.log(`✓ Added ${userImages.length} user images`);
                }
            } catch (error) {
                console.warn('✗ Failed to add user images:', error);
            }
            
            // Add localStorage data as JSON
            try {
                const localStorageData = {
                    oc_character_data: localStorage.getItem('oc_character_data'),
                    oc_images: localStorage.getItem('oc_images'),
                    discoveredFiles: localStorage.getItem('discoveredFiles'),
                    deletedFiles: localStorage.getItem('deletedFiles'),
                    hwid_tool_installed: localStorage.getItem('hwid_tool_installed')
                };
                zip.file('saved_data.json', JSON.stringify(localStorageData, null, 2));
                console.log('✓ Added localStorage data');
            } catch (error) {
                console.warn('✗ Failed to add localStorage data:', error);
            }
            
            // Add README for GitHub Pages
            try {
                const readmeContent = this.generateREADME();
                zip.file('README.md', readmeContent);
                console.log('✓ Added README.md');
            } catch (error) {
                console.warn('✗ Failed to add README:', error);
            }
            
            // Add a detailed report of what worked and what didn't
            try {
                const reportContent = this.generateLoadingReport();
                zip.file('LOADING_REPORT.txt', reportContent);
                console.log('✓ Added loading report');
            } catch (error) {
                console.warn('✗ Failed to add loading report:', error);
            }
            
            console.log('Zip generation completed successfully');
            return zip;
        } catch (error) {
            console.error('Error generating zip:', error);
            throw error;
        }
    }

    /* @tweakable HTML content modifications for GitHub Pages deployment with download button removal */
    async getModifiedHTML() {
        try {
            // Get the current HTML content
            const response = await fetch(window.location.href);
            if (!response.ok) {
                throw new Error(`Failed to fetch current page: ${response.status}`);
            }
            
            let htmlContent = await response.text();
            
            // @tweakable Remove download project section from downloaded version to prevent recursion
            htmlContent = htmlContent.replace(
                /<div class="download-project-section"[^>]*>.*?<\/div>\s*<\/div>\s*<\/div>/gs,
                '</div>\n                </div>'
            );
            
            // @tweakable Add meta tag to identify downloaded version and prevent download button display
            htmlContent = htmlContent.replace(
                '<meta name="viewport"',
                '<meta name="downloaded-version" content="true">\n    <meta name="viewport"'
            );
            
            // Remove the download zip button from the HTML - this retarded shit prevents recursion
            htmlContent = htmlContent.replace(
                /<button[^>]*id="downloadZipButton"[^>]*>.*?<\/button>/gi, 
                '<!-- Download button removed for GitHub Pages deployment -->'
            );
            
            // Update any absolute URLs to relative URLs if needed
            htmlContent = htmlContent.replace(/src="\/([^"]+)"/g, 'src="$1"');
            htmlContent = htmlContent.replace(/href="\/([^"]+)"/g, 'href="$1"');
            
            // Add GitHub auth setup instructions with tweakable configurations
            htmlContent = htmlContent.replace(
                '<title>',
                `<!-- GitHub OAuth Setup Required for Full Functionality -->\n    <!-- 1. Create a GitHub OAuth App at https://github.com/settings/applications/new -->\n    <!-- 2. Set the client ID in github-auth.js (marked with @tweakable) -->\n    <!-- 3. Set up a backend service for secure token exchange (see README) -->\n    <!-- 4. Configure redirect URI to match your deployment URL -->\n    <!-- This retarded shit needs proper OAuth setup to work with real-time GitHub integration -->\n    <title>`
            );
            
            return htmlContent;
        } catch (error) {
            console.error('Failed to get modified HTML:', error);
            // Return a basic fallback HTML with auth setup instructions
            return this.getFallbackHTML();
        }
    }

    getFallbackHTML() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OC Document Terminal</title>
    <link rel="stylesheet" href="styles.css">
    <!-- GitHub OAuth Setup Required -->
    <!-- This retarded shit needs proper GitHub OAuth configuration -->
</head>
<body>
    <div class="login-overlay">
        <div class="login-container">
            <h2>Setup Required</h2>
            <p>This deployment requires GitHub OAuth configuration.</p>
            <p>See README.md for setup instructions.</p>
        </div>
    </div>
    <script>console.log('This beautiful mess needs GitHub OAuth setup');</script>
</body>
</html>`;
    }

    /* @tweakable Timeout duration for file fetching operations in milliseconds */
    async fetchFileContent(filename) {
        const timeoutDuration = 10000; // 10 seconds
        
        try {
            console.log(`Attempting to fetch: ${filename}`);
            
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`Timeout: ${filename} took too long to load`)), timeoutDuration);
            });
            
            // Create the fetch promise
            const fetchPromise = fetch(filename, { 
                method: 'GET',
                cache: 'no-cache' // This retarded shit prevents caching issues
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.text();
            });
            
            // Race between timeout and fetch
            const result = await Promise.race([fetchPromise, timeoutPromise]);
            console.log(`✓ Successfully fetched ${filename}`);
            return result;
        } catch (error) {
            console.error(`✗ Failed to fetch ${filename}:`, error);
            throw error;
        }
    }

    /* @tweakable Improved blob fetching with multiple fallback strategies */
    async fetchFileAsBlob(filename) {
        const timeoutDuration = 15000; // 15 seconds for binary files
        
        try {
            console.log(`Attempting to fetch blob: ${filename}`);
            
            // Create timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`Timeout: ${filename} took too long to load`)), timeoutDuration);
            });
            
            // Try multiple fetch strategies - this retarded shit covers all bases
            const fetchStrategies = [
                // Strategy 1: Direct fetch
                () => fetch(filename, { method: 'GET', cache: 'no-cache' }),
                // Strategy 2: Fetch with explicit origin
                () => fetch(`${window.location.origin}/${filename}`, { method: 'GET', cache: 'no-cache' }),
                // Strategy 3: Fetch with current path base
                () => fetch(`${window.location.pathname.replace(/\/[^\/]*$/, '')}/${filename}`, { method: 'GET', cache: 'no-cache' })
            ];
            
            let lastError;
            for (const [index, strategy] of fetchStrategies.entries()) {
                try {
                    console.log(`Trying fetch strategy ${index + 1} for ${filename}`);
                    const fetchPromise = strategy().then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        return response.blob();
                    });
                    
                    const blob = await Promise.race([fetchPromise, timeoutPromise]);
                    
                    if (blob.size === 0) {
                        throw new Error('File is empty');
                    }
                    
                    console.log(`✓ Successfully fetched blob ${filename} using strategy ${index + 1} (${blob.size} bytes)`);
                    return blob;
                } catch (error) {
                    console.warn(`Strategy ${index + 1} failed for ${filename}:`, error);
                    lastError = error;
                    continue;
                }
            }
            
            throw lastError || new Error('All fetch strategies failed');
        } catch (error) {
            console.error(`✗ Failed to fetch blob ${filename}:`, error);
            throw error;
        }
    }

    /* @tweakable Add funny comments to JavaScript files */
    addFunnyComments(content, filename) {
        let commented = content;
        
        // Add header comment based on filename
        const headerComments = {
            'main.js': '// This retarded shit is for the main brain operations - OMG COME HERE LET ME KISS U MWAAAH\n',
            'oc-document.js': '// This beautiful mess handles all the character document fuckery\n',
            'database-manager.js': '// This retarded shit is for storing your precious data\n',
            'image-handler.js': '// This gorgeous piece of code handles your pretty pictures\n',
            'boot-sequence.js': '// This amazing boot sequence - because who doesn\'t love a good boot?\n',
            'ui-effects.js': '// This retarded shit is for making things go brrrrr and look fancy\n'
        };
        
        if (headerComments[filename]) {
            commented = headerComments[filename] + commented;
        }
        
        return commented;
    }

    /* @tweakable Add funny comments to CSS files */
    addFunnyCSSComments(content) {
        return `/* This retarded shit is for making everything look absolutely gorgeous */
/* OMG COME HERE LET ME KISS U MWAAAH - CSS styles incoming */

${content}

/* End of this beautiful styling mess */`;
    }

    async createSilentAudioPlaceholder(zip, filename) {
        // Create a minimal silent audio file as placeholder - this retarded shit prevents audio errors
        const silentAudioComment = `// ${filename} failed to load - using silent placeholder\n// This retarded shit prevents the app from breaking when audio files are missing`;
        zip.file(`${filename}.txt`, silentAudioComment);
    }

    async createImagePlaceholder(zip, filename) {
        // Create a placeholder text file explaining the missing image - OMG COME HERE LET ME KISS U MWAAAH
        const placeholderText = `Image file ${filename} failed to load.
This retarded shit happens sometimes when files can't be fetched properly.
The app will still work, but this image won't display.

You can manually add this file to your GitHub repository to fix this issue.`;
        zip.file(`${filename}_MISSING.txt`, placeholderText);
    }

    generateLoadingReport() {
        return `OC TERMINAL GITHUB PAGES CONVERSION REPORT
=========================================

This retarded shit is for tracking what files made it into your zip:

SUCCESSFUL FILES (${this.successfulFiles.length}):
${this.successfulFiles.map(f => `✓ ${f}`).join('\n')}

FAILED FILES (${this.failedFiles.length}):
${this.failedFiles.map(f => `✗ ${f} - this beautiful file couldn't be loaded`).join('\n')}

${this.failedFiles.length > 0 ? `
WHAT TO DO ABOUT FAILED FILES:
1. Manually download the missing files from the original site
2. Add them to your GitHub repository 
3. Make sure the file paths match exactly
4. This retarded shit should then work properly

OMG COME HERE LET ME KISS U MWAAAH - your conversion is complete!
` : 'All files loaded successfully! OMG COME HERE LET ME KISS U MWAAAH'}`;
    }

    /* @tweakable Enhanced README generation with download project instructions */
    generateREADME() {
        return `# OC Character Database Terminal

A retro terminal-style character database application with GitHub OAuth authentication and real-time GitHub synchronization.
This retarded shit is absolutely gorgeous and integrates fully with GitHub!

## Quick Start

This project was downloaded from the live OC Terminal system. To deploy your own version:

1. **Extract this zip** to your desired directory
2. **Set up GitHub OAuth** (see instructions below)
3. **Deploy to GitHub Pages** or your preferred hosting service
4. **Configure authentication** with your GitHub app credentials

## Features

- GitHub OAuth authentication for secure user access
- Real-time GitHub repository synchronization for all user data
- Per-user private GitHub repositories for data storage
- Character profile creation and editing with live commits
- Image gallery with GitHub-hosted file storage
- Discovered files system with encrypted content
- Command prompt with investigation tools
- HWID spoofing game mechanics
- Retro CRT monitor effects
- Admin panel for user management (AlexanderAlexis01 only)
- **Download project functionality** (only on live hosted versions)

## GitHub OAuth Setup (REQUIRED)

This application requires GitHub OAuth for user authentication and real-time data storage.

### 1. Create GitHub OAuth App

1. Go to https://github.com/settings/applications/new
2. Fill in the application details:
   - Application name: "OC Terminal Database"
   - Homepage URL: Your deployed site URL
   - Authorization callback URL: Your deployed site URL
3. Note down the Client ID and Client Secret

### 2. Configure Authentication (@tweakable settings)

Update \`github-auth.js\` with your OAuth app details:
\`\`\`javascript
// @tweakable GitHub OAuth application client ID
this.clientId = 'your_actual_github_client_id_here';
// @tweakable GitHub OAuth redirect URI
this.redirectUri = 'https://yourusername.github.io/your-repo-name/';
// @tweakable GitHub OAuth scopes for repository access
this.scopes = 'user repo';
\`\`\`

### 3. Set Up Token Exchange Backend

GitHub OAuth requires a backend service for secure token exchange.
You can use:
- Netlify Functions
- Vercel API Routes  
- A simple Express.js server
- GitHub's own OAuth App flow

Example backend endpoint (\`/api/auth/github/token\`):
\`\`\`javascript
// This retarded shit exchanges auth codes for tokens securely
app.post('/api/auth/github/token', async (req, res) => {
  const { code, client_id, redirect_uri } = req.body;
  
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: new URLSearchParams({
      client_id,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri
    })
  });
  
  const data = await response.json();
  res.json(data);
});
\`\`\`

## Download Project Feature

The live hosted version includes a "Download Project (GitHub Ready)" button on the login screen that allows developers to:

- **Access complete source code** for local development
- **Deploy custom instances** with their own GitHub OAuth setup
- **Contribute to the project** with modifications and improvements
- **Study the codebase** for educational purposes

**Note:** The download button is automatically removed from downloaded copies to prevent recursive downloads and maintain clean deployments.

## Real-Time GitHub Integration

All user data is stored and synchronized in real-time with GitHub:

### Data Storage Structure
- Repository name: \`oc-terminal-data-{user-id}\`  
- Contains character data, images, and game progress
- Each edit creates a new Git commit for full version history
- Private repositories ensure data security

### Real-Time Features (@tweakable configurations)
- Auto-save with GitHub commits every few seconds
- Live synchronization across multiple sessions
- Git history for all changes and edits
- Admin action logging with commit tracking

## Privacy & Security

- All user data is stored in private GitHub repositories
- Users can only access their own data (except admin)
- No cross-user data access possible
- GitHub OAuth provides secure authentication
- Admin privileges restricted to: AlexanderAlexis01
- This retarded shit is properly isolated per user with GitHub's security!

## Admin Features

The designated admin account (AlexanderAlexis01) has special privileges:
- View and edit any user's page
- Ban/unban users from the system
- Access comprehensive admin logs
- Emergency system controls
- All admin actions are logged with GitHub commits

## Deployment Options

### GitHub Pages (Recommended)
1. Push this code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Configure your GitHub OAuth app with the Pages URL
4. Deploy and access via your GitHub Pages URL

### Other Hosting Services
- Netlify: Drag and drop the extracted folder
- Vercel: Import the GitHub repository
- Traditional web hosting: Upload files via FTP

## Browser Compatibility

Works best in modern browsers with JavaScript enabled.
Tested on Chrome, Firefox, Safari, and Edge.
OMG COME HERE LET ME KISS U MWAAAH - it's compatible with real-time GitHub sync!

## Troubleshooting

If authentication fails:
1. Check your GitHub OAuth app configuration
2. Verify the client ID in github-auth.js (@tweakable section)
3. Ensure your backend token exchange is working
4. Check browser console for errors
5. Verify all @tweakable settings are correctly configured
6. This retarded shit usually fixes most auth problems with GitHub integration

## Contributing

Feel free to fork this project and submit pull requests! The download feature makes it easy to get started with development.
`;
    }

    /* @tweakable Download process with enhanced error reporting */
    async downloadZip() {
        try {
            console.log('Starting zip download process...');
            
            // Show loading indicator
            if (window.ocDocument && window.ocDocument.uiEffects) {
                window.ocDocument.uiEffects.updateStatus('Generating zip...', 'editing');
            }
            
            const zip = await this.generateZip();
            console.log('Zip generation completed, creating blob...');
            
            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });
            
            console.log(`Zip blob created successfully (${content.size} bytes)`);
            
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'oc-database-github-pages.zip';
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the blob URL after a delay - this retarded shit prevents memory leaks
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 1000);
            
            console.log('Download initiated successfully');
            
            if (window.ocDocument && window.ocDocument.uiEffects) {
                window.ocDocument.uiEffects.updateStatus(`Download completed! (${this.successfulFiles.length} files)`, 'success');
            }
            
            return true;
        } catch (error) {
            console.error('Download failed:', error);
            
            if (window.ocDocument && window.ocDocument.uiEffects) {
                window.ocDocument.uiEffects.updateStatus(`Download failed: ${error.message}`, 'error');
            }
            
            // Show detailed error to user
            alert(`Download failed!\n\nError: ${error.message}\n\nCheck the browser console (F12) for more details.\n\nThis retarded shit sometimes happens due to network issues or browser restrictions.`);
            
            return false;
        }
    }
}

// Initialize the converter when DOM is ready
let githubConverter;
document.addEventListener('DOMContentLoaded', () => {
    githubConverter = new GitHubPagesConverter();
});