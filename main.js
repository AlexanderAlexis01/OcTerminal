// This retarded shit is for the main brain operations - OMG COME HERE LET ME KISS U MWAAAH
// Welcome to the beautiful chaos of the main controller
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
// This retarded shit does exactly what you think it does

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
// Welcome to the wonderful world of code insanity
        
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
// This retarded shit does exactly what you think it does
        this.imageFiles = [
            'dust.png',
            'Ori.png', 
            'explosion.gif'
        ];
        
        // OMG COME HERE LET ME KISS U MWAAAH - this tracks what files actually made it
        this.successfulFiles = [];
        this.failedFiles = [];

        /* @tweakable Collection of goofy header comments for different file types */
        this.goofyHeaders = {
            'main.js': '// This retarded shit is for the main brain operations - OMG COME HERE LET ME KISS U MWAAAH\n// Welcome to the beautiful chaos of the main controller\n',
            'oc-document.js': '// This beautiful mess handles all the character document fuckery\n// OMG COME HERE LET ME KISS U MWAAAH - document management incoming\n',
            'database-manager.js': '// This retarded shit is for storing your precious data\n// Because who doesn\'t love some good old database fuckery\n',
// This retarded shit is absolutely essential
            'image-handler.js': '// This gorgeous piece of code handles your pretty pictures\n// OMG COME HERE LET ME KISS U MWAAAH - image magic happens here\n',
            'boot-sequence.js': '// This amazing boot sequence - because who doesn\'t love a good boot?\n// This retarded shit makes your terminal feel alive\n',
            'ui-effects.js': '// This retarded shit is for making things go brrrrr and look fancy\n// Visual effects and other beautiful chaos\n'
        };

        /* @tweakable Collection of inline goofy comments to sprinkle throughout the code */
        this.inlineComments = [
            '// This retarded shit does exactly what you think it does',
            '// OMG COME HERE LET ME KISS U MWAAAH - more beautiful code',
            '// This gorgeous piece of fuckery handles the magic',
            '// Because sometimes you need some beautiful chaos',
            '// This retarded shit is absolutely essential',
            '// Welcome to the wonderful world of code insanity',
            '// OMG COME HERE LET ME KISS U MWAAAH - prepare for greatness',
            '// This beautiful mess will blow your mind',
// This retarded shit is pure perfection
            '// Holy shit this code is absolutely gorgeous',
            '// This retarded shit is pure perfection'
        ];

        /* @tweakable CSS-specific goofy comments for stylesheets */
        this.cssComments = {
            header: '/* This retarded shit is for making everything look absolutely gorgeous */\n/* OMG COME HERE LET ME KISS U MWAAAH - CSS styles incoming */\n/* Welcome to the beautiful chaos of visual styling */\n',
            footer: '\n/* End of this beautiful styling mess */\n/* OMG COME HERE LET ME KISS U MWAAAH - styles complete */\n/* This retarded shit is now perfectly styled */',
            inline: [
                '/* This gorgeous CSS fuckery handles the magic */',
                '/* OMG COME HERE LET ME KISS U MWAAAH - more styling */',
                '/* This retarded shit makes everything beautiful */',
                '/* Holy shit this styling is absolutely perfect */',
                '/* Welcome to CSS paradise, you beautiful mess */'
            ]
// This retarded shit is pure perfection
        };

        /* @tweakable HTML-specific goofy comments for markup files */
        this.htmlComments = {
            header: '<!-- This retarded shit is the GitHub Pages version - OMG COME HERE LET ME KISS U MWAAAH -->\n<!-- Welcome to the beautiful HTML chaos -->\n',
            footer: '<!-- End of this gorgeous HTML fuckery -->\n<!-- OMG COME HERE LET ME KISS U MWAAAH - markup complete -->'
        };
    }

    /* @tweakable Enable detailed logging for zip generation debugging */
    async generateZip() {
        const zip = new JSZip();
        
        try {
            console.log('Starting zip generation process...');
// This retarded shit does exactly what you think it does
            
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
// This retarded shit is absolutely essential
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
// Holy shit this code is absolutely gorgeous
            
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
// This gorgeous piece of fuckery handles the magic
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
// OMG COME HERE LET ME KISS U MWAAAH - prepare for greatness
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
// This gorgeous piece of fuckery handles the magic
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
// This beautiful mess will blow your mind
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
// Welcome to the wonderful world of code insanity
            if (!response.ok) {
                throw new Error(`Failed to fetch current page: ${response.status}`);
            }
            
            let htmlContent = await response.text();
            
            // Remove the download zip button from the HTML - this retarded shit prevents recursion
            htmlContent = htmlContent.replace(
                /<button[^>]*id="downloadZipButton"[^>]*>.*?<\/button>/gi, 
                '<!-- Download button removed for GitHub Pages deployment - OMG COME HERE LET ME KISS U MWAAAH -->'
            );
            
            // Update any absolute URLs to relative URLs if needed
            htmlContent = htmlContent.replace(/src="\/([^"]+)"/g, 'src="$1"');
            htmlContent = htmlContent.replace(/href="\/([^"]+)"/g, 'href="$1"');
