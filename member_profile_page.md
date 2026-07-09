# Member Profile Page — UI/UX Specification

> **Purpose:** Exact layout and interaction spec for the public member profile page (`/members/[slug]`). Rebuild this page in your own codebase using your own theme colours, fonts, and data layer — but replicate every structural decision, spacing, placement, and interaction described here exactly.

---

## Data Fields Required

```
member:
  id, slug, isVerified, memberTier, profilePhotoUrl
  headline, bio, designation, firmName, firmWebsite
  city, country, yearsOfExperience
  feeRangeMin, feeRangeMax, feeCurrency
  isAvailable, availabilityNotes
  contactEmail, contactPhone, linkedinUrl, website
  services: { name }
  users: { fullName, firstName, lastName, email }
  engagements[]:  { id, title, organization, year, url }
  qualifications[]: { id, name, year }
  educations[]:   { id, degree, institution, field, endYear }
  workExperiences[]: { id, title, company, startYear, endYear, isCurrent, description }
  credentials[]:  { id, name, issuingBody, year, isVerified }
  articles[]:     fetched separately — { id, slug, title, publishedAt, readTimeMinutes,
                    featuredImageUrl, category: { name } }
```

**Display name logic:** `user.fullName` → `user.firstName + ' ' + user.lastName` → `'Expert'` (in priority order).

**Initials:** first letter of each word in display name, max 2 characters, uppercase.

**Location:** `city, country` joined with `, ` (omit if both empty).

**Tier label:** map `memberTier` slug to a human-readable label. `seasoned_professional` → amber badge. All others → gray badge.

**Fee visibility:** only shown when `memberTier === 'seasoned_professional'` AND user is authenticated AND at least one of `feeRangeMin`/`feeRangeMax` is set.

---

## Unauthenticated State

If the visitor is not signed in, show a full-page "auth wall" instead of the profile. Do not render any profile content. The auth wall should:

- Display a back link ("Back to Members" → `/members`)
- Show a heading prompting sign-in
- If the member's display name is known: *"Sign in to view the full profile of [Name], including their experience, services, and contact details."*
- If not known: *"Sign in to view full member profiles, contact details, and professional credentials."*
- A primary CTA button that sends the user to the login/signup page, with a `returnTo` parameter pointing back to this profile URL.

---

## Page Background

The entire page sits on a `gray-50` background (very light gray). There is no white body background.

---

## 1. Profile Header Card

A single white card, `rounded-2xl`, thin gray border (`border-gray-100`), standard box shadow, `overflow-hidden`. Sits at the top of the content area with `mb-6` below it.

### 1a. Navy Top Band

- Full-width coloured band at the top of the card.
- Height: `96px` on mobile, `112px` on `sm+`.
- Background: your primary dark colour (the original is `#1e3a5f` navy).
- Layered on top of that solid colour: a purely decorative radial gradient overlay (pointer-events none, aria-hidden):
  - First gradient: ellipse 60% wide × 80% tall, positioned bottom-left area, warm gold tint at ~8% opacity, fading to transparent.
  - Second gradient: ellipse 40% wide × 60% tall, positioned right-center, blue tint at ~7% opacity, fading to transparent.
- This creates a subtle glow effect in the corners of the band. It is purely decorative.

### 1b. Avatar

- Overlaps the bottom edge of the navy band by pulling up with negative top margin: `-56px` on mobile (`-mt-14`), `-64px` on `sm+` (`-mt-16`).
- Dimensions: `112×112px` (mobile), `144×144px` (sm+).
- Shape: `rounded-2xl` (not a circle).
- Border: `4px solid white`.
- Shadow: large (`shadow-lg`).
- If `profilePhotoUrl` is set: render `<img>` with `object-cover object-top`.
- If no photo: render a dark navy square with the member's initials in white, bold, `text-4xl`.
- If `isVerified`:
  - Render a small verification badge absolutely positioned at bottom-right of the avatar: `-6px` bottom, `-6px` right.
  - Badge: `32×32px` circle, your primary blue background, `2px solid white` border, small shadow.
  - Icon inside: white checkmark SVG, `16×16px`.

