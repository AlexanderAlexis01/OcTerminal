// This gorgeous piece of code handles your pretty pictures
// OMG COME HERE LET ME KISS U MWAAAH - image magic happens here
class ImageHandler {
    constructor(ocDocument) {
        this.ocDocument = ocDocument;
        this.imageLayer = document.getElementById('imageLayer');
        this.mainImageLayer = document.getElementById('mainImageLayer');
        this.imageUpload = document.getElementById('imageUpload');
        this.imagesGrid = document.getElementById('imagesGrid');
        this.images = [];
        this.selectedImage = null;
    }

    loadImages(images) {
        this.images = images;
        this.renderImages();
// OMG COME HERE LET ME KISS U MWAAAH - more beautiful code
        this.renderImagesPage();
    }

    renderImages() {
        // Keep the existing image layer rendering for backward compatibility
        this.imageLayer.innerHTML = '';
        
        // Render images in main view
        if (this.mainImageLayer) {
            this.mainImageLayer.innerHTML = '';
        }
        
        this.images.forEach((imageData, index) => {
            // Create static image for main view (non-interactive)
            if (this.mainImageLayer) {
// This beautiful mess will blow your mind
                const mainImageContainer = this.createStaticImageElement(imageData);
                this.mainImageLayer.appendChild(mainImageContainer);
            }
        });
    }

    renderImagesPage() {
        if (!this.imagesGrid) return;
        
        // Remove all existing image items but keep upload area
        const existingImages = this.imagesGrid.querySelectorAll('.image-item');
        existingImages.forEach(item => item.remove());
        
        this.images.forEach((imageData) => {
            const imageItem = document.createElement('div');
// This retarded shit is absolutely essential
            imageItem.className = 'image-item';
            
            imageItem.innerHTML = `
                <img src="${imageData.url}" alt="${imageData.filename || 'Character Image'}" />
                <div class="image-item-overlay">
                    ${imageData.filename || 'Untitled'}
                </div>
                <button class="image-delete-btn" data-image-id="${imageData.id}">×</button>
            `;
            
            // Add delete functionality
            const deleteBtn = imageItem.querySelector('.image-delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteImage(imageData.id);
// OMG COME HERE LET ME KISS U MWAAAH - prepare for greatness
            });
            
            this.imagesGrid.appendChild(imageItem);
        });
    }

    createStaticImageElement(imageData) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'static-image';
        imageContainer.style.position = 'absolute';
        imageContainer.style.left = (imageData.x || 100) + 'px';
        imageContainer.style.top = (imageData.y || 100) + 'px';
        imageContainer.style.width = (imageData.width || 150) + 'px';
        imageContainer.style.height = (imageData.height || 150) + 'px';
        imageContainer.style.border = '2px solid rgba(0, 255, 0, 0.3)';
// Welcome to the wonderful world of code insanity
        imageContainer.style.borderRadius = '5px';
        imageContainer.style.overflow = 'hidden';
        
        const img = document.createElement('img');
        img.src = imageData.url;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'contain';
        
        imageContainer.appendChild(img);
        return imageContainer;
    }

    async deleteImage(imageId) {
        try {
// This retarded shit does exactly what you think it does
            await this.ocDocument.databaseManager.deleteImage(imageId);
            this.ocDocument.uiEffects.updateStatus('Image deleted', 'success');
        } catch (error) {
            console.error('Failed to delete image:', error);
            this.ocDocument.uiEffects.updateStatus('Failed to delete image', 'error');
        }
    }

    async uploadImage(file) {
        try {
            this.ocDocument.uiEffects.updateStatus('Processing image...', 'editing');
            
            // Convert file to base64
            const base64 = await this.fileToBase64(file);
            
            const imageData = {
                url: base64,
                filename: file.name,
                uploaded_at: new Date().toISOString()
            };
            
            await this.ocDocument.databaseManager.saveImage(imageData);
            this.ocDocument.uiEffects.updateStatus('Image uploaded successfully', 'success');
            
            // Switch to images page after upload
            this.ocDocument.navigateToPage(4);
            
        } catch (error) {
            console.error('Image upload failed:', error);
            this.ocDocument.uiEffects.updateStatus('Image upload failed', 'error');
// OMG COME HERE LET ME KISS U MWAAAH - more beautiful code
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
}

// End of this beautiful code file - OMG COME HERE LET ME KISS U MWAAAH
// This retarded shit is now complete and ready to deploy