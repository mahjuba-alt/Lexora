/**
 * LEXORA — Futuristic Vocabulary Learning Platform
 * Core Engine Layer (Production Architecture)
 * * Features: Modular Architecture, LocalStorage Persistence, Throttle/Debounce,
 * Intersection Observer Animations, Interactive Quiz, Live Search, Adaptive Theme.
 * * Target: Vanilla JS (ES6+) Component Framework
 */

// ==========================================================================
// 0. CONFIGURATION & STATE MANIFEST
// ==========================================================================
const LEXORA_STORAGE_KEY = 'lexora_platform_state';

const defaultPlatformState = {
    theme: 'dark',
    learnedWordsCount: 1284,
    quizScore: 1420,
    currentStreak: 14,
    bestStreak: 14,
    lastVisitDate: null,
    savedVaultWords: ['Ephemeral']
};

let platformState = { ...defaultPlatformState };

// Core Dictionary Matrix
const vocabularyDatabase = [
    {
        word: "Ephemeral",
        phonetic: "/ɪˈfemərəl/",
        pos: "adjective",
        meaning: "Lasting for a very short, transient period of time; fleeting by nature.",
        synonyms: ["Transient", "Fleeting", "Evanescent"],
        antonyms: ["Permanent", "Eternal"],
        example: "The beautiful pattern formed by the particle glow was inherently ephemeral, dissolving into abstract vectors within seconds."
    },
    {
        word: "Serendipity",
        phonetic: "/ˌserənˈdipədē/",
        pos: "noun",
        meaning: "The occurrence and development of valuable events by chance in a happy or beneficial way.",
        synonyms: ["Fortuity", "Fluke", "Chance"],
        antonyms: ["Design", "Misfortune"],
        example: "Discovering the exact archival text needed for the thesis was a moment of pure academic serendipity."
    },
    {
        word: "Eloquent",
        phonetic: "/ˈeləkwənt/",
        pos: "adjective",
        meaning: "Fluent, highly expressive, and intensely persuasive in spoken or written speech.",
        synonyms: ["Articulate", "Fluent", "Silver-tongued"],
        antonyms: ["Inarticulate", "Silent"],
        example: "The key-note speaker delivered an eloquent critique regarding emergent neural user interfaces."
    },
    {
        word: "Resilient",
        phonetic: "/rəˈzilyənt/",
        pos: "adjective",
        meaning: "Able to withstand or recover quickly from difficult, challenging structural conditions.",
        synonyms: ["Buoyant", "Tough", "Irrepressible"],
        antonyms: ["Fragile", "Vulnerable"],
        example: "Modern distributed server configurations must be resilient enough to absorb sudden traffic spikes."
    },
    {
        word: "Meticulous",
        phonetic: "/məˈtikyələs/",
        pos: "adjective",
        meaning: "Showing immense attention to technical detail; ultra-precise and careful.",
        synonyms: ["Scrupulous", "Fastidious", "Conscientious"],
        antonyms: ["Careless", "Sloppy"],
        example: "The design studio took a meticulous approach to aligning the layout dimensions down to the pixel."
    },
    {
        word: "Ubiquitous",
        phonetic: "/yo͞oˈbikwədəs/",
        pos: "adjective",
        meaning: "Present, appearing, or found absolutely everywhere across an ecosystem.",
        synonyms: ["Omnipresent", "Pervasive", "Universal"],
        antonyms: ["Rare", "Scarce"],
        example: "By 2026, premium responsive micro-animations had become completely ubiquitous across SaaS architectures."
    },
    {
        word: "Pragmatic",
        phonetic: "/praɡˈmadik/",
        pos: "adjective",
        meaning: "Dealing with configurations realistically and practically rather than theoretically.",
        synonyms: ["Practical", "Realistic", "Sensible"],
        antonyms: ["Idealistic", "Visionary"],
        example: "The team made a pragmatic engineering trade-off to launch the application matrix on schedule."
    },
    {
        word: "Ambiguous",
        phonetic: "/amˈbiɡyo͞oəs/",
        pos: "adjective",
        meaning: "Open to more than one interpretation; having a double or unclear meaning.",
        synonyms: ["Equivocal", "Obscure", "Vague"],
        antonyms: ["Clear", "Unambiguous"],
        example: "The initial platform design document was somewhat ambiguous concerning user privacy settings."
    }
];

// Quiz Arena Evaluation Core Databank
const quizQuestions = [
    {
        question: 'Which option establishes the most precise accurate synonym for the word "Eloquent"?',
        options: [
            "Inherently silent or continuously uncommunicative",
            "Fluent, highly expressive, and intensely persuasive in speech",
            "Displaying high structural levels of economic dependency",
            "Overly analytical regarding simple architectural matrices"
        ],
        correctIndex: 1
    },
    {
        question: 'What is the correct antonym parameters for the core element "Ephemeral"?',
        options: [
            "Transient and fleeting vectors",
            "Completely random chance configurations",
            "Permanent, everlasting, or eternal state",
            "Extremely fastidious technical development protocols"
        ],
        correctIndex: 2
    },
    {
        question: 'Identify the word matching: "Present, appearing, or found absolutely everywhere across an ecosystem."',
        options: [
            "Ubiquitous",
            "Ambiguous",
            "Meticulous",
            "Pragmatic"
        ],
        correctIndex: 0
    }
];

