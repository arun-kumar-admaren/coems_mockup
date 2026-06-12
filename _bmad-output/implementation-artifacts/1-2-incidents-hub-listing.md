# Story 1-2: Incidents Module — Listing Page

**Status:** ready-for-dev  
**Epic:** 1 — Incidents Module  
**Story:** 2  
**Created:** 2026-05-20  
**Project:** COEMS

---

## User Story

**As a** user,  
**I want** to view the list of incidents when I access the Incidents module from the sidebar  
**So that** I can easily see and manage all incidents created in the system.

---

## Scope

This story covers the **Incidents Listing page** of `src/app/components/hseq.tsx`:

- Sidebar navigation entry (accessible from both Management and Chartering sections)
- Listing table: all column titles, column widths, horizontal scrolling, and conditional cell rendering
- Default empty state (no data until incidents are created)
- Header bar: Search bar, Filter, Import Near Miss button, Export Template button, List/Trash group button, Archived toggle, Create Incident button, Kebab menu (UI structure only), Column Show/Hide & Reorder icon
- Footer: record count, sort behaviour (newest first by published date/time)
- Column wider (resize) functionality
- Horizontal scrolling for the full column set

**Out of scope for this story:**
- Search functionality (covered in another story)
- Add Filter functionality (covered in another story)
- Import Near Miss functionality (covered in another story)
- Create Incident functionality (covered in another story)
- Kebab menu actions: Delete, Archive, Unarchive, Document Manager (covered in another story)
- Column Show/Hide & Reorder functionality (covered in another story)
- Trash tab view (covered in another story)
- Archived toggle functionality (covered in another story)

---

## Acceptance Criteria

### AC-1: Sidebar Navigation Entry

**Given** the COEMS application is loaded  
**When** the user views the sidebar  
**Then** "Incidents" (or "HSEQ") navigation entry is present and accessible from **both** the Management module section and the Chartering module section of the sidebar  
**And** clicking the entry renders the Incidents Listing page as the main content  
**And** the entry highlights with the active state style (`bg-blue-600/20`, left `bg-blue-500` border) when selected

### AC-2: Default Empty State

**Given** the Incidents module is accessed for the first time with no incidents in the system  
**When** the listing page renders  
**Then** the table body area is empty — no rows are displayed  
**And** an empty state indicator is shown (icon + message) prompting the user to create the first incident  
**And** all header elements (search, filter, buttons) are still present and visible even when no data exists

### AC-3: Header Layout and Element Order

**Given** the Incidents Listing page is active  
**When** the header bar renders  
**Then** the following elements appear in this exact left-to-right order:

| Position | Element | Type | Default State |
|----------|---------|------|---------------|
| 1 (left) | Search bar | Input field | Empty, placeholder "Search" |
| 2 | Filter | Button/trigger | Inactive |
| 3 | Import Near Miss | Button | Visible, right-aligned group |
| 4 | Export Template | Button with export/download icon | Visible |
| 5 | List / Trash | Group button (toggle) | "List" tab active by default |
| 6 | Archived | Toggle switch | **Off** by default |
| 7 | Create Incident | Button | Visible |
| 8 (far right) | Kebab menu | Three-dot (`MoreVertical`) icon button | Visible |

**And** the header is sticky — it remains fixed at the top when the user scrolls the table vertically

### AC-4: Kebab Menu Items (UI Structure Only)

**Given** the user clicks the Kebab (three-dot) menu  
**When** the dropdown opens  
**Then** it displays exactly the following items in this order:
1. Delete Selected Incident
2. Archive Selected Incident
3. Unarchive Selected Incidents
4. Document Manager

**And** the menu items are rendered but their click actions are **not functional** in this story (functionality is in a separate story)

### AC-5: Column Show/Hide & Reorder Icon

**Given** the listing page table is visible  
**When** the user looks at the right corner of the column title row  
**Then** a Show/Hide icon button is visible  
**And** clicking it has no action in this story (functionality is in a separate story)

