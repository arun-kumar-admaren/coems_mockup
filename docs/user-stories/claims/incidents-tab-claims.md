#### **USER Story:**

**As a user,**
**I want to** view and link incidents to a claim from within the claim's edit overlay
**So that** the relationship between the claim and the incident(s) that caused it is clearly established and navigable.

---

#### **acceptance criteria:**

1. An **Incidents** tab must appear in the Edit Claim overlay (not available in Add mode).

2. The Incidents tab must display all incidents linked to the current claim.

3. For each linked incident the following information must be visible:
   - Incident No
   - Vessel
   - Date
   - Category
   - Type
   - Description (truncated)
   - Severity
   - Status

4. A **"Link Incident"** action must allow the user to search for and link an existing COEMS incident to the claim.

5. When a claim is **Incident Related**, at least one linked incident is expected. The tab must show an amber hint if none are linked: *"No incidents linked. Use 'Link Incident' to associate one."*

6. Removing an incident link must only unlink the records — it must not delete the incident from the HSEQ module.

7. Clicking an incident row must open the incident detail view (read-only or navigable to the full HSEQ record).

8. The **Linked Incident** column in the Claims listing must reflect the incident number of the first (or primary) linked incident.
