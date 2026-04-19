document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lenis for buttery smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        smooth: true,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Common Elements
    const scrollBar = document.getElementById('scrollBar');

    // Hero Elements
    const heroScrollContainer = document.querySelector('.hero-scroll-container');
    const heroText = document.getElementById('heroText');
    const heroImg = document.getElementById('heroImg');

    // Timeline Elements
    const timelineSection = document.querySelector('.timeline-section');
    const timelineTrack = document.querySelector('.timeline-track');
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Brain Elements Setup
    const brainSection = document.getElementById('brainSection');
    const brainCenter = document.getElementById('brainCenter');
    const symbolsContainer = document.getElementById('symbolsContainer');
    const labels = document.querySelectorAll('.brain-label');
    const brainModel = document.getElementById('brainModel');
    
    // Generate Brain Symbols
    const symbolClasses = [
        'fa-brands fa-js', 'fa-brands fa-python', 'fa-brands fa-php', 
        'fa-brands fa-java', 'fa-solid fa-c', 'fa-brands fa-linux', 
        'fa-brands fa-git-alt', 'fa-solid fa-database', 'fa-solid fa-code', 
        'fa-solid fa-terminal', 'fa-brands fa-html5', 'fa-brands fa-css3-alt',
        'fa-solid fa-bug', 'fa-solid fa-microchip'
    ];
    let symbolsData = [];
    
    if (symbolsContainer) {
        for (let i = 0; i < 30; i++) {
            let wrapper = document.createElement('div');
            wrapper.className = 'brain-symbol-wrapper';
            
            let el = document.createElement('i');
            el.className = symbolClasses[i % symbolClasses.length] + ' brain-symbol';
            el.style.animationDelay = `-${Math.random() * 4}s`;
            
            wrapper.appendChild(el);
            symbolsContainer.appendChild(wrapper);
            
            let angle = Math.random() * Math.PI * 2;
            let radius = 20 + Math.random() * 60; // scattered across screen
            
            let startX = Math.cos(angle) * (window.innerWidth * (radius / 100));
            let startY = Math.sin(angle) * (window.innerHeight * (radius / 100));
            
            wrapper.style.transform = `translate(calc(-50% + ${startX}px), calc(-50% + ${startY}px))`;

            symbolsData.push({
                wrapper, el, startX, startY
            });
        }
    }

    // Initialize persistent random seeds for labels so they remain consistent across scroll frames
    // while easily adapting to runtime screen resizing
    labels.forEach((lbl) => {
        lbl._randAngleOffset = (Math.random() - 0.5) * 1.5; 
        lbl._randDrift = (Math.random() - 0.5) * 30; // Mobile horizontal drift
        lbl._randRadX = Math.random(); 
        lbl._randRadY = Math.random(); 
        lbl._randOuterRad = Math.random(); 
    });

    // Trigger an initial call to set initial states
    handleScroll();

    lenis.on('scroll', () => {
        handleScroll();
    });

    // We can also trigger calculation on resize to fix any layout shifts
    window.addEventListener('resize', () => {
        handleScroll();
    });

    function handleScroll() {
        let scrollY = window.scrollY;

        // Update Top Scroll Progress Bar
        if (scrollBar) {
            let totalDocHeight = document.body.scrollHeight - window.innerHeight;
            let scrollPercent = (scrollY / totalDocHeight) * 100;
            scrollPercent = Math.max(0, Math.min(100, scrollPercent));
            scrollBar.style.width = scrollPercent + '%';
        }

        // ==========================================
        // 1. HERO SECTION LOGIC
        // ==========================================
        if (heroScrollContainer && heroText) {
            let containerTop = heroScrollContainer.offsetTop;
            // The distance the user can scroll before leaving the container
            let scrollableDistance = heroScrollContainer.offsetHeight - window.innerHeight;

            let rawProgress = (scrollY - containerTop) / scrollableDistance;

            // Multiply progress so it hits 1.0 when rawProgress is at 0.8 (80%)
            // The remaining 20% acts as a freeze frame extra scroll before moving on
            let progress = rawProgress / 0.8;
            
            // Clamp progress between 0 and 1
            progress = Math.max(0, Math.min(1, progress));

            // Use an easing function for a smoother, decelerating movement
            const easeOutQuad = t => t * (2 - t);
            const easeProgress = easeOutQuad(progress);

            // Move upwards as user scrolls
            // On mobile, text needs to rise more because image is scaled 2x. Pushing it up further!
            let riseAmount = window.innerWidth <= 768 ? 62 : 30;
            // Start 15vh below its base position, end depending on device
            let transY = 15 - (easeProgress * riseAmount);

            // Scale increases slightly to give a 3D emerging effect
            let scale = 0.85 + (easeProgress * 0.15);

            // Opacity fades in over the first 25% of the scroll
            let opacity = progress / 0.25;
            opacity = Math.max(0, Math.min(1, opacity));

            // Dynamic Glow & Color
            // The more we scroll up, the brighter and more saturated the text becomes
            let glowSpread1 = 15 + (easeProgress * 25);     // 15px to 40px
            let glowSpread2 = 30 + (easeProgress * 60);     // 30px to 90px
            let glowOpacity1 = progress * 0.9;              // 0 to 0.9 (White glow)
            let glowOpacity2 = progress * 0.6;              // 0 to 0.6 (Blue tint glow)

            // Removing the blur filter gradually as it moves up
            let blurAmount = 10 - (progress * 10);          // 10px to 0px blur

            heroText.style.filter = `blur(${Math.max(0, blurAmount)}px)`;
            heroText.style.opacity = opacity;
            heroText.style.transform = `translateY(${transY}vh) scale(${scale})`;

            // Apply pure white color with varying alpha, breaking out of background-clip
            heroText.style.background = 'none';
            heroText.style.webkitTextFillColor = 'unset';
            heroText.style.color = `rgba(255, 255, 255, ${0.4 + (progress * 0.6)})`;

            // Apply text shadow
            heroText.style.textShadow = `
                0 0 ${glowSpread1}px rgba(255, 255, 255, ${glowOpacity1}), 
                0 0 ${glowSpread2}px rgba(77, 184, 255, ${glowOpacity2})
            `;
        }

        // ==========================================
        // 2. TIMELINE SECTION LOGIC
        // ==========================================
        if (timelineSection && timelineTrack) {
            let tTop = timelineSection.offsetTop;
            let tScrollable = timelineSection.offsetHeight - window.innerHeight;
            let tProgress = (scrollY - tTop) / tScrollable;

            // Only animate if the section is in or near the viewport
            if (tProgress > -0.2 && tProgress < 1.2) {
                // Clamp progress for the timeline transform to prevent overscrolling the track
                let clampedProgress = Math.max(0, Math.min(1, tProgress));
                
                // Track max translation distance based on its overflowing width
                // Calculate width of the track bounds minus the viewport width
                let trackWidth = timelineTrack.scrollWidth;
                let maxTranslate = trackWidth - window.innerWidth;
                
                // Actually translate the track based on progress
                let currentTranslateX = -(clampedProgress * maxTranslate);
                timelineTrack.style.transform = `translateX(${currentTranslateX}px)`;

                // Animate timeline cards based on their position relative to the center of the screen
                const viewCenter = window.innerWidth / 2;

                timelineItems.forEach((item) => {
                    let rect = item.getBoundingClientRect();
                    let itemCenter = rect.left + (rect.width / 2);
                    
                    // absolute distance of this item's center from the screen's center
                    let dist = Math.abs(viewCenter - itemCenter);
                    
                    // If the item is perfectly centered, scale is 1. Maximum threshold is half the screen width.
                    let maxDist = window.innerWidth / 1.5;
                    let ratio = 1 - (dist / maxDist);
                    ratio = Math.max(0, Math.min(1, ratio)); // scale 0 to 1

                    // 1. Calculate 3D rotation
                    // Signed distance to know if item is on the left or right
                    let signedDist = itemCenter - viewCenter;
                    let normDist = signedDist / maxDist; // mapped to roughly [-1, 1]
                    normDist = Math.max(-1, Math.min(1, normDist));
                    
                    // Cards entering from right (normDist > 0) tilted, leaving left (normDist < 0) tilted oppositely
                    let rotateYAngle = normDist * -40;

                    // Create the scaling and fading effect
                    let scaleValue = 0.8 + (ratio * 0.2); // 0.8 up to 1.0
                    let opacityValue = 0.3 + (ratio * 0.7); // 0.3 up to 1.0

                    // Adding perspective here anchors the 3D camera to the item perfectly, avoiding stretch/squish distortions
                    item.style.transform = `perspective(1500px) scale(${scaleValue}) rotateY(${rotateYAngle}deg)`;
                    item.style.opacity = opacityValue;

                    // Calculate an X offset for the shadow to make the 3D lighting feel real
                    let shadowX = normDist * -20; // Reverse direction of dist for natural shadow falloff

                    // If it is in the absolute center, apply standard glowing box shadow!
                    if (ratio > 0.85) {
                        let glowPower = (ratio - 0.85) / 0.15; // normalize from 0.85 -> 1.0 to 0 -> 1.0
                        // Dual layer shadow: strong white core, soft icy blue outer (exactly like the text)
                        item.querySelector('.timeline-content').style.boxShadow = `${shadowX}px 8px 40px rgba(255, 255, 255, ${0.1 + (glowPower * 0.3)}), ${shadowX}px 8px 60px rgba(77, 184, 255, ${0.1 + (glowPower * 0.2)})`;
                        item.querySelector('.timeline-content').style.borderColor = `rgba(255, 255, 255, ${0.2 + (glowPower * 0.4)})`;
                        item.querySelector('.timeline-date').style.color = '#02070b';
                        item.querySelector('.timeline-date').style.backgroundColor = '#fff';
                        item.querySelector('.timeline-date').style.boxShadow = `0 0 20px rgba(255, 255, 255, ${0.3 + (glowPower * 0.5)})`;
                        item.querySelector('.timeline-date').style.borderColor = `rgba(255, 255, 255, ${0.5 + (glowPower * 0.5)})`;
                    } else {
                        item.querySelector('.timeline-content').style.boxShadow = `${shadowX}px 8px 32px rgba(0, 0, 0, 0.5)`;
                        item.querySelector('.timeline-content').style.borderColor = `rgba(255, 255, 255, 0.05)`;
                        item.querySelector('.timeline-date').style.color = 'rgba(255, 255, 255, 0.5)';
                        item.querySelector('.timeline-date').style.backgroundColor = '#02070b';
                        item.querySelector('.timeline-date').style.boxShadow = 'none';
                        item.querySelector('.timeline-date').style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }
                });
            }
        }

        // ==========================================
        // 3. BRAIN SECTION LOGIC
        // ==========================================
        if (brainSection && brainCenter && symbolsContainer) {
            let bTop = brainSection.offsetTop;
            let bScrollable = brainSection.offsetHeight - window.innerHeight;
            let bProgress = (scrollY - bTop) / bScrollable;

            if (bProgress > -0.2 && bProgress < 1.2) {
                let clampedProgress = Math.max(0, Math.min(1, bProgress));
                
                // --- Timeline Phases ---
                // 0.00 -> 0.15: Brain Appears
                // 0.15 -> 0.40: Symbols appear and suck into Brain
                // 0.40 -> 1.00: Labels phase in batches

                // 1. Brain appears (0 to 0.15)
                let brainOp = clampedProgress / 0.15;
                brainOp = Math.max(0, Math.min(1, brainOp));
                let brainScale = 0.5 + (brainOp * 0.5);
                brainCenter.style.opacity = brainOp;
                brainCenter.style.transform = `scale(${brainScale})`;

                let pulsePower = 0;

                // 2. Symbols Fade-In & Suck-In (0.15 to 0.40)
                let suckTotalProgress = (clampedProgress - 0.15) / 0.25;
                suckTotalProgress = Math.max(0, Math.min(1, suckTotalProgress));
                
                // Symbols begin to show heavily in early suck progress
                let symOp = suckTotalProgress / 0.2; 
                symOp = Math.max(0, Math.min(1, symOp));
                
                let suckAction = (suckTotalProgress - 0.2) / 0.8;
                suckAction = Math.max(0, Math.min(1, suckAction));
                let suckEase = suckAction * suckAction * suckAction; // accelerate fast into center

                symbolsData.forEach(item => {
                    let currX = item.startX * (1 - suckEase);
                    let currY = item.startY * (1 - suckEase);
                    let sScale = 1 - suckEase;
                    
                    item.wrapper.style.transform = `translate(calc(-50% + ${currX}px), calc(-50% + ${currY}px)) scale(${Math.max(0, sScale)})`;
                    item.wrapper.style.opacity = symOp;
                    
                    if (suckAction > 0 && suckAction < 1) {
                        let glowPower = suckAction;
                        item.el.style.color = `rgba(255, 255, 255, ${0.15 + glowPower * 0.85})`;
                        // White glow requested by user
                        item.el.style.filter = `drop-shadow(0 0 ${10 + glowPower*20}px rgba(255, 255, 255, ${glowPower}))`;
                    } else {
                        item.el.style.color = `rgba(255, 255, 255, 0.15)`;
                        item.el.style.filter = `drop-shadow(0 0 10px transparent)`;
                    }
                });

                if (suckAction > 0.9) {
                    pulsePower = (suckAction - 0.9) * 10;
                }
                
                // White glow for brain - Reduced as per user request
                brainCenter.style.filter = `drop-shadow(0 0 ${10 + pulsePower * 20}px rgba(255, 255, 255, ${0.1 + pulsePower*0.4}))`;

                // 3. Labels Pop-out in Batches (0.4 to 1.0)
                let labelPhase = (clampedProgress - 0.4) / 0.6;
                labelPhase = Math.max(0, Math.min(1, labelPhase));
                
                // Batch logic: dynamically calculates based on current window size
                let isMobile = window.innerWidth <= 768;
                let batchSize = isMobile ? 2 : 3; 
                let batchesCount = Math.ceil(labels.length / batchSize);

                labels.forEach((lbl, idx) => {
                    let batchIdx = Math.floor(idx / batchSize);
                    let batchProgressStart = batchIdx / batchesCount;
                    let batchProgressEnd = (batchIdx + 1) / batchesCount;
                    
                    // Normalize the progress within the specific batch window
                    let localP = (labelPhase - batchProgressStart) / (batchProgressEnd - batchProgressStart);
                    
                    let finalX, finalY, targetX, targetY, angle;

                    if (isMobile) {
                        let isTop = (idx % batchSize) === 0;
                        angle = isTop ? -Math.PI / 2 : Math.PI / 2;
                        finalX = lbl._randDrift;
                        let radiusY = window.innerHeight * 0.28 + (lbl._randRadY * 40);
                        finalY = isTop ? -radiusY : radiusY;
                    } else {
                        let baseAngle = (idx % batchSize) * (Math.PI * 2 / batchSize);
                        angle = baseAngle + Math.PI/2 + lbl._randAngleOffset;
                        let radiusX = 300 + (lbl._randRadX * 150);
                        let radiusY = 200 + (lbl._randRadY * 100);
                        finalX = Math.cos(angle) * radiusX;
                        finalY = Math.sin(angle) * radiusY;
                    }

                    // Dynamically map exact target connections
                    let brainRadius = isMobile ? 100 : 180;
                    let tAng = angle + (lbl._randAngleOffset * (isMobile ? 0.3 : 0.6));
                    let tRad = brainRadius * (0.6 + lbl._randOuterRad * 0.3);
                    targetX = Math.cos(tAng) * tRad;
                    targetY = Math.sin(tAng) * tRad;

                    // Visibility & Scale calculation
                    let op = 0;
                    let scale = 0.5;

                    if (localP >= 0 && localP <= 1) {
                        // Enter phase (first 20%)
                        if (localP < 0.2) {
                            let pIN = localP / 0.2;
                            let easeIn = 1 - Math.pow(1 - pIN, 3);
                            op = pIN;
                            scale = 0.5 + 0.5 * easeIn;
                        // Exit phase (last 20%)
                        } else if (localP > 0.8) {
                            let pOUT = (localP - 0.8) / 0.2;
                            op = 1 - pOUT;
                            scale = 1 + 0.2 * pOUT; // slight grow on exit
                        // Static phase (middle 60%)
                        } else {
                            op = 1;
                            scale = 1;
                        }
                    }

                    lbl.style.opacity = op;
                    let targetScale = isMobile ? 0.75 : 1;
                    lbl.style.transform = `translate(calc(-50% + ${finalX}px), calc(-50% + ${finalY}px)) scale(${scale * targetScale})`;
                    lbl.style.pointerEvents = (op > 0.1) ? 'auto' : 'none';

                    // Update or create the connection line to the brain
                    let line = lbl.querySelector('.label-line');
                    if (!line) {
                        line = document.createElement('div');
                        line.className = 'label-line';
                        lbl.appendChild(line);
                    }
                    
                    if (op > 0) {
                        // Calculate line from label center stretching inward to its specific random target on the brain surface
                        let dx = targetX - finalX;
                        let dy = targetY - finalY;
                        let length = Math.hypot(dx, dy);
                        let angleToTarget = Math.atan2(dy, dx);
                        
                        line.style.width = `${Math.max(0, length)}px`;
                        line.style.transform = `rotate(${angleToTarget}rad)`;
                    }
                });

                // 4. Advanced 3D Model Stepped Rotation
                if (brainModel) {
                    let totalRotation = 0;
                    
                    // Phase 1: As brain scales up and symbols suck in (clampedProgress 0 to 0.4)
                    // Spin smoothly for 1 full rotation (360deg)
                    let phase1Progress = Math.min(1, Math.max(0, clampedProgress / 0.4));
                    let easedP1 = phase1Progress * (2 - phase1Progress); // ease-out
                    totalRotation += easedP1 * 360;

                    // Phase 2: Stepped rotation linked to label batches
                    if (labelPhase > 0) {
                        let batchFloat = labelPhase * batchesCount;
                        let currentBatch = Math.floor(batchFloat);
                        if (currentBatch >= batchesCount) {
                            currentBatch = batchesCount - 1;
                            batchFloat = batchesCount;
                        }
                        
                        let localStepP = batchFloat - currentBatch;
                        
                        // Easing function for smooth, cinematic stop/go movement
                        const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                        
                        let stepFraction = 0;
                        if (localStepP < 0.2) {
                            // Enter Phase: Rotate by 50% of the batch movement smoothly
                            stepFraction = 0.5 * easeInOut(localStepP / 0.2);
                        } else if (localStepP <= 0.8) {
                            // Static Phase: Brain STOPS exactly as requested
                            stepFraction = 0.5;
                        } else {
                            // Exit Phase: Rotate the remaining 50% of the batch movement smoothly
                            stepFraction = 0.5 + 0.5 * easeInOut((localStepP - 0.8) / 0.2);
                        }
                        
                        let totalSteps = currentBatch + stepFraction;
                        // Rotate 180 degrees (half a turn) during every batch transition
                        totalRotation += totalSteps * 180;
                    }

                    brainModel.setAttribute('camera-orbit', `${totalRotation}deg 80deg auto`);
                }
            }
        }
    }
});
