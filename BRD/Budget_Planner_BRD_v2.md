# Business Requirements Document
## Budget Planner Module — COEMS Platform

**Document Reference:** COEMS-BP-BRD-002  
**Version:** 2.0  
**Date:** 2026-06-19  
**Project:** COEMS (Commercial Operations & Enterprise Management System)  
**Based on:** BRD v1 (Jun 2025) + COEMS IDs: 11281, 11478, 11537, 11540, 11884, 12466, 12520, 12593, 14205, 14216, 14217, 14630, 14631, 15693, 15697, 15698, 15701, 15743, 18224, 19381

---

## 1. Description

The **Budget Planner** is a reporting sub-module within the COEMS **Reports** section (formerly "Fixture Report"). It is designed to help users plan, manage, and analyse fleet-related budgets by creating detailed budget reports that aggregate commercial metrics across Cargos, Fixtures, Voyage Estimates, and Voyages on an annual basis.

The module supports:

- Creation and management of budget reports with multi-vessel configuration
- Drag-and-drop assignment of Cargos, Fixtures, Voyage Estimates, and Voyages into reports
- Manual line item addition with inline editing
- Voyage linking from Estimate, Cargo, and Fixture line items
- Status-based visual categorisation with colour-coded rows
- Dynamic total summary and per-vessel calculations
- Column-level filtering, resizing, and sorting
- Multi-user collaboration via report sharing
- Export (PDF, Excel) and report duplication
- Clickable deep-links to source records across COEMS modules

---

## 2. Project Scope

### 2.1 In Scope

- **Reports sidebar restructure:** A new **"All Reports"** parent collapsible menu replaces the standalone "Fixture Report" entry. Under it, **"Fixture Reports"** (existing) and a new **"Reports"** sub-menu are available. The "Reports" sub-menu contains: Fixture, **Budget Planner**, Top Ten Customers, Person in Charge, Offices, Vessel, Vessel Type, Cargo Type, Yearly Overview, Customer Satisfaction, TCE
- **Budget Planner Home Page:** List, search, tab navigation, create, archive, and delete budget reports
- **Add New Budget / Vessel workflows:** Pop-up driven creation with vessel type selection (Multiple Vessel and Single Vessel tabs)
- **Budget Report Page:** Full report view with header, sidebar, drag-and-drop table, inline editing, status system, total summary, and vessel section
- **Add Voyage workflow:** Linking actual voyages from Estimate, Cargo, and Fixture line items via kebab menus
- **Report collaboration:** User invite, change notification, centralized change acceptance
- **Export / Actions:** Download PDF, Download Excel, Duplicate, Archive, Delete
- **User interface enhancements:** Column resize, column-level filters, drag-to-reorder rows, clickable overlays and deep-links

### 2.2 Out of Scope

- Multi-level budget approvals, submission/review/approval statuses, or audit trails for budget changes
- Forecasting or predictive budget planning
- Fine-grained permission matrix or admin-defined access control beyond basic user invitation to view/edit reports
- Email or in-app notifications for overdue budgets, updates, or collaboration actions
- Offline report creation or editing (requires active COEMS access)

---

## 3. Key Components

### 3.1 Navigation & Module Structure

The COEMS sidebar contains a parent collapsible menu labelled **"All Reports"**. When expanded, it reveals two direct sub-items:

| # | Menu Item | Description |
|---|---|---|
| 1 | **Fixture Reports** | The existing Fixture Report entry — retained as-is with no changes |
| 2 | **Reports** | New entry — navigates to the shared Reports listing page, which lists all report types: Budget Plans, Fleet Plans, and Port Call Evaluation Reports |

**Sidebar structure (as implemented):**
```
All Reports  ▲
  ├── Fixture Reports
  └── Reports              ← navigates to the shared Reports listing page
```

Clicking **Reports** in the sidebar navigates the user to the **Reports listing page** (see Section 3.2). Budget Plans are created and accessed from this shared page — there is no separate Budget Planner home page.

---

### 3.2 Reports Listing Page

