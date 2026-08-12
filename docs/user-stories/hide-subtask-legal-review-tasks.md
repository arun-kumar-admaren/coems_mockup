#### **USER Story:**

**As a user viewing a Task that was created from a Legal Review,**
**I want to** no longer see any option to add a subtask to it
**So that** Legal Review tasks can't be given subtasks at all — while every other task in the system keeps full subtask functionality unchanged.

> Refines **`tasks-and-subtasks-legal-review.md`** (items 7–8), which documents the general Task/Subtask feature. This story narrows that feature specifically for tasks whose origin is a Legal Review — it does not change subtask behaviour for tasks created anywhere else.

---

#### **acceptance criteria:**

### 1. Current state (for reference)

Per the base story, the **Task Detail Overlay**'s left panel has a **"Sub Tasks"** section with:
* A **"+"** button to add a new subtask directly from the overlay.
* A list of existing subtasks (or "No subtask found!" when there are none).

Separately, the **Task list view** has its own **"+"** button on each task row to add a subtask from the list.

### 2. Remove subtasking entirely for Legal Review–originated tasks

For any Task whose **Related to** is **Legal Review** (i.e., created via the Task Management section on a Legal Review's Edit overlay):

* The entire **"Sub Tasks"** section (heading, **"+"** button, and the "No subtask found!" placeholder) must be **removed from the Task Detail Overlay** — not shown at all, not shown-but-disabled.
* The row-level **"+"** add-subtask button on the Task list view must also be hidden for these tasks, for consistency — there would otherwise be a way to add a subtask from the list that the detail overlay itself no longer allows.

### 3. Applies wherever the task is opened from, not just inside Legal Review

This is a property of the **task record itself** (its Related to = Legal Review), not of which screen the overlay happens to be opened from. It must be hidden identically in both places a Legal Review–originated task can be opened:

1. **From inside the Legal Review Edit overlay** — clicking the task in its Task Management list.
2. **From the Chartering module's central "Tasks" listing page** — opening the same task record directly from that general list.

If a task was not created from a Legal Review, opening it from the Tasks listing page (or anywhere else) must show the Sub Tasks section and both "+" buttons exactly as documented in the base story — this change is exclusive to Legal Review–originated tasks only.

---

#### **technical details:**

(To be updated by Techleads)

#### **NON-Functional Requirements:**

| Particulars | Name | Date | Comments |
| --- | --- | --- | --- |
| Document Owner | | | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
