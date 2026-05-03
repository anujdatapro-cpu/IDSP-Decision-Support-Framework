function initRevealOnScroll() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    if (!elements.length) return;

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
    );

    elements.forEach((el) => revealObserver.observe(el));
}

function initThemeToggle() {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('idFrameworkTheme');
    const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', initialTheme);

    const headerContainer = document.querySelector('.header .container');
    if (!headerContainer || document.querySelector('.theme-toggle')) return;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.innerHTML = '<i class="fas fa-moon"></i><span>Dark</span>';

    function syncToggle(theme) {
        const isDark = theme === 'dark';
        toggle.innerHTML = isDark
            ? '<i class="fas fa-sun"></i><span>Light</span>'
            : '<i class="fas fa-moon"></i><span>Dark</span>';
        toggle.setAttribute('aria-pressed', String(isDark));
    }

    syncToggle(initialTheme);
    headerContainer.insertBefore(toggle, headerContainer.querySelector('.mobile-menu-btn'));

    toggle.addEventListener('click', () => {
        const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', nextTheme);
        localStorage.setItem('idFrameworkTheme', nextTheme);
        syncToggle(nextTheme);
        window.dispatchEvent(new CustomEvent('id-theme-change', { detail: { theme: nextTheme } }));
    });
}

// Chat Assistant Interaction
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initRevealOnScroll();

    const chatContainer = document.querySelector('.chat-container');
    
    if (chatContainer) {
        chatContainer.addEventListener('click', function() {
            alert('Thank you for your interest! A team member will respond shortly.');
        });
    }

    // Video placeholder click handler
    const videoPlaceholder = document.querySelector('.video-placeholder');
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            alert('Video demo would play here. This is a prototype demonstration.');
        });
    }

    // Form submission handler
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your interest! This is a prototype. In the actual implementation, your data would be processed.');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation highlighting (exact file match; supports file:// on Windows)
    const rawPath = window.location.pathname || '';
    const segments = rawPath.replace(/\\/g, '/').split('/');
    let pageFile = segments.pop() || '';
    if (!pageFile && segments.length) pageFile = segments.pop() || '';
    const normalizedPage = !pageFile || pageFile === '' ? 'index.html' : pageFile;
    const navLinks = document.querySelectorAll('.navbar a');

    navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return;
        link.classList.remove('active');
        if (href === normalizedPage) {
            link.classList.add('active');
        }
    });

    initLegacyCardAnimations();
});

// Scroll effect for header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (!header) return;

    const darkShell =
        document.body.classList.contains('home-page') ||
        document.body.classList.contains('site-page') ||
        document.body.classList.contains('decision-tools-page');

    if (window.scrollY > 100) {
        header.style.boxShadow = darkShell
            ? '0 10px 32px rgba(0, 0, 0, 0.48)'
            : '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'none';
    }
});

// Form validation for the download form
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;

    const inputs = form.querySelectorAll('input[required]');
    for (let input of inputs) {
        if (!input.value.trim()) {
            alert('Please fill in all required fields');
            input.focus();
            return false;
        }
    }
    return true;
}

// Phone number formatting
const phoneInputs = document.querySelectorAll('input[type="tel"]');
phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 10) value = value.slice(0, 10);
        
        if (value.length > 5) {
            value = value.slice(0, 5) + '-' + value.slice(5);
        }
        e.target.value = value;
    });
});

function initLegacyCardAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const legacyAnimateSelector =
        '.approach-card:not(.reveal-on-scroll), .team-card:not(.reveal-on-scroll), .highlight-card:not(.reveal-on-scroll)';

    document.querySelectorAll(legacyAnimateSelector).forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        const legacyObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        legacyObserver.unobserve(entry.target);
                    }
                });
            },
            observerOptions
        );
        legacyObserver.observe(card);
    });
}
function calculateResources() {
    let size = document.getElementById("projectSize").value;
    let clarity = document.getElementById("requirementClarity").value;
    let exp = document.getElementById("teamExperience").value;

    let team, duration, cost;
    let dev, qa, pm = 1, ui = 1;

    if (size === "small") {
        team = "4-6";
        duration = "2-4 months";
        cost = "$20k-40k";
        dev = 3; qa = 1;
    } 
    else if (size === "medium") {
        team = "6-10";
        duration = "4-8 months";
        cost = "$60k-120k";
        dev = 5; qa = 2;
    } 
    else {
        team = "8-12";
        duration = "6-12 months";
        cost = "$120k-200k";
        dev = 6; qa = 2;
    }

    // Adjust based on experience
    if (exp === "novice") {
        duration = "Longer (" + duration + ")";
        qa += 1;
    }

    // Update UI
    document.getElementById("teamSize").innerText = team;
    document.getElementById("duration").innerText = duration;
    document.getElementById("cost").innerText = cost;

    document.getElementById("dev").innerText = dev;
    document.getElementById("qa").innerText = qa;
    document.getElementById("pm").innerText = pm;
    document.getElementById("ui").innerText = ui;

    drawChart(dev, qa, pm, ui);
}
function drawChart(dev, qa, pm, ui) {
    const ctx = document.getElementById('costChart');

    if (window.chart) {
        window.chart.destroy();
    }

    window.chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Developers', 'QA', 'PM', 'UI/UX'],
            datasets: [{
                data: [dev, qa, pm, ui],
                backgroundColor: ['#00ffcc', '#ff4d4d', '#3399ff', '#ffcc00']
            }]
        }
    });
}
const HEATMAP_CELL_IDS = [
  'high-low', 'high-medium', 'high-high',
  'med-low', 'med-medium', 'med-high',
  'low-low', 'low-medium', 'low-high'
];

