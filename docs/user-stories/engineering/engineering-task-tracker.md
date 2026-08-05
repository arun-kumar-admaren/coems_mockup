#### **USER Story:**

**As a user,**
**I want to** see every Engineering Task across all projects in one tracker, in both list and board form
**So that** I can manage my personal workload or the team's workload without opening each project individually.

---

#### **acceptance criteria:**

1. The **Engineering Task** sidebar item must open a module-wide task tracker, independent of any single Engineering Project.

2. A view-mode bar must offer: **My Task | All Tasks | List | Kanban | Archived**.

3. **My Task** must show only tasks assigned to the current user; **All Tasks** must show every task across every project the user has access to; **Archived** must show tasks that have been archived off the active board.

4. The **List** view must show a table with columns: ID, Number (e.g. `ETSK-6376`), Name, Description, Status, Priority, Start Date, Due Date, Reporter, Assignee, Time Logged, Cumulative Time, WIP/Usage %, Is Flagged.

5. The **Kanban** view must show a board with columns **Todo | In Progress | Review | Done**, and each card must show the task name, linked Engineering Project number, discipline (Engineering Type), assignee avatar, and a completion checkmark when Done.

6. The Kanban board must support a **"Group By"** control with at least: Task, Assignee, Sub Task.

7. An **"Add Task"** button must let the user create a new task from the tracker; when created this way, the user must select which Engineering Project (and discipline) the task belongs to.

8. **Search** and **Add Filter** controls must be available in both List and Kanban views to narrow tasks (e.g. by project, assignee, status, priority).

9. Dragging a card between Kanban columns must update that task's Status immediately, and the change must be reflected in the task's originating project (see "Engineering - Tasks Tab" and "Engineering - Engineering Tasks Tab").
