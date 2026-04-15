# Portfolio — Claude Code Instructions

## Project Overview
Hristijan's personal UI/UX design portfolio. React + TypeScript + Vite + Tailwind CSS + Framer Motion.
Owner: Hristijan Bristić, UI/UX designer, Skopje, Macedonia.

## Commands
```bash
npm run dev      # dev server (host: true — accessible on local network)
npm run build    # tsc + vite build
npm run preview  # preview production build
npx tsc --noEmit # type-check only (always run before reporting task done)
```

## Stack
- **React 18** + **TypeScript** + **Vite** (SWC compiler)
- **Tailwind CSS 3** — dark mode via `class` strategy
- **Framer Motion 10** — all animations
- **Lenis** — smooth scroll (`useLenis` hook in `src/hooks/useLenis.ts`)
- **Lucide React** — icons
- **Web3Forms** — contact form submissions

## Project Structure
```
src/
  components/
    Hero.tsx            # Landing section — page-load animations (animate, not whileInView)
    Skills.tsx          # Infinite marquee of tool cards
    Characteristics.tsx # Marquee + 3 info cards
    Projects.tsx        # Horizontal scroll carousel with modal detail view
    DesignPhilosophy.tsx# 3 principle cards
    Playground.tsx      # Aesthetics / mood board section
    Contact.tsx         # Web3Forms contact form
    Navigation.tsx      # Fixed bottom nav — desktop pill + mobile expandable
    BackgroundIcons.tsx # Decorative floating background icons
    CustomCursor.tsx    # Custom cursor (desktop only)
  assets/             # All images (project thumbnails + detail shots)
  hooks/
    useLenis.ts         # Lenis smooth scroll init
  index.css           # CSS variables, utility classes, global styles
  App.tsx             # Root layout — panel surface, vignettes, section order
```

## Design System

### Colors
- `primary`: `#FF6B6B` (coral red — accent, CTAs, active states)
- Dark bg: `#050505` | Light bg: `#ffffff`
- Text: CSS vars `--text-primary` / `--text-secondary`

### Fonts
- Headings: **Work Sans**
- Body: **DM Sans**
- Both loaded via Google Fonts

### CSS Utility Classes (defined in index.css)
- `.text-muted` — secondary text color
- `.text-theme-primary` — primary text color
- `.panel-surface` — main container glass surface (bg + border + shadow)
- `.card-surface` — card background + border
- `.card-surface-hover` — hover border color change to primary
- `.chip-surface` — small pill/badge surface
- `.nav-surface` / `.nav-shadow` — navigation bar styles
- `.input-surface` — form input styles
- `.vignette-top/bottom/left/right` — edge fade gradients
- `.grid-background` — subtle grid pattern
- `.no-scrollbar` — hides scrollbars while keeping scroll functional

### Theme
- Default: **dark**. Toggle stored in `localStorage` key `theme`.
- Dark class applied to `<html>` element.
- All color vars defined in `:root` (light) and `.dark` blocks.

## Animation Rules — IMPORTANT
All scroll-triggered sections use this exact pattern — do not deviate:
```tsx
initial={{ opacity: 0, y: 24 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, amount: 0.15 }}
transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
```
- `once: true` — sections animate in once, stay visible on scroll back
- No `scale` in entrance animations
- Hero uses `animate` (not `whileInView`) — it loads immediately on page load
- All elements animate from **below** (positive y) — never from above
- Hero child stagger delays: h1=0, p1=0.1, p2=0.18, socials=0.25

## Navigation — Scroll Behavior
`handleClick` in `Navigation.tsx`:
- **Desktop (lg+)**: centers the section vertically in the viewport
  `targetY = sectionAbsTop + rect.height / 2 - window.innerHeight / 2`
- **Mobile**: consistent 80px from top
  `targetY = rect.top + scrollTop - 80`
- Smooth scroll duration: 900ms with easeInOutQuad

## Projects Section — Key Details
- Horizontal scroll carousel on all devices
- **Desktop**: mouse wheel scrolls horizontally (hijacks only when scrollable room exists), arrow buttons in header nav
- **Mobile**: snap carousel, `touch-action: pan-x` (horizontal only, no vertical drag)
- Wheel speed multiplier: `deltaY * 0.5`
- Arrow scroll distance: `240px`
- Scrollbar: 3px thin line, framer-motion `animate={{ left }}` for smooth thumb tracking
- Right-end spacing fix: trailing spacer `w-4 sm:w-6 lg:w-8 -ml-4 sm:-ml-5 lg:-ml-6` (negative margin cancels gap, spacer width provides equal padding)
- Card image hover: `scale-110` ease-out, no rotation
- Card entry: stagger `delay: index * 0.07`

## Design Principles (inform all decisions)
1. **Simplicity First** — every element earns its place
2. **Hierarchy & Balance** — visual weight guides the eye
3. **Intentional Motion** — animation reveals relationships, never arbitrary

## Projects Data
1. **InTec System** — Website Design, IT solutions provider redesign
2. **Scribbly** — App Design, AI-powered note + scribble taking app
3. **Cinepick** — App Design, mood-based movie recommendation app
4. **Laboratorium** — Visual Identity, cultural education center Macedonia
5. **Hootlink** — Interaction Design, login flow with reactive owl mascot

## Common Gotchas
- `padding-right` on flex containers inside `overflow-x: auto` is clipped in Chrome/WebKit — always use a real spacer element at the end of flex lists
- `touch-action: pan-x pan-y` (Tailwind default for overflow-x-auto) allows vertical drift on mobile carousels — override with `style={{ touchAction: 'pan-x' }}`
- Wheel event listeners on scroll containers must use `{ passive: false }` to call `preventDefault()`
- Dark mode: `darkMode: ['class']` in tailwind config — toggle the `dark` class on `<html>`, not `<body>`
- Nav scroll-margin: sections have `scroll-mt-[40px]` but nav clicks use JS scroll, so scroll-mt only affects native anchor navigation
