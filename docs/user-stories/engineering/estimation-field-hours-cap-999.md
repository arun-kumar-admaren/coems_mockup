#### **USER Story:**

**As a user entering an Estimation on a Task or Subtask,**
**I want to** be able to enter up to 999 hours in the hours (h) component
**So that** I can log a large effort estimate in hours without the field wrongly rejecting it as an invalid format.

> Corrects the Estimation field defined in **COEMS-15067 "Engineering - Implement Estimation for tasks"**. Currently, entering an hours value of 100 or more (e.g. `100h`, `130h`) triggers the field's format validation message — *"You need to log time in the format 2w 4d 6h 45m"* — even though the entry is a syntactically valid hours-only value. The field only accepts a 2-digit hours component (0–99) today; it needs to accept a 3-digit component (0–999).

---

#### **acceptance criteria:**

1. **Current behaviour (bug)**

   Entering `100h`, `130h`, or any hours value of 100 or greater into the Estimation field shows the format-validation error (*"You need to log time in the format 2w 4d 6h 45m"*), incorrectly treating a valid hours-only entry as malformed.

2. **Fix**

   The hours (`h`) component of the Estimation format must accept any value from **0 up to 999** (3-digit), not just 0–99 as today. Values like `100h`, `500h`, and `999h` must be accepted without triggering the format-validation error.

3. **Applies everywhere Estimation appears**

   * Task Add overlay
   * Task Edit overlay
   * Subtask Add overlay
   * Subtask Edit overlay

4. **Upper bound**

   An hours value of **1000 or greater** should still trigger the format-validation error — 999 is the new maximum, not an unbounded value.

5. **No other change to the format**

   * The weeks (`w`), days (`d`), and minutes (`m`) components keep their existing accepted ranges — this story only widens the hours component.
   * Multi-unit entries combining hours with other units (e.g. `2w 4d 130h 45m`) must validate consistently with the new 0–999 hours range.
   * Every other acceptance criterion in COEMS-15067 — mandatory validation, Cumulative Estimation auto-population, listing/export columns, template/duplicate behaviour — is unaffected by this change.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Task Add/Edit overlay → Estimation field | Accept hours component 0–999 instead of 0–99 |
| Subtask Add/Edit overlay → Estimation field | Same |

---

#### **Out of Scope:**

* Any other field, validation, or behaviour defined in COEMS-15067.
* Changing the accepted range of the weeks, days, or minutes components.
