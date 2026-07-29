/* ===================================================================
   DEAR, RINDA — Premium Birthday Website
   Architecture: ES6+ Class-based modular architecture
   Dependencies: None (Vanilla JS)
   Performance: requestAnimationFrame, passive listeners, GPU compositing
   =================================================================== */

/* -------------------------------------------------------------------
   CONSTANTS
   ------------------------------------------------------------------- */
const ALLOWED_NAMES = ['rinda', 'rinda asmita'];
const GALLERY_DATA = [
    { filename: 'photo1-sma.jpg', caption: 'Mungkin... semuanya dimulai dari sini.' },
    { filename: 'photo2-date.jpg', caption: 'Hari itu sederhana. Tapi selalu aku ingat.' },
    { filename: 'photo3-date.jpg', caption: 'Akhirnya... kita benar-benar bertemu lagi.' },
    { filename: 'photo4-date.jpg', caption: 'Semoga hari seperti ini datang lebih sering.' },
    { filename: 'photo5-hug.jpg', caption: 'Pelukan sederhana. Tapi rasanya nyaman.' },
    { filename: 'photo6-hug2.jpg', caption: 'Kalau boleh jujur...\naku belum mau melepaskan pelukan itu.' },
    { filename: 'photo7-kiss.jpg', caption: 'Mungkin cuma sebentar.\nTapi akan selalu aku ingat.' },
    { filename: 'photo8-kiss2.jpg', caption: 'Kalau ada foto favorit...\nmungkin ini salah satunya.' },
    { filename: 'photo10-car2.jpg', caption: 'Perjalanan terasa lebih singkat kalau sama kamu.' },
    { filename: 'photo12-sunset1.jpg', caption: 'Langitnya indah.\n\nTapi harinya lebih indah.' },
    { filename: 'photo13-sunset2.jpg', caption: 'Kalau suatu hari nanti kita melihat senja lagi...\n\nSemoga kita masih saling tersenyum.' }
];

const PHOTOS_BASE_PATH = 'assets/photos/';
const MUSIC_PATH = 'assets/music/Golden-Brown.mp3';

const SELECTORS = {
    SCREENS: '.screen',
    LANDING: '#screen-landing',
    LOADING: '#screen-loading',
    EARPHONE: '#screen-earphone',
    INTRO: '#screen-intro',
    BIRTHDAY: '#screen-birthday',
    GALLERY: '#screen-gallery',
    ENDING: '#screen-ending',
    FORM: '#form-landing',
    INPUT: '#input-visitor-name',
    VALIDATION: '#validation-message',
    EARPHONE_BUTTON: '#button-earphone-confirm',
    INTRO_COPY: '.intro-copy',
    INTRO_SENTENCES: '.intro-sentence',
    INTRO_HELPER: '.intro-helper',
    INTRO_HEART: '.intro-heart',
    BIRTHDAY_TITLE: '#birthday-title',
    BIRTHDAY_SUBTITLE: '.birthday-subtitle',
    BIRTHDAY_MESSAGE: '.birthday-message',
    BIRTHDAY_HEART: '.birthday-heart-icon',
    BIRTHDAY_FOOTER: '.birthday-footer',
    BIRTHDAY_BUTTON: '#button-birthday-next',
    GALLERY_IMAGE: '#gallery-image',
    GALLERY_CAPTION: '#gallery-caption',
    GALLERY_FRAME: '#gallery-frame',
    GALLERY_PREV: '#gallery-prev',
    GALLERY_NEXT: '#gallery-next',
    GALLERY_FINISH: '#gallery-finish',
    GALLERY_DOTS: '#gallery-progress-dots',
    ENDING_ACTIVE: '#ending-active',
    ENDING_SOURCES: '.ending-source',
    CANVAS: '#particle-canvas',
    LOADING_MESSAGES: '.loading-message',
    LOADING_RING: '.loading-ring-container',
    PAGE_BG: '#page-background'
};

const CLASSES = {
    ACTIVE: 'screen--active',
    FADE_OUT: 'screen--fade-out',
    HIDDEN: 'hidden',
    IS_VISIBLE: 'is-visible',
    IS_ACTIVE: 'is-active',
    IS_TYPING: 'is-typing',
    IS_HIDDEN: 'is-hidden',
    IS_LOADING: 'is-loading',
    IS_FADE_OUT: 'is-fade-out',
    SHOW: 'show',
    FADE_OUT_IMG: 'fade-out',
    KEN_BURNS: 'ken-burns',
    INTRO_REVEALED: 'intro--revealed',
    INPUT_ERROR: 'input--error',
    INPUT_SUCCESS: 'input--success',
    INPUT_SHAKE: 'input--shake',
    VALIDATION_SUCCESS: 'validation-message--success',
    DOTS_ACTIVE: 'is-active',
    GLOW: 'ending-paragraph--glow'
};

/* -------------------------------------------------------------------
   UTILITY
   ------------------------------------------------------------------- */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/* -------------------------------------------------------------------
   AUDIO MANAGER
   ------------------------------------------------------------------- */
class AudioManager {
    #audio;
    #volume;
    #isPlaying;

    constructor() {
        this.#audio = new Audio(MUSIC_PATH);
        this.#audio.loop = false;
        this.#audio.volume = 0;
        this.#audio.preload = 'auto';
        this.#volume = 0;
        this.#isPlaying = false;
    }

