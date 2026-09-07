# -*- coding: utf-8 -*-
"""Emits the feature-by-feature half of docs/VISUAL-FEATURE-LEDGER.md.

Every bullet in the brief gets exactly one row. Status is one of:
  LIVE      — shipping now; the cell says where
  ALREADY   — was already in the repository before this work
  DECLINED  — considered and not shipped; the cell says why
"""
import re, sys, io

BRIEF = sys.argv[1] if len(sys.argv) > 1 else "docs/visual-features-brief.md"

# Reasons are written once and referenced, so the same decision is never argued two ways.
R = {
 "webgl": "Declined: needs WebGL/three.js. A 3D runtime is 150KB+ on a first load this proposal's own argument says happens on a mid-range Android over a slow connection.",
 "nosubject": "Declined: no subject. The document has no product, no 3D model and no photographic gallery for this to act on.",
 "novideo": "Declined: no video. The proposal ships no video asset, and adding one to a link-only confidential document is a bandwidth cost with no argument behind it.",
 "nodrag": "Declined: no drag surface. Nothing in this document is reorderable, dismissable or resizable by the reader.",
 "noform": "Declined: no such form. The document collects nothing — there is no sign-up, upload, password or multi-step flow to instrument.",
 "nolive": "Declined: no live data. Every figure here is a sourced static number; a live-updating stream would imply a feed that does not exist.",
 "delegated": "Declined as CSS: motion's AnimatePresence already runs this, and a second CSS-only vocabulary would be a parallel system nothing calls.",
 "honesty": "Declined on honesty grounds: for most of its run the effect displays a figure that is not the figure. Appendix A forbids exactly this.",
 "cost": "Declined on cost: a continuous canvas/rAF loop for a decorative result, on the device this is read on.",
 "noise": "Declined as noise: at 262 sections this would be seen hundreds of times. The test each document-wide rule had to pass was whether it is still welcome on the fortieth section.",
 "nomap": "Declined: no geographic map. No ward-boundary geometry exists in this repository; the cartogram is a tile grid, and §9 techniques are applied to it in that form.",
 "delay": "Declined: delays content. A splash or preloader is time added before a reader who may be on a slow link sees anything.",
}

L = {  # LIVE — where it ships
 "hero": "Hero header — ClientPage",
 "head": "All 262 headings — SectionHeading",
 "prose": "All 262 sections — .prose rules in visual-fx.css",
 "fig": "Every figure/table in all 262 sections — selector-driven scroll reveal",
 "cards": "Metric cards — Dashboard",
 "tbl": "InteractiveTable",
 "nav": "Toolbar, sidebar rail, nav dots",
 "chrome": "Glass chrome — toolbar, capsule, mobile dock, index sheet",
 "skel": "SectionSkeleton / loading states",
 "carto": "Ward cartogram — 40 tiles",
 "marq": "MarqueeCarousel",
 "fold": "ProseFold / disclosure",
 "form": "Native form controls, site-wide",
 "cursor": "CustomCursor",
 "amb": "AmbientField — hero",
 "port": "Portrait / SectionPortrait",
 "rail": "ScrollProgressBar",
}

# name -> (status, detail). Matching is case-insensitive on the bullet's name.
M = {}
def put(names, status, detail):
    for n in names:
        M[n.lower()] = (status, detail)

