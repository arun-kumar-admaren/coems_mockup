#### **USER Story:**

**As an administrator,**
**I want to** connect, view, edit, and remove third-party service integrations (Coach Solutions, Navis) from a dedicated Integrations screen under Settings → Administration,
**So that** I can manage which external vessel-tracking providers are authorized to feed data into COEMS, without needing a developer to hardcode credentials.

---

#### **acceptance criteria:**

1. **Entry point:** Settings → Administration must show an **"Integrations"** tile (subtitle: "Manage third-party service connections"), positioned immediately after the existing **"Preferences"** tile.

2. **Role-based access:** The Integrations tile, and the Integrations screen it opens, must be restricted to users with the **Admin** or **Super Admin** role.
   - Users in any other role must not see the "Integrations" tile in Settings → Administration at all — not shown greyed-out/disabled, simply absent from the grid.
   - A non-Admin/Super Admin user must not be able to reach the Integrations screen by any other path either (e.g. a direct/deep link, once routing exists), and must not be able to add, edit, test, or remove a connection via the API layer even if they somehow reach the screen — this is a backend authorization rule, not just a UI hide.

3. **Integrations home page:** Clicking the tile navigates to a dedicated Integrations screen (replacing the Settings grid, same pattern as other Settings sub-pages like Own Vessels):
   - Top bar: a **"BACK"** control (top-left, returns to the Settings grid) and a **"+ Add New"** button (top-right).
   - Page heading: **"Integrations"**.
   - If no integrations are connected yet: an empty state reading "No integrations added yet" / "Click '+ Add New' to connect a service."
   - If one or more are connected: a tile grid (one tile per connected integration — see AC 7).

