# Story 1-1: Legal Review Hub — Listing View

**Status:** ready-for-dev  
**Epic:** 1 — Legal Review Hub  
**Story:** 1  
**Created:** 2026-05-20  
**Project:** COEMS

---

## User Story

**As a** Legal team member or Commercial user,  
**I want** to see all legal review records in a single, filterable table with status-coded badges,  
**so that** I can quickly triage pending reviews and understand the overall review landscape without navigating into individual Inquiry or Fixture records.

---

## Scope

This story covers **only the listing view** of `src/app/components/legal.tsx`:

- Listing table (columns, data rendering, status/type badges)
- Status filter tabs (All / To be reviewed by Legal / Under Review / Reviewed / Not Required)
- Search input (real-time, multi-field)
- Header bar (search, Add Filter button, status tabs, Add Review button, overflow menu)
- Footer bar (found count, items-per-page selector, pagination controls)
- Empty state (no records)
- Filtered-empty state (records exist but none match current filter)
- Floating chat button (static UI only)
- localStorage read on mount (restores existing reviews)

**Out of scope for this story:**
- Create/Edit Review Sheet (Story 1-2)
- Task management within reviews (Story 1-3)
- Task detail overlay (Story 1-3)
- Functional pagination (deferred — OQ-1)
- Functional "Add Filter" advanced filter panel (deferred — OQ-2)
- Floating chat button functionality (placeholder UI only)

---

## Acceptance Criteria

### AC-1: Sidebar Navigation Entry

**Given** the COEMS application is loaded  
**When** the user looks at the Operations section of the sidebar  
**Then** "Legal Review" entry is present with the `Scale` icon from lucide-react  
**And** clicking it renders the Legal Hub as the main content  
**And** the entry highlights with `bg-blue-600/20` and a left `bg-blue-500` border when active

### AC-2: Header Layout

**Given** the Legal Review Hub is active  
**When** the listing view renders  
**Then** the sticky header (`bg-[#f8f9fa]`, `border-b`) contains left-to-right:
  1. Search input (plain underline style, `w-64`, placeholder "Search")
  2. "Add Filter" button (yellow `bg-[#fde047]`, `Plus` icon, label "Add Filter")
  3. Status filter tab group (white bordered pill, see AC-4)
  4. (right side) "Add Review" button (yellow, `Plus` icon)
  5. (right side) `MoreVertical` icon button

### AC-3: Table Columns

**Given** at least one review exists  
**When** the table renders  
**Then** the following columns appear in this exact order with uppercase tracking headers:

| Column | Header Label | Content |
|--------|-------------|---------|
| 1 | ID | `row.seqId` (zero-padded sequence, e.g. `0001`) |
| 2 | REVIEW NUMBER | `row.reviewNumber` (e.g. `REV-2026-0001`), font-medium |
| 3 | REVIEW TYPE | Colored badge (see AC-5) |
| 4 | DESCRIPTION | `row.description`, truncated with `max-w-xs`, italic `—` when empty |
| 5 | LEGAL REVIEW STATUS | Colored badge (see AC-6) |
| 6 | E FILING NUMBER | Plain text, `—` when empty |
| 7 | DUE DATE | Plain text, `—` when empty |
| 8 | REVIEW RAISED BY | Plain text, `—` when empty |
| 9 | TO BE REVIEWED BY | Plain text, `—` when empty |
| 10 | CREATED DATE | `row.createdAt` (ISO date string `YYYY-MM-DD`) |

**And** each row has `hover:bg-gray-50/50` and `cursor-pointer`  
**And** clicking any row opens the Edit Sheet (AC is met when the click handler fires — Edit Sheet is Story 1-2)

### AC-4: Status Filter Tabs

**Given** the hub is rendered  
**When** the status filter group renders  
**Then** it displays exactly 5 tabs in this order: `All`, `To be reviewed by Legal`, `Under Review`, `Reviewed`, `Not Required`  
**And** the active tab has `bg-gray-100 text-gray-900`; inactive tabs have `text-gray-600 hover:bg-gray-50`  
**And** `All` is the default active tab on first render  
**When** the user clicks a status tab  
**Then** the table immediately filters to show only rows matching that `legalReviewStatus`  
**And** clicking `All` removes the filter and shows all records

### AC-5: Review Type Badges

**Given** a review row is rendered  
**When** the Review Type cell is displayed  
**Then** the badge applies the following class mapping:

| Value | Classes |
|-------|---------|
| `Documents` | `bg-blue-100 text-blue-700` |
| `NDA` | `bg-purple-100 text-purple-700` |
| Any other value | `bg-gray-100 text-gray-700` (fallback) |

**And** the badge uses `px-2 py-0.5 rounded text-xs font-medium`