let activeQuizIndex = 0;
let activeQuizScoreAccumulator = 0;

// ==========================================================================
// SYSTEM PERFORMANCE OPTIMIZATION (THROTTLE & DEBOUNCE FUNCTIONS)
// ==========================================================================
function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================================================
// CORE STATE STORAGE PERSISTENCE ENGINE
// ==========================================================================
function loadPlatformState() {
    try {
        const serializedData = localStorage.getItem(LEXORA_STORAGE_KEY);
        if (serializedData) {
            platformState = { ...defaultPlatformState, ...JSON.parse(serializedData) };
        } else {
            platformState = { ...defaultPlatformState, lastVisitDate: new Date().toISOString() };
            savePlatformState();
        }
    } catch (error) {
        console.error("Storage Matrix initialization failure. Falling back to memory state.", error);
    }
}

function savePlatformState() {
    try {
        localStorage.setItem(LEXORA_STORAGE_KEY, JSON.stringify(platformState));
        synchronizeDashboardMetrics();
    } catch (error) {
        console.error("Failed writing state mutations to operational storage registry.", error);
    }
}

// ==========================================================================
// 1. PRELOADER CORE CONTROLLER
// ==========================================================================
function initializePreloader() {
    const preloaderElement = document.getElementById('preloader') || document.querySelector('.preloader-placeholder');
    if (preloaderElement) {
        window.addEventListener('load', () => {
            preloaderElement.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            preloaderElement.style.opacity = '0';
            setTimeout(() => {
                preloaderElement.style.display = 'none';
            }, 600);
        });
    } else {
        // Fallback context logic if element doesn't exist explicitly in DOM structure
        setTimeout(() => document.body.classList.add('dom-fully-stabilized'), 300);
    }
}

// ==========================================================================
// 2. MOBILE NAVIGATION DRAWER IMPLEMENTATION
// ==========================================================================
function initializeMobileNavigation() {
    const toggleButton = document.querySelector('.menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggleButton || !navMenu) return;

    const toggleMenuState = () => {
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        toggleButton.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('nav-menu-active');
        document.body.classList.toggle('lock-viewport-scrolling');
    };

    toggleButton.addEventListener('click', toggleMenuState);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('nav-menu-active')) {
                toggleMenuState();
            }
        });
    });
}

// ==========================================================================
// 3. STICKY NAVBAR & 4. SMOOTH SCROLL TRACKING MANAGEMENT
// ==========================================================================
function initializeNavbarBehavior() {
    const navbarElement = document.getElementById('main-navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const handleScrollEffects = () => {
        if (!navbarElement) return;
        
        // Handle Sticky Glassmorphism transformation parameters
        if (window.scrollY > 40) {
            navbarElement.classList.add('navbar-scrolled');
        } else {
            navbarElement.classList.remove('navbar-scrolled');
        }

        // Active Section Matrix Link Highlighting Logic
        let currentActiveSectionId = '';
        const scrollPositionOffset = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPositionOffset >= sectionTop && scrollPositionOffset < sectionTop + sectionHeight) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentActiveSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', throttle(handleScrollEffects, 100));

    // Smooth Scrolling with precise layout height offset parameters
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navbarHeightOffset = navbarElement ? navbarElement.offsetHeight : 80;
                const targetingPosition = targetElement.offsetTop - navbarHeightOffset;

                window.scrollTo({
                    top: targetingPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================================================
// 5. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER PIPELINE)
// ==========================================================================
function initializeScrollRevealPipeline() {
    if (!('IntersectionObserver' in window)) return;

    // Mapping structural selection keys from predefined HTML layout architecture
    const configurationMap = [
        { selector: '.feature-card', classToAdd: 'reveal-fade-up' },
        { selector: '.galaxy-card', classToAdd: 'reveal-scale-in' },
        { selector: '.hero-content', classToAdd: 'reveal-fade-left' },
        { selector: '.hero-visual-container', classToAdd: 'reveal-fade-right' },
        { selector: '.premium-testimonial-card', classToAdd: 'reveal-fade-up' },
        { selector: '.telemetry-card', classToAdd: 'reveal-scale-in' }
    ];

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animation-triggered-active');
                // Execute metric count up sequence immediately if intersecting target matches numerical counters
                if (entry.target.classList.contains('trusted-stat-card') || entry.target.classList.contains('telemetry-card')) {
                    triggerCounterSequence(entry.target);
                }
                observer.unobserve(entry.target);
            }
        });
    };

    const observerInstance = new IntersectionObserver(revealCallback, observerOptions);

    configurationMap.forEach(config => {
        document.querySelectorAll(config.selector).forEach(element => {
            element.classList.add('reveal-base-blueprint', config.classToAdd);
            observerInstance.observe(element);
        });
    });

    // Separately register simple metric items targeting direct intersection metrics
    document.querySelectorAll('.trusted-stat-card').forEach(card => observerInstance.observe(card));
}