### 1c. LinkedIn Button

- In the same flex row as the avatar (flex row on `sm+`, column on mobile).
- Pushed to the far right (`justify-end` on the flex container).
- Only rendered if `linkedinUrl` is present.
- Style: LinkedIn brand colour button (`#0077B5` background, hover to `#006097`), white text, `text-xs font-semibold`, `px-4 py-2.5`, `rounded-lg`.
- Contains the LinkedIn logo SVG (16×16, white fill) + text "LinkedIn".
- Opens in a new tab.

### 1d. Name Row

- Below the avatar section, `mt-4` spacing.
- Inline flex row, wrapping, with `gap-2` between items, `mb-1`.
- **Name:** `text-2xl` (mobile) / `text-3xl` (sm+), `font-black`, dark navy, `tracking-tight`.
- **Verified badge** (if `isVerified`): inline blue shield/badge SVG, `24×24px`. This is a second verification indicator in addition to the avatar badge — both appear simultaneously.
- **Tier badge** (if `memberTier` has a label):
  - `rounded-full`, `text-xs font-semibold uppercase tracking-wide`, `px-2.5 py-1`.
  - `seasoned_professional`: amber background (`bg-amber-50`), amber text (`text-amber-700`), amber border.
  - Other tiers: gray background (`bg-gray-100`), gray text, gray border.

### 1e. Designation + Firm

- Directly below the name row (no separator).
- Designation: `text-base font-medium`, muted secondary text colour.
- Firm name: `text-sm`, more muted text colour, `mt-0.5` spacing.

### 1f. Stats Row

- `mt-4`, flex row, wrapping, `gap-4`, `text-sm` muted text.
- Each stat is an inline `<span>` with a small `14×14px` icon + text, `gap-1` between icon and text.
- Stats shown (in this order, each only if data exists):
  1. **Location** — map pin icon + `city, country`
  2. **Years of experience** — clock icon + `{yearsOfExperience}+ years experience`
  3. **Fee range** — currency icon + `{currency}{min}–{currency}{max} / hr` (only if fee visibility conditions met — see Data Fields section)
  4. **Service type** — clipboard icon + `services.name`

---

## 2. Mobile CTA Strip (hidden on desktop)

- Shown only below the `lg` breakpoint (≥1024px hides it entirely).
- White card, `rounded-2xl`, thin border, shadow, `p-4`.
- `mb-6` below it.
- Flex row, `items-center`, `justify-between`, `gap-4`.

**Left side (min-width 0, truncate if needed):**
- Fee range (if applicable): `text-sm font-bold` dark navy, inline `/ hr` suffix in `text-xs font-normal` muted.
- Availability status below it:
  - If available: green dot (`6×6px rounded-full bg-green-500`) + "Available" in `text-xs text-green-600 font-medium`, `mt-0.5`.
  - If unavailable: "Currently unavailable" in `text-xs` muted, `mt-0.5`.

**Right side:**
- If authenticated: primary button "Request Consultation", `text-sm px-4 py-2`, disabled + 50% opacity if `isAvailable === false`.
- If not authenticated: primary button "Sign in to Contact" linking to `/auth?returnTo=/members/{slug}`.

---

## 3. Two-Column Layout

Below the header card (and mobile CTA), a flex container:
- Mobile: single column (flex-col).
- Desktop (`lg+`): two columns side by side (`flex-row`, `items-start`, `gap-6`).

### Left Column (main content — flex-1)

Contains the tab navigation and tab content panels.

### Right Column (sidebar — hidden on mobile)

`hidden lg:block`, width `256px` (`lg:w-64`) or `288px` (`xl:w-72`), `flex-shrink-0`.
Sticky positioned at `top: 96px` as user scrolls.

---

## 4. Tab Navigation

White card, `rounded-xl`, thin gray border, small shadow, `mb-4`, `overflow-hidden`.

