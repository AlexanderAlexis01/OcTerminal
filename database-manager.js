class DatabaseManager {
    constructor(ocDocument) {
        this.ocDocument = ocDocument;
        this.characterDataKey = 'oc_character_data';
        this.imagesDataKey = 'oc_images';
    }

    setupDatabase() {
        // Load existing character data
        this.loadCharacterData();
        
        // Load existing images
        const existingImages = this.getStoredImages();
        this.ocDocument.imageHandler.loadImages(existingImages);
    }

    loadCharacterData() {
        const stored = localStorage.getItem(this.characterDataKey);
        if (stored) {
            try {
                const record = JSON.parse(stored);
                this.loadCharacterDataFromRecord(record);
            } catch (error) {
                console.error('Failed to load character data:', error);
            }
        }
    }

    loadCharacterDataFromRecord(record) {
        const fields = document.querySelectorAll('.editable-field');
        fields.forEach((field, index) => {
            const fieldKey = `field_${index}`;
            if (record[fieldKey]) {
                field.innerHTML = record[fieldKey];
            }
        });
        this.ocDocument.uiEffects.updateStatus('Data loaded', 'success');
        
        // Update main page if it's currently visible
        if (this.ocDocument.currentView === 'main') {
            this.ocDocument.updateMainPageContent();
        }
    }

    async saveCharacterData() {
        try {
            const fields = document.querySelectorAll('.editable-field');
            const data = {
                last_modified: new Date().toISOString(),
                editor_username: 'User'
            };

            fields.forEach((field, index) => {
                data[`field_${index}`] = field.innerHTML;
            });

            localStorage.setItem(this.characterDataKey, JSON.stringify(data));
            this.ocDocument.uiEffects.updateStatus('Saved successfully', 'success');
        } catch (error) {
            console.error('Save failed:', error);
            this.ocDocument.uiEffects.updateStatus('Save failed', 'error');
        }
    }

    getStoredImages() {
        const stored = localStorage.getItem(this.imagesDataKey);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (error) {
                console.error('Failed to load images:', error);
            }
        }
        return [];
    }

    async saveImage(imageData) {
        try {
            const images = this.getStoredImages();
            imageData.id = Date.now().toString(); // Simple ID generation
            images.push(imageData);
            localStorage.setItem(this.imagesDataKey, JSON.stringify(images));
            
            // Trigger update
            this.ocDocument.imageHandler.loadImages(images);
            return imageData;
        } catch (error) {
            console.error('Failed to save image:', error);
            throw error;
        }
    }

    async deleteImage(imageId) {
        try {
            const images = this.getStoredImages();
            const filteredImages = images.filter(img => img.id !== imageId);
            localStorage.setItem(this.imagesDataKey, JSON.stringify(filteredImages));
            
            // Trigger update
            this.ocDocument.imageHandler.loadImages(filteredImages);
        } catch (error) {
            console.error('Failed to delete image:', error);
            throw error;
        }
    }
}