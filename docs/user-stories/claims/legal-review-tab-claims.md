#### **USER Story:**

**As a user,**
**I want to** create and manage legal reviews directly from within a claim record
**So that** all legal work tied to a specific claim is accessible in context without having to navigate to the separate Legal Review module.

---

#### **acceptance criteria:**

1. A **Legal Review** tab must appear in the Edit Claim overlay (not available in Add mode).

2. The Legal Review tab must embed the same Legal Review component used in the standalone Legal Review module, scoped to the current claim's ID.

3. Legal reviews created from this tab must:
   - Be automatically linked to the parent claim
   - Appear in the Legal Review module listing with the claim reference visible
   - Share the same data as the Legal Review module (changes in either location reflect everywhere)

4. All Legal Review functionality available in the standalone module must work identically within this embedded tab:
   - Create new review
   - Edit review
   - View review details
   - Tasks and subtasks
   - Archive / Delete

5. The tab must show the **count** of linked legal reviews as a badge on the tab label (e.g. "Legal Review (2)").

6. If no legal reviews exist for the claim, the tab must show an empty state with a prompt to create the first review.