    get isPlaying() { return this.#isPlaying; }

    async play() {
        try {
            await this.#audio.play();
            this.#isPlaying = true;
        } catch (err) {
            console.warn('AudioManager: Autoplay blocked, waiting for user interaction.');
            this.#isPlaying = false;
        }
    }

    pause() { this.#audio.pause(); this.#isPlaying = false; }

    stop() {
        this.#audio.pause();
        this.#audio.currentTime = 0;
        this.#isPlaying = false;
    }

    reset() {
        this.#audio.currentTime = 0;
        this.#volume = 0;
        this.#audio.volume = 0;
    }

    async fadeTo(targetVolume, duration = 2000) {
        const steps = 30;
        const stepDuration = duration / steps;
        const startVolume = this.#volume;
        const diff = targetVolume - startVolume;
        for (let i = 1; i <= steps; i++) {
            const progress = i / steps;
            this.#volume = startVolume + diff * progress;
            this.#audio.volume = Math.max(0, Math.min(1, this.#volume));
            await delay(stepDuration);
        }
        this.#volume = Math.max(0, Math.min(1, targetVolume));
        this.#audio.volume = this.#volume;
    }

    async fadeIn(duration = 2400) {
        this.reset();
        await this.play();
        await this.fadeTo(0.85, duration);
    }

    async fadeOut(duration = 5000) {
        await this.fadeTo(0, duration);
        this.pause();
    }
}

/* -------------------------------------------------------------------
   TYPING ENGINE
   ------------------------------------------------------------------- */
class TypingEngine {
    #element;
    #speed;
    #text;
    #isComplete;
    #onCompleteCallback;
    #skipRequested;

    constructor(element, options = {}) {
        this.#element = element;
        this.#speed = options.speed || 88;
        this.#text = options.text || element.textContent || '';
        this.#isComplete = false;
        this.#onCompleteCallback = null;
        this.#skipRequested = false;
        this.#element.addEventListener('click', () => this.#skip(), { once: true });
    }

    get isComplete() { return this.#isComplete; }

    onComplete(callback) { this.#onCompleteCallback = callback; }

    #skip() { this.#skipRequested = true; }

    async start() {
        this.#element.textContent = '';
        this.#element.classList.remove(CLASSES.IS_HIDDEN);
        this.#element.classList.add(CLASSES.IS_VISIBLE, CLASSES.IS_TYPING);
        this.#isComplete = false;
        this.#skipRequested = false;
        for (const char of this.#text) {
            if (this.#skipRequested) {
                this.#element.textContent = this.#text;
                break;
            }
            this.#element.textContent += char;
            await delay(this.#speed);
        }
        this.#element.classList.remove(CLASSES.IS_TYPING);
        this.#isComplete = true;
        if (this.#onCompleteCallback) this.#onCompleteCallback();
    }

    destroy() { this.#element.removeEventListener('click', () => this.#skip()); }
}

/* -------------------------------------------------------------------
   SCREEN MANAGER
   ------------------------------------------------------------------- */
class ScreenManager {
    #screens;
    #currentId;
    #isTransitioning;

    constructor() {
        this.#screens = document.querySelectorAll(SELECTORS.SCREENS);
        this.#currentId = null;
        this.#isTransitioning = false;
    }

    get currentId() { return this.#currentId; }
    get isTransitioning() { return this.#isTransitioning; }

    async show(screenId) {
        if (this.#isTransitioning) return;
        this.#isTransitioning = true;
        const target = document.getElementById(screenId);
        if (!target) { this.#isTransitioning = false; return; }
        const current = this.#currentId ? document.getElementById(this.#currentId) : null;
        if (current) {
            current.classList.add(CLASSES.FADE_OUT);
            current.classList.remove(CLASSES.ACTIVE);
            current.setAttribute('aria-hidden', 'true');
            await delay(600);
            current.classList.add(CLASSES.HIDDEN);
            current.classList.remove(CLASSES.FADE_OUT);
        }
        target.classList.remove(CLASSES.HIDDEN);
        target.setAttribute('aria-hidden', 'false');
        void target.offsetHeight;
        target.classList.add(CLASSES.ACTIVE);
        this.#currentId = screenId;
        this.#isTransitioning = false;
    }

    showInstant(screenId) {
        const target = document.getElementById(screenId);
        if (!target) return;
        this.#screens.forEach(s => {
            s.classList.add(CLASSES.HIDDEN);
            s.classList.remove(CLASSES.ACTIVE, CLASSES.FADE_OUT);
            s.setAttribute('aria-hidden', 'true');
        });
        target.classList.remove(CLASSES.HIDDEN);
        target.classList.add(CLASSES.ACTIVE);
        target.setAttribute('aria-hidden', 'false');
        this.#currentId = screenId;
    }

    async showQuick(screenId, delayMs = 800) {
        if (this.#isTransitioning) return;
        this.#isTransitioning = true;
        const current = this.#currentId ? document.getElementById(this.#currentId) : null;
        if (current) {
            current.classList.remove(CLASSES.ACTIVE);
            current.setAttribute('aria-hidden', 'true');
        }
        await delay(delayMs);
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.remove(CLASSES.HIDDEN);
            target.setAttribute('aria-hidden', 'false');
            void target.offsetHeight;
            target.classList.add(CLASSES.ACTIVE);
        }
        this.#currentId = screenId;
        this.#isTransitioning = false;
    }
}

/* -------------------------------------------------------------------
   VALIDATION MANAGER
   ------------------------------------------------------------------- */
class ValidationManager {
    #input;
    #message;

    constructor() {
        this.#input = document.querySelector(SELECTORS.INPUT);
        this.#message = document.querySelector(SELECTORS.VALIDATION);
    }

    get input() { return this.#input; }

    clear() {
        this.#message.classList.remove(CLASSES.IS_VISIBLE, CLASSES.VALIDATION_SUCCESS);
        this.#message.textContent = '';
        this.#input.classList.remove(CLASSES.INPUT_ERROR, CLASSES.INPUT_SUCCESS);
    }

    showError(text) {
        this.#message.textContent = text;
        this.#message.classList.add(CLASSES.IS_VISIBLE);
        this.#message.classList.remove(CLASSES.VALIDATION_SUCCESS);
        this.#input.classList.remove(CLASSES.INPUT_SUCCESS);
        this.#input.classList.add(CLASSES.INPUT_ERROR, CLASSES.INPUT_SHAKE);
        setTimeout(() => this.#input.classList.remove(CLASSES.INPUT_SHAKE), 600);
    }

    showSuccess() {
        this.#input.classList.remove(CLASSES.INPUT_ERROR);
        this.#input.classList.add(CLASSES.INPUT_SUCCESS);
        this.#message.textContent = 'Nama terverifikasi.';
        this.#message.classList.add(CLASSES.IS_VISIBLE, CLASSES.VALIDATION_SUCCESS);
    }

    normalizeInput(value) { return value.replace(/\s+/g, ' ').trim().toLowerCase(); }
    isValid(value) { return ALLOWED_NAMES.includes(value); }
}

/* -------------------------------------------------------------------
   LOADING SEQUENCE
   ------------------------------------------------------------------- */
class LoadingSequence {
    #messages;

    constructor() { this.#messages = document.querySelectorAll(SELECTORS.LOADING_MESSAGES); }

    async animate() {
        const ringContainer = document.querySelector(SELECTORS.LOADING_RING);
        if (ringContainer) ringContainer.classList.add(CLASSES.HIDDEN);
        this.#messages.forEach(msg => msg.classList.remove(CLASSES.IS_ACTIVE, CLASSES.IS_FADE_OUT));
        for (let i = 0; i < this.#messages.length; i++) {
            this.#messages[i].classList.add(CLASSES.IS_ACTIVE);
            await delay(400);
            await delay(2500);
            this.#messages[i].classList.remove(CLASSES.IS_ACTIVE);
            this.#messages[i].classList.add(CLASSES.IS_FADE_OUT);
            await delay(400);
            this.#messages[i].classList.remove(CLASSES.IS_FADE_OUT);
        }
        await delay(2000);
    }
}

/* -------------------------------------------------------------------
   INTRO SEQUENCE
   ------------------------------------------------------------------- */
class IntroSequence {
    #sentences;
    #helper;
    #heart;
    #continueBtn;
    #advanceResolver;
    #isCompleted;
    #audioManager;

    constructor(audioManager) {
        this.#sentences = document.querySelectorAll(SELECTORS.INTRO_SENTENCES);
        this.#helper = document.querySelector(SELECTORS.INTRO_HELPER);
        this.#heart = document.querySelector(SELECTORS.INTRO_HEART);
        this.#audioManager = audioManager;
        this.#isCompleted = false;
        this.#advanceResolver = null;
        this.#continueBtn = null;
        this.#setupContinueButton();
    }

    get isCompleted() { return this.#isCompleted; }

    #setupContinueButton() {
        this.#continueBtn = document.createElement('button');
        this.#continueBtn.type = 'button';
        this.#continueBtn.id = 'intro-continue';
        this.#continueBtn.className = 'button button--primary';
        this.#continueBtn.innerHTML = 'Lanjut <span class="button__icon" aria-hidden="true">❤️</span>';
        this.#continueBtn.disabled = true;
        this.#continueBtn.setAttribute('aria-hidden', 'true');
        const introCopy = document.querySelector(SELECTORS.INTRO_COPY);
        if (introCopy) introCopy.appendChild(this.#continueBtn);
    }

    #waitForAdvance() {
        return new Promise(resolve => { this.#advanceResolver = resolve; });
    }

    #handleAdvance() {
        if (!this.#advanceResolver || this.#isCompleted) return;
        this.#hideHelper();
        const resolve = this.#advanceResolver;
        this.#advanceResolver = null;
        resolve();
    }

    #showHelper() {
        this.#helper?.classList.add(CLASSES.IS_VISIBLE);
        this.#helper?.setAttribute('aria-hidden', 'false');
    }

    #hideHelper() {
        this.#helper?.classList.remove(CLASSES.IS_VISIBLE);
        this.#helper?.setAttribute('aria-hidden', 'true');
    }

    #showHeart() { this.#heart?.classList.add(CLASSES.IS_VISIBLE); }

    #showContinueButton() {
        if (!this.#continueBtn) return;
        this.#continueBtn.disabled = false;
        this.#continueBtn.setAttribute('aria-hidden', 'false');
        this.#continueBtn.classList.add(CLASSES.IS_VISIBLE);
        this.#continueBtn.addEventListener('click', () => {
            this.#isCompleted = true;
            if (this.#continueBtn) {
                this.#continueBtn.classList.remove(CLASSES.IS_VISIBLE);
                this.#continueBtn.setAttribute('aria-hidden', 'true');
            }
        }, { once: true });
    }

    async start() {
        this.#isCompleted = false;
        this.#sentences.forEach(s => {
            s.textContent = '';
            s.classList.remove(CLASSES.IS_VISIBLE, CLASSES.IS_HIDDEN, CLASSES.IS_TYPING);
            s.classList.add(CLASSES.IS_HIDDEN);
        });
        this.#heart?.classList.remove(CLASSES.IS_VISIBLE);
        this.#hideHelper();

        const introScreen = document.querySelector(SELECTORS.INTRO);
        const advanceHandler = () => this.#handleAdvance();
        const keyHandler = (e) => {
            if (e.code !== 'Space' && e.key !== ' ') return;
            if (!introScreen || introScreen.classList.contains(CLASSES.HIDDEN)) return;
            e.preventDefault();
            this.#handleAdvance();
        };

        introScreen?.addEventListener('click', advanceHandler, { passive: true });
        document.addEventListener('keydown', keyHandler);

        this.#audioManager.reset();
        await this.#audioManager.play();
        this.#audioManager.fadeIn(2400);

        await delay(600);

        const helperTimer = setTimeout(() => {
            if (!this.#isCompleted && this.#helper) this.#showHelper();
        }, 800);

        for (let i = 0; i < this.#sentences.length; i++) {
            const sentence = this.#sentences[i];
            const text = sentence.dataset.text || sentence.textContent.trim();
            const engine = new TypingEngine(sentence, { text, speed: 88 });
            await engine.start();
            sentence.classList.remove(CLASSES.IS_HIDDEN);
            sentence.classList.add(CLASSES.IS_VISIBLE);

            if (i < this.#sentences.length - 1) {
                this.#showHelper();
                await this.#waitForAdvance();
                this.#hideHelper();
                sentence.classList.remove(CLASSES.IS_VISIBLE, CLASSES.IS_TYPING);
                sentence.classList.add(CLASSES.IS_HIDDEN);
            } else {
                sentence.classList.remove(CLASSES.IS_TYPING);
                this.#hideHelper();
                this.#showHeart();
                await delay(350);
                this.#showContinueButton();
                this.#isCompleted = true;
            }
        }

        clearTimeout(helperTimer);
        introScreen?.removeEventListener('click', advanceHandler);
        document.removeEventListener('keydown', keyHandler);
    }

    async waitForContinue() {
        return new Promise(resolve => {
            if (!this.#continueBtn) return resolve();
            const handler = () => {
                this.#continueBtn?.removeEventListener('click', handler);
                resolve();
            };
            this.#continueBtn.addEventListener('click', handler, { once: true });
        });
    }
}

/* -------------------------------------------------------------------
   BIRTHDAY REVEAL
   ------------------------------------------------------------------- */
class BirthdayReveal {
    #elements;
    #heart;

    constructor() {
        this.#heart = document.querySelector(SELECTORS.BIRTHDAY_HEART);
        this.#elements = [
            { el: document.querySelector(SELECTORS.BIRTHDAY_TITLE), delay: 600 },
            { el: document.querySelector(SELECTORS.BIRTHDAY_SUBTITLE), delay: 500 },
            { el: document.querySelector(SELECTORS.BIRTHDAY_MESSAGE), delay: 500 }
        ];
    }

    async animate() {
        [...this.#elements, { el: this.#heart }].forEach(({ el }) => {
            if (!el) return;
            el.classList.remove(CLASSES.SHOW);
        });
        await delay(300);
        await delay(500);
        if (this.#heart) this.#heart.classList.add(CLASSES.SHOW);
        for (const { el, delay: d } of this.#elements) {
            await delay(d);
            if (!el) continue;
            el.classList.add(CLASSES.SHOW);
        }
        await delay(700);
        const footer = document.querySelector(SELECTORS.BIRTHDAY_FOOTER);
        if (footer) footer.classList.add(CLASSES.SHOW);
    }
}

/* -------------------------------------------------------------------
   GALLERY ENGINE
   ------------------------------------------------------------------- */
class GalleryEngine {
    #image;
    #caption;
    #frame;
    #prevBtn;
    #nextBtn;
    #finishBtn;
    #dotsContainer;
    #currentIndex;
    #isAnimating;
    #pendingUpdate;
    #preloadedImages;
    #abortController;

    constructor() {
        this.#image = document.querySelector(SELECTORS.GALLERY_IMAGE);
        this.#caption = document.querySelector(SELECTORS.GALLERY_CAPTION);
        this.#frame = document.querySelector(SELECTORS.GALLERY_FRAME);
        this.#prevBtn = document.querySelector(SELECTORS.GALLERY_PREV);
        this.#nextBtn = document.querySelector(SELECTORS.GALLERY_NEXT);
        this.#finishBtn = document.querySelector(SELECTORS.GALLERY_FINISH);
        this.#dotsContainer = document.querySelector(SELECTORS.GALLERY_DOTS);
        this.#currentIndex = 0;
        this.#isAnimating = false;
        this.#pendingUpdate = false;
        this.#preloadedImages = new Map();
        this.#abortController = null;
        this.#bindEvents();
    }

    get currentIndex() { return this.#currentIndex; }
    get total() { return GALLERY_DATA.length; }

    #bindEvents() {
        this.#prevBtn?.addEventListener('click', () => this.previous());
        this.#nextBtn?.addEventListener('click', () => this.next());
        document.addEventListener('keydown', (e) => this.#handleKeydown(e));
        this.#setupSwipe();
    }

    #setupSwipe() {
        let startX = 0; let startY = 0;
        const handleTouchStart = (e) => { startX = e.changedTouches[0].screenX; startY = e.changedTouches[0].screenY; };
        const handleTouchEnd = (e) => {
            const endX = e.changedTouches[0].screenX;
            const endY = e.changedTouches[0].screenY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) this.next();
                else this.previous();
            }
        };
        const gallery = document.querySelector(SELECTORS.GALLERY);
        gallery?.addEventListener('touchstart', handleTouchStart, { passive: true });
        gallery?.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    #handleKeydown(e) {
        const galleryScreen = document.querySelector(SELECTORS.GALLERY);
        if (galleryScreen?.classList.contains(CLASSES.HIDDEN)) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); this.previous(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); this.next(); }
    }

    #preloadImage(index) {
        if (index < 0 || index >= GALLERY_DATA.length) return;
        if (this.#preloadedImages.has(index)) return;
        const img = new Image();
        img.decoding = 'async';
        img.src = `${PHOTOS_BASE_PATH}${GALLERY_DATA[index].filename}`;
        this.#preloadedImages.set(index, img);
    }

    #detectOrientation(filename) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ isPortrait: img.naturalHeight > img.naturalWidth, isLandscape: img.naturalWidth > img.naturalHeight, w: img.naturalWidth, h: img.naturalHeight });
            img.onerror = () => resolve({ isPortrait: false, isLandscape: true, w: 4, h: 3 });
            img.src = `${PHOTOS_BASE_PATH}${filename}`;
        });
    }

    async #updateImageOrientation(filename) {
        const { w, h } = await this.#detectOrientation(filename);
        if (this.#frame) this.#frame.style.aspectRatio = `${w} / ${h}`;
    }

    #buildDots() {
        if (!this.#dotsContainer) return;
        this.#dotsContainer.innerHTML = '';
        GALLERY_DATA.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'gallery-progress-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Foto ${index + 1}`);
            dot.addEventListener('click', () => this.goTo(index));
            this.#dotsContainer.appendChild(dot);
        });
    }