A horizontal scrollable row of tab buttons (no visible scrollbar). Tabs:

| Order | ID | Label |
|-------|----|-------|
| 1 | `about` | About |
| 2 | `credentials` | Credentials |
| 3 | `articles` | Articles |
| 4 | `reviews` | Reviews & Recognition |
| 5 | `contact` | Contact Information |

Each tab button:
- `flex-shrink-0`, `px-5 py-3.5`, `text-sm font-medium`, `whitespace-nowrap`.
- **Active:** dark navy text, `border-b-2` in your primary blue colour, `-mb-px` (overlaps card border bottom), `bg-white`.
- **Inactive:** muted text, hover → secondary text colour.
- Default active tab on page load: `about`.

---

## 5. Tab Content Panel

White card, `rounded-xl`, thin gray border, small shadow, `p-6`.

### 5a. About Tab

Vertical stack, `space-y-8` between sections.

**Section: Headline + Bio**
- Only rendered if at least one of `headline` or `bio` is set.
- Headline (if set): `text-base font-semibold` dark navy, `mb-3`, `leading-snug`.
- Bio (if set): `text-sm` muted secondary colour, `leading-relaxed`, `whitespace-pre-line`.

**Section: Key Engagements**
- Only rendered if `engagements` array is non-empty.
- Section label (see reusable components below): lightning bolt icon + "Key Engagements".
- `space-y-2` list of engagement rows:
  - Each row: `flex items-center gap-3`, `rounded-xl border border-gray-100 bg-gray-50 px-4 py-3`.
  - Left: `20×20px` circle, light blue background, blue checkmark icon (`12×12px`) inside.
  - Center (`min-w-0 flex-1`):
    - Title: `text-sm` dark navy.
    - Subtitle (if `organization` or `year`): `text-xs` muted, `mt-0.5`. Format: `Organization · Year` (omit ` · ` if only one is present).
  - Right: If `url` is set, a small `↗` text link in blue, `text-xs`, opens in new tab.

**Section: Qualifications**
- Only rendered if `qualifications` array is non-empty.
- Section label: shield/badge icon + "Qualifications".
- `flex flex-wrap gap-2` of gray tags. Each tag shows `name (year)` if year is set, else just `name`. (See GrayTag component below.)

**Section: Education**
- Only rendered if `educations` array is non-empty.
- Section label: graduation cap icon + "Education".
- `grid sm:grid-cols-2 gap-3` of education cards.
  - Each card: `rounded-xl border border-gray-100 bg-white p-4 shadow-sm`.
  - Degree: `font-semibold text-sm` dark navy.
  - Institution + year: `text-xs` secondary muted, `mt-0.5`. Format: `Institution · Year` (omit ` · ` if no year).
  - Field: `text-xs` muted, `mt-0.5` (only if set).

**Empty state:** If none of headline, bio, or engagements exist: centered `text-sm` muted text "No information available yet."

---

### 5b. Credentials Tab

Vertical stack, `space-y-8`.

**Section: Education** — identical card grid to About tab education section.

**Section: Qualifications** — identical gray tags to About tab qualifications section.

**Section: Work Experience**
- Only rendered if `workExperiences` array is non-empty.
- Section label: briefcase icon + "Work Experience".
- Vertical timeline:
  - Container: `relative pl-4 border-l-2 border-gray-100 space-y-5` (left border forms the timeline line).
  - Each entry is `relative`:
    - **Timeline dot:** absolutely positioned, `-left-[21px]` (so it sits on the border line), `top-1.5`.  `10×10px` circle, primary blue background, `2px solid white` border.
    - **Card:** `rounded-xl border border-gray-100 bg-white p-4 shadow-sm`.
      - Top row: `flex items-start justify-between gap-2`.
        - Left: job title `font-semibold text-sm` dark navy; company `text-xs` secondary muted `mt-0.5`.
        - Right: date range `text-xs` muted `whitespace-nowrap`. Format: `startYear–Present` if `isCurrent`, else `startYear–endYear`.
      - Description (if set): `mt-2 text-xs` muted, `leading-relaxed`.

