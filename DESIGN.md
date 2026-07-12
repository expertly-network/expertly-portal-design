---
name: Expertly
description: A curated network of verified finance and legal practitioners.
colors:
  counsel-teal: "#00A582"
  counsel-teal-bright: "#00C99E"
  neon-bloom: "#8BFCD8"
  partners-forest: "#0B3A2D"
  pitch-ink: "#0B0B0C"
  near-ink: "#1E1E20"
  counsel-gray: "#5C5C61"
  muted-gray: "#9A9AA0"
  paper-white: "#FFFFFF"
  mint-wash: "#F2FBF7"
  hairline: "#ECECEE"
  rule-line: "#DBDBDE"
  verified-green: "#0E9E6E"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui"
    fontSize: "clamp(44px, 6.5vw, 96px)"
    fontWeight: 500
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui"
    fontSize: "clamp(32px, 4vw, 56px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui"
    fontSize: "clamp(28px, 3.2vw, 44px)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui"
    fontSize: "clamp(17px, 1.3vw, 20px)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.005em"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui"
    fontSize: "11px"
    fontWeight: 500
    letterSpacing: "0.14em"
rounded:
  pill: "100px"
  card: "12px"
  btn: "8px"
  btn-lg: "10px"
  modal: "20px"
  nav: "22px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "64px"
  section: "88px"
components:
  button-primary:
    backgroundColor: "{colors.pitch-ink}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.btn}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.near-ink}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.btn}"
    padding: "10px 18px"
  button-outline:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.pitch-ink}"
    rounded: "{rounded.btn}"
    padding: "10px 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.near-ink}"
    rounded: "{rounded.btn}"
    padding: "10px 18px"
  chip-default:
    backgroundColor: "{colors.mint-wash}"
    textColor: "{colors.near-ink}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  chip-accent:
    backgroundColor: "{colors.mint-wash}"
    textColor: "{colors.counsel-teal}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

# Design System: Expertly

## 1. Overview

**Creative North Star: "The Senior Partner's Office"**

Expertly should feel like stepping into a senior partner's office — warm, authoritative, and immediately communicating that you are in the right place. Not a directory. Not a marketplace. A private room where serious matters are handled by the right people. The design is confident without being cold, curated without being precious. It earns trust through restraint and specificity, not decoration.

The visual language draws from institutional finance communications and the considered design of firms like Sequoia Capital and a16z: strong typographic hierarchy, a near-monochrome neutral canvas with one precise accent color, and breathing room that signals quality rather than rushing the visitor to convert. Every surface has purpose. What's absent is as deliberate as what's present.

This system explicitly rejects the visual grammar of generic legal directories (cluttered, SEO-heavy, low-trust), Big-4 firm websites (committee-designed, lifeless, speaking to procurement), VC-funded SaaS clone aesthetics (san-francisco-generic, no domain gravitas), and freelancer marketplace commoditisation. If a design choice could belong to any of those contexts, it is the wrong choice for Expertly.

**Key Characteristics:**
- Institutional confidence: precision in layout, spacing, and typographic hierarchy
- Warm authority: dark forest green structures (nav, footer) grounding a crisp white canvas
- One precise accent: Counsel Teal used sparingly — verification, interactivity, and trust signals only
- Tactile and confident: interactive elements have intentional micro-motion, never decorative animation
- Domain fluency: visual density and copy register that practitioners recognise as their world

## 2. Colors

A near-monochrome canvas anchored by Partner's Forest and animated by a single teal accent. Warmth comes from the green structures, not from tinted backgrounds.

