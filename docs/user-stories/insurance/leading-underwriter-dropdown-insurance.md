#### **USER Story:**

**As a user,**
**I want to** select the Leading Underwriter from a dropdown list of Legal users instead of typing it in free text
**So that** the field is populated consistently from an authoritative source and doesn't accumulate typos or inconsistent naming over time.

---

#### **acceptance criteria:**

1. The **Leading Underwriter** field in the Insurance **Add** and **Edit** overlays must be converted from a free-text input to a **dropdown (single-select)** field.

2. The **Leading Underwriter** dropdown must behave as follows:

   | **Attribute** | **Specification** |
   | --- | --- |
   | Field Type | Dropdown (single selection) |
   | Options Source | The list of Legal users — users with the **"Legal"** permission enabled in Settings → User Add/Edit |
   | Validation | Optional — no mandatory constraint |
   | Default Value | Empty / unselected (`none`) |
   | Placement | Same position currently occupied by the free-text Leading Underwriter field |

3. The dropdown must list Legal users by name, sourced live from the Settings user list — no hardcoded/static option list.

4. Existing Insurance records with a previously saved free-text Leading Underwriter value must retain and display that value as-is; it is not required to match an entry in the new dropdown list. Editing the record and reopening the dropdown may show no pre-selected match if the stored value doesn't correspond to a current Legal user.

5. Only one Leading Underwriter can be selected per field — this is not a multi-select.

6. The field remains optional; the Save/Create button's enable logic is unaffected by whether Leading Underwriter is filled.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Insurance → Add overlay → Leading Underwriter | Convert free text to single-select dropdown, sourced from Legal users |
| Insurance → Edit overlay → Leading Underwriter | Convert free text to single-select dropdown, sourced from Legal users |

---

#### **Out of Scope:**

* Any other field in the Insurance overlay besides Leading Underwriter.
* Retroactively matching or cleaning up existing free-text values against the new user list.
* Role-based restriction on who can select which Legal user (any user filling the form can choose any Legal user).