**Section: Credentials**
- Only rendered if `credentials` array is non-empty.
- Section label: badge/seal icon + "Credentials".
- `space-y-2` list:
  - Each row: `flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm`.
  - Left icon circle (`28×28px` circle):
    - If `isVerified`: light blue background (`bg-blue-50`), blue badge icon (`16×16px text-brand-blue`).
    - If not verified: gray background (`bg-gray-50`), gray badge icon (`16×16px text-gray-300`).
  - Center (`min-w-0 flex-1`):
    - Credential name: `text-sm font-medium` dark navy.
    - Issuing body + year: `text-xs` muted. Format: `issuingBody · year` (omit ` · ` if only one present).

**Empty state:** "No credentials added yet." centered muted text.

---

### 5c. Articles Tab

**Loading state:** 3 skeleton blocks, each `h-20 rounded-xl bg-gray-100 animate-pulse`, `space-y-3`.

**Empty state:**
- Centered vertically, `py-12`.
- Document SVG icon, `40×40px`, `text-gray-200`, `mx-auto mb-3`.
- "No published articles yet." `text-sm` muted.

**Populated state:**
- Header: "Articles by {displayName}" — `text-sm font-semibold` secondary, `mb-4`.
- `space-y-3` list of article link cards:
  - Each card: `flex gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm`.
  - Hover: border becomes blue-tinted, shadow increases (`hover:shadow-md`), smooth transition.
  - If `featuredImageUrl`: `<img>` thumbnail `80×64px`, `rounded-lg object-cover flex-shrink-0`.
  - Right content (`min-w-0 flex-1`):
    - Category name (if set): `text-xs font-semibold` primary blue, `uppercase tracking-wide`.
    - Title: `text-sm font-semibold` dark navy, `mt-0.5`, max 2 lines (`line-clamp-2`). On hover: title colour transitions to primary blue.
    - Meta row: `text-xs` muted, `mt-1`. Format: `MMM D, YYYY · X min read` (omit either part if not available).
  - The entire card is a `<Link>` to `/articles/{slug}`.

---

### 5d. Reviews & Recognition Tab (Coming Soon)

Full-content placeholder, centred, `py-16`:
- `56×56px` circle, `bg-gray-100`, star SVG icon inside `28×28px text-gray-300`.
- `mb-4` below icon.
- "Coming Soon" `text-sm font-semibold` dark navy, `mb-1`.
- "Reviews & Recognition will be available here shortly." `text-xs` muted.

---

### 5e. Contact Information Tab

`space-y-6`.

**Contact card grid:** `grid sm:grid-cols-2 gap-3`. Show only cards where data exists:

Each contact card: `flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3.5`. On hover: border → blue-tinted, background → very light blue, smooth transition.

Left icon block: `32×32px` `rounded-lg`, light blue background. Icon `16×16px` blue. On hover group: icon block background darkens slightly.

Right content:
- Label: `text-[10px] text-muted font-medium uppercase tracking-wide`.
- Value: `text-sm font-semibold` dark navy, `truncate`.

| Card | Icon | Label | Value | Behaviour |
|------|------|-------|-------|-----------|
| Email | envelope | EMAIL | `contactEmail` (fallback to `users.email`) | `<a href="mailto:...">` |
| Phone | phone | PHONE | `contactPhone` | `<a href="tel:...">` |
| LinkedIn | LinkedIn logo | LINKEDIN | "View Profile" | `<a target="_blank">` |
| Website | globe | WEBSITE | URL with protocol stripped | `<a target="_blank">` (prefers `website` over `firmWebsite`) |

**Empty state:** "No contact information available." centred muted text.

---

## 6. Right Sidebar (desktop only)

Sticky, `space-y-4` between cards.

### 6a. Consultation Fee + CTA Card

White card, `rounded-2xl`, thin border, shadow, `p-5`.

