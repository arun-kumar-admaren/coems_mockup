# Business Requirements Document
## Engineering Module — COEMS Platform

**Document Reference:** COEMS-ENG-BRD-001
**Version:** 1.1
**Date:** 2026-08-06
**Project:** COEMS (Commercial Operations & Enterprise Management System)

> Field-level detail (exact fields, types, validations, column lists, per-discipline breakdowns) has moved to the companion PRD: `_bmad-output/planning-artifacts/prds/prd-COEMS-engineering-2026-08-06/prd.md`. This BRD covers business scope, drivers, and boundaries only.

---

## 1. Description

The Engineering module is the technical work-management hub in the COEMS platform. It captures Engineering Requests raised against a commercial **Scope** or **Fixture**, breaks the request down into discipline-specific engineering work (Hydro, Structural, CAD, Projects, Cargo Planning, and other disciplines), tracks the tasks and time spent by the engineering team against that work, and stores the supporting documents and discussion.

The module enables:

- Centralised creation and management of Engineering Projects (requests) linked to a Scope or Fixture
- A discipline-based breakdown of engineering work within a single project
- A module-wide task tracker independent of any single project, in both list and Kanban form
- Time logging against tasks and roll-up reporting via configurable time-tracking widgets
- Quotation tracking for the cost of engineering work
- Project-level and discipline-level file storage, plus module-wide document search
- A full activity/audit trail on every record
- Administrator-maintained reference lists that drive dropdowns across the module
- A beta geographic map view of engineering-related vessels/projects
- Soft-delete and Trash/Restore lifecycle management, plus Duplicate for reusing a prior request as a starting point

---

## 2. Key Capability Areas

### 2.1 Engineering Listing

A searchable, filterable, status-driven view of every Engineering Project, with the standard COEMS grid capabilities: column show/hide/reorder, saved filters, soft-delete/Trash, duplicate, and bulk actions. This is the entry point for both engineering staff managing their own requests and managers overseeing the whole pipeline.

### 2.2 Engineering Project Creation

A guided creation flow that ties a new engineering request to its originating commercial Scope or Fixture, captures the core request details, lets the requester pre-select which engineering disciplines are needed, and preserves in-progress drafts if the user navigates away before saving.

### 2.3 Engineering Project Detail

A single record view combining: a full activity timeline, the editable core request details, a discipline-by-discipline breakdown of the actual engineering work (each with its own status, tasks, files, and discussion), a read-only mirror of the linked Scope/Fixture's cargo and chartering data, cost quotations, project-wide comments and files, and a consolidated task list across all disciplines.

### 2.4 Engineering Task Tracker

A module-wide, cross-project task tracker (list and Kanban views) so engineering staff and managers can see workload without opening individual projects.

### 2.5 Time Tracking & Reporting

Configurable dashboard widgets that roll up logged time by office, user, or module for utilisation reporting.

### 2.6 Reference Data Administration

Admin-maintained lists (loading methods, engineering discipline/analysis types, engineering tags, and project client codes) that drive dropdowns across the module without requiring a code change. Reachable from the Engineering module's own sidebar and from the platform-wide Settings area.

### 2.7 Document Discovery

A module-wide document search that covers files attached anywhere in the module, regardless of which project or discipline they were uploaded under.

### 2.8 Geographic View (Beta)

An in-development map view giving a geographic overview of engineering-related vessels and projects.

---

## 3. Project Scope

### 3.1 In Scope

- Engineering listing, search/filter, and column management
- Engineering Project creation, including draft resume
- Full Engineering Project detail view and all its tabs
- Discipline-based breakdown of engineering work
- Read-only Scope/Fixture mirror within the detail view
- Project-level and discipline-level file storage
- Module-wide Engineering Task tracker
- Time-tracking dashboard
- Reference-list administration
- Module-wide document search
- Map (beta) geographic view
- Delete, Duplicate, and Trash/Restore lifecycle for Engineering Projects

### 3.2 Out of Scope

- Full Fixture/Scope module workflows (covered in separate BRDs)
- Financial settlement, invoicing, or Business Central sync remediation
- Finalised behaviour of the Map feature (pending exit from beta)
- External engineering software/CAD tool integrations

---

## 4. Business Drivers

- Provide a single, structured entry point for engineering work raised against commercial Scope/Fixture records
- Let multiple engineering disciplines work on the same request in parallel, each with its own status, tasks, and files, without stepping on each other
- Give engineering managers visibility into workload and utilisation across the team
- Track the cost of engineering work alongside the request itself
- Provide traceability of every change through a full activity trail
- Keep dropdown data centrally maintained instead of hard-coded
- Make every uploaded document findable module-wide, regardless of which project or discipline it was attached under

---

## 5. Assumptions

- "Scope/Fixture" links to existing records in the Chartering module's Scope and Fixture data
- Office and user assignment fields draw from the COEMS user/office directory
- Vessel fields are pulled from the COEMS vessel registry
- Tasks created anywhere in the module (a discipline, a project's consolidated task list, or the global tracker) refer to the same underlying task record
- Time logged against tasks feeds both project-level and team-level reporting

---

## 6. Constraints

- Quotation-creation behaviour could not be confirmed in UAT (the explored record had no quotations) — see PRD Open Questions
- Map is explicitly labelled BETA; its behaviour may change before general availability
- The Business Central sync flag is surfaced as-is; Engineering cannot resolve underlying sync failures
- Column visibility, order, and filter state may be user-session specific
- Access to the Engineering module is governed by a platform-wide user permission flag, administered outside the module (see PRD §3.3, §4.19)

---

## 7. Reference Documents

| Document | Content |
|---|---|
| `_bmad-output/planning-artifacts/prds/prd-COEMS-engineering-2026-08-06/prd.md` | Full field-level functional requirements, NFRs, open questions, user journeys |
| `docs/user-stories/engineering/*.md` (17 files) | Per-feature user stories with acceptance criteria |

---

## 8. Mockup Reference

The UI design and screen flows for this module were documented directly from the live UAT environment (no prior BRD or prototype source existed for Engineering before this document).

**UAT Environment:** [https://coems.uat.admaren.org](https://coems.uat.admaren.org)
