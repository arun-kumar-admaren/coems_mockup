#### **Fixture Report - Create Pie Chart**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a User,**
**I want to** create a **Pie Chart** from the generated Fixture Report data
**So that** I can understand how values are distributed across different categories, for example the share of fixtures or freight of each customer, cargo type or currency.

> Follows **PCER - Create New Pie Chart (COEMS-13927)**, and works like **Fixture Report - Create Bar Chart** and **Create Stacked Bar Chart**. The chart is a widget on the **Charts** dashboard; moving, resizing, editing and deleting it are in **Fixture Report - Report Dashboard**. The chart reads the table of the Fixture Report (see **Fixture Report - Report Table Listing**).

---

#### **acceptance criteria:**

1. **Description / Scope**

   * The Pie Chart represents the **distribution of a total** across the selected categories. It is used to visualise the **percentage contribution** of each category, although the calculation may use counts or numeric values.
   * The Pie Chart follows the same **free-form configuration approach** as the other charts: there is **no restriction on the column selection**. If the selected configuration is not feasible, the chart is rendered as **blank**.

2. **Entry Point / Flow**

   * The user goes to the **Charts Dashboard** of the Fixture Report.
   * The user selects **Create New → Pie Chart**.
   * An **"Add Pie Chart"** overlay opens.
   * The user configures the pie chart fields and clicks **Create**.
   * The Pie Chart is added to the dashboard.

3. **Add Pie Chart overlay: fields (in order)**

   | **#** | **Field** | **Type** | **M/O** | **Options / Rules** |
   | --- | --- | --- | --- | --- |
   | 1 | Chart Name | Text input | M | Editable by the user. Two charts of one report may have the same name. |
   | 2 | Category (Slice By) | Dropdown (single select) | M | Options: **all available report columns**, which are the columns of the Fixture Report table (the columns chosen in **Select required columns**, whether or not they are hidden in the table view). It determines **how the pie is divided into slices**: one slice for each value of the chosen column. No column is selected at first. |
   | 3 | Value | Dropdown (single select) | M | Options: **all available report columns** (no restrictions). It represents the **data to be aggregated for each slice**. No column is selected at first. |
   | 4 | Aggregation | Dropdown (single select) | M | Default: **Count**. Options: **Count**, **Sum**, **Average**. See AC 4. |
   | 5 | Year (Filter) | Multi-select dropdown | O | Lists the years of the report. See AC 5. |

4. **Aggregation**

   Aggregation is applied to compute the **Value for each slice** (each Category value).

   | **Aggregation** | **Value column** | **Result for each slice** |
   | --- | --- | --- |
   | Count | Any column (Text, Number, Date and so on), as in the PCER | The number of fixtures in the slice |
   | Sum | A Number column | The total of the Value column (empty values are ignored) |
   | Average | A Number column | The average of the Value column (empty values are ignored). Each slice's share is its average as a share of the sum of the slices' averages (as for the Percentage of the Stacked Bar Chart). |
   | Sum or Average | A Text, Date, Date and time or Yes / No column | **Not feasible**: see AC 9 |

5. **Year (Filter)**

   * In a Pie Chart, the year is handled **only through this filter**. The **Category** defines the slices and the **Value** defines their size: **neither is used to group dates**. There is no **Date Group By** field in the Pie Chart, and a date column used as Category gives one slice for each different date.
   * To view a pie chart for a specific year, the user selects that year in **Year (Filter)**. The filter applies to the **year of the report's Based on date** (for example the Booking Date, when the report is Based on Booking Date).
   * The user must be able to select **one or more years**. The dropdown is a **multi-selection** dropdown and lists **all the years available in the report**.
   * When **several years** are selected:
     * the records of **all the selected years** are included in the data,
     * the slice values are calculated from the **combined data** of the selected years,
     * the slice percentages are recalculated on the **combined total**, and
     * the chart must **not separate or group the slices by year**.
   * If **no year is selected**, the chart uses the data of **all the years** of the report.
   * If the selected years give **no matching records**, the chart renders the blank state (AC 9).
   * Adding or removing a year must **update the pie chart dynamically**.

