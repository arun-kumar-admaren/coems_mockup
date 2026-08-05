#### **USER Story:**

**As a user,**
**I want to** break an Engineering Project down into discipline-specific work streams
**So that** Hydro, Structural, CAD, Projects, Cargo Planning, and other engineering disciplines can each track their own tasks, files, and discussion independently within one project.

---

#### **acceptance criteria:**

1. The **Engineering Tasks** tab must present a sub-tab bar with the discipline groups: **Hydro | Structural | CAD | Projects | Cargo Planning | Others**.

2. Each discipline sub-tab must show an **Engineering Details** section with: Name, Status (e.g. Under Discussion), Engineering Type (dropdown — see "Engineering - Reference Lists"), Deadline, Assigned Engineers, Description.

3. Each discipline sub-tab must include a **"Send for Approval"** action next to the Status field, to move that discipline's work from **Under Discussion** into the approval workflow.

4. Each discipline sub-tab must have its own **Tasks** section, with an **"Add Task"** (library_add icon) control to create discipline-specific tasks and a kebab menu (⋮) for task-level actions.

5. Each discipline sub-tab must have its own **Files** section with an **"Add File"** action, scoped to that discipline only.

6. Each discipline sub-tab must have its own **Conversations** section with a **"Start New Conversation"** action, scoped to that discipline only.

7. Each discipline sub-tab must include a collapsible **History** section logging changes made within that discipline.

8. At project creation, the user may pre-select which discipline sub-tabs are needed via **"Add Engineering Tasks"** (see "Engineering - Add New Project"); disciplines not selected must not appear as sub-tabs until added later.

9. Tasks created under a discipline here must also appear in the project's top-level **Tasks** tab and in the global **Engineering Task** module (see "Engineering - Task Tracker"), tagged with their originating discipline.