// ==========================================================================
// 6. HERO SECTION RECURSIVE TYPING EFFECT ENGINE
// ==========================================================================
function initializeHeroTypingEngine() {
    const targetContainer = document.querySelector('.text-gradient');
    if (!targetContainer) return;

    // Check if hero title text needs modification dynamically or works via inner container context overrides
    // Inserting explicit sub-element node structure specifically for typing text isolate loops safely
    let phraseDisplayContainer = targetContainer.querySelector('.typing-dynamic-node');
    if (!phraseDisplayContainer) {
        targetContainer.innerHTML = `<span class="typing-dynamic-node">Master Expression.</span><span class="typing-cursor-blink" aria-hidden="true">|</span>`;
        phraseDisplayContainer = targetContainer.querySelector('.typing-dynamic-node');
    }

    const textualPhrasesList = [
        "Master Words.",
        "Master Expression.",
        "Build Vocabulary.",
        "Speak With Confidence."
    ];

    let horizontalPhraseIndex = 0;
    let characterIndex = 0;
    let isReversingBackspaceMode = false;
    let timingSpeedFactor = 120; // Milliseconds delta between key operations

    const executePacingCycle = () => {
        const structuralPhrase = textualPhrasesList[horizontalPhraseIndex];
        
        if (isReversingBackspaceMode) {
            phraseDisplayContainer.textContent = structuralPhrase.substring(0, characterIndex - 1);
            characterIndex--;
            timingSpeedFactor = 60; // Faster reverse backspace execution acceleration
        } else {
            phraseDisplayContainer.textContent = structuralPhrase.substring(0, characterIndex + 1);
            characterIndex++;
            timingSpeedFactor = 120; // Baseline pacing simulation speed
        }

        // State Machine transition rules conditions Evaluation
        if (!isReversingBackspaceMode && characterIndex === structuralPhrase.length) {
            isReversingBackspaceMode = true;
            timingSpeedFactor = 2200; // Hold full phrase static structure duration display limit
        } else if (isReversingBackspaceMode && characterIndex === 0) {
            isReversingBackspaceMode = false;
            horizontalPhraseIndex = (horizontalPhraseIndex + 1) % textualPhrasesList.length;
            timingSpeedFactor = 400; // Inter-phrase pause preparation lag matrix
        }

        setTimeout(executePacingCycle, timingSpeedFactor);
    };

    // Initiate Loop after buffer window
    setTimeout(executePacingCycle, 1000);
}

// ==========================================================================
// 7. FLOATING INTERACTIVE MOUSE PARALLAX EFFECT MAPPERS
// ==========================================================================
function initializeInteractiveFloatingEffects() {
    const interactiveCardElements = document.querySelectorAll('.feature-card, .galaxy-card, .word-card-display');
    
    const handleMouseMovementParallax = (e, element) => {
        const boundingDimensions = element.getBoundingClientRect();
        const horizontalDeltaX = e.clientX - boundingDimensions.left;
        const verticalDeltaY = e.clientY - boundingDimensions.top;
        
        const coordinateXPercent = (horizontalDeltaX / boundingDimensions.width) - 0.5;
        const coordinateYPercent = (verticalDeltaY / boundingDimensions.height) - 0.5;

        // Apply constrained 3D rotations based on calculations mapping relative percentages
        element.style.transform = `perspective(1000px) translateY(-8px) rotateX(${coordinateYPercent * 8}deg) rotateY(${-coordinateXPercent * 8}deg) scale(1.01)`;
    };

    const resetCardSpatialState = (element) => {
        element.style.transform = '';
    };

    interactiveCardElements.forEach(card => {
        card.addEventListener('mousemove', (e) => handleMouseMovementParallax(e, card));
        card.addEventListener('mouseleave', () => resetCardSpatialState(card));
    });
}

// ==========================================================================
// 8. GRAPHICAL METRIC NUMERICAL COUNTER SEQUENCES
// ==========================================================================
function triggerCounterSequence(targetElement) {
    const numericalAnchor = targetElement.querySelector('.stat-number, .telemetry-val');
    if (!numericalAnchor || numericalAnchor.classList.contains('counting-completed')) return;

    const nativeRawString = numericalAnchor.textContent.trim();
    // Isolate pure integers from notation parameters safely (+, %, commas)
    const targetIntegerVal = parseInt(nativeRawString.replace(/[^0-9]/g, ''), 10);
    if (isNaN(targetIntegerVal)) return;

    numericalAnchor.classList.add('counting-completed');
    let runningBaselineValue = 0;
    const animationFrameDuration = 1500; // Milliseconds scale length allocations
    const initialTimestamp = performance.now();

    const frameStepFunction = (currentTimestamp) => {
        const progressTimeDelta = currentTimestamp - initialTimestamp;
        const normalizedRatio = Math.min(progressTimeDelta / animationFrameDuration, 1);
        
        // Easing transition multiplier curves logic (Out-Quad curve trajectory profile)
        const transitionEasedRatio = normalizedRatio * (2 - normalizedRatio);
        runningBaselineValue = Math.floor(transitionEasedRatio * targetIntegerVal);

        // Format and append contextual suffixes back matching baseline design blueprints
        if (nativeRawString.includes('+')) {
            numericalAnchor.textContent = `${runningBaselineValue.toLocaleString()}+`;
        } else if (nativeRawString.includes('%')) {
            numericalAnchor.textContent = `${runningBaselineValue}%`;
        } else if (nativeRawString.toLowerCase().includes('k')) {
            // Check original placement logic structure
            numericalAnchor.textContent = nativeRawString; 
            return; // Safe skip mapping configuration constraints bypass
        } else {
            numericalAnchor.textContent = runningBaselineValue.toLocaleString();
        }

        if (normalizedRatio < 1) {
            requestAnimationFrame(frameStepFunction);
        } else {
            numericalAnchor.textContent = nativeRawString; // Force snap to pristine original text at terminal framework link
        }
    };

    requestAnimationFrame(frameStepFunction);
}

