#### **USER Story:**

**As a user,**
**I want to** see the cargo and chartering details of the Scope or Fixture an Engineering Project is linked to
**So that** I don't have to leave the Engineering module to check what is being carried, on which vessel, and on what terms.

---

#### **acceptance criteria:**

1. The **Scope/Fixture** tab must show a **Cargo Details** section, with an **"Add Cargo"** action, listing the cargo item(s) associated with the linked Scope or Fixture.

2. The tab must show a **Fixture Details** section with: PIC Chartering, Intended Vessel Type, Vessel, Final Performer, Head Account.

3. The Fixture Details section must include a **Port of Loading** table (Port, Laycan Start, Laycan End) and a **Port of Discharge** table (Port), both read from the linked Fixture/Scope record.

4. The tab must include a **Chartering Terms** section summarizing the commercial terms of the linked Fixture/Scope.

5. All data on this tab must be **read-only** from the Engineering module — it mirrors the source Scope/Fixture record and must be edited from the Chartering module, not from Engineering.

6. The tab must include a collapsible **History** section for changes relevant to the scope/fixture linkage.

7. If the project is linked to a **Scope** (rather than a Fixture), the tab must show the equivalent Scope-side details in place of the Fixture Details section.