# ---- §1 Entrance -----------------------------------------------------------
put(["Fade in","Fade-in sequence"], "LIVE", L["hero"] + " — `Reveal variant=\"fade\"`, hero beats via `.fx-hero-seq`")
put(["Slide in","Slide-in from sides","Slide-up & fade-in (scroll reveal)"], "LIVE", L["fig"] + "; `Reveal` up/down/left/right/diagonal")
put(["Scale up / pop in","Scale-up animation"], "LIVE", L["cards"] + " — `Reveal variant=\"pop\"`, 2.8% overshoot")
put(["Scale down / settle in"], "LIVE", L["port"] + " — `Reveal variant=\"settle\"`, distinct from pop so both can be used")
put(["Blur-to-sharp","Blur-In Animation"], "LIVE", "`Reveal variant=\"blur\"` — 12px to sharp")
put(["Clip-path wipe","Clip-path reveals"], "LIVE", L["head"] + " — every h2 wipes open from the left")
put(["Mask reveal","Text reveal via masks","Content reveal via scroll"], "LIVE", "Hero title — per-line overflow mask in `SplitText by=\"line\"`")
put(["Iris open"], "LIVE", "`Reveal variant=\"iris\"` — circular aperture")
put(["Flip in on an axis"], "LIVE", "`Reveal variant=\"flip-x\" / \"flip-y\"`")
put(["Rotate in"], "LIVE", "`Reveal variant=\"rotate\"`")
put(["Unfold / origami expand"], "LIVE", "`Reveal variant=\"unfold\"` — rotateX from the top edge")
put(["Stagger cascade across siblings","Staggered animations","Fade-in sequence "], "LIVE", L["cards"] + " and quick-jump chips — `Stagger`, index as `--fx-i`")
put(["Ripple stagger from a focal point"], "LIVE", "`Stagger ripple={n}` — delay by distance from a focal child")
put(["Text reveal by line, word, or character","Split text animation","Character stagger","Line-by-line mask reveal"], "LIVE", "`SplitText by=\"line\"|\"word\"|\"char\"` — hero title; one unsplit accessible string kept")
put(["Typewriter effect"], "LIVE", "`Typewriter` — CSS steps() width, full string in the DOM throughout")
put(["SVG path draw","SVG line drawing animation","Sparkline draw"], "ALREADY", "`drawPath` in lib/motion.ts, used by the existing chart components")
put(["Stroke-to-fill","Outline-to-fill text"], "DECLINED", R["noise"] + " No outlined mark in this document needs a second state.")
put(["Number count-up","Animated counter","Scroll-triggered count-up"], "LIVE", L["cards"] + " — `CountUp`/`CountUpText`; final value exposed to AT from frame one")
put(["Skeleton resolving into real content","Loading skeletons","Skeleton pulse","Skeleton shimmer","Skeleton screen shimmer"], "LIVE", L["skel"] + " — sweep replaces a whole-card pulse")
put(["Progressive image load","Image lazy loading"], "ALREADY", "next/image with `loading=\"lazy\"` and a blur placeholder, plus LazyMount")
put(["Ken Burns Effect","Ken Burns pan and zoom"], "LIVE", L["port"] + " — 22s, the only looping transform above the fold")
put(["Particle overlay","Particle field","Particle systems (3D)"], "LIVE", "`AmbientField motes={n}` — deterministic positions, no canvas, no rAF")
put(["High-resolution imagery","High-resolution logos & platform icons"], "ALREADY", "next/image renditions with `sizes`; 89 lucide icons already in use")
put(["Split-screen hero animation","Split layout animations"], "LIVE", L["hero"] + " — verdict enters from the left, illustration from the right")
put(["Curtain / shutter open","Curtain reveal"], "DECLINED", R["delay"] + " A curtain over the hero on every visit is the same cost as a preloader.")
put(["Liquid / morphing background","Liquid / fluid animation","Liquid/fluid background","Liquid/fluid simulations","Blob or metaball morph"], "LIVE", L["amb"] + " — three blurred wells on independent cycles (`.fx-aurora`); a fluid solver would be " + R["cost"].lower())
put(["Parallax hero","Parallax layers at differing depths","Depth layering with z-offsets","Background attachment fixed"], "LIVE", L["amb"] + " — the three wells parallax at 0.6/1.0/1.5, composited onto their own drift with `animation-composition: add`")
put(["Video background with overlay","Video autoplay on viewport entry","Video scrub tied to scroll","Scroll-linked video playback","Video autoplay on view","Video scrub"], "DECLINED", R["novideo"])
put(["Glitch effect"], "DECLINED", R["noise"] + " A digital-artefact aesthetic is off-message for a document about trust in figures.")
put(["Spotlight effect","Spotlight or glow tracking the pointer"], "LIVE", "`SpotlightCard` — nomination verdict, metric cards, sidebar")
put(["Text bounce on load"], "DECLINED", R["noise"] + " A bouncing headline undercuts the register of the document.")
put(["Logo animation"], "LIVE", L["hero"] + " — the Wiper umbrella floats on a 4.2s cycle")
put(["3D text effect","3D text extrusion","Text stroke effect","Neon text effect","Neon glow effect"], "DECLINED", R["noise"] + " Extruded and outlined type fights the serif display face this document already has.")
put(["Lottie / Bodymovin animation","Lottie / Bodymovin animations"], "DECLINED", "Declined on cost: the Lottie runtime plus JSON is bundle weight for animations CSS keyframes already produce here.")
put(["View Transitions API"], "LIVE", "`@view-transition` in visual-fx.css, behind `prefers-reduced-motion: no-preference`")
put(["Animated preloader","Splash or intro animation","Branded loading sequence","Loading brand animation","Page-load orchestration sequence"], "DECLINED", R["delay"])