The Reports listing page is a shared listing for all report types — **Budget Plans**, **Fleet Plans**, and **Port Call Evaluation Reports** — in a single unified view. It is the entry point for creating and opening any type of report.

#### 3.2.1 Tab Bar

A horizontal tab bar at the top of the page shows tabs for all previously opened reports across all report types. Each tab displays the report name and can be closed individually. The **"All Reports"** tab is always present as the default landing tab.

#### 3.2.2 Header Controls

| Element | Details |
|---|---|
| Search Bar | Searches across report names; positioned on the left side of the header |
| Mine | Toggle button — when active, shows only reports created by the logged-in user |
| Others | Toggle button — when active, shows reports created by other users |
| Archived | Toggle — Off by default. When toggled On, shows only archived reports |
| Create | Yellow dropdown button on the right. Expands to show three options: **New Fleet Plan**, **New Budget Plan**, **New Port Call Evaluation Report** |
| Kebab Menu | Three-dot icon at the far right of the header. Contains bulk actions |

#### 3.2.3 Listing Columns

| Column | Details |
|---|---|
| ID | System-generated sequential number |
| Name | The report name provided during creation; clickable — opens the report |
| Type | The report type: **Budget Plan**, **Fleet Plan**, or **Port Call Evaluation Report** — displayed as a colour-coded badge |
| Created By | The user who created the report |
| Created On | The date the report was created |
| Modified By | The user who last modified the report |
| Modified Date | The date of the last modification |

#### 3.2.4 Listing Behaviour

- All report types are shown together in the same list by default
- Records are sorted by created date — latest first
- The **Mine / Others** toggle filters by ownership; **Mine** is active by default
- The **Archived** toggle (Off by default) shows only archived reports when enabled
- Clicking a report **Name** opens that report in a new tab in the tab bar
- The footer shows: total records found (e.g. *Found 5 records*), items per page selector (**5 / 10 / 25 / 100**), current page indicator (e.g. *Page 1 of 1*), and Previous / Next page navigation arrows

---

### 3.3 Add New Budget Report (Create Flow)

From the Reports listing page, clicking **Create → New Budget Plan** opens the **"Add New Budget Report"** modal. This is a single unified modal that covers both the budget configuration fields and vessel setup before the report is created.

#### 3.3.1 Budget Configuration Fields

| Field | Input Type | M/O | Details |
|---|---|---|---|
| Budget Name | Free text | M | Name of the budget report |
| Date Range | Date range picker | M | Defines the budget period (start and end date) |
| Description | Textarea | O | Free-text notes or description for the report |
| Currency | Dropdown | M | List of all available currencies; defaults to **US Dollar**. Sets the display currency for the entire report |
| Conversion Date | Date-time picker | M | The date and time used to determine the applicable currency conversion rate. Defaults to the current date and time (e.g. 22/06/2026 00:00) |

#### 3.3.2 Vessel Configuration (within the same modal)

Below the budget configuration fields, the modal contains an embedded vessel table with the following columns:

| Column | Details |
|---|---|
| Vessel Name | Name of the vessel added to the report |
| Delivery Date | Delivery date for the vessel |
| Re-delivery Date | Re-delivery date for the vessel |
| Average Hire | Average hire rate for the vessel (e.g. *$ 0*, *$ 13,500*) |
| × | Remove button — present on each row; removes that vessel from the report |

- When no vessels have been added, the table shows the message: *"No vessels available"*
- The **"+ Add Vessels"** button (bottom left of the modal) opens the vessel selection sub-flow (see Section 3.4)

#### 3.3.3 Modal Action Buttons

| Button | Position | Behaviour |
|---|---|---|
| + Add Vessels | Bottom left (yellow) | Opens the Add Vessel sub-modal to select and configure vessels |
| Create Budget | Bottom right (yellow) | Submits the form and creates the budget report. Remains **disabled** until all mandatory fields (Budget Name, Date Range, Currency, Conversion Date) are filled |
| × (Close) | Top right | Closes the modal without saving any data |


