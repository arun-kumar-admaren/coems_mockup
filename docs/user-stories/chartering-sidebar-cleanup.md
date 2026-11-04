#### **USER Story:**

**As a Chartering user,**
**I want** Task, Time Tracking, and Document Search removed from my sidebar, with Task available under Management instead
**So that** my navigation only shows what Chartering actually uses, and Task remains reachable from the module that does use it.

> From the 09.09.2026 client demo (action items #9–10 in the [09.09.2026 Minutes of Meeting](../meeting-notes/coems-legal-insurance-claims-uat-review-2026-09-09.md)). Lukas: *"Sajith, shall I take time tracking and task off this place as of now from charting because they are not using it as of now"* — confirmed. On Document Search: *"I'm not sure if anybody's ever searched for a document here"* — also confirmed for removal. Lukas separately floated a longer-term idea of one shared task hub across departments (HSE, Engineering, etc. all raising tasks from one place) — noted as future direction, not part of this change.

---

#### **acceptance criteria:**

1. **Current state of the Chartering sidebar (for reference)**

   Top to bottom: Dashboard, Inquiry, Projects, Fixtures, Voyage Estimate, All Reports (expandable), Voyage, Position List, Maps, Scheduler, **Task**, **Time Tracking**, Customers, Port Agency, **Document Search**.

2. **Remove from the Chartering sidebar**
   * Task
   * Time Tracking
   * Document Search

   All three are removed entirely — not greyed out, not collapsed under another menu.

3. **Add Task to the Management sidebar**
   * Task must appear as a navigation item in the Management module's sidebar.
   * This is the only place Task is relocated to — it is not also kept anywhere else.

4. **Time Tracking and Document Search are not relocated**
   * Per the client's decision, these two are removed outright, not moved to Management or anywhere else. If a user needs either in the future, that's a separate future request, not part of this change.

5. **No functional change to Task itself**
   * This is a navigation/access change only. Whatever Task currently does — its list, its detail view, its data — is unaffected; only where it's reachable from changes.

6. **Existing Task records remain visible from Management**
   * Any tasks already created (including ones raised from Legal Review, which route to a general Task listing) must still be reachable via the Management sidebar's Task entry after this change.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Chartering sidebar | Remove Task, Time Tracking, Document Search |
| Management sidebar | Add Task |

---

#### **Out of Scope:**

* Any change to the Task module's own functionality, fields, or data.
* Relocating Time Tracking or Document Search anywhere else.
* The longer-term "single shared task hub across departments" idea Lukas raised — explicitly deferred as future direction, not scoped here.
