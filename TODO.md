# Dear, Rinda — Complete Rewrite TODO

## Overview
Complete production-grade rewrite of the Dear, Rinda birthday website.
Architecture: Modular ES6+ classes, CSS variables, semantic HTML5, 60fps animations.

---

## Milestone 1: index.html — Semantic HTML5 Structure
- [x] 1.1 Setup HTML5 boilerplate with proper meta tags (charset, viewport, theme-color, description, OG tags)
- [x] 1.2 Add preconnect/preload for Google Fonts (Playfair Display, Poppins)
- [x] 1.3 Add preload for background music with `as="audio"`
- [x] 1.4 Add font-display: swap via Google Fonts URL
- [x] 1.5 Write Landing screen
- [x] 1.6 Write Loading screen
- [x] 1.7 Write Earphone screen
- [x] 1.8 Write Intro screen
- [x] 1.9 Write Birthday screen
- [x] 1.10 Write Gallery screen
- [x] 1.11 Write Ending screen
- [x] 1.12 Add meta viewport with safe-area-inset
- [x] 1.13 Add proper ARIA labels, roles, and landmarks
- [x] 1.14 Validate HTML structure
- [x] 1.15 ✅ **MILESTONE 1 COMPLETE**

## Milestone 2: style.css — Section-Based Premium Styling
- [x] 2.1 CSS Reset and base styles
- [x] 2.2 CSS Custom Properties
- [x] 2.3 Background system (star field, ambient glow, GPU-accelerated)
- [x] 2.4 Layout system (screens, flexbox centering, safe area)
- [x] 2.5 Landing screen styles (glass card, input glow, validation, button)
- [x] 2.6 Loading screen styles (crossfade messages, ring spinner)
- [x] 2.7 Earphone screen styles (SVG float, halo rotation, ambient glow)
- [x] 2.8 Intro screen styles (star field, typing cursor, blur→sharp, helper, heart)
- [x] 2.9 Birthday screen styles (aurora, heart beat/float, sequential reveal, footer)
- [x] 2.10 Gallery screen styles (glass frame, Ken Burns, blur→sharp, caption, SVG nav, dots)
- [x] 2.11 Ending screen styles (cinematic reveal, signature glow)
- [x] 2.12 Responsive design (desktop, tablet, mobile, landscape, safe area)
- [x] 2.13 Accessibility (prefers-reduced-motion, focus-visible, hover:none)
- [x] 2.14 ✅ **MILESTONE 2 COMPLETE**

## Milestone 3: script.js — Modular ES6+ Class Architecture
- [x] 3.1 **App Class** — Main orchestrator managing all transitions and state
- [x] 3.2 **ScreenManager Class** — Screen show/hide with fade transitions, transition queue
- [x] 3.3 **AudioManager Class** — Music loading, fade in/out, volume control, autoplay handling
- [x] 3.4 **TypingEngine Class** — Typewriter effect with cursor, skip-to-end on click
- [x] 3.5 **ValidationManager Class** — Name validation, error/success states, shake animation
- [x] 3.6 **LoadingSequence Class** — Crossfade message cycling with precise timing
- [x] 3.7 **IntroSequence Class** — Typing sentences, user advance, helper, heart, continue button
- [x] 3.8 **BirthdayReveal Class** — Sequential element reveal with configurable delays
- [x] 3.9 **GalleryEngine Class** — SVG nav, progress dots, keyboard, swipe, preloading, Ken Burns, blur→sharp, orientation detection, line-break support
- [x] 3.10 **EndingSequence Class** — Paragraph reveal, signature glow, music fade out
- [x] 3.11 **ParticleSystem Class** — Canvas-based hearts, petals, fireflies, all combined
- [x] 3.12 **ShootingStarSystem** — Random celestial events at 15-30s intervals
- [x] 3.13 Passive event listeners for touch and scroll
- [x] 3.14 Performance: requestAnimationFrame, will-change, transform-only
- [x] 3.15 **All 12 classes implemented with private fields** — Zero global variables
- [x] 3.16 ✅ **MILESTONE 3 COMPLETE**

## Milestone 4: Integration & Testing
- [ ] 4.1 Verify all 11 images load correctly in gallery
- [ ] 4.2 Verify all captions display correctly
- [ ] 4.3 Verify background music plays and fades correctly
- [ ] 4.4 Verify all screen transitions are smooth
- [ ] 4.5 Verify swipe gesture on gallery
- [ ] 4.6 Verify keyboard navigation on gallery
- [ ] 4.7 Verify responsive layout on mobile widths
- [ ] 4.8 Verify responsive layout on tablet widths
- [ ] 4.9 Verify name validation (rinda, rinda asmita)
- [ ] 4.10 Verify loading sequence plays correctly
- [ ] 4.11 Verify typing animation in intro
- [ ] 4.12 Verify birthday reveal sequence
- [ ] 4.13 Verify ending sequence with all paragraphs
- [ ] 4.14 Verify signature glow effect
- [ ] 4.15 Verify reduced motion media query
- [ ] 4.16 ✅ **MILESTONE 4 COMPLETE**

---

## File Order
```
1. index.html  →  Complete & validated
2. style.css   →  Complete & validated
3. script.js   →  Complete & validated
4. Testing     →  All screens functional
```

---

## Bug Fixes — v1.0 Release
- [x] FIX 1: index.html — Add missing `<section>` opening tag on landing screen
- [x] FIX 2: script.js — Remove conflicting inline styles in BirthdayReveal.animate()
- [x] FIX 3: script.js — Fix BirthdayReveal footer reveal (remove inline style overrides)
- [x] FIX 4: script.js — Fix GalleryEngine frame height handling
- [x] FIX 5: script.js — Rewrite EndingSequence: single-paragraph sequential reveal with no overlap
- [x] FIX 6: style.css — Fix Intro `.intro-sentence` transform layout shift (opacity+filter only, no transform)
- [x] FIX 7: style.css — Fix Intro `.intro-heart` size (clamp 2.5rem/8vw/4rem)
- [x] FIX 8: style.css — Fix Intro helper alignment (flex, not inline-flex)
- [x] FIX 9: style.css — Fix Intro continue button positioning (relative z-index, no transform)
- [x] FIX 10: style.css — Fix Gallery frame height (min-height removed → aspect-ratio via JS)
- [x] FIX 11: style.css — Fix Gallery controls overlay (new `.gallery-viewer__stage` wrapper)
- [x] FIX 12: style.css — Fix Gallery nav buttons (`:active` preserves `translateY(-50%)`, 56px touch targets, proper z-index)
- [x] FIX 13: style.css — Fix Birthday reveal (use .show class only, no inline style conflicts)
- [x] FIX 14: index.html — Restructure Ending: one active paragraph + source data elements
- [x] FIX 15: script.js — EndingSequence uses `transitionend` event instead of `delay(1200)` for precise fade-out timing
- [x] FIX 16: style.css — `@media (hover: none)` gallery nav preserves `translateY(-50%)`
- [x] POLISH 1: style.css — Intro spacing: `.intro-copy` margin-top 38px → 63px (25px more breathing room)
- [x] POLISH 2: style.css — Gallery frame: removed `min-height: 280px` so frame height follows aspect-ratio; empty-frame guard at 120px
- [x] QA Pass — Zero console errors, Zero HTML errors

---

## Build & Run
```
Open index.html in a browser to launch the app.
No build step required — pure HTML/CSS/JS.
```