---

### 3.4 Add Vessel Sub-Modal

The **"Add Vessel"** sub-modal is triggered by clicking **"+ Add Vessels"** from within the Add New Budget Report modal (Section 3.3), and is also accessible from within an existing budget report. It contains two tabs: **Multiple Vessel** (default) and **Single Vessel**.

#### Tab 1 — Multiple Vessel (Default)

Displayed by default when the modal opens. Allows adding vessels by type or by individual selection.

| Field | Input Type | M/O | Validation / Behaviour |
|---|---|---|---|
| Vessel Type | Dropdown | O | Lists all available vessel types. When a type is selected, the Vessel dropdown filters to show only vessels of that type. If no type is selected, all available vessels are shown in the Vessel dropdown |
| Vessel | Dropdown | O | Lists available vessels. If a vessel type is selected, the list filters by type. If a vessel is manually selected and then a vessel type is chosen, the system uses the manually selected vessel(s) and ignores the vessel type |

- The **Add Vessel** button remains disabled until either **Vessel Type** or **Vessel** has a valid selection
- On submission, the selected vessel(s) are added to the budget report's vessel list within the parent modal

#### Tab 2 — Single Vessel

Allows adding one vessel at a time with manual hire and date inputs.

| Field | Input Type | M/O | Details |
|---|---|---|---|
| Vessel | Dropdown | M | List of all available vessels |
| Average Hire | Numeric (with $ currency prefix) | M | Hire rate for the vessel |
| Delivery Date | Date picker | M | Delivery date of the vessel |
| Re-Delivery Date | Date picker | M | Re-delivery date of the vessel |

- All four fields are mandatory in the Single Vessel tab
- The **Add Vessel** button remains disabled until all mandatory fields are filled
- On submission, the vessel is added to the budget report's vessel list within the parent modal

#### Common behaviour (both tabs)

- Modal title: **"Add Vessel"**
- The active tab is underlined in yellow
- The **× (Close)** button closes the sub-modal and returns to the Add New Budget Report modal without saving

---

### 3.5 Budget Report Page — Header Section

The header is fixed at the top of the Budget Report page and contains two rows: the **tab bar** and the **report header bar**.

#### 3.5.1 Tab Bar

A horizontal tab bar sits at the very top of the page and persists across all report types. It shows tabs for every previously opened report (Budget Plans, Fleet Plans, Port Call Evaluation Reports). Each tab displays the report name and has an **×** close button to remove it from the tab bar. Navigation arrows (**< >**) allow scrolling through tabs when many are open. The **"All Reports"** tab is always present as the home tab.

#### 3.5.2 Report Header Bar

The header bar sits directly below the tab bar and contains the following elements:

| Element | Position | Details |
|---|---|---|
| Name & Type | Far left | Read-only display label showing the report name and type in the format: **Name: [Budget Name] \| Type: Budget** |
| Conversion Rate | Right section | Label **"Conversion Rate:"** followed by a currency dropdown (e.g. **US Dollar ▼**). Allows changing the display currency for the report |
| Date | Right section | Label **"Date:"** followed by the conversion rate reference date (e.g. **20/4/2026**). Corresponds to the Conversion Date set during report creation |
| Spot Average TCE | Right section | Numeric input field prefixed with **$**. Defaults to **0**. Accepts numeric values only. When a value is entered, it populates the Spot Market line item in the Total Summary section |
| Share | Right — yellow button | Opens the Share modal for report collaboration (see Section 3.14.1) |
| + | Right — icon button | Adds a new manual line item row to the report table |
| Edit | Right — icon/button | Opens the **Edit Budget Report** modal (see Section 3.5.3) to modify the report's name, date range, description, currency, conversion date, and vessel list |
| ⚙ (Settings) | Far right — gear icon | Opens report-level settings |
| Change Icon | Far right — conditional | A blinking icon that appears **only when line items have pending updates** from linked source records. Clicking it opens a confirmation pop-up: *"Do you want to accept the changes?"* with **Yes** (accepts all pending changes) and **No** (closes without accepting). This is a single centralised icon replacing the previous per-row change icons |