// ==========================================================================
// 9. VOCABULARY CORE SEARCH ENGINE PLATFORM MAPPING INTERACTION
// ==========================================================================
function initializeVocabularySearchEngine() {
    const searchFormInput = document.getElementById('explorer-search');
    const wordCardDisplayContainer = document.querySelector('.word-card-display');

    if (!searchFormInput || !wordCardDisplayContainer) return;

    const renderWordResultCard = (vocabularyModel) => {
        const isCurrentlySaved = platformState.savedVaultWords.includes(vocabularyModel.word);
        
        wordCardDisplayContainer.innerHTML = `
            <div class="word-card-top">
                <div class="word-identifiers">
                    <h3 class="target-word">${vocabularyModel.word}</h3>
                    <span class="phonetic-transcription">${vocabularyModel.phonetic}</span>
                    <span class="part-of-speech">${vocabularyModel.pos}</span>
                </div>
                <button class="btn-save-vault ${isCurrentlySaved ? 'saved-active-token' : ''}" aria-label="Toggle ${vocabularyModel.word} Inside Personal Vault" data-word="${vocabularyModel.word}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${isCurrentlySaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>

            <div class="word-card-details">
                <div class="detail-segment">
                    <h4 class="segment-label">Meaning</h4>
                    <p class="segment-text">${vocabularyModel.meaning}</p>
                </div>

                <div class="detail-split-row">
                    <div class="detail-segment">
                        <h4 class="segment-label">Synonyms</h4>
                        <div class="tag-cloud">
                            ${vocabularyModel.synonyms.map(syn => `<span class="vocab-tag">${syn}</span>`).join('')}
                        </div>
                    </div>
                    <div class="detail-segment">
                        <h4 class="segment-label">Antonyms</h4>
                        <div class="tag-cloud">
                            ${vocabularyModel.antonyms.map(ant => `<span class="vocab-tag ant-tag">${ant}</span>`).join('')}
                        </div>
                    </div>
                </div>

                <div class="detail-segment example-wrapper">
                    <h4 class="segment-label">Example Sentence</h4>
                    <blockquote class="context-quote">
                        "${vocabularyModel.example.replace(new RegExp(vocabularyModel.word, 'gi'), match => `<mark>${match}</mark>`)}"
                    </blockquote>
                </div>
            </div>
        `;

        // Immediately link event listeners onto newly initialized inner DOM elements
        bindVaultToggleAction(wordCardDisplayContainer.querySelector('.btn-save-vault'));
    };

    const processSearchQuery = () => {
        const normalizedQueryValue = searchFormInput.value.trim().toLowerCase();
        if (normalizedQueryValue.length === 0) return;

        const structuralMatchResult = vocabularyDatabase.find(item => item.word.toLowerCase() === normalizedQueryValue);

        if (structuralMatchResult) {
            renderWordResultCard(structuralMatchResult);
        } else {
            // Graceful No Matches Output rendering context state bounds
            wordCardDisplayContainer.innerHTML = `
                <div class="search-no-results-fallback" style="text-align: center; padding: var(--space-md) 0;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--clr-text-muted)" stroke-width="1.5" style="margin-bottom: var(--space-sm); opacity: 0.6;">
                        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <p class="segment-text" style="color: var(--clr-text-muted);">Term code matching sequence undefined within core localized metrics database.</p>
                </div>
            `;
        }
    };

    searchFormInput.addEventListener('input', debounce(processSearchQuery, 250));
    
    const searchFormParent = searchFormInput.closest('.search-form');
    if (searchFormParent) {
        searchFormParent.addEventListener('submit', (e) => {
            e.preventDefault();
            processSearchQuery();
        });
    }
}

