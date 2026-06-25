#### **USER Story:**

**As a user,**
**I want to** view all claims in a paginated, searchable listing table
**So that** I can quickly locate, review, and act on any claim record without navigating individual overlays.

---

#### **acceptance criteria:**

1. The Claims listing page must be accessible from the main navigation under **"Claims"**.

2. The listing table must display the following columns in order:

   | **Column** | **Content** | **Notes** |
   | --- | --- | --- |
   | Claim No | Claim number (e.g. CLM-2024-001) | Clickable — opens Edit overlay; styled in blue with underline on hover |
   | Claim Context | Badge — **Standalone** (purple) / **Incident Related** (blue) | |
   | Linked Incident | Incident number with a shield icon when linked; dash when none | |
   | Type of Claim | Claim type value | |
   | Type of Cover | Type of cover value; dash if not set | |
   | Broker | Broker name; dash if not set | |
   | Leading Insurer | Insurer name; dash if not set | |
   | Date of Incident | Date string; dash if not set | |
   | Date of Notif. | Date of notification to broker; dash if not set | |
   | Claim Estimate | Formatted amount with currency (e.g. 45,000 USD); dash if zero | Right-aligned |
   | Claimant | Claimant name; dash if not set | |
   | Description | Short claim description; truncated with ellipsis if too long | |
   | Status | Badge — **Open** (blue) / **Close** (green) | |
   | Addl. Ins. | Yes / No / dash depending on additional insurance flag | Centred |
   | Actions | Kebab menu icon (⋮) | Sticky right column |

3. Clicking anywhere on a row (except the kebab Actions cell) must open the **Edit Claim** overlay for that record.

4. A **quick filter tab bar** must appear above the table with the following tabs: **All | Open | Close**. The active tab must be highlighted. Selecting a tab filters the listing by Claim Status.

5. A **"New Claim"** button must appear in the top-right of the action bar. Clicking it opens the **Add Claim** overlay.

6. The listing must show a **record count** at the bottom (e.g. "Found 7 records — 7 of 12 total").

7. When no records match the current search or filter, an empty state must be displayed with a search icon and the message **"No claims found"**.

8. The table must be horizontally scrollable when the viewport is too narrow to show all columns.