#### 3.5.3 Edit Budget Report Modal

Triggered by clicking the **Edit** button in the report header bar. The modal is identical in layout and fields to the **Add New Budget Report** modal (Section 3.3), with the following differences:

| Element | Create Flow (Section 3.3) | Edit Flow |
|---|---|---|
| Modal title | **Add New Budget Report** | **Edit Budget Report** |
| Vessel table | Empty (shows *"No vessels available"*) until vessels are added | Pre-populated with all existing vessels for the report |
| Primary action button | **Create Budget** | **Save** |

All fields are editable: Budget Name, Date Range, Description, Currency, and Conversion Date. The embedded vessel table shows all currently configured vessels (each with a **×** remove button) and the **+ Add Vessels** button remains available to add further vessels.

---

### 3.6 Budget Report Page — Sidebar Panel

The left sidebar (titled **"List"**) displays all available records that can be dragged into the report table. It opens as an overlay panel on the left side of the Budget Report page.

#### 3.6.1 Sidebar Header

| Element | Details |
|---|---|
| Title | **"List"** — displayed at the top left of the panel |
| Sort Dropdown | Positioned top right. Default value: **Modified - Latest**. Allows sorting the card list |
| × (Close) | Closes the sidebar panel |

#### 3.6.2 Tab Bar

Four tabs switch between record types. The active tab is underlined in yellow:

| Tab | Record Type Shown |
|---|---|
| **Cargo** | Cargo records (default/first tab) |
| **Fixture** | Fixture records |
| **Estimate** | Voyage Estimate records |
| **Voyage** | Voyage records |

#### 3.6.3 Search & Filter Controls

| Element | Details |
|---|---|
| Search | Text input; filters the card list by reference number or name |
| Archived | Toggle to the right of the search input. When enabled, shows only archived records |
| + Add Filter | Yellow button below the search row. Opens additional filter options for narrowing the card list |

#### 3.6.4 Card Layout (Cargo tab)

Each Cargo card displays the following information:

| Element | Details |
|---|---|
| Reference number | Bold text at top left (e.g. **CR-2026-185**) |
| Cargo name / description | Lighter text beside the reference number (e.g. *QA_SAA_nonestim*). Truncated with ellipsis if too long |
| User avatar | Initials badge at the top right of the card (e.g. **SA**, **AV**, **AM**) |
| Load port | Shown with a **green ↑ arrow** |
| Discharge port(s) | Shown with a **red ↓ arrow**. Multiple discharge ports shown on separate lines |
| Quantity | Numeric value below the ports (e.g. *78.000*, *150.000*) |
| Financial row | Two values separated by a pipe: `$ [value] | $ [value]` (e.g. *$ 95.374 | $ -124.881*). Negative values displayed in red |
| Rate row | Rate per unit: `$ [rate] / [quantity unit]` (e.g. *$ 6.500 / 12 nos*, *$ 7.500 / 20 cbm*) |

#### 3.6.5 Sidebar Behaviour

- Records already assigned to the report are excluded from the card list (de-duplication)
- Cards are dragged from the sidebar into the report table to assign them as line items; they are placed at the exact drop position in the table
- For **Voyage Estimate extension cards** (Estimate tab): the extension name is displayed in grey below the extension number; if the name exceeds the display limit, the full name is revealed on hover

---

### 3.7 Budget Report Page — Report Table

The main scrollable table displays all assigned and manually added line items.

#### 3.7.1 Table Columns

Columns are listed in their left-to-right display order as implemented:

