/* ============================================================
   FABLOON – script.js
   Sections: Nav scroll, Reveal on scroll, FAQ accordion
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV SCROLL SHADOW ──────────────────────────────── */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });


  /* ── HERO BANNER AUTO-SLIDER ──────────────────────────── */
  const heroSlides = document.querySelectorAll('.hero__slide');
  const heroDots = document.querySelectorAll('.hero__dot');
  let currentSlide = 0;
  const slideInterval = 3000; // 3 seconds per slide
  let heroTimer;

  // Determine if mobile/tablet and set background images accordingly
  function isMobile() {
    return window.innerWidth <= 768;
  }

  function setSlideBackgrounds() {
    const mobile = isMobile();
    heroSlides.forEach(slide => {
      const imgSrc = mobile ? slide.dataset.mobile : slide.dataset.desktop;
      slide.style.backgroundImage = "url('" + encodeURI(imgSrc) + "')";
    });
  }

  // Set backgrounds on load
  setSlideBackgrounds();

  // Update on resize (mobile ↔ desktop switch)
  window.addEventListener('resize', setSlideBackgrounds);

  function goToSlide(index) {
    heroSlides[currentSlide].classList.remove('active');
    heroDots[currentSlide].classList.remove('active');
    currentSlide = index;
    heroSlides[currentSlide].classList.add('active');
    heroDots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    const next = (currentSlide + 1) % heroSlides.length;
    goToSlide(next);
  }

  // Auto-play
  function startAutoSlide() {
    heroTimer = setInterval(nextSlide, slideInterval);
  }

  // Dot click navigation
  heroDots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(heroTimer);
      goToSlide(parseInt(dot.dataset.slide));
      startAutoSlide();
    });
  });

  // Pause on hover, resume on leave
  const heroSection = document.getElementById('hero');
  heroSection.addEventListener('mouseenter', () => clearInterval(heroTimer));
  heroSection.addEventListener('mouseleave', startAutoSlide);

  startAutoSlide();


  /* ── SCROLL REVEAL ──────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── FAQ ACCORDION ──────────────────────────────────── */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-item__q');
    const answer = item.querySelector('.faq-item__a');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all
      faqItems.forEach(i => {
        i.querySelector('.faq-item__q').setAttribute('aria-expanded', 'false');
        i.querySelector('.faq-item__a').classList.remove('open');
      });

      // Open clicked if was closed
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        answer.classList.add('open');
      }
    });
  });


  /* ── STEP CARD AUTO-CYCLE + CLICK ─────────────────────── */
  const stepCards = document.querySelectorAll('.step-card');
  let activeStep = 2; // starts on index 2 (step 3)
  let stepTimer;

  function goToStep(index) {
    stepCards.forEach(c => c.classList.remove('step-card--active'));
    activeStep = index;
    stepCards[activeStep].classList.add('step-card--active');
  }

  function nextStep() {
    goToStep((activeStep + 1) % stepCards.length);
  }

  function startStepCycle() {
    stepTimer = setInterval(nextStep, 2500);
  }

  stepCards.forEach((card, i) => {
    card.addEventListener('click', () => {
      clearInterval(stepTimer);
      goToStep(i);
      startStepCycle();
    });
  });

  // Pause on hover over the steps section
  const stepsSection = document.getElementById('steps');
  stepsSection.addEventListener('mouseenter', () => clearInterval(stepTimer));
  stepsSection.addEventListener('mouseleave', startStepCycle);

  startStepCycle();


  /* ── TESTIMONIALS SLIDER ──────────────────────────────── */
  const testiTrack = document.getElementById('testimonialTrack');
  const testiCards = testiTrack.querySelectorAll('.testi-card');
  const testiPrev = document.getElementById('testiPrev');
  const testiNext = document.getElementById('testiNext');
  let testiIndex = 0;

  function getCardsPerView() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, testiCards.length - getCardsPerView());
  }

  function updateTestiSlider() {
    const cardsPerView = getCardsPerView();
    const gap = 24;
    const sliderWidth = testiTrack.parentElement.clientWidth;
    const cardWidth = (sliderWidth - gap * (cardsPerView - 1)) / cardsPerView;

    // Set each card's width so exactly 3 (or 2/1) cards fill the view
    testiCards.forEach(function (card) {
      card.style.width = cardWidth + 'px';
      card.style.minWidth = cardWidth + 'px';
    });

    const offset = testiIndex * (cardWidth + gap);
    testiTrack.style.transform = 'translateX(-' + offset + 'px)';

    // Update button states
    testiPrev.disabled = testiIndex <= 0;
    testiNext.disabled = testiIndex >= getMaxIndex();
  }

  testiPrev.addEventListener('click', () => {
    if (testiIndex > 0) {
      testiIndex--;
      updateTestiSlider();
    }
  });

  testiNext.addEventListener('click', () => {
    if (testiIndex < getMaxIndex()) {
      testiIndex++;
      updateTestiSlider();
    }
  });

  // Recalculate on resize
  window.addEventListener('resize', () => {
    if (testiIndex > getMaxIndex()) testiIndex = getMaxIndex();
    updateTestiSlider();
  });

  updateTestiSlider();


  /* ── FORM SUBMIT HANDLER ────────────────────────────── */
  window.handleSubmit = function () {
    const fields = document.querySelectorAll('.form-field');
    let allFilled = true;

    fields.forEach(f => {
      if (f.hasAttribute('placeholder') && f.placeholder.includes('*') && !f.value.trim()) {
        f.style.borderColor = '#e05555';
        allFilled = false;
      } else {
        f.style.borderColor = '';
      }
    });

    if (allFilled) {
      const btn = document.querySelector('.btn--submit');
      btn.textContent = "Thank You! We'll be in touch.";
      btn.style.background = '#4CAF50';
      btn.style.color = '#fff';
      btn.disabled = true;
      fields.forEach(f => f.value = '');
    }
  };


  /* ── MARQUEE DUPLICATE (ensure seamless loop) ───────── */
  const track = document.querySelector('.marquee-track');
  if (track) {
    const span = track.querySelector('span');
    // Clone for seamless infinite scroll
    const clone = span.cloneNode(true);
    track.appendChild(clone);
  }

});
