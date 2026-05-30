/* ==========================================================================
   NAVIGATION & SCROLL EFFECTS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // 1. Header scroll state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 3. Scrollspy - Highlight active nav links on scroll
    const scrollspyOptions = {
        threshold: 0.25,
        rootMargin: '0px 0px -20% 0px'
    };

    const scrollspyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, scrollspyOptions);

    sections.forEach(section => {
        scrollspyObserver.observe(section);
    });

    // 4. Unified Canvas Premium Environmental Cursor Response (Affects only light trails, never the static image)
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalize coordinates from -0.5 to 0.5
            const mx = (x / rect.width) - 0.5;
            const my = (y / rect.height) - 0.5;
            
            // Drive custom properties for environmental layers (like streaks) without affecting the static visual image
            heroSection.style.setProperty('--mx', mx);
            heroSection.style.setProperty('--my', my);
        });
        
        heroSection.addEventListener('mouseleave', () => {
            heroSection.style.setProperty('--mx', '0');
            heroSection.style.setProperty('--my', '0');
        });
    }

    // 5. Staggered Scroll Animation for "How I Help" steps
    const steps = document.querySelectorAll('.step-card');
    const complexityCard = document.querySelector('.complexity-card');
    
    if (complexityCard && steps.length > 0) {
        const stepsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    steps.forEach((step, index) => {
                        setTimeout(() => {
                            step.classList.add('revealed');
                        }, index * 180); // Stagger by 180ms per card
                    });
                    stepsObserver.disconnect(); // Animate once
                }
            });
        }, { threshold: 0.15 });

        stepsObserver.observe(complexityCard);
    }

    // Initialize Vector Robot Mascot Tracking
    initMascotTracking();
});

/* ==========================================================================
   MODAL DRAWER SYSTEMS LOGIC & DATA
   ========================================================================== */
// General Contact Modal Toggle
function openContactModal(prefillTopic = '') {
    const modal = document.getElementById('contactModal');
    modal.classList.add('active');
    
    if (prefillTopic) {
        const select = document.getElementById('projectType');
        select.value = prefillTopic;
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.remove('active');
    const feedback = document.getElementById('formFeedback');
    feedback.classList.add('hidden');
}

// Simulated Contact Form API Submit Handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('span:first-child');
    const loader = submitBtn.querySelector('.loader');
    const feedback = document.getElementById('formFeedback');
    
    btnText.classList.add('hidden');
    loader.classList.remove('hidden');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        btnText.classList.remove('hidden');
        loader.classList.add('hidden');
        submitBtn.disabled = false;
        
        feedback.className = "form-feedback success";
        feedback.innerHTML = "✦ <strong>Webhook Triggered:</strong> Integration request queued successfully! Akhil will contact you shortly.";
        feedback.classList.remove('hidden');
        
        e.target.reset();
        
        setTimeout(() => {
            closeContactModal();
        }, 2200);
        
    }, 1500);
}