### AC-6: Legal Review Status Badges

**Given** a review row is rendered  
**When** the Legal Review Status cell is displayed  
**Then** the badge applies the following class mapping:

| Value | Classes |
|-------|---------|
| `Reviewed` | `bg-green-100 text-green-700` |
| `Under Review` | `bg-yellow-100 text-yellow-700` |
| `Not Required` | `bg-gray-100 text-gray-700` |
| `To be reviewed by Legal` | `bg-red-100 text-red-700` |
| Any other value | `bg-gray-100 text-gray-700` (fallback) |

**And** the badge uses `px-2 py-1 rounded text-xs font-medium`

### AC-7: Real-Time Search

**Given** the search input is focused  
**When** the user types any text  
**Then** the table filters in real time (no submit required) to show only rows where at least one of the following fields contains the search string (case-insensitive):
  - `reviewNumber`
  - `reviewType`
  - `description`
  - `legalReviewStatus`  

**And** the status filter and search filter are AND-combined (both apply simultaneously)  
**And** clearing the search input restores all status-filtered rows

### AC-8: Empty State (No Records)

**Given** no review records exist in the system  
**When** the listing renders  
**Then** the table area is replaced by a centered empty state containing:
  - `FileText` icon from lucide-react, `size-12 opacity-30`
  - Text: "No reviews yet" (`text-sm font-medium`)
  - Text: `Click "Add Review" to create the first one.` (`text-xs`)

### AC-9: Filtered Empty State (Records Exist but None Match)

**Given** reviews exist but none match the current status filter or search query  
**When** the filtered result set is empty  
**Then** the table body shows a single full-width row:
  - `colSpan={10}` 
  - Text: "No reviews match the current filter." (`py-12 text-center text-gray-400 text-sm`)

### AC-10: Footer

**Given** the listing is rendered  
**When** the footer renders (sticky bottom, `border-t`)  
**Then** it shows:
  - Left side: "Found N record(s)" — `N` reflects the **filtered** count (singular "record" when N=1, plural "records" otherwise)
  - Right side: "Items per page:" label with a `<select>` offering 25 / 50 / 100
  - Right side: "X – Y of Z" range display (currently shows `1 – N of N` where N = filtered count)
  - Right side: Previous (`ChevronLeft`) and Next (`ChevronRight`) pagination buttons — **both disabled** in this story (functional pagination is deferred)

### AC-11: localStorage Persistence (Read)

**Given** the user has previously created reviews in this session or a prior session  
**When** the Legal Hub component mounts  
**Then** it reads `localStorage.getItem("legal-reviews")` and initializes state from the parsed JSON  
**And** it reads `localStorage.getItem("legal-reviews-count")` and initializes the sequential counter  
**And** if either key is missing or the JSON is malformed, it silently initializes with `[]` and `1` respectively (no error thrown to the user)

### AC-12: Floating Chat Button

**Given** the Legal Hub is rendered  
**When** the user views the page  
**Then** a `MessageSquare` icon button is visible at `bottom-16 right-6`, styled `bg-slate-500 hover:bg-slate-600`, with the icon filled  
**And** clicking it has no action in this story (placeholder UI)

---

## Technical Requirements & Developer Notes

### File to Modify

**Primary:** `src/app/components/legal.tsx`

This file already exists and contains a complete implementation of the listing view. This story documents what must be **preserved and verified** — not rewritten. The existing code is the reference implementation.

### Current Implementation State

The listing view is **already implemented** in `legal.tsx`. The purpose of this story is to:
1. Formally validate the implementation against the acceptance criteria
2. Ensure the sidebar entry (`src/app/components/sidebar.tsx`) correctly routes to the `Legal` component
3. Ensure localStorage read/write is correctly wired on mount

### Key Data Structures

```typescript
// From legal.tsx — Review record shape
interface Review {
  id: string;           // internal UUID-like key, e.g. "rev-1"
  seqId: string;        // zero-padded sequence, e.g. "0001"
  reviewNumber: string; // display format, e.g. "REV-2026-0001"
  relatedTo: string[];  // ["Inquiry", "Fixture"] etc.
  items: string[];      // linked record IDs
  reviewType: string;   // "Documents" | "NDA"
  description: string;
  legalReviewStatus: string; // one of REVIEW_STATUSES
  eFilingNumber: string;
  dueDate: string;
  reviewRaisedBy: string;
  toBeReviewedBy: string;
  createdAt: string;    // ISO date "YYYY-MM-DD"
  tasks: Task[];        // imported from legal-review-tab.tsx
}
```

### Constants in legal.tsx (do not change)

