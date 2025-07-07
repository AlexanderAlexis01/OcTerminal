class UIEffects {
    constructor(ocDocument) {
        this.ocDocument = ocDocument;
        this.statusIndicator = document.getElementById('statusIndicator');
        
        // Use the old computer click sound
        this.clickSound = document.getElementById('clickSound');

        this.setupDustEffect();
    }

    setupDustEffect() {
        const dustOverlay = document.querySelector('.dust-overlay');
        if (!dustOverlay) return;

        /* @tweakable Opacity of the dust effect (0 to 1) */
        const dustOpacity = 0.08;
        /* @tweakable Duration of the dust animation in seconds (higher is slower) */
        const dustAnimationDuration = 30;

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
        // Use the old computer click sound
        if (this.clickSound) {
            this.clickSound.currentTime = 0;
            this.clickSound.volume = 0.3; // Lower volume for better UX
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