### AC-6: Table Column Titles

**Given** at least one incident exists  
**When** the table renders  
**Then** the following columns appear in this exact order, each with a sortable/visible column header:

| # | Column Title | Notes |
|---|-------------|-------|
| 1 | ID | System-generated row number |
| 2 | Incident No | Auto-generated `INC-[YEAR]-[NNNN]` format |
| 3 | Related | Value set during incident creation |
| 4 | Vessel | Vessel name from incident creation |
| 5 | Voyage | Voyage number from incident creation |
| 6 | Location | Location value from incident creation |
| 7 | Port Call | Conditional — see AC-8 |
| 8 | Latitude | Conditional — see AC-9 |
| 9 | Longitude | Conditional — see AC-9 |
| 10 | Related Fixtures | Fixture numbers linked during creation |
| 11 | Date of Incident | Date + Time of incident from creation |
| 12 | Incident Category | Category value (Accident, Near-Miss, etc.) |
| 13 | Incident Class | Conditional — see AC-10 |
| 14 | Incident Type | Dependent on Incident Category — see AC-11 |
| 15 | Event Severity Classification | Conditional — see AC-12 |
| 16 | Initial Severity | Mandatory field from incident creation |
| 17 | Status | Status from creation or edit overlay |

### AC-7: Horizontal Scrolling

**Given** the full column set (17 columns) exceeds the available screen width  
**When** the table renders  
**Then** horizontal scrolling is available on the table container, allowing the user to navigate to all columns  
**And** the first few columns (at minimum ID and Incident No) are **sticky** (pinned to the left) so the user retains row context while scrolling horizontally  
**And** vertical scrolling is available independently of horizontal scrolling

### AC-8: Port Call Column — Conditional Display

**Given** an incident row is rendered  
**When** the Location field value is either **"Port"** or **"Anchorage"**  
**Then** the Port Call column displays the associated port name value  
**When** the Location field value is anything other than "Port" or "Anchorage"  
**Then** the Port Call column displays `—` (em dash, not blank)

### AC-9: Latitude and Longitude Columns — Conditional Display

**Given** an incident row is rendered  
**When** the Location field value is **"At Sea"**  
**Then** the Latitude column displays the latitude value entered during creation  
**And** the Longitude column displays the longitude value entered during creation  
**When** the Location field value is not "At Sea"  
**Then** both Latitude and Longitude columns display `—`

### AC-10: Incident Class Column — Conditional Display

**Given** an incident row is rendered  
**When** the Incident Category is **"Accident"**  
**Then** the Incident Class column displays the class value (e.g., Personnel Accident, Cargo Damage and/or Loss, etc.)  
**When** the Incident Category is **not** "Accident" (i.e., Near-Miss, Non-Conformity, Innocent Incident)  
**Then** the Incident Class column displays `—`

> **Developer note:** The existing `Incident` type uses `class` as the field name (maps to Level 2). The column header label in the UI is "Incident Class" only when category is "Accident"; the field exists for all categories but is only displayed meaningfully for Accident.

### AC-11: Incident Type Column — Conditional Display

**Given** an incident row is rendered  
**When** the Incident Category is **"Accident"** AND Incident Class is "Personnel Accident", "Vessel Damage and/or Loss", "Cargo Damage and/or Loss", "Environmental Accident", or "Security Accident"  
**Then** the Incident Type column displays the type value from `INCIDENT_LEVEL_3_TYPES`  
**When** the Incident Category does not support a Level 3 type (Near-Miss, Non-Conformity, Innocent Incident)  
**Then** the Incident Type column displays `—`

### AC-12: Event Severity Classification Column — Conditional Display

**Given** an incident row is rendered  
**When** the Incident Class is **"Personnel Accident"** (only available under Accident category)  
**Then** the Event Severity Classification column displays the event severity value (e.g., Fatality (FAT), Medical Treatment Case, etc.)  
**When** the Incident Class is anything other than "Personnel Accident"  
**Then** the Event Severity Classification column displays `—`