6. **Actions**

   * **Cancel**
     * Closes the **Add Pie Chart** overlay immediately. The **×** icon of the overlay does the same.
     * **No pie chart must be created.**
     * Any value selected or entered in the overlay (Chart Name, Category, Value, Aggregation, Year filter) must be **discarded**.
     * The user must be returned to the Charts Dashboard in the same state as before the overlay was opened.
   * **Create**
     * Creates a new **Pie Chart widget** on the Charts Dashboard using the selected configuration.
     * When clicked, the overlay must close and the pie chart must be added to the dashboard (at the top left, as in **Fixture Report - Report Dashboard**).

7. **Create button enabled**

   The **Create** button must be enabled **only when**:

   * the Chart Name is provided, and
   * the Category (Slice By) is selected, and
   * the Value is selected, and
   * the Aggregation is selected.

   (The **Year (Filter)** is optional and never blocks **Create**.)

8. **Chart rendering after creation: feasible configuration**

   If the selected configuration is **feasible**, the pie chart must be rendered using the Category (Slice By), the Value, the Aggregation and the applied Year filter (including a selection of several years).

   * **Different colours** must show the slices, and a **legend** must name them. A Category value must have the **same colour in every chart** of the report (as in the Stacked Bar Chart).
   * Hovering a slice must show its **name, its value and its percentage** of the total.
   * The slices must be in this order: dates in **time order**, numbers from the **lowest to the highest**, text from **A to Z**. Fixtures with an empty Category value are shown as one slice named **(Blank)**.

9. **Chart rendering after creation: blank state**

   * If the selected configuration is **not feasible** (for example Sum of a Text column), the pie chart must **still be created**, and it must render a **blank state**.
   * The chart must also render the blank state when the selected years give **no matching records**, or the report has no fixtures.
   * The blank state shows the message **"No data available for the selected chart configuration."**

10. **Data of the chart**

    The chart must:

    * use the data of the **generated Fixture Report table** (the fixtures of the report's Date Range, with every office and status), and
    * **update automatically when the report is refreshed** or edited.
    * The filters, the hidden columns and the column order of the **Reports** tab do not change the chart (see **Fixture Report - Table Filters** and **Show Hide / Reorder**).

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Fixture Report → **Charts** dashboard → Create New | Option **Pie Chart** |
| **Add Pie Chart** overlay | Chart Name, Category (Slice By), Value, Aggregation, Year (Filter); Cancel and Create |
| Charts dashboard | New Pie Chart widget, with blank state when not feasible |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type.

---

#### **Out of Scope:**

* The **Bar Chart** and **Stacked Bar Chart** (separate stories) and the **Pivot Table**.
* Moving, resizing, editing and deleting a chart (**Fixture Report - Report Dashboard**).
* Grouping dates by year or month inside a Pie Chart (only the Year filter).
* Special colours for a particular Category column. The PCER uses the colours of its delay metrics when **Port Stay Delay Status** is the Category; the Fixture Report has no such column.
* Showing only the top N slices with the rest as "Others", data labels on the slices and exporting the chart.

---

#### **To be confirmed:**

* **Which date the Year (Filter) uses.** The PCER story says the filter is on a date field (for example ATA or ATS Year), and the PCER screen has one **Year (Filter)** field. The Fixture Report has several dates. Proposed default: the **year of the report's Based on date**, with one **Year (Filter)** field. Alternative: a choice of the date column for the filter. Note that the report's Date Range already limits the fixtures; the filter is for a report that covers several years.
* **Many slices.** A Category column with many values (for example ACCOUNT, with about 200) gives as many slices. For the Bar and Stacked Bar Charts, no limit was decided (2026-11-05). Assumed the same here. Confirm.
* **Zero and negative values.** A pie cannot show a slice with a negative total (for example the Sum of BALANCE if it is negative). Proposed default: slices with a zero or negative value are not drawn; if no slice is left, the blank state is shown.
* **Blank state message.** The PCER Pie story says **"No data is available for the selected chart configuration."** and the Bar Chart story **"No data available for the selected chart configuration."** This story uses the second wording for all charts.
* **Count and empty values.** As in **Fixture Report - Create Bar Chart**: proposed default, **Count** is the number of fixtures in the slice, even if the Value column is empty.
* **Field label.** The PCER story says **Chart Name** in the field list and **Chart Title** in the actions. This story uses **Chart Name**, as the PCER screen does.

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads (chart rendering time for reports with many fixtures).

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
