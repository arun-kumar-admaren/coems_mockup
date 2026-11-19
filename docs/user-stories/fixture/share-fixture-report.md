#### **Fixture Report - Share Functionality**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a User,**
**I should be able to** share the Fixture Report with other users, to view or edit my report
**So that** I can manage the report collaboratively.

> Follows **PCER - Reports Share Functionality (COEMS-13179)**. The **Share** button is in the header of the Fixture Report page (see **Fixture Report - Create New Fixture Report**). A shared report appears in the **Others** tab of the Reports listing page (see **Fixture Report - Reports Main Listing Page**).

---

#### **acceptance criteria:**

As a User, I should be able to do the following in the Fixture Report:

1. **Share Option UI**

   * A **"Share" button** should be available in the **header section** of each **Fixture Report** page.
   * When clicked, a **pop-up window** should appear with the user selection and permissions described below.

2. **User Selection and Permissions**

   * The **title** of the pop-up: **Share "<Name of the Fixture Report>" to**.
   * A **search box** to search for users by **email or name**.
   * A **list of email IDs with user names** should appear as suggestions while typing.
   * Users can be **selected** from the list.
   * For each selected user, a **permission level** can be set: **View** or **Edit**.

3. **Who Has Access**

   * Once users are added, a section named **"Who Has Access"** should show:
     * a **list of the added users** and their corresponding permissions, and
     * an option to **edit the permission** for any listed user.
   * The **owner's name** should be displayed at the **end of the list** (non-editable).

4. **Sharing Behaviour**

   Once the user shares the report, it should:

   * **Appear in the "Others" tab** of the receiving user's Reports listing page (the reports shared by others), with **Type = Fixture Report**.
   * Be visible and usable **only based on the assigned permission** (View / Edit), as below.

   | **Action** | **Owner** | **Edit** | **View** |
   | --- | --- | --- | --- |
   | Open the report and see the **Reports**, **Charts** and **Pivot Table** tabs | Yes | Yes | Yes |
   | **Refresh** the report | Yes | Yes | Yes |
   | Filter the table, show / hide, reorder and resize its columns (this changes the user's own view only) | Yes | Yes | Yes |
   | Edit the report with the **Settings** icon (name, Based on, Date Range, Convert to, Select required columns) | Yes | Yes | No |
   | Rename the report with the **pen** icon next to its name (see **Fixture Report - Report Name Edit**) | Yes | Yes | No |
   | Create, edit, move, resize and delete **charts** (see **Fixture Report - Report Dashboard**), and create, edit (see **Fixture Report - Edit Pivot Table**) and delete **pivot tables** | Yes | Yes | No |
   | Share the report and change who has access | Yes | No | No |

   * A user with **View** permission must not see an active **Settings** icon, or the options to create or delete charts and pivot tables.
   * Everyone with access sees the **same table**: the report's own Based on, Date Range, currency and columns. The user's own table view (hidden columns, column order, filters, column widths) is **not shared**: one user's changes must not change another user's view.

5. **Visual Indicators**

   In the **header section** of the Fixture Report page, the **icons of the users with access** should be displayed next to the **Share** button.

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Fixture Report page → header | **Share** button; icons of the users with access next to it |
| Share pop-up | User search, View / Edit permission, **Who Has Access** list |
| Reports listing → Others | A shared Fixture Report appears for the receiving user |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type.

---

#### **Out of Scope:**

* Sharing the Port Call Evaluation Report, Fleet Plan and Budget Report (existing behaviour).
* A share link that can be opened without a COEMS login, and sharing with users outside COEMS.
* Notifications to the receiving user (see To be confirmed).
* Sharing a single chart or pivot table.
* Making a copy of a report: the copy does not carry the share access (see **Fixture Report - Reports Main Listing Page**).

---

#### **To be confirmed:**

* **Access to the fixture data.** A Fixture Report holds the fixtures and amounts of **every office**. Sharing it shows that data to the receiving user, even if they cannot see those fixtures on the Fixture List. Confirm that this is acceptable, or that only users who can see the Fixture List (or all offices) can be selected. Proposed default: any COEMS user with access to **Reports** can be selected.
* **Who can share.** The PCER story says "my PCER", so the owner. Proposed default: only the **owner** shares and changes permissions, as in the table of AC 4. Confirm whether a user with **Edit** may also share.
* **Default permission.** Proposed default: **View** for a newly selected user.
* **Removing a user's access.** The PCER story lets the owner **edit** the permission of a listed user, but does not mention removing the user. Proposed default: a **Remove** option next to each listed user. A removed user loses the report from **Others**; if they have it open, they see a message that they no longer have access.
* **Share pop-up buttons.** The PCER story does not name them. Proposed default: **Share** (disabled until a user is added or a permission is changed) and **Cancel**, with a success message after Share.
* **Users in the suggestions.** Proposed default: only active users, not the owner and not users who already have access.
* **Several user icons.** Proposed default: the first few icons, then a **"+n"** icon; hovering an icon shows the user's name and permission.
* **Notification.** The PCER story has none. Proposed default: no e-mail or in-app notification, as in the other report types.
* **Archived reports.** Whether an archived Fixture Report can be shared, and whether archiving by the owner hides the report from the receiving users. Proposed default: archiving hides it for the receiving users too.
* **Edit permission and the layout.** Confirm that a user with **Edit** who changes **Select required columns** changes the report for everyone (the columns are part of the report, not of the user's own view).

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads.

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