4. **"+ Add New" → Available Integrations picker:** Clicking "+ Add New" opens a modal titled **"Available Integrations"**:
   - A search box at the top, auto-focused.
   - Below it, a scrollable list of catalog entries not yet connected, each row showing the service's **logo first, then its name** (currently: **Coach Solutions**, **Navis**).
   - Typing in the search box filters the list by name (case-insensitive, partial match). If nothing matches, the list area shows **"No integrations found"** instead of any rows — never a blank void.
   - An integration that is already connected is excluded from this list (so the same service can't be "added" twice while it's active — see AC 7 for how it's edited instead).
   - Clicking a row closes this modal and opens the Add modal for that service (AC 5).
   - The modal can be dismissed via its **✕** icon or by clicking the backdrop, without selecting anything.

5. **Add {Service} modal — new connection:** Selecting a catalog entry opens a modal titled **"Add {Service Name}"** (e.g. "Add Navis"), showing that service's logo next to the title:
   - A single field, **API Key**, where the user pastes their key (monospace). The value is **masked by default** (shown as dots, like a password field), with an **eye icon** inside the field, right-aligned:
     - Clicking the eye icon reveals the key as plain text, and the icon switches to an "eye-off" state.
     - Clicking it again re-masks the key back to dots.
     - This toggle only affects visibility on screen — it does not change, clear, or resubmit the field's value.
   - A **"Test API"** button. Clicking it:
     - If the API Key field is empty, shows **"Error"** (red text) below the field.
     - If the field has a value, shows a brief **"Testing..."** state, then **"Test success"** (green text) below the field.
     - Editing the API Key field after a test result clears that result (back to no message shown).
   - An **"Add"** button, disabled until **"Test API" has returned "Test success"** for the current value of the field — a non-empty key alone is not enough. Editing the API Key field afterward clears the test result (per the bullet above) and re-disables "Add" until a fresh test succeeds.
   - A **"Cancel"** button and the **✕** icon both close the modal without saving.
   - Clicking **"Add"**: saves the connection, closes this modal, and returns to the Integrations home page, where the new tile now appears (AC 7).

6. **Edit mode (opened from an existing tile's settings icon):** The same modal component is reused, but with these differences from "new connection" mode:
   - Title shows just the **service name** (e.g. "Navis"), not "Add Navis."
   - The **API Key** field is pre-filled with the currently saved key, masked the same way as AC 5 (dots by default, revealed via the eye icon).
   - A **"Remove"** button (red, with a trash icon) appears next to "Test API," which is not present when adding a new connection.
   - The primary action button reads **"Save"** instead of "Add," but is gated the same way — disabled until "Test API" returns "Test success" in this session, then updates the stored API key for that integration, closes the modal, and returns to the home page.
   - "Test API" behaves identically to AC 5.
   - This gating is **not remembered between sessions**: reopening an already-connected integration's settings always starts with "Save" disabled, even though its saved key already passed a test when it was originally added or last saved. The admin must click "Test API" and get "Test success" again before "Save" is clickable — even if they haven't changed the key at all.

7. **Connected integration tile:** Each connected integration is shown as a tile in the home page grid, containing, top to bottom:
   - The service's logo.
   - The service name.
   - A status row: a small **green dot** plus the word **"Active."**
   - A **settings (gear) icon**, top-right of the tile. Clicking it opens the Edit mode modal (AC 6) for that integration, prefilled with its saved key.

8. **Removing a connection:** Clicking "Remove" in Edit mode (AC 6) opens a confirmation dialog before anything is deleted:
   - Heading: **"Remove {Service Name}?"**
   - Body text: "This disconnects the integration and removes its saved API key. This can't be undone."
   - **"Cancel"** closes the confirmation only, returning to the Edit modal with nothing changed.
   - **"Remove"** (red, destructive styling) deletes the connection: both modals close, the tile disappears from the home page, and the service becomes available again in the "Available Integrations" picker (AC 4).

9. **Catalog:** The set of integrations available to add is currently fixed to two entries — **Coach Solutions** and **Navis** — each with its own logo and name. No other services are listed today; the catalog is expected to grow as more provider integrations (e.g. the Coach Solutions and Navis API integrations documented separately for the Voyage module's Arrival & Departure Report) are added to COEMS.

---

#### **Out of scope**

* Real API validation on "Test API" — this is a mocked, deterministic check (empty key → Error, non-empty key → Test success after a short delay), not a live call to either vendor's API.
* Persisting connected integrations across a page reload or between users — state resets on refresh, consistent with other seed/mock data elsewhere in this Settings module (e.g. Own Vessels).
* Any actual data flow from a connected integration into COEMS (e.g. into the Voyage Arrival & Departure Report) — this story only covers the admin-facing connect/manage screen itself.
* Editing which fields/scopes an API key has access to, or multiple keys per service.
* Real logo assets — Coach Solutions and Navis currently render as colored monogram badges ("CS" / "N") rather than their official logos, pending the actual brand asset files.

#### **Open items**

1. **Real logo assets** — swap the monogram placeholders for Coach Solutions' and Navis' actual logos once image files (not inline-pasted screenshots) are available.
2. **Persistence** — decide whether connected integrations should survive a refresh (e.g. via localStorage) for demo purposes, or remain session-only as they are today.
3. **Relationship to the Voyage integration stories** — this screen is purely administrative (store a key, mark active/inactive); it is not yet wired to the Coach Solutions/Navis Arrival & Departure Report ingestion work documented separately under `docs/user-stories/voyage/`. Whether "Active" here should reflect real ingestion health (vs. just "a key is saved") is undecided.
4. **Role enforcement is not implemented in the mockup** — this mockup has no user-role/permission system at all today (single hardcoded demo user, no login). AC 2 documents the required behaviour for the real build; the current mockup cannot demonstrate role-based hiding and shows the Integrations tile to any user.
5. **Re-test-on-every-save is a deliberate, confirmed choice, but worth revisiting** — AC 6 currently requires a fresh successful "Test API" on every Save, even when reopening an integration whose key hasn't changed (e.g. an admin who only wants to click "Remove," or just wants to view the stored key). This was confirmed as the intended behaviour, but if it proves annoying in practice, an alternative would be to only require re-testing when the API Key field's value has actually changed from what's stored.
