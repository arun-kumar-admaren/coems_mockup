#### **USER Story:**

**As a user,**
**I want to** create a new claim in Standalone context (without linking it to an existing incident)
**So that** claims arising from events that were not logged as incidents (e.g. cargo shortage notifications received directly from a third party) can still be captured and managed in COEMS.

---

#### **acceptance criteria:**

1. When the user clicks **"New Claim"** and selects **Claim Context = Standalone**, the Overview tab must display the following fields:

   **Vessel & Location**

   | **Field** | **Type** | **Validation** | **Notes** |
   | --- | --- | --- | --- |
   | Vessel | Dropdown — existing vessels | Optional | |
   | Voyage | Free text | Optional | e.g. FAI 2601 |
   | Related Fixtures | Multi-select lookup | Optional | Search by fixture no., vessel, or voyage; chips for selected items |
   | Date of Incident | Date picker | Optional | |
   | Location | Free text | Optional | e.g. Port of Rotterdam, At Sea |

   **Claim Description**

   | **Field** | **Type** | **Validation** | **Notes** |
   | --- | --- | --- | --- |
   | Short Claim Description | Textarea | Mandatory | Brief summary shown in the listing |
   | Damage as far as known | Textarea | Optional | Description of known damage at the time of notification |
   | Steps taken so far | Textarea | Optional | Actions already taken before formal claim creation |

   **Insurance Assistance**

   | **Field** | **Type** | **Validation** | **Notes** |
   | --- | --- | --- | --- |
   | Required assistance from insurance | Dropdown — Yes / No | Optional | Indicates if insurance involvement is needed |

   **Parties**

   | **Field** | **Type** | **Validation** | **Notes** |
   | --- | --- | --- | --- |
   | Claimant | Free text | Mandatory | |
   | Representative of claimant present | Free text | Optional | Name of the claimant's representative if on-site |
   | Port Agent (full style) | Dropdown — port agent list | Optional | Port agent involved at the time |

2. A Standalone claim does **not** require Claim Type or Type of Cover at creation — these fields are not shown in the Standalone context form.

3. The system must validate that **Claimant** is filled before save. An alert must be shown if missing.

4. On save, the new claim must appear in the listing with a **Standalone** (purple) badge in the Claim Context column.

5. A Standalone claim can later be converted or linked to an incident from within the Edit overlay — the Claim Context field remains editable after creation.

6. The **Incident Related** form fields (Type of Claim, Broker, PIC Legal, etc.) must not be visible when Claim Context = Standalone.
