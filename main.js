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
        
        /* @tweakable Image files to include in the zip */
        this.imageFiles = [
            'dust.png',
            'Ori.png',
            'explosion.gif'
        ];
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
            
            // Add audio files
            for (const file of this.audioFiles) {
                try {
                    const blob = await this.fetchFileAsBlob(file);
                    zip.file(file, blob);
                } catch (error) {
                    console.warn(`Could not include ${file}:`, error);
                }
            }
            
            // Add image files
            for (const file of this.imageFiles) {
                try {
                    const blob = await this.fetchFileAsBlob(file);
                    zip.file(file, blob);
                } catch (error) {
                    console.warn(`Could not include ${file}:`, error);
                }
            }
            
            // Add user-uploaded images from localStorage
            const userImages = JSON.parse(localStorage.getItem('oc_images') || '[]');
            const imagesFolder = zip.folder('user_images');
            userImages.forEach((img, index) => {
                if (img.url && img.url.startsWith('data:')) {
                    const base64Data = img.url.split(',')[1];
                    const filename = img.filename || `image_${index}.jpg`;
                    imagesFolder.file(filename, base64Data, {base64: true});
                }
            });
            
            // Add localStorage data as JSON
            const localStorageData = {
                oc_character_data: localStorage.getItem('oc_character_data'),
                oc_images: localStorage.getItem('oc_images'),
                discoveredFiles: localStorage.getItem('discoveredFiles'),
                deletedFiles: localStorage.getItem('deletedFiles'),
                hwid_tool_installed: localStorage.getItem('hwid_tool_installed')
            };
            zip.file('saved_data.json', JSON.stringify(localStorageData, null, 2));
            
            // Add README for GitHub Pages
            const readmeContent = this.generateREADME();
            zip.file('README.md', readmeContent);
            
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
        const response = await fetch(filename);
        return await response.blob();
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