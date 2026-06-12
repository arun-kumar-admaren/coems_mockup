#### **USER Story:**

**As a user,**
**I want to** create and manage tasks and subtasks within a legal review
**So that** I can track and assign actionable work items related to the review.

#### **acceptance criteria:**

1. The **Task Management** section must be available only in **Edit mode** of a Legal Review, not during creation.

2. The Task section must display a list of all tasks linked to the review with the following columns:
   * Name
   * Labels
   * Reporter
   * Start Date
   * Flagged
   * Is Deliverable
   * Timezone
   * Priority
   * Status
   * Assignee
   * Due Date
   * Estimation

3. An **"Add Task"** button must be available to create a new task. Clicking it opens the Task modal.

4. The Task modal should have the following fields:
   1. | **Field Name** | **Values** | **Validations** | **Comments** |
      | --- | --- | --- | --- |
      | Name | Free text | Mandatory | Red underline when empty |
      | Labels | Free text | Optional | |
      | Description | Free text | Optional | |
      | Reporter | Free text | Optional | |
      | Assignee | Free text | Optional | |
      | Start Date | Date picker | Optional | |
      | Due Date | Date picker | Optional | |
      | Flagged | Yes, No | Optional | |
      | Is Deliverable | Yes, No | Mandatory | Red label when not filled |
      | Timezone | Dropdown | Optional | |
      | Priority | Low, Medium, High | Optional | |
      | Status | TODO, IN PROGRESS, DONE | Optional | |
      | Estimation | Free text (e.g., 2w 4d 6h 45m) | Mandatory | Red underline when empty |

5. The Task modal **Save** button must remain disabled until the following mandatory fields are filled:
   * Name
   * Is Deliverable
   * Estimation

6. In **Create mode** of the Task modal:
   * A **"Create Another"** checkbox must be available.
   * When checked, the modal resets after saving and stays open, allowing the user to add another task immediately.
   * When unchecked, the modal closes after saving.

7. **Subtask functionality:**
   * A **"+"** button must be available within each task row.
   * Clicking it opens the Task modal in subtask mode, linked to the parent task.
   * The subtask is saved under the parent task's subtask list.
   * The parent task must automatically expand to show the newly added subtask.
   * Parent tasks must have an expand/collapse toggle to show or hide their subtasks.

8. Clicking on a task row must open the **Task Detail Overlay** with the following sections:

   ### **Task Detail Overlay — Left Panel**

   | **Section** | **Details** |
   | --- | --- |
   | Task Name | Displayed as a heading |
   | Description | Full description text |
   | Sub Tasks | Clickable list of linked subtasks — clicking a subtask opens its own detail overlay |
   | Activity | Tabbed section with Comments, History, and Work Log tabs (empty state placeholders) |

   ### **Task Detail Overlay — Right Panel**

   | **Section** | **Details** |
   | --- | --- |
   | Metadata | Read-only display of: Labels, Priority, Status, Flagged, Start Date, Due Date, Assignee, Estimation, Timezone |
   | Timestamps | Created date and last modified date |

   ### **Task Detail Overlay — Action Buttons**

   | **Button** | **Behaviour** |
   | --- | --- |
   | Refresh | Reloads task data |
   | Watch | Marks the task as watched |
   | Archive | Archives the task |
   | More (⋮) | Additional options menu |
   | Close | Closes the overlay |