### Primary
- **Counsel Teal** (#00A582): The sole interactive accent. Used on verification badges, active states, CTA hover treatments, and the accent hairline before section eyebrows. Rare by design — its scarcity is the signal of trust. Never use as a surface color or background fill on large areas.
- **Counsel Teal Bright** (#00C99E): Hover-state and glow variant of the primary. Used in nav button hover states, dot indicators, and neon glow effects at very low opacity.

### Secondary
- **Partner's Forest** (#0B3A2D): The institutional anchor. Used exclusively for the navigation bar and footer — the permanent, structural elements of every page. Its depth and warmth signal authority and make the white canvas feel intentional rather than empty.

### Tertiary
- **Neon Bloom** (#8BFCD8): A pale, desaturated mint used only for glow and radial gradient effects on dark surfaces. Never used on light backgrounds. A ghost of the accent, not an accent in its own right.
- **Verified Green** (#0E9E6E): Success and verification states only. The verified member badge, confirmation copy, and success indicators.

### Neutral
- **Pitch Ink** (#0B0B0C): Primary text and filled button background. Near-black, not pure black — avoids harshness while maintaining authority.
- **Near Ink** (#1E1E20): Secondary text where primary is too heavy. Used for headline body inside cards.
- **Counsel Gray** (#5C5C61): Muted text — supporting copy, lede paragraphs, meta labels. Must pass 4.5:1 against white backgrounds; verify before use in small body type.
- **Muted Gray** (#9A9AA0): Placeholder text, disabled states, secondary metadata. Never body copy.
- **Paper White** (#FFFFFF): Primary page background and card surface. Crisp, not warm.
- **Mint Wash** (#F2FBF7): Alternate background tint on panels, hover states, and chip backgrounds. The lightest presence of Counsel Teal in the system.
- **Hairline** (#ECECEE): Dividers and card borders at rest.
- **Rule Line** (#DBDBDE): Stronger dividers between content sections.

### Named Rules
**The One Voice Rule.** Counsel Teal appears on ≤10% of any given screen at any given time. Every additional use must justify itself against this budget. If you're considering teal as a decorative element, that is the wrong choice.

**The Structure Rule.** Partner's Forest (#0B3A2D) is reserved for the nav and footer — the permanent frame. Introducing it as a section background or card fill breaks the hierarchy that makes those structures feel permanent.

## 3. Typography

**Display Font:** Geist (with ui-sans-serif, system-ui fallback)
**Body Font:** Geist (same family, different weight)
**Label / Mono Font:** Archivo (with ui-sans-serif, system-ui fallback)

**Character:** Geist brings precise, geometric authority to headings and body alike — its tight negative tracking at display sizes reads as institutional confidence, while its comfortable 16px body weight is readable without being casual. Archivo serves as the system's functional voice: labels, timestamps, metadata, and mono accents use its utilitarian clarity to distinguish interface elements from content.

### Hierarchy
- **Display** (500 weight, clamp 44px → 96px, line-height 0.98, -0.03em tracking): Hero statements only. One per page. The heading should feel like a title card, not a paragraph opener.
- **Headline** (500 weight, clamp 32px → 56px, line-height 1.04, -0.025em tracking): Major section headings. Used sparingly — two or three per page maximum.
- **Title** (500 weight, clamp 28px → 44px, line-height 1.08, -0.02em tracking): Sub-section headings, card headings in prominent positions.
- **Body / Lede** (400 weight, clamp 17px → 20px, line-height 1.5, -0.005em tracking): Supporting copy below headings. Max line length 65–75ch. Color: Counsel Gray on white backgrounds.
- **UI Body** (400–500 weight, 16px, line-height 1.5): Navigation, buttons, card body text, form inputs.
- **Label** (Archivo, 500 weight, 11px, 0.14em letter-spacing, capitalize): Eyebrows, section kickers, chip labels, metadata. Never full uppercase — capitalize only.

### Named Rules
**The Single-Family Rule.** Do not introduce a third typeface. Geist handles all display and body; Archivo handles all labels and interface metadata. A serif headline or an additional display face breaks the institutional clarity this system depends on.

**The Tight-Track Rule.** Display and headline tracking is negative (-0.03em to -0.02em). Positive tracking is prohibited on headings — it reads as decorative, not authoritative. Positive tracking is permitted on labels only (Archivo, 0.14em), where it aids legibility at small sizes.

## 4. Elevation

This system is flat by default, with a two-layer shadow vocabulary for interactive surfaces. No decorative shadows. No glassmorphism. Depth is structural: it answers the question "can I interact with this?" not "does this look premium?"

Cards and interactive containers rest flat. On hover or elevation-triggered states, a two-layer shadow communicates lift: the first layer (ambient) is barely visible and handles diffuse depth; the second layer (structural) is longer-range and signals the element has risen.

### Shadow Vocabulary
- **Card Rest** (`0 1px 2px rgba(15,18,20,0.04), 0 8px 24px -16px rgba(15,18,20,0.16)`): Default state for cards, event items, member chips. Barely perceptible — signals "surface" without "floating".
- **Card Hover** (`0 2px 4px rgba(15,18,20,0.04), 0 26px 48px -22px rgba(15,18,20,0.28)`): Applied on hover. Communicates interactivity through lift, not color.
- **Modal / Command Palette** (`0 40px 100px -30px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.02)`): Deep shadow reserved for the search panel and modals that float above all content.

### Named Rules
**The Flat-By-Default Rule.** A surface that doesn't interact gets no shadow. The shadow vocabulary is a state language, not a decoration. Using shadows on static elements dilutes their communicative value.

## 5. Components

### Buttons
Tactile and confident — buttons respond to interaction with intentional micro-motion (1px translateY lift on hover). Shape is gently rounded (8px radius) — professional, not playful.
- **Primary:** Pitch Ink background, Paper White text, 8px radius, 10px / 18px padding (14px / 24px for lg). The default CTA across the site. Hover: Near Ink background + 1px Y-lift.
- **Outline:** Paper White background, Pitch Ink text, Rule Line border at rest. Border animates to Pitch Ink on hover. Used for secondary actions alongside a Primary button.
- **Ghost:** Transparent background, Near Ink text. Hover: Mint Wash background. Used in the nav and for low-emphasis actions.
- **Nav Primary (special):** White background, Partner's Forest text. Appears only inside the dark nav. Hover: Counsel Teal Bright background, Partner's Forest text.

### Chips / Tags
Pill shape (100px radius). The system uses chips for practice areas, jurisdictions, verification states, and filter tags.
- **Default:** Mint Wash background, Near Ink text, Hairline border.
- **Accent:** Mint Wash background, Counsel Teal text, Counsel Teal border at low opacity. Used for active filters and matched tags.
- **Ink:** Pitch Ink background, Paper White text. Used for primary category labels on dark surfaces.
- **Verified:** Verified Green text, green icon. Never repurposed for non-verification contexts.

### Cards / Containers
Flat at rest with Card Rest shadow. Hover lift via Card Hover shadow. Paper White surface, 12px radius, Hairline border.
- **Internal padding:** 20–24px standard; 16px for compact list items.
- **Never nest cards.** A card inside a card is always wrong — flatten the information hierarchy instead.

### Inputs / Fields
- **Style:** Paper White background, Rule Line border (1px), 8px radius. Geist 16px placeholder in Muted Gray.
- **Focus:** Border shifts to Pitch Ink (1px → 1.5px). No glow, no color change. Focus is communicated by weight, not color.
- **The Search Input (signature):** The global AI search input carries an animated typewriter phrase, a left-side "AI Search" indicator with a Counsel Teal pulse dot, and an icon-button right side. It has a 2px border at all times, transitioning to Pitch Ink on focus.

### Navigation
Floating pill that descends from the top on scroll — dark Partner's Forest background, 22px radius, shadow that intensifies as it separates from the hero. The logo uses Geist 600, 23px, with a small Counsel Teal Bright dot indicating active network status. Nav links use Ghost button style at rgba(255,255,255,0.74); active links are full white. CTA uses Nav Primary button variant.

### Member / Expert Cards (signature)
The directory card is the system's most critical recurring component. It carries: circular avatar (40px, 50% radius), name in Geist 500 14.5px, practice area and jurisdiction as chips, and a verified badge. Hover lift via Card Hover shadow. The card body never uses Counsel Teal for decorative purposes — only for the verified state.

## 6. Do's and Don'ts

### Do:
- **Do** use Counsel Teal exclusively for trust signals: verification badges, interactive hover states, active filters, and the accent hairline before eyebrows. Its rarity is its credibility.
- **Do** let Partner's Forest (#0B3A2D) anchor the page structurally — in the nav and footer only. These dark bookends make the white canvas feel intentional and authoritative.
- **Do** apply hover lift (1px translateY + Card Hover shadow) to every interactive card and button. Tactile response is a trust signal.
- **Do** use Archivo for all labels, metadata, timestamps, and eyebrows. Geist is the content voice; Archivo is the interface voice. Keep them separate.
- **Do** maintain 4.5:1 contrast on all body text, including Counsel Gray (#5C5C61) at small sizes. Senior professionals at this network's level will not forgive unreadable copy.
- **Do** honour `prefers-reduced-motion`. Every animation must have a motionless fallback. The marquees, counter animations, and hover transitions all require it.
- **Do** apply `text-wrap: balance` to h1–h3 headings to prevent awkward orphan lines at responsive widths.

### Don't:
- **Don't** use gradient text (`background-clip: text`). This is prohibited — it reads as a 2023 SaaS tell and directly contradicts the institutional register.
- **Don't** build identical card grids with icon + heading + text repeated identically across a section. Cards are the lazy answer. Use marquees, split sections, or editorial layouts instead.
- **Don't** put an eyebrow kicker above every section. The system uses eyebrows deliberately — one per section is too many if the sections themselves do the work. Refer to PRODUCT.md's Design Principle on restraint.
- **Don't** use numbered section markers (01 / 02 / 03) as default section scaffolding. Numbers earn their place only when the section is a genuine ordered sequence.
- **Don't** make the site look like a generic legal directory (Avvo, Martindale-Hubbell): no cluttered multi-column layouts, no aggressive green SEO buttons, no star-rating widgets, no directory-style filter sidebars dominating the page.
- **Don't** make the site feel like a Big-4 consulting website (Deloitte, PwC, EY): no committee-designed hero imagery, no gradient band sections with 4-up service-area tiles, no corporate stock photography, no lifeless sans-serif headlines in 600-weight gray.
- **Don't** make the site look like a VC-funded SaaS product (Notion/Linear aesthetic clones): no cream/warm-neutral body backgrounds, no full-page gradient mesh heroes, no "50+ integrations" social proof grid, no product screenshot floating on a gradient pedestal.
- **Don't** signal marketplace or commodity (Upwork, Fiverr): no star ratings, no price-per-hour badges as the primary visual element, no "hire" button language, no availability indicators that reduce a senior partner to a gig worker.
- **Don't** use `border-left` greater than 1px as a colored stripe on cards, callouts, or alerts. Rewrite with full borders, background tints, or leading icons instead.
- **Don't** introduce glassmorphism decoratively. The blur/glass aesthetic is permitted in the global search modal only, where it serves a functional purpose (focus isolation).