# ---- §2 Exit ---------------------------------------------------------------
put(["Fade out"], "LIVE", "AnimatePresence on the section switch, the capsule panel and the index sheet")
for n in ["Slide out","Scale and fade collapse","Wipe out","Shrink to origin point","Reverse stagger","Modal exit animations","Drawer / sheet exit","Toast / snackbar exit","Roll out","Light speed out","Bounce out","Flip out"]:
    put([n], "DECLINED", R["delegated"])
put(["Fly to target"], "DECLINED", R["nosubject"] + " There is no cart and no destination to fly to.")
put(["Disintegrate / particle dissolve"], "DECLINED", R["cost"])

# ---- §3 Scroll -------------------------------------------------------------
put(["Viewport-triggered reveal (fires once)"], "LIVE", L["fig"] + "; `useInView` once by default")
put(["Viewport-triggered re-fire on re-entry","Scroll-triggered counter reset"], "DECLINED", "Available (`Reveal repeat`, `CountUp repeat`) but not used: a counter that resets on every pass reads as a glitch on the fourth, in a document read by scrolling back.")
put(["Scroll-scrubbed animation","Scroll progress bar or rail"], "LIVE", L["rail"] + " — `animation-timeline: scroll(root)`, JS only as fallback")
put(["Sticky pinned section","Sticky elements","Pin & unpin animations"], "LIVE", "Sticky toolbar, sticky table headers, sticky sidebar")
put(["Horizontal scroll section","Horizontal scroll sections"], "LIVE", "Mobile metric rail and chip rows — real overflow rails with scroll-snap, so keyboard and trackpad both work")
put(["Scroll-snap between panels"], "LIVE", "Tailwind `snap-x`/`snap-center` on the mobile metric rail")
put(["Image sequence scrub"], "DECLINED", R["nosubject"])
put(["Scroll-velocity skew or stretch","Scroll velocity detection"], "LIVE", "`useScrollShell` writes `--scroll-skew`, clamped at ±3deg; past that it reads as a rendering fault")
put(["Scroll-direction-aware header","Header transparency effect","Sticky header state change"], "LIVE", "Toolbar — retreats on the way down, returns on the way up, and never while it holds focus")
put(["Scroll-linked colour or theme shift","Color shift on scroll"], "DECLINED", R["noise"] + " Colour carries claim-status and phase meaning here; moving it with scroll would break both.")
put(["Section-to-section crossfade"], "LIVE", "AnimatePresence between sections in ClientPage")
put(["Text highlighted line-by-line as you pass"], "DECLINED", R["noise"])
put(["Scroll-linked 3D camera move"], "DECLINED", R["webgl"])
put(["Infinite scroll append animation"], "DECLINED", "Declined: no infinite scroll. The document is finite and indexed; appending would break the table of contents.")
put(["Navigation dots (NavDots)","Scroll-spy indicator"], "LIVE", "`NavDots` — IntersectionObserver over the real section elements, xl and up")
put(["Back-to-top button","Back-to-top reveal"], "LIVE", "QuickNavCapsule — revealed via `.fx-backtotop` rather than mounted on threshold, so the row beside it does not shift")
put(["Zoom-in on scroll"], "DECLINED", R["noise"] + " Figures already reveal on scroll; scaling them as well would make a 40-row ward table move twice on the way in.")
put(["Rotation on scroll"], "DECLINED", R["noise"] + " Nothing in this document has a rotation that would mean anything.")
put(["Blur-out on scroll"], "DECLINED", "Declined on reading grounds: blurring text as it leaves the viewport fights the reader who is scrolling back to re-read it, which is how a 55,000-word document is actually read.")
put(["Opacity fade zones"], "LIVE", "`.fx-mask-fade-x` on the ticker. Not applied to reading matter, for the same reason as blur-out.")