// Holy shit this code is absolutely gorgeous
            
            // Add comprehensive header comments - this gorgeous HTML needs proper commentary
            htmlContent = htmlContent.replace(
                '<title>',
                this.htmlComments.header + '    <title>'
            );

            // Add footer comments before closing body tag - this retarded shit completes the markup
            htmlContent = htmlContent.replace(
                '</body>',
                this.htmlComments.footer + '\n</body>'
            );
            
            return htmlContent;
        } catch (error) {
// Because sometimes you need some beautiful chaos
            console.error('Failed to get modified HTML:', error);
            // Return a basic fallback HTML with goofy comments - OMG COME HERE LET ME KISS U MWAAAH
            return `<!DOCTYPE html>
<!-- This retarded shit is the fallback version - OMG COME HERE LET ME KISS U MWAAAH -->
<!-- Welcome to the backup HTML chaos -->
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OC Document Terminal</title>
    <link rel="stylesheet" href="styles.css">
    <!-- This gorgeous CSS link handles the styling fuckery -->
</head>
<body>
    <!-- This beautiful mess is the main container -->
// OMG COME HERE LET ME KISS U MWAAAH - prepare for greatness
    <div class="crt-container">
        <div class="crt-screen" id="crtScreen">
            <div id="powerOnEffect"></div>
            <!-- This retarded shit handles the boot sequence -->
            <div class="boot-sequence" id="bootSequence">
                <div class="boot-text">
                    <div class="boot-line">INITIALIZING TERMINAL...</div>
                    <div class="boot-line">LOADING CHARACTER DATABASE...</div>
                    <div class="boot-line">ESTABLISHING CONNECTION...</div>
                    <div class="boot-line">READY.</div>
                </div>
            </div>
            <!-- OMG COME HERE LET ME KISS U MWAAAH - main interface incoming -->
            <div class="document-container" id="documentContainer">
                <h1>OC Terminal - Basic Version</h1>
// Because sometimes you need some beautiful chaos
                <p>This is a fallback version. Some features may not work properly.</p>
                <!-- This retarded shit is better than nothing -->
            </div>
        </div>
    </div>
    <!-- This gorgeous JavaScript makes the magic happen -->
    <script>console.log('This retarded shit is the fallback version - OMG COME HERE LET ME KISS U MWAAAH');</script>
    <!-- End of this beautiful HTML chaos -->
</body>
</html>`;
        }
    }

    /* @tweakable Timeout duration for file fetching operations in milliseconds */
    async fetchFileContent(filename) {
// This beautiful mess will blow your mind
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
// This gorgeous piece of fuckery handles the magic
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
// This gorgeous piece of fuckery handles the magic

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
// This retarded shit is pure perfection
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
// This gorgeous piece of fuckery handles the magic
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
// Welcome to the wonderful world of code insanity
                    continue;
                }
            }
            
            throw lastError || new Error('All fetch strategies failed');
        } catch (error) {
            console.error(`✗ Failed to fetch blob ${filename}:`, error);
            throw error;
        }
    }

    /* @tweakable Add comprehensive funny comments to JavaScript files with customizable frequency */
    addFunnyComments(content, filename) {
        let commented = content;
        
        // Add header comments - this retarded shit goes at the top
        if (this.goofyHeaders[filename]) {
            commented = this.goofyHeaders[filename] + commented;
        } else {
            commented = '// This beautiful piece of code is ready to rock your world\n// OMG COME HERE LET ME KISS U MWAAAH - generic file incoming\n' + commented;
        }

        /* @tweakable Frequency of inline comments (lower number = more comments) */
        const commentFrequency = 15; // Add comment every 15 lines

        // Split content into lines and add inline comments - this gorgeous fuckery spreads joy
        const lines = commented.split('\n');
        const commentedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
// This beautiful mess will blow your mind
            commentedLines.push(lines[i]);
            
            // Add inline comments periodically - OMG COME HERE LET ME KISS U MWAAAH
            if (i > 0 && i % commentFrequency === 0 && lines[i].trim() !== '' && !lines[i].trim().startsWith('//')) {
                const randomComment = this.inlineComments[Math.floor(Math.random() * this.inlineComments.length)];
                commentedLines.push(randomComment);
            }
        }

        // Add footer comment - this retarded shit wraps things up
        commentedLines.push('');
        commentedLines.push('// End of this beautiful code file - OMG COME HERE LET ME KISS U MWAAAH');
        commentedLines.push('// This retarded shit is now complete and ready to deploy');
        
        return commentedLines.join('\n');