// ==========================================================================
// 10. DAILY AUTOMATED WORD GENERATOR ENGINE IMPLEMENTATION
// ==========================================================================
function initializeDailyWordGenerator() {
    const dailyWordChallengeCardContainer = document.querySelector('.challenge-cards-stack');
    if (!dailyWordChallengeCardContainer) return;

    // Use current calendar day mapping calculations to securely pick index deterministically
    const currentCalendarEpochDays = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const deterministicDatabaseIndex = currentCalendarEpochDays % vocabularyDatabase.length;
    const selectedDailyWordObject = vocabularyDatabase[deterministicDatabaseIndex];

    dailyWordChallengeCardContainer.innerHTML = `
        <div class="challenge-interactive-card">
            <div class="c-card-header">
                <span class="c-card-badge">Daily High-Value Configuration</span>
                <h3 class="c-card-term">${selectedDailyWordObject.word}</h3>
            </div>
            <p class="c-card-definition">${selectedDailyWordObject.meaning}</p>
            <div class="c-card-footer-actions">
                <button class="btn btn-secondary btn-sm btn-daily-master-trigger" data-word="${selectedDailyWordObject.word}">Mark as Mastered</button>
                <button class="btn btn-icon btn-daily-shuffle" aria-label="Evaluate next random available cluster node item sequence">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
            </div>
        </div>
    `;

    // Hook action controls
    const masterTrigger = dailyWordChallengeCardContainer.querySelector('.btn-daily-master-trigger');
    masterTrigger.addEventListener('click', function() {
        this.textContent = 'Synchronized ✓';
        this.disabled = true;
        this.style.opacity = '0.7';
        platformState.learnedWordsCount += 1;
        savePlatformState();
    });

    const shuffleTrigger = dailyWordChallengeCardContainer.querySelector('.btn-daily-shuffle');
    shuffleTrigger.addEventListener('click', () => {
        const completelyRandomIndex = Math.floor(Math.random() * vocabularyDatabase.length);
        const randomWordObj = vocabularyDatabase[completelyRandomIndex];
        // Recursive injection execution
        selectedDailyWordObject.word = randomWordObj.word;
        selectedDailyWordObject.meaning = randomWordObj.meaning;
        initializeDailyWordGenerator();
    });
}

// ==========================================================================
// 11. QUIZ ARENA SYSTEMS PLATFORM INTERFACE MATRIX
// ==========================================================================
function initializeQuizArenaInterface() {
    const quizCoreContainer = document.querySelector('.quiz-core-interface');
    if (!quizCoreContainer) return;

    const renderActiveQuestionState = () => {
        const activeQuestionModel = quizQuestions[activeQuizIndex];
        
        quizCoreContainer.innerHTML = `
            <div class="quiz-interface-top">
                <span class="question-tracker">Evaluation Unit ${activeQuizIndex + 1} of ${quizQuestions.length}</span>
                <div class="arena-countdown" aria-label="Remaining time metric trace bar">
                    <div class="countdown-fill" style="width: ${((activeQuizIndex + 1) / quizQuestions.length) * 100}%;"></div>
                </div>
            </div>

            <div class="quiz-prompt-area">
                <h3 class="quiz-prompt-text">${activeQuestionModel.question}</h3>
            </div>

            <div class="quiz-options-group" role="radiogroup" aria-label="Multiple choice answers options pool">
                ${activeQuestionModel.options.map((optionText, idx) => `
                    <button type="button" role="radio" aria-checked="false" class="quiz-option-button" data-index="${idx}">
                        <span class="option-index">${String.fromCharCode(65 + idx)}</span>
                        <span class="option-string">${optionText}</span>
                    </button>
                `).join('')}
            </div>

            <div class="quiz-interface-footer">
                <button class="btn btn-secondary btn-skip-phase">Skip Phase</button>
                <button class="btn btn-primary btn-submit-quiz-evaluation" disabled>Submit Evaluation</button>
            </div>
        `;

        // Register interactive handlers across selection choices
        let chosenAnswerIndex = null;
        const optionsButtons = quizCoreContainer.querySelectorAll('.quiz-option-button');
        const submitButton = quizCoreContainer.querySelector('.btn-submit-quiz-evaluation');

        optionsButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                optionsButtons.forEach(b => {
                    b.classList.remove('selected');
                    b.setAttribute('aria-checked', 'false');
                });
                this.classList.add('selected');
                this.setAttribute('aria-checked', 'true');
                chosenAnswerIndex = parseInt(this.getAttribute('data-index'), 10);
                submitButton.disabled = false;
            });
        });

        quizCoreContainer.querySelector('.btn-skip-phase').addEventListener('click', transitionToNextQuizSequenceStep);
        
        submitButton.addEventListener('click', () => {
            if (chosenAnswerIndex === activeQuestionModel.correctIndex) {
                activeQuizScoreAccumulator += 100;
                optionsButtons[chosenAnswerIndex].style.borderColor = '#10B981';
                optionsButtons[chosenAnswerIndex].style.background = 'rgba(16, 185, 129, 0.08)';
            } else {
                optionsButtons[chosenAnswerIndex].style.borderColor = '#F43F5E';
                optionsButtons[chosenAnswerIndex].style.background = 'rgba(244, 63, 94, 0.08)';
                optionsButtons[activeQuestionModel.correctIndex].style.borderColor = '#10B981';
            }

            submitButton.disabled = true;
            optionsButtons.forEach(b => b.disabled = true);

            setTimeout(transitionToNextQuizSequenceStep, 1500);
        });
    };

    const transitionToNextQuizSequenceStep = () => {
        if (activeQuizIndex + 1 < quizQuestions.length) {
            activeQuizIndex++;
            renderActiveQuestionState();
        } else {
            renderTerminalScoreSummaryScreen();
        }
    };

    const renderTerminalScoreSummaryScreen = () => {
        // Mutate storage state values permanently matching performance parameters metrics
        platformState.quizScore += activeQuizScoreAccumulator;
        savePlatformState();

        quizCoreContainer.innerHTML = `
            <div class="terminal-quiz-summary" style="text-align: center; padding: var(--space-md) 0;">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--clr-secondary)" stroke-width="1.5" style="margin-bottom: var(--space-md); filter: drop-shadow(0 0 15px rgba(0,212,255,0.4));">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <h3 class="target-word" style="margin-bottom: var(--space-xs);">Evaluation Phase Concluded</h3>
                <p class="segment-text" style="color: var(--clr-text-muted); margin-bottom: var(--space-md);">Linguistic evaluation metrics calculation verified effectively.</p>
                
                <div class="m-status-value" style="font-size: 3rem; color: #FFFFFF; margin-bottom: var(--space-lg);">
                    +${activeQuizScoreAccumulator} <span class="points-label" style="font-size: 1.5rem;">Arena Pts</span>
                </div>

                <button class="btn btn-primary btn-restart-arena-sequence">Re-initialize Arena Protocol</button>
            </div>
        `;

        quizCoreContainer.querySelector('.btn-restart-arena-sequence').addEventListener('click', () => {
            activeQuizIndex = 0;
            activeQuizScoreAccumulator = 0;
            renderActiveQuestionState();
        });
    };

    // Trigger initial question rendering configuration trace path load
    renderActiveQuestionState();
}

