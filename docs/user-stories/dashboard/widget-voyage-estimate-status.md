#### **USER Story:**

**As a user,**
**I want to** add a **Voyage Estimate Status** widget to my dashboard with a single click, showing a list of voyage estimates that I can filter by ownership and by status
**So that** I can see where my voyage estimates stand, and track them through to transfer, without leaving the dashboard.

> Part of **"Customisable Dashboard Widgets"** (the My Dashboard tab of the platform-wide Dashboard shows widgets instead of fixed sections). This story covers the **Voyage Estimate Status** widget only. The behaviour common to every widget (default minimum size, resizing within limits, moving, Refresh, Delete, per-user persistence, no overlap) is defined there and applies here too.

---

#### **acceptance criteria:**

1. **Adding the widget**

   * The **Add Widget** list on the My Dashboard tab must include **Voyage Estimate Status**.
   * When the user clicks it, a box listing voyage estimates must be **added to the dashboard directly** as a widget, with no pop-up and no configuration step.
   * The new widget must appear at its **default minimum size**, without overlapping any other widget.

2. **List of voyage estimates**

   * The widget must show a **list of voyage estimates**.
   * The list must **scroll** inside the widget when it does not fit. There is no paging.
   * The list must show these columns: **Estimate Number**, **Estimate Name**, **Vessel Name**, **Status**, **Created By**.
   * Clicking an **Estimate Number** must open that Voyage Estimate's record.

3. **Ownership filter: Mine / Office / All**

   * The widget must have a filter group with three options: **Mine**, **Office** and **All**. Exactly one is active at a time.
   * The options must show:

     | **Option** | **Voyage estimates shown** |
     | --- | --- |
     | Mine | Those **created by the logged-in user** |
     | Office | Those created by users in **every office the logged-in user belongs to** |
     | All | All voyage estimates |

   * If the logged-in user belongs to more than one office, **Office** must include the estimates created by users in all of those offices.
   * Selecting an option must update the list straight away.
   * The default option must be **Mine**.

4. **Status dropdown**

   * The widget must have a **Status** dropdown with exactly these values: **All**, **Preplanning**, **Firm**, **Ready to Transfer**, **Transferred**.
   * The default must be **All**, which shows estimates in every status.
   * Selecting a status must list only the voyage estimates currently in that status.

5. **Filters work together**

   * The ownership filter and the Status dropdown must apply **at the same time**. For example, **Office** with **Firm** shows only the Firm estimates created by users in any office the logged-in user belongs to.

6. **No matching estimates**

   * When no voyage estimate matches the current filters, the widget must show an empty state instead of an empty list. [The wording was not specified. Proposed: "No voyage estimates found".]

7. **Disabled in "Add Widget" once added**

   * Once Voyage Estimate Status is on the dashboard, its option in **Add Widget** must be **disabled**, so only one Voyage Estimate Status widget can exist.
   * If the widget is deleted, the option must become **enabled** again.

8. **Not shown by default**

   * This widget must **not** be part of the default dashboard. A user adds it from **Add Widget**.

9. **Refresh**

   * The widget header must show a **Refresh** icon. Clicking it must reload the list, keeping the currently selected ownership option and status.
   * Refresh must not change the widget's size or position, and must not reload any other widget.

10. **Resize and move**

    * The user must be able to increase or decrease the widget's size within the defined limits, and must not be able to reduce it below its minimum allowed size.
    * At minimum size, the Mine / Office / All options and the Status dropdown must remain usable. The list scrolls inside the widget when it does not fit.
    * The user must be able to move the widget by dragging it, in the same way as the existing COEMS widgets can be moved. The other widgets must shift so that nothing overlaps.

11. **Delete and persistence**

    * The widget must have a delete control that removes it from the dashboard. The remaining widgets must adjust so that no gap or overlap is left.
    * Deleting must behave as deleting the existing COEMS widgets does, including whether a confirmation is asked.
    * Whether the widget is on the dashboard, and its position and size, must persist for the user across sessions.

12. **Filters are stored**

    * Once the widget is added to the dashboard, the ownership option and the status the user selects must be **stored** for the user and restored in later sessions.
    * A newly added widget starts at **Mine** and **All**. If the widget is deleted and added again, it starts from these defaults again.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| My Dashboard → Add Widget | New **Voyage Estimate Status** entry; added in one click |
| My Dashboard → Voyage Estimate Status widget | List of voyage estimates with a Mine / Office / All filter and a Status dropdown (All, Preplanning, Firm, Ready to Transfer, Transferred), in a resizable, refreshable, deletable widget |

---

#### **Out of Scope:**

* Creating, editing, copying or deleting a voyage estimate from the widget.
* Changing an estimate's status from the widget.
* Any status value other than the four listed, and any filter other than Mine / Office / All and Status.
* The **Group Worklog Dashboard** tab.

---

#### **To be confirmed:**

* Whether the filters are saved as soon as the user changes them. Proposed: yes, automatically.