### AC-13: Incident Number Format

**Given** an incident record is displayed in the table  
**When** the Incident No column renders  
**Then** the value follows the format: `INC-[Current Year]-[Sequential Number]`  
**And** the sequential number is zero-padded to 4 digits minimum (e.g., `INC-2026-0001`)

### AC-14: Default Sort Order

**Given** multiple incidents exist in the system  
**When** the listing page renders without any user-applied sort  
**Then** incidents are displayed in descending order by their **published date and time** (newest first)  
**And** if two incidents share the same published timestamp, secondary sort is by ID descending

### AC-15: Column Width Resizer

**Given** the listing table is visible  
**When** the user hovers over a column header divider  
**Then** a resize cursor is shown  
**And** the user can click-drag the divider to widen or narrow that column  
**And** the column width change persists for the duration of the session (resets on page refresh is acceptable)  
**And** resizing one column does not forcibly resize adjacent columns (table uses fixed column widths, not fluid layout)

### AC-16: Record Count in Footer

**Given** the listing page is rendered  
**When** the footer area renders  
**Then** it displays the total number of visible incident records (e.g., "Found 4 records")  
**And** the count updates in real time when search or filter reduces the visible set

---

## Technical Requirements & Developer Notes

### Primary File

**`src/app/components/hseq.tsx`** — existing component. Read this file before making any changes.

### Existing Data Model (`src/app/components/hseq-types.ts`)

The `Incident` interface already exists and must not be modified in this story:

```typescript
interface Incident {
  id: string;
  incidentNumber: string;       // "INC-2026-0001"
  vessel: string;
  voyage: string;
  fixtures: string[];
  date: string;                 // ISO date
  portCall?: string;            // only relevant when location is Port/Anchorage
  incidentCategory: string;     // "Accident" | "Near-Miss" | "Non-Conformity" | "Innocent Incident"
  location: string;             // "Port" | "Anchorage" | "At Sea" | others
  latitude?: string;            // only relevant when location is "At Sea"
  longitude?: string;           // only relevant when location is "At Sea"
  class: string;                // Level 2 — only displayed for "Accident" category
  type: string;                 // Level 3 — only displayed for relevant Accident classes
  eventSeverity?: string;       // Level 4 — only displayed for "Personnel Accident"
  shortDesc: string;
  severity: "Low" | "Medium" | "High" | "Critical";  // maps to "Initial Severity" column
  status: "Open" | "Closed" | "Pending" | "Cancelled";
  // ... other fields not used in listing
}
```

### Incident Category Hierarchy (for conditional column rendering)

```typescript
// From hseq.tsx constants — do NOT redefine these
const HIERARCHY = {
  "Accident": { label: "Incident Class", options: [...], hasLevel3: true },
  "Near-Miss": { label: "Near-Miss Type", options: [...], hasLevel3: false },
  "Non-Conformity": { label: "Non-Conformity Type", options: [...], hasLevel3: false },
  "Innocent Incident": { label: "Innocent Incident Type", options: [...], hasLevel3: false }
};

const INCIDENT_LEVEL_3_TYPES: Record<string, string[]> = {
  "Personnel Accident": [...],
  "Vessel Damage and/or Loss": [...],
  "Cargo Damage and/or Loss": [...],
  "Environmental Accident": [...],
  "Security Accident": [...]
};

const EVENT_SEVERITY_OPTIONS = [
  "Fatality (FAT)",
  "Permanent Total Disability",
  "Permanent Partial Disability",
  "Lost/Restricted Work Case",
  "Medical Treatment Case",
  "First Aid Case"
];
```

### Conditional Cell Rendering Logic

Apply these rules per row in the table:

