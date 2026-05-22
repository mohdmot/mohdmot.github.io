// Base Configuration for REST API server
const API_BASE_URL = 'https://mohdmot.pythonanywhere.com';

document.addEventListener('DOMContentLoaded', () => {
    // ==================================
    // 1. Theme Synchronization
    // ==================================
    const body = document.body;
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
        } else {
            body.classList.remove('light-mode');
            if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
        }
    }

    // Initialize theme based on localStorage
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    applyTheme(savedTheme);

    // Event listener for theme button toggler
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(nextTheme);
            localStorage.setItem('portfolio-theme', nextTheme);
        });
    }

    // Scroll Progress Bar logic
    const scrollBar = document.getElementById('scrollBar');
    window.addEventListener('scroll', () => {
        if (scrollBar) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
            scrollBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
        }
    }, { passive: true });

    // ==================================
    // 1.5 Hero Title Typewriter Effect
    // ==================================
    const mainTitle = document.getElementById('mainTitle');
    if (mainTitle) {
        const text = "What did they said?";
        mainTitle.textContent = '';
        
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        mainTitle.appendChild(cursor);
        
        let charIndex = 0;
        function type() {
            if (charIndex < text.length) {
                const charNode = document.createTextNode(text.charAt(charIndex));
                mainTitle.insertBefore(charNode, cursor);
                charIndex++;
                setTimeout(type, 70 + Math.random() * 50); // Organic human timing variance
            } else {
                cursor.classList.add('fade-out');
                setTimeout(() => {
                    cursor.remove();
                    mainTitle.classList.add('typing-done');
                }, 500); // Wait for cursor fade-out transition
            }
        }
        setTimeout(type, 400); // 400ms delay after load before starting the typing
    }

    // ==================================
    // 2. Initial Data Loading Trigger
    // ==================================
    // Human design loads instantly and doesn't make users wait for slow animations

    // ==================================
    // 3. API Integration (GET Reviews)
    // ==================================
    const reviewsGrid = document.getElementById('reviewsGrid');
    const reviewsLoading = document.getElementById('reviewsLoading');
    const reviewsError = document.getElementById('reviewsError');
    const reviewsEmpty = document.getElementById('reviewsEmpty');
    const retryBtn = document.getElementById('retryBtn');

    let allReviews = [];

    async function fetchReviews() {
        showLoadingState();
        try {
            const response = await fetch(`${API_BASE_URL}/api/reviews`);
            if (!response.ok) throw new Error('API server returned error');
            const result = await response.json();

            if (result.status === 'success' && Array.isArray(result.data)) {
                allReviews = result.data;
                renderReviewsList();
            } else {
                throw new Error('API response malformed');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            showErrorState();
        }
    }

    function showLoadingState() {
        if (reviewsLoading) reviewsLoading.classList.remove('hidden');
        if (reviewsGrid) reviewsGrid.classList.add('hidden');
        if (reviewsError) reviewsError.classList.add('hidden');
        if (reviewsEmpty) reviewsEmpty.classList.add('hidden');
    }

    function showErrorState() {
        if (reviewsLoading) reviewsLoading.classList.add('hidden');
        if (reviewsGrid) reviewsGrid.classList.add('hidden');
        if (reviewsError) reviewsError.classList.remove('hidden');
        if (reviewsEmpty) reviewsEmpty.classList.add('hidden');
    }

    function renderReviewsList() {
        if (reviewsLoading) reviewsLoading.classList.add('hidden');
        if (reviewsError) reviewsError.classList.add('hidden');

        if (allReviews.length === 0) {
            if (reviewsEmpty) reviewsEmpty.classList.remove('hidden');
            if (reviewsGrid) reviewsGrid.classList.add('hidden');
            return;
        }

        if (reviewsEmpty) reviewsEmpty.classList.add('hidden');
        if (reviewsGrid) {
            reviewsGrid.classList.remove('hidden');
            reviewsGrid.innerHTML = '';
        }

        // Render reviews sequentially in a single column
        allReviews.forEach(item => {
            const card = createReviewCard(item);
            if (reviewsGrid) reviewsGrid.appendChild(card);
        });
    }

    function createReviewCard(item) {
        const card = document.createElement('article');
        card.className = 'review-card';

        // Muted pastel/modern background colors for initials avatar
        const colors = [
            '#2563eb', // Blue
            '#10b981', // Emerald
            '#7c3aed', // Violet
            '#f43f5e', // Rose
            '#06b6d4', // Cyan
            '#f97316', // Orange
            '#64748b'  // Slate
        ];
        const charCodeSum = item.name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const avatarBg = colors[charCodeSum % colors.length];
        const initial = item.name.charAt(0).toUpperCase();

        // Safe ratings retrieval
        const r = item.ratings || { quality: 5, speed: 5, communication: 5, price: 5 };

        // Parse images list safely for the gallery carousel
        let imagesHtml = '';
        if (Array.isArray(item.images) && item.images.length > 0) {
            imagesHtml = `
                <div class="review-images-grid">
                    ${item.images.map((imgUrl, idx) => `
                        <img src="${imgUrl}" class="review-thumbnail" data-idx="${idx}" data-gallery='${JSON.stringify(item.images)}' alt="Project Image ${idx + 1}">
                    `).join('')}
                </div>
            `;
        }

        // Format creation date
        let displayTime = item.created_at || 'Just Now';
        try {
            if (item.created_at) {
                // Parse "YYYY-MM-DD HH:MM:SS" manually
                const parts = item.created_at.split(' ');
                if (parts.length === 2) {
                    const dateParts = parts[0].split('-');
                    if (dateParts.length === 3) {
                        const year = parseInt(dateParts[0]);
                        const month = parseInt(dateParts[1]) - 1;
                        const day = parseInt(dateParts[2]);
                        const date = new Date(year, month, day);
                        displayTime = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    }
                }
            }
        } catch (e) {
            console.error('Date parsing failed:', e);
        }

        card.innerHTML = `
            <div class="card-header-row">
                <div class="avatar" style="background-color: ${avatarBg}">${initial}</div>
                <div class="header-meta">
                    <h3 class="reviewer-name" title="${item.name}">${item.name}</h3>
                    <span class="project-badge">${item.project_field}</span>
                </div>
                <time class="review-time">${displayTime}</time>
            </div>
            
            <p class="review-comment">"${item.comment}"</p>
            
            <div class="review-ratings-summary">
                <div class="rating-badge">Quality: <span>${r.quality}/5</span></div>
                <div class="rating-badge">Speed: <span>${r.speed}/5</span></div>
                <div class="rating-badge">Communication: <span>${r.communication}/5</span></div>
                <div class="rating-badge">Value: <span>${r.price}/5</span></div>
            </div>
            
            ${imagesHtml}
        `;

        // Image thumbnail click triggers
        card.querySelectorAll('.review-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const targetIdx = parseInt(e.target.getAttribute('data-idx'));
                const gallery = JSON.parse(e.target.getAttribute('data-gallery'));
                openLightbox(gallery, targetIdx);
            });
        });

        return card;
    }

    if (retryBtn) {
        retryBtn.addEventListener('click', fetchReviews);
    }

    // ==================================
    // 4. Form Smooth Scrolling Navigation
    // ==================================
    const scrollToFormBtn = document.getElementById('scrollToFormBtn');
    if (scrollToFormBtn) {
        scrollToFormBtn.addEventListener('click', () => {
            const addReviewSection = document.getElementById('addReviewSection');
            if (addReviewSection) {
                addReviewSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ==================================
    // 5. Segmented Numerical Scalar Selector Logic
    // ==================================
    const reviewForm = document.getElementById('reviewForm');
    const dragDropArea = document.getElementById('dragDropArea');
    const imageInput = document.getElementById('imageInput');
    const imagePreviews = document.getElementById('imagePreviews');
    const submitBtn = document.getElementById('submitBtn');

    let uploadedFiles = []; // Track actual files locally

    const ratingGroups = document.querySelectorAll('.scalar-rating');
    ratingGroups.forEach(group => {
        const buttons = group.querySelectorAll('.scalar-btn');
        const criteria = group.getAttribute('data-criteria');
        const hiddenInput = document.getElementById(`rating-${criteria}`);

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const clickValue = parseInt(button.getAttribute('data-value'));
                if (hiddenInput) hiddenInput.value = clickValue;

                // Sync UI active state
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Initialize default select to value 5
        const defaultBtn = group.querySelector(`.scalar-btn[data-value="5"]`);
        if (defaultBtn) {
            defaultBtn.classList.add('active');
        }
        if (hiddenInput) {
            hiddenInput.value = 5;
        }
    });

    // Drag and Drop files selection
    if (dragDropArea && imageInput) {
        dragDropArea.addEventListener('click', () => imageInput.click());

        // File drag gestures
        ['dragenter', 'dragover'].forEach(name => {
            dragDropArea.addEventListener(name, (e) => {
                e.preventDefault();
                dragDropArea.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(name => {
            dragDropArea.addEventListener(name, (e) => {
                e.preventDefault();
                dragDropArea.classList.remove('dragover');
            }, false);
        });

        dragDropArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFilesSelection(files);
        });

        imageInput.addEventListener('change', () => {
            handleFilesSelection(imageInput.files);
        });
    }

    function handleFilesSelection(files) {
        const fileArr = Array.from(files).filter(f => f.type.startsWith('image/'));
        
        if (uploadedFiles.length + fileArr.length > 5) {
            showToast('You can attach a maximum of 5 images.', 'error');
            return;
        }

        fileArr.forEach(file => {
            uploadedFiles.push(file);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const previewItem = document.createElement('div');
                previewItem.className = 'preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Preview thumbnail">
                    <button type="button" class="remove-preview-btn"><i class="fa-solid fa-xmark"></i></button>
                `;

                // Handle preview delete button
                previewItem.querySelector('.remove-preview-btn').addEventListener('click', () => {
                    const idx = uploadedFiles.indexOf(file);
                    if (idx > -1) {
                        uploadedFiles.splice(idx, 1);
                    }
                    previewItem.remove();
                });

                if (imagePreviews) imagePreviews.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        });
    }

    function resetReviewForm() {
        if (reviewForm) reviewForm.reset();
        uploadedFiles = [];
        if (imagePreviews) imagePreviews.innerHTML = '';
        
        // Reset scalar pill buttons to default value 5
        ratingGroups.forEach(group => {
            const buttons = group.querySelectorAll('.scalar-btn');
            const criteria = group.getAttribute('data-criteria');
            const hiddenInput = document.getElementById(`rating-${criteria}`);
            if (hiddenInput) hiddenInput.value = 5;
            
            buttons.forEach(btn => btn.classList.remove('active'));
            const defaultBtn = group.querySelector(`.scalar-btn[data-value="5"]`);
            if (defaultBtn) defaultBtn.classList.add('active');
        });

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Review';
        }
    }

    // Submit Review Form Action
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate inputs
            const name = document.getElementById('clientName').value.trim();
            const projectField = document.getElementById('projectField').value.trim();
            const comment = document.getElementById('clientComment').value.trim();

            if (!name || !projectField || !comment) {
                showToast('Please fill out all required fields.', 'error');
                return;
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Submitting...';
            }

            // Construct Multipart Form Data
            const formData = new FormData();
            formData.append('name', name);
            formData.append('project_field', projectField);
            formData.append('comment', comment);
            formData.append('quality', parseInt(document.getElementById('rating-quality').value) || 5);
            formData.append('speed', parseInt(document.getElementById('rating-speed').value) || 5);
            formData.append('communication', parseInt(document.getElementById('rating-communication').value) || 5);
            formData.append('price', parseInt(document.getElementById('rating-price').value) || 5);

            // Append attached files
            uploadedFiles.forEach(file => {
                formData.append('images', file);
            });

            try {
                const response = await fetch(`${API_BASE_URL}/api/reviews`, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (response.status === 201 && result.status === 'success') {
                    showToast('Review submitted successfully!', 'success');
                    resetReviewForm();
                    // Reload fresh review grid
                    fetchReviews();
                } else if (response.status === 429) {
                    showToast(result.message || 'Please wait before posting again.', 'error');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Submit Review';
                    }
                } else {
                    showToast(result.message || 'Failed to submit review.', 'error');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Submit Review';
                    }
                }
            } catch (error) {
                console.error('Submit error:', error);
                showToast('Network error. Failed to send review.', 'error');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Review';
                }
            }
        });
    }

    // ==================================
    // 6. Lightbox Carousel Logic
    // ==================================
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = lightboxModal ? lightboxModal.querySelector('.lightbox-close-btn') : null;
    const lightboxPrev = lightboxModal ? lightboxModal.querySelector('.prev-btn') : null;
    const lightboxNext = lightboxModal ? lightboxModal.querySelector('.next-btn') : null;

    let currentGallery = [];
    let currentGalleryIdx = 0;

    function openLightbox(gallery, idx) {
        if (!lightboxModal || !lightboxImg) return;
        currentGallery = gallery;
        currentGalleryIdx = idx;

        updateLightboxImage();
        lightboxModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Render arrow buttons only if there are multiple images
        if (currentGallery.length > 1) {
            if (lightboxPrev) lightboxPrev.classList.remove('hidden');
            if (lightboxNext) lightboxNext.classList.remove('hidden');
        } else {
            if (lightboxPrev) lightboxPrev.classList.add('hidden');
            if (lightboxNext) lightboxNext.classList.add('hidden');
        }
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    function updateLightboxImage() {
        if (lightboxImg && currentGallery[currentGalleryIdx]) {
            lightboxImg.src = currentGallery[currentGalleryIdx];
        }
    }

    function navigateLightbox(dir) {
        currentGalleryIdx += dir;
        if (currentGalleryIdx >= currentGallery.length) currentGalleryIdx = 0;
        if (currentGalleryIdx < 0) currentGalleryIdx = currentGallery.length - 1;
        updateLightboxImage();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => navigateLightbox(1));

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }

    // Keyboard navigation shortcuts
    window.addEventListener('keydown', (e) => {
        if (lightboxModal && !lightboxModal.classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft' && currentGallery.length > 1) navigateLightbox(-1);
            if (e.key === 'ArrowRight' && currentGallery.length > 1) navigateLightbox(1);
        }
    });

    // ==================================
    // 7. Toast Alerts System
    // ==================================
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, type = 'info') {
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let iconClass = 'fa-solid fa-circle-info';
        if (type === 'success') iconClass = 'fa-solid fa-circle-check';
        if (type === 'error') iconClass = 'fa-solid fa-circle-xmark';

        toast.innerHTML = `
            <i class="${iconClass}"></i>
            <span class="toast-message">${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Remove toast automatically after 4 seconds
        setTimeout(() => {
            toast.classList.add('removing');
            toast.addEventListener('transitionend', () => {
                toast.remove();
            });
        }, 4000);
    }

    // ==================================
    // 8. Initial Data Trigger (Must call at the very end of DOMContentLoaded)
    // ==================================
    fetchReviews();
});
