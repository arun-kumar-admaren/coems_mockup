#### **USER Story:**

**As a user,**
**I want to** create a new insurance record by entering relevant details with guided field dependencies
**So that** insurance policies are recorded accurately, consistently, and linked to the correct vessels, fixtures, or crew.

---

#### **acceptance criteria:**

1. The **"New Insurance"** overlay must be available when the user clicks **"New Insurance"** from the Insurance listing page.

2. The overlay must be organised into the following sections in order:
   * **Cover Details**
   * **Financials**
   * **Parties**
   * **Workflow & Dates**
   * **General**

3. The overlay must contain the following fields:

   **Cover Details — Category & Entity**

   | **Field Name** | **Values** | **Validations** | **Visibility Condition** | **Comments / Dependencies** |
   | --- | --- | --- | --- | --- |
   | Insurance Category | Fixture, Vessel, Crew | Mandatory | Always visible | Drives the entity field and the Type of Cover dropdown. Changing the category must reset the Type of Cover selection. |
   | Fixture | Dropdown — existing fixture numbers (e.g. AEW-F-2026-407) | Mandatory when Category = Fixture | Visible only when Insurance Category = **Fixture** | Links the insurance record to a specific fixture. |
   | Vessel | Dropdown — existing vessel names (e.g. MV OCEAN STAR) | Mandatory when Category = Vessel | Visible only when Insurance Category = **Vessel** | Links the insurance record to a specific vessel. |
   | Crew | Free text | Mandatory when Category = Crew | Visible only when Insurance Category = **Crew** | Describes the crew member(s) or group covered. |

   **Cover Details — Cover & Policy**

   | **Field Name** | **Values** | **Validations** | **Visibility Condition** | **Comments / Dependencies** |
   | --- | --- | --- | --- | --- |
   | Type of Cover | Dropdown — options filtered by Insurance Category (see table below) | Mandatory | Visible once an Insurance Category is selected | A helper text — *"Select Insurance Category first to load options"* — must be displayed when no category is selected. Changing the Insurance Category must reset this field. |
   | Insurance Type / Clause Type | Dropdown — Institute Cargo Clauses A/B/C, Institute Time Clauses Hull, Institute Voyage Clauses Hull, Institute War Clauses (Ship), P&I Rules, Bespoke / Other | Optional | Always visible | Specifies the clause wording governing this cover. |
   | Policy Number | Free text | Optional | Always visible | e.g. POL-2026-001 |
   | Policy / Cover Reference | Free text | Optional | Always visible | e.g. REF-001 |

   **Type of Cover — Values by Category:**

   | **Insurance Category** | **Available Type of Cover Options** |
   | --- | --- |
   | Fixture | Charterers' P&I, FD&D / Defence, Cargo Liability, Additional Contractual Insurance, Bunkers Cover, Container / Equipment Cover |
   | Vessel | Hull & Machinery, Owners' P&I, War Risks, Loss of Hire, Pollution Liability, Wreck Removal, Marine Liability / Property Damage |
   | Crew | Crew Liability, Medical Expenses, Repatriation, Death & Disability, Crew Wages, Personal Effects |

   **Financials — Coverage Values**

   | **Field Name** | **Values** | **Validations** | **Visibility Condition** | **Comments / Dependencies** |
   | --- | --- | --- | --- | --- |
   | Currency | Dropdown — USD, EUR, GBP | Optional | Always visible | Defaults to **USD**. Applies to all financial fields. |
   | Sum Insured | Numeric input | Mandatory | Always visible | Currency prefix displayed. Minimum value: 0. |
   | Total Sum Insured (TSI) | Numeric input | Optional | Always visible | Useful where TSI differs from a single cover amount (e.g. aggregate across sub-covers). |
   | Deductible | Numeric input | Mandatory | Always visible | Currency prefix displayed. Minimum value: 0. |
   | Daily Indemnity (LoH) | Numeric input | Required when Type of Cover = Loss of Hire | Always visible | Expressed as a daily amount (e.g. USD 22,000/day). Amber hint shown when Type of Cover = Loss of Hire and field is empty. |
   | Basis / Terms | Free text | Optional | Always visible | Cover-specific structured term (e.g. 14/180/180). Primarily relevant for Loss of Hire cover. |

   **Financials — Premium Details**

   | **Field Name** | **Values** | **Validations** | **Visibility Condition** | **Comments / Dependencies** |
   | --- | --- | --- | --- | --- |
   | Premium Rate (%) | Numeric input — up to 6 decimal places | Optional | Always visible | Stored as a numeric percentage (e.g. 0.181992). Displayed with % suffix. |
   | Annual Premium | Numeric input | Optional | Always visible | Annual cost of the policy. Currency prefix displayed. |
   | Tax Rate (%) | Numeric input | Optional | Always visible | Numeric percent field (e.g. 3, 19). Displayed with % suffix. |
   | Tax Amount | Numeric input | Optional | Always visible | Can be system-calculated in a future phase. Currency prefix displayed. |
   | Total Premium Incl. Tax | Numeric input | Optional | Always visible | Can be system-calculated in a future phase. Currency prefix displayed. |

   **Parties — Broker**

   | **Field Name** | **Values** | **Validations** | **Visibility Condition** | **Comments / Dependencies** |
   | --- | --- | --- | --- | --- |
   | Broker | Dropdown — broker list | Optional | Always visible | — |
   | Broker Reference Number | Free text | Optional | Always visible | e.g. BRK-REF-001 |
   | Broker Contact | Free text | Optional | Always visible | Contact name or email. |

   **Parties — Insurer**

   | **Field Name** | **Values** | **Validations** | **Visibility Condition** | **Comments / Dependencies** |
   | --- | --- | --- | --- | --- |
   | Insurer / Club | Dropdown — insurer / P&I club list (e.g. Gard P&I, NorthStandard, UK P&I Club, UK Defence Club, Skuld, West of England, American Club) | Mandatory | Always visible | Main insurer or P&I club on this record. |
   | Leading Underwriter | Free text | Optional | Always visible | Individual underwriter or syndicate (e.g. Gard M&E, NHC). Separate from the insurer/club entity. |
   | Insurer Contact | Free text | Optional | Always visible | Contact name or email. |

   **Workflow & Dates**

   | **Field Name** | **Values** | **Validations** | **Visibility Condition** | **Comments / Dependencies** |
   | --- | --- | --- | --- | --- |
   | Date of Notification to Broker | Date picker | Optional | Always visible | No date constraints. |
   | Policy Start Date | Date picker | Mandatory | Always visible | No date constraints. |
   | Policy End Date | Date picker | Mandatory | Always visible | Policy End Date must not be earlier than Policy Start Date. |
   | Renewal Terms | Free text | Optional | Always visible | e.g. +3%; as expiry. |

   **General**

   | **Field Name** | **Values** | **Validations** | **Visibility Condition** | **Comments / Dependencies** |
   | --- | --- | --- | --- | --- |
   | Insurance Status | Active, Expired, Cancelled, Closed | Mandatory | Always visible | Enables the Create button when filled. |
   | Created By | Dropdown — user list | Optional | Always visible | Should auto-populate with the current logged-in user's name. |
   | Remarks | Free text | Optional, Max 10,000 chars | Always visible | Character counter displayed. |