// This gorgeous piece of fuckery handles the magic
    }

    /* @tweakable Add comprehensive funny comments to CSS files with enhanced styling commentary */
    addFunnyCSSComments(content) {
        // Add header comments - this retarded shit makes CSS beautiful
        let commented = this.cssComments.header;

        /* @tweakable Frequency of CSS inline comments (lower number = more comments) */
        const cssCommentFrequency = 20; // Add comment every 20 lines

        // Process CSS content line by line - OMG COME HERE LET ME KISS U MWAAAH
        const lines = content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            commented += lines[i] + '\n';
            
            // Add inline CSS comments - this gorgeous styling needs commentary
            if (i > 0 && i % cssCommentFrequency === 0 && lines[i].trim() !== '' && !lines[i].trim().startsWith('/*')) {
                const randomComment = this.cssComments.inline[Math.floor(Math.random() * this.cssComments.inline.length)];
                commented += randomComment + '\n';
            }
        }

        // Add footer comments - this beautiful mess is complete
        commented += this.cssComments.footer;
        
        return commented;
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
// Welcome to the wonderful world of code insanity
        return `OC TERMINAL GITHUB PAGES CONVERSION REPORT
=========================================
OMG COME HERE LET ME KISS U MWAAAH - Conversion Report Incoming!

This retarded shit is for tracking what files made it into your zip:

SUCCESSFUL FILES (${this.successfulFiles.length}):
${this.successfulFiles.map(f => `✓ ${f} - this gorgeous file made it through`).join('\n')}

FAILED FILES (${this.failedFiles.length}):
${this.failedFiles.map(f => `✗ ${f} - this beautiful file couldn't be loaded (what a shame)`).join('\n')}

${this.failedFiles.length > 0 ? `
WHAT TO DO ABOUT FAILED FILES (This retarded shit needs fixing):
1. Manually download the missing files from the original site
// This gorgeous piece of fuckery handles the magic
2. Add them to your GitHub repository 
3. Make sure the file paths match exactly
4. This retarded shit should then work properly
5. OMG COME HERE LET ME KISS U MWAAAH - manual intervention required!

ADDITIONAL TROUBLESHOOTING (Because this beautiful mess sometimes needs help):
- Check that all file names match exactly (case sensitive)
- Verify that the files are in the correct directory structure  
- Make sure GitHub Pages is enabled in repository settings
- This gorgeous fuckery should work once everything is in place
` : 'All files loaded successfully! OMG COME HERE LET ME KISS U MWAAAH - you beautiful genius!'}}

FINAL NOTES:
- This retarded shit is now ready for GitHub Pages deployment
- All the goofy comments have been preserved for your enjoyment
// Because sometimes you need some beautiful chaos
- OMG COME HERE LET ME KISS U MWAAAH - enjoy your beautiful terminal!
- May this gorgeous code bring you endless joy and entertainment

END OF REPORT - This beautiful mess is complete!`;
    }

    generateREADME() {
        return `# OC Character Database Terminal