# ---- §4 Continuous ---------------------------------------------------------
put(["Marquee / ticker","Logo wall loop","Conveyor or belt motion","Carousel autoplay","Image carousel/slider"], "LIVE", L["marq"] + " — CSS loop so `animation-play-state` can pause it on hover; class dropped entirely off-screen")
put(["Loop with pause on hover"], "LIVE", "`.fx-pause-on-hover` — the reason the ticker can carry real content")
put(["Pulse or breathe","Pulse effect","Live-status blink"], "LIVE", "Confidentiality marker — 1.8s blink on the live dot")
put(["Float and drift","Icon float effect","Floating elements"], "LIVE", "Wiper umbrella in the hero banner")
put(["Rotate loop","Orbiting elements"], "DECLINED", R["noise"] + " Nothing in this document orbits or spins meaningfully.")
put(["Gradient shift","Animated gradient background","Gradient shift on hover"], "LIVE", "Part dividers and the scroll rail — `.fx-gradient-live`")
put(["Shimmer sweep","Shine / sweep effect"], "LIVE", L["skel"] + ", part dividers, and the index button")
put(["Wave or ripple field","Wave/ripple field"], "DECLINED", R["cost"])
put(["Noise or grain animation","Noise texture overlay","Grain / noise loop"], "LIVE", L["amb"] + " — one inline feTurbulence, no image request")
put(["Aurora or mesh gradient drift","Aurora / mesh gradient drift","Animated gradient mesh backgrounds","Mesh gradient animations","Mesh gradient backgrounds","Gradient mesh backgrounds"], "LIVE", L["amb"] + "; `.fx-mesh` plates on the metric cards")
put(["Audio-reactive motion","Scroll-triggered audio cues"], "DECLINED", "Declined: no audio. A confidential proposal that makes sound when scrolled is a liability, not a feature.")
put(["Caustics effect","Caustics effects"], "DECLINED", R["cost"])
put(["Displacement effects","WebGL shaders","Ray marching effects","Post-processing effects","Generative canvas or shader motion","Generative shader motion","Canvas-based generative art"], "DECLINED", R["webgl"])
put(["Animated CSS pattern","Animated CSS background patterns","Animated CSS patterns"], "LIVE", "Part dividers — creeping diagonal hatch; masked grid behind the hero")
put(["Weather-like background","Weather-like effects","Weather-like background effects"], "LIVE", "`AmbientField motes` — available and used only where falling is the subject, never as decoration")

# ---- §5 Interaction --------------------------------------------------------
put(["Hover lift","Card lift effect"], "LIVE", "`.fx-lift` — cards, chips, figures, blockquotes")
put(["Hover tint / colour shift","Color transition on hover"], "LIVE", L["prose"] + " — table rows, links, badges")
put(["Hover scale","Button & icon scaling"], "LIVE", "Cartogram tiles, icons (`.fx-icon-rise`)")
put(["Underline draw or grow","Hover underline animation","Animated text underline"], "LIVE", L["prose"] + " — every link draws its underline from 0% to 100%")
put(["Marker-style underline draw","Highlight sweep behind text","Highlighted text effect"], "LIVE", L["head"] + " — `.fx-marker` sweep on h2")
put(["Border draw on hover","Border animation"], "DECLINED", R["noise"] + " The site already marks hover with lift, tint and glow; a fourth border treatment is redundant.")
put(["Icon swap or shift on hover","Link arrow animation"], "LIVE", "`.fx-icon-nudge` — index rows in the mobile sheet")
put(["Icon rotation on hover"], "DECLINED", R["noise"])
put(["Image zoom within a frame","Image zoom on hover"], "LIVE", "Every image in all 262 sections — the frame lifts, the picture scales inside it")
put(["Reveal-on-hover overlay","Image hover overlay","Text reveal on hover"], "LIVE", "Image alt text rises over the figure on hover/focus")
put(["Press / active scale-down"], "LIVE", "`.fx-press` — every button in the toolbar, dock, capsule and index")
put(["Focus ring animation","Focus outline animation"], "LIVE", "`.fx-focus` — branded, and it still animates under reduced motion")
put(["Magnetic attraction to cursor","Magnetic buttons"], "LIVE", "`MagneticButton` — the Print control; window-level listener, so it pulls before the pointer arrives")
put(["Cursor-follow element or custom cursor","Custom cursor","Cursor trail effect"], "LIVE", "`CustomCursor` — dot plus a lagging ring that is the trail; fine pointers only, never under reduced motion")
put(["Pointer tilt with 3D perspective","3D tilt effect","3D card hover effects","Hover-activated 3D object rotation"], "LIVE", "`TiltCard` — metric cards and the hero illustration; writes two custom properties, never renders")
put(["Border glow effect"], "LIVE", "`SpotlightCard border` — mask-composite edge that tracks the pointer")
put(["Ripple from click point","Ripple effect on click"], "LIVE", "`RippleButton` and the per-heading copy-link control")
put(["Long-press progress fill","Hold-to-confirm"], "DECLINED", R["noform"] + " No action here is destructive enough to need confirming by holding.")
put(["Input field glow"], "LIVE", L["form"] + " — focus glow on every text, search and number field")
put(["Input focus expand"], "DECLINED", "Declined: a field that changes width on focus shifts the controls beside it under the reader's hand. The focus glow carries the same signal without moving anything.")
put(["Copy-to-clipboard glow"], "LIVE", L["head"] + " — the tick draws itself and the button pops; 400ms, no toast needed")
put(["Background slide"], "LIVE", "Quick-jump chips — `.fx-bg-slide` from the left")
put(["Morphing shapes"], "DECLINED", R["nosubject"])
put(["Parallax on hover"], "LIVE", "`.fx-z-1` inside `TiltCard` — the figure sits proud, so tilt reads as depth")
put(["Tooltip animations"], "ALREADY", "Existing chart and badge tooltips")
put(["State-change animations"], "LIVE", "Copy-link idle/copied; toolbar toggles; fold open/closed")

