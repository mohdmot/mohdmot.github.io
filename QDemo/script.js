/**
 * Interactive Scroll-Driven Storytelling Landing Page
 * GSAP + ScrollTrigger Orchestration
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ==========================================================================
     1. FULLSCREEN LIGHTBOX FOR PROJECT IMAGES
     ========================================================================== */
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  const openLightbox = (src, alt) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxClose) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Attach click listeners to all project image containers
  document.querySelectorAll('.card-snug-media').forEach((wrapper) => {
    wrapper.addEventListener('click', () => {
      const img = wrapper.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  /* ==========================================================================
     2. ENTRY MODAL & SECTION 1 TRIGGER
     Image slides in from right BEFORE text, right after modal dismissal!
     ========================================================================== */
  const modalOverlay = document.getElementById('entry-modal-overlay');
  const btn1 = document.getElementById('modal-btn-1');
  const btn2 = document.getElementById('modal-btn-2');
  const body = document.body;

  let section1HasPlayed = false;

  const playSection1Sequence = () => {
    if (section1HasPlayed || typeof gsap === 'undefined') return;
    section1HasPlayed = true;

    const s1TL = gsap.timeline();

    // 1. IMAGE APPEARS FIRST: Slides in from the right edge
    s1TL
      .fromTo('#img-cold-night',
        { x: '100vw', opacity: 0 },
        { x: '0%', opacity: 1, duration: 1.1, ease: 'power3.out' }
      )
      // 2. TEXT APPEARS AFTER THE IMAGE
      .fromTo('#s1-heading',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        '+=0.15'
      )
      .fromTo('#s1-alert',
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' },
        '+=0.2'
      );
  };

  const dismissModal = () => {
    if (!modalOverlay) return;
    if (typeof gsap !== 'undefined') {
      gsap.to('.modal-card', {
        y: 30,
        scale: 0.9,
        opacity: 0,
        duration: 0.35,
        ease: 'back.in(1.7)',
        onComplete: () => {
          modalOverlay.classList.add('hidden');
          body.classList.remove('modal-locked');
          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
          }
          // Launch Section 1 animations right after modal dismissal!
          playSection1Sequence();
        }
      });
      gsap.to(modalOverlay, {
        opacity: 0,
        duration: 0.35,
        delay: 0.05
      });
    } else {
      modalOverlay.classList.add('hidden');
      body.classList.remove('modal-locked');
      playSection1Sequence();
    }
  };

  if (btn1) btn1.addEventListener('click', dismissModal);
  if (btn2) btn2.addEventListener('click', dismissModal);

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  /* ==========================================================================
     3. SECTION 2: THE NEWSPAPER REVEAL
     Fast spin, locks at -35deg, then 2.0s delay, then reveals "بس لحظة...."
     ========================================================================== */
  const newspaperTL = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-newspaper',
      start: 'top 70%',
      toggleActions: 'play none none none'
    }
  });

  newspaperTL
    .fromTo('#img-newspaper',
      { rotation: 360, scale: 0.35, opacity: 0 },
      { rotation: -35, scale: 1, opacity: 1, duration: 0.95, ease: 'power3.out' }
    )
    .fromTo('#newspaper-text-box',
      { opacity: 0, y: 30, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(2)' },
      '+=2.0' // Exactly 2.0s delay after settling
    );

  /* ==========================================================================
     4. SECTION 3: NO CV NEEDED?!
     Text appears, image slides in from the right AFTER 1.0 second delay
     ========================================================================== */
  gsap.fromTo('.seq-item-3',
    { opacity: 0, y: 35 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#section-nocv',
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    }
  );

  gsap.fromTo('#img-reading-newspaper',
    { x: '100vw', opacity: 0 },
    {
      x: '0%',
      opacity: 1,
      duration: 1.1,
      delay: 1.0, // EXACTLY 1.0s delay
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#section-nocv',
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    }
  );

  /* ==========================================================================
     5. SECTION 4: DIALOGUE EVOLUTION (No box, Large Character)
     Character morphs, text evolves step-by-step
     ========================================================================== */
  const actorImg = document.getElementById('dialogue-actor-img');
  const phrase1 = document.querySelector('.s4-phrase-1');
  const phrase2 = document.querySelector('.s4-phrase-2');
  const phrase3 = document.querySelector('.s4-phrase-3');

  const s4TL = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-realization',
      start: 'top 65%',
      toggleActions: 'play none none none'
    }
  });

  s4TL
    // 1. Initial Actor (chibi-surprised) & Phrase 1
    .fromTo(actorImg,
      { scale: 0.5, opacity: 0, y: 30 },
      { scale: 1, opacity: 1, y: 0, duration: 0.75, ease: 'back.out(2)' }
    )
    .fromTo(phrase1,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
    // 2. Morph to chibi-excited & phrase 2
    .to(phrase1, {
      opacity: 0,
      y: -15,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        phrase1.classList.remove('active');
        phrase2.classList.add('active');
        if (actorImg) actorImg.src = './static/img/chibi-excited.png';
      }
    }, '+=1.8')
    .fromTo(actorImg,
      { scale: 0.88 },
      { scale: 1, duration: 0.45, ease: 'back.out(2)' }
    )
    .fromTo(phrase2,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
      '-=0.2'
    )
    // 3. Morph to chibi-shush & phrase 3
    .to(phrase2, {
      opacity: 0,
      y: -15,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        phrase2.classList.remove('active');
        phrase3.classList.add('active');
        if (actorImg) actorImg.src = './static/img/chibi-shush.png';
      }
    }, '+=1.8')
    .fromTo(actorImg,
      { scale: 0.88 },
      { scale: 1, duration: 0.45, ease: 'back.out(2)' }
    )
    .fromTo(phrase3,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
      '-=0.2'
    );

  /* ==========================================================================
     6. SECTION 5: INTRO - CLEAN DIALOGUE & GIANT FLYING SHOCKED REACTION
     After "احب الافكار الشاطحة اكثر", the giant reaction enters from left,
     passes across the character, and continues to right!
     ========================================================================== */
  const flyerGuy = document.getElementById('guy-shocked-flyer');

  const s5TL = gsap.timeline({
    scrollTrigger: {
      trigger: '#section-intro',
      start: 'top 65%',
      toggleActions: 'play none none none'
    }
  });

  s5TL
    // Character rises from bottom
    .fromTo('.character-bottom-giant',
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out' }
    )
    // Step 1: "انا محمد مطهر , مبرمج في مقتبل العمر"
    .to('.intro-step-1', {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power2.out'
    }, '+=0.5')
    // Step 2: "طيب وش بعدين؟ الشيء الجيد انا ماحب التزم بالافكار الي 67 مبرمج غيري سواها"
    .to('.intro-step-2', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power2.out'
    }, '+=1.4')
    // Step 3: "احب الافكار الشاطحة اكثر"
    .to('.intro-step-3', {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power2.out'
    }, '+=1.4')
    // GIANT SHOCKED REACTION FLYER: يدخل بعد توقف بما يكفي للقراءة
    .set(flyerGuy, { visibility: 'visible', opacity: 1 }, '+=1.0')
    .fromTo(flyerGuy,
      {
        xPercent: -150,
        x: '-25vw',
        y: 0,
        rotation: -10,
        scale: 0.85
      },
      {
        xPercent: 150,
        x: '125vw',
        y: -35,
        rotation: 12,
        scale: 1.15,
        duration: 2.3,
        ease: 'power1.inOut',
        onComplete: () => {
          gsap.set(flyerGuy, { visibility: 'hidden', opacity: 0 });
        }
      }
    );

  // Talking loop between me-talking-1 and me-talking-2 every 1.2s while visible
  const talkingImg = document.getElementById('talking-character-img');
  const introSection = document.getElementById('section-intro');
  const frame1 = './static/img/me-talking-1.png';
  const frame2 = './static/img/me-talking-2.png';
  let currentFrame = 1;
  let talkingInterval = null;

  const startTalking = () => {
    if (talkingInterval) return;
    talkingInterval = setInterval(() => {
      if (!talkingImg) return;
      currentFrame = currentFrame === 1 ? 2 : 1;
      talkingImg.src = currentFrame === 1 ? frame1 : frame2;
    }, 1200);
  };

  const stopTalking = () => {
    if (talkingInterval) {
      clearInterval(talkingInterval);
      talkingInterval = null;
    }
  };

  if (introSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startTalking();
        } else {
          stopTalking();
        }
      });
    }, { threshold: 0.2 });
    observer.observe(introSection);
  } else {
    startTalking();
  }

  /* ==========================================================================
     7. PINNED SHOWCASE SECTIONS (SECTIONS 6, 7, 8)
     Compact cards, side-sliding scroll carousel
     ========================================================================== */
  function createPinnedCardsTimeline(sectionId, pinWrapperId, stageId) {
    const stage = document.querySelector(stageId);
    if (!stage) return;
    const cards = gsap.utils.toArray(`${stageId} .slide-card`);
    if (cards.length === 0) return;

    cards.forEach((card, i) => {
      if (i === 0) {
        gsap.set(card, { xPercent: 0, opacity: 1, zIndex: 10 });
      } else {
        gsap.set(card, { xPercent: 130, opacity: 0, zIndex: 10 + i });
      }
    });

    const scrubTL = gsap.timeline({
      scrollTrigger: {
        trigger: sectionId,
        pin: pinWrapperId,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.85
      }
    });

    for (let i = 0; i < cards.length - 1; i++) {
      const currentCard = cards[i];
      const nextCard = cards[i + 1];

      scrubTL.to(currentCard, {
        xPercent: -130,
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut'
      });

      scrubTL.fromTo(nextCard,
        { xPercent: 130, opacity: 0 },
        { xPercent: 0, opacity: 1, duration: 1, ease: 'power2.inOut' },
        '<'
      );

      scrubTL.to({}, { duration: 0.55 });
    }

    // Extra hold buffer on the last card before unpinning
    scrubTL.to({}, { duration: 1.0 });
  }

  // Section 6: Crazy Projects (5 cards)
  createPinnedCardsTimeline('#section-crazy-projects', '#crazy-pin-wrapper', '#crazy-stage');

  // Section 7: Technical Majors (5 cards)
  createPinnedCardsTimeline('#section-majors', '#majors-pin-wrapper', '#majors-stage');

  // Section 8: Serious Projects (4 cards)
  createPinnedCardsTimeline('#section-serious-projects', '#serious-pin-wrapper', '#serious-stage');

  /* ==========================================================================
     8. TYPEWRITER EFFECT FOR SECTION 8 (SERIOUS PROJECTS)
     Types out heading automatically upon arriving at the section
     ========================================================================== */
  const typewriterTarget = document.getElementById('serious-typewriter-target');
  const typewriterCursor = document.getElementById('serious-typewriter-cursor');
  const fullTypewriterText = "اكيد بعد ما شفت البرمجيات او المشاريع الشاطحة الي فوق حسيت اني اسوقها";

  if (typewriterTarget) {
    let hasTyped = false;

    const startTyping = () => {
      if (hasTyped) return;
      hasTyped = true;

      let charIndex = 0;
      const speed = 36; // ms per character (~2.3s total)

      const typeNextChar = () => {
        if (charIndex < fullTypewriterText.length) {
          typewriterTarget.textContent += fullTypewriterText.charAt(charIndex);
          charIndex++;
          setTimeout(typeNextChar, speed);
        } else {
          // Keep cursor blinking for 2 seconds after typing completes, then hide
          setTimeout(() => {
            if (typewriterCursor) typewriterCursor.style.display = 'none';
          }, 2000);
        }
      };

      typeNextChar();
    };

    ScrollTrigger.create({
      trigger: '#section-serious-projects',
      start: 'top 75%',
      onEnter: startTyping,
      onToggle: (self) => {
        if (self.isActive && !hasTyped) startTyping();
      }
    });
  }
});