**If fee range is visible:**
- Label: "Consultation Fee" — `text-xs font-semibold` muted uppercase tracking, `mb-1`.
- Fee: `text-2xl font-bold` dark navy + `text-base font-semibold` for the upper bound + `text-sm text-muted font-normal` " / hr". Format: `$Min – $Max / hr`.
- `mb-4` below fee.

**If authenticated:**
- Availability indicator:
  - Available: green dot (`8×8px rounded-full bg-green-500`) + "Available for consultations" `text-xs text-green-600 font-medium`, `mb-3`.
  - Unavailable: "Currently unavailable" `text-xs` muted, `mb-3`.
- Availability notes (if set): `text-xs` muted, `mb-4 leading-relaxed`.
- Full-width primary button "Request Consultation". Disabled (50% opacity, not-allowed cursor) when `isAvailable === false`.

**If not authenticated:**
- "Sign in to send a consultation request to {displayName}." `text-xs` muted, `mb-4 leading-relaxed`.
- Full-width primary button "Sign in to Contact" → link to `/auth?returnTo=/members/{slug}`.

**Firm website link (if set):** Below the button, `mt-3 pt-3 border-t border-gray-50`. Small external link icon + "Company website" in `text-xs` primary blue, hover underline. Opens in new tab.

### 6b. Location Card

Only rendered if `location` is non-empty.
White card, `rounded-2xl`, thin border, shadow, `p-5`.
- Label: "Location" — `text-xs font-semibold` muted uppercase tracking, `mb-3`.
- Flex row `gap-2.5`:
  - Blue map pin icon, `16×16px`, `mt-0.5 flex-shrink-0`.
  - Location text: `text-sm font-medium` dark navy.

### 6c. Verified Badge Card

Only rendered if `isVerified`.
Dark navy background card, `rounded-2xl`, `p-5`. (No white background — uses the dark brand colour.)

- Header row `flex items-center gap-2.5 mb-2`:
  - Blue shield/badge SVG icon, `20×20px`.
  - "Expertly Verified" — `text-xs font-bold text-white uppercase tracking-wide`.
- Body: "{displayName}'s credentials, employment history, and identity have been verified by the [platform] team." `text-xs text-white/60 leading-relaxed`.

### 6d. Back Link

Plain text link: `← Back to Members` (left chevron icon + text). `text-sm` muted, hover → dark navy, smooth colour transition.

---

## 7. Consultation Request Modal

Triggered by "Request Consultation" button. Rendered above all other content (`z-50`).

### Overlay

- Covers full viewport (`fixed inset-0`), flex centered.
- Backdrop: semi-transparent black (`bg-black/50`) with backdrop blur.
- Click outside the modal panel → close modal.
- Press `Escape` key → close modal.
- Body scroll locked while open.

### Modal Panel

White card, `rounded-2xl`, heavy shadow, thin border, `w-full max-w-lg` (max 512px), `overflow-hidden`.

**Header** (`px-6 py-5 border-b border-gray-100`):
- Left: title "Request Consultation" `text-lg font-bold` dark navy; subtitle "with {displayName}" `text-xs` muted `mt-0.5`.
- Right: icon-only close button — `p-2 rounded-lg`, gray icon, hover → darker icon + gray background.

**Body** (`px-6 py-6`):

**Error banner** (if error): `rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700`.

**Subject field:**
- Label "Subject" `text-sm font-medium` dark text, `mb-1.5`.
- Text input, full width, standard input styles, `maxLength=200`.
- Placeholder: "e.g. Transfer pricing advice for Singapore entity".
- Required.

**Message field:**
- Label "Message" `text-sm font-medium` dark text, `mb-1.5`.
- Textarea, full width, 5 rows, no resize, `maxLength=2000`.
- Placeholder: "Briefly describe what you need help with…".
- Required.
- Character counter below right: `text-xs` muted, right-aligned. Format: `{count}/2000`.