4. **Action Fields**

   | **Field Name** | **Values** | **Validations** | **Visibility Condition** | **Comments / Dependencies** |
   | --- | --- | --- | --- | --- |
   | Create Insurance | Button | Enabled only when all mandatory fields are filled | Always visible | Submits the form and creates the record. |
   | Cancel | Button | No validation | Always visible | Closes the overlay without saving. |

5. **Button Enable Logic:**

   The **Create Insurance** button must remain disabled until the following mandatory fields are filled:
   * Insurance Category
   * The entity field corresponding to the selected category (Fixture / Vessel / Crew)
   * Type of Cover
   * Insurer / Club
   * Policy Start Date
   * Policy End Date
   * Insurance Status

   All other fields are optional and do not block submission.

6. Once the user clicks **Create Insurance**, the record is created immediately with no confirmation pop-up and:
   * A system-generated **Policy No** is assigned following the format: `INS-[Current Year]-[Sequential Number]` (e.g. INS-2026-001).
   * **Created Date** is set to the current date.
   * The new record appears at the top of the Insurance listing, sorted by the latest created.
   * The overlay closes automatically.
   * If the insurance record is linked to a Fixture, Vessel, or Crew via the category entity field, the respective record should reflect this linkage in its own detail view.

7. Clicking **Cancel** closes the overlay without saving any data. No confirmation is required.

8. The **Policy No** field is system-generated and must **not** be editable by the user during creation.

9. The **Task Management** section (if applicable) is available only in Edit mode after a record has been created, not during creation.