# ---- §6 Gesture ------------------------------------------------------------
for n in ["Drag to reorder","Drag to dismiss","Draggable elements","Sortable list animations","Drag-to-delete","Split-view divider drag","Before/after comparison slider","Image comparison slider","Dial or knob rotation","Pull-to-refresh","Fling with momentum","Snap-back on release","Shake-to-undo","360° product viewer","Interactive 360° product viewers","3D model viewers","Model or object rotation"]:
    put([n], "DECLINED", R["nodrag"])
put(["Swipe between panels"], "LIVE", "Mobile metric rail — scroll-snap, which is the platform's own swipe")
put(["Pinch to zoom"], "ALREADY", "`maximumScale: 5` in the viewport, deliberately not locked to 1")
put(["Slider or range handle","Slider handle animation","Range fill animation"], "LIVE", L["form"] + " — thumbs scale and glow on hover, focus and drag")
put(["Rubber-band overscroll"], "LIVE", "`.fx-rubber` on the mobile rails")
put(["Animated toggles/switches","Toggle switch animation","Toggle and switch"], "LIVE", "Toolbar toggles — focus/density/zero-chrome, with press feedback")
put(["Scrollbar dragging","Custom scrollbar styling"], "LIVE", "Branded gradient scrollbar site-wide, with `.scrollbar-none` for rails with their own affordance")

# ---- §7 Layout -------------------------------------------------------------
put(["Accordion expand and collapse","Disclosure reveal","Expandable cards","Expand card to full screen"], "LIVE", L["fold"] + " — grid-template-rows 0fr→1fr, and `inert` while closed")
put(["Layout animation","FLIP reflow","Filter and sort reflow","Grid layout animations","CSS grid animations","List insert, remove, reorder"], "LIVE", L["tbl"] + " — rows cascade on sort and filter, stagger capped at twelve")
put(["Shared element transition across views","Page or route transition"], "LIVE", "`@view-transition` plus AnimatePresence on the section switch")
put(["Tab indicator slide","Active-link indicator slide","Tab bar switch","Tab switching animations","Segmented control slide"], "LIVE", "Sidebar rail — one marker that slides, driven by the active index")
put(["Modal or dialog enter/exit","Modal entry/exit"], "LIVE", "Mobile index sheet — backdrop blurs in, panel rises from the edge it sits on")
put(["Drawer or sheet slide","Sidebar slide-in","Off-canvas menu","Slide-out panels","Bottom sheet with detents"], "LIVE", "Mobile index sheet — `.fx-sheet-bottom` on phones, `.fx-modal` above sm")
put(["Popover and tooltip enter","Dropdown and menu open","Dropdown animations","Mega menu animation"], "LIVE", "QuickNavCapsule — `.fx-menu` with a per-row cascade")
put(["Toast or snackbar in/out","Toast notifications","Animated notification toasts with a progress bar","Toast with progress bar"], "DECLINED", "Declined: nothing to announce. The one confirmation the site has — copy-link — resolves in place in 400ms, which is faster than a toast could appear.")
put(["Banner slide-down"], "DECLINED", "Declined: the confidentiality marker is permanent, not an announcement to dismiss.")
put(["Command palette open"], "DECLINED", "Declined as duplicate: the index modal already searches all 262 sections and is one tap from every screen.")
put(["Crossfade between data states","Empty-state transition"], "LIVE", L["skel"] + " → content")
put(["Theme switch"], "ALREADY", "Existing `useTheme` with a `.theme-switching` paint guard")
put(["3D card flip"], "DECLINED", R["nosubject"] + " No card here has a back worth hiding.")
put(["Animated badges","Badge count pop"], "LIVE", "Claim and tier badges lift on hover; the copied tick pops")
put(["Timeline animations","Animated data visualization","Animated infographics","Animated infographics / interactive storytelling"], "ALREADY", "The 52 bespoke visualisations, animating through lib/motion.ts")
put(["Loading bar transitions"], "LIVE", L["rail"])
put(["Animated search expand"], "DECLINED", "Declined: the index search is already visible in the sheet that contains it; hiding it behind an icon would add a step.")
put(["Notification bell animation"], "DECLINED", "Declined: no notifications. This is a document, not an application.")
put(["Live typing indicator"], "DECLINED", R["nolive"])
put(["Pagination transitions"], "DECLINED", "Declined: no pagination. The document is one scroll per part, indexed by the table of contents.")
put(["Masonry layout","Bento box layout","Aspect ratio containers","Card stack effect"], "DECLINED", R["noise"] + " The grid this document needs is a reading grid; asymmetric layouts would fight the section numbering.")

