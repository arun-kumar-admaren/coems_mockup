#### **USER Story:**

**As a user,**
**I want to** raise a new Engineering Project (request)
**So that** an engineering request against a Scope or Fixture is captured with all the details the engineering team needs to start work.

---

#### **acceptance criteria:**

1. An **"Add Engineering Project"** button on the Engineering listing must open an **"Add New Engineering Project"** side panel.

2. If the user previously started a project and navigated away without saving, reopening the form must prompt **"You have unsaved changes."** with two options: **Resume** (restores the draft) or **Create New** (discards the draft and starts blank).

3. The form must present an **Engineering Details** section with the following fields:

   | **Field** | **Type** | **Validation** | **Notes** |
   | --- | --- | --- | --- |
   | Name | Free text | Mandatory | |
   | Description | Textarea | Optional | |
   | Scope/Fixture | Dropdown — Scope / Fixture | Mandatory | Determines which lookup populates Scope/Fixture No |
   | Scope/Fixture No | Searchable dropdown | Mandatory | Scoped to existing Scope or Fixture records depending on the selection above |
   | Deadline | Date picker | Optional | Displayed alongside the user's timezone |
   | Engineering Project Number | Free text | Mandatory | Unique project number, e.g. `UHL-P-2026-047` |
   | Priority | Dropdown — Low / Medium / High | Optional | Defaults to Medium |
   | Assigned UES Offices | Multi-select chips | Optional | Defaults to the requester's own UES office |
   | PIC Engineering | Multi-select chips (users) | Optional | Defaults to the current logged-in user |
   | Loading Methods | Dropdown — see "Engineering - Reference Lists" | Optional | |

4. An **Engineering Tasks** section must let the user click **"Add Engineering Tasks"** to pre-select which discipline task groups (Hydro, Structural, CAD, Projects, Cargo Planning, Others) should be created on the project.

5. A **Port Details** section must let the user click **"Add Port"** to attach one or more ports to the project.

6. A **Stowage** section must provide a **Stowage Instructions** textarea (optional, free text).

7. A **Save** button must be available at the top of the panel at all times; a close (✕) button must discard the form (triggering the unsaved-changes prompt described in AC2 on next open).

8. On save, the new project must appear in the Engineering listing under the **"New Inquires"** status tab (and under **"All"**), with the Project Status/Progress defaulted to their initial values (0% complete).
