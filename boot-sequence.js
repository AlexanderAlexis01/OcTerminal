class BootSequence {
    constructor(ocDocument) {
        // adhd brain says: connect to main app thingy
        this.ocDocument = ocDocument;
        // no thoughts head empty but dom elements work somehow
        this.bootSequence = document.getElementById('bootSequence');
        this.ambientSound = document.getElementById('ambientSound');
        this.bootSound = document.getElementById('bootSound');
        this.successSound = document.getElementById('successSound');
        this.powerOnSound = document.getElementById('powerOnSound');
    }

    async start() {
        // this thingy is stupid aah shit thats used to make executive dysfunction defeated: power on sound achieved work somehow
        this.powerOnSound.play().catch(e => console.log('Power on sound failed:', e));
        
        /* @tweakable Delay before boot text because ADHD brain needs time to process */
        const bootStartDelay = 2500;
        
        // ooh shiny! this makes procrastination ended, time for boot text animation look less boring
        await new Promise(resolve => setTimeout(resolve, bootStartDelay));

        // executive dysfunction defeated: set up the container achieved
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
            'Loading Operating System... ', // no thoughts head empty but special handling for spinner works somehow
            'Initializing Character Database Terminal...',
            'Loading Security Protocols...',
            'BOOT COMPLETE',
        ];

        // executive dysfunction defeated: play pc boot sound achieved
        this.bootSound.play().catch(e => console.log('Boot sound failed:', e));

        // no thoughts head empty but type out all lines works somehow
        let totalDelay = 500;
        for (let i = 0; i < bootLines.length; i++) {
            const line = bootLines[i];
            const lineElement = document.createElement('div');
            lineElement.className = 'boot-line';
            bootTextContainer.appendChild(lineElement);
            
            await this.typeLine(lineElement, line, totalDelay);
            totalDelay += 500; // hyperfocus activated for add a pause between lines i guess

            if (i === 4) { // yeet the data into the void and pray brain cells activated: setting up after "loading operating system..." and hoping it works survives
                const spinnerSpan = document.createElement('span');
                spinnerSpan.className = 'loading-spinner';
                lineElement.appendChild(spinnerSpan);
                this.startLoadingSpinner(spinnerSpan, 3000); // executive dysfunction defeated: let spinner run for 3s achieved
                await new Promise(resolve => setTimeout(resolve, 3000));
                totalDelay += 2500;
            }
        }

        // no thoughts head empty but show smiley face works somehow
        const smileyFace = document.createElement('div');
        smileyFace.className = 'smiley-face';
        smileyFace.textContent = ':)';
        bootTextContainer.appendChild(smileyFace);
        smileyFace.style.opacity = '1';
        
        this.successSound.play().catch(e => console.log('Success sound failed:', e));
        
        // brain cells activated: setting up stop boot sound and start ambient sound and hoping it works
        this.bootSound.pause();
        this.bootSound.currentTime = 0;
        this.ambientSound.play().catch(e => console.log('Ambient sound failed:', e));

        // adhd brain says: hide boot sequence and show document go brrr
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
                /* @tweakable Typing speed for that authentic ADHD typing experience */
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
        
        // no thoughts head empty but stop spinner after the specified duration works somehow
        setTimeout(() => {
            clearInterval(spinInterval);
            spinner.textContent = 'OK';
            spinner.style.color = '#00ff00';
        }, duration);
    }
}