| # | Column | Details / Formula |
|---|---|---|
| — | Row icons | Two icons at the far left of each row: a **drag handle** (≡) for reordering and a **kebab menu** (⋮) for row-level actions |
| 1 | Voyage/Estimate | The Voyage Estimate number and name linked to the line item. For extension records, the full extension number is displayed (not just the parent estimate number) |
| 2 | Cargo/Fixture | The Cargo or Fixture reference number linked to the line item |
| 3 | Freight | Freight rate for the line item. Editable for manually added line items |
| 4 | Head Account | Head account classification. Editable for manually added line items |
| 5 | No | Number of voyages for this line item |
| 6 | Days | Duration in days per voyage |
| 7 | Total Days | Calculated: `Days × No` |
| 8 | Share % | System-generated, non-editable. Calculated in real time: `Share % = Total Days / Sum of all Total Days × 100`. Recalculates automatically when Days or No changes |
| 9 | Average TCE | Average Time Charter Equivalent for the line item |
| 10 | Gross Result | Calculated financial result for the line item |
| 11 | Status | Row status badge — colour-coded (see Section 3.10) |
| 12 | Time of Sailing | Date range of the voyage sailing period |
| 13 | Year | Auto-populated from the start date of Time of Sailing when a date is selected. Remains manually editable |
| 14 | Vessel | Vessel name assigned to the line item |
| 15 | Profit/Loss | Financial profit or loss indicator |
| 16 | Gross Profit/Loss | Calculated: `Freight × No. of Voyages` |
| 17 | Tradelanes | Trade route information for the line item |

**Note:** The column previously referred to as "Total Freight" in BRD v1 is implemented as **"Gross Profit/Loss"** and calculates `Freight × Number of Voyages`.

#### 3.7.2 Sorting / Row Order

- The previous default ordering by **Time of Sailing** has been removed
- When a card is dragged from the sidebar into the table, it is placed at the exact drop position
- Each row has a drag handle icon; users can reorder rows by clicking, holding, and dragging the handle
- Manually added line items (via the "+" / "Add new record" button) follow the existing append behaviour

#### 3.7.3 Column Filters

Each column header includes a filter icon. Clicking the icon opens a dropdown panel containing:

| Element | Details |
|---|---|
| Search | Text input at the top of the panel. Dynamically filters the value list as the user types; does not apply to the report table until **Apply** is clicked |
| Select All | Yellow checkbox; checks or unchecks all values in the list (including Blanks) |
| (Blanks) | Yellow checkbox displayed in a distinct highlight colour; represents rows where the column value is empty or null |
| Value list | Scrollable list of all unique values for that column, each with a yellow checkbox |
| Clear | Button at the bottom left. Deselects all checkboxes (including Select All and Blanks) |
| Apply | Button at the bottom right. Applies the current selection as a filter on the report table |

**Selection behaviour:**
- Checking/unchecking **Select All** checks/unchecks all visible values (including Blanks)
- Unchecking any single value automatically unchecks **Select All**
- Manually checking all values re-checks **Select All**

**Apply / Clear behaviour:**
- Clicking **Apply** filters the report table to show only rows matching the selected values
- Clicking **Clear** deselects all values; the filter is not applied until **Apply** is clicked
- If no values are selected when Apply is clicked, the filter defaults to **Select All**
- Applying a filter on one column does not reset filters on other columns
- Re-opening the filter dropdown shows the previously selected values for that column
- Active filters are visually indicated on the column header icon

#### 3.7.4 Column Width Resize

- Each column in the report table includes a drag-and-expand indicator at its edge
- Users can manually adjust column width by dragging the column edge
- Column width adjustments are saved automatically per user and persist when the user revisits the Budget Report page during the same session
- Column widths reset to default when the user logs out and logs back in

#### 3.7.5 Clickable Record Links

Clicking a record identifier within the report table navigates to the source record as follows:

| Clicked Element | Behaviour |
|---|---|
| Fixture Number | Opens a **Fixture overlay** within the Budget Report page. Changes are auto-saved. On closing, the user remains on the Budget Report |
| Voyage Estimate Number | Redirects the user to the **Voyage Estimate module** to view/edit details |
| Voyage Number | Redirects the user to the **Voyage module** to view/edit details |
| Cargo Number | Redirects the user to the **Inquiry module** to view/edit details |

---

### 3.8 Line Item Behaviour & Inline Editing

#### 3.8.1 Drag-and-Drop from Sidebar

