class BootSequence {
    constructor(ocDocument) {
        this.ocDocument = ocDocument;
        this.bootSequence = document.getElementById('bootSequence');
        this.ambientSound = document.getElementById('ambientSound');
        this.bootSound = document.getElementById('bootSound');
        this.successSound = document.getElementById('successSound');
        this.powerOnSound = document.getElementById('powerOnSound');
    }

    async start() {
        // Play power on sound
        this.powerOnSound.play().catch(e => console.log('Power on sound failed:', e));
        
        /* @tweakable Delay in milliseconds before the boot text starts appearing after power on. */
        const bootStartDelay = 2500;
        
        // Wait for power-on animation to finish before starting boot text
        await new Promise(resolve => setTimeout(resolve, bootStartDelay));

        // Set up the container
        this.bootSequence.innerHTML = `
            <div class="boot-text">
                <!-- Lines will be typed here -->
            </div>
        `;
        const bootTextContainer = this.bootSequence.querySelector('.boot-text');

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

        // Play PC boot sound
        this.bootSound.play().catch(e => console.log('Boot sound failed:', e));

        // Type out all lines
        let totalDelay = 500;
        for (let i = 0; i < bootLines.length; i++) {
            const line = bootLines[i];
            const lineElement = document.createElement('div');
            lineElement.className = 'boot-line';
            bootTextContainer.appendChild(lineElement);
            
            await this.typeLine(lineElement, line, totalDelay);
            totalDelay += 500; // Add a pause between lines

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

        // Hide boot sequence and show document
        setTimeout(() => {
            this.bootSequence.classList.add('hidden');
            setTimeout(() => {
                this.ocDocument.documentContainer.classList.add('visible');
            }, 1000);
        }, 2000);
    }

    typeLine(element, text, startDelay) {
        return new Promise(resolve => {
            setTimeout(() => {
                let i = 0;
                /* @tweakable The delay between each character appearing on screen in milliseconds. */
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