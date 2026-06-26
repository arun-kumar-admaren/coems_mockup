#### **USER Story:**

**As a user working in the Voyage module,**
**I want to** raise a new Standalone claim directly from a voyage record
**So that** claims arising during a voyage are captured in context — with the vessel and voyage automatically pre-filled — without needing to switch to the Claims module separately.

---

#### **acceptance criteria:**

1. A **"New Claim"** button must be available within the Voyage detail view in the following locations:

   * In the **Claims tab** — as an empty-state CTA when no claims exist yet for that voyage
   * In the **Claims tab** — as a header button when one or more claims already exist
   * In the **Incident/Claim tab** — as an option in the "Add New" dropdown alongside "Incident"

2. Clicking **"New Claim"** from any of these locations must open a **right-side overlay panel** titled "New Claim".

3. The following fields must be **pre-filled and read-only** (derived from the voyage context):

   | **Field** | **Pre-filled Value** | **Editable?** |
   | --- | --- | --- |
   | Claim Context | Standalone | No — locked to Standalone for voyage-originated claims |
   | Vessel | Vessel name from the current voyage | No |
   | Voyage | Voyage number from the current voyage | No |

4. The following fields must be presented for **user input**:

   | **Field** | **Type** | **Validation** | **Notes** |
   | --- | --- | --- | --- |
   | Related Fixtures | Multi-select lookup | Optional | Search by fixture no., vessel, or voyage; chips for selected fixtures |
   | Date of Incident | Date picker | Optional | |
   | Location | Free text | Optional | e.g. Port of Rotterdam, At Sea |
   | Short Claim Description | Textarea | Mandatory | Displayed in the Claims listing Description column |
   | Damage as far as known | Textarea | Optional | Known damage at the time of notification |
   | Steps taken so far | Textarea | Optional | Actions already taken |
   | Required assistance from insurance | Dropdown — Yes / No | Optional | |
   | Claimant | Free text | Mandatory | |
   | Representative of claimant present | Free text | Optional | |
   | Port Agent (full style) | Dropdown — port agent list | Optional | |

5. The **Claim Number** must be auto-generated in the format **CLM-{YYYY}-V{nn}** (e.g. CLM-2026-V01) to distinguish voyage-originated claims from claims created in the Claims module.

6. On clicking **"Create Claim"**, the claim must be:
   - Saved and immediately visible in the **Claims tab** of the same voyage
   - Available in the **Claims module listing** with a **Standalone** (purple) badge
   - Automatically synchronised via `localStorage` so no page refresh is required to see it in the Claims module

7. Validation must prevent save if **Claimant** or **Short Claim Description** is empty. An appropriate alert must be shown.

8. The overlay must include a **Cancel** button that discards all entered data and closes the panel without saving.

9. Voyage-originated Standalone claims must be **editable from the Claims module** like any other claim, and must support all tabs available in Edit mode (Legal Review, Incidents, Insurance, Financials, Closure, Docs).

10. The Claims module's **Claim Context filter** (Standalone) must include voyage-originated claims — they are indistinguishable from standalone claims created directly in the Claims module, other than their Claim Number format.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Voyage module → Claims tab | "New Claim" button (empty state + header) |
| Voyage module → Incident/Claim tab | "Claim" option in "Add New" dropdown |
| Voyage module → New Claim overlay | Pre-filled vessel, voyage, and locked Standalone context |
| Claims module | Voyage claims appear via localStorage sync; fully editable |
