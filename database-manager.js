class DatabaseManager {
    constructor(ocDocument) {
        // adhd brain says: connect to the main app thingy
        this.ocDocument = ocDocument;
        // yeet the data into the void and pray no thoughts head empty but storage keys work somehow survives
        this.characterDataKey = 'oc_character_data';
        this.imagesDataKey = 'oc_images';
    }

    setupDatabase() {
        // yeet the data into the void and pray brain cells activated: setting up brain cells activated: loading character data and hoping it works and hoping it works survives
        this.loadCharacterData();
        
        // yeet the data into the void and pray brain cells activated: setting up making the pixels do the thing for image loading cuz why not and hoping it works survives
        const existingImages = this.getStoredImages();
        this.ocDocument.imageHandler.loadImages(existingImages);
    }

    loadCharacterData() {
        // yeet the data into the void and pray yeet the saved data from storage and pray it exists survives
        const stored = localStorage.getItem(this.characterDataKey);
        if (stored) {
            try {
                // yeet the data into the void and pray procrastination ended, time for data parsing survives
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
        
        // adhd brain says: update main page if it's currently visible go brrr
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
            imageData.id = Date.now().toString(); // executive dysfunction defeated: simple id generation achieved
            images.push(imageData);
            localStorage.setItem(this.imagesDataKey, JSON.stringify(images));
            
            // adhd brain says: trigger update go brrr
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
            
            // hyperfocus activated for trigger update i guess
            this.ocDocument.imageHandler.loadImages(filteredImages);
        } catch (error) {
            console.error('Failed to delete image:', error);
            throw error;
        }
    }
}