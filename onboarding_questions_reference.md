# Expertly Onboarding — Complete Questions & Fields Reference

> **Purpose:** A detailed record of every question, field, input type, validation rule, and available options in the Expertly membership-application onboarding flow. Use this as a blueprint when implementing a similar flow in another application.

---

## Overview — Step Structure

The onboarding is a **4-step linear wizard** with a locked Review state after submission.

| Step | Label | Component | Description |
|------|-------|-----------|-------------|
| 0 | LinkedIn Gate | `OnboardingLayout` | One-time guard: user must connect/verify their LinkedIn identity before entering the wizard |
| 1 | Identity | `Step1Identity` | Personal details, contact info, location, LinkedIn URL, professional bio, profile photo |
| 2 | Experience | `Step2Experience` | Years of experience, work history (up to 5), education (up to 3) |
| 3 | Services | `Step3Services` | Service preferences (ranked top 3), consultation fee range |
| 4 | Review | `Step4Review` | Read-only summary of all prior steps + Declaration & Consent before final submission |

> **Navigation:** Users move forward with a "Next" button (with validation) and can navigate back to already-completed steps via the step indicator or the "Back" button.

---

## Pre-Step: LinkedIn Verification Gate

Before step 1 is shown, the system checks whether the authenticated user has linked a LinkedIn identity via OAuth (`linkedin_oidc`).

- **If NOT linked:** A full-screen gate is shown with a **"Connect LinkedIn"** button that triggers `supabase.auth.linkIdentity()`.
- **If linked:** The wizard proceeds normally.

This is not a "question" per se — it's an identity verification checkpoint.

---

## Step 1 — Identity

**Section title:** "Your Identity"  
**Advance button label:** "Next: Experience"

### 1.1 Profile Photo
| Property | Value |
|----------|-------|
| **Label** | Profile photo |
| **Type** | File upload (image) |
| **Required** | ✅ Yes |
| **Accepted formats** | JPEG, PNG |
| **Max size** | 5 MB |
| **Display hint** | "Displayed square." |
| **Behaviour** | Uploads via `POST /upload/avatar` → stores as base64. Shows live preview. Can also be auto-populated via LinkedIn import. |
| **Validation error** | "Profile photo is required" |

---

### 1.2 First Name
| Property | Value |
|----------|-------|
| **Label** | First name |
| **Type** | Text input |
| **Placeholder** | `Jane` |
| **Required** | ✅ Yes |
| **Max length** | None enforced in UI |
| **Validation error** | "First name is required" |
| **LinkedIn auto-fill** | ✅ Yes (`firstName`) |

---

### 1.3 Last Name
| Property | Value |
|----------|-------|
| **Label** | Last name |
| **Type** | Text input |
| **Placeholder** | `Smith` |
| **Required** | ✅ Yes |
| **Validation error** | "Last name is required" |
| **LinkedIn auto-fill** | ✅ Yes (`lastName`) |

---

### 1.4 WhatsApp / Phone
| Property | Value |
|----------|-------|
| **Label** | WhatsApp / Phone |
| **Type** | Composite — phone extension `<select>` + phone number `<input type="tel">` |
| **Required** | ❌ No |
| **Extension default** | `+1` |
| **Extension options** | Populated from `PHONE_CODES` utility (country dial codes, e.g. `+44`, `+91`, `+971`, etc.) |
| **Phone placeholder** | `7700 900 000` |

---

### 1.5 Contact Email
| Property | Value |
|----------|-------|
| **Label** | Contact email |
| **Type** | `<input type="email">` |
| **Placeholder** | `you@example.com` |
| **Required** | ✅ Yes |
| **Auto-populated** | ✅ Yes — pre-filled from the authenticated Supabase user's email (non-destructive) |
| **Validation** | Must be non-empty AND match basic email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) |
| **Validation errors** | "Email is required" / "Enter a valid email address" |

---