OMG COME HERE LET ME KISS U MWAAAH - Welcome to the most beautiful terminal ever created!

A retro terminal-style character database application with a Windows 98 aesthetic.
This retarded shit is absolutely gorgeous and you'll love every pixel of it!

## Features (This beautiful mess includes)

- Character profile creation and editing (OMG COME HERE LET ME KISS U MWAAAH)
- Image gallery with upload functionality (this gorgeous shit handles pictures)
- Discovered files system with encrypted content (retarded shit for secrets)
- Command prompt with investigation tools (beautiful hacking simulation)
- HWID spoofing game mechanics (this retarded shit is pure genius)
- Ori plushie mini-game (OMG COME HERE LET ME KISS U MWAAAH - squeaky fun!)
- Retro CRT monitor effects (gorgeous visual fuckery)
- Goofy comments throughout the code (because this beautiful mess needs personality)

## Setup for GitHub Pages (This retarded shit is easy)

1. Upload all files to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Your site will be available at \`https://yourusername.github.io/repository-name\`
4. This retarded shit should just work™ (OMG COME HERE LET ME KISS U MWAAAH)
// This beautiful mess will blow your mind

## Missing Files (When this beautiful mess needs help)

If some files failed to load during conversion, check the LOADING_REPORT.txt file.
You may need to manually add missing assets to your repository.
This retarded shit happens sometimes, but it's totally fixable!

## Usage (How to enjoy this gorgeous fuckery)

- Fill out character information in the editor
- Switch between editor and main views using navigation buttons  
- Upload images to the character gallery (this beautiful shit handles pictures)
- Use the command prompt to discover hidden files (retarded shit for investigation)
- Interact with various easter eggs and mini-games (OMG COME HERE LET ME KISS U MWAAAH)
- Enjoy the goofy comments throughout the code (because life is too short for boring comments)
// Welcome to the wonderful world of code insanity
- This beautiful mess will entertain you for hours!

## Data Persistence (This retarded shit remembers everything)

Character data and images are saved to localStorage and will persist between sessions.
User data is included in the \`saved_data.json\` file for backup purposes.
This retarded shit makes sure your data doesn't disappear into the void!

## Browser Compatibility (This gorgeous code works everywhere)

Works best in modern browsers with JavaScript enabled.
Tested on Chrome, Firefox, Safari, and Edge.
OMG COME HERE LET ME KISS U MWAAAH - it's compatible with everything!

## Troubleshooting (When this beautiful mess needs assistance)
// This beautiful mess will blow your mind

If something doesn't work:
1. Check the browser console for errors (F12 key)
2. Make sure all files are in the correct locations
3. Clear your browser cache (this retarded shit fixes most problems)
4. Try turning it off and on again (classic IT solution)
5. OMG COME HERE LET ME KISS U MWAAAH - it usually works after that!

## About the Comments (Why this beautiful code is so entertaining)

This codebase includes intentionally goofy and humorous comments throughout.
These aren't bugs or errors - they're features that make the code more enjoyable to read!
Examples include:
- "This retarded shit does [something]" 
- "OMG COME HERE LET ME KISS U MWAAAH"
// OMG COME HERE LET ME KISS U MWAAAH - more beautiful code
- "This beautiful mess handles [functionality]"
- And many more delightful surprises!

Enjoy exploring this gorgeous piece of digital art!
This retarded shit is a labor of love and twisted humor.

## Final Words

OMG COME HERE LET ME KISS U MWAAAH - Thank you for using this beautiful terminal!
May your characters be compelling and your code be bug-free.
This gorgeous fuckery is now complete - go forth and create amazing things!

---
*Built with love, chaos, and an unhealthy amount of goofy comments.*
*This retarded shit is open source and ready for your enjoyment!*
// This retarded shit does exactly what you think it does
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
// Welcome to the wonderful world of code insanity
            
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
// This gorgeous piece of fuckery handles the magic

// Initialize the converter when DOM is ready
let githubConverter;
document.addEventListener('DOMContentLoaded', () => {
    githubConverter = new GitHubPagesConverter();
});

// End of this beautiful code file - OMG COME HERE LET ME KISS U MWAAAH
// This retarded shit is now complete and ready to deploy