- When a card (Cargo, Fixture, Voyage Estimate, Voyage) is dragged from the sidebar and dropped into the report table, it is placed at the exact drop position
- All data fields for the assigned card are automatically populated using existing calculation logic

#### 3.8.2 Manual Line Item Addition

- Users can manually add a new line item using the **"Add new record"** / **"+"** button
- For manually added line items, the following fields are **editable** (in addition to standard editable fields):
  - **Head Account**
  - **Freight Rate**
- The **Cargo/Fixture** field on a manually added line item is editable even after the item has been saved; it is not locked or read-only post-creation
- Any validations applied during initial entry of Cargo/Fixture also apply when editing

#### 3.8.3 Row Kebab Menu

Each line item row has a kebab (three-dot) menu. Available options vary by line item type:

| Line Item Type | Kebab Menu Options |
|---|---|
| Voyage Estimate | Add Voyage |
| Cargo | Add Voyage |
| Fixture | Add Voyage |
| All types | Delete (remove from report) |

---

### 3.9 Add Voyage Workflow

Users can link an actual Voyage to an existing Estimate, Cargo, or Fixture line item in the report. The flow is identical for all three source types.

**Step 1 — Initiate:**
Select **"Add Voyage"** from the kebab menu of a Voyage Estimate, Cargo, or Fixture line item.

**Step 2 — Select Voyage:**
A dropdown panel appears containing a **"Select Voyage"** field listing all available Voyages. Voyages already assigned to the same Budget Report are excluded from the list (de-duplication). The user selects exactly one Voyage.

**Step 3 — Confirm:**
A confirmation pop-up appears:
> *"Add Voyage \<Respective Voyage Number\> to the Report?"*

The pop-up contains **Yes** and **No** buttons.

**Step 4a — Yes: Scenario 1 (No. of Voyages = 1 on source line item)**
- The source line item (Estimate / Cargo / Fixture) is **replaced** by the linked Voyage
- The **No** (No. of Voyages) field for the new Voyage row is set to **1** by default
- All other fields are automatically populated/recalculated using existing calculation logic, driven by the linked Voyage data
- No changes are made to existing calculation formulas
- The view refreshes to reflect the completed action

**Step 4b — Yes: Scenario 2 (No. of Voyages > 1 on source line item)**
- The **No** (No. of Voyages) value on the source line item is **decremented by 1** (e.g., 10 → 9)
- The source line item is **not replaced**
- A **new Voyage line** is added to the Budget Report with:
  - **No** (No. of Voyages) set to **1** by default
  - All other fields automatically populated/recalculated using existing logic, driven by the linked Voyage
- No changes are made to existing calculation formulas
- The view refreshes to reflect the completed action

**Step 4c — No:**
- The pop-up closes immediately
- No data changes occur to the source line item

---

### 3.10 Status System & Colour Coding

Each line item in the Budget Report is assigned a status, displayed as a colour-coded row highlight. All statuses are user-selectable when adding or editing a line item.

| Status | Colour | Hex Code | Highlight Hex |
|---|---|---|---|
| Reported | Dark Green | `#7EDD8E` | `#38D351` |
| Fixed | Light Green | `#E6FFDE` | `#BAF0A9` |
| Firm | Dark Blue | `#80DBFF` | `#3BC8FF` |
| Budgeted | Light Blue | `#D7F0FF` | `#BEE7FF` |
| Spot Market | Purple | `#FEB0ED` | — |
| Lost | Red | `#FF9696` | `#F37B7B` |
| Dry Dock | Grey | `#A8A8A8` | `#9D9D9D` |

**Status behaviour rules:**
- **Lost**: Visible on line items and filterable on the listing page. Excluded from the Total Summary section (not counted in totals)
- **Dry Dock**: Used when a vessel is in repairs/maintenance and not sailing. Included in the Total Summary and displayed in the Total section
- **Spot Market**: Managed via the Spot Average TCE field in the header; see Section 3.5 and Section 3.11.2
- All other statuses are included in Total Summary calculations

