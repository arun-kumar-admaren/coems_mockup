CLAIM – ADD OVERLAY (Core Fields Only)
🧩 1. System Field (Auto)

Claim Number

Type: Auto-generated (read-only)

Format: Prefix-based (UHL/UWL/etc.)

Visible after creation (or placeholder before save)

Mandatory (system generated)

🔷 2. Linking Information

Linked Incident

Type: Searchable dropdown

Mandatory: ✅ Yes (for incident-based claims)

Behavior:

Auto-fetch key data (date, vessel, ports)

OR Claim Type Context

Type: Radio / Dropdown

Values:

Incident Claim

Commercial Claim

Mandatory: ✅ Yes
(If Commercial → Incident field optional/hidden)

🔷 3. Basic Claim Info

Type of Claim

Type: Dropdown

Values: Cargo / Hull / Machinery / Commercial / Other

Mandatory: ✅ Yes

Type of Cover

Type: Dropdown

Source: Insurance module

Mandatory: ✅ Yes

Broker

Type: Dropdown / Search

Mandatory: ✅ Yes

Leading Insurer

Type: Dropdown / Text

Mandatory: Optional (can be filled later)

🔷 4. Key Dates

Date of Incident

Type: Date

Mandatory: ✅ Yes

Auto-filled if incident linked

Date of Notification to Broker

Type: Date

Mandatory: Optional (but important)

🔷 5. Financial Snapshot (High-Level Only)

Claim Estimate

Type: Numeric

Mandatory: Optional

(Detailed cost tracking will NOT be here — handled later)

🔷 6. Parties Involved

Claimant

Type: Text / Search

Mandatory: Optional

🔷 7. Description

Short Claim Description

Type: Text area (2–3 lines)

Mandatory: ✅ Yes

Purpose:

Quick understanding in list view

🔷 8. Status

Claim Status

Type: Dropdown

Default: Active

Values:

Active

Waiting

Settled

Mandatory: ✅ Yes

🔷 9. Insurance Link (Minimal)

Additional Insurance Required

Type: Yes / No

Mandatory: Optional
(Can auto-inherit from inquiry/fixture if available)

🔷 UX BEHAVIOR (IMPORTANT)
Auto-Population

When Incident is selected, auto-fill:

Date of incident

Ports (later in edit)

Cause (optional later)

Progressive Disclosure

Keep overlay minimal

After save → redirect to full claim detail page