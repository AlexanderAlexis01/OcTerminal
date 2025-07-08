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

    /* @tweakable HTML content modifications for GitHub Pages deployment */
    async getModifiedHTML() {
        try {
            // Get the current HTML content
            const response = await fetch(window.location.href);
            if (!response.ok) {
                throw new Error(`Failed to fetch current page: ${response.status}`);
            }
            
            let htmlContent = await response.text();
            
            // Remove the download zip button from the HTML - this retarded shit prevents recursion
            htmlContent = htmlContent.replace(
                /<button[^>]*id="downloadZipButton"[^>]*>.*?<\/button>/gi, 
                '<!-- Download button removed for GitHub Pages deployment -->'
            );
            
            // Update any absolute URLs to relative URLs if needed
            htmlContent = htmlContent.replace(/src="\/([^"]+)"/g, 'src="$1"');
            htmlContent = htmlContent.replace(/href="\/([^"]+)"/g, 'href="$1"');
            
            // Add a comment indicating this is the GitHub Pages version
            htmlContent = htmlContent.replace(
                '<title>',
                '<!-- This retarded shit is the GitHub Pages version - OMG COME HERE LET ME KISS U MWAAAH -->\n    <title>'
            );
            
            return htmlContent;
        } catch (error) {
            console.error('Failed to get modified HTML:', error);
            // Return a basic fallback HTML
            return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OC Document Terminal</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="crt-container">
        <div class="crt-screen" id="crtScreen">
            <div id="powerOnEffect"></div>
            <div class="boot-sequence" id="bootSequence">
                <div class="boot-text">
                    <div class="boot-line">INITIALIZING TERMINAL...</div>
                    <div class="boot-line">LOADING CHARACTER DATABASE...</div>
                    <div class="boot-line">ESTABLISHING CONNECTION...</div>
                    <div class="boot-line">READY.</div>
                </div>
            </div>
            <div class="document-container" id="documentContainer">
                <h1>OC Terminal - Basic Version</h1>
                <p>This is a fallback version. Some features may not work properly.</p>
            </div>
        </div>
    </div>
    <script>console.log('This retarded shit is the fallback version');</script>
</body>
</html>`;
        }
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

    generateREADME() {
        return `# OC Character Database Terminal

A retro terminal-style character database application with a Windows 98 aesthetic.
This retarded shit is absolutely gorgeous and you'll love it!

## Features

- Character profile creation and editing
- Image gallery with upload functionality  
- Discovered files system with encrypted content
- Command prompt with investigation tools
- HWID spoofing game mechanics
- Ori plushie mini-game (OMG COME HERE LET ME KISS U MWAAAH)
- Retro CRT monitor effects

## Setup for GitHub Pages

1. Upload all files to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Your site will be available at \`https://yourusername.github.io/repository-name\`
4. This retarded shit should just work™

## Missing Files

If some files failed to load during conversion, check the LOADING_REPORT.txt file.
You may need to manually add missing assets to your repository.

## Usage

- Fill out character information in the editor
- Switch between editor and main views using navigation buttons
- Upload images to the character gallery
- Use the command prompt to discover hidden files
- Interact with various easter eggs and mini-games
- This beautiful mess will entertain you for hours

## Data Persistence

Character data and images are saved to localStorage and will persist between sessions.
User data is included in the \`saved_data.json\` file for backup purposes.
This retarded shit makes sure your data doesn't disappear!

## Browser Compatibility

Works best in modern browsers with JavaScript enabled.
Tested on Chrome, Firefox, Safari, and Edge.
OMG COME HERE LET ME KISS U MWAAAH - it's compatible!

## Troubleshooting

If something doesn't work:
1. Check the browser console for errors
2. Make sure all files are in the correct locations
3. Clear your browser cache
4. This retarded shit usually fixes most problems
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