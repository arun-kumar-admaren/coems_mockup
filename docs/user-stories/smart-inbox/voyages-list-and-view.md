#### **USER Story:**

**As a** chartering/operations user reviewing an email in Smart Inbox,
**I want to** see any Voyage already underway for a Fixture created from this email, and open its full Voyage record,
**So that** I can follow a deal all the way from inquiry through to the vessel actually sailing, without ever leaving the email.

---

#### **acceptance criteria:**

1. **Entry point:** the "Voyage" icon on the side rail opens this panel for the currently open email.

2. **Grouped by Fixture:** Voyages are listed grouped under whichever Fixture on this email they belong to. Unlike Voyage Estimates, a Voyage only exists once a deal has actually been fixed, so there is no Inquiry-level group. An email with no Fixtures created yet, or whose Fixtures haven't started a Voyage, shows an empty state — e.g. *"No voyages yet — create and start a Fixture from this email first."*

3. **Group header:** the same visual pattern as the Voyage Estimate panel's Fixture groups — a document icon, the Fixture Number, its cargo name, a **"FIXTURE"** badge, and the voyage count for that group (typically 0 or 1, since a Fixture generally has at most one active Voyage at a time).

4. **Per-group table columns**, drawn from the standalone Voyage module's own listing: **Voyage Number, Vessel, Status, Operation in Charge, TCE, Start Date** — the subset of the real Voyage listing's columns most useful at a glance. (The full listing also carries Suez Canal Rebate, NSR Permit, Created/Modified By/On, Vessel Type, Customs Filing, AGM, Armed Guards, Transit Requirements, and Bunker Planning — these only need to appear inside the detail view, not this summary table.)

5. **Opening a Voyage record:** clicking a Voyage Number opens the real Voyage Detail overlay (`VoyageDetail`, the same component the standalone Voyage module already uses) for that record — the same reuse pattern already applied to Inquiry (`InquiryDetail`) and Fixture (`FixtureDetail`) elsewhere in Smart Inbox.

6. **Closing:** the Voyage Detail overlay closes back to the grouped list, the same interaction as the other two detail overlays already in Smart Inbox.

---

#### **Out of scope**

* Starting or creating a Voyage from a Fixture within Smart Inbox — this panel is view-only, same as Voyage Estimate; a Voyage needs to already exist to show up here.
* Defining how a Fixture actually links to its Voyage — since neither the association nor any Voyage mock data currently exists, this story doesn't specify how "Fixture → Voyage" would be computed or stored.
* Voyage Estimate content — already covered by its own story ("List & View Voyage Estimates"); a Voyage and a Voyage Estimate are two different record types that happen to reuse a similar grouped-panel pattern, not interchangeable data.

#### **Open items**

1. **Not implemented at all today.** The "Voyage" side panel currently renders a generic "Coming Soon" placeholder — just an icon and the text "Voyage isn't part of this MVP yet," with no grouping, no table, and no link to the real `VoyageDetail` / `voyage.tsx` module that already exists elsewhere in the app. This story defines the target design, grounded in the Inquiry/Fixture/Voyage Estimate reuse pattern already built into Smart Inbox; full implementation is still needed to bring the mockup in line with it.
2. **Mock-data generation approach is undecided.** Voyage Estimate groups use a seeded-random generator to fabricate believable demo data per email; whether Voyages should follow the same approach, or instead only appear for a small, hand-authored subset of demo Fixtures (so it doesn't imply every Fixture automatically has a Voyage), needs a decision.
3. **Table column selection (AC 4) is a judgment call** pulling from the standalone Voyage listing's much longer column set — confirm with the Voyage module owner which subset is actually most useful to show at a glance from inside an email.
