#### **USER Story:**

**As a user,**
**I want to** open an Engineering Project and see its key details, status, and activity at a glance
**So that** I can quickly understand where the project stands before drilling into a specific tab.

---

#### **acceptance criteria:**

1. Clicking a project in the Engineering listing must open a right-side detail panel showing:
   - A header with the **Project Number** (e.g. `UHL-P-2026-047`), an overall **% Completed** indicator, and a close (✕) control.
   - A summary strip with: **Priority**, **Request Number**, **PIC Chartering**, **Vessel Type**, **Vessel**, **Deadline**, **PIC Engineering**.
   - A row of icon actions: view/visibility toggle and refresh.

2. The panel must present the following tabs, in order: **Timeline | Details | Engineering Tasks | Scope/Fixture | Quotations | Comments | Files | Tasks**.

3. The **Timeline** tab must be selected by default and must show a chronological activity feed of the project (e.g. record creation, status/field updates), each entry showing the acting user and timestamp, with a **"Show Details"** expander per entry.

4. The Timeline tab must include an **"Add an Action"** button to log a manual timeline entry.

5. The **Details** tab must show a **Request Details** section with: Project Client, Engineering Tags, Name, Description, Engineering Project Number, Project Status, Project Phase, Scope/Fixture, Scope/Fixture No, Deadline, Priority, Assigned UES Offices, PIC Engineering, Loading Methods — matching the fields captured at creation (see "Engineering - Add New Project").

6. The Details tab must also show a **Port Detail** section (with an "Add Port" action) and a **Stowage Instructions** field.

7. The Details tab must include a collapsible **History** section showing the full field-level change log for the project.

8. All fields on the Details tab must be editable in place by users with Engineering edit permission, and changes must be reflected immediately in the Engineering listing and in the Timeline tab.