# ---- §8 Data ---------------------------------------------------------------
put(["Bars growing from baseline","Animated progress bars","Linear progress fill"], "LIVE", "Sidebar target bar and the existing charts — `growFromBaseline`; true proportion under reduced motion")
put(["Line draw","Area fill sweep"], "ALREADY", "`drawPath` in the existing chart components")
put(["Radial or pie sweep","Donut segment reveal","Progress ring fill","Circular progress indicators","Progress ring animation"], "LIVE", "`ProgressRing` — dash offset resolves to the true value under reduced motion, never to zero")
put(["Gauge needle sweep","Gauge animation"], "LIVE", "`ProgressRing gauge` — 270° arc")
put(["Value morph between numbers","Value morph"], "LIVE", "`CountUp` — eased, with the final value set from the source rather than from the interpolation")
put(["Odometer digit roll","Vertical digit roll","Split-flap or flip-board","Split-flap / flip-board"], "LIVE", "`Odometer` — per-digit wheels; only changed digits move")
put(["Point-by-point scatter drop-in","Heatmap cell fill","Heatmap animation","Data highlighting"], "LIVE", "`.fx-point`, `.fx-cell`, `.fx-datapoint` — the cartogram uses the fill; the others are available to the chart layer")
put(["Axis and gridline fade-in"], "ALREADY", "Recharts fades axes in with the chart body in the existing visualisations")
put(["Tooltip follow along a series","Brush and zoom on a range"], "ALREADY", "Recharts interaction in the existing charts")
put(["Live-updating stream"], "DECLINED", R["nolive"])
put(["Sankey or flow trace","Node-graph physics settle"], "DECLINED", R["nosubject"])

# ---- §9 Map ----------------------------------------------------------------
put(["Progressive region fill","Choropleth value transition"], "LIVE", L["carto"] + " — tiles fill in ward order; all 40 present at true colour under reduced motion")
put(["Pin drop with bounce","Route path trace","Zoom to region","Cluster expand and collapse","Radius or catchment pulse","Flight-line arc animation","3D map tilt"], "DECLINED", R["nomap"])

# ---- §10 Feedback ----------------------------------------------------------
put(["Shake on error","Error shake","Field validation shift","Character-count warning","Character count warning"], "DECLINED", R["noform"])
put(["Bounce","Wobble or jiggle","Wobble effect","Tada animation","Jello effect","Rubber band effect","Swing animation","Heartbeat animation","Flash effect","Attention seekers","Attention nudge on an idle element"], "DECLINED", R["noise"] + " A proposal that jiggles to get attention is a proposal that has lost the argument.")
put(["Highlight flash"], "ALREADY", "`:target` flash on arriving at a deep link — 2.2s, already in globals.css")
put(["Glow pulse"], "LIVE", "Live status dot in the confidentiality marker")
put(["Checkmark draw on success","Success animation"], "LIVE", "Copy-link confirmation — the tick draws, it does not appear")
put(["Cross draw on failure"], "DECLINED", R["noform"])
put(["Confetti or celebration burst"], "DECLINED", "Declined on register: nothing in a confidential campaign proposal warrants confetti.")

# ---- §11 Loading -----------------------------------------------------------
put(["Spinner","Loading spinner variations","Indeterminate progress bar","Determinate progress bar","Percentage counter","Optimistic UI placeholder"], "DECLINED", "Declined: nothing here waits on a network. The page is statically generated and every section is present at build time; the only wait is component mount, which the skeleton covers.")
put(["Step-by-step progress indicator","Step progress indicator","Multi-step form transition"], "DECLINED", R["noform"])
put(["Favicon animations"], "DECLINED", "Declined: a moving favicon on a confidential link-only document draws attention to a tab that should not draw attention.")

