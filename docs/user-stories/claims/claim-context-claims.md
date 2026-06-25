#### **USER Story:**

**As a user,**
**I want to** classify each claim as either "Standalone" or "Incident Related" when creating it
**So that** claims originating from a formally logged COEMS incident are correctly linked, while third-party or direct-notification claims can still be captured without requiring an incident record.

---

#### **acceptance criteria:**

1. **Claim Context** must be the first field in the Add Claim overlay and is **mandatory**.

2. Selecting **Incident Related** must reveal the full incident-linked form fields:
   - Type of Claim, Type of Cover, Vessel, Voyage, Related Fixtures, Broker, Leading Insurer, Date of Notification to Broker, Claimant, Claimant Reference Number, PIC Legal, Short Claim Description, Claim Status, Priority, Status Description, Liability & Recovery

3. Selecting **Standalone** must reveal the standalone-specific form fields:
   - Vessel, Voyage, Related Fixtures, Date of Incident, Location, Short Claim Description, Damage as far as known, Steps taken so far, Required assistance from insurance, Claimant, Representative of claimant present, Port Agent (full style)

4. Switching the Claim Context selection **after** entering data in context-specific fields must prompt a confirmation: *"Changing the Claim Context will clear context-specific fields. Continue?"*

5. In the Claims listing, Claim Context must be displayed as a badge:
   - **Standalone** — purple badge
   - **Incident Related** — blue badge

6. The Claim Context filter in the filter popover must allow filtering the listing by Standalone or Incident Related independently.

7. In the **Edit overlay**, the Claim Context field must remain editable. Changing it in edit mode must apply the same field-clearing confirmation as in Add mode.

8. The **Linked Incident** column in the listing must only show an incident reference for **Incident Related** claims where an incident has been linked via the Incidents tab. Standalone claims always show a dash in this column.
