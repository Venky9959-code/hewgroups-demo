/**
 * HEW GROUPS - Health, Education, Wealth
 * Modern Animation & Interactive Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initAnimatedCounters();
  initHeaderScroll();
  initMobileMenu();
  initCountdown();
  initFaqAccordion();
  initAssessmentCalculator();
  initRegistrationForms();
  initModalHandlers();
  initDynamicDates();
  initButtonRipple();
  initPillarStationedBalloons();
  initAijugaadTextTransition();
  initVideoMarqueeEngine();
});

/* ==========================================================================
   1. SCROLL REVEAL ENGINE (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (!('IntersectionObserver' in window)) {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   2. ANIMATED NUMBER COUNTERS (On Viewport Entry)
   ========================================================================== */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('[data-counter]');
  if (!counterElements.length) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counterElements.forEach(el => counterObserver.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-counter')) || 0;
  const prefix = el.getAttribute('data-prefix') || '';
  const suffix = el.getAttribute('data-suffix') || '';
  const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
  const duration = 1800;
  const startTime = performance.now();

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutCubic(progress);
    const currentVal = (target * easedProgress).toFixed(decimals);

    el.textContent = `${prefix}${formatNumber(currentVal)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = `${prefix}${formatNumber(target.toFixed(decimals))}${suffix}`;
    }
  }

  requestAnimationFrame(step);
}

function formatNumber(numStr) {
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

/* ==========================================================================
   3. DYNAMIC DATES & SCHEDULE
   ========================================================================== */
function initDynamicDates() {
  const dateElements = document.querySelectorAll('.dynamic-session-date');
  const monthElements = document.querySelectorAll('.dynamic-session-month');

  const now = new Date();
  let targetDate = new Date();

  const dayOfWeek = now.getDay();
  let daysUntilTarget = (6 - dayOfWeek + 7) % 7;
  if (daysUntilTarget === 0) daysUntilTarget = 1;
  targetDate.setDate(now.getDate() + daysUntilTarget);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDay = getOrdinalNum(targetDate.getDate()) + ' ' + months[targetDate.getMonth()].slice(0, 3);
  const fullMonth = months[targetDate.getMonth()];

  dateElements.forEach(el => el.textContent = formattedDay);
  monthElements.forEach(el => el.textContent = fullMonth);
}

function getOrdinalNum(n) {
  return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
}

/* ==========================================================================
   4. LIVE COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  if (!hoursEl || !minsEl || !secsEl) return;

  let targetTime = sessionStorage.getItem('hew_countdown_target');
  if (!targetTime) {
    targetTime = Date.now() + (5 * 3600 + 42 * 60 + 19) * 1000;
    sessionStorage.setItem('hew_countdown_target', targetTime);
  } else {
    targetTime = parseInt(targetTime, 10);
  }

  function update() {
    const diff = targetTime - Date.now();
    if (diff <= 0) {
      targetTime = Date.now() + 3 * 3600 * 1000;
      sessionStorage.setItem('hew_countdown_target', targetTime);
    }

    const totalSecs = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;

    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent = String(m).padStart(2, '0');
    secsEl.textContent = String(s).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   5. STICKY HEADER & SCROLL SPY
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let currentId = '';
    const scrollPos = window.scrollY + 220;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   6. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-drawer .nav-link, .mobile-drawer button');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.toggle('open');
    const isOpen = drawer.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
  });

  mobileLinks.forEach(item => {
    item.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`;
    });
  });
}

/* ==========================================================================
   7. INTERACTIVE HEW SCORE CALCULATOR (With Animated Radial Meter)
   ========================================================================== */