# ---- §12 Typography --------------------------------------------------------
put(["Kinetic typography"], "DECLINED", R["noise"])
put(["Variable font weight or width animation","Variable font animations","Variable optical size shift"], "LIVE", "Montserrat is loaded as its variable axis, so weight is a real interpolation rather than synthesised bold")
put(["Letter-spacing on entry","Letter spacing animation"], "LIVE", "`.fx-tracking-in` — the one place a non-transform property animates, on a single short heading")
put(["Text scramble or decode","Text scramble effect","Text scramble"], "LIVE", "`Scramble` — short labels only; never a figure, per " + R["honesty"].split(":")[1].strip())
put(["Cycling word swap"], "LIVE", L["hero"] + " — `WordCycler`, its word list read from the section index so it cannot drift")
put(["Text along a path"], "DECLINED", R["noise"])
put(["Custom font pairing"], "ALREADY", "Montserrat display and body, set from one variable font file")
put(["Gradient text","Text clipping with background"], "LIVE", L["hero"] + " — the title is ink-to-accent-to-gold")
put(["Text shadow"], "ALREADY", "The Wiper mark carries `drop-shadow-sm`; body type deliberately carries none, because a shadow under 17px prose costs contrast and buys nothing.")
put(["Responsive text sizing"], "ALREADY", "The fluid clamp() scale plus the reading-density control")
put(["Drop cap styling"], "LIVE", L["prose"] + " — `.prose h2 + p::first-letter`, a raised initial on each sub-section's lead paragraph, at reading widths only")

# ---- §13 Media -------------------------------------------------------------
put(["Image mask reveal","Masked image gradients","Clip-path shape reveal"], "LIVE", "`.fx-mask-fade-x` on the ticker; masked grid behind the hero")
put(["Image crossfade","Gallery transition","Lightbox open and close","Lightbox","Focus rack","Depth of field blur","Duotone or colour-grade transition","Duotone image effect","Image border animations"], "DECLINED", R["nosubject"] + " The document has three portraits, no gallery.")
put(["Polaroid/photo frame effects"], "LIVE", "`SectionPortrait` — a physical frame with a slight rotation that straightens on hover")
put(["Neumorphism"], "DECLINED", R["noise"] + " Soft-UI shadows lose the contrast this document's badges depend on.")
put(["Glassmorphism"], "LIVE", L["chrome"])
put(["Gradient dividers"], "LIVE", L["prose"] + " — every rule, plus the toolbar and footer edges")

# ---- §14 3D ----------------------------------------------------------------
put(["Card flip","Perspective tilt","Axis rotation"], "LIVE", "`TiltCard` and the existing `.depth-card` stage")
put(["Cube or carousel rotation in 3D","Cube/carousel rotation","Camera dolly or orbit","Extrusion and depth reveal","Fold and unfold","Fold & unfold"], "DECLINED", R["nosubject"])
put(["Three.js 3D scenes"], "DECLINED", R["webgl"])
put(["SVG shape morph","Path morphing between icons"], "DECLINED", R["noise"])

# ---- §15 Navigation --------------------------------------------------------
put(["Menu open and close","Nav item stagger on open"], "LIVE", "QuickNavCapsule — panel plus a per-row cascade")
put(["Full-screen overlay nav","Hamburger-to-close icon morph"], "DECLINED", "Declined as duplicate: the index sheet and the bottom dock already reach every section, on every breakpoint.")
put(["Breadcrumb transition"], "ALREADY", "`SectionStickyBar` carries the running position")
put(["Dynamic island / notch animations"], "DECLINED", R["noise"])

# ---- §16 Forms -------------------------------------------------------------
put(["Floating label","Floating input labels","Inline validation","Error message slide-in","Password strength meter","Autocomplete list reveal","Autocomplete reveal","Submit button to loading to success morph","Animated submit button","Field clearing","File upload progress and drop-zone state","File upload progress","Checkbox and radio state","Checkbox/radio custom animation"], "DECLINED", R["noform"])

# ---- §17 Physics -----------------------------------------------------------
put(["Spring settle","Damped oscillation","Elastic overshoot","Inertia and momentum decay"], "LIVE", "`SPRING` / `SPRING_SOFT` in lib/motion.ts, and the spring easing on press and pop")
put(["Gravity drop","Collision and bounce","Chain or follow-the-leader lag","Soft-body or jelly deformation","Cloth or ribbon simulation","Flocking or swarm behaviour"], "DECLINED", R["cost"] + " The perceptual result these produce is available as keyframes; the simulations are not worth the frame budget.")