### 1.6 Region
| Property | Value |
|----------|-------|
| **Label** | Region |
| **Type** | `<select>` dropdown |
| **Required** | ✅ Yes |
| **Placeholder option** | "Select region" |
| **Options** | Populated from `REGIONS` utility constant. Regions include (based on store's country mapping): `asia_pacific`, `europe`, `latin_america`, `middle_east`, `north_america`, `south_asia`, `africa` |
| **Behaviour** | Selecting a region filters the Country dropdown to only countries in that region. Can also be auto-set when a country is selected. |
| **LinkedIn auto-fill** | ✅ Yes (derived from country) |
| **Validation error** | "Region is required" |

---

### 1.7 Country
| Property | Value |
|----------|-------|
| **Label** | Country |
| **Type** | `<select>` dropdown |
| **Required** | ✅ Yes |
| **Placeholder option** | "Select country" |
| **Options** | Filtered to countries within the selected region. If no region selected, shows all countries from `COUNTRY_NAMES`. Data sourced from `COUNTRIES_BY_REGION` / `COUNTRY_NAMES` utilities. |
| **Behaviour** | Selecting a country auto-populates available States and clears State/City. Also auto-sets Region if not already set. |
| **LinkedIn auto-fill** | ✅ Yes (`country`) — never overwritten once manually set |
| **Validation error** | "Country is required" |

---

### 1.8 State / Province
| Property | Value |
|----------|-------|
| **Label** | State / Province |
| **Type** | Dynamic — `<select>` if states are available for the chosen country (via `country-state-city` library), otherwise falls back to `<input type="text">` |
| **Required** | ❌ No |
| **Placeholder** | Dropdown: "Select state" / Text: `e.g. California` |
| **Behaviour** | Selecting a state populates available Cities for that state. |
| **LinkedIn auto-fill** | ✅ Yes (`state`) |

---

### 1.9 City
| Property | Value |
|----------|-------|
| **Label** | City |
| **Type** | Dynamic — `<select>` if cities are available for the chosen state, otherwise falls back to `<input type="text">` |
| **Required** | ❌ No |
| **Placeholder** | Dropdown: "Select city" / Text: `e.g. London` |
| **LinkedIn auto-fill** | ✅ Yes (`city`) |

---

### 1.10 LinkedIn URL
| Property | Value |
|----------|-------|
| **Label** | LinkedIn URL |
| **Type** | `<input type="url">` |
| **Placeholder** | `https://linkedin.com/in/yourprofile` |
| **Required** | ✅ Yes |
| **Validation** | Must match pattern: `^https?://(www\.)?linkedin\.com/in/.+` |
| **Validation errors** | "LinkedIn URL is required" / "Enter a valid LinkedIn profile URL (e.g. https://linkedin.com/in/yourname)" |
| **LinkedIn auto-fill** | ✅ Yes (`linkedinUrl`) |

---

### 1.11 Professional Bio
| Property | Value |
|----------|-------|
| **Label** | Professional bio |
| **Type** | `<textarea>` |
| **Placeholder** | "Describe your professional background, expertise, and what makes you uniquely qualified…" |
| **Required** | ✅ Yes |
| **Max length** | 500 characters (enforced with a character counter; counter turns amber at 460+) |
| **Rows** | 4 |
| **Validation error** | "Bio is required" |
| **LinkedIn auto-fill** | ✅ Yes (`bio`, capped at 500 chars) |

---

### Step 1 — LinkedIn Import Feature
A secondary "Import from LinkedIn" button in the step header opens a modal where the user can paste their LinkedIn profile URL. The system then calls a webhook to fetch profile data and auto-populates all eligible fields. Only empty fields are overwritten — manually entered data is never replaced.

---

## Step 2 — Experience

**Section title:** "Professional Background" + "Education & Qualification"  
**Advance button label:** "Next: Services"

### 2.1 Overall Years of Experience
| Property | Value |
|----------|-------|
| **Label** | Overall years of experience |
| **Type** | `<input type="number">` |
| **Placeholder** | `e.g. 12` |
| **Required** | ✅ Yes |
| **Min** | 0 |
| **Max** | 60 |
| **Behaviour** | Auto-calculated from LinkedIn-imported work experience if field is empty |
| **Validation error** | "Overall years of experience is required" |

---

### 2.2 Work Experience (Repeating Group)

**Constraints:** At least 1 entry required; maximum 5 entries.  
Each entry is a card with the following sub-fields:

| Sub-field | Label | Type | Required | Options / Notes |
|-----------|-------|------|----------|-----------------|
| Job Title | "Job title" | Text input | ❌ | Placeholder: `Partner` |
| Company | "Company" | Text input | ❌ | Placeholder: `Firm name` |
| Company Website | "Company website" | `<input type="url">` | ❌ | Placeholder: `https://example.com` (optional) |
| City | "City" | Text input | ❌ | Placeholder: `e.g. London` |
| Firm Size | "Firm size" | `<select>` | ❌ | Options: `Solo`, `2–10`, `11–50`, `51–200`, `200+` |
| Start Date | "Start date" | `MonthYearPicker` — two linked `<select>` (Month + Year) | ❌ | Month: Jan–Dec; Year: 1960–current year |
| End Date | "End date" | `MonthYearPicker` — two linked `<select>` (Month + Year) | ❌ | Disabled when "I currently work here" is checked |
| Current Employer | "I currently work here" | `<input type="checkbox">` | ❌ | When checked, disables End Date and sets `isCurrent: true` |

**Validation error:** "At least one work experience entry is required"

---

### 2.3 Education (Repeating Group)

**Constraints:** At least 1 entry required; maximum 3 entries.  
Each entry is a card with the following sub-fields:

| Sub-field | Label | Type | Required | Notes |
|-----------|-------|------|----------|-------|
| Institution | "Institution" | Text input | ❌ | Placeholder: `University name` |
| Degree | "Degree" | Text input | ❌ | Placeholder: `LLB, MBA…` |
| Field of Study | "Field of study" | Text input | ❌ | Placeholder: `e.g. Corporate Law` |
| Start Year | "Start year" | `<input type="number">` | ❌ | Placeholder: `2010` |
| End Year | "End year" | `<input type="number">` | ❌ | Placeholder: `2014` |

**Validation error:** "At least one education entry is required"

---

## Step 3 — Services

**Section titles:** "Services" + "Consultation Rates"  
**Advance button label:** "Next: Review"

### 3.1 Service Preferences (Ranked Top 3)

| Property | Value |
|----------|-------|
| **Label** | 1st Preference / 2nd Preference / 3rd Preference |
| **Type** | `<select>` dropdown for each preference rank |
| **Required** | 1st Preference only ✅ Yes; 2nd & 3rd ❌ optional |
| **Placeholder option** | "Select service…" |
| **Options source** | Fetched dynamically from `GET /taxonomy/services` — grouped by category via `<optgroup>` |
| **Category filter** | Pill buttons above the dropdowns let users filter by service category (fetched from `GET /taxonomy/categories`). Clicking a category pill filters all three dropdowns to only show services in that category. |
| **Deduplication** | A service already selected in one preference rank is excluded from the other two. |
| **Validation error** | "Please select your 1st preference service" |

---

### 3.2 Consultation Fee — Minimum (USD)
| Property | Value |
|----------|-------|
| **Label** | Min (USD) |
| **Type** | `<input type="number">` |
| **Placeholder** | `e.g. 500` |
| **Required** | ✅ Yes |
| **Min** | 0 |
| **Context** | "Your typical fee range per hour consultation (in USD)." |
| **Validation error** | "Minimum consultation rate is required" |

---

### 3.3 Consultation Fee — Maximum (USD)
| Property | Value |
|----------|-------|
| **Label** | Max (USD) |
| **Type** | `<input type="number">` |
| **Placeholder** | `e.g. 2000` |
| **Required** | ✅ Yes |
| **Min** | 0 |
| **Validation** | Must be greater than the minimum value |
| **Validation errors** | "Maximum consultation rate is required" / "Maximum must be greater than minimum" |

---

## Step 4 — Review & Declaration

This step is **read-only** — it displays a summary of all data entered in steps 1–3. No new data is collected except for the three consent checkboxes below.

### 4.1 Consent — Terms of Service
| Property | Value |
|----------|-------|
| **Label** | "I agree to the Terms of Service (v1.0)" |
| **Type** | `<input type="checkbox">` |
| **Required** | ✅ Yes |
| **Link** | Opens `/terms` in a new tab |
| **Validation error** | "You must agree to the Terms of Service" |

---

### 4.2 Consent — Privacy Policy
| Property | Value |
|----------|-------|
| **Label** | "I agree to the Privacy Policy (v1.0)" |
| **Type** | `<input type="checkbox">` |
| **Required** | ✅ Yes |
| **Link** | Opens `/privacy` in a new tab |
| **Validation error** | "You must agree to the Privacy Policy" |

---

### 4.3 Consent — Credential Verification
| Property | Value |
|----------|-------|
| **Label** | "I consent to Expertly verifying my professional credentials and background as part of the membership review process." |
| **Type** | `<input type="checkbox">` |
| **Required** | ✅ Yes |
| **Validation error** | "You must consent to credential verification" |

---

## Data Model Summary (Zustand Store)

The full form state is stored in `onboardingStore.ts` and persisted to `sessionStorage`.

```typescript
// Step 1 fields
firstName, lastName, profilePhotoUrl, profilePhotoBase64, designation,
headline, bio, linkedinUrl, region, country, state, city,
phoneExtension, phone, contactEmail

// Step 2 fields
yearsOfExperience, firmName, firmSize, firmWebsiteUrl,
consultationFeeMinUsd, consultationFeeMaxUsd,
qualifications[], credentials[], workExperience[], education[]

// Step 3 fields
primaryServiceId, secondaryServiceIds[],
keyEngagements[], engagements[],
availability: { days[], startHour, endHour, timezone, notes }
```

> **Note:** `headline`, `designation`, `firmName`, `firmSize`, `firmWebsiteUrl`, `credentials[]`, `keyEngagements[]`, `engagements[]`, and `availability` fields exist in the data model and are referenced in the Review step, but are **not currently exposed as UI fields** in the wizard steps. They are populated via LinkedIn import or left empty.

---

## Fields in the Data Model NOT Yet Exposed in the UI

These fields exist in the store (`onboardingStore.ts`) and are sent to the backend on submission, but have **no corresponding input field** in the current wizard:

| Field | Type | Where used |
|-------|------|------------|
| `headline` | string | Auto-filled via LinkedIn import; shown in Review |
| `designation` | string | Auto-filled via LinkedIn import; shown in Review |
| `credentials[]` | `CredentialEntry[]` | Shown in Review; not editable via UI |
| `keyEngagements[]` | `string[]` | Shown in Review; not editable via UI |
| `engagements[]` | `EngagementEntry[]` | Passed to API; not visible anywhere in wizard |
| `availability.days` | `string[]` | Shown in Review; not collected via UI |
| `availability.timezone` | string | Shown in Review; not collected via UI |
| `availability.startHour` | number (default: 9) | Shown in Review; hardcoded default |
| `availability.endHour` | number (default: 17) | Shown in Review; hardcoded default |
| `availability.notes` | string | Passed to API; never shown |

---