// -------------------------------------------------------------
// Zoho App Modals Data & Logic (Prefixed names & Colorful SVGs)
// -------------------------------------------------------------
const zohoAppsData = {
    CRM: {
        title: "Zoho CRM",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/crm.svg" alt="Zoho CRM" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "The backbone of customer operations. We specialize in custom blueprints, advanced pipeline states, lead scoring engines, and tailored Canvas views.",
        cases: [
            "Leads automated scoring based on engagement signals & metadata",
            "Omnichannel blueprints that guide sales agents from contact to deal closure",
            "Automated field updates and workflow triggers sending Webhook notifications to external slack networks"
        ]
    },
    Books: {
        title: "Zoho Books",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/books.svg" alt="Zoho Books" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "Professional accounting automation. We streamline financial reports, automate recurring invoices, and build custom multi-payment gateway routing.",
        cases: [
            "Automated sales invoicing triggered directly from CRM closed-won deal states",
            "Stripe and bank account transaction matching logic via Deluge scripts",
            "Automated PDF generation and multi-currency exchange rate adjustments on the fly"
        ]
    },
    Creator: {
        title: "Zoho Creator",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/creator.svg" alt="Zoho Creator" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "Low-code app engines to build tailored enterprise business software. Perfect for custom tracking applications and partner portals.",
        cases: [
            "Interactive customer service portal linked directly with CRM records",
            "Custom inventory tracker apps with automated QR code scanning workflows",
            "Complex database relations maps built with bespoke UI panels"
        ]
    },
    Flow: {
        title: "Zoho Flow",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/flow.svg" alt="Zoho Flow" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "Middle-layer integration hub. Similar to n8n and Make, we build complex multi-branch integrations with custom Deluge code snippets.",
        cases: [
            "Dynamic lead synchronization between HubSpot, Zoho CRM, and ActiveCampaign",
            "Document parsing scripts mapping form attachments to specific cloud drives",
            "Triggering custom slack notifications on critical error reporting streams"
        ]
    },
    Desk: {
        title: "Zoho Desk",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/desk.svg" alt="Zoho Desk" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "High-efficiency customer ticket support engine. We configure custom SLAs, automated ticket classification systems, and multi-brand support channels.",
        cases: [
            "Ticket routing logic parsing subject lines using lightweight regex models",
            "Customer sentiment alerts directly synced to the corresponding sales CRM deal",
            "Client self-service knowledge base styling and live-chat integrations"
        ]
    },
    Analytics: {
        title: "Zoho Analytics",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/analytics.svg" alt="Zoho Analytics" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "Deep visual intelligence and BI. We connect diverse data sources to build consolidated dashboards.",
        cases: [
            "Syncing and transforming Shopify, Stripe, and Ad campaign metrics inside one view",
            "Automated weekly email PDF reports generated for team performance review",
            "Deluge mapping to analyze customer churn risks via predictive linear modeling"
        ]
    },
    Campaigns: {
        title: "Zoho Campaigns",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/campaigns.svg" alt="Zoho Campaigns" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "Smart list segmentation and email drip campaign pipelines built to maximize marketing ROI.",
        cases: [
            "Lead nurturing flows triggered by CRM workflow scores",
            "Dynamic email template logic displaying custom fields based on contact tags",
            "Advanced bounce management pipelines writing statuses back to CRM"
        ]
    },
    Forms: {
        title: "Zoho Forms",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/forms.svg" alt="Zoho Forms" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "Stunning responsive form systems configured for smooth field capture and automated data storage.",
        cases: [
            "Multi-stage inquiry routing that adjusts forms based on client selections",
            "Encrypted field collection with direct secure uploads to cloud servers",
            "Automated dynamic receipt redirects triggered on payment validations"
        ]
    },
    Sign: {
        title: "Zoho Sign",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/sign.svg" alt="Zoho Sign" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "Secure digital signature solutions. We configure automated document signing flows, templates, and seamless Deluge trigger webhooks.",
        cases: [
            "Automated agreement generation and dispatch upon closed-won deal states in CRM",
            "Multi-party signing sequence routing with automated reminder alerts",
            "Post-signing PDF archiving directly to secure Zoho WorkDrive folders"
        ]
    },
    Expense: {
        title: "Zoho Expense",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/expense.svg" alt="Zoho Expense" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "Corporate spend and expense management. Automated receipt scanning, policy compliance mapping, and streamlined approvals.",
        cases: [
            "Instant receipt parsing using dynamic OCR engines linked to transaction logs",
            "Multi-level manager approval logic routing based on expense categories and limits",
            "Direct synchronization with accounting books to reconcile corporate card statements"
        ]
    },
    Payroll: {
        title: "Zoho Payroll",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/payroll.svg" alt="Zoho Payroll" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "Comprehensive employee salary and compliance administration. We automate payouts, taxes, and structured ledger entries.",
        cases: [
            "Automated payroll computations synced directly with Zoho People timesheets",
            "Compliance tax declarations and direct deposits file generation",
            "Employee self-service portals enabling immediate payslip downloads"
        ]
    },
    Projects: {
        title: "Zoho Projects",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/projects.svg" alt="Zoho Projects" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "Advanced team work operations. We build task dependencies templates, blueprints, and time logs automation.",
        cases: [
            "Instant creation of client workspaces on CRM contract e-signing",
            "Auto-task assignment and SLA alerts triggered when process gates move",
            "Consolidated employee time sheets generated for direct invoice billing"
        ]
    },
    People: {
        title: "Zoho People",
        iconColor: "",
        iconSvg: `<img src="https://www.zohowebstatic.com/sites/zweb/images/producticon/people.svg" alt="Zoho People" style="width:40px; height:40px; object-fit:contain;">`,
        desc: "HR and employee database administration. Streamlined onboarding, automated tracking, and clean operations routing.",
        cases: [
            "New employee onboarding task templates automatically spawned on contract signings",
            "Custom leave application flows mapped into corporate team calendars",
            "Slack webhook notifications tracking employee achievements and birthdays"
        ]
    },
    More: {
        title: "Zoho Ecosystem",
        iconColor: "more-color",
        iconSvg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:40px; height:40px;"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`,
        desc: "A fully integrated multi-tool architecture. We design end-to-end custom Deluge systems leveraging CRM, Sign, WorkDrive, Cliq, and much more.",
        cases: [
            "Connecting custom API gateways directly into Zoho middleware channels",
            "Automated PDF document compilation from CRM values parsed through Zoho Writer",
            "Real-time corporate notifications dashboards built with customized Zoho Cliq bots"
        ]
    }
};