    #updateDots() {
        const dots = this.#dotsContainer?.querySelectorAll('.gallery-progress-dot');
        dots?.forEach((dot, i) => dot.classList.toggle(CLASSES.DOTS_ACTIVE, i === this.#currentIndex));
    }

    async initialize() {
        this.#currentIndex = 0;
        this.#preloadedImages.clear();
        this.#buildDots();
        this.#updateDots();
        if (this.#finishBtn) { this.#finishBtn.classList.remove(CLASSES.IS_VISIBLE); this.#finishBtn.classList.add(CLASSES.HIDDEN); }
        await this.#displayImage();
    }

    async goTo(index) {
        if (index === this.#currentIndex) return;
        if (index < 0 || index >= GALLERY_DATA.length) return;
        if (this.#isAnimating) { this.#pendingUpdate = true; return; }
        this.#currentIndex = index;
        await this.#displayImage();
    }

    async previous() {
        if (this.#isAnimating) return;
        if (this.#currentIndex <= 0) return;
        this.#currentIndex--;
        await this.#displayImage();
    }

    async next() {
        if (this.#isAnimating) return;
        if (this.#currentIndex >= GALLERY_DATA.length - 1) return;
        this.#currentIndex++;
        await this.#displayImage();
    }

    async #displayImage() {
        if (this.#isAnimating) { this.#pendingUpdate = true; return; }
        this.#isAnimating = true;
        const data = GALLERY_DATA[this.#currentIndex];

        if (this.#abortController) this.#abortController.abort();
        this.#abortController = new AbortController();

        this.#image?.classList.remove(CLASSES.IS_VISIBLE, CLASSES.KEN_BURNS);
        this.#image?.classList.add(CLASSES.FADE_OUT_IMG);
        this.#caption?.classList.remove(CLASSES.SHOW);
        this.#caption?.classList.add(CLASSES.FADE_OUT_IMG);
        await delay(450);

        await this.#updateImageOrientation(data.filename);

        if (this.#image) {
            this.#image.classList.remove(CLASSES.FADE_OUT_IMG);
            this.#image.classList.add(CLASSES.IS_LOADING);
            this.#image.src = `${PHOTOS_BASE_PATH}${data.filename}`;
            this.#image.alt = data.caption.replace(/\n/g, ' ');
            await new Promise((resolve) => {
                this.#image.onload = resolve;
                this.#image.onerror = resolve;
                setTimeout(resolve, 3000);
            });
            this.#image.classList.remove(CLASSES.IS_LOADING);
            this.#image.classList.add(CLASSES.IS_VISIBLE);
            setTimeout(() => {
                if (this.#image && this.#currentIndex === GALLERY_DATA.findIndex(d => d.filename === data.filename)) {
                    this.#image.classList.add(CLASSES.KEN_BURNS);
                }
            }, 800);
        }

        if (this.#caption) {
            this.#caption.innerHTML = data.caption.replace(/\n/g, '<br>');
            this.#caption.classList.remove(CLASSES.FADE_OUT_IMG);
            await delay(700);
            this.#caption.classList.add(CLASSES.SHOW);
        }

        this.#updateDots();

        const isLast = this.#currentIndex === GALLERY_DATA.length - 1;
        if (this.#finishBtn) {
            if (isLast) {
                this.#finishBtn.classList.remove(CLASSES.HIDDEN);
                requestAnimationFrame(() => this.#finishBtn?.classList.add(CLASSES.IS_VISIBLE));
            } else {
                this.#finishBtn?.classList.remove(CLASSES.IS_VISIBLE);
                this.#finishBtn?.classList.add(CLASSES.HIDDEN);
            }
        }

        this.#preloadImage(this.#currentIndex - 1);
        this.#preloadImage(this.#currentIndex + 1);

        this.#isAnimating = false;
        if (this.#pendingUpdate) { this.#pendingUpdate = false; await this.#displayImage(); }
    }

    onFinish(callback) { this.#finishBtn?.addEventListener('click', callback, { once: true }); }
}

/* -------------------------------------------------------------------
   ENDING SEQUENCE — Single-paragraph sequential reveal
   Uses ONE active paragraph element that updates textContent.
   Guarantees no overlap: waits for CSS transitionend before switching text.
   ------------------------------------------------------------------- */
class EndingSequence {
    #activeEl;
    #sources;
    #audioManager;
    #texts;
    #abortController;

    constructor(audioManager) {
        this.#activeEl = document.querySelector(SELECTORS.ENDING_ACTIVE);
        this.#sources = document.querySelectorAll(SELECTORS.ENDING_SOURCES);
        this.#audioManager = audioManager;
        this.#texts = [];
        this.#abortController = null;

        // Extract text from source elements
        this.#sources.forEach(el => {
            const text = el.getAttribute('data-text') || el.textContent || '';
            const isSignature = el.classList.contains('ending-paragraph--signature');
            const isLove = el.classList.contains('ending-paragraph--love');
            const isGlow = el.classList.contains('ending-paragraph--glow');
            this.#texts.push({ text, isSignature, isLove, isGlow });
        });
    }

    /**
     * Wait for the CSS transition (opacity+filter) to complete on the active element.
     * Uses transitionend event for precise timing.
     */
    #waitForTransition() {
        if (!this.#activeEl) return delay(1200);
        return new Promise((resolve) => {
            const handler = () => { this.#activeEl?.removeEventListener('transitionend', handler); resolve(); };
            this.#activeEl.addEventListener('transitionend', handler, { once: true });
            // Safety timeout (CSS transition is 1.2s)
            setTimeout(resolve, 1500);
        });
    }

    #getReadTime(index) {
        const entry = this.#texts[index];
        if (!entry) return 3000;
        const len = entry.text.length;
        if (len < 20) return 2000;
        if (len > 60) return 4500;
        if (entry.isLove) return 4000;
        return 3000;
    }

    async animate() {
        // Abort any previous sequence
        if (this.#abortController) this.#abortController.abort();
        this.#abortController = new AbortController();
        const signal = this.#abortController.signal;

        // Ensure active element exists
        if (!this.#activeEl) return;

        // Reset state
        this.#activeEl.classList.remove(CLASSES.IS_VISIBLE, CLASSES.GLOW, 'ending-paragraph--love', 'ending-paragraph--signature');
        this.#activeEl.innerHTML = '';

        // Fade music
        this.#audioManager.fadeTo(0.5, 5000);

        // Initial wait before starting
        await delay(600);
        if (signal.aborted) return;

        const total = this.#texts.length;

        for (let i = 0; i < total; i++) {
            const entry = this.#texts[i];

            // Skip signature — handle it last
            if (entry.isSignature) continue;

            if (signal.aborted) return;

            // --- FADE OUT (remove is-visible) ---
            this.#activeEl.classList.remove(CLASSES.IS_VISIBLE);
            await Promise.race([this.#waitForTransition(), this.#waitForAbort(signal)]);
            if (signal.aborted) return;

            // --- UPDATE TEXT & CLASSES ---
            this.#activeEl.classList.remove('ending-paragraph--love', 'ending-paragraph--signature');
            if (entry.isLove) this.#activeEl.classList.add('ending-paragraph--love');
            this.#activeEl.innerHTML = entry.text;

            // --- FORCE REFLOW ---
            void this.#activeEl.offsetHeight;

            // --- FADE IN ---
            this.#activeEl.classList.add(CLASSES.IS_VISIBLE);

            // --- WAIT READING TIME ---
            const readTime = this.#getReadTime(i);
            await delay(readTime);
            if (signal.aborted) return;
        }

        // --- FINAL PAUSE BEFORE SIGNATURE ---
        await delay(2000);
        if (signal.aborted) return;

        // --- REVEAL SIGNATURE ---
        const signatureEntry = this.#texts.find(t => t.isSignature);
        if (signatureEntry) {
            this.#activeEl.classList.remove(CLASSES.IS_VISIBLE);
            await Promise.race([this.#waitForTransition(), this.#waitForAbort(signal)]);
            if (signal.aborted) return;

            this.#activeEl.innerHTML = signatureEntry.text;
            this.#activeEl.classList.remove('ending-paragraph--love');
            this.#activeEl.classList.add('ending-paragraph--signature');
            void this.#activeEl.offsetHeight;
            this.#activeEl.classList.add(CLASSES.IS_VISIBLE);
            this.#activeEl.classList.add(CLASSES.GLOW);
        }

        // Fade music out after signature appears
        this.#audioManager.fadeOut(6000);
    }

    #waitForAbort(signal) {
        return new Promise(resolve => {
            if (signal.aborted) return resolve();
            signal.addEventListener('abort', () => resolve(), { once: true });
        });
    }
}

/* -------------------------------------------------------------------
   PARTICLE SYSTEM
   ------------------------------------------------------------------- */
class ParticleSystem {
    #canvas;
    #ctx;
    #particles;
    #animationId;
    #type;
    #running;

    constructor() {
        this.#canvas = document.querySelector(SELECTORS.CANVAS);
        this.#ctx = this.#canvas?.getContext('2d');
        this.#particles = [];
        this.#animationId = null;
        this.#type = 'none';
        this.#running = false;
        if (this.#canvas) {
            this.#resize();
            window.addEventListener('resize', () => this.#resize(), { passive: true });
        }
    }

    #resize() {
        if (!this.#canvas) return;
        this.#canvas.width = window.innerWidth;
        this.#canvas.height = window.innerHeight;
    }

    #getRandomArbitrary(min, max) { return Math.random() * (max - min) + min; }

    #createHeart(x, y) {
        const size = 6 + Math.random() * 14;
        return {
            x: x || Math.random() * this.#canvas.width, y: y || this.#canvas.height + 20,
            size, speedX: this.#getRandomArbitrary(-0.3, 0.3), speedY: this.#getRandomArbitrary(-1.2, -0.4),
            opacity: this.#getRandomArbitrary(0.3, 0.7), life: 0, maxLife: 300 + Math.random() * 200,
            type: 'heart', rotation: this.#getRandomArbitrary(-0.02, 0.02)
        };
    }

    #drawHeart(p) {
        const ctx = this.#ctx; if (!ctx) return;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation * p.life);
        ctx.globalAlpha = p.opacity; ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('❤️', 0, 0); ctx.restore();
    }

    #createPetal(x, y) {
        const size = 4 + Math.random() * 8;
        return {
            x: x || Math.random() * this.#canvas.width, y: y || -20,
            size, speedX: this.#getRandomArbitrary(-0.5, 0.5), speedY: this.#getRandomArbitrary(0.3, 1.0),
            opacity: this.#getRandomArbitrary(0.4, 0.8), life: 0, maxLife: 400 + Math.random() * 200,
            type: 'petal', rotation: this.#getRandomArbitrary(-0.03, 0.03),
            sway: Math.random() * 100, swayOffset: Math.random() * Math.PI * 2
        };
    }

    #drawPetal(p) {
        const ctx = this.#ctx; if (!ctx) return;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rotation * p.life + Math.sin(p.life * 0.02 + p.swayOffset) * 0.3);
        ctx.globalAlpha = p.opacity; ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🌸', 0, 0); ctx.restore();
    }

    #createFirefly(x, y) {
        return {
            x: x || Math.random() * this.#canvas.width, y: y || Math.random() * this.#canvas.height * 0.6,
            size: this.#getRandomArbitrary(1.5, 3.5), speedX: this.#getRandomArbitrary(-0.4, 0.4),
            speedY: this.#getRandomArbitrary(-0.3, 0.3), opacity: this.#getRandomArbitrary(0.1, 0.9),
            life: 0, maxLife: 500 + Math.random() * 300, type: 'firefly',
            blinkTimer: Math.random() * 100, blinkSpeed: 0.02 + Math.random() * 0.03
        };
    }

    #drawFirefly(p) {
        const ctx = this.#ctx; if (!ctx) return;
        const blink = Math.sin(p.blinkTimer) * 0.5 + 0.5;
        const alpha = p.opacity * blink;
        ctx.save(); ctx.globalAlpha = alpha; ctx.shadowBlur = 15; ctx.shadowColor = '#F6CD7B';
        ctx.fillStyle = '#F6CD7B'; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }

    #updateParticles() {
        for (let i = this.#particles.length - 1; i >= 0; i--) {
            const p = this.#particles[i]; p.life++;
            switch (p.type) {
                case 'heart':
                    p.x += p.speedX; p.y += p.speedY;
                    if (p.y < -30 || p.life > p.maxLife) { this.#particles.splice(i, 1); continue; }
                    break;
                case 'petal':
                    p.speedX += Math.sin(p.life * 0.02 + p.swayOffset) * 0.008;
                    p.x += p.speedX; p.y += p.speedY;
                    if (p.y > this.#canvas.height + 30 || p.life > p.maxLife) { this.#particles.splice(i, 1); continue; }
                    break;
                case 'firefly':
                    p.x += p.speedX + Math.sin(p.life * 0.01) * 0.2;
                    p.y += p.speedY + Math.cos(p.life * 0.015) * 0.2;
                    p.blinkTimer += p.blinkSpeed;
                    if (p.x < -20 || p.x > this.#canvas.width + 20 || p.y < -20 || p.y > this.#canvas.height + 20 || p.life > p.maxLife) { this.#particles.splice(i, 1); continue; }
                    break;
            }
        }
    }

    #draw() {
        const ctx = this.#ctx; if (!ctx || !this.#running) return;
        ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
        for (const p of this.#particles) {
            switch (p.type) { case 'heart': this.#drawHeart(p); break; case 'petal': this.#drawPetal(p); break; case 'firefly': this.#drawFirefly(p); break; }
        }
        this.#updateParticles();
        this.#animationId = requestAnimationFrame(() => this.#draw());
    }

    #spawnLoop() {
        if (!this.#running) return;
        switch (this.#type) {
            case 'hearts': if (this.#particles.length < 40) this.#particles.push(this.#createHeart()); setTimeout(() => this.#spawnLoop(), 300); break;
            case 'petals':
                if (this.#particles.length < 30) {
                    this.#particles.push(this.#createPetal());
                    if (Math.random() > 0.5) this.#particles.push(this.#createPetal());
                }
                setTimeout(() => this.#spawnLoop(), 400); break;
            case 'fireflies':
                if (this.#particles.length < 25) {
                    this.#particles.push(this.#createFirefly());
                    if (Math.random() > 0.6) this.#particles.push(this.#createFirefly());
                }
                setTimeout(() => this.#spawnLoop(), 500); break;
            case 'all':
                if (this.#particles.length < 60) {
                    if (Math.random() > 0.6) this.#particles.push(this.#createHeart());
                    if (Math.random() > 0.7) this.#particles.push(this.#createPetal());
                    if (Math.random() > 0.5) this.#particles.push(this.#createFirefly());
                }
                setTimeout(() => this.#spawnLoop(), 200); break;
        }
    }

    start(type = 'hearts') {
        if (!this.#canvas || !this.#ctx) return;
        this.stop(); this.#type = type; this.#particles = []; this.#running = true;
        this.#resize(); this.#draw(); this.#spawnLoop();
    }

    stop() {
        this.#running = false;
        if (this.#animationId) { cancelAnimationFrame(this.#animationId); this.#animationId = null; }
        this.#particles = [];
        if (this.#ctx) this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    }
}

/* -------------------------------------------------------------------
   SHOOTING STARS
   ------------------------------------------------------------------- */
class ShootingStarSystem {
    #active;

    constructor() { this.#active = false; }

    #create() {
        if (!this.#active) return;
        const star = document.createElement('div');
        star.className = 'shooting-star';
        star.style.cssText = `
            position: fixed; width: 3px; height: 3px; background: #fff;
            border-radius: 50%; pointer-events: none; z-index: 9999;
            box-shadow: 0 0 6px 2px rgba(246, 205, 123, 0.5);
            left: ${Math.random() * 80}%; top: ${Math.random() * 40}%; opacity: 1;
        `;
        const angle = -20 + Math.random() * 40;
        const duration = 1.2 + Math.random() * 1.5;
        star.style.transform = `rotate(${angle}deg)`;
        const trail = document.createElement('div');
        trail.style.cssText = `position: absolute; top: 0; right: 0; width: 60px; height: 1px; background: linear-gradient(to left, rgba(246, 205, 123, 0.8), transparent); transform: translateY(-1px);`;
        star.appendChild(trail);
        document.body.appendChild(star);
        requestAnimationFrame(() => {
            star.style.transition = `transform ${duration}s linear, opacity ${duration}s linear`;
            star.style.transform = `rotate(${angle}deg) translate3d(300px, 300px, 0)`;
            star.style.opacity = '0';
        });
        setTimeout(() => star.remove(), duration * 1000);
    }

    start() { this.#active = true; this.#schedule(); }
    stop() { this.#active = false; }

    #schedule() {
        if (!this.#active) return;
        const delayMs = 15000 + Math.random() * 15000;
        setTimeout(() => { this.#create(); this.#schedule(); }, delayMs);
    }
}

/* -------------------------------------------------------------------
   APP — Main orchestrator
   ------------------------------------------------------------------- */
class App {
    #screenManager;
    #audioManager;
    #validation;
    #loadingSequence;
    #particleSystem;
    #shootingStars;
    #currentScreen;

    constructor() {
        this.#screenManager = new ScreenManager();
        this.#audioManager = new AudioManager();
        this.#validation = new ValidationManager();
        this.#loadingSequence = new LoadingSequence();
        this.#particleSystem = new ParticleSystem();
        this.#shootingStars = new ShootingStarSystem();
        this.#currentScreen = 'landing';
        this.#init();
    }

    #init() {
        this.#screenManager.showInstant('screen-landing');
        this.#shootingStars.start();
        this.#bindForm();
        this.#bindEarphone();
        this.#particleSystem.start('hearts');
        window.addEventListener('load', () => { this.#validation.input?.focus(); }, { passive: true });
        this.#validation.input?.addEventListener('input', () => { if (this.#validation) this.#validation.clear(); }, { passive: true });
    }

    #bindForm() {
        const form = document.querySelector(SELECTORS.FORM);
        form?.addEventListener('submit', (e) => this.#handleSubmit(e));
        this.#validation.input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); form?.requestSubmit(); }
        });
    }

    #handleSubmit(e) {
        e.preventDefault();
        const raw = this.#validation.input?.value || '';
        const normalized = this.#validation.normalizeInput(raw);
        if (!normalized) { this.#validation.showError('Nama tidak boleh kosong.'); return; }
        if (!this.#validation.isValid(normalized)) { this.#validation.showError('Website ini memang bukan untukmu.'); return; }
        this.#validation.showSuccess();
        if (this.#validation.input) this.#validation.input.disabled = true;
        setTimeout(() => this.#transitionToLoading(), 300);
    }

    async #transitionToLoading() {
        await this.#screenManager.show('screen-loading');
        this.#currentScreen = 'loading';
        await delay(400);
        await this.#loadingSequence.animate();
        await this.#screenManager.showQuick('screen-earphone', 800);
        this.#currentScreen = 'earphone';
    }

    #bindEarphone() {
        const btn = document.querySelector(SELECTORS.EARPHONE_BUTTON);
        btn?.addEventListener('click', () => this.#transitionToIntro());
    }

    async #transitionToIntro() {
        await this.#screenManager.show('screen-intro');
        const introScreen = document.querySelector(SELECTORS.INTRO);
        introScreen?.classList.add(CLASSES.INTRO_REVEALED);
        await delay(500);
        this.#currentScreen = 'intro';
        const intro = new IntroSequence(this.#audioManager);
        intro.start();
        await intro.waitForContinue();
        await this.#transitionToBirthday();
    }

    async #transitionToBirthday() {
        await this.#screenManager.show('screen-birthday');
        this.#currentScreen = 'birthday';
        const birthday = new BirthdayReveal();
        await birthday.animate();
        const btn = document.querySelector(SELECTORS.BIRTHDAY_BUTTON);
        btn?.addEventListener('click', () => this.#transitionToGallery(), { once: true });
    }

    async #transitionToGallery() {
        await this.#screenManager.show('screen-gallery');
        this.#currentScreen = 'gallery';
        this.#particleSystem.start('fireflies');
        const gallery = new GalleryEngine();
        await gallery.initialize();
        gallery.onFinish(() => this.#transitionToEnding());
    }

    async #transitionToEnding() {
        await this.#screenManager.show('screen-ending');
        this.#currentScreen = 'ending';
        this.#particleSystem.start('all');
        const ending = new EndingSequence(this.#audioManager);
        await ending.animate();
    }
}
/* -------------------------------------------------------------------
   SECRET LOVE MODAL
------------------------------------------------------------------- */

const secretModal = document.getElementById('secret-modal');
const secretButton = document.getElementById('secret-love-button');
const secretClose = document.getElementById('secret-close');
const secretOverlay = document.querySelector('.secret-modal__overlay');

function openSecretModal(trigger) {

    if (!secretModal) return;

    if (trigger) {

        trigger.classList.add('is-pressed');

        setTimeout(() => {
            trigger.classList.remove('is-pressed');
        },180);

    }

    if (navigator.vibrate) {
        navigator.vibrate(25);
    }

    secretModal.classList.remove('hidden');

    requestAnimationFrame(() => {
        secretModal.classList.add('is-visible');
    });

    document.body.style.overflow='hidden';

}

function closeSecretModal() {
    if (!secretModal) return;

    secretModal.classList.remove('is-visible');

    setTimeout(() => {
        secretModal.classList.add('hidden');
        document.body.style.overflow = '';
    }, 300);
}

/* ==========================================================
   SECRET TRIGGER
========================================================== */

document.addEventListener('click', (event) => {

    const signature = event.target.closest('.ending-paragraph--signature');

    if (signature) {
        openSecretModal(signature);
        return;
    }

    if (event.target === secretOverlay || event.target === secretClose) {
        closeSecretModal();
    }

});

if (secretButton) {

    secretButton.addEventListener('click', async () => {

        const textEl =
            secretButton.querySelector('.secret-button__text');

        secretButton.classList.add('is-loading');

        textEl.textContent = 'Membuka WhatsApp... ❤️';

        await delay(700);

        const phone = '6287711998055'; // Ganti nomor kamu

        const message =
            'Ku Sayang Ki Juga ❤️🥹 makasih banyak sayangku🤍';

        window.open(
            `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
            '_blank'
        );

        secretButton.classList.remove('is-loading');

        textEl.textContent = 'Ku Sayang Ki Juga ❤️';

    });

}
/* -------------------------------------------------------------------
   BOOT
   ------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector(SELECTORS.INTRO)?.classList.remove(CLASSES.INTRO_REVEALED);
    new App();
});

