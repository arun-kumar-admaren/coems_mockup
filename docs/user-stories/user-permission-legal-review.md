#### **USER Story:**

**As a user,**
**I want to** assign a "Legal" permission to users
**So that** only authorized users can edit Legal Review records, while others can only create them.

#### **acceptance criteria:**

1. A new checkbox field named **"Legal"** should be available under the **"Board of Director"** checkbox in the User Add overlay.
2. The **"Legal"** checkbox should also be available in the User Edit overlay.
3. The **"Legal"** checkbox should be optional and unchecked by default.
4. When the **"Legal"** checkbox is enabled for a user:
   * The user should be able to **create Legal Review records**.
   * The user should be able to **edit Legal Review records**.
   * The user should be able to **delete Legal Review records**.
5. When the **"Legal"** checkbox is NOT enabled for a user:
   * The user should **NOT be able to edit any Legal Review records** (including those created by themselves).
   * The user can still **create** Legal Review records.
   * The user should **not** be able to **delete** Legal Review records.
6. The system should enforce this restriction across all entry points where Legal Review editing is possible.