// ==========================================================================
// 12. STREAK RETENTION TRACKING SYSTEM LOGIC ENGINE
// ==========================================================================
function processStreakRetentionTracking() {
    const timestampTodayStr = new Date().toISOString().split('T')[0];
    
    if (platformState.lastVisitDate) {
        const timestampLastVisitStr = platformState.lastVisitDate.split('T')[0];
        
        if (timestampTodayStr !== timestampLastVisitStr) {
            const timeDifferenceDelta = new Date(timestampTodayStr) - new Date(timestampLastVisitStr);
            const conversionDaysDelta = Math.floor(timeDifferenceDelta / (1000 * 60 * 60 * 24));

            if (conversionDaysDelta === 1) {
                // Increment contiguous sequence pipeline configuration state
                platformState.currentStreak += 1;
                if (platformState.currentStreak > platformState.bestStreak) {
                    platformState.bestStreak = platformState.currentStreak;
                }
            } else if (conversionDaysDelta > 1) {
                // Disconnection breakage detected fallback default reset configuration logic path execution
                platformState.currentStreak = 1;
            }
            platformState.lastVisitDate = new Date().toISOString();
            savePlatformState();
        }
    } else {
        platformState.lastVisitDate = new Date().toISOString();
        platformState.currentStreak = 1;
        savePlatformState();
    }
}

// ==========================================================================
// 13. PERSONAL LINGUISTIC VAULT INTERACTION TOGGLE BINDERS
// ==========================================================================
function bindVaultToggleAction(targetButtonElement) {
    if (!targetButtonElement) return;

    targetButtonElement.addEventListener('click', function(e) {
        e.stopPropagation();
        const targetedWordString = this.getAttribute('data-word');
        if (!targetedWordString) return;

        const internalIndexPosition = platformState.savedVaultWords.indexOf(targetedWordString);

        if (internalIndexPosition > -1) {
            // Remove word entry context data trace parameters safely
            platformState.savedVaultWords.splice(internalIndexPosition, 1);
            this.classList.remove('saved-active-token');
            const svgIconElement = this.querySelector('svg');
            if (svgIconElement) svgIconElement.setAttribute('fill', 'none');
        } else {
            // Append target parameter definitions directly inside state tracking stack
            platformState.savedVaultWords.push(targetedWordString);
            this.classList.add('saved-active-token');
            const svgIconElement = this.querySelector('svg');
            if (svgIconElement) svgIconElement.setAttribute('fill', 'currentColor');
        }

        savePlatformState();
    });
}

// ==========================================================================
// 14. PERFORMANCE PROGRESS INTEGRATED TELEMETRY DASHBOARD SYNCHRONIZER
// ==========================================================================
function synchronizeDashboardMetrics() {
    const valuesQueryMap = [
        { selector: '.dashboard-summary-grid .telemetry-card:nth-child(1) .telemetry-val', value: platformState.learnedWordsCount },
        { selector: '.dashboard-summary-grid .telemetry-card:nth-child(2) .telemetry-val', value: `${platformState.currentStreak} Days` },
        { selector: '.quiz-metrics-sidebar .metric-status-card:nth-child(1) .m-status-value', value: `${platformState.quizScore.toLocaleString()} pts` },
        { selector: '.streak-tracker-display strong', value: `${platformState.currentStreak} Days` }
    ];

    valuesQueryMap.forEach(item => {
        const DOMNode = document.querySelector(item.selector);
        if (DOMNode) {
            DOMNode.textContent = item.value;
        }
    });
}