# ---- §18 Orchestration -----------------------------------------------------
put(["Sequential chain","Delayed cascade","Staggered timing"], "LIVE", "`Stagger` and `.fx-hero-seq` — index-driven, so a whole group is retimed from one property")
put(["Parallel group"], "LIVE", "`Reveal` siblings sharing a delay")
put(["Timeline with keyframes","Choreographed hero sequence"], "LIVE", L["hero"] + " — six elements on a single `--fx-beat`")
put(["State machine driven"], "ALREADY", "The existing tab, focus, density and zero-chrome state in ClientPage")
put(["Interruptible and reversible transitions","Interruptible transitions"], "LIVE", "Pointer effects are transitions, not animations, so a reversal mid-gesture picks up where it is")
put(["Reduced-motion fallback path","Reduced-motion fallback","Prefers-reduced-motion support"], "LIVE", "A dedicated block in visual-fx.css plus `useReducedMotion`: loops stop, entrances resolve, charts render at the truth, interaction feedback survives shortened")

# ---- §19 Enabling ----------------------------------------------------------
put(["Intersection Observer API"], "LIVE", "`useInView`, `NavDots`, `LazySection`, `LazyMount`")
put(["Progressive enhancement"], "LIVE", "Every scroll-driven rule sits inside `@supports`; unsupported means visible, never hidden")
put(["Hardware acceleration"], "LIVE", "translate3d and `will-change` applied narrowly, only where an element is actively animating")
put(["Request animation frame"], "LIVE", "`useScrollShell`, `CountUp` and the cursor chase, each coalesced into a single rAF")
put(["Debounced scroll handlers"], "LIVE", "One rAF-coalesced page-level scroll listener replaces three per-component handlers")
put(["Web Animations API"], "DECLINED", "Declined as unnecessary: these animations are declarative, so CSS keyframes and `motion` cover them without a third imperative API.")
put(["CSS containment"], "LIVE", "`contain: strict` on the ambient field; existing `content-visibility` on sections")
put(["Lazy loading everything"], "ALREADY", "LazyMount, LazySection and next/image")
put(["Font loading strategies"], "ALREADY", "next/font self-hosting with `display: swap` and `adjustFontFallback`")
put(["Critical CSS"], "ALREADY", "Next inlines it")
put(["Image optimization"], "ALREADY", "next/image AVIF/WebP")
put(["Theme persistence"], "ALREADY", "`useTheme`")

# ---- §20 Brand -------------------------------------------------------------
put(["Dark/light mode toggle"], "ALREADY", "Toolbar and dock, both wired to `useTheme`")
put(["Brand color animations"], "LIVE", "Live gradients on the part dividers, scroll rail and title")
put(["Color theme selector","Seasonal themes","Logo variations","Animated icons sets"], "DECLINED", "Declined: the party's colours are fixed. Wiper royal blue and earth red are brand constants, not a palette to choose from.")
put(["Ambient time-of-day effects","Ambient light / time-of-day effects","Time-of-day ambient shift"], "LIVE", "`useDaypart` — a few degrees of hue on the hero field only, never on text or data")

# ---- §21 Emerging ----------------------------------------------------------
put(["CSS blend modes / filter animations"], "LIVE", "Grain overlay uses `mix-blend-mode: overlay`; the tilt sheen uses soft-light")
put(["Gesture-based animations like shake-to-undo"], "DECLINED", R["nodrag"])

# ---------------------------------------------------------------------------
sec = None
rows = []
seen = set()
for line in open(BRIEF, encoding="utf-8"):
    m = re.match(r"^## (.+)$", line)
    if m:
        sec = m.group(1).strip(); rows.append(("H", sec)); continue
    m = re.match(r"^-   (.+?)(?: ---.*)?$", line.rstrip())
    if m and sec:
        name = m.group(1).strip()
        key = (sec, name.lower())
        if key in seen: continue
        seen.add(key)
        rows.append(("R", name))

out = io.StringIO()
missing = []
counts = {"LIVE": 0, "ALREADY": 0, "DECLINED": 0}
for kind, val in rows:
    if kind == "H":
        out.write(f"\n### {val}\n\n| Technique | Status | Where / why |\n|---|---|---|\n")
    else:
        hit = M.get(val.lower())
        if not hit:
            missing.append(val); status, detail = "?", "?"
        else:
            status, detail = hit
            counts[status] += 1
        badge = {"LIVE": "**Live**", "ALREADY": "Already", "DECLINED": "Declined"}.get(status, status)
        out.write(f"| {val} | {badge} | {detail} |\n")

if missing:
    sys.stderr.write("UNMAPPED (%d):\n%s\n" % (len(missing), "\n".join(missing)))
    sys.exit(1)

sys.stderr.write("mapped: %s  total rows: %d\n" % (counts, sum(counts.values())))
print(out.getvalue())
