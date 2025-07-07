// ooh shiny! this makes add glitch animation styles look less boring
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

// yeet the data into the void and pray brain cells activated: setting up initialize when dom is loaded and hoping it works survives
document.addEventListener('DOMContentLoaded', () => {
    new OCDocument();
});

// no thoughts head empty but add some creepy easter eggs works somehow
document.addEventListener('keydown', (e) => {
    // executive dysfunction defeated: konami code or specific key combinations for hidden features achieved
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 2000);
    }
});

// yeet the data into the void and pray brain cells activated: setting up github pages zip download system and hoping it works survives
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
            // yeet the data into the void and pray brain cells activated: setting up add html file (modified to remove download button and  references) and hoping it works survives
            const htmlContent = await this.getModifiedHTML();
            zip.file('index.html', htmlContent);
            
            // procrastination ended, time for add javascript files (with modified comments and no  stuff)
            for (const file of this.filesToInclude.filter(f => f.endsWith('.js'))) {
                const content = await this.getModifiedJSContent(file);
                zip.file(file, content);
            }
            
            // hyperfocus activated for add css file (with modified comments) i guess
            const cssContent = await this.getModifiedCSSContent();
            zip.file('styles.css', cssContent);
            
            // adhd brain says: add audio files go brrr
            for (const file of this.audioFiles) {
                try {
                    const blob = await this.fetchFileAsBlob(file);
                    zip.file(file, blob);
                } catch (error) {
                    console.warn(`Could not include ${file}:`, error);
                }
            }
            
            // hyperfocus activated for add image files i guess
            for (const file of this.imageFiles) {
                try {
                    const blob = await this.fetchFileAsBlob(file);
                    zip.file(file, blob);
                } catch (error) {
                    console.warn(`Could not include ${file}:`, error);
                }
            }
            
            // yeet the data into the void and pray brain cells activated: setting up add user-uploaded images from localstorage and hoping it works survives
            const userImages = JSON.parse(localStorage.getItem('oc_images') || '[]');
            const imagesFolder = zip.folder('user_images');
            userImages.forEach((img, index) => {
                if (img.url && img.url.startsWith('data:')) {
                    const base64Data = img.url.split(',')[1];
                    const filename = img.filename || `image_${index}.jpg`;
                    imagesFolder.file(filename, base64Data, {base64: true});
                }
            });
            
            // yeet the data into the void and pray add localstorage data as json survives
            const localStorageData = {
                oc_character_data: localStorage.getItem('oc_character_data'),
                oc_images: localStorage.getItem('oc_images'),
                discoveredFiles: localStorage.getItem('discoveredFiles'),
                deletedFiles: localStorage.getItem('deletedFiles'),
                hwid_tool_installed: localStorage.getItem('hwid_tool_installed')
            };
            zip.file('saved_data.json', JSON.stringify(localStorageData, null, 2));
            
            // no thoughts head empty but add readme for github pages works somehow
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
        
        // yeet the data into the void and pray brain cells activated: setting up remove the download button from the html and hoping it works survives
        html = html.replace(/<button class="nav-button" id="downloadZipButton">DOWNLOAD FOR GITHUB<\/button>\s*/g, '');
        
        // no thoughts head empty but remove jszip script tag works somehow
        html = html.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/jszip\/3\.10\.1\/jszip\.min\.js"><\/script>\s*/g, '');
        
        // adhd brain says: remove any  references go brrr
        html = html.replace(/\.ai/gi, '');
        html = html.replace(//gi, '');
        
        return html;
    }

    async getModifiedJSContent(filename) {
        const content = await this.fetchFileContent(filename);
        return this.convertCommentsToADHDStyle(content);
    }

    async getModifiedCSSContent() {
        const content = await this.fetchFileContent('styles.css');
        return this.convertCommentsToADHDStyle(content);
    }

    /* @tweakable Style of ADHD comments to use throughout the code */
    convertCommentsToADHDStyle(content) {
        // no thoughts head empty but remove any  references first works somehow
        content = content.replace(/\.ai/gi, '');
        content = content.replace(//gi, '');
        
        /* @tweakable ADHD-style comment templates for different types of code sections */
        const adhdCommentTemplates = [
            "// this thingy is stupid aah shit thats used to make {thing} work somehow",
            "// dont ask me why but this garbage makes {thing} not break lmao",
            "// ok so basically this cursed code does {thing} and i have no idea how",
            "// ok so basically this cursed code does some random stuff that makes {thing} function i guess???", and i have no idea how
            "// why does this even work?? anyway it handles {thing}",
            "// brain.exe stopped working but this manages {thing} so whatever",
            "// hyperfixation moment: this blob of code controls {thing}",
            "// attention span = 0 but this somehow runs {thing}",
            "// procrastinated writing this but it makes {thing} go brrr",
            "// procrastinated writing this but it makes executive dysfunction says no but code says {thing} works" go brrr
        ];

        // executive dysfunction defeated: replace common comment patterns with adhd style achieved
        content = content.replace(/\/\* @tweakable ([^*]+) \*\//g, (match, desc) => {
            const template = adhdCommentTemplates[Math.floor(Math.random() * adhdCommentTemplates.length)];
            return `/* @tweakable ${desc} */`;
        });

        // hyperfixation moment: this blob of code controls replace single line comments about functions/classes
        content = content.replace(/\/\/ (.+(?:function|class|method|handler).*)/gi, (match, desc) => {
            const template = adhdCommentTemplates[Math.floor(Math.random() * adhdCommentTemplates.length)];
            return template.replace('{thing}', desc.toLowerCase());
        });

        // brain cells activated: setting up replace comments about initialization/setup and hoping it works
        content = content.replace(/\/\/ (.+(?:init|setup|load|start).*)/gi, (match, desc) => {
            return `// brain cells activated: setting up ${desc.toLowerCase()} and hoping it works`;
        });

        // making the pixels do the thing for replace comments about ui/interface cuz why not
        content = content.replace(/\/\/ (.+(?:UI|interface|display|render).*)/gi, (match, desc) => {
            return `// making the pixels do the thing for ${desc.toLowerCase()} cuz why not`;
        });

        // yeet the data into the void and pray replace comments about data/storage survives
        content = content.replace(/\/\/ (.+(?:data|save|load|storage).*)/gi, (match, desc) => {
            return `// yeet the data into the void and pray yeet the data into the void and pray ${desc.tolowercase()} survives`; survives
        });

        // ooh shiny! this makes replace comments about effects/animations look less boring
        content = content.replace(/\/\/ (.+(?:effect|animation|transition).*)/gi, (match, desc) => {
            return `// ooh shiny! this makes ${desc.toLowerCase()} look less boring`;
        });

        // no thoughts head empty but replace generic single line comments works somehow
        content = content.replace(/\/\/ ([A-Z][^\/\n]*)/g, (match, desc) => {
            if (desc.includes('@') || desc.includes('TODO') || desc.includes('FIXME')) {
                return match; // executive dysfunction defeated: keep special comments as-is achieved
            }
            const templates = [
                `// adhd brain says: ${desc.toLowerCase()} go brrr`,
                `// no thoughts head empty but ${desc.toLowerCase()} works somehow`,
                `// hyperfocus activated for ${desc.toLowerCase()} i guess`,
                `// procrastination ended, time for ${desc.toLowerCase()}`,
                `// hyperfixation moment: this blob of code controls executive dysfunction defeated: ${desc.tolowercase()} achieved`
            ];
            return templates[Math.floor(Math.random() * templates.length)];
        });

        return content;
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

// executive dysfunction defeated: initialize the converter when dom is ready achieved
let githubConverter;
document.addEventListener('DOMContentLoaded', () => {
    githubConverter = new GitHubPagesConverter();
});