**Submit row** (`flex items-center gap-3 pt-2`):
- "Send Request" primary button, `flex-1`. Disabled when `submitting || subject is empty || message is empty`. Shows "Sending…" while submitting.
- "Cancel" outline button, `flex-1`. Closes the modal.

### Success State (replaces form)

Centred, `py-6`:
- `56×56px` circle, `bg-green-50 border border-green-200`, large green checkmark SVG inside.
- `mb-4`.
- "Request Sent" `text-lg font-bold` dark navy, `mb-2`.
- "Your consultation request has been sent to {displayName}. They will respond to you directly." `text-sm` secondary text.
- Primary button "Close" `mt-6` → closes modal.

---

## Reusable UI Components

### GrayTag

Inline pill for qualifications and similar tags.

```
rounded-full bg-gray-100 border border-gray-200 px-3 py-1
text-xs font-medium muted-secondary-text-colour
```

### SectionLabel

Section heading within tab panels.

```
flex items-center gap-2
text-sm font-semibold muted-secondary-text-colour uppercase tracking-wider mb-4
```

Contains a small SVG icon (16×16px) on the left, then the section name text.

---

## Spacing & Layout Reference

| Element | Value |
|---------|-------|
| Page horizontal padding | `px-4` (mobile) → `px-6` (sm) → `px-8` (lg) |
| Page vertical padding | `py-8` |
| Max content width | `1280px` (`max-w-7xl`) |
| Gap between header card and two-column layout | `24px` (`mb-6`) |
| Gap between sidebar cards | `16px` (`space-y-4`) |
| Sidebar width | `256px` (`lg`) / `288px` (`xl`) |
| Gap between left and right columns | `24px` (`gap-6`) |
| Tab content padding | `24px` (`p-6`) |
| Sidebar card padding | `20px` (`p-5`) |
| Sidebar sticky top offset | `96px` (`top-24`) |

---

## Responsive Breakpoints

| Breakpoint | Width | Changes |
|------------|-------|---------|
| Base (mobile) | 0+ | Single column, avatar 112px, name `text-2xl`, mobile CTA shown |
| `sm` (640px+) | 640px+ | Education grids go 2-col, avatar row goes flex-row, avatar 144px |
| `lg` (1024px+) | 1024px+ | Two-column layout, sidebar appears, mobile CTA hidden, name `text-3xl` |
| `xl` (1280px+) | 1280px+ | Sidebar widens to 288px |

---

## Colour Tokens → Your Theme

Map these semantic colour names to your own theme:

| Token used in original | Meaning | Adapt to |
|------------------------|---------|----------|
| `brand-navy` / `#1e3a5f` | Primary dark — backgrounds, headings | Your dark primary |
| `brand-blue` / `#2563eb` | Interactive — links, active states, icons | Your interactive primary |
| `brand-blue-subtle` / light blue tint | Hover backgrounds, icon containers | Your interactive primary at ~8% opacity |
| `brand-text-secondary` | Secondary body text | Your secondary text |
| `brand-text-muted` | Tertiary / hint text | Your muted/hint text |
| `brand-text` | Primary body text | Your primary text |
| `gray-50` | Page background | Your page background |
| `gray-100` | Card borders, skeleton loaders | Your subtle border |
| `amber-50/700/200` | Seasoned professional tier badge | Warm accent |
| `green-500/600/50` | Availability indicator | Success green |

---

## Behaviour Notes

- **Articles are fetched client-side** on tab mount (not pre-loaded with the profile). Show the loading skeleton until data arrives.
- **All other tab content** comes from the initially loaded member object — no additional network requests.
- **Consultation modal resets** (clears subject, message, error, success state) whenever it is opened for a new member.
- **Body scroll is locked** while the consultation modal is open; restored on close.
- **Tabs do not change the URL** — they are pure client-side state with no routing.
- **"Back to Members"** link in the sidebar is only shown on desktop (sidebar is hidden on mobile; a back button is not shown on mobile separately).
- Profile page has **no visible back button on mobile** — users use browser back or nav.
 