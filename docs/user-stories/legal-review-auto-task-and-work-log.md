#### **USER Story:**

**As a Legal or Chartering user working on a review,**
**I want** every review to get one task automatically, named after the review number, with an "Add work log" option on that task in the review's task list instead of an "Add Task" button, and the Legal Review tasks protected in the Tasks module so that none can be created by hand, deleted, duplicated or moved to another record
**So that** I can log the time I spend on a review in a few clicks without setting up tasks, every review has exactly one task to log against, and that task cannot be removed, copied or added to by mistake.

> Update to the time-tracking approach agreed with Lena Pickenpack and Lukas Krag (UHL) on the 27.10.2026 call. Lena's need: no extra task setup, just a simple way to log "today I worked on this for 2 hours" inside the review, so that Legal can track time per review for its KPIs.
>
> The call agreed: one task created automatically per review, the Add Task button switched off, and an "Add new work log" button with a log history in the review. This story **changes two things** from that agreement:
>
> * The task is **not hidden** in the review. It stays as the only row in the review's task list, and the "Add work log" option sits on that row.
> * The review does **not list the logs**. To see the logged hours and entries, the user opens the task's Edit overlay, which already shows them.
>
> Refines [tasks-and-subtasks-legal-review.md](tasks-and-subtasks-legal-review.md) (the Task section of the review) and builds on [hide-subtask-legal-review-tasks.md](hide-subtask-legal-review-tasks.md) (no subtasks on Legal Review tasks). The Tasks module is the **Task** entry under **Management** in the sidebar ([chartering-sidebar-cleanup.md](chartering-sidebar-cleanup.md)).

---

#### **acceptance criteria:**

1. **One task is created automatically for every review**

   * When a review is created, the system creates **one task** and links it to the review: **Related to = Legal Review**, and the **Legal Review** field of the task is this review.
   * The task **name is the review number**, for example `UHL-L-2026-012`.
   * **The name follows the number.** If the review number changes later, the name of the task changes to the new number automatically.
   * The **Name is read-only** on a Legal Review task, in its Edit overlay and anywhere else the task can be edited. Only the system changes it.
   * **The name is the only value this story sets.** Every other field of the task takes the default it has on the Add New Task form today (for example Priority = Medium, Status = To Do) or stays empty. Nothing else is copied from the review.
   * The task appears in the **Tasks** section of the review's Edit overlay. That section is still available in Edit mode only, not while the review is being created.
   * Every new review gets exactly one task. Creating a review never creates a second one.

2. **No "Add Task" option in the review**

   * The **Add Task** button is **removed** from the Tasks section of the review's Edit overlay. It is not hidden or disabled.
   * The "+" add-subtask button on the task row stays removed, as in the existing story for Legal Review tasks.
   * The row itself still opens the task's Edit overlay when it is clicked, as today.

3. **"Add work log" on the task row**

   * Every task in the review's Tasks section has an **Add work log** option on its row.
   * It is available to everyone who can open the review in Edit mode, **Legal and Chartering users alike**.
   * Clicking it opens the **Time Tracking** popup. It does not open the task's Edit overlay. Clicking anywhere else on the row still opens the overlay.
   * The popup holds:

     | **Field** | **Type** | **Behaviour** |
     | --- | --- | --- |
     | Time Spent | Free text, mandatory | Format hint under the field: `2w 4d 6h 45m` |
     | Date Started | Date and time picker, mandatory | Filled with the current date and time (`dd/mm/yyyy, hh:mm:ss`). The user can change it |
     | Work Description | Multi-line text, mandatory | Describes the work done |
     | Save / Cancel | Buttons | Save adds the log. Cancel closes the popup and adds nothing |

   * The popup's existing rules for the time format and for the mandatory fields apply. This story adds no new rules.
   * On **Save**, the log is added to the task for the logged-in user, the popup closes, and the review's Edit overlay stays open.
   * A task can have any number of logs. Each Save adds one.