function initAssessmentCalculator() {
  const sliderH = document.getElementById('slider-health');
  const sliderE = document.getElementById('slider-education');
  const sliderW = document.getElementById('slider-wealth');

  const valH = document.getElementById('val-health');
  const valE = document.getElementById('val-education');
  const valW = document.getElementById('val-wealth');

  const scoreEl = document.getElementById('overall-hew-score');
  const circleBar = document.getElementById('score-circle-bar');
  const verdictTitle = document.getElementById('assessment-verdict-title');
  const verdictDesc = document.getElementById('assessment-verdict-desc');
  const applyScoreBtn = document.getElementById('btn-apply-score');

  if (!sliderH || !sliderE || !sliderW) return;

  let currentDisplayedScore = 62;

  function updateSliderFill(slider, color) {
    const min = slider.min || 1;
    const max = slider.max || 10;
    const val = slider.value;
    const percentage = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, ${color} 0%, ${color} ${percentage}%, rgba(255, 255, 255, 0.12) ${percentage}%, rgba(255, 255, 255, 0.12) 100%)`;
  }

  function smoothCountTo(targetScore) {
    const start = currentDisplayedScore;
    const diff = targetScore - start;
    if (diff === 0) return;
    const duration = 400;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 2);
      const val = Math.round(start + diff * ease);
      scoreEl.textContent = val;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        currentDisplayedScore = targetScore;
        scoreEl.textContent = targetScore;
      }
    }
    requestAnimationFrame(step);
  }

  function recalculate() {
    const h = parseInt(sliderH.value, 10);
    const e = parseInt(sliderE.value, 10);
    const w = parseInt(sliderW.value, 10);

    valH.textContent = `${h}/10`;
    valE.textContent = `${e}/10`;
    valW.textContent = `${w}/10`;

    updateSliderFill(sliderH, 'var(--health)');
    updateSliderFill(sliderE, 'var(--education)');
    updateSliderFill(sliderW, 'var(--wealth)');

    const average = (h + e + w) / 3;
    const minVal = Math.min(h, e, w);
    const balancePenalty = (average - minVal) * 1.5;
    const rawScore = Math.round(((average * 10) - balancePenalty));
    const finalScore = Math.max(10, Math.min(98, rawScore));

    smoothCountTo(finalScore);

    // Update Radial SVG bar stroke:
    // circumference of circle r=55 is 2 * PI * 55 ~= 345.57
    if (circleBar) {
      const circumference = 345.57;
      const offset = circumference - (finalScore / 100) * circumference;
      circleBar.style.strokeDashoffset = offset;

      if (finalScore >= 80) {
        circleBar.style.stroke = 'var(--health)';
      } else if (finalScore >= 50) {
        circleBar.style.stroke = 'var(--primary)';
      } else {
        circleBar.style.stroke = 'var(--wealth)';
      }
    }

    if (minVal === h && h < 6) {
      verdictTitle.textContent = "Your Biggest Area to Improve: Health & Daily Energy";
      verdictDesc.textContent = "Your goals are being slowed down by low energy or poor sleep. Learning simple daily sleep and nutrition habits will give you the stamina you need to do your best work.";
      verdictTitle.style.color = "var(--health-light)";
    } else if (minVal === e && e < 6) {
      verdictTitle.textContent = "Your Biggest Area to Improve: High-Demand Skills";
      verdictDesc.textContent = "You work hard, but your skills are not earning you what you deserve. Learning in-demand digital skills and easy AI tools will help you grow your income much faster.";
      verdictTitle.style.color = "var(--education-light)";
    } else if (minVal === w && w < 6) {
      verdictTitle.textContent = "Your Biggest Area to Improve: Income, Real Estate & Savings";
      verdictDesc.textContent = "You have great energy and drive, but you still rely on only one paycheck. Learning how to build extra income streams and invest in real estate assets will give you true financial peace of mind.";
      verdictTitle.style.color = "var(--wealth-light)";
    } else {
      verdictTitle.textContent = "Great Job: You Have A Solid Foundation!";
      verdictDesc.textContent = "You already have good habits and skills across Health, Education, and Wealth. In this masterclass, Coach Sreenivas Paturi will show you how to take everything to the next level.";
      verdictTitle.style.color = "#ffffff";
    }
  }

  [sliderH, sliderE, sliderW].forEach(input => {
    input.addEventListener('input', recalculate);
  });

  recalculate();

  if (applyScoreBtn) {
    applyScoreBtn.addEventListener('click', () => {
      openBookingModal();
    });
  }
}

/* ==========================================================================
   8. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      faqItems.forEach(other => {
        other.classList.remove('active');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   9. REGISTRATION & VIP PASS ISSUANCE
   ========================================================================== */
function initRegistrationForms() {
  const mainForm = document.getElementById('main-register-form');

  if (mainForm) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmission(mainForm);
    });
  }
}

// ==========================================================================
// RAZORPAY PAYMENT CONFIGURATION
// Live Key ID: rzp_live_TrmHqpHyg2ZHZJ
// (Live Secret Key: u4usNRIV0EZpUAIYRHEriNXm - reserved for server-side verification)
// ==========================================================================
const RAZORPAY_CONFIG = {
  key: 'rzp_live_TrmHqpHyg2ZHZJ', // Razorpay Live Key ID
  amount: 14900, // ₹149 in paise (149 * 100)
  currency: 'INR',
  name: 'HEW Groups',
  description: 'Batch #1 Live Transformation Masterclass Access',
  image: 'assets/logo/HEW-Groups_32x32.png',
  theme: {
    color: '#096410'
  }
};

function ensureRazorpayLoaded() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function handleFormSubmission(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalHtml = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = `<span>Connecting to Razorpay...</span>`;

  const formData = new FormData(form);
  const name = formData.get('name') || 'Member';
  const phone = formData.get('phone') || '+91 98765 43210';
  const email = formData.get('email') || 'member@example.com';
  const focus = formData.get('focus') || 'Health, Education & Wealth';

  await ensureRazorpayLoaded();

  // If user hasn't set their key yet, provide seamless test simulation
  if (!window.Razorpay || RAZORPAY_CONFIG.key === 'rzp_test_YOUR_KEY_HERE') {
    console.info('[HEW Groups] Razorpay Key pending. Update RAZORPAY_CONFIG.key in js/main.js with your Razorpay key.');
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
      form.reset();

      showConfirmationTicket({
        name,
        phone,
        email,
        focus,
        ticketId: 'HEW-' + Math.floor(100000 + Math.random() * 900000),
        paymentId: 'pay_' + Math.random().toString(36).substring(2, 12).toUpperCase(),
        amountPaid: '₹149'
      });
    }, 900);
    return;
  }

  // Live/Test Razorpay Checkout integration
  const options = {
    key: RAZORPAY_CONFIG.key,
    amount: RAZORPAY_CONFIG.amount,
    currency: RAZORPAY_CONFIG.currency,
    name: RAZORPAY_CONFIG.name,
    description: RAZORPAY_CONFIG.description,
    image: RAZORPAY_CONFIG.image,
    prefill: {
      name: name,
      email: email,
      contact: phone
    },
    notes: {
      focus_area: focus,
      batch: 'Batch #1'
    },
    theme: RAZORPAY_CONFIG.theme,
    handler: function (response) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
      form.reset();

      showConfirmationTicket({
        name,
        phone,
        email,
        focus,
        ticketId: 'HEW-' + Math.floor(100000 + Math.random() * 900000),
        paymentId: response.razorpay_payment_id,
        amountPaid: '₹149'
      });
    },
    modal: {
      ondismiss: function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
      }
    }
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
      alert('Payment could not be completed: ' + (response.error.description || 'Please try again.'));
    });
    rzp.open();
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHtml;
    console.error('Razorpay invocation error:', err);
  }
}

function showConfirmationTicket(data) {
  const modal = document.getElementById('booking-modal') || document.getElementById('bookingModal');
  if (!modal) return;

  let modalBody = document.getElementById('modal-body-content');
  if (!modalBody) {
    const container = modal.querySelector('.modal-container') || modal.querySelector('.modal-content');
    if (container) {
      modalBody = container.querySelector('#modal-body-content');
      if (!modalBody) {
        modalBody = document.createElement('div');
        modalBody.id = 'modal-body-content';
        container.appendChild(modalBody);
      }
    }
  }

  if (!modalBody) return;

  modalBody.innerHTML = `
    <div style="text-align: center;">
      <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(9, 100, 16, 0.12); border: 1.5px solid var(--health); color: var(--health); display: grid; place-items: center; margin: 0 auto 1.25rem auto;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <span style="font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; color: var(--health); text-transform: uppercase;">Payment Confirmed</span>
      <h3 style="font-family: var(--font-heading); font-size: 1.85rem; color: var(--text-main); margin-top: 0.35rem; font-weight: 700;">VIP Access Pass Issued</h3>
      <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 0.35rem;">Welcome, <strong>${escapeHtml(data.name)}</strong>. Your payment of <strong>${data.amountPaid || '₹149'}</strong> is confirmed.</p>
    </div>

    <div class="ticket-preview">
      <div class="ticket-header">
        <div>
          <strong style="color: var(--text-main); font-family: var(--font-heading); font-size: 1.05rem; letter-spacing: 0.02em;">HEW Groups · Cohort #1</strong>
          <span style="display: block; font-size: 0.72rem; color: var(--text-dim); margin-top: 2px;">Lead Coach: Sreenivas Paturi</span>
        </div>
        <div class="ticket-id" style="color: var(--primary);">${data.ticketId}</div>
      </div>
      <div class="ticket-detail-row">
        <div>
          <span>ATTENDEE</span>
          <strong>${escapeHtml(data.name)}</strong>
        </div>
        <div>
          <span>FOCUS AREA</span>
          <strong>${escapeHtml(data.focus)}</strong>
        </div>
        <div>
          <span>WHATSAPP</span>
          <strong>${escapeHtml(data.phone)}</strong>
        </div>
        <div>
          <span>PAYMENT STATUS</span>
          <strong style="color: var(--health);">Paid ${data.amountPaid || '₹149'}</strong>
          <span style="display: block; font-size: 0.72rem; color: var(--text-dim); margin-top: 2px; word-break: break-all;">Ref: ${escapeHtml(data.paymentId || 'Confirmed')}</span>
        </div>
      </div>
    </div>

    <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1.5rem;">
      <a href="https://chat.whatsapp.com/" target="_blank" rel="noopener" class="btn-primary" style="background: #25D366; box-shadow: 0 10px 25px rgba(37, 211, 102, 0.35); text-align: center; border: none;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
        Join Batch #1 VIP WhatsApp Group
      </a>
      <button id="btn-add-calendar" class="btn-secondary" style="width: 100%;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        Add to Calendar
      </button>
    </div>
  `;

  modal.classList.add('open');

  const calBtn = document.getElementById('btn-add-calendar');
  if (calBtn) {
    calBtn.addEventListener('click', () => {
      const title = encodeURIComponent("HEW Groups - Health, Education & Wealth Live Masterclass");
      const details = encodeURIComponent("Batch #1 Live Transformation Masterclass with Coach Sreenivas Paturi at HEW Groups. Zoom access link sent to WhatsApp.");
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=Zoom`;
      window.open(gcalUrl, '_blank');
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}