```typescript
// Port Call cell
const portCallDisplay = (inc: Incident) =>
  (inc.location === "Port" || inc.location === "Anchorage")
    ? (inc.portCall || "—")
    : "—";

// Latitude / Longitude cells
const latDisplay = (inc: Incident) => inc.location === "At Sea" ? (inc.latitude || "—") : "—";
const lonDisplay = (inc: Incident) => inc.location === "At Sea" ? (inc.longitude || "—") : "—";

// Incident Class cell
const classDisplay = (inc: Incident) =>
  inc.incidentCategory === "Accident" ? (inc.class || "—") : "—";

// Incident Type cell
const typeDisplay = (inc: Incident) =>
  (inc.incidentCategory === "Accident" && inc.class && INCIDENT_LEVEL_3_TYPES[inc.class])
    ? (inc.type || "—")
    : "—";

// Event Severity Classification cell
const eventSeverityDisplay = (inc: Incident) =>
  inc.class === "Personnel Accident" ? (inc.eventSeverity || "—") : "—";
```

### Incident Number Format

```typescript
const generateIncidentNumber = (year: number, seq: number): string =>
  `INC-${year}-${String(seq).padStart(4, "0")}`;
// e.g. INC-2026-0001
```

### Column Width Resizer

Use a simple mouse-drag approach per column header. Store widths in a `Record<string, number>` state (`columnWidths`). Apply inline `style={{ width: columnWidths[col] }}` per `<th>` and `<td>`. Minimum column width: 80px.

Example pattern (do not import a third-party library for this):
```typescript
const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
  id: 60, incidentNo: 140, related: 100, vessel: 130, /* ... */
});

const handleResize = (col: string, delta: number) => {
  setColumnWidths(prev => ({
    ...prev,
    [col]: Math.max(80, (prev[col] ?? 100) + delta)
  }));
};
```

### Horizontal Scroll & Sticky Columns

Wrap the table in a `div` with `overflow-x: auto`. Apply `position: sticky; left: 0; z-index: 1; background: white` to the ID and Incident No `<th>` and `<td>` cells to keep them pinned while the rest of the row scrolls.

### Default Sort (Newest First)

Sort the incidents array before rendering by `date` descending:
```typescript
const sortedIncidents = useMemo(() =>
  [...filteredIncidents].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ),
  [filteredIncidents]
);
```

### Header UI Components

| Element | Recommended Component | Icon |
|---------|----------------------|------|
| Search bar | `<Input>` with `Search` icon | `Search` from lucide-react |
| Filter | `<Button variant="outline">` with `SlidersHorizontal` icon | `SlidersHorizontal` |
| Import Near Miss | `<Button>` with `Upload` icon | `Upload` |
| Export Template | `<Button variant="outline">` with `FileDown` or `Download` icon | `FileDown` |
| List/Trash group | `<ToggleGroup>` with two `<ToggleGroupItem>` values | `Menu` (List), `Trash2` (Trash) |
| Archived toggle | `<Switch>` with a `<Label>` | — |
| Create Incident | `<Button>` with `Plus` icon | `Plus` |
| Kebab menu | `<DropdownMenu>` with `MoreVertical` trigger | `MoreVertical` |

All icons already imported in `hseq.tsx`: `Search`, `SlidersHorizontal`, `Upload`, `Download`, `FileDown`, `ToggleGroup`, `ToggleGroupItem`, `Switch`, `Plus`, `MoreVertical`, `Trash2`.

### Existing State to Preserve

The following state already exists in `hseq.tsx` — do not remove or rename:

```typescript
const [searchQuery, setSearchQuery] = useState("");
const [viewFilter, setViewFilter] = useState("mine");
const [filters, setFilters] = useState({ /* column filters */ });
const filteredIncidents = useMemo(() => { /* filtering logic */ }, [...]);
```

### What NOT to Change in This Story

