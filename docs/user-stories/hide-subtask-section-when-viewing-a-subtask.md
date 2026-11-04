#### **USER Story:**

**As a user viewing a Subtask's own Detail Overlay,**
**I want to** no longer see the "Sub Tasks" section on it
**So that** the overlay doesn't imply a subtask can itself have subtasks, which isn't a real thing in the task hierarchy.

> Refines the general Task/Subtask feature (see [tasks-and-subtasks-legal-review.md](tasks-and-subtasks-legal-review.md) and [hide-subtask-legal-review-tasks.md](hide-subtask-legal-review-tasks.md), which narrow the same "Sub Tasks" section for a different reason). This story applies the same removal for a different condition: **the record currently open is itself a subtask** — evidenced in the Engineering module's Task Detail Overlay (Task No breadcrumb `ETSK-1916 / ETSK-1965`, with `Parent Task: ETSK-1916` shown in the right-hand panel), but the Task Detail Overlay is shared infrastructure, so the same logic applies everywhere it's used.

---

#### **acceptance criteria:**

1. **Current state (bug)**

   Opening a subtask's own Detail Overlay — a task record that already has a **Parent Task** — still shows the full **"Sub Tasks"** section on the left panel: heading, **"+"** add button, and the **"No subtask found!"** placeholder when empty. This is logically incorrect: a subtask cannot itself have subtasks, so there's nothing this section could ever meaningfully show or add.

2. **Fix**

   Whenever the task record currently open **has a Parent Task** (i.e., it is itself a subtask), the entire **"Sub Tasks"** section — heading, **"+"** button, and the "No subtask found!" placeholder — must be **removed from the Detail Overlay** entirely, not shown at all, not shown-but-disabled.

3. **Top-level tasks are unaffected**

   A task with **no** Parent Task (a genuine top-level task) continues to show the "Sub Tasks" section exactly as today — this change only removes it from a subtask's own overlay, not from the parent task's overlay that lists it.

4. **Applies wherever a subtask's Detail Overlay can be opened from**

   This is a property of the record itself (does it have a Parent Task or not), not of which screen it's opened from — the section must be hidden identically whether the subtask is opened from its parent task's subtask list, from a general task listing page, or via a direct link.

5. **No change to other fields on the overlay**

   All other fields on a subtask's Detail Overlay — Labels, Priority, Status, Is Flagged, Start/Due Date, Reporter, Parent Task, Assignee, Time Tracking, Weightage, Effective Time, Estimation — are unaffected by this change.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Task Detail Overlay → left panel | Hide the entire "Sub Tasks" section when the open record has a Parent Task |

---

#### **Out of Scope:**

* The Sub Tasks section on a genuine top-level task's own overlay — unchanged.
* The separate, already-tracked removal of subtasking for Legal Review–originated tasks specifically ([hide-subtask-legal-review-tasks.md](hide-subtask-legal-review-tasks.md)) — that's a different condition (task origin) from this one (whether the record itself is a subtask).
* Any other field or section on the Detail Overlay.
