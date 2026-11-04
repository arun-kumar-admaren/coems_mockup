#### **USER Story:**

**As a user,**
**I want to** see the browser's address bar update to include the unique ID of the record I currently have open, in the Inquiry, Insurance, Incidents, and Claims modules
**So that** I can copy, share, or bookmark a direct link to that exact record, and reliably return to it via page refresh or the browser's Back/Forward buttons — the same way the Engineering module already behaves.

---

#### **acceptance criteria:**

1. **Reference behaviour (already implemented — Engineering module):** Opening an Engineering record updates the address bar to include that record's unique ID, e.g. opening the record with ID `672` changes the URL to `https://coems.testing.admaren.org/engineering/view/672`. This story extends the same pattern to the four modules below, none of which do this today — e.g. opening any record in Insurance leaves the URL at `https://coems.testing.admaren.org/insurance/listing` regardless of which record is open.

2. **Current vs. required behaviour per module:**

   | **Module** | **Current behaviour** | **Required behaviour** |
   | --- | --- | --- |
   | Engineering *(reference only — no change needed)* | Address bar shows `.../engineering/view/{id}` | Already correct |
   | Inquiry | Opening a record does not change the URL | Address bar must show `.../inquiry/view/{id}` |
   | Insurance | Opening a record does not change the URL — stays on `.../insurance/listing` | Address bar must show `.../insurance/view/{id}` |
   | Incidents | Opening a record does not change the URL | Address bar must show `.../incidents/view/{id}` |
   | Claims | Opening a record does not change the URL | Address bar must show `.../claims/view/{id}` |

3. `{id}` must be a stable, unique, system-generated identifier for that record — not a formatted business reference number (e.g. not the Insurance No, Claim No, or similar) — so the link stays valid even if the record's business reference number is later edited or reformatted.

4. The URL must update no matter how the record's detail view is opened — clicking the row on the listing page, opening it as a linked record from another module (e.g. an Insurance record opened from within a Claim), or via a kebab/menu action — not only the primary "click the row" path.

5. Closing the record's detail view (Cancel, Save/Update-and-close, the overlay's close control, etc.) must revert the address bar back to that module's listing URL.

6. **Refresh and direct-link behaviour:** Loading the application directly at a URL that contains a record ID (e.g. pasting `.../insurance/view/241` into a new browser tab, or refreshing the page while that record is open) must reopen that same record's detail view automatically, instead of showing the bare listing or a blank page.

7. **Browser Back/Forward:** Using the browser's Back button while a record's detail view is open must close it and return to the listing, with the URL reverting accordingly; Forward must reopen it. This must not force a full-page reload or discard the listing's existing search/filter/scroll state — this story only adds URL synchronization, it does not otherwise change how the detail view opens or closes today.

8. **Invalid or inaccessible IDs:** If the ID in the URL does not correspond to an existing, accessible record (deleted, wrong module, malformed, or outside the user's permissions), the module must show its existing "not found" / empty-state pattern rather than a blank screen or an application error.

9. **Out of scope:**
   * Listing-level UI state (search text, active filters, selected status tab, pagination, column sort/order) is not required to be reflected in the URL.
   * State inside the detail view itself (e.g. which tab is active — Overview vs. Legal Review on the Insurance overlay) is not required to be reflected in the URL.
   * Secondary overlays opened on top of a record's detail view (e.g. a Legal Review card opened on top of the Insurance edit overlay) should not change the URL further — it should continue to reflect the underlying primary record.

10. **Open item — Incidents module structure:** Confirm whether Incidents has its own standalone listing page (parallel to Inquiry/Insurance/Claims) or is only ever opened from within another module (e.g. a Claim's Incidents tab, or a Voyage record). If Incidents is only ever opened in a nested context, the URL pattern (a top-level `.../incidents/view/{id}` vs. a nested path reflecting the parent record) needs to be confirmed before implementation.

11. **Open item — identifier availability:** Engineering and Insurance already expose a plain internal **ID** on their listing pages, which is the value expected in the URL. It is not yet confirmed whether Claims, Inquiry, and Incidents expose an equivalent internal ID today (Claims' listing, for example, is currently documented only down to **Claim No**, a formatted reference) — this needs confirming per module so the correct underlying identifier is used in the URL rather than the formatted number.