4. **Viewing the logged hours**

   * The review does not show a list of logs, and no total of the hours.
   * To see the logged hours and the entries (user, date, time spent, description), the user clicks the task row and reads them in the task's Edit overlay. This is the **existing** behaviour of that overlay. This story builds no new view.
   * A log added through the review's popup is the same as a log added to the task anywhere else. It appears in the task's overlay straight away and is available to anything that reads task logs.

5. **Delete task and Duplicate task are disabled for Legal Review tasks**

   * In the **Task** listing under **Management**, for every task whose **Related to is Legal Review**, the **Delete task** and **Duplicate task** options of the row are **disabled**: visible, greyed out, and they do nothing when clicked.
   * In the **task's Edit overlay**, the **Delete** and **Duplicate** options are disabled in the same way, wherever the overlay is opened from: the Tasks listing under Management, or the Tasks section of the review.
   * Tasks with any other Related to keep both options enabled and behave as today.
   * It makes no difference how the task was created (automatically by this story, or by a user earlier). The rule follows the task's Related to.

6. **No task can be created for a Legal Review by hand, and a Legal Review task cannot be moved**

   * In the Tasks module, the **Add New Task** form's **Related to** dropdown no longer offers **Legal Review**. The other options stay (Fixture and Scope). The "Select Legal Review" field is therefore never shown when adding a task.
   * The same applies when the Related to of an existing task is edited: Legal Review cannot be chosen.
   * On a task that has **Related to = Legal Review**, the **Related to** field and the **Legal Review** field are **read-only** in the task's Edit overlay, wherever it is opened from. The task cannot be moved to Fixture or Scope, or to another review. It keeps showing Legal Review and the review's number.
   * The only way a Legal Review task comes into being is the automatic task of criterion 1.

7. **Everything else stays**

   * The Task Detail Overlay, its fields and tabs are unchanged for Legal Review tasks, apart from the disabled Delete and Duplicate options, the read-only Name, Related to and Legal Review fields, and the removal of the subtask section in the existing story.
   * The task list columns in the review stay as they are.
   * The Tasks section stays unavailable while a review is being created.

8. **Every review, no data migration**

   * **Add work log** appears on every task row of every review, and **Add Task** is removed for all reviews.
   * The Legal Review module is not in production yet, so there is no live data to convert. Reviews and tasks that exist only on test environments are not migrated: no task is created for a review that has none, and no task is renamed to its review number.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Legal Review → create | One task is created automatically, named after the review number, Related to = Legal Review; no other field is set |
| Legal Review → review number changes | The task name follows the new number; the name is read-only on the task |
| Legal Review → Edit overlay → Tasks section | Add Task removed; Add work log added on each task row; no log list |
| Time Tracking popup | Opens from the task row; Time Spent, Date Started, Work Description |
| Tasks module (Management) → Task listing | Delete task and Duplicate task disabled for tasks related to a Legal Review |
| Task Edit overlay | Delete and Duplicate disabled, and Name, Related to and Legal Review field read-only, for Legal Review tasks; otherwise no change; it is where the logged hours are viewed |
| Tasks module → Add New Task form | "Legal Review" no longer offered in Related to |

---

#### **Out of Scope:**

* The work-log overview for reviews (group view with date range, office, group and user filters, and grouping). Separate story.
* The elapsed duration from created to completed that Lena asked for. Still open with the client.
* A log history or a total of the hours inside the review.
* Allowing more than one task per review in future.
* Adding a work-log option to the Tasks listing under Management.
* What happens to the task when a review is archived or deleted.
* Archive and multi-select actions on Legal Review tasks.
* Subtasks on Legal Review tasks (existing story) and any change to the Task Detail Overlay beyond Delete, Duplicate and the read-only Name, Related to and Legal Review fields.

---

#### **Open Points:**

None. Every point raised on the first draft has been decided.
