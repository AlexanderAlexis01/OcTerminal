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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OCDocument();
});

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

// GitHub Pages Zip Download System
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
            'ui-effects.js'
        ];
        
        /* @tweakable Audio files to include in the zip */
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
        
        /* @tweakable Image files to include in the zip (these are the key assets that need to be included) */
        this.imageFiles = [
            'dust.png',
            'Ori.png', 
            'explosion.gif'
        ];
        
        /* @tweakable Whether to create subdirectories for assets in the zip */
        this.createAssetSubdirs = false;
    }

    async generateZip() {
        const zip = new JSZip();
        
        try {
            // Add HTML file (modified to remove download button)
            const htmlContent = await this.getModifiedHTML();
            zip.file('index.html', htmlContent);
            
            // Add JavaScript files
            for (const file of this.filesToInclude.filter(f => f.endsWith('.js'))) {
                const content = await this.fetchFileContent(file);
                zip.file(file, content);
            }
            
            // Add CSS file
            const cssContent = await this.fetchFileContent('styles.css');
            zip.file('styles.css', cssContent);
            
            // Add audio files with better error handling
            for (const file of this.audioFiles) {
                try {
                    const blob = await this.fetchFileAsBlob(file);
                    if (this.createAssetSubdirs) {
                        zip.file(`audio/${file}`, blob);
                    } else {
                        zip.file(file, blob);
                    }
                    console.log(`Successfully added audio file: ${file}`);
                } catch (error) {
                    console.warn(`Could not include audio file ${file}:`, error);
                }
            }
            
            // Add image files with better error handling and verification
            for (const file of this.imageFiles) {
                try {
                    const blob = await this.fetchFileAsBlob(file);
                    if (blob.size === 0) {
                        throw new Error(`File ${file} is empty or corrupted`);
                    }
                    if (this.createAssetSubdirs) {
                        zip.file(`images/${file}`, blob);
                    } else {
                        zip.file(file, blob);
                    }
                    console.log(`Successfully added image file: ${file} (${blob.size} bytes)`);
                } catch (error) {
                    console.warn(`Could not include image file ${file}:`, error);
                    // Try to create a placeholder or fallback
                    try {
                        const fallbackContent = `<!-- Missing file: ${file} -->`;
                        zip.file(`MISSING_${file}.txt`, fallbackContent);
                    } catch (fallbackError) {
                        console.error(`Could not create fallback for ${file}:`, fallbackError);
                    }
                }
            }
            
            // Add user-uploaded images from localStorage
            const userImages = JSON.parse(localStorage.getItem('oc_images') || '[]');
            if (userImages.length > 0) {
                const imagesFolder = zip.folder('user_images');
                userImages.forEach((img, index) => {
                    if (img.url && img.url.startsWith('data:')) {
                        const base64Data = img.url.split(',')[1];
                        const filename = img.filename || `image_${index}.jpg`;
                        imagesFolder.file(filename, base64Data, {base64: true});
                        console.log(`Added user image: ${filename}`);
                    }
                });
            }
            
            // Add localStorage data as JSON
            const localStorageData = {
                oc_character_data: localStorage.getItem('oc_character_data'),
                oc_images: localStorage.getItem('oc_images'),
                discoveredFiles: localStorage.getItem('discoveredFiles'),
                deletedFiles: localStorage.getItem('deletedFiles'),
                hwid_tool_installed: localStorage.getItem('hwid_tool_installed')
            };
            zip.file('saved_data.json', JSON.stringify(localStorageData, null, 2));
            
            // Add improved README for GitHub Pages
            const readmeContent = this.generateREADME();
            zip.file('README.md', readmeContent);
            
            // Add troubleshooting guide
            const troubleshootingContent = this.generateTroubleshootingGuide();
            zip.file('TROUBLESHOOTING.md', troubleshootingContent);
            
            return zip;
        } catch (error) {
            console.error('Error generating zip:', error);
            throw error;
        }
    }

    async getModifiedHTML() {
        const response = await fetch('index.html');
        let html = await response.text();
        
        // Remove the download button from the HTML
        html = html.replace(/<button class="nav-button" id="downloadZipButton">DOWNLOAD FOR GITHUB<\/button>\s*/g, '');
        
        // Remove JSZip script tag
        html = html.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip\/3\.10\.1\/jszip\.min\.js"><\/script>\s*/g, '');
        
        return html;
    }

    async fetchFileContent(filename) {
        const response = await fetch(filename);
        return await response.text();
    }

    async fetchFileAsBlob(filename) {
        /* @tweakable Timeout for fetching asset files in milliseconds */
        const fetchTimeout = 10000;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), fetchTimeout);
        
        try {
            const response = await fetch(filename, {
                signal: controller.signal,
                cache: 'no-cache'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const blob = await response.blob();
            clearTimeout(timeoutId);
            return blob;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    generateREADME() {
        return `# OC Character Database Terminal

A retro terminal-style character database application with a Windows 98 aesthetic.

## Features

- Character profile creation and editing
- Image gallery with upload functionality  
- Discovered files system with encrypted content
- Command prompt with investigation tools
- HWID spoofing game mechanics
- Ori plushie mini-game
- Retro CRT monitor effects

## Setup for GitHub Pages

1. Upload all files to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Your site will be available at \`https://yourusername.github.io/repository-name\`

**Important:** Make sure all asset files are uploaded:
- dust.png (dust particle effect)
- Ori.png (plushie character image)
- explosion.gif (explosion animation)
- All audio files (.mp3, .opus)

## File Structure

Your repository should look like this:
\`\`\`
/
├── index.html
├── styles.css
├── main.js
├── database-manager.js
├── image-handler.js
├── oc-document.js
├── boot-sequence.js
├── ui-effects.js
├── dust.png
├── Ori.png
├── explosion.gif
├── ambient.mp3
├── boot.mp3
├── old-computer-click-152513.mp3
├── errors-llargs-77182.mp3
├── old-desktop-pc-booting-24280.mp3
├── computer-startup-sound-effect-312870.mp3
├── computer-idle-ambient-loop-001-8420.mp3
├── SqueakyToy.opus
├── Roblox Explosion Sound Effect.mp3
├── user_images/ (if any)
└── saved_data.json
\`\`\`

## Usage

- Fill out character information in the editor
- Switch between editor and main views using navigation buttons
- Upload images to the character gallery
- Use the command prompt to discover hidden files
- Interact with various easter eggs and mini-games

## Data Persistence

Character data and images are saved to localStorage and will persist between sessions.
User data is included in the \`saved_data.json\` file for backup purposes.

## Browser Compatibility

Works best in modern browsers with JavaScript enabled.
Tested on Chrome, Firefox, Safari, and Edge.

## Troubleshooting

If assets are not loading:
1. Check that all files were uploaded to the correct directory
2. Verify file names match exactly (case-sensitive)
3. Check browser console for 404 errors
4. Ensure GitHub Pages is properly configured

See TROUBLESHOOTING.md for more detailed help.
`;
    }

    generateTroubleshootingGuide() {
        return `# Troubleshooting Guide

## Common Issues and Solutions

### Assets Not Loading (dust.png, Ori.png, explosion.gif)

**Problem:** Images or sounds not displaying/playing on GitHub Pages.

**Solutions:**
1. **Check file upload:** Ensure all asset files are uploaded to the root directory of your repository
2. **Verify file names:** File names are case-sensitive. Make sure they match exactly:
   - \`dust.png\` (not \`Dust.png\` or \`dust.PNG\`)
   - \`Ori.png\` (not \`ori.png\` or \`ORI.png\`)
   - \`explosion.gif\` (not \`Explosion.gif\`)
3. **Check file formats:** 
   - Images should be PNG/GIF format
   - Audio should be MP3/OPUS format
4. **Repository structure:** All files should be in the root directory, not in subfolders

### GitHub Pages Not Working

**Problem:** Site not accessible at GitHub Pages URL.

**Solutions:**
1. Go to repository Settings > Pages
2. Set Source to "Deploy from a branch"
3. Select "main" branch and "/ (root)" folder
4. Wait 5-10 minutes for deployment
5. Check that index.html is in the root directory

### Console Errors

**Problem:** JavaScript errors in browser console.

**Solutions:**
1. Check that all .js files are uploaded
2. Verify no syntax errors in uploaded files
3. Clear browser cache and reload
4. Check Network tab for failed file requests

### Audio Not Playing

**Problem:** Sound effects not working.

**Solutions:**
1. Check browser autoplay policies
2. User interaction required before audio can play
3. Verify audio files are properly uploaded
4. Check file formats (MP3 recommended for compatibility)

### localStorage Data

**Problem:** Character data not persisting.

**Solutions:**
1. localStorage works per domain/subdomain
2. Data saved on local version won't transfer to GitHub Pages
3. Use saved_data.json to restore data manually if needed

## File Verification Checklist

- [ ] index.html in root directory
- [ ] All .js files uploaded
- [ ] styles.css uploaded  
- [ ] dust.png uploaded (check file size > 0)
- [ ] Ori.png uploaded (check file size > 0)
- [ ] explosion.gif uploaded (check file size > 0)
- [ ] All audio files uploaded
- [ ] GitHub Pages enabled in settings
- [ ] No 404 errors in browser Network tab

## Getting Help

If issues persist:
1. Check browser console for error messages
2. Verify all files are in the repository
3. Test locally first before uploading
4. Check GitHub Pages deployment status
`;
    }

    async downloadZip() {
        try {
            const zip = await this.generateZip();
            const content = await zip.generateAsync({type: 'blob'});
            
            const url = window.URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'oc-database-github-pages.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Download failed:', error);
            return false;
        }
    }
}

// Initialize the converter when DOM is ready
let githubConverter;
document.addEventListener('DOMContentLoaded', () => {
    githubConverter = new GitHubPagesConverter();
});