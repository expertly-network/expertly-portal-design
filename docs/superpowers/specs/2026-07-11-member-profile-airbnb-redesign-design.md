# Member Profile Page — Airbnb-Inspired Redesign

> **Status:** Approved for implementation planning.
> **Output:** New file `static_html/member-profile-v3.html`. `member-profile-v2.html` is left untouched.

## Purpose

The current member profile page (`static_html/member-profile-v2.html`) uses a dense, corporate-dashboard visual language (navy header band, square avatar, underlined tabs). The goal is a warmer, more personal visual treatment inspired by Airbnb's host/profile page, applied on top of the existing green brand theme (`#033c2f` navy-green, `#00A582` accent, `#f2fbf7` page background, Geist/Archivo type) — without changing any data model, JS logic, or interactive behavior.

## Scope

**In scope:** Visual/markup restyle of the entire page — header card, tab navigation, all six tab panels (About, Credentials, Articles, Reviews & Recognition, Peer Connect, Contact Information), right sidebar, mobile CTA strip, and the consultation request modal.

**Out of scope:** Any change to data fields, API calls, JS render logic/control flow, routing, auth wall logic, or Peer Connect functionality. No new data (e.g. no numeric star rating — that field does not exist in `PROFILE_REVIEWS` or the member data model).

## Implementation strategy

1. Copy `static_html/member-profile-v2.html` to `static_html/member-profile-v3.html`.
2. Keep every element `id` referenced by the inline `<script>` block unchanged, so the existing render functions (`renderProfile`, tab population, modal handlers, Peer Connect rendering, etc.) work without modification.
3. Restyle via the page's `<style>` block (CSS classes like `.mp-header-card`, `.mp-avatar`, `.mp-tabs-nav`, `.mp-tab`, `.mp-sidebar-card`, etc.) and small, targeted markup changes where a class-only change can't achieve the new layout (e.g. avatar shape, meta-stats line separators, sidebar CTA card internal structure).
4. No changes to `assets/theme.css`, `assets/home.css`, `assets/pages.css`, `assets/auth.css`, or shared JS files — all styling changes live in the page's own `<style>` block, consistent with how v2 already overrides page-level styles inline.

## 1. Header Card

Replace the navy top-band + square avatar layout with an Airbnb "host card" layout:

