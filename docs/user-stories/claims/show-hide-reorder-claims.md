#### **USER Story:**

**As a user,**
**I want to** show, hide, and reorder columns in the Claims listing table
**So that** I can customise the view to display the information most relevant to my role without being overwhelmed by all available columns.

---

#### **acceptance criteria:**

1. A **column settings control** (e.g. a grid/column icon button) must be accessible from the action bar of the Claims listing page.

2. Clicking the control must open a panel or popover listing all available columns with toggle checkboxes.

3. The following columns must be available for show/hide:

   | **Column** | **Default Visibility** |
   | --- | --- |
   | Claim No | Always visible (cannot be hidden) |
   | Claim Context | Visible |
   | Linked Incident | Visible |
   | Type of Claim | Visible |
   | Type of Cover | Visible |
   | Broker | Visible |
   | Leading Insurer | Visible |
   | Date of Incident | Visible |
   | Date of Notif. | Visible |
   | Claim Estimate | Visible |
   | Claimant | Visible |
   | Description | Visible |
   | Status | Visible |
   | Addl. Ins. | Visible |
   | Actions | Always visible (cannot be hidden) |

4. Users must be able to **reorder** columns by dragging column headers or by using up/down controls in the settings panel.

5. The column configuration must persist for the session. On next login, columns reset to default visibility and order.

6. The **Actions** and **Claim No** columns must always remain visible and cannot be toggled off.
