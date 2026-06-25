#### **USER Story:**

**As a user,**
**I want to** view and link insurance policies to a claim from within the claim's edit overlay
**So that** the policy covering this claim is clearly identified and the insurance workflow status is tracked in context.

---

#### **acceptance criteria:**

1. An **Insurance** tab must appear in the Edit Claim overlay (not available in Add mode).

2. The Insurance tab must display all insurance records linked to the current claim.

3. For each linked insurance policy the following information must be visible:
   - Insurance No
   - Category (Vessel / Fixture / Crew)
   - Type of Cover
   - Insurer / Club
   - Policy Period (Start → End)
   - Sum Insured
   - Status

4. A **"Link Insurance"** action must allow the user to search for and associate an existing Insurance record with the claim.

5. The tab must display the **insurance workflow status** for this claim:
   - Reviewed by Insurance — checkbox / toggle
   - Approved by Insurance — checkbox / toggle
   - Signed-off Pending — checkbox / toggle

6. Removing an insurance link must only unlink — it must not delete the insurance record from the Insurance module.

7. If no insurance is linked, the tab must show an empty state with a prompt to link a policy.

8. The **Addl. Ins.** column in the Claims listing must reflect whether the claim has been flagged as requiring additional insurance coverage.
