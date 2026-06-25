#### **USER Story:**

**As a user,**
**I want to** flag certain customers in COEMS as Insurance Brokers and have those customers automatically populate the Broker dropdown in the Insurance module
**So that** broker selection in Insurance records is driven by live COEMS data rather than a static list, ensuring accuracy and consistency across the system.

---

#### **acceptance criteria:**

1. A new checkbox field — **"Is Insurance Broker"** — must be added to the **Settings → Customers** add and edit overlays.

2. The **"Is Insurance Broker"** checkbox must behave as follows:

   | **Attribute** | **Specification** |
   | --- | --- |
   | Field Type | Checkbox (boolean toggle) |
   | Default Value | Unchecked (false) |
   | Position | Placed after the existing customer fields in the add / edit overlay |
   | Validation | Optional — no mandatory constraint |
   | Effect | When checked, this customer is treated as an Insurance Broker and their name becomes available in the Broker dropdown within the Insurance module |

3. The **Broker** dropdown in the Insurance module **Add** and **Edit** overlays must:

   * Populate its options dynamically from the **Customers** list in COEMS Settings.
   * Only include customers where **"Is Insurance Broker"** is checked (true).
   * Display the **Customer Name** as the option label.
   * Show a **"No brokers available"** message (or an empty state) if no customers have been flagged as Insurance Brokers.
   * The static hardcoded broker list must be **removed** and replaced entirely by this dynamic source.

4. The Broker dropdown must **reflect real-time changes**:

   * If a new customer is flagged as **"Is Insurance Broker"** and saved, their name must appear in the Broker dropdown immediately without requiring a page refresh.
   * If an existing customer's **"Is Insurance Broker"** flag is unchecked, their name must be removed from the Broker dropdown. Any existing Insurance records that previously selected this broker must retain the stored value (display as-is) — the change must not break or clear historical records.

5. The **Customers listing** in Settings must display the **"Is Insurance Broker"** status visually:

   | **Attribute** | **Specification** |
   | --- | --- |
   | Display | A badge or indicator (e.g. "Broker" tag) shown against customers where the flag is enabled |
   | Placement | Inline with the customer row in the listing table |

6. No changes are required to the Broker Reference Number or Broker Contact fields in the Insurance overlay — they remain free-text as currently specified.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Settings → Customers → Add overlay | Add **"Is Insurance Broker"** checkbox |
| Settings → Customers → Edit overlay | Add **"Is Insurance Broker"** checkbox |
| Settings → Customers → Listing | Display broker badge / indicator for flagged customers |
| Insurance → Add overlay → Broker field | Replace static list with dynamic list from Customers (Is Insurance Broker = true) |
| Insurance → Edit overlay → Broker field | Replace static list with dynamic list from Customers (Is Insurance Broker = true) |

---

#### **Out of Scope:**

* Separate Broker management screen (brokers are managed entirely through the Customers module via the flag).
* Broker contact details auto-fill from customer record (future phase).
* Historical Insurance records are not retroactively updated when a broker flag is removed.
