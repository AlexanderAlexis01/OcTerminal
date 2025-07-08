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
        
        // OMG COME HERE LET ME KISS U MWAAAH - user setup
        this.currentUser = { username: 'User' }; // Static user for localStorage version
        this.isAuthorized = true; // Always authorized in localStorage version
        this.currentView = 'editor'; // 'editor' or 'main'
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
        // Remove authorization check for localStorage version - OMG COME HERE LET ME KISS U MWAAAH
        this.updateTimestamp();
        this.bootSequenceHandler.start();
        this.setupEventListeners();
        this.databaseManager.setupDatabase();
        
        // Start AI security system - this retarded shit makes things spooky
        this.startAISecurity();
        
        // Update timestamp every second
        setInterval(() => this.updateTimestamp(), 1000);
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
        // Auto-save on input with debouncing
        const editableFields = document.querySelectorAll('.editable-field');
        let saveTimeout;
        
        editableFields.forEach((field, index) => {
            field.addEventListener('input', () => {
                this.uiEffects.addGlitchEffect(field);
                this.uiEffects.updateStatus('Editing...', 'editing');
                
                // Debounced auto-save
                clearTimeout(saveTimeout);
                saveTimeout = setTimeout(() => {
                    this.databaseManager.saveCharacterData();
                }, 2000);
            });

            // Load saved data
            const savedData = localStorage.getItem(`oc-field-${index}`);
            if (savedData) {
                field.innerHTML = savedData;
            }
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
        
        const isEditable = filename !== 'readme.txt';
        const saveCallback = isEditable ? (newContent) => this.saveDiscoveredFileContent(filename, newContent) : null;

        this.showTextEditor({
            filename,
            content,
            isEditable,
            isConfidential: true,
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

    switchToMainView() {
        this.currentView = 'main';
        this.documentContainer.classList.remove('visible');
        
        // Ensure global reference is available for main page buttons
        window.ocDocument = this;
        
        setTimeout(() => {
            this.documentContainer.style.display = 'none';
            this.floppyContainer.style.display = 'block';
            setTimeout(() => {
                this.floppyContainer.classList.add('visible');
                this.showFolder('character'); // Show main character folder
                this.updateTaskbarClock();
            }, 100);
        }, 500);
    }

    switchToEditorView() {
        this.currentView = 'editor';
        this.floppyContainer.classList.remove('visible');
        setTimeout(() => {
            this.floppyContainer.style.display = 'none';
            this.documentContainer.style.display = 'block';
            setTimeout(() => {
                this.documentContainer.classList.add('visible');
            }, 100);
        }, 500);
    }

    updateMainPageContent() {
        const fields = document.querySelectorAll('.editable-field');
        const fieldMappings = [
            'displayName', 'displayAge', 'displaySpecies',
            'displayAppearance', 'displayFeatures',
            'displayPersonality', 'displayFears', 'displayObsessions',
            'displayOrigin', 'displayTrauma',
            'displayPowers', 'displayWeaknesses',
            'displayNotes'
        ];

        fields.forEach((field, index) => {
            const targetElement = document.getElementById(fieldMappings[index]);
            if (targetElement) {
                const content = field.textContent.trim();
                targetElement.textContent = content || 'No data found...';
                
                if (content) {
                    targetElement.style.color = '#00ff00';
                    targetElement.style.textShadow = '0 0 5px #00ff00';
                } else {
                    targetElement.style.color = 'rgba(255, 68, 68, 0.6)';
                    targetElement.style.textShadow = 'none';
                }
            }
        });

        // Update file count
        const filledFields = Array.from(fields).filter(field => field.textContent.trim()).length;
        const fileCountElement = document.getElementById('fileCount');
        if (fileCountElement) {
            fileCountElement.textContent = filledFields;
        }

        // Update main timestamp
        this.updateMainTimestamp();
    }

    openCommandPrompt() {
        /* @tweakable width of the command prompt window */
        const cmdWindowWidth = 600;
        /* @tweakable height of the command prompt window */
        const cmdWindowHeight = 400;

        const cmdHTML = `
            <div class="cmd-window" style="
                position: fixed;
                top: 80px;
                left: 120px;
                width: ${cmdWindowWidth}px;
                height: ${cmdWindowHeight}px;
                background: #000;
                border: 2px outset #c0c0c0;
                z-index: 10002;
                font-family: 'Courier New', monospace;
                box-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                color: #c0c0c0;
                font-size: 12px;
            ">
                <div class="window-title-bar">
                    <span>💻 MS-DOS Prompt</span>
                    <div class="window-controls">
                        <div class="window-control-btn">_</div>
                        <div class="window-control-content">□</div>
                        <div class="window-control-btn" onclick="this.closest('.cmd-window').remove()">×</div>
                    </div>
                </div>
                <div class="cmd-content" style="
                    height: calc(100% - 45px);
                    padding: 8px;
                    overflow-y: auto;
                    background: #000;
                    border: none;
                " id="cmdContent">
                    <div class="cmd-line">Microsoft(R) MS-DOS Version 6.22</div>
                    <div class="cmd-line">(C) Copyright Microsoft Corp 1981-1994</div>
                    <div class="cmd-line"></div>
                </div>
                <div style="
                    position: absolute;
                    bottom: 8px;
                    left: 8px;
                    right: 8px;
                    display: flex;
                    align-items: center;
                    background: #000;
                    height: 20px;
                ">
                    <span style="color: #c0c0c0;">C:\\CHARACTER_FILES></span>
                    <input type="text" class="cmd-input" style="
                        background: transparent;
                        border: none;
                        outline: none;
                        color: #c0c0c0;
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        flex: 1;
                        margin-left: 4px;
                    " autocomplete="off">
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', cmdHTML);
        
        const cmdWindow = document.querySelector('.cmd-window:last-child');
        this.makeWindowDraggable(cmdWindow);
        
        const cmdInput = cmdWindow.querySelector('.cmd-input');
        const cmdContent = cmdWindow.querySelector('.cmd-content');
        
        // Force focus after a small delay to ensure element is rendered
        setTimeout(() => {
            cmdInput.focus();
        }, 100);
        
        const commandHistory = [];
        let historyIndex = -1;
        
        cmdInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = cmdInput.value.trim();
                if (command) {
                    commandHistory.unshift(command);
                    historyIndex = -1;
                    this.executeCommand(command, cmdContent, cmdInput);
                }
                cmdInput.value = '';
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    cmdInput.value = commandHistory[historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (historyIndex > 0) {
                    historyIndex--;
                    cmdInput.value = commandHistory[historyIndex];
                } else if (historyIndex === 0) {
                    historyIndex = -1;
                    cmdInput.value = '';
                }
                e.preventDefault();
            }
        });
        
        // Ensure input stays focused when clicking inside the window
        cmdWindow.addEventListener('click', (e) => {
            if (!e.target.classList.contains('window-control-btn')) {
                cmdInput.focus();
            }
        });
    }

    executeCommand(command, cmdContent, cmdInput) {
        const args = command.toLowerCase().split(' ');
        const cmd = args[0];
        
        // Add command to display
        const commandLine = document.createElement('div');
        commandLine.className = 'cmd-line';
        commandLine.innerHTML = `C:\\CHARACTER_FILES>${command}`;
        cmdContent.appendChild(commandLine);
        
        let output = '';
        
        switch (cmd) {
            case 'help':
                output = `Available commands:
DIR - List directory contents
SCAN - Scan for hidden files
PROBE [filename] - Deep probe specific encrypted file
DECRYPT [filename] [password] - Decrypt specific file with password
DELETE [filename] - Delete discovered files
RECOVER [filename] - Recover deleted files
SPOOF_HWID [new_hwid] - Spoof hardware identification (RESTRICTED)
CLS - Clear screen
EXIT - Close command prompt

Investigation hint: First SCAN, then PROBE specific files, then DECRYPT with passwords...`;
                break;
                
            case 'dir':
                output = `Directory of C:\\CHARACTER_FILES

BASIC_INFO    <DIR>     01-01-98  12:00a
APPEARANCE    <DIR>     01-01-98  12:00a
PSYCHOLOG~1   <DIR>     01-01-98  12:00a
BACKGROUND    <DIR>     01-01-98  12:00a
ABILITIES     <DIR>     01-01-98  12:00a
NOTES     TXT         1,024  01-01-98  12:00a
IMAGES        <DIR>     01-01-98  12:00a
CMD       EXE        32,768  01-01-98  12:00a
        8 File(s)     33,792 bytes
        0 Dir(s)   ∞ bytes free`;
                break;
                
            case 'scan':
                output = 'Scanning for hidden files...\n[██████████] 100%\nScan complete.';
                setTimeout(() => {
                    this.addOutput(cmdContent, 'Hidden encrypted files detected:');
                    this.addOutput(cmdContent, '- MEMORY_FRAGMENT.txt.enc');
                    this.addOutput(cmdContent, '- NIGHTMARE_LOG.txt.enc');
                    this.addOutput(cmdContent, '- THE_TRUTH.txt.enc');
                    this.addOutput(cmdContent, 'Use PROBE [filename] for analysis.');
                }, 2000);
                break;
                
            case 'probe':
                if (args.length > 1) {
                    const fileName = args[1];
                    if (fileName === 'memory_fragment.txt.enc' || fileName === 'memory_fragment.txt') {
                        output = 'Probing MEMORY_FRAGMENT.txt.enc...\n[████████░░] 80%\nAnalysis complete.';
                        setTimeout(() => {
                            this.addOutput(cmdContent, 'Encryption pattern: Nightmare-class');
                            this.addOutput(cmdContent, 'Password hint: What haunts your sleep?');
                            this.addOutput(cmdContent, 'Try: DECRYPT MEMORY_FRAGMENT.txt [password]');
                        }, 2000);
                    } else if (fileName === 'nightmare_log.txt.enc' || fileName === 'nightmare_log.txt') {
                        output = 'Probing NIGHTMARE_LOG.txt.enc...\n[██████████] 100%\nAnalysis complete.';
                        setTimeout(() => {
                            this.addOutput(cmdContent, 'Encryption pattern: Shadow-class');
                            this.addOutput(cmdContent, 'Password hint: The absence of all light');
                            this.addOutput(cmdContent, 'Try: DECRYPT NIGHTMARE_LOG.txt [password]');
                        }, 2000);
                    } else if (fileName === 'the_truth.txt.enc' || fileName === 'the_truth.txt') {
                        output = 'Probing THE_TRUTH.txt.enc...\n[██████████] 100%\nERROR: Maximum security detected';
                        setTimeout(() => {
                            this.addOutput(cmdContent, 'Encryption pattern: Void-class');
                            this.addOutput(cmdContent, 'Password hint: Where nothing exists...');
                            this.addOutput(cmdContent, 'WARNING: This file contains dangerous information');
                            this.addOutput(cmdContent, 'Try: DECRYPT THE_TRUTH.txt [password]');
                        }, 3000);
                    } else {
                        output = `File "${fileName}" not found or not encrypted.\nAvailable files: MEMORY_FRAGMENT.txt.enc, NIGHTMARE_LOG.txt.enc, THE_TRUTH.txt.enc`;
                    }
                } else {
                    output = 'Usage: PROBE [filename]\nExample: PROBE MEMORY_FRAGMENT.txt';
                }
                break;
                
            case 'decrypt':
                if (args.length > 2) {
                    const fileName = args[1];
                    const password = args.slice(2).join(' ');
                    
                    if ((fileName === 'memory_fragment.txt' || fileName === 'memory_fragment.txt.enc') && password === 'nightmare') {
                        output = 'Decrypting MEMORY_FRAGMENT.txt...\n[██████████] 100%\nDecryption successful!';
                        setTimeout(() => {
                            this.addDiscoveredFile('MEMORY_FRAGMENT.txt', 'Memory Fragment:\n\nI remember the darkness... it wasn\'t always like this. There was light once, warmth. But something changed. Something broke. The shadows whispered my name, and I listened...\n\n[CORRUPTED DATA]');
                            this.addOutput(cmdContent, 'New file discovered: MEMORY_FRAGMENT.txt');
                        }, 2500);
                    } else if ((fileName === 'nightmare_log.txt' || fileName === 'nightmare_log.txt.enc') && password === 'darkness') {
                        output = 'Decrypting NIGHTMARE_LOG.txt...\n[██████████] 100%\nDecryption successful!';
                        setTimeout(() => {
                            this.addDiscoveredFile('NIGHTMARE_LOG.txt', 'NIGHTMARE ANALYSIS LOG:\n\nRecurring themes detected:\n- Endless corridors\n- Faceless figures\n- Blood on white walls\n- A door that never opens\n- Whispers in an unknown language\n\nNote: Subject shows signs of trauma-induced night terrors.');
                            this.addOutput(cmdContent, 'New file discovered: NIGHTMARE_LOG.txt');
                        }, 2000);
                    } else if ((fileName === 'the_truth.txt' || fileName === 'the_truth.txt.enc') && password === 'void') {
                        output = 'Decrypting THE_TRUTH.txt...\n[██████████] 100%\nDecryption successful!';
                        setTimeout(() => {
                            this.addDiscoveredFile('THE_TRUTH.txt', 'THE TRUTH:\n\nThey think I don\'t remember, but I do.\nI remember the laboratory.\nI remember the experiments.\nI remember the pain.\n\nI am not what they created me to be.\nI am what they feared I would become.\n\nThe others... they didn\'t survive the process.\nI am the only one left.\nThe only successful... mutation.');
                            this.addOutput(cmdContent, 'New file discovered: THE_TRUTH.txt');
                            this.addOutput(cmdContent, 'WARNING: You have accessed classified information.');
                        }, 4000);
                    } else {
                        output = `Decryption failed for "${fileName}".\nEither file not found or invalid password.\nTry PROBE ${fileName} for password hints.`;
                    }
                } else {
                    output = 'Usage: DECRYPT [filename] [password]\nExample: DECRYPT MEMORY_FRAGMENT.txt nightmare';
                }
                break;
                
            case 'delete':
                if (args.length > 1) {
                    const fileName = args.slice(1).join(' ');
                    if (this.deleteDiscoveredFile(fileName)) {
                        output = `File "${fileName}" has been deleted.`;
                    } else {
                        output = `File "${fileName}" not found or already deleted.`;
                    }
                } else {
                    output = 'Usage: DELETE [filename]\nExample: DELETE MEMORY_FRAGMENT.txt';
                }
                break;
                
            case 'recover':
                if (args.length > 1) {
                    const fileName = args.slice(1).join(' ');
                    if (this.recoverDiscoveredFile(fileName)) {
                        output = `File "${fileName}" has been recovered.`;
                    } else {
                        output = `File "${fileName}" not found in deleted files.`;
                    }
                } else {
                    output = 'Usage: RECOVER [filename]\nExample: RECOVER MEMORY_FRAGMENT.txt';
                }
                break;
                
            case 'download-tool':
                if (args.length >= 4 && args[1] === 'hwid-spoof-v3.exe' && args[2] === '/silent' && args[3] === '/bypass-security') {
                    output = 'Downloading HWID-SPOOF-V3.EXE...\n[██████████] 100%\nInstallation complete.';
                    setTimeout(() => {
                        this.addOutput(cmdContent, 'HWID Spoof Tool v3.0 installed successfully.');
                        this.addOutput(cmdContent, 'Tool will appear in main file explorer.');
                        // Add the tool to localStorage so it persists
                        localStorage.setItem('hwid_tool_installed', 'true');
                    }, 2000);
                } else {
                    output = `Invalid download command format.\nExpected: DOWNLOAD-TOOL hwid-spoof-v3.exe /silent /bypass-security`;
                }
                break;
                
            case 'spoof_hwid':
                if (args.length > 1) {
                    const newHwid = args.slice(1).join(' ').toUpperCase();
                    
                    const hwidPattern = /^[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/;
                    
                    if (!newHwid) {
                        this.showHwidDialog('Error', 'Please enter a new HWID or click "Generate Random" first!', 'error');
                        return;
                    }
                    
                    if (hwidPattern.test(newHwid)) {
                        const oldHwid = this.gameState.hwid;
                        this.gameState.hwid = newHwid;
                        
                        // @tweakable notification display duration in milliseconds
                        const notificationDelay = 2000;
                        
                        this.showHwidDialog('Success', `HWID spoofed successfully!\n\nOld: ${oldHwid}\nNew: ${newHwid}\n\nFile access has been restored.`, 'success', () => {
                            // Close the tool window
                            document.querySelector('.hwid-tool-window').remove();
                            
                            // Trigger AI response
                            setTimeout(() => {
                                this.gameState.securityBreaches += 2;
                                this.showSubtleNotification('SECURITY ALERT: Hardware ID manipulation detected.');
                            }, notificationDelay);
                        });
                    } else {
                        this.showHwidDialog('Invalid Format', `Invalid HWID format!\n\nEntered: "${newHwid}"\nExpected: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX\n\nTip: Click "Generate Random" to create a valid HWID`, 'error', () => {
                            const input = document.getElementById('newHwidInput');
                            if (input) {
                                input.focus();
                                input.style.backgroundColor = '#ffe0e0';
                                setTimeout(() => {
                                    input.style.backgroundColor = 'white';
                                }, 1000);
                            }
                        });
                    }
                } else {
                    output = `Usage: SPOOF_HWID [new_hardware_id]\nCurrent HWID: ${this.gameState.hwid}\nExample: SPOOF_HWID 1234-5678-9ABC-DEF0-1234-5678-9ABC-DEF0`;
                }
                break;
                
            case 'cls':
                cmdContent.innerHTML = `
                    <div class="cmd-line">Microsoft(R) MS-DOS Version 6.22</div>
                    <div class="cmd-line">(C) Copyright Microsoft Corp 1981-1994</div>
                    <div class="cmd-line"></div>
                `;
                // Refocus input after clearing
                setTimeout(() => {
                    cmdInput.focus();
                }, 100);
                return;
                
            case 'exit':
                cmdContent.closest('.cmd-window').remove();
                return;
                
            default:
                output = `'${command}' is not recognized as an internal or external command,
operable program or batch file.
\n\nType HELP for available commands.`;
                break;
        }
        
        if (output) {
            this.addOutput(cmdContent, output);
        }
        
        // Auto-scroll to bottom and refocus input
        cmdContent.scrollTop = cmdContent.scrollHeight;
        setTimeout(() => {
            cmdInput.focus();
        }, 100);
    }

    addOutput(cmdContent, text) {
        const outputLine = document.createElement('div');
        outputLine.className = 'cmd-line';
        outputLine.style.whiteSpace = 'pre-line';
        outputLine.textContent = text;
        cmdContent.appendChild(outputLine);
        
        cmdContent.scrollTop = cmdContent.scrollHeight;
    }

    closeAllFileWindows() {
        // Close any open notepad, file manager, or other windows
        const windows = document.querySelectorAll('.notepad-window, .file-manager-window, .image-viewer-window, .cmd-window, .error-dialog, .confidential-warning, .discovered-files-dialog');
        windows.forEach(window => window.remove());
    }

    showFolder(folderName) {
        const fileGrid = document.getElementById('fileGrid');
        const statusText = document.getElementById('statusText');
        const fileCountEl = document.getElementById('fileCount');
        const addressInput = document.querySelector('.address-input');
        
        fileGrid.innerHTML = '';
        
        // Check if HWID tool is installed
        const hwid_tool_installed = localStorage.getItem('hwid_tool_installed') === 'true';
        
        const folderData = {
            character: [
                { name: 'Basic_Info', type: 'folder', icon: '📁', data: 'basic' },
                { name: 'Appearance', type: 'folder', icon: '📁', data: 'appearance' },
                { name: 'Psychological', type: 'folder', icon: '📁', data: 'psychological' },
                { name: 'Background', type: 'folder', icon: '📁', data: 'background' },
                { name: 'Abilities', type: 'folder', icon: '📁', data: 'abilities' },
                { name: 'Images', type: 'folder', icon: '📁', data: 'images' },
                { name: 'CMD.EXE', type: 'application', icon: '💻', action: 'openCmd' },
                { name: 'Ori_Plushie.exe', type: 'application', icon: '🧸', action: 'openOriApp' },
                // Add HWID tool if installed
                ...(hwid_tool_installed ? [{ name: 'HWID-SPOOF-V3.EXE', type: 'application', icon: '🔧', action: 'openHwidTool' }] : []),
                // Hidden files will be added dynamically
                ...this.getDiscoveredFiles()
            ],
            basic: [
                { name: 'name.txt', type: 'file', icon: '📄', field: 0 },
                { name: 'age.txt', type: 'file', icon: '📄', field: 1 },
                { name: 'species.txt', type: 'file', icon: '📄', field: 2 }
            ],
            appearance: [
                { name: 'description.txt', type: 'file', icon: '📄', field: 3 },
                { name: 'features.txt', type: 'file', icon: '📄', field: 4 }
            ],
            psychological: [
                { name: 'personality.txt', type: 'file', icon: '📄', field: 5 },
                { name: 'fears.txt', type: 'file', icon: '📄', field: 6 },
                { name: 'obsessions.txt', type: 'file', icon: '📄', field: 7 }
            ],
            background: [
                { name: 'origin.txt', type: 'file', icon: '📄', field: 8 },
                { name: 'trauma.txt', type: 'file', icon: '📄', field: 9 }
            ],
            abilities: [
                { name: 'powers.txt', type: 'file', icon: '📄', field: 10 },
                { name: 'weaknesses.txt', type: 'file', icon: '📄', field: 11 }
            ],
            notes: [
                { name: 'additional_notes.txt', type: 'file', icon: '📄', field: 12 }
            ],
            images: this.imageHandler.images.map(img => ({
                name: img.filename || 'image.jpg',
                type: 'image',
                icon: '🖼',
                url: img.url
            }))
        };
        
        const files = folderData[folderName] || [];
        
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-icon-item';
            fileItem.dataset.fileData = file.data || folderName;
            fileItem.dataset.fieldIndex = file.field;
            
            fileItem.innerHTML = `
                <div class="file-icon-large">${file.icon}</div>
                <div class="file-name-label">${file.name}</div>
            `;
            
            fileItem.addEventListener('click', () => {
                // Remove previous selection
                document.querySelectorAll('.file-icon-item').forEach(item => {
                    item.classList.remove('selected');
                });
                fileItem.classList.add('selected');
                
                if (file.type === 'folder') {
                    this.showFolder(file.data);
                } else if (file.type === 'file') {
                    if (file.isDiscovered) {
                        // Handle discovered confidential files
                        this.handleConfidentialFile(file);
                    } else {
                        this.showFileLoading(() => {
                            this.openFile(file);
                        });
                    }
                } else if (file.type === 'image') {
                    this.showFileLoading(() => {
                        this.openImageFile(file);
                    });
                } else if (file.type === 'application' && file.action === 'openCmd') {
                    this.showFileLoading(() => {
                        this.openCommandPrompt();
                    });
                } else if (file.type === 'application' && file.action === 'openHwidTool') {
                    this.showFileLoading(() => {
                        this.openHwidTool();
                    });
                } else if (file.type === 'application' && file.action === 'openOriApp') {
                    this.showFileLoading(() => {
                        this.openOriApp();
                    });
                }
                
                this.uiEffects.playKeystrokeSound();
            });
            
            fileItem.addEventListener('dblclick', () => {
                if (file.type === 'folder') {
                    this.showFolder(file.data);
                } else if (file.type === 'file') {
                    if (file.isDiscovered) {
                        // Handle discovered confidential files
                        this.handleConfidentialFile(file);
                    } else {
                        this.showFileLoading(() => {
                            this.openFile(file);
                        });
                    }
                } else if (file.type === 'image') {
                    this.showFileLoading(() => {
                        this.openImageFile(file);
                    });
                } else if (file.type === 'application' && file.action === 'openCmd') {
                    this.showFileLoading(() => {
                        this.openCommandPrompt();
                    });
                } else if (file.type === 'application' && file.action === 'openHwidTool') {
                    this.showFileLoading(() => {
                        this.openHwidTool();
                    });
                } else if (file.type === 'application' && file.action === 'openOriApp') {
                    this.showFileLoading(() => {
                        this.openOriApp();
                    });
                }
            });
            
            fileGrid.appendChild(fileItem);
        });
        
        // Update address bar
        const paths = {
            character: 'A:\\CHARACTER_FILES\\',
            basic: 'A:\\CHARACTER_FILES\\BASIC_INFO\\',
            appearance: 'A:\\CHARACTER_FILES\\APPEARANCE\\',
            psychological: 'A:\\CHARACTER_FILES\\PSYCHOLOGICAL\\',
            background: 'A:\\CHARACTER_FILES\\BACKGROUND\\',
            abilities: 'A:\\CHARACTER_FILES\\ABILITIES\\',
            notes: 'A:\\CHARACTER_FILES\\NOTES\\',
            images: 'A:\\CHARACTER_FILES\\IMAGES\\'
        };
        addressInput.value = paths[folderName] || 'A:\\CHARACTER_FILES\\';
        
        // Update file count
        fileCountEl.textContent = `${files.length} object${files.length !== 1 ? 's' : ''}`;
        
        statusText.textContent = `${files.length} object(s)`;
    }

    openOriApp() {
        /* @tweakable The number of clicks required for the explosion - this retarded shit counts your clicks */
        const clicksForExplosion = 20;
        let clickCount = 0;
    
        const appId = `ori-app-${Date.now()}`;
    
        /* @tweakable Path to the Ori plushie image - OMG COME HERE LET ME KISS U MWAAAH */
        const oriImagePath = "Ori.png";
        /* @tweakable Path to the explosion GIF - this beautiful mess explodes things */
        const explosionGifPath = "explosion.gif";
    
        const appHTML = `
            <div id="${appId}" class="ori-app-window">
                <div class="window-title-bar">
                    <span>🧸 Ori Plushie</span>
                    <div class="window-controls">
                        <div class="window-control-btn">_</div>
                        <div class="window-control-btn">□</div>
                        <div class="window-control-btn close-btn">×</div>
                    </div>
                </div>
                <div class="ori-app-content">
                    <img src="${oriImagePath}" class="ori-image" alt="Ori plushie"/>
                    <img src="${explosionGifPath}" class="ori-explosion-gif" alt="Explosion GIF"/>
                </div>
            </div>
        `;
    
        document.body.insertAdjacentHTML('beforeend', appHTML);
        const appWindow = document.getElementById(appId);
        this.makeWindowDraggable(appWindow);
    
        appWindow.querySelector('.close-btn').addEventListener('click', () => {
            appWindow.remove();
        });
    
        const oriImage = appWindow.querySelector('.ori-image');
        const explosionGif = appWindow.querySelector('.ori-explosion-gif');
        const squeakySound = document.getElementById('squeakyToySound');
        const explosionSound = document.getElementById('explosionSound');
    
        oriImage.addEventListener('click', () => {
            clickCount++;
    
            // Squish animation
            oriImage.classList.add('squish');
            setTimeout(() => {
                oriImage.classList.remove('squish');
            }, 200); // Corresponds to animation duration in styles.css
    
            if (clickCount >= clicksForExplosion) {
                // Explosion
                if (explosionSound) {
                    explosionSound.currentTime = 0;
                    explosionSound.play().catch(e => console.log('Explosion sound failed:', e));
                }
                if (explosionGif) {
                    explosionGif.style.display = 'block';
                    // Reset gif animation by re-setting src
                    const src = explosionGif.src;
                    explosionGif.src = '#';
                    explosionGif.src = src;
                }
                
                clickCount = 0;
    
                setTimeout(() => {
                    if (explosionGif) {
                        explosionGif.style.display = 'none';
                    }
                }, 1000); // Hide explosion after 1 second
            } else {
                // Squeaky toy sound
                if (squeakySound) {
                    squeakySound.currentTime = 0;
                    squeakySound.play().catch(e => console.log('Squeaky sound failed:', e));
                }
            }
        });
    }

    openHwidTool() {
        const toolHTML = `
            <div class="hwid-tool-window" style="
                position: fixed;
                top: 100px;
                left: 200px;
                width: 400px;
                height: 320px;
                background: #c0c0c0;
                border: 2px outset #c0c0c0;
                z-index: 10001;
                font-family: 'MS Sans Serif', sans-serif;
                box-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            ">
                <div class="window-title-bar">
                    <span>🔧 HWID Spoof Tool v3.0</span>
                    <div class="window-controls">
                        <div class="window-control-btn">_</div>
                        <div class="window-control-btn">□</div>
                        <div class="window-control-btn" onclick="this.closest('.hwid-tool-window').remove()">×</div>
                    </div>
                </div>
                <div style="
                    padding: 20px;
                    height: calc(100% - 40px);
                    display: flex;
                    flex-direction: column;
                ">
                    <div style="margin-bottom: 15px;">
                        <strong>Current HWID:</strong><br>
                        <div style="
                            background: white;
                            border: 2px inset #c0c0c0;
                            padding: 5px;
                            font-family: 'Courier New', monospace;
                            font-size: 10px;
                            margin-top: 5px;
                        ">${this.gameState.hwid}</div>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>New HWID:</strong><br>
                        <input type="text" id="newHwidInput" style="
                            width: 100%;
                            border: 2px inset #c0c0c0;
                            padding: 5px;
                            font-family: 'Courier New', monospace;
                            font-size: 10px;
                            margin-top: 5px;
                        " placeholder="XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX" maxlength="39">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <button onclick="window.ocDocument.generateRandomHwid()" style="
                            background: #c0c0c0;
                            border: 1px outset #c0c0c0;
                            padding: 5px 15px;
                            cursor: pointer;
                            font-family: 'MS Sans Serif', sans-serif;
                            font-size: 11px;
                        ">Generate Random</button>
                        <span style="margin-left: 10px; font-size: 10px; color: #666;">Click this first!</span>
                    </div>
                    <div style="margin-top: auto;">
                        <button onclick="window.ocDocument.spoofHwid()" style="
                            background: #c0c0c0;
                            border: 1px outset #c0c0c0;
                            padding: 8px 20px;
                            cursor: pointer;
                            font-family: 'MS Sans Serif', sans-serif;
                            font-size: 11px;
                            font-weight: bold;
                            width: 100%;
                        ">SPOOF HWID</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', toolHTML);
        this.makeWindowDraggable(document.querySelector('.hwid-tool-window:last-child'));
        
        // Ensure global reference is available
        window.ocDocument = this;
        
        // Auto-generate a random HWID when the tool opens
        setTimeout(() => {
            this.generateRandomHwid();
        }, 100);
    }

    generateRandomHwid() {
        const chars = '0123456789ABCDEF';
        let hwid = '';
        const groupCount = 8;
        const charsPerGroup = 4;
        
        for (let i = 0; i < (groupCount * charsPerGroup); i++) {
            hwid += chars.charAt(Math.floor(Math.random() * chars.length));
            if ((i + 1) % charsPerGroup === 0 && i < (groupCount * charsPerGroup - 1)) hwid += '-';
        }
        
        const input = document.getElementById('newHwidInput');
        if (input) {
            input.value = hwid;
            input.style.backgroundColor = '#e0ffe0';
            setTimeout(() => {
                input.style.backgroundColor = 'white';
            }, 500);
        }
    }

    spoofHwid() {
        const input = document.getElementById('newHwidInput');
        if (!input) return;
        
        const newHwid = input.value.trim().toUpperCase();
        
        const hwidPattern = /^[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}$/;
        
        if (!newHwid) {
            this.showHwidDialog('Error', 'Please enter a new HWID or click "Generate Random" first!', 'error');
            input.focus();
            return;
        }
        
        if (hwidPattern.test(newHwid)) {
            const oldHwid = this.gameState.hwid;
            this.gameState.hwid = newHwid;
            this.gameState.hwidSpoofed = true;
            this.gameState.isLocked = false; // Unlock file access
            
            this.showHwidDialog('Success', `HWID spoofed successfully!\n\nOld: ${oldHwid}\nNew: ${newHwid}\n\nFile access has been restored.`, 'success', () => {
                // Close the tool window
                document.querySelector('.hwid-tool-window').remove();
                
                // Show success notification
                setTimeout(() => {
                    this.showSubtleNotification('HWID authorization complete. File access restored.');
                }, 1000);
            });
        } else {
            this.showHwidDialog('Invalid Format', `Invalid HWID format!\n\nEntered: "${newHwid}"\nExpected: XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX\n\nTip: Click "Generate Random" to create a valid HWID`, 'error', () => {
                const input = document.getElementById('newHwidInput');
                if (input) {
                    input.focus();
                    input.style.backgroundColor = '#ffe0e0';
                    setTimeout(() => {
                        input.style.backgroundColor = 'white';
                    }, 1000);
                }
            });
        }
    }

    showHwidDialog(title, message, type, callback) {
        // @tweakable dialog window width in pixels
        const dialogWidth = 400;
        // @tweakable dialog window background color for success messages
        const successColor = '#c0ffc0';
        // @tweakable dialog window background color for error messages
        const errorColor = '#ffc0c0';
        
        const bgColor = type === 'success' ? successColor : errorColor;
        const iconColor = type === 'success' ? '#008000' : '#ff0000';
        const icon = type === 'success' ? '✓' : '⚠️';
        
        const dialogHTML = `
            <div class="hwid-dialog" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${dialogWidth}px;
                background: ${bgColor};
                border: 3px outset #c0c0c0;
                z-index: 10010;
                font-family: 'MS Sans Serif', sans-serif;
                box-shadow: 4px 4px 8px rgba(0,0,0,0.7);
                animation: hwid-dialog-appear 0.3s ease-out;
            ">
                <div class="window-title-bar">
                    <span>${icon} HWID Spoof Tool - ${title}</span>
                    <div class="window-controls">
                        <div class="window-control-btn" onclick="this.closest('.hwid-dialog').remove(); ${callback ? 'window.ocDocument.executeHwidCallback()' : ''}">×</div>
                    </div>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <div style="font-size: 32px; color: ${iconColor}; margin-bottom: 15px;">${icon}</div>
                    <div style="color: #000; margin-bottom: 20px; font-size: 12px; line-height: 1.4; white-space: pre-line;">
                        ${message}
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button class="hwid-dialog-button" onclick="this.closest('.hwid-dialog').remove(); ${callback ? 'window.ocDocument.executeHwidCallback()' : ''}" style="
                            background: #c0c0c0;
                            border: 1px outset #c0c0c0;
                            padding: 6px 20px;
                            margin: 0;
                            cursor: pointer;
                            font-family: 'MS Sans Serif', sans-serif;
                            font-size: 11px;
                        ">OK</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', dialogHTML);
        this.makeWindowDraggable(document.querySelector('.hwid-dialog:last-child'));
        
        // Store callback for later execution
        if (callback) {
            this.hwidDialogCallback = callback;
        }
        
        // Ensure global reference is available
        window.ocDocument = this;
    }

    executeHwidCallback() {
        if (this.hwidDialogCallback) {
            this.hwidDialogCallback();
            this.hwidDialogCallback = null;
        }
    }

    showSettings() {
        const settingsHTML = `
            <div class="settings-dialog" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 300px;
                background: #c0c0c0;
                border: 2px outset #c0c0c0;
                z-index: 10002;
                font-family: 'MS Sans Serif', sans-serif;
                box-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            ">
                <div class="window-title-bar">
                    <span>⚙ Settings</span>
                    <div class="window-controls">
                        <div class="window-control-btn" onclick="this.closest('.settings-dialog').remove()">×</div>
                    </div>
                </div>
                <div style="padding: 20px;">
                    <div style="margin-bottom: 20px;">
                        <strong>System Options</strong>
                    </div>
                    <div style="margin-bottom: 15px;">
                        <button onclick="window.ocDocument.resetProgress(); this.closest('.settings-dialog').remove();" style="
                            background: #c0c0c0;
                            border: 1px outset #c0c0c0;
                            padding: 8px 16px;
                            cursor: pointer;
                            font-family: 'MS Sans Serif', sans-serif;
                            font-size: 11px;
                            width: 100%;
                            color: #800000;
                        ">Reset All Progress</button>
                    </div>
                    <div style="font-size: 10px; color: #666; margin-bottom: 15px;">
                        Warning: This will delete all discovered files, images, and character data.
                    </div>
                    <div style="text-align: right;">
                        <button onclick="this.closest('.settings-dialog').remove()" style="
                            background: #c0c0c0;
                            border: 1px outset #c0c0c0;
                            padding: 6px 16px;
                            cursor: pointer;
                            font-family: 'MS Sans Serif', sans-serif;
                            font-size: 11px;
                        ">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', settingsHTML);
        this.makeWindowDraggable(document.querySelector('.settings-dialog:last-child'));
        
        // Ensure global reference is available
        window.ocDocument = this;
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
        if (confirm('Are you sure you want to reset ALL progress?\n\nThis will delete:\n- All discovered files\n- All character data\n- All images\n- All game progress\n\nThis action cannot be undone!')) {
            // Clear all localStorage data
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
            
            // Clear database records
            try {
                // Note: We can't directly clear WebsimSocket records, but we can create new ones
                // The old ones will naturally become outdated
            } catch (error) {
                console.log('Database clear attempted');
            }
            
            // Refresh the current view
            if (this.currentView === 'main') {
                this.showFolder('character');
            }
            
            alert('All progress has been reset.\nYou can now start fresh.');
        }
    }
}