#### **USER Story:**

**As a user working on several voyages at once,**
**I want** the tab title of each open Voyage to show only the Voyage Number (e.g. "FAS 2605"), without the Voyage Name
**So that** I can recognise and switch between my open voyages at a glance, instead of reading long titles that are cut off.

> **Current behaviour:** each open Voyage tab shows the Voyage Number followed by the Voyage Name (e.g. "FAS 2605 UHL FAST…"). The tab width is limited, so the title is truncated with an ellipsis and the Voyage Name often takes up the space the user actually needs.

---

#### **acceptance criteria:**

1. **Tab title shows the Voyage Number only**

   In the Voyage module, the title of every open Voyage tab (the tabs shown beside the "All Voyages" tab, each with a ✕ close control) must display **only the Voyage Number** — e.g. `FAS 2605`, `FAL 2401`, `FOC 2402`. The Voyage Name must no longer appear in the tab title.

   | **Before** | **After** |
   | --- | --- |
   | FAS 2605 UHL FAST… | FAS 2605 |
   | FAS 2405 UHL FAS… | FAS 2405 |
   | VAL 2403 UML VAL… | VAL 2403 |

2. **Applies to every open Voyage tab**

   The change applies to all Voyage tabs, however the voyage was opened (from the Voyage listing, from a link in another module, or from a saved/restored session).

3. **Shown in full**

   Since the title is now shorter, the Voyage Number must be displayed in full without being cut off. The ellipsis (…) is applied only if a Voyage Number is longer than the width available in the tab.

4. **Stays current**

   If the Voyage Number of an open voyage is changed, the tab title must update to the new number.

5. **Unchanged behaviour**

   * The "All Voyages" tab keeps its name.
   * Tab behaviour is unchanged: opening, switching, closing (✕), the scroll arrows when many tabs are open, and the tab order.
   * The Voyage Name continues to appear wherever else it is shown today (for example in the voyage's own details) — only the **tab title** changes.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Voyage module → open-voyage tab title | Display the Voyage Number only; remove the Voyage Name |

---

#### **Out of Scope:**

* Tab titles in other modules (Chartering Fixtures, Inquiry, Claims, Insurance, Engineering, etc.).
* Any other place that shows the Voyage Name (listing columns, voyage details, reports).
* Changing the tab layout, width, or truncation behaviour.
