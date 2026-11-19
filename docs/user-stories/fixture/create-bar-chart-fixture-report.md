#### **Fixture Report - Create Bar Chart**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a User,**
**I want to** create a **Bar Chart** from the generated Fixture Report data
**So that** I can visualise and compare report values across selected categories, for example the number of fixtures per month or the freight per customer.

> Follows **PCER - Create New Bar Chart (COEMS-13418)**. The chart is a widget on the **Charts** dashboard; moving, resizing, editing and deleting it are in **Fixture Report - Report Dashboard**. The chart reads the table of the Fixture Report (see **Fixture Report - Report Table Listing**).

---

#### **acceptance criteria:**

1. **Entry Point / Flow**

   * In the **Fixture Report Charts Dashboard**, the user clicks **Create New → Bar Chart**.
   * An **"Add Bar Chart"** overlay opens.
   * The user configures the chart and clicks **Create**.
   * The chart is added to the Charts Dashboard.

2. **Add Bar Chart overlay: fields (in order)**

   | **#** | **Field** | **Type** | **M/O** | **Options / Rules** |
   | --- | --- | --- | --- | --- |
   | 1 | Chart Name | Text input | M | Editable by the user. Two charts of one report may have the same name. |
   | 2 | X-Axis | Dropdown (single select) | M | Options: **all available report columns**, which are the columns of the Fixture Report table (the columns chosen in **Select required columns**, whether or not they are hidden in the table view). No column is selected at first (placeholder **"Select column"**). Hint under the field: *"Choose any column from the generated report"*. |
   | 3 | Date Group By (conditional) | Dropdown (single select) | M (when shown) | Displayed **only when the selected X-Axis is a Date or Date and time column**. Options: **Year (Default)**, **Month**. See AC 3. Hint under the field: *"Shown only when X-Axis is Date/Date-Time"*. |
   | 4 | Y-Axis | Dropdown (single select) | M | Options: **all available report columns** (no restrictions). No column is selected at first. Hint under the field: *"Choose any column; infeasible selections show blank chart"*. |
   | 5 | Aggregation | Dropdown (single select) | M | Default: **Count**. Options: **Count**, **Sum**, **Average**. Hint under the field: *"Count, Sum, Average"*. See AC 4. |

3. **Date Group By**

   * The Date and Date and time columns of the Fixture Report are: BOOKING DATE, DELIVERY DATE, REDELIVERY DATE, CREATED ON, MODIFIED ON, VOYAGE START DATE, LAYCAN START and LAYCAN END.
   * When the user selects one of them as X-Axis, the **Date Group By** field must appear with **Year** selected. When the user selects another column, the field must disappear.
   * **Year**: one bar per year (for example 2022). **Month**: one bar per month of each year (for example 2022-03), so that the same month of two years stays apart.
   * For a Date and time column, the time is ignored.
   * Fixtures with no value in the date column are shown as one group named **(Blank)**.

4. **Aggregation**

   Aggregation is applied to compute the **Y-Axis value for each X-Axis category** (bucket).

   | **Aggregation** | **Y-Axis column** | **Result for each bucket** |
   | --- | --- | --- |
   | Count | Any column (Text, Number, Date and so on), as in the PCER | The number of fixtures in the bucket |
   | Sum | A Number column | The total of the Y-Axis values (empty values are ignored) |
   | Average | A Number column | The average of the Y-Axis values (empty values are ignored) |
   | Sum or Average | A Text, Date, Date and time or Yes / No column | **Not feasible**: see AC 7 |

5. **Actions**

   * **Cancel**
     * Closes the **Add Bar Chart** overlay immediately. The **×** icon of the overlay does the same.
     * **No chart must be created.**
     * No configuration data (Chart Name, X-Axis, Y-Axis, Date Group By, Aggregation) must be saved.
     * If the user has modified any field, all changes must be **discarded**, and the user must be returned to the Charts Dashboard in the same state as before opening the overlay.
   * **Create**
     * Creates a new **Bar Chart widget** on the Charts Dashboard using the selected configuration.
     * The chart must be created **even if the selected X-Axis and Y-Axis combination is not feasible**.
     * When clicked, the overlay must close and a new Bar Chart widget must be added to the dashboard (at the top left, as in **Fixture Report - Report Dashboard**).

6. **Create button enabled**

   The **Create** button must be enabled **only when**:

   * the Chart Name is provided, and
   * the X-Axis is selected, and
   * the Y-Axis is selected, and
   * the Aggregation is selected.

   (Date Group By always has a value, so it never blocks **Create**.)

7. **Chart rendering after creation**

   * If the configuration is **feasible**: the bar chart must render using the selected X-Axis, Y-Axis, Date Group By (if applicable) and Aggregation, with one bar for each X-Axis group. The **axis titles** show the names of the chosen columns.
   * If the configuration is **not feasible** (for example Sum of a Text column), or the report has no fixtures: the chart must render a **blank state** with the message **"No data available for the selected chart configuration."**
   * The bars must be in this order: dates in **time order**, numbers from the **lowest to the highest**, text from **A to Z**. Fixtures with an empty X-Axis value are shown as one bar named **(Blank)**.

8. **Data of the chart**

   The chart must:

   * use the data of the **generated Fixture Report table** (the fixtures of the report's Date Range, with every office and status), and
   * **update automatically when the report is refreshed** or edited.
   * The filters, the hidden columns and the column order of the **Reports** tab do not change the chart (see **Fixture Report - Table Filters** and **Show Hide / Reorder**).

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Fixture Report → **Charts** dashboard → Create New | Option **Bar Chart** |
| **Add Bar Chart** overlay | Chart Name, X-Axis, Date Group By (conditional), Y-Axis, Aggregation; Cancel and Create |
| Charts dashboard | New Bar Chart widget, with blank state when not feasible |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type.

---

#### **Out of Scope:**

* The **Stacked Bar Chart** and **Pie Chart** (separate stories) and the **Pivot Table**.
* Moving, resizing, editing and deleting a chart (**Fixture Report - Report Dashboard**).
* Sorting the bars, showing only the top N values, data labels, legends and exporting the chart.
* Filtering the chart by a year or any other field (the report's Date Range already limits the fixtures).

---

#### **To be confirmed:**

* **Date Group By options.** The PCER story gives **Year (default)** and **Month**; the first Fixture Report design also had **Day**. The Product Owner asked for month and year, "like Excel", so **Day** is left out. Confirm that **Day** is not needed. (Decided 2026-11-05: **Month** means year and month together, for example 2022-03.)
* **Count and empty values.** Decided 2026-11-05: **Count works on any column, as in the PCER** (so the PCER story's note that Count can fail on a text or date column is not followed). Open detail: whether a fixture whose Y-Axis value is empty is counted. Proposed default: yes, **Count is the number of fixtures in the bucket**. This has not been checked on the PCER.
* **Decided, no rule needed (2026-11-05):** summing amounts in different currencies (for example GROSS FREIGHT) is allowed with no warning; a column with very many values gives as many bars as it has values, with no limit; two charts of one report may have the same name.
* **Field label.** The PCER story calls the first field **Chart Name** in the field list and **Chart Title** in the actions and in the reference image. This story uses **Chart Name**, as the PCER screen does.
* **Empty values in Sum and Average.** Proposed default: ignored (AC 4). Confirm.

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads (chart rendering time for reports with many fixtures).

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
