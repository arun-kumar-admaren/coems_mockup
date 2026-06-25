#### **USER Story:**

**As a system administrator,**
**I want to** control which users can view, create, edit, archive, and delete claim records based on their assigned role
**So that** sensitive claim data is only accessible to authorised personnel and no accidental modifications are made by users without the appropriate permissions.

---

#### **acceptance criteria:**

1. The Claims module must enforce the following role-based access controls:

   | **Action** | **Viewer** | **Claim User** | **Claim Manager** | **Admin** |
   | --- | --- | --- | --- | --- |
   | View Claims listing | ✅ | ✅ | ✅ | ✅ |
   | Open claim Edit overlay (read-only) | ✅ | ✅ | ✅ | ✅ |
   | Create new claim | ❌ | ✅ | ✅ | ✅ |
   | Edit existing claim fields | ❌ | ✅ | ✅ | ✅ |
   | Archive / Unarchive claim | ❌ | ❌ | ✅ | ✅ |
   | Delete claim (soft delete) | ❌ | ❌ | ✅ | ✅ |
   | Hard delete (permanent) | ❌ | ❌ | ❌ | ✅ |
   | Manage External Parties | ❌ | ✅ | ✅ | ✅ |
   | Update Resolution & Security | ❌ | ❌ | ✅ | ✅ |
   | Export as PDF / Send as Email | ❌ | ✅ | ✅ | ✅ |

2. Users who do not have create permission must not see the **"New Claim"** button.

3. Users who do not have edit permission must be able to open the Edit overlay but all fields must be read-only. The **"Update Claim"** button must not appear.

4. Users who do not have delete permission must not see the **Delete** option in the kebab menu.

5. Permission checks must be enforced server-side and not rely solely on UI hiding.

6. Permission violations (e.g. direct API calls) must return an appropriate error response and not modify any data.
