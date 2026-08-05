#### **USER Story:**

**As a user,**
**I want to** search and filter the Engineering listing
**So that** I can narrow down 900+ engineering projects to the ones relevant to my work.

---

#### **acceptance criteria:**

1. A **Search** box must appear at the top-left of the Engineering listing, above the table.

2. Typing in the Search box must filter the listing live across the visible record fields (e.g. Name, Eng Project Number).

3. An **"Add Filter"** button must appear next to Search, allowing the user to add one or more structured filter conditions on listing fields (e.g. Priority, Loading Method, Vessel Type, Project Client, Created By).

4. Filters must be combinable with the status tab bar (All / New Inquires / Under Discussion / Request Finalized / Submitted / Revision Request / Completed / Cancelled / On Hold) — the tab acts as an implicit Project Status filter alongside any additional filters added.

5. Clearing the search box or removing all added filters must restore the full unfiltered listing (subject to the active status tab).

6. When no records match the current search/filter, an empty state must be shown.
