#### **USER Story:**

**As a user,**
**I want to** create a new claim that is linked to an existing incident by selecting "Incident Related" as the claim context
**So that** the claim is properly associated with the incident that caused it and all relevant parties and cover details are captured at creation.

---

#### **acceptance criteria:**

1. When the user clicks **"New Claim"** and selects **Claim Context = Incident Related**, the following fields must appear in the Overview tab:

   **Identity & Cover**

   | **Field** | **Type** | **Validation** | **Notes** |
   | --- | --- | --- | --- |
   | Claim Context | Dropdown — Standalone / Incident Related | Mandatory | Must be set first; drives visibility of remaining fields |
   | Type of Claim | Dropdown — see Claim Types below | Mandatory | |
   | Type of Cover | Dropdown — see Type of Cover options | Optional | |

   **Claim Types:**
   Cargo Damage, Collision/Allision, Crew Injury, Cargo Shortage, Pollution, Fire / Explosion, General Average, Piracy / Theft, Port Damage, Property Damage, Other

   **Type of Cover Options:**
   Hull & Machinery, P&I, Cargo, War Risks, FD&D, Loss of Hire, Other

   **Vessel & Voyage**

   | **Field** | **Type** | **Validation** | **Notes** |
   | --- | --- | --- | --- |
   | Vessel | Dropdown — existing vessels | Optional | |
   | Voyage | Free text | Optional | e.g. FAI 2601 |
   | Related Fixtures | Multi-select lookup | Optional | Search by fixture no., vessel, or voyage; selected fixtures shown as removable chips |

   **Broker & Insurer**

   | **Field** | **Type** | **Validation** | **Notes** |
   | --- | --- | --- | --- |
   | Broker | Dropdown — broker list | Optional | |
   | Broker Reference Number | Free text | Optional | e.g. MIB-2024-089 |
   | Leading Insurer | Free text | Optional | |
   | Date of Notification to Broker | Date picker | Optional | |

   **Parties**

   | **Field** | **Type** | **Validation** | **Notes** |
   | --- | --- | --- | --- |
   | Claimant | Free text | Mandatory | |
   | Claimant Reference Number | Free text | Optional | e.g. CLM-REF-2024-001 |
   | PIC Legal | Dropdown — legal users | Optional | Person in charge from the legal team |

   **Claim Details**

   | **Field** | **Type** | **Validation** | **Notes** |
   | --- | --- | --- | --- |
   | Short Claim Description | Textarea | Mandatory | Displayed in the listing Description column |
   | Claim Status | Dropdown — Open / Close | Mandatory | |
   | Priority | Dropdown — None / Low / Medium / High / Critical | Optional | |
   | Status Description | Textarea | Optional | Current status notes |

   **Liability & Recovery**

   | **Field** | **Type** | **Validation** | **Notes** |
   | --- | --- | --- | --- |
   | Liability Position | Dropdown — Liable / Not Liable / Under Review / Shared Liability | Optional | |
   | Recovery Right Exists | Dropdown — Yes / No | Optional | |
   | Recovery Against | Dropdown — Owner / Charterer / Shipper / Receiver / Terminal / Stevedore / Insurer / Surveyor / Other | Visible only when Recovery Right Exists = Yes | |
   | Recovery Route | Dropdown — Insurance / Contractual / Legal / Direct Settlement / Arbitration / Litigation / Other | Visible only when Recovery Right Exists = Yes | |
   | Liability Assessment Notes | Textarea | Optional | |

2. The system must validate that **Type of Claim**, **Claimant**, and **Claim Status** are filled before allowing save. An alert must be shown if any required field is missing.

3. On save, the new claim must appear at the top of the Claims listing with a system-generated **Claim No** (e.g. CLM-2026-004).

4. The **Add** overlay must not show the following tabs on creation — they are only available in Edit mode: Legal Review, Incidents, Insurance, Financials, Closure, Docs.
