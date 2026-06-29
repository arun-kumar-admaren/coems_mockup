#### **USER Story:**

**As a user,**
**I want to** view all claims in a paginated, searchable listing table
**So that** I can quickly locate, review, and act on any claim record without navigating individual overlays.

---

#### **acceptance criteria:**

1. The Claims listing page must be accessible from the main navigation under **"Claims"**.

2. The listing table must support the following columns. Columns marked **Visible** are shown by default; columns marked **Hidden** are available via the column chooser but hidden by default:

   | **Column** | **Default** | **Source Overlay** | **Content** | **Notes** |
   | --- | --- | --- | --- | --- |
   | Claim No | Visible | Both | Claim number (e.g. CLM-2024-001 / CLM-2024-V01) | Always visible; clickable — opens Edit overlay; styled in blue with underline on hover |
   | Claim Context | Visible | Both | Badge — **Standalone** (purple) / **Incident Related** (blue) | |
   | Linked Incident | Visible | Incident Related | Incident number with a shield icon when linked; dash when none | |
   | Type of Claim | Visible | Incident Related | Claim type value | |
   | Type of Cover | Visible | Incident Related | Type of cover value; dash if not set | |
   | Vessel | Visible | Both | Vessel name; dash if not set | |
   | Voyage | Hidden | Both | Voyage number; dash if not set | |
   | Related Fixtures | Hidden | Both | Comma-separated fixture numbers; dash if none | |
   | Broker | Visible | Incident Related | Broker name; dash if not set | |
   | Broker Reference No | Hidden | Incident Related | Broker's own reference number; dash if not set | |
   | Leading Insurer | Visible | Incident Related | Insurer name; dash if not set | |
   | Date of Incident | Visible | Standalone | Date string; dash if not set | |
   | Date of Notif. | Visible | Incident Related | Date of notification to broker; dash if not set | |
   | Location | Hidden | Standalone | Location at time of incident; dash if not set | |
   | Claimant | Visible | Both | Claimant name; dash if not set | |
   | Claimant Reference No | Hidden | Incident Related | Claimant's own reference number; dash if not set | |
   | PIC Legal | Hidden | Incident Related | Person in charge — legal; dash if not set | |
   | Representative of Claimant | Hidden | Standalone | Name of claimant representative present; dash if not set | |
   | Port Agent | Hidden | Standalone | Port agent (full style); dash if not set | |
   | Description | Visible | Both | Short claim description; truncated with ellipsis if too long | |
   | Damage as Far as Known | Hidden | Standalone | Damage description at time of notification; truncated | |
   | Steps Taken So Far | Hidden | Standalone | Actions already taken; truncated | |
   | Required Assistance | Hidden | Standalone | Yes / No — whether insurance assistance was requested | |
   | Priority | Hidden | Incident Related | Priority value (e.g. High / Medium / Low); dash if not set | |
   | Status Description | Hidden | Incident Related | Free-text status description; truncated | |
   | Liability Position | Hidden | Incident Related | Liability position value; dash if not set | |
   | Recovery Right Exists | Hidden | Incident Related | Yes / No / dash | Centred |
   | Recovery Against | Hidden | Incident Related | Party the recovery is against; dash if not set | |
   | Recovery Route | Hidden | Incident Related | Recovery route value; dash if not set | |
   | Liability Assessment Notes | Hidden | Incident Related | Free-text notes; truncated | |
   | Claim Estimate | Visible | Both | Formatted amount with currency (e.g. 45,000 USD); dash if zero | Right-aligned |
   | Addl. Ins. | Visible | Both | Yes / No / dash depending on additional insurance flag | Centred |
   | Created By | Hidden | Both | Name of the user who created the claim | |
   | Created Date | Hidden | Both | Date the claim record was created | |
   | Status | Visible | Both | Badge — **Open** (blue) / **Close** (green) | |
   | Actions | Visible | Both | Kebab menu icon (⋮) | Always visible; sticky right column |

3. Clicking anywhere on a row (except the kebab Actions cell) must open the **Edit Claim** overlay for that record.

4. A **quick filter tab bar** must appear above the table with the following tabs: **All | Open | Close**. The active tab must be highlighted. Selecting a tab filters the listing by Claim Status.

5. A **"New Claim"** button must appear in the top-right of the action bar. Clicking it opens the **Add Claim** overlay.

6. The listing must show a **record count** at the bottom (e.g. "Found 7 records — 7 of 12 total").

7. When no records match the current search or filter, an empty state must be displayed with a search icon and the message **"No claims found"**.

8. The table must be horizontally scrollable when the viewport is too narrow to show all columns.
