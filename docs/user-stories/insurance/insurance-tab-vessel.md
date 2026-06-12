#### **USER Story:**

**As a user,**
**I want to** add and manage Insurance records directly from the Vessel edit overlay
**So that** all insurance policies related to a Vessel are accessible and manageable in one place.

---

#### **acceptance criteria:**

1. An **"Insurance"** tab must be available inside the Vessel edit overlay, placed alongside the existing tabs.

2. The Insurance tab must provide two options:
   * **Add New Insurance**
   * **Link Insurance**

3. **Add New Insurance**
   * Clicking **"Add New Insurance"** must open the Create New Insurance overlay (slide-in panel).
   * The following fields must be pre-set and read-only in the overlay, since the context is already known:
     * **Insurance Category** → pre-set to **"Vessel"**
     * **Vessel** → pre-set to the current Vessel Name
   * The user fills in the remaining fields (Type of Cover, Policy Number, Broker, Insurer, Cover Dates, Status, etc.).
   * The **Create Insurance** button must remain disabled until the following mandatory fields are filled:
     * Type of Cover
     * Insurance Status
   * On successful creation, the new insurance record must appear as a card inside the Insurance tab of the Vessel.
   * The new insurance record must also be available in the main Insurance module listing.

4. **Link Insurance**
   * A searchable dropdown must be available, allowing the user to search and select existing insurance records from the Insurance module.
   * The user can search by Insurance No, Type of Cover, or Insurance Status.
   * This must be a **multi-selection** field — the user can link multiple insurance records in one action.
   * When an existing insurance record is selected and linked:
     * It must appear as a card inside the Insurance tab of the Vessel.
     * The insurance record in the main Insurance module must be updated to reflect the linkage to this Vessel.
   * Insurance records already linked to this Vessel must not appear in the search results.

5. **Insurance Cards**
   * Each linked or newly created insurance record must be displayed as a card inside the Insurance tab.
   * Cards must be listed and grouped based on their **Insurance Status** in the following order:
     * Active
     * Pending
     * Approved
     * Expired
     * Cancelled
     * Rejected
   * Each card must display the following details:
     * Insurance No
     * Insurance Category
     * Insurance Status
     * Type of Cover
     * Cover Period (Cover Start Date → Cover End Date)
     * Broker
     * Leading Insurer
     * Limit of Liability
     * Created By
   * Each card must have a **kebab menu (⋮)** visible on hover, containing the following option:
     * **Unassign** — Unassigns the insurance record from this Vessel.
       * On clicking Unassign, a confirmation pop-up must appear: *"Are you sure you want to unassign this insurance record from the Vessel?"* with **Yes** and **No** buttons.
       * If **Yes**: The card is removed from the tab. The insurance record itself is not deleted.
       * If **No**: The pop-up closes with no changes.
