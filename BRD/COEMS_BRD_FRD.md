# COEMS (Maritime Operations System)
## Field-Level Data Dictionary & Form Requirements
**Version:** 2.0
**Date:** March 30, 2026

---

## 1. Introduction

This document provides exact, field-level requirements, validations, and mapping logic for modules currently implemented in the COEMS system built via Figma Make. It acts as an addendum/expansion to the BRD/FRD.

**Global Structural Rule:** All Dropdown/Select components must use `"none"` as their internal placeholder value to ensure rendering stability.

---

## 2. Voyage Module: New Incident Reporting

**Path:** `Voyage Detail Overlay -> Incidents Tab -> New Incident`

Users can report HSEQ incidents directly mapped to a specific Voyage. The form includes the following field schemas:

| Field Label | Input Type | Required | Values / Data Source | Validation / Rules |
| :--- | :--- | :---: | :--- | :--- |
| **Incident Number** | Input | System | Auto-generated | Read-only. Greyed out background. |
| **Vessel** | Select | Yes | Vessel List (e.g., UHL F900, UHL FAITH...) | Maps `none` as placeholder. |
| **Port Call** | Select | No | Mogadishu, Durban, Luanda, Rotterdam... | Optional. |
| **Related Fixture(s)** | Popover (Multi-Select)| No | `FAI 2601`, `FAI 2602`, etc. | Stores as an Array of Strings. Visualized as checkboxes. |
| **Date of Incident** | Native Date | Yes | `type="date"` | Must be a valid date. |
| **Incident Category** | Select | Yes | Cargo, Environmental, Near-Miss, Personnel Accident, Property Damage, Security, Technical, Other | - |
| **Incident Class** | Select | No | Class A, Class B, Class C | Optional classification. |
| **Incident Type** | Select | No | Collision, Grounding, Fire, Spillage... | Optional. |

---

## 3. Shared Legal Tab (Inquiry & Fixture Modules)

**Path:** `InquiryDetail / FixtureDetail Overlays -> Legal Tab`

The Legal Tab follows a strict mirroring architectural requirement across pre-fixture (Inquiries) and post-fixture (Fixtures) workflows.

### 3.1 Charter Party Section
| Field Label | Input Type | Required | Values | Validation / Rules |
| :--- | :--- | :---: | :--- | :--- |
| **Charter Party Type** | Select | Yes | BIMCO, Client CP, Frame Agreement | - |
| **Reviewed by Legal** | Checkbox | No | Boolean | - |
| **Contract / Recap Date** | DatePicker | No | Standard Date | **Rule:** Future dates disabled `date > new Date()`. |
| **Charter Party Issuance Date**| DatePicker | No | Standard Date | **Rule:** Cannot precede Contract Date `date < new Date(contractDate)`. |
| **Legal Review Status** | Select | No | To be reviewed by Legal, Under Review, Reviewed, Not Required | Reflected in Legal Listing Hub filters. |

### 3.2 Insurance & Compliance Sections
| Field Label | Input Type | Required | Values | Validation / Rules |
| :--- | :--- | :---: | :--- | :--- |
| **Additional Insurance Required**| Radio Group | Yes | Yes / No | Default: "No". Conditionally renders "Insurance Status". |
| **Insurance Status** | Select | Cond. | Reviewed by Insurance, Approved by Insurance, Signed Off, Pending / To be signed | **Conditional:** Only visible if Additional Insurance Required is "Yes". |
| **Due Diligence Completed** | Checkbox | No | Boolean | - |
| **E-Number** | Input | No | Max length: 50 | **Validation:** Strict alphanumeric input using regex `.replace(/[^a-zA-Z0-9]/g, '')`. |

---

## 4. Legal Listing Hub

**Path:** `Main Sidebar -> Legal`

An aggregated dashboard pulling line items from both Inquiry and Fixture states.

### 4.1 Hub Interface Elements
*   **Status Filter Group:** Toggle buttons for "All", "To be reviewed by Legal", "Under Review", "Reviewed", "Not Required".
*   **Table Data Badges:**
    *   `Type: Inquiry` = Blue Badge (`bg-blue-100 text-blue-700`)
    *   `Type: Fixture` = Purple Badge (`bg-purple-100 text-purple-700`)

