#### **USER Story:**

**As a user,**
**I want to** edit an existing legal review by updating its details
**So that** legal reviews remain accurate and up to date throughout their lifecycle.

#### **acceptance criteria:**

1. An Edit Review overlay should be available for the user when clicking on an existing review record from the Legal Review listing page.

2. The overlay must open pre-populated with all previously saved field values.

3. The Overlay should have the following functionalities:
   1. | **Field Name** | **Values** | **Validations** | **Visibility Condition** | **Comments / Dependencies** |
      | --- | --- | --- | --- | --- |
      | Review No | Auto-generated (e.g., REV-2026-0001) | Read-only | Always visible | Not editable |
      | Related To | Searchable multi-select field | Optional | Always visible | Pre-populated with previously saved linked records. User can search and select any Inquiry, Fixture, or Scope record. Helper text shown: *"Select Inquiry / Fixture / Scope"* |
      | Review Type | Documents, NDA | Mandatory | Always visible | Enables Save button when filled |
      | Description | Free text | Optional, Max 10,000 chars | Always visible | Character counter displayed |
      | Legal Review Status | To be reviewed by Legal, Under Review, Reviewed, Not Required | Mandatory | Always visible | Enables Save button when filled |
      | E Filing Number | Alphanumeric free text | Optional, Max 50 chars | Always visible | Non-alphanumeric characters are silently stripped on input |
      | Due Date | Date picker | Optional | Always visible | No date constraints |
      | Review Raised By | Dropdown (user list) | Optional | Always visible | Single select from system user list |
      | To Be Reviewed By | Dropdown (user list) | Optional | Always visible | Single select from system user list |
      | Created Date | Date | Read-only | Always visible | Set at creation, not editable |

   ### **Related To Field Behaviour**

   * The **Related To** field is a single searchable input — there is no separate "Items" field.
   * On opening the Edit overlay, the field is pre-populated with all previously linked records shown as colour-coded chips:
     * Inquiry — blue
     * Fixture — violet
     * Scope — orange
   * The user can remove existing linked records by clicking the × on a chip.
   * Typing in the search input filters across all Inquiry, Fixture, and Scope records simultaneously.
   * Additional records can be selected from the dropdown and will appear as new chips.
   * Searching by category keyword (e.g. "Fixture") shows all records of that type.

   ### **Action Fields**

   | **Field Name** | **Values** | **Validations** | **Visibility Condition** | **Comments** |
   | --- | --- | --- | --- | --- |
   | Save Changes | Button | Enabled only when Review Type AND Legal Review Status are both filled | Always visible | Saves all edits |
   | Cancel | Button | No validation | Always visible | Closes the overlay without saving |

4. **Button Enable Logic:**
   * The **Save Changes** button must remain disabled until the following mandatory fields are filled:
     * Review Type
     * Legal Review Status

5. Clicking **Cancel** closes the overlay without saving any pending changes. No confirmation is required.

6. Whenever a linked Inquiry, Fixture, or Scope record is removed or deleted from the system:
   * The field values in the edit overlay must **not** be automatically removed.
   * A validation warning must be shown:
     * *"The following linked records are no longer available: [list of affected records]"*
   * This is a **warning only** — the user can proceed and save without updating the fields.