```typescript
const REVIEW_STATUSES = [
  "To be reviewed by Legal",
  "Under Review",
  "Reviewed",
  "Not Required",
];

const STATUS_STYLES: Record<string, string> = {
  "Reviewed": "bg-green-100 text-green-700",
  "Under Review": "bg-yellow-100 text-yellow-700",
  "Not Required": "bg-gray-100 text-gray-700",
  "To be reviewed by Legal": "bg-red-100 text-red-700",
};

const TYPE_STYLES: Record<string, string> = {
  "Documents": "bg-blue-100 text-blue-700",
  "NDA": "bg-purple-100 text-purple-700",
};
```

### Filtering Logic (preserve exactly)

```typescript
const filtered = reviews.filter((r) => {
  const matchesStatus =
    activeStatusFilter === "All" || r.legalReviewStatus === activeStatusFilter;
  const q = searchQuery.toLowerCase();
  const matchesSearch =
    !q ||
    r.reviewNumber.toLowerCase().includes(q) ||
    r.reviewType.toLowerCase().includes(q) ||
    r.description.toLowerCase().includes(q) ||
    r.legalReviewStatus.toLowerCase().includes(q);
  return matchesStatus && matchesSearch;
});
```

### localStorage Keys (do not change key names)

| Key | Type | Purpose |
|-----|------|---------|
| `"legal-reviews"` | JSON array of `Review[]` | Persisted review records |
| `"legal-reviews-count"` | string (integer) | Next sequence counter |

### Sidebar Entry (src/app/components/sidebar.tsx)

The sidebar entry already exists in `operationsItems`:
```typescript
{ id: "legal" as NavigationItem, label: "Legal Review", icon: Scale }
```
And `App.tsx` already routes `case "legal": return <Legal />;`

No changes needed to sidebar or App.tsx for this story.

### Import Dependency

`legal.tsx` imports the `Task` type from `legal-review-tab.tsx`:
```typescript
import { type Task } from "./legal-review-tab";
```
This import must remain. Do not restructure the Task type out of `legal-review-tab.tsx` in this story.

### Styling Conventions

- Font size on list table: `text-sm`
- Header row: `text-xs font-semibold text-gray-500`, `uppercase tracking-wider`, `border-b border-gray-200`
- Data rows: `divide-y divide-gray-100`, `hover:bg-gray-50/50`
- Padding per cell: `py-3 px-6`
- The header and footer are `sticky` (top and bottom respectively) using `z-10`

### What NOT to Change in This Story

- The Sheet component and its contents (Story 1-2)
- The task modal (Story 1-3)
- The task detail overlay (Story 1-3)
- The `ITEMS_BY_CATEGORY`, `USERS`, `INITIAL_TASK`, `EMPTY_FORM` constants (used by create/edit, not listing)
- The `handleCreate`, `handleSave`, `openCreate`, `openEdit` functions
- Any task-related state or handlers

---

## Testing Notes

### Manual Verification Checklist

- [ ] Navigate to Legal Review from sidebar — hub renders
- [ ] With no records: empty state shows FileText icon, correct messages
- [ ] Create a review via "Add Review" (Story 1-2 dependency, or inject via localStorage manually)
- [ ] Record appears in table with all 10 columns populated
- [ ] "Documents" badge renders blue; "NDA" badge renders purple
- [ ] "To be reviewed by Legal" badge renders red; "Under Review" yellow; "Reviewed" green; "Not Required" gray
- [ ] Clicking "To be reviewed by Legal" tab filters to only red-badge rows
- [ ] Clicking "All" restores full list
- [ ] Typing in search filters rows in real time; clearing search restores rows
- [ ] Search + status filter AND correctly (both apply at once)
- [ ] When filter matches nothing: "No reviews match the current filter." row appears
- [ ] Footer shows correct "Found N record(s)" (singular vs plural)
- [ ] Pagination buttons are present and disabled
- [ ] Refresh page — reviews persist from localStorage
- [ ] Floating chat button visible; clicking does nothing

### Automated Test Scope (if applicable)

- Unit test: `filtered` array logic with mock review data (status filter, search, combined)
- Unit test: badge class resolution for all STATUS_STYLES and TYPE_STYLES keys + fallback
- Unit test: localStorage init — valid JSON, invalid JSON (silent fallback), missing key

---

## Open Questions (from PRD)

| ID | Question | Impact on This Story |
|----|----------|---------------------|
| OQ-1 | API migration from localStorage | None for this story — listing reads from local state regardless of data source |
| OQ-2 | "Add Filter" functionality scope | None — button is placeholder in this story |
| OQ-4 | User directory source | None — listing only displays values, does not populate dropdowns |

---

## Definition of Done

- [ ] All 12 acceptance criteria verified manually
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] No regressions in other sidebar navigation items
- [ ] `legal-review-tab.tsx` import still resolves correctly
- [ ] localStorage read/write verified in browser DevTools