### 4.2 Routing Logic
Clicking a table row determines the overlay to mount based on the internal `type` property.
*   **If Type === Inquiry:** Launches `InquiryDetail` overlay and maps `referenceNo` to the `cargoNumber` prop.
*   **If Type === Fixture:** Launches `FixtureDetail` overlay and maps `referenceNo` to the `number` prop.

---

## 5. HSEQ Module: Add & Edit Overlay

**Path:** `HSEQ Dashboard -> Add Incident / Edit Incident`

The central Hub for HSEQ incidents incorporates MSCAT (Marine Systematic Cause Analysis Technique) structuring.

### 5.1 Main Incident Details
| Field Label | Input Type | Notes & Data Mapping |
| :--- | :--- | :--- |
| **Vessel/Location** | Input | Name of the ship or port. |
| **Date** | DatePicker | Standard Date format. |
| **Category** | Select | Incident, Near-Miss, Non-Conformity, Innocent Incident. |
| **Severity** | Select | Low, Medium, High, Critical. |
| **Description** | Textarea | Detailed summary. |

### 5.2 MSCAT (Root Cause) Linking Logic
Allows adding multiple **Cause Entries** to a single incident.
*   **Immediate Cause Type:** Select (`Substandard Act`, `Substandard Condition`).
*   **Category:** Select (Conditionally renders options based on Immediate Cause Type selection).
    *   *If Act:* Failure to Follow Procedures, Improper Lifting, etc.
    *   *If Condition:* Inadequate Guarding, Defective Equipment, etc.
*   **Control Actions (Nested Array):** Linked to a specific Cause Entry. Tracks Description, Due Date, Responsible Person, and Status (Open/Closed).

### 5.3 Additional Arrays
*   **Linked Claims:** Array linking `Reference ID` and `Amount`.
*   **Documents:** Array linking `Folder Link` and `Checklist Type`.

---

## 6. Claims & Insurance: Add & Edit Overlay

**Path:** `Claims & Insurance Dashboard -> New Claim / Row Click (Edit)`

A complex multi-tab form (`General Info`, `Incident Link`, `Financials`, `Insurance`). The "Financials" and "Insurance" tabs are **only visible** in Edit Mode (`editingId` is truthy).

### 6.1 General Info Tab
| Field Label | Input Type | Required | Values / Rules |
| :--- | :--- | :---: | :--- |
| **Claim Number** | Input | System | Auto-generated, read-only. |
| **Claim Context** | Select | Yes | Incident Claim, Commercial Claim |
| **Type of Claim** | Select | Yes | Cargo, Hull, Commercial, Property, Delay, Personal |
| **Type of Cover** | Select | Yes | P&I, H&M, FD&D, Cargo Liability, Other |
| **Broker** | Select | Yes | Maritime Insurance Brokers, Global Marine... |
| **Leading Insurer** | Input | No | Text string |
| **Date of Notification** | Date Input | No | Standard date format |
| **Claimant** | Input | No | Text string |
| **Short Claim Description** | Textarea | Yes | Min-height enforced (`min-h-[80px]`) |
| **Claim Status** | Select | Yes | Open, Under Review, Settled (with specific color badging based on state) |
| **Additional Insurance Req.**| Radio Group| No | Yes / No (Boolean binding) |

### 6.2 Incident Link Tab
Users map claims to existing incidents stored in the `INCIDENTS_LOOKUP` array.
*   **Linked Incident:** Select field targeting Incident IDs.
*   **Auto-Population Rule:** When a Linked Incident is selected, the system auto-populates read-only snapshot fields: `Vessel`, `Voyage`, `Port Call`, `Date of Incident`, `Incident Category`, `Short Description`, `Class`, `Type`, `Location`, and sets `Claim Context` to "Incident Claim" automatically.

---

## 7. HSEQ KPI Module

**Path:** `Main Sidebar -> HSEQ KPI`

An automated analytics dashboard aggregating the local React state from HSEQ incidents.

### 7.1 Key Metrics Handled
*   **Total Incidents:** Count of all items in the array.
*   **High Severity %:** Calculates total incidents where Severity is 'High' or 'Critical' over the Total Incidents.

### 7.2 Data Visualizations (Recharts)
*   **Incidents by Category:** PieChart mapping Incident Categories (Near-Miss, Non-Conformity, etc.) with custom standard colors (`#0088FE`, `#00C49F`, etc.).
*   **Severity Distribution:** BarChart mapping Severity against Incident Volume using custom Recharts `<Cell>` coloring.

---
*End of Document*