// Wire up Zoho app clicks
document.querySelectorAll('.zoho-app-item').forEach(item => {
    item.addEventListener('click', () => {
        const appKey = item.getAttribute('data-app');
        const data = zohoAppsData[appKey];
        if (data) {
            openAppModal(data);
        }
    });
});

function openAppModal(data) {
    const modal = document.getElementById('appDetailModal');
    const iconContainer = document.getElementById('modalAppIcon');
    const nameEl = document.getElementById('modalAppName');
    const descEl = document.getElementById('modalAppDesc');
    const listEl = document.getElementById('modalAppCapabilities');
    
    iconContainer.className = `app-detail-icon ${data.iconColor}`;
    iconContainer.innerHTML = data.iconSvg;
    nameEl.textContent = data.title;
    descEl.textContent = data.desc;
    
    listEl.innerHTML = "";
    data.cases.forEach(usecase => {
        const li = document.createElement('li');
        li.textContent = usecase;
        listEl.appendChild(li);
    });
    
    modal.classList.add('active');
}

function closeAppModal() {
    const modal = document.getElementById('appDetailModal');
    modal.classList.remove('active');
}

function switchToContactFromApp() {
    const appName = document.getElementById('modalAppName').textContent;
    closeAppModal();
    setTimeout(() => {
        openContactModal('zoho');
        document.getElementById('clientMessage').value = `Hi Akhil, I am interested in optimizing my setup using ${appName}. Let's chat!`;
    }, 300);
}

