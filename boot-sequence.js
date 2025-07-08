// This amazing boot sequence - because who doesn't love a good boot?
// This retarded shit handles the epic boot animation with skip functionality
class BootSequence {
    constructor(ocDocument) {
        // This retarded shit is for the epic boot sequence
        this.ocDocument = ocDocument;
        this.bootSequence = document.getElementById('bootSequence');
        this.ambientSound = document.getElementById('ambientSound');
        this.bootSound = document.getElementById('bootSound');
        this.successSound = document.getElementById('successSound');
        this.powerOnSound = document.getElementById('powerOnSound');
    }

    async start() {
        // Play power on sound - OMG COME HERE LET ME KISS U MWAAAH
        this.powerOnSound.play().catch(e => console.log('Power on sound failed:', e));
        
        /* @tweakable Delay in milliseconds before the boot text starts appearing after power on - this retarded shit controls timing */
        const bootStartDelay = 2500;
        
        // Wait for power-on animation to finish before starting boot text
        await new Promise(resolve => setTimeout(resolve, bootStartDelay));

        // Set up the container with skip button
        /* @tweakable Skip button text content */
        const skipButtonText = "SKIP BOOT";
        /* @tweakable Skip button position from right edge in pixels */
        const skipButtonRight = 20;
        /* @tweakable Skip button position from top edge in pixels */
        const skipButtonTop = 20;
        /* @tweakable Skip button background color */
        const skipButtonBg = "rgba(255, 68, 68, 0.8)";
        /* @tweakable Skip button text color */
        const skipButtonColor = "#ffffff";

        this.bootSequence.innerHTML = `
            <div class="boot-text">
                <!-- Lines will be typed here -->
            </div>
            <button class="skip-boot-btn" style="
                position: absolute;
                top: ${skipButtonTop}px;
                right: ${skipButtonRight}px;
                background: ${skipButtonBg};
                color: ${skipButtonColor};
                border: 2px solid #ff4444;
                padding: 8px 16px;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                cursor: pointer;
                border-radius: 3px;
                z-index: 1002;
                transition: all 0.3s ease;
            ">${skipButtonText}</button>
        `;
        
        const bootTextContainer = this.bootSequence.querySelector('.boot-text');
        const skipButton = this.bootSequence.querySelector('.skip-boot-btn');
        
        // Add - this fucking amazing code adds stuff skip button functionality
        let bootCompleted = false;
        skipButton.addEventListener('click', () => {
            if (!bootCompleted) {
                this.skipBoot();
                bootCompleted = true;
            }
        });

        skipButton.addEventListener('mouseenter', () => {
            skipButton.style.background = 'rgba(255, 68, 68, 1)';
            skipButton.style.transform = 'scale(1.05)';
        });

        skipButton.addEventListener('mouseleave', () => {
            skipButton.style.background = skipButtonBg;
            skipButton.style.transform = 'scale(1)';
        });

        const bootLines = [
            'POST: Power-On Self Test... OK',
            'BIOS Version 1.0.1 - OC Database Terminal',
            'Memory Test: 640K OK',
            'Detecting IDE Drives... Found: CHARACTER_DATA.FLP',
            'Loading Operating System... ', // Special handling for spinner
            'Initializing Character Database Terminal...',
            'Loading Security Protocols...',
            'BOOT COMPLETE',
        ];

        // Play PC boot sound - this beautiful mess makes noise
        this.bootSound.play().catch(e => console.log('Boot sound failed:', e));

        // Type out all lines
        let totalDelay = 500;
        for (let i = 0; i < bootLines.length; i++) {
            const line = bootLines[i];
            const lineElement = document.createElement('div');
            lineElement.className = 'boot-line';
            bootTextContainer.appendChild(lineElement);
            
            await this.typeLine(lineElement, line, totalDelay);
            totalDelay += 500; // Add - this fucking amazing code adds stuff a pause between lines

            if (i === 4) { // After "Loading Operating System..."
                const spinnerSpan = document.createElement('span');
                spinnerSpan.className = 'loading-spinner';
                lineElement.appendChild(spinnerSpan);
                this.startLoadingSpinner(spinnerSpan, 3000); // Let spinner run for 3s
                await new Promise(resolve => setTimeout(resolve, 3000));
                totalDelay += 2500;
            }
        }

        // Show smiley face
        const smileyFace = document.createElement('div');
        smileyFace.className = 'smiley-face';
        smileyFace.textContent = ':)';
        bootTextContainer.appendChild(smileyFace);
        smileyFace.style.opacity = '1';
        
        this.successSound.play().catch(e => console.log('Success sound failed:', e));
        
        // Stop boot sound and start ambient sound
        this.bootSound.pause();
        this.bootSound.currentTime = 0;
        this.ambientSound.play().catch(e => console.log('Ambient sound failed:', e));

        bootCompleted = true;
        skipButton.style.display = 'none';

        // Hide boot sequence and show document
        setTimeout(() => {
            this.bootSequence.classList.add('hidden');
            setTimeout(() => {
                this.ocDocument.documentContainer.classList.add('visible');
            }, 1000);
        }, 2000);
    }

    skipBoot() {
        // Stop any ongoing boot sounds
        this.bootSound.pause();
        this.bootSound.currentTime = 0;
        
        // Play success sound immediately
        this.successSound.play().catch(e => console.log('Success sound failed:', e));
        
        // Start ambient sound
        this.ambientSound.play().catch(e => console.log('Ambient sound failed:', e));
        
        // Immediately show completion
        const bootTextContainer = this.bootSequence.querySelector('.boot-text');
        bootTextContainer.innerHTML = `
            <div class="boot-line">BOOT SEQUENCE SKIPPED</div>
            <div class="boot-line">SYSTEM READY</div>
            <div class="smiley-face" style="opacity: 1;">:)</div>
        `;
        
        // Hide skip button
        const skipButton = this.bootSequence.querySelector('.skip-boot-btn');
        if (skipButton) skipButton.style.display = 'none';
        
        // Immediately transition to document view
        setTimeout(() => {
            this.bootSequence.classList.add('hidden');
            setTimeout(() => {
                this.ocDocument.documentContainer.classList.add('visible');
            }, 500);
        }, 1000);
    }

    typeLine(element, text, startDelay) {
        return new Promise(resolve => {
            setTimeout(() => {
                let i = 0;
                /* @tweakable The delay between each character appearing on screen in milliseconds - this retarded shit controls typing speed */
                const typingSpeed = 30;
                const typingInterval = setInterval(() => {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typingInterval);
                        resolve();
                    }
                }, typingSpeed);
            }, startDelay);
        });
    }

    startLoadingSpinner(spinner, duration) {
        if (!spinner) return;
        
        const frames = ['|', '/', '-', '\\'];
        let frameIndex = 0;
        
        const spinInterval = setInterval(() => {
            spinner.textContent = frames[frameIndex];
            frameIndex = (frameIndex + 1) % frames.length;
        }, 200);
        
        // Stop spinner after the specified duration
        setTimeout(() => {
            clearInterval(spinInterval);
            spinner.textContent = 'OK';
            spinner.style.color = '#00ff00';
        }, duration);
    }
}
// End of this retarded shit - OMG COME HERE LET ME KISS U MWAAAH
// This beautiful mess is complete and ready to fuck shit up
