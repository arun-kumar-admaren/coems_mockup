#### **Fixture Report - Report Name Edit**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a User,**
**I should be able to** edit the name of a **Fixture Report** from the **Report Page** by clicking the edit (pen) icon
**So that** I can update or correct the report name without creating a new report.

> Follows **PCER - Report Name Edit (COEMS-13204)**. The name can also be changed in the **Edit Fixture Report** pop-up (see **Fixture Report - Edit & Update Report**); this story is the quick way, directly on the report page.

---

#### **acceptance criteria:**

1. **Display**

   The **Fixture Report name** must be displayed on the Report Page, in the header, along with a **pen (edit) icon**.

2. **Who sees the pen icon**

   The **pen icon** must be visible and accessible **only to users who have edit permissions** for the report: the owner, and users the report is shared with as **Edit** (see **Fixture Report - Share Functionality**). A user with **View** permission sees the name without the pen icon.

3. **Editing the name**

   When the user clicks the **pen icon**:

   * The report name must become **editable** (an inline text field).
   * The existing report name must be **pre-filled** in the editable field.
   * The user must be able to:
     * **modify** the report name, and
     * **save** the updated name by **clicking anywhere on the screen** outside the field. Pressing the **Enter** key does **not** save the name: the name is saved only by clicking outside the field.

4. **Once saved**

   * The updated report name must be **immediately reflected** on the Report Page.
   * The new name must also be shown in the **report's tab**, in the **Name column of the Reports listing**, and in the **Report Name** field of the **Edit Fixture Report** pop-up.
   * **Modified By** and **Modified On** of the report in the listing must show the user who changed the name and the date.
   * Nothing else in the report changes: the table, the charts, the pivot tables and the sharing stay as they are.
   * **No confirmation message** is shown: the name just changes on the page.

5. **Cancel, or no change**

   * If the user **cancels the edit** (by pressing the **Esc** key), the report name must **revert to the original value**, and **no changes are saved**.
   * If the user clicks outside the field **without having changed the name**, nothing is saved, and Modified By and Modified On do not change.

6. **Validation**

   * The report name **must not be empty**. A name made only of spaces counts as empty.
   * While the field is empty, the inline message **"Report Name cannot be empty"** must be shown in red under the field (the field is marked **Name \***).
   * An empty name must **not be saved**: if the user clicks outside while the field is empty, the report name must **revert to the original value**.
   * There is **no maximum length** rule, and **two reports may have the same name**.

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Fixture Report page → header | Report name with a **pen (edit) icon**, shown to users with edit permission; inline editing |
| Report tab, Reports listing | Show the new name; Modified By / Modified On updated |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type.

---

#### **Out of Scope:**

* Renaming a report from the **Reports listing** page.
* Changing the name in the **Edit Fixture Report** pop-up (see **Edit & Update Report**).
* Renaming a chart or a pivot table.

---

#### **To be confirmed:**

* **Decided 2026-11-05:**
  * Clicking **anywhere outside the field saves** a changed, valid name. (The PCER story is unclear here: it also says the name reverts "if the user cancels the edit or clicks outside without saving".)
  * **Enter does not save** the name.
  * **No maximum length** rule, **duplicate names are allowed**, and **no confirmation message**.
  * The message for an empty name is **"Report Name cannot be empty"**, as shown on the PCER screen.
* **Cancelling the edit.** The PCER story speaks of cancelling but does not say how. Proposed default: the **Esc** key cancels (AC 5).
* **Empty name and clicking outside.** The PCER screen shows the message while the field is empty. Proposed default: clicking outside an empty field returns the original name (AC 6). Confirm.
* **Archived reports.** Whether the name of an archived report can be edited. Proposed default: no, as the report is read-only until it is unarchived.

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads.

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