// -------------------------------------------------------------
// Featured Work Modals Data & Logic
// -------------------------------------------------------------
const projectsData = {
    'lead-automation': {
        cat: "Zoho CRM & Flow Integration",
        title: "Lead Automation System",
        visual: `
            <div class="project-modal-glow lead-glow"></div>
            <svg viewBox="0 0 200 120" fill="none" style="width:200px; height:120px;">
                <circle cx="100" cy="60" r="32" stroke="#FF4C29" stroke-width="1.5" stroke-dasharray="4 4" />
                <circle cx="100" cy="60" r="22" stroke="#FF4C29" stroke-width="2" />
                <path d="M100 20V32M100 88v12M60 60h12M128 60h12" stroke="#ffffff" stroke-width="1.5" />
            </svg>`,
        challenge: "A rapidly scaling advisory firm was losing high-intent leads because of fragmented capture interfaces, manual lead scoring lag, and delayed contact outreach times (often exceeding 24 hours).",
        solution: "We engineered an end-to-end integration mapping lead sources into Zoho CRM via custom webhook parsers. A dynamic Deluge script scores leads based on criteria like corporate domain validation, budget scales, and service selectors. High-scoring leads immediately trigger instant SMS notifications to agents and schedule automated calendar links via Zoho CRM workflows.",
        stat1: "94%",
        stat1Lbl: "Outreach in <5 mins",
        stat2: "22 hrs",
        stat2Lbl: "Agent hours saved/mo"
    },
    'ops-dashboard': {
        cat: "Zoho Analytics Intelligence",
        title: "Operations Dashboard",
        visual: `
            <div class="project-modal-glow ops-glow"></div>
            <svg viewBox="0 0 200 120" fill="none" style="width:200px; height:120px;">
                <rect x="30" y="30" width="140" height="60" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
                <path d="M40 78L65 62L90 70L115 48L140 58L160 42" stroke="#FF4C29" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
        challenge: "An e-commerce business was running inventory, shipping, and sales across multiple systems (Shopify, Quickbooks, and custom shipping APIs), forcing the executives to manually reconcile data weekly via excel sheets to assess health metrics.",
        solution: "We mapped and aggregated transactional data streams into Zoho Analytics using daily scheduled API pipelines. Formulating custom SQL query tables, we constructed an intuitive consolidated dashboard providing immediate clarity on key operational KPIs, including customer acquisition cost, real-time margins, stock threshold alerts, and invoice payment statuses.",
        stat1: "100%",
        stat1Lbl: "Data consolidation",
        stat2: "15 hrs",
        stat2Lbl: "Reconciliation time saved"
    },
    'multi-platform': {
        cat: "Custom API & Middleware Automation",
        title: "Multi Platform Integration",
        visual: `
            <div class="project-modal-glow multi-glow"></div>
            <svg viewBox="0 0 200 120" fill="none" style="width:200px; height:120px;">
                <circle cx="100" cy="60" r="12" fill="#FF4C29" fill-opacity="0.2" stroke="#FF4C29" stroke-width="1.5" />
                <circle cx="100" cy="60" r="4" fill="#FF4C29" />
                <line x1="92" y1="55" x2="58" y2="44" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="2 2" />
                <line x1="108" y1="55" x2="142" y2="44" stroke="rgba(255,255,255,0.2)" stroke-width="1" stroke-dasharray="2 2" />
            </svg>`,
        challenge: "A business consultant was losing time copying customer documents and requirements manually between web forms, ChatGPT scripts for document synthesis, Slack operations channels, and project sheets.",
        solution: "We built a customized automation workflow connecting n8n and custom REST APIs. When a customer submits their business documents via web portal, a custom middle-layer API securely uploads the assets to cloud nodes, feeds the text payloads to OpenAI API models using structured system prompts, drafts the operation templates, provisions a client taskboard, and broadcasts immediate team briefs via Slack channels.",
        stat1: "99.8%",
        stat1Lbl: "Accuracy score",
        stat2: "35 hrs",
        stat2Lbl: "Weekly labor saved"
    }
};

function openProjectModal(projectKey) {
    const modal = document.getElementById('projectDetailModal');
    const data = projectsData[projectKey];
    
    if (data) {
        document.getElementById('projectModalCat').textContent = data.cat;
        document.getElementById('projectModalTitle').textContent = data.title;
        document.getElementById('projectModalVisual').innerHTML = data.visual;
        document.getElementById('projectModalChallenge').textContent = data.challenge;
        document.getElementById('projectModalSolution').textContent = data.solution;
        
        document.getElementById('projectStat1').textContent = data.stat1;
        document.getElementById('projectStat1Lbl').textContent = data.stat1Lbl;
        document.getElementById('projectStat2').textContent = data.stat2;
        document.getElementById('projectStat2Lbl').textContent = data.stat2Lbl;
        
        modal.classList.add('active');
    }
}

function closeProjectModal() {
    const modal = document.getElementById('projectDetailModal');
    modal.classList.remove('active');
}

function switchToContactFromProject() {
    const projName = document.getElementById('projectModalTitle').textContent;
    closeProjectModal();
    setTimeout(() => {
        openContactModal('integration');
        document.getElementById('clientMessage').value = `Hi Akhil, I read about the '${projName}' case study and would like to build a similar automation structure for my operations. Let's discuss details.`;
    }, 300);
}

// Window event to close modals on clicking backdrop
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
        e.target.classList.remove('active');
    }
});

/* ==========================================================================
   INTERACTIVE MASCOT VECTOR TRACKING (RIVE/LOTTIE CLASS MASCOT MOTION)
   ========================================================================== */