- The `Incident` data type in `hseq-types.ts`
- The HSEQ constants (HIERARCHY, INCIDENT_LEVEL_3_TYPES, EVENT_SEVERITY_OPTIONS, etc.)
- The Create/Edit Sheet and its form state
- The MSCAT (cause/control action) logic
- Export dialog state
- Any other modules (claims-insurance, voyage, fixtures, etc.)

---

## Testing Notes

### Manual Verification Checklist

- [ ] "Incidents" / "HSEQ" entry appears in sidebar — clicking it loads the listing page
- [ ] With no incidents: empty state shows correct message and icon; header is still visible
- [ ] With sample data (use `INITIAL_DATA` from `hseq-types.ts`): all 4 seed records appear in the table
- [ ] All 17 column headers are present and in correct order
- [ ] Horizontal scroll is available; ID and Incident No columns stay pinned while scrolling right
- [ ] Column width resize: drag header divider changes column width; other columns unaffected
- [ ] `INC-2024-001` (Accident / Personnel Accident): Incident Class = "Personnel Accident", Incident Type = "Slip/Trip", Event Severity = "Medical Treatment Case"
- [ ] `INC-2024-002` (Near-Miss): Incident Class = "—", Incident Type = "—", Event Severity = "—"
- [ ] `INC-2024-003` (Accident / Cargo Damage): Port Call = "Singapore", Lat = "—", Lon = "—", Event Severity = "—"
- [ ] Any "At Sea" incident: Port Call = "—", Lat and Lon display values
- [ ] Any non-Port/Anchorage, non-At-Sea incident: Port Call = "—", Lat = "—", Lon = "—"
- [ ] Incidents sorted newest-date first by default
- [ ] Footer shows correct record count
- [ ] Header: List/Trash group defaults to "List" tab active
- [ ] Header: Archived toggle is OFF by default
- [ ] Kebab menu opens with 4 items visible; clicking any item does nothing (deferred)
- [ ] Column Show/Hide icon is visible in column header row; clicking does nothing (deferred)
- [ ] No TypeScript errors (`npm run build` passes)

### Test Data Reference

The 4 seed incidents in `INITIAL_DATA` (`hseq-types.ts`) cover:

| ID | Category | Location | Class | Expected Port Call | Expected Lat/Lon | Expected Event Sev |
|----|---------|---------|------|-----------|---------|-------|
| INC-2024-001 | Accident | Deck 1 | Personnel Accident | — | — | Medical Treatment Case |
| INC-2024-002 | Near-Miss | Engine Room | — (display as —) | — | — | — |
| INC-2024-003 | Accident | Cargo Hold 1 | Cargo Damage and/or Loss | Singapore (portCall) | — | — |
| INC-2024-004 | Non-Conformity | Bridge | — (display as —) | — | — | — |

---

## Open Questions

| ID | Question | Impact on This Story |
|----|----------|---------------------|
| OQ-1 | Should the "Related" column map to a specific field on the Incident model (not present in current interface)? | Field needs to be added to the `Incident` type if confirmed — flag before implementation |
| OQ-2 | What is the exact icon for the Export Template button — `FileDown`, `Download`, or a custom icon? | Minor visual; use `FileDown` from lucide-react unless specified otherwise |
| OQ-3 | Should "List/Trash" group use icon-only or icon+label? | Confirm with design before implementing |
| OQ-4 | Are the sticky columns only ID and Incident No, or should more columns be pinned? | Implementation default: pin ID + Incident No |

---

## Definition of Done

- [ ] All 16 acceptance criteria verified manually using the `INITIAL_DATA` seed records
- [ ] Conditional column rendering verified for all 4 location/category/class combinations
- [ ] Horizontal scroll works; sticky columns remain pinned
- [ ] Column resizer drag works with 80px minimum width
- [ ] Default sort (newest first) verified
- [ ] Header renders all 8 elements in correct order
- [ ] Kebab menu and Show/Hide icon are present but non-functional (deferred)
- [ ] `npm run build` passes with no TypeScript errors
- [ ] No regressions in other sidebar modules
