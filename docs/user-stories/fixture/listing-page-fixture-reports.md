#### **Fixture Report - Reports Main Listing Page (including Make a Copy)**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a User,**
**I should be able to** view the list of **Fixture Reports** created by myself or others, including archived ones, and make a copy of an existing report
**So that** I can create, access, modify and manage the Fixture Reports, and reuse an existing report as my own without changing the original.

> Follows **PCER - Reports Main listing Page (COEMS-13178)** and **Reports - Add "Copy" (COEMS-22856)**, combined into one story for the **Fixture Report**. The Fixture Report is a new report type on the same **Reports** listing page that already lists Port Call Evaluation Reports, Fleet Plans and Budget Reports. Creating a Fixture Report is in the story **Fixture Report - Create New Fixture Report**.

---

#### **acceptance criteria:**

As a User, I should be able to perform the following functionalities:

1. **View the list of Fixture Reports**

   * The user should be able to view the list of **Fixture Reports**, together with the Port Call Evaluation Reports, Fleet Plans and Budget Reports, on the Reports listing page.
   * A Fixture Report must appear in the list as soon as it is created, with **Type = Fixture Report**.
   * Opening a Fixture Report from the list must open it in its own tab, as it does after it is created.

2. **Search Reports**

   * This should be a **Search** field.
   * The user should be able to search the reports created by them, as well as other reports to which they have access, by entering the **Name / keyword** of the report. This includes Fixture Reports.

3. **View own Reports and Reports shared by others**

   * This should be a group button with the options **'Mine'** and **'Others'** in the header section.
   * When the user clicks **'Mine'**, they should be able to view the reports created by them.
   * When the user clicks **'Others'**, they should be able to view the reports shared by others with the user.
   * By default, the system should show the user's last opened option, **'Mine' / 'Others'**.

4. **Tabs in the header section**

   * In the header section, **All Reports**, **Currently Opened Reports** and **Previously Opened Reports** should be shown as tabs.

5. **View Archived Reports**

   * This should be a toggle button named **'Archived'** in the header section.
   * When the user enables **'Archived'**, they should be able to view the list of archived reports.
   * The system should display the archived reports of the user when **'Mine'** is selected, and the archived reports of others when **'Others'** is selected.

6. **Archive Report**

   * This should be an option named **'Archive Selected Report'** in the **kebab menu** located in the header section.
   * The option should be enabled only when an item is selected from the report list.
   * After selecting reports from the list, the user should be able to archive them by clicking **'Archive Selected Report'**.
   * Once clicked, a **confirmation pop-up** should be displayed.

7. **Unarchive Report**

   * This should be an option named **'Unarchive Selected Report'** in the kebab menu located in the header section.
   * The option should be enabled only when an item is selected from the archived report list.
   * After selecting reports from the archived list, the user should be able to unarchive them by clicking **'Unarchive Selected Report'**.
   * Once clicked, a **confirmation pop-up** should be displayed.

8. **Make a Copy**

   * **Option:** a **'Make a Copy'** option must be available in the kebab menu of the Reports screen. It must be positioned **immediately after 'Unarchive Selected Report'**.
   * **Default state:** the option must be **disabled** by default, when no report is selected.
   * **Single selection:** the option must be enabled **only when exactly one report is selected**. A report can be copied only one at a time.
   * **Multiple selection:** when more than one report is selected, the option must remain disabled. This applies to every report type: Fleet Planner, Budget Report, PCER and **Fixture Report**.
   * **Copy creation:** when the user clicks **'Make a Copy'** on a Fixture Report, the system must create a **new line item** in the list:
     * The copy must get a **new unique ID** and **Type = Fixture Report**.
     * The copy must keep the **same data and configuration** the original had at the time the copy is made: Report Name (see To be confirmed), Based on, Date Range, Convert to (currency), the selected columns, and all its charts and pivot tables with their settings.
     * The copy must be **my own report**: Created By is the user who made the copy, Created On is the date of the copy, and it must be listed under **'Mine'**, at the top of the list (see AC 9).
     * The copy must be a **separate report** from the original.
     * The copy must **not carry forward the Share access details**. It is a fresh report and the user configures the sharing manually.
   * **Independent editing:** the user must be able to edit the copied report independently.
     * Changes made to the copy (its fields, its charts, its pivot tables) must not change the original.
     * Changes made to the original after the copy is created must not change the copy.

9. **List of Reports**

   The user should be able to view the reports in a table format with the following columns:

   | **Column** | **Description** |
   | --- | --- |
   | ID | Unique ID of the report (a copy gets its own new ID) |
   | Name | Name of the report |
   | Type | Type of the report: **Port Call Evaluation Report / Budget Report / Fleet Plan / Fixture Report** |
   | Created By | Owner of the report |
   | Created On | Date of creation of the report |
   | Modified By | Last modified user |
   | Modified On | Last modified date |

   The reports should be shown in **descending order**, with the latest created report on top.

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Reports listing page | **Fixture Report** shown as a report type; Search, Mine / Others, header tabs and Archived toggle apply to it |
| Kebab menu | **Archive Selected Report** and **Unarchive Selected Report** work for Fixture Reports; new option **Make a Copy** (for all report types, one report at a time) |
| List table | Type value **Fixture Report** added |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type, so no existing reports change. The existing Port Call Evaluation Reports, Fleet Plans and Budget Reports keep their listing behaviour; **Make a Copy** is the same option for all of them.

---

#### **Out of Scope:**

* Creating a Fixture Report (see **Create New Fixture Report**), and editing, refreshing or sharing one.
* The content of a Fixture Report (table, charts, pivot table).
* Deleting reports permanently.
* Making a copy of several reports at once.
* Copying the Share access of the original.

---

#### **To be confirmed:**

* **Name of the copy.** The Make a Copy story does not say. Proposed default: **"Copy of <original name>"**, which the user can change by editing the report.
* **Data of the copy.** A Fixture Report's table is generated from the fixture data. Proposed default: the copy keeps the original's fields and charts, and its table is generated from the **current** fixture data when the copy is opened or refreshed (not a frozen snapshot).
* **Copying a report that belongs to someone else.** The story says "use the copied report as my own". Proposed default: Make a Copy is available for reports in **'Others'** too, and the copy is owned by the user who copied it.
* **Copying an archived report.** Proposed default: Make a Copy is available in the **Archived** list too, and the copy is **not** archived.
* **Confirmation for Make a Copy.** Archive and Unarchive ask for confirmation; the Make a Copy story does not. Proposed default: no confirmation, because nothing is changed or lost.
* **The ID column.** The earlier listing story lists six columns (Name to Modified On), but the live Reports listing also shows an ID column, and the Make a Copy story gives the copy a "new unique ID". This story therefore lists ID. Confirm.
* **Selection.** The earlier stories speak of "selecting" reports in the list. Confirm that this is a checkbox on each row, and whether selected rows stay selected when the user changes between Mine / Others or switches Archived on or off.

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads.

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