---

### 3.11 Total Summary Section (Bottom Collapsible)

The fixed bottom section of the Budget Report displays aggregated totals. It is collapsible and updates dynamically as line items change.

#### 3.11.0 Left Navigation Panel

The bottom section contains a **left sidebar** with two tabs that switch the view:

| Tab | Active State | Content Displayed |
|---|---|---|
| **Total** | Yellow highlight | Total Summary table (Section 3.11.2) |
| **Vessel** | Yellow highlight | Vessel section table (Section 3.12) |

Clicking a tab switches the right-hand content area. Only one tab is active at a time.

#### 3.11.1 Collapsed View (Default State)

The Total Summary section is collapsed by default, appearing as a single horizontal strip pinned to the bottom of the Budget Report page. The strip displays:

- **"Total"** label on the far left
- For each active status: a **colour-coded dot** followed by three metrics inline: **Days** (Total Days), **P/L** (Profit/Loss), **TCE** (Average TCE)
- Statuses are shown sequentially left to right in a scrollable horizontal strip
- A **collapse/expand toggle** (∨ icon) on the far right to expand the full summary table

Only statuses that have at least one line item are shown in the strip. The **Lost** status is excluded from all summary calculations and does not appear in the strip or expanded table.

The display updates dynamically as line items are added, edited, or have their status changed.

#### 3.11.2 Expanded View — Total Summary Table

When expanded, the **Total** tab displays a table with the following columns:

| Column | Details |
|---|---|
| Row label | Status name (see row labels below) |
| Total Days | Total days for that status |
| Share % | `(Total Days for status ÷ Total Employment Days) × 100` |
| Average TCE | Average TCE for that status |
| Gross Result | Sum of Gross Result for that status |
| Total Freight | Sum of Total Freight for that status |
| Gross Profit/Loss | Sum of Gross Profit/Loss for that status |

**Row labels and colour coding:**

| Row Label | Colour | Notes |
|---|---|---|
| Average TCE Firm | Dark blue | |
| Average TCE Reported | Dark green | |
| Average TCE Budgeted | Light blue | |
| Average TCE Fixed status | Light green | |
| Dry Dock | Grey | |
| Spot Market | Pink | Total Days = `Total Employment Days − Sum of all other status Total Days`. Average TCE = value from Spot Average TCE header field. Total Freight and Gross Profit/Loss are empty |
| **Total Result** | Dark (pinned row) | Total Days shown as `actual / Total Employment Days`. Gross Result shown as `value / Total Gross Hire`. Share % is 0. Remaining columns sum across all statuses |

- The **Lost** status is excluded from all rows and calculations
- Only statuses with at least one active line item are shown as rows

---

### 3.12 Vessel Section

Accessed by clicking the **Vessel** tab in the left navigation panel of the bottom section (see Section 3.11.0). Lists all vessels added to the report along with their key financial and duration metrics.

#### 3.12.1 Vessel Section Columns

| Column | Details / Formula |
|---|---|
| Vessel Name | Name of the vessel |
| Delivery Date | Date the vessel was delivered |
| Re-delivery Date | Date the vessel was re-delivered |
| Duration | `Re-delivery Date − Delivery Date` (in days) |
| Average Hire | Average hire rate for the vessel |
| Gross Hire | `Average Hire × Duration` |

#### 3.12.2 Vessel Section Totals Row

A **"Total Days of Employment"** row is pinned at the bottom of the vessel section, aggregating all vessel values:

| Column | Total Row Calculation |
|---|---|
| Duration | Sum of all vessel Duration values |
| Average Hire | `Sum of all Gross Hire / Sum of all Duration` |
| Gross Hire | Sum of all Gross Hire values |

**Example:**

| Vessel Name | Delivery Date | Re-delivery Date | Duration | Average Hire | Gross Hire |
|---|---|---|---|---|---|
| V1 | 01/01/2025 | 31/12/2025 | 365 | 500 | 182,500 |
| V2 | 01/01/2025 | 31/12/2025 | 365 | 750 | 273,750 |
| **Total Days of Employment** | — | — | **730** | **625** | **456,250** |