const HEATMAP_SEVERITY_CLASSES = ['heatmap-sev-critical', 'heatmap-sev-high', 'heatmap-sev-medium', 'heatmap-sev-low'];

const HEATMAP_SDLC_CARD_SEVERITY = ['critical', 'high', 'medium', 'low'];

function clearHeatmap() {
  HEATMAP_CELL_IDS.forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    HEATMAP_SEVERITY_CLASSES.forEach(function (c) {
      el.classList.remove(c);
    });
    el.classList.remove('is-active');
    el.removeAttribute('aria-selected');
    const label = el.querySelector('.risk-heatmap-cell__label');
    if (label) label.textContent = '';
  });
}

function formatRiskTitleCase(upperRiskLabel) {
  return upperRiskLabel
    .toLowerCase()
    .replace(/\b\w/g, function (ch) {
      return ch.toUpperCase();
    });
}

function triggerHeatmapUpdateAnimation() {
  const root = document.getElementById('riskHeatmapDashboard');
  if (!root) return;
  root.classList.remove('risk-heatmap-dashboard--pulse');
  void root.offsetWidth;
  root.classList.add('risk-heatmap-dashboard--pulse');
}

function setHeatmapSdlcCardSeverity(severityKey) {
  const card = document.getElementById('heatmapSdlcCard');
  if (!card) return;
  HEATMAP_SDLC_CARD_SEVERITY.forEach(function (k) {
    card.classList.remove('risk-heatmap-sdlc-card--' + k);
  });
  if (HEATMAP_SDLC_CARD_SEVERITY.indexOf(severityKey) !== -1) {
    card.classList.add('risk-heatmap-sdlc-card--' + severityKey);
  }
}

/**
 * @param {string} probability - "High" | "Medium" | "Low"
 * @param {string} impact - "High" | "Medium" | "Low"
 * @param {string} [recommendedSdlcName] - from SDLC model match (optional)
 */
function generateHeatmap(probability, impact, recommendedSdlcName) {
  triggerHeatmapUpdateAnimation();
  clearHeatmap();

  let cellId = '';
  if (probability === 'High' && impact === 'High') cellId = 'high-high';
  else if (probability === 'High' && impact === 'Medium') cellId = 'high-medium';
  else if (probability === 'High' && impact === 'Low') cellId = 'high-low';
  else if (probability === 'Medium' && impact === 'High') cellId = 'med-high';
  else if (probability === 'Medium' && impact === 'Medium') cellId = 'med-medium';
  else if (probability === 'Medium' && impact === 'Low') cellId = 'med-low';
  else if (probability === 'Low' && impact === 'High') cellId = 'low-high';
  else if (probability === 'Low' && impact === 'Medium') cellId = 'low-medium';
  else if (probability === 'Low' && impact === 'Low') cellId = 'low-low';

  const cell = cellId ? document.getElementById(cellId) : null;

  let riskLabelUpper = '';
  let severityKey = 'low';
  let heatmapSevClass = 'heatmap-sev-low';
  let fallbackSdlc = 'Waterfall';

  if (probability === 'High' && impact === 'High') {
    riskLabelUpper = 'CRITICAL RISK';
    severityKey = 'critical';
    heatmapSevClass = 'heatmap-sev-critical';
    fallbackSdlc = 'Spiral';
  } else if (impact === 'High' || probability === 'High') {
    riskLabelUpper = 'HIGH RISK';
    severityKey = 'high';
    heatmapSevClass = 'heatmap-sev-high';
    fallbackSdlc = 'Agile';
  } else if (impact === 'Medium' || probability === 'Medium') {
    riskLabelUpper = 'MEDIUM RISK';
    severityKey = 'medium';
    heatmapSevClass = 'heatmap-sev-medium';
    fallbackSdlc = 'Incremental';
  } else {
    riskLabelUpper = 'LOW RISK';
    severityKey = 'low';
    heatmapSevClass = 'heatmap-sev-low';
    fallbackSdlc = 'Waterfall';
  }

  const cellLabelText = formatRiskTitleCase(riskLabelUpper);
  const sdlcDisplay = recommendedSdlcName || fallbackSdlc;

  if (cell) {
    cell.classList.add(heatmapSevClass, 'is-active');
    cell.setAttribute('aria-selected', 'true');
    const labelEl = cell.querySelector('.risk-heatmap-cell__label');
    if (labelEl) labelEl.textContent = cellLabelText;
  }

  setHeatmapSdlcCardSeverity(severityKey);

  const riskEyebrow = document.getElementById('heatmapRiskLabel');
  const sdlcTitle = document.getElementById('heatmapSdlcHint');
  const axesMeta = document.getElementById('heatmapAxesMeta');
  if (riskEyebrow) riskEyebrow.textContent = formatRiskTitleCase(riskLabelUpper);
  if (sdlcTitle) sdlcTitle.textContent = 'Recommended SDLC: ' + sdlcDisplay;
  if (axesMeta) {
    axesMeta.textContent = 'Probability: ' + probability + ' · Impact: ' + impact;
  }
}

/**
 * Maps aggregate risk score (0–100, higher = worse) to heatmap axes.
 * Used when only a single score is available.
 */
function updateHeatmapFromModel(riskScore) {
  let probability = 'Low';
  let impact = 'Low';

  if (riskScore >= 80) {
    probability = 'High';
    impact = 'High';
  } else if (riskScore >= 50) {
    probability = 'Medium';
    impact = 'High';
  } else if (riskScore >= 30) {
    probability = 'Medium';
    impact = 'Medium';
  } else {
    probability = 'Low';
    impact = 'Low';
  }

  generateHeatmap(probability, impact);
}