/* ==========================================================================
   10. MODAL DIALOG CONTROLS
   ========================================================================== */
function initModalHandlers() {
  const modal = document.getElementById('booking-modal') || document.getElementById('bookingModal');
  const closeBtn = document.getElementById('modal-close-btn') || document.getElementById('modalCloseBtn') || (modal ? modal.querySelector('.modal-close-btn') : null);
  const openTriggers = document.querySelectorAll('.trigger-booking-modal');

  if (!modal) return;

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('open');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('.modal-close-btn')) {
      modal.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      modal.classList.remove('open');
    }
  });
}

function openBookingModal() {
  const modal = document.getElementById('booking-modal') || document.getElementById('bookingModal');
  if (!modal) return;
  let modalBody = document.getElementById('modal-body-content');
  if (!modalBody) {
    const container = modal.querySelector('.modal-container') || modal.querySelector('.modal-content');
    if (container) {
      modalBody = container.querySelector('#modal-body-content');
      if (!modalBody) {
        modalBody = document.createElement('div');
        modalBody.id = 'modal-body-content';
        container.appendChild(modalBody);
      }
    }
  }
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="form-header" style="margin-bottom: 1.5rem; text-align: left;">
      <span class="sub-tag">HEW Groups · Cohort #1</span>
      <h3 style="font-size: 1.85rem; font-weight: 700;">Reserve Your Live Seat</h3>
      <p style="color: var(--text-muted); font-size: 0.875rem; margin-top: 0.25rem;">
        Complete details below to confirm your seat via secure Razorpay checkout.
      </p>
    </div>

    <form id="modal-register-form" class="form-grid">
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" name="name" required placeholder="Enter your full name">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>WhatsApp Number</label>
          <input type="tel" name="phone" required placeholder="+91 98765 43210">
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" name="email" required placeholder="you@email.com">
        </div>
      </div>
      <div class="form-group">
        <label>Primary Focus Area</label>
        <select name="focus" required>
          <option value="Complete Transformation (All 3)" selected>Complete Transformation (H + E + W)</option>
          <option value="Health (Energy, Stamina & Longevity)">Health &amp; Bio-Optimization</option>
          <option value="Education (Modern High-Income Skills)">Education &amp; Skill Architecture</option>
          <option value="Wealth (Cashflow, Real Estate & Compounding)">Wealth, Real Estate &amp; Passive Portfolios</option>
        </select>
      </div>
      <button type="submit" id="btn-razorpay-submit" class="btn-primary" style="width: 100%; margin-top: 0.75rem; height: 54px; font-size: 1.05rem; display: flex; align-items: center; justify-content: center; gap: 8px;">
        <span><s style="opacity: 0.65; margin-right: 6px; text-decoration: line-through;">₹499</s> <strong>Pay ₹149/-</strong></span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
      <p class="form-note" style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 0.65rem;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        100% Secure Checkout via Razorpay · Instant Session Access
      </p>
    </form>
  `;

  const newForm = document.getElementById('modal-register-form');
  if (newForm) {
    newForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmission(newForm);
    });
  }

  modal.classList.add('open');
}

/* ==========================================================================
   11. BUTTON RIPPLE EFFECT
   ========================================================================== */
function initButtonRipple() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;

      const rect = btn.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.style.position = 'absolute';
      circle.style.borderRadius = '50%';
      circle.style.background = 'rgba(255, 255, 255, 0.25)';
      circle.style.transform = 'scale(0)';
      circle.style.animation = 'ripple 0.55s ease-out';
      circle.style.pointerEvents = 'none';

      const existing = btn.querySelector('.ripple-effect');
      if (existing) existing.remove();

      circle.classList.add('ripple-effect');
      btn.appendChild(circle);

      setTimeout(() => circle.remove(), 600);
    });
  });
}

/* ==========================================================================
   12. STATIONED PILLAR BALLOONS HOVER INTERACTION
   ========================================================================== */
function initPillarStationedBalloons() {
  const video = document.querySelector('.hero-bg-video');
  if (video) {
    const handleVideoActive = () => video.classList.add('is-active');
    video.addEventListener('playing', handleVideoActive);
    video.addEventListener('canplay', () => {
      video.play().then(handleVideoActive).catch(() => { });
    });
    video.play().catch(() => { });
  }

  const cards = document.querySelectorAll('.ecosystem-hub-card');
  cards.forEach(card => {
    const balloon = card.querySelector('.pillar-stationed-balloon');
    if (!balloon) return;

    card.addEventListener('mouseenter', () => {
      balloon.style.animation = 'none';
      void balloon.offsetWidth;
      balloon.style.animation = 'balloonHoverPlay 1s ease-in-out infinite alternate';
    });

    card.addEventListener('mouseleave', () => {
      balloon.style.animation = 'none';
      void balloon.offsetWidth;
      balloon.style.animation = 'balloonFloatBob 3.6s ease-in-out infinite alternate';
    });
  });
}

/* ==========================================================================
   AIJUGAAD TEXT TRANSITION ENGINE (Exact "We Are Chefs" Roll & Flip - Staggered)
   ========================================================================== */
function initAijugaadTextTransition() {
  const wordsContainer = document.querySelector('.aijugaad-words-container');
  const singleContainer = document.querySelector('.aijugaad-text-rotator');

  if (wordsContainer) {
    const slots = wordsContainer.querySelectorAll('.aijugaad-word-slot');
    if (!slots.length) return;

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function runWordStagger(initial = false) {
      slots.forEach((slot, idx) => {
        const enterEl = slot.querySelector('.aijugaad-word-enter');
        const exitEl = slot.querySelector('.aijugaad-word-exit');
        if (!enterEl) return;

        const text = enterEl.innerHTML;
        const delaySec = parseFloat(slot.getAttribute('data-delay')) || (idx * 0.18);
        const animDelay = delaySec * 1000;

        const animOptions = {
          duration: 700,
          delay: animDelay,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'both'
        };

        if (initial) {
          enterEl.animate([
            { transform: 'translateY(115%) rotate(3deg)', opacity: 0 },
            { transform: 'none', opacity: 1 }
          ], animOptions);
        } else if (exitEl) {
          exitEl.innerHTML = text;
          enterEl.innerHTML = text;

          enterEl.animate([
            { transform: 'translateY(115%) rotate(3deg)', opacity: 0 },
            { transform: 'none', opacity: 1 }
          ], animOptions);

          const exitAnim = exitEl.animate([
            { transform: 'none', opacity: 1 },
            { transform: 'translateY(-115%) rotate(-3deg)', opacity: 0 }
          ], animOptions);

          exitAnim.onfinish = () => {
            exitEl.innerHTML = '';
          };
        }
      });
    }

    // Initial page load staggered roll
    if (!isReducedMotion) {
      runWordStagger(true);
    }

    // Periodic roll one after another (cycle every 3.2s)
    setInterval(() => {
      if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      runWordStagger(false);
    }, 3200);

    return;
  }

  if (singleContainer) {
    const enterEl = singleContainer.querySelector('.aijugaad-text-enter');
    const exitEl = singleContainer.querySelector('.aijugaad-text-exit');
    if (!enterEl || !exitEl) return;

    const text = enterEl.innerHTML;
    const animOptions = {
      duration: 700,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'both'
    };

    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isReducedMotion) {
      enterEl.animate([
        { transform: 'translateY(115%) rotate(3deg)', opacity: 0 },
        { transform: 'none', opacity: 1 }
      ], animOptions);
    }

    setInterval(() => {
      if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      exitEl.innerHTML = text;
      enterEl.innerHTML = text;

      enterEl.animate([
        { transform: 'translateY(115%) rotate(3deg)', opacity: 0 },
        { transform: 'none', opacity: 1 }
      ], animOptions);

      const exitAnim = exitEl.animate([
        { transform: 'none', opacity: 1 },
        { transform: 'translateY(-115%) rotate(-3deg)', opacity: 0 }
      ], animOptions);

      exitAnim.onfinish = () => {
        exitEl.innerHTML = '';
      };
    }, 2800);
  }
}

/* ==========================================================================
   COMMUNITY VIDEO MARQUEE ENGINE (Review Layout Reels + Hover/Select Unmute)
   ========================================================================== */
function initVideoMarqueeEngine() {
  const container = document.querySelector('.video-marquee-container');
  if (!container) return;

  const cards = container.querySelectorAll('.video-showcase-card');
  const allVideos = container.querySelectorAll('.showcase-video');
  let selectedCard = null;

  function updateAudioButton(card, isUnmuted) {
    const btn = card.querySelector('.video-volume-btn');
    if (!btn) return;
    const mutedIcon = btn.querySelector('.vol-icon-muted');
    const activeIcon = btn.querySelector('.vol-icon-active');

    if (isUnmuted) {
      btn.classList.add('is-active');
      if (mutedIcon) mutedIcon.style.display = 'none';
      if (activeIcon) activeIcon.style.display = 'block';
    } else {
      btn.classList.remove('is-active');
      if (mutedIcon) mutedIcon.style.display = 'block';
      if (activeIcon) activeIcon.style.display = 'none';
    }
  }

  // High-performance lazy playback: only stream/play videos when approaching viewport
  let videosInitialized = false;
  function startPlayback() {
    if (videosInitialized) return;
    videosInitialized = true;

    allVideos.forEach(v => {
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback: start playback on first touch/interaction if browser blocked autoplay
          const startOnInteract = () => {
            v.play().catch(() => {});
            window.removeEventListener('pointerdown', startOnInteract);
            window.removeEventListener('touchstart', startOnInteract);
          };
          window.addEventListener('pointerdown', startOnInteract, { once: true });
          window.addEventListener('touchstart', startOnInteract, { once: true });
        });
      }

      // Safety restart to guarantee continuous start-to-end loop
      v.addEventListener('ended', () => {
        v.currentTime = 0;
        v.play().catch(() => {});
      });
    });
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startPlayback();
          allVideos.forEach(v => v.play().catch(() => {}));
        } else if (videosInitialized) {
          // Pause when completely offscreen to save battery and network bandwidth
          allVideos.forEach(v => v.pause());
        }
      });
    }, { rootMargin: '300px 0px' });
    observer.observe(container);
  } else {
    startPlayback();
  }

  function muteAllExcept(targetCard) {
    cards.forEach(c => {
      if (c !== targetCard) {
        const vid = c.querySelector('.showcase-video');
        if (vid) {
          vid.muted = true;
        }
        c.classList.remove('is-active-sound');
        updateAudioButton(c, false);
      }
    });
  }

  function unmuteCard(card) {
    muteAllExcept(card);
    const video = card.querySelector('.showcase-video');
    if (video) {
      video.muted = false;
      video.volume = 1.0;
      video.play().catch(() => {});
      card.classList.add('is-active-sound');
      updateAudioButton(card, true);
    }
  }

  function muteCard(card) {
    const video = card.querySelector('.showcase-video');
    if (video) {
      video.muted = true;
    }
    card.classList.remove('is-active-sound');
    updateAudioButton(card, false);
  }

  function muteAll() {
    selectedCard = null;
    cards.forEach(c => muteCard(c));
  }

  cards.forEach(card => {
    // Hover: play with sound for this card only (unless another is actively locked)
    card.addEventListener('mouseenter', () => {
      if (!selectedCard || selectedCard === card) {
        unmuteCard(card);
      }
    });

    // Leave: mute sound again unless explicitly selected
    card.addEventListener('mouseleave', () => {
      if (!selectedCard) {
        muteCard(card);
      } else if (selectedCard !== card) {
        muteCard(card);
      }
    });

    // Click / Select: particularly select this video to listen
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const video = card.querySelector('.showcase-video');
      if (!video) return;

      if (selectedCard === card && !video.muted) {
        // Deselect & mute
        selectedCard = null;
        muteCard(card);
      } else {
        // Select particularly & turn sound on
        selectedCard = card;
        unmuteCard(card);
      }
    });

    // Handle clicking the circular audio button directly
    const volBtn = card.querySelector('.video-volume-btn');
    if (volBtn) {
      volBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.click();
      });
    }

    // Keyboard support: Enter or Space
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Click outside: deselect and mute all videos
  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      muteAll();
    }
  });

  // Mute all when leaving the tab / browser window
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      muteAll();
    }
  });
  window.addEventListener('blur', () => {
    muteAll();
  });
}