// ==========================================================================
// 15. FAQ STRUCTURAL ACCORDION WORKSPACE SYSTEM MAPPING ARCHITECTURE
// ==========================================================================
function initializeFAQAccordionWorkspace() {
    const accordionTriggersList = document.querySelectorAll('.accordion-trigger');

    accordionTriggersList.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const correspondingPanelId = this.getAttribute('aria-controls');
            const targetedPanelNode = document.getElementById(correspondingPanelId);
            if (!targetedPanelNode) return;

            const isCurrentlyExpanded = this.getAttribute('aria-expanded') === 'true';

            // Collapse remaining peer elements to enforce singular focus constraints model
            accordionTriggersList.forEach(peerTrigger => {
                if (peerTrigger !== this) {
                    peerTrigger.setAttribute('aria-expanded', 'false');
                    const peerPanel = document.getElementById(peerTrigger.getAttribute('aria-controls'));
                    if (peerPanel) {
                        peerPanel.style.display = 'none';
                        peerPanel.setAttribute('hidden', '');
                    }
                }
            });

            // Toggle active target element transition configurations parameters state
            if (isCurrentlyExpanded) {
                this.setAttribute('aria-expanded', 'false');
                targetedPanelNode.style.display = 'none';
                targetedPanelNode.setAttribute('hidden', '');
            } else {
                this.setAttribute('aria-expanded', 'true');
                targetedPanelNode.style.display = 'block';
                targetedPanelNode.removeAttribute('hidden');
                
                // CSS micro animate smooth presentation tracking parameters trigger verification injection hook
                targetedPanelNode.style.animation = 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
            }
        });
    });
}

// ==========================================================================
// 16. CONTACT TRANSMISSION COMPONENT COMPLIANCE VALIDATION PIPELINE
// ==========================================================================
function initializeContactFormValidation() {
    const underlyingFormRoot = document.querySelector('.interactive-form-root');
    if (!underlyingFormRoot) return;

    const executeValidationSequence = (e) => {
        e.preventDefault();

        const inputFieldIdentity = document.getElementById('contact-name');
        const inputFieldEmailRouting = document.getElementById('contact-email');
        const inputFieldMessageManifest = document.getElementById('contact-message');

        let isValidationSequenceClear = true;

        const clearPriorValidationVisualSignatures = (element) => {
            element.style.borderColor = '';
            const existingAlert = element.parentNode.querySelector('.form-alert-message');
            if (existingAlert) existingAlert.remove();
        };

        const injectValidationVisualSignature = (element, messageText) => {
            element.style.borderColor = '#F43F5E';
            const alertNode = document.createElement('span');
            alertNode.className = 'form-alert-message';
            alertNode.textContent = messageText;
            alertNode.style.cssText = 'color: #FFA3B1; font-size: 0.75rem; margin-top: 0.25rem; display: block;';
            element.parentNode.appendChild(alertNode);
            isValidationSequenceClear = false;
        };

        [inputFieldIdentity, inputFieldEmailRouting, inputFieldMessageManifest].forEach(clearPriorValidationVisualSignatures);

        // Core Constraint Rules Evaluation Logic Blocks
        if (!inputFieldIdentity.value.trim()) {
            injectValidationVisualSignature(inputFieldIdentity, "Identity nomenclature registry value cannot remain empty.");
        }

        const standardEmailRFCRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!standardEmailRFCRegexPattern.test(inputFieldEmailRouting.value.trim())) {
            injectValidationVisualSignature(inputFieldEmailRouting, "Provide a valid routing email address protocol format.");
        }

        if (inputFieldMessageManifest.value.trim().length < 10) {
            injectValidationVisualSignature(inputFieldMessageManifest, "Transmission content specifications length must exceed 10 characters.");
        }

        if (isValidationSequenceClear) {
            const submitButtonNode = underlyingFormRoot.querySelector('.btn-block-submit');
            const preservedButtonLabel = submitButtonNode.textContent;
            
            submitButtonNode.disabled = true;
            submitButtonNode.textContent = "Transmitting Packet Clear...";

            setTimeout(() => {
                submitButtonNode.style.background = '#10B981';
                submitButtonNode.style.boxShadow = '0 0 20px rgba(16,185,129,0.4)';
                submitButtonNode.textContent = "Transmission Dynamic Interlock Verified ✓";
                
                underlyingFormRoot.reset();

                setTimeout(() => {
                    submitButtonNode.disabled = false;
                    submitButtonNode.style.background = '';
                    submitButtonNode.style.boxShadow = '';
                    submitButtonNode.textContent = preservedButtonLabel;
                }, 3500);
            }, 1500);
        }
    };

    underlyingFormRoot.addEventListener('submit', executeValidationSequence);
}

// ==========================================================================
// 17. SCROLL DETECTED BACK TO TOP UTILITY MODULE
// ==========================================================================
function initializeBackToTopUtility() {
    const structuralTriggerAnchor = document.querySelector('.back-top-trigger');
    if (!structuralTriggerAnchor) return;

    // Build dynamic viewport standard overlay interface element if preferred instead of text-bound links mapping
    const handleViewportVisibilityConstraints = () => {
        if (window.scrollY > 600) {
            structuralTriggerAnchor.style.opacity = '1';
            structuralTriggerAnchor.style.transform = 'translateY(0)';
        } else {
            structuralTriggerAnchor.style.opacity = '0.5';
        }
    };

    window.addEventListener('scroll', throttle(handleViewportVisibilityConstraints, 150));
}

