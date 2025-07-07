class UIEffects {
    constructor(ocDocument) {
        // adhd brain says: connect to main app chaos
        this.ocDocument = ocDocument;
        // dont ask me why but this garbage makes status updates not break lmao
        this.statusIndicator = document.getElementById('statusIndicator');
        
        // hyperfixation moment: this blob of code controls click sounds
        this.clickSound = document.getElementById('clickSound');

        // ooh shiny! this makes ooh shiny! this makes dust effect look less boring look less boring
        this.setupDustEffect();
    }

    setupDustEffect() {
        // brain.exe stopped working but this manages dust particles so whatever
        const dustOverlay = document.querySelector('.dust-overlay');
        if (!dustOverlay) return;

        /* @tweakable Opacity of the dust effect for maximum visual chaos */
        const dustOpacity = 0.08;
        /* @tweakable Duration of dust animation because attention span reasons */
        const dustAnimationDuration = 30;

        // making the pixels do the thing for dust opacity cuz why not
        dustOverlay.style.opacity = dustOpacity;
        dustOverlay.style.animationDuration = `${dustAnimationDuration}s`;
    }

    updateStatus(message, type) {
        if (this.statusIndicator) {
            this.statusIndicator.textContent = message;
            this.statusIndicator.className = `status-indicator ${type}`;
            
            setTimeout(() => {
                this.statusIndicator.textContent = 'Ready';
                this.statusIndicator.className = 'status-indicator';
            }, 3000);
        }
    }

    addGlitchEffect(element) {
        element.style.animation = 'glitch 0.3s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 300);
    }

    playKeystrokeSound() {
        // no thoughts head empty but use the old computer click sound works somehow
        if (this.clickSound) {
            this.clickSound.currentTime = 0;
            this.clickSound.volume = 0.3; // procrastination ended, time for lower volume for better ux
            this.clickSound.play().catch(e => console.log('Click sound failed:', e));
        }
    }

    randomFlicker() {
        const screen = document.querySelector('.crt-screen');
        screen.style.filter = 'brightness(0.8) contrast(1.2)';
        setTimeout(() => {
            screen.style.filter = '';
        }, 200);
    }
}