---

### 3.13 Voyage Estimate Extension Support

The Budget Planner supports Voyage Estimate extension cards with the following behaviour:

- **Sidebar display:** The extension name is shown in grey shade below the extension number on the card. Full name is revealed on hover if truncated. Users can search by extension number or extension name
- **In-report display:** When a Voyage Estimate extension is assigned to the report, the **full extension number** is displayed in the Estimate No column (not just the parent estimate number). The extension name is shown below the extension number

---

### 3.14 Report Actions

| Action | Triggered From | Description |
|---|---|---|
| **Share** | Budget Report header — Share button | Opens the Share modal to collaborate with other users (see Section 3.14.1) |
| **Archive** | Reports listing page — kebab menu | Archives the selected report; archived reports are hidden from the default listing and visible only when the Archived toggle is enabled |
| **Unarchive** | Reports listing page — kebab menu | Restores an archived report back to the active listing |

#### 3.14.1 Share Modal

Clicking the **Share** button in the report header opens the Share modal.

**Modal title format:** `Share: "[Report Name]" to:`

| Element | Details |
|---|---|
| Select Users | Searchable dropdown to find and select COEMS users to share the report with |
| Permission dropdown | Sets the access level for the selected user(s). Options: **Can Edit** / **Can View**. Defaults to **Can View** |
| Who has access | A list of all users currently granted access to the report, displayed with their avatar (initial) and name. The report creator is always shown here |
| Share button | Submits the invitation. Remains **disabled** until at least one user is selected |
| × (Close) | Closes the modal without sharing |

**Permission levels:**

| Permission | Behaviour |
|---|---|
| **Can View** | The invited user can open and view the report but cannot make any changes |
| **Can Edit** | The invited user can open, view, and edit the report |

---

## 4. Business Drivers

- Streamline annual fleet financial planning within COEMS
- Provide a unified platform for cross-functional budget visibility across vessels, fixtures, cargos, and voyages
- Improve forecast accuracy and reduce manual spreadsheet usage
- Promote collaboration via multi-user report access
- Enable seamless progression from estimate to actual voyage within the budget planning workflow

---

## 5. Assumptions

- Users creating budget reports have valid data access rights in COEMS
- Vessel data, Cargo data, Fixture data, and Voyage Estimates are maintained accurately in COEMS
- Status-based categorisation (colour coding) can be determined from existing COEMS datasets
- Existing infrastructure supports tabbed navigation and dynamic rendering
- Voyage Estimate extension numbering and naming are maintained in the Voyage Estimate module
- Report users will be trained or given basic documentation for navigation

---

## 6. Constraints

- All financial figures (e.g., TCE, Gross Result, Gross Hire) depend on the accuracy of upstream modules
- No offline report creation or editing — requires active COEMS access
- Column width preferences persist only within a session; they reset to default on logout
- The Add Voyage workflow can link any available Voyage to a line item (not restricted to voyages created from that specific estimate); duplicate voyages within the same report are excluded from the selection list

---

## 7. Version History

| Version | Date | Author | Summary of Changes |
|---|---|---|---|
| 1.0 | Jun 2025 | — | Initial release: Reports navigation, Home Page, Add New Budget, Budget Report page with drag-and-drop, status colour codes, total summary, invite, export |
| 2.0 | Jun 2026 | Arun Kumar | Added: Vessel Type modal (Multiple/Single tabs), Add Voyage workflow (Estimate/Cargo/Fixture), centralised Change Icon, column filters, column resize, drag-to-reorder rows, inline editing for Cargo/Fixture and Head Account/Freight Rate fields, Year auto-population, Share% auto-calculation, Spot Average TCE field, Gross Freight column, Lost status, Dry Dock status, updated colour codes for all statuses, Vessel section with Duration/Gross Hire/Totals, Total Summary formula updates, Voyage Estimate extension name/number display, clickable deep-links to source modules |