// ==========================================================================
// 18. ADAPTIVE CHROMATIC THEME ARCHITECTURE INTERLOCK (DARK / LIGHT PARADIGM)
// ==========================================================================
function initializeAdaptiveThemeManager() {
    // Generate dynamic toggle node directly into structural menu interfaces if required layout node handles are present
    const actionNavbarActionsWrapper = document.querySelector('.nav-actions');
    if (!actionNavbarActionsWrapper) return;

    const configurationToggleBtn = document.createElement('button');
    configurationToggleBtn.className = 'btn btn-icon btn-theme-toggle';
    configurationToggleBtn.setAttribute('aria-label', 'Toggle System Color Spectrum Paradigm');
    configurationToggleBtn.style.marginRight = '1rem';
    configurationToggleBtn.innerHTML = `
        <svg class="theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none;"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
        <svg class="theme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
    `;

    actionNavbarActionsWrapper.insertBefore(configurationToggleBtn, actionNavbarActionsWrapper.firstChild);

    const sunIcon = configurationToggleBtn.querySelector('.theme-icon-sun');
    const moonIcon = configurationToggleBtn.querySelector('.theme-icon-moon');

    const enforceThemeParadigm = (targetTheme, savePreference = true) => {
        if (targetTheme === 'light') {
            document.documentElement.style.setProperty('--bg-deep', '#F8FAFC');
            document.documentElement.style.setProperty('--clr-text', '#0F172A');
            document.documentElement.style.setProperty('--clr-text-muted', '#64748B');
            document.documentElement.style.setProperty('--glass-bg', 'rgba(15, 23, 42, 0.03)');
            document.documentElement.style.setProperty('--glass-border', 'rgba(15, 23, 42, 0.08)');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            if(savePreference) platformState.theme = 'light';
        } else {
            document.documentElement.style.setProperty('--bg-deep', '#050816');
            document.documentElement.style.setProperty('--clr-text', '#F8FAFC');
            document.documentElement.style.setProperty('--clr-text-muted', '#94A3B8');
            document.documentElement.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.03)');
            document.documentElement.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.08)');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            if(savePreference) platformState.theme = 'dark';
        }
        if(savePreference) savePlatformState();
    };

    // Evaluate initialization state alignment metrics configurations parameters target
    enforceThemeParadigm(platformState.theme, false);

    configurationToggleBtn.addEventListener('click', () => {
        const nextTargetParadigmState = platformState.theme === 'dark' ? 'light' : 'dark';
        enforceThemeParadigm(nextTargetParadigmState);
    });
}

// ==========================================================================
// 19. THREE.JS SPATIAL PARTICLE VECTOR INTERACTION LOGIC CONTROL
// ==========================================================================
function initializeParticleInteractionsPipeline() {
    // Graceful absolute safe exit configuration if execution window does not find Three.js canvas active layer
    const backgroundCanvasContainer = document.getElementById('bg-canvas');
    if (!backgroundCanvasContainer || typeof THREE === 'undefined') return;

    // Throttled tracking vector captures mapping mouse position variations
    const pointerCoordinatesState = { normalizedX: 0, normalizedY: 0 };

    const capturePointerVectors = (e) => {
        pointerCoordinatesState.normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
        pointerCoordinatesState.normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
        
        // Dispatch custom interaction data payload targeting active Three rendering loops hook directly if accessible
        if (window.LexoraBackgroundEngineInstance && typeof window.LexoraBackgroundEngineInstance.updateInteractionVectors === 'function') {
            window.LexoraBackgroundEngineInstance.updateInteractionVectors(pointerCoordinatesState);
        }
    };

    window.addEventListener('mousemove', throttle(capturePointerVectors, 30));
}

// ==========================================================================
// 20. SYSTEM CORE INITIALIZATION ORCHESTRATOR LAYER
// ==========================================================================
function bootPlatformSystemArchitecture() {
    try {
        loadPlatformState();
        processStreakRetentionTracking();
        initializePreloader();
        initializeMobileNavigation();
        initializeNavbarBehavior();
        initializeScrollRevealPipeline();
        initializeHeroTypingEngine();
        initializeInteractiveFloatingEffects();
        initializeVocabularySearchEngine();
        initializeDailyWordGenerator();
        initializeQuizArenaInterface();
        initializeFAQAccordionWorkspace();
        initializeContactFormValidation();
        initializeBackToTopUtility();
        initializeAdaptiveThemeManager();
        initializeParticleInteractionsPipeline();
        
        console.log("Lexora Production Operations Layer Fully Synthesized and Operational.");
    } catch (criticalBootFaultException) {
        console.error("Critical Platform Boot Structural Error Event Detected:", criticalBootFaultException);
    }
}

// Execute Integration Bootstrap Pipeline sequence upon DOM initialization compliance
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPlatformSystemArchitecture);
} else {
    bootPlatformSystemArchitecture();
}