- White card, `rounded-2xl` (20px), thin border (`#e0eae4`), soft shadow. **No colored band.**
- Avatar becomes **circular** (`border-radius: 50%`), 144px desktop / 112px mobile, `4px solid white` border, drop shadow. Photo renders via `object-cover`; fallback renders navy-tinted initials background (reuse existing `.mp-avatar-initials` logic, restyled for a circle).
- Verified checkmark badge stays overlapping bottom-right of the avatar, same 32px circle/checkmark treatment as today, repositioned for the circular avatar.
- (Correction from initial draft: v2's header has no LinkedIn button — LinkedIn only appears as a contact card in the Contact Information tab. No header change needed for it.)
- Name row: large bold name (`text-2xl`/`text-3xl` responsive) + inline verified icon + tier pill badge — same data/visibility rules as v2 (`isSeasoned` → amber pill labeled "Seasoned Professional"; otherwise gray "Member" pill).
- Designation/firm line unchanged in content and logic.
- **Meta line** (new): a single Airbnb-style inline row combining the existing three stats — location (pin icon), years of experience (clock icon), service name (clipboard icon) — separated by `·` instead of the current wrapped icon-pill row. Same underlying data (`location`, `extended.yearsOfExperience`/`member.tenure`, `extended.services[0].name`/`member.practice`); only the visual presentation changes. Fee range is **not** shown here — it stays in the mobile CTA strip and sidebar per existing visibility rules (seasoned tier + authenticated + fee set).

## 2. Tab Navigation

Replace the underlined tab bar with **standalone filter pills**:

- Each tab (`About`, `Credentials`, `Articles`, `Reviews & Recognition`, `Peer Connect`, `Contact Information`) renders as an individual rounded-full button, not connected to a shared bar.
- Active pill: solid dark-ink fill (`#0a1a14`), white text.
- Inactive pill: white background, thin border (`#e0eae4`), muted text; hover → border darkens slightly.
- Same horizontal-scroll-on-overflow behavior for mobile as v2.
- No change to `data-tab` attributes or the JS click handler that swaps `.active` class / shows/hides `.mp-tab-panel` elements.

## 3. Content Cards (all tab panels)

- Section cards (education grid, work-experience timeline cards, credential rows, contact cards, award cards, etc.) keep the rounded-card pattern but with softer, slightly larger corner radius to match the header, and the same thin-border/soft-shadow treatment used site-wide.
- `GrayTag`-equivalent chips (qualifications, service tags on testimonials) become full pill shape (`border-radius: 100px`) instead of the current rounded-rectangle tag.
- Section labels (icon + uppercase label) unchanged in structure/content.
- Timeline dot/line treatment in Work Experience unchanged structurally, restyled to match new corner radius language.

## 4. Reviews & Recognition Tab

- **Client Testimonials** re-rendered as Airbnb-style review cards: circular initials avatar, client name + existing verified checkmark, role line (`clientTitle · clientCompany`), quote text, footer row with service tag pill + date — all from the existing `PROFILE_REVIEWS[member.id].testimonials` fields (`clientName`, `clientTitle`, `clientCompany`, `quote`, `serviceName`, `date`, `isVerified`). **No aggregate star rating is added** — that data does not exist.
- **Awards & Recognition** grid keeps its current fields (`title`, `issuingBody`, `year`, `description`) with the same soft-card restyle as other sections.
- Empty state ("No reviews yet" / sub-copy) unchanged in content, restyled to match (icon circle, muted text).
- Testimonial carousel behavior (`nextTestimonial()`, "static" class when ≤2 testimonials) unchanged.

## 5. Right Sidebar

- **Consultation Fee + CTA card** gets the Airbnb "booking card" treatment: stronger border + shadow than other cards, fee shown as a large hero number (`$Min – $Max / hr`), availability status (green dot "Available" / muted "Currently unavailable") directly beneath the fee using existing `isAvailable` data, a thin divider, then the full-width "Request Consultation" button (existing disabled/50%-opacity-when-unavailable rule preserved). Add one small reassurance microcopy line beneath the button, static text (not tied to any new data field) — e.g. "Typically responds within 24 hours." Unauthenticated variant ("Sign in to send a consultation request…" + "Sign in to Contact" button) keeps its current copy and logic, restyled to match.
- **Location card** and **Verified badge card**: unchanged content/visibility rules, restyled with the new rounded-corner/shadow language.
- **Back to Members** link: unchanged.
- Sticky positioning, breakpoint visibility (`hidden` below `lg`), and width (`256px`/`288px`) unchanged.

## 6. Mobile CTA Strip & Consultation Modal

- Mobile CTA strip: unchanged layout/logic, restyled corners/shadow to match.
- Consultation modal: unchanged fields, validation, character counter, submit/success states, escape-to-close, backdrop-click-to-close, body-scroll-lock — restyled corners, button pill shape, and input border-radius to match the new visual language.

## 7. Peer Connect & Contact Information Tabs

- No structural or functional change (session card, streak banner, stat strip, availability grid, milestones, meeting history, referral hub, contact cards) — restyled only for corner radius, border, and shadow consistency with the rest of the page.

## Non-goals / explicitly deferred

- No new "star rating" or numeric review score — not in the data model.
- No change to responsive breakpoints beyond what's needed to keep the circular avatar and pill tabs looking correct at each size (values stay the same: `sm` 640px, `lg` 1024px, `xl` 1280px).
- `member-profile-v2.html` is not modified or deleted.
- No routing/URL changes; tabs remain pure client-side state.