function initMascotTracking() {
    const heroSection = document.querySelector('.hero-section');
    const mascotContainer = document.querySelector('.hero-mascot-container');
    const mascotGroup = document.getElementById('mascot-group');
    const head = document.getElementById('mascot-head-group');
    const faceplate = document.getElementById('mascot-faceplate-group');
    const eyes = document.getElementById('mascot-eyes-group');
    const body = document.getElementById('mascot-body-group');
    const shadow = document.querySelector('.mascot-shadow');
    
    const antennaL = document.getElementById('mascot-antenna-l');
    const antennaR = document.getElementById('mascot-antenna-r');
    const coreGlow = document.getElementById('mascot-core-glow');
    const glowFilter = document.querySelector('#glow-filter feGaussianBlur');
    const pulseElements = document.querySelectorAll('.eye-pulse');
    const halo = document.getElementById('mascot-bg-halo');
    const orbits = document.getElementById('mascot-bg-orbits');

    if (!heroSection || !head || !faceplate || !eyes || !body) return;

    // Enable interactive container hover actions
    if (mascotContainer) {
        mascotContainer.style.pointerEvents = 'auto';
        mascotContainer.style.cursor = 'pointer';
    }

    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let isHovered = false;
    let hoverProgress = 0.0; // Lerps between 0.0 (idle) and 1.0 (hovered)

    // Listen to mouse movement in the hero section for general tracking
    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        targetMouseX = ((e.clientX - rect.left) / rect.width) - 0.5; // -0.5 to 0.5
        targetMouseY = ((e.clientY - rect.top) / rect.height) - 0.5; // -0.5 to 0.5
    });

    // Reset coordinates on mouse leave
    heroSection.addEventListener('mouseleave', () => {
        targetMouseX = 0;
        targetMouseY = 0;
    });

    // Hover listeners directly on the mascot container
    if (mascotContainer) {
        mascotContainer.addEventListener('mouseenter', () => {
            isHovered = true;
        });
        mascotContainer.addEventListener('mouseleave', () => {
            isHovered = false;
        });
    }

    // Parallax tracking position variables
    let headX = 0, headY = 0;
    let faceX = 0, faceY = 0;
    let eyeX = 0, eyeY = 0;
    let bodyX = 0, bodyY = 0;

    // Set absolute CSS transform origins once for clean vector scale and rotation pivoting
    body.style.transformOrigin = '200px 330px';
    head.style.transformOrigin = '200px 200px';
    if (mascotGroup) mascotGroup.style.transformOrigin = '200px 330px';
    if (shadow) shadow.style.transformOrigin = '200px 350px';
    if (coreGlow) coreGlow.style.transformOrigin = '200px 285px';
    if (antennaL) antennaL.style.transformOrigin = '138px 115px';
    if (antennaR) antennaR.style.transformOrigin = '262px 115px';
    if (halo) halo.style.transformOrigin = '200px 240px';
    if (orbits) orbits.style.transformOrigin = '200px 240px';

    // 60fps hardware-accelerated animation frame loop
    function update(time) {
        requestAnimationFrame(update);

        // Smooth spring physics (linear interpolation lerp) for tracking
        mouseX += (targetMouseX - mouseX) * 0.08;
        mouseY += (targetMouseY - mouseY) * 0.08;

        // Smooth spring interpolation for hover progress (duration ~600-800ms, no bounce)
        hoverProgress += ((isHovered ? 1.0 : 0.0) - hoverProgress) * 0.08;

        const t = time * 0.001; // Seconds

        // 1. Idle state: Very slow floating motion (sinusoidal float of 3px)
        const idleFloat = Math.sin(time * 0.0008) * 3; // Ultra slow float
        // Idle state: Tiny breathing bob & torso scaling
        const breathe = Math.sin(t * 1.5) * 2; // 2px bobbing
        const breatheScale = 1.0 + Math.sin(t * 1.5) * 0.006; // 0.6% scale bobbing

        // 2. Hover float up (6-8px: we use -7.5px)
        const hoverFloat = -7.5 * hoverProgress;
        const totalFloatY = idleFloat + hoverFloat;

        // 3. Scale Mascot up smoothly up to 1.025 on hover (under the 1.03 cap)
        const mascotScale = 1.0 + hoverProgress * 0.025;

        // 4. Parallax depth limits: curious leaning increases multipliers by 1.5x on hover
        const targetHeadX = mouseX * (22 + 11 * hoverProgress);
        const targetHeadY = mouseY * (14 + 7 * hoverProgress);
        const targetFaceX = mouseX * (14 + 7 * hoverProgress);
        const targetFaceY = mouseY * (9 + 4.5 * hoverProgress);
        const targetEyeX = mouseX * (10 + 5 * hoverProgress);
        const targetEyeY = mouseY * (7 + 3.5 * hoverProgress);
        
        const targetBodyX = mouseX * (6 + 3 * hoverProgress);
        const targetBodyY = mouseY * (4 + 2 * hoverProgress);

        // Apply spring lerping
        headX += (targetHeadX - headX) * 0.08;
        headY += (targetHeadY - headY) * 0.08;
        faceX += (targetFaceX - faceX) * 0.09;
        faceY += (targetFaceY - faceY) * 0.09;
        eyeX += (targetEyeX - eyeX) * 0.1;
        eyeY += (targetEyeY - eyeY) * 0.1;
        bodyX += (targetBodyX - bodyX) * 0.08;
        bodyY += (targetBodyY - bodyY) * 0.08;

        // 5. Head tilt slightly toward cursor (tilts further on hover)
        const headRotate = mouseX * 7 * (1.0 + hoverProgress * 0.5);

        // 6. Apply transforms to mascot components
        head.style.transform = `translate(${headX + bodyX}px, ${headY + bodyY + breathe * 0.5}px) rotate(${headRotate}deg)`;
        faceplate.style.transform = `translate(${faceX}px, ${faceY}px)`;
        eyes.style.transform = `translate(${eyeX}px, ${eyeY}px)`;
        
        // Torso breathing & sway
        body.style.transform = `translate(${bodyX}px, ${bodyY + breathe}px) scaleY(${breatheScale})`;
        
        // Mascot group: hover float up and minor scale increase
        if (mascotGroup) {
            mascotGroup.style.transform = `translateY(${totalFloatY}px) scale(${mascotScale})`;
        }

        // 7. Antennas react subtly by tilting outward on hover
        if (antennaL) {
            antennaL.style.transform = `rotate(${hoverProgress * -6}deg)`;
        }
        if (antennaR) {
            antennaR.style.transform = `rotate(${hoverProgress * 6}deg)`;
        }

        // 8. Glowing elements pulsing & brightening transitions
        // Idle soft pulsing eyes & status lights every few seconds (t * 1.5)
        const eyePulseVal = 0.7 + 0.15 * Math.sin(t * 1.5);
        const eyeOpacity = eyePulseVal * (1.0 - hoverProgress) + 1.0 * hoverProgress;
        
        pulseElements.forEach(el => {
            el.style.opacity = eyeOpacity;
        });

        // Center core glows stronger
        const corePulseVal = 0.65 + 0.2 * Math.sin(t * 2.5);
        const coreOpacity = corePulseVal * (1.0 - hoverProgress) + 1.0 * hoverProgress;
        const coreScale = 1.0 + hoverProgress * 0.15; // Core expands by 15%

        if (coreGlow) {
            coreGlow.style.transform = `scale(${coreScale})`;
            coreGlow.style.opacity = coreOpacity;
        }

        // Glow expands softly by altering the blur filter radius smoothly
        if (glowFilter) {
            const stdDevVal = 8 + hoverProgress * 4; // Blur radius expands from 8px to 12px
            glowFilter.setAttribute('stdDeviation', stdDevVal);
        }

        // 9. Floor shadow reacts elegantly: scales down as the robot floats higher and bobbing bobs shadow
        if (shadow) {
            const shadowFloatScale = 1.0 - hoverProgress * 0.12;
            const shadowBreatheScale = 1.0 - Math.sin(t * 1.5) * 0.04;
            shadow.style.transform = `translate(${bodyX}px, 0) scale(${shadowBreatheScale * shadowFloatScale})`;
            shadow.style.opacity = 0.6 * (1.0 - hoverProgress * 0.25); // Softly fades out as robot gets higher
        }

        // 10. Background Ambient Halo & Orbit Scaling & Pulsing Transitions
        // Halo very slow pulse during idle (sinusoidal offset), brightens on hover
        const haloPulseVal = 0.6 + 0.1 * Math.sin(t * 1.0); // Ultra slow breathing pulse
        const haloOpacity = haloPulseVal * (1.0 - hoverProgress) + 0.85 * hoverProgress;
        const haloScale = 1.0 + hoverProgress * 0.12; // Expands from 1.0 to 1.12 on hover
        
        if (halo) {
            halo.style.transform = `scale(${haloScale})`;
            halo.style.opacity = haloOpacity;
        }

        // Orbits react subtly on hover (gently scale up and expand spacing)
        const orbitsScale = 1.0 + hoverProgress * 0.08;
        if (orbits) {
            orbits.style.transform = `scale(${orbitsScale})`;
        }
    }

    requestAnimationFrame(update);
}
