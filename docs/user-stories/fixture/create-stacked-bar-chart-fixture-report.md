#### **Fixture Report - Create Stacked Bar Chart**

**COEMS ID:** *(to be assigned)*

---

#### **USER Story:**

**As a User,**
**I want to** create a **Stacked Bar Chart** from the generated Fixture Report data
**So that** I can analyse how different categories contribute to a total, either as **absolute values** or as **percentages** (for example the fixtures of each month split by currency).

> Follows **PCER - Create Stacked Bar (COEMS-13906)**, and works like **Fixture Report - Create Bar Chart**, with a **Stack By** field and a **Display In** option added. The chart is a widget on the **Charts** dashboard; moving, resizing, editing and deleting it are in **Fixture Report - Report Dashboard**. The chart reads the table of the Fixture Report (see **Fixture Report - Report Table Listing**).

---

#### **acceptance criteria:**

1. **Entry Point / Flow**

   * The user goes to the **Charts Dashboard** of the Fixture Report.
   * The user clicks **Create New → Stacked Bar Chart**.
   * An **"Add Stacked Bar Chart"** configuration overlay opens.
   * The user configures the chart fields and clicks **Create**.
   * The Stacked Bar Chart is added to the dashboard.

2. **Add Stacked Bar Chart overlay: fields (in order)**

   | **#** | **Field** | **Type** | **M/O** | **Options / Rules** |
   | --- | --- | --- | --- | --- |
   | 1 | Chart Name | Text input | M | Editable by the user. Two charts of one report may have the same name. |
   | 2 | X-Axis | Dropdown (single select) | M | Options: **all available report columns**, which are the columns of the Fixture Report table (the columns chosen in **Select required columns**, whether or not they are hidden in the table view). No column is selected at first. |
   | 3 | Date Group By (conditional) | Dropdown (single select) | M (when shown) | Displayed **only when the selected X-Axis is a Date or Date and time column**. Options: **Year (Default)**, **Month**. See AC 3. |
   | 4 | Y-Axis | Dropdown (single select) | M | Options: **all available report columns** (no restrictions). It represents the value to be **aggregated and stacked**. No column is selected at first. |
   | 5 | Aggregation | Dropdown (single select) | M | Default: **Count**. Options: **Count**, **Sum**, **Average**. See AC 4. |
   | 6 | Stack By | Dropdown (single select) | M | Options: **all available report columns**. It determines **how each bar is split into stacked segments**: one segment for each value of the chosen column. No column is selected at first. |
   | 7 | Display In | Radio option | O | Options: **Values (Default)**, **Percentage**. See AC 5. |

3. **Date Group By**

   * The Date and Date and time columns of the Fixture Report are: BOOKING DATE, DELIVERY DATE, REDELIVERY DATE, CREATED ON, MODIFIED ON, VOYAGE START DATE, LAYCAN START and LAYCAN END.
   * When the user selects one of them as X-Axis, the **Date Group By** field must appear with **Year** selected. When the user selects another column, the field must disappear.
   * **Year**: one bar per year (for example 2022). **Month**: one bar per month of each year (for example 2022-03). For a Date and time column, the time is ignored.
   * Fixtures with no value in the date column are shown as one bar named **(Blank)**.

4. **Aggregation**

   Aggregation is applied to compute the **Y-Axis value for each X-Axis category and each Stack By value** (each segment of each bar).

   | **Aggregation** | **Y-Axis column** | **Result for each segment** |
   | --- | --- | --- |
   | Count | Any column (Text, Number, Date and so on), as in the PCER | The number of fixtures in the segment |
   | Sum | A Number column | The total of the Y-Axis values (empty values are ignored) |
   | Average | A Number column | The average of the Y-Axis values (empty values are ignored) |
   | Sum or Average | A Text, Date, Date and time or Yes / No column | **Not feasible**: see AC 8 |

5. **Display In**

   * **Values** (default): the stacked segments show the **absolute aggregated values**.
   * **Percentage**: the stacked segments are **normalised so that each bar totals 100%**. This applies to every aggregation. With **Count** or **Sum** each segment is its share of the bar's total (for example 30 of 40 fixtures is 75%). With **Average**, each segment's average is shown as a share of the sum of the segments' averages of that bar; there is no special rule.

6. **Actions**

   * **Cancel**
     * Closes the **Add Stacked Bar Chart** overlay immediately. The **×** icon of the overlay does the same.
     * **No stacked bar chart must be created.**
     * Any value selected in the overlay (Chart Name, X-Axis, Date Group By, Y-Axis, Aggregation, Stack By, Display In) must be **discarded**.
     * The user must be returned to the Charts Dashboard in the same state as before opening the overlay.
   * **Create**
     * Creates a new **Stacked Bar Chart widget** on the Charts Dashboard using the selected configuration.
     * When clicked, the overlay must close and the stacked bar chart must be added to the dashboard (at the top left, as in **Fixture Report - Report Dashboard**).

7. **Create button enabled**

   The **Create** button must be enabled **only when**:

   * the Chart Name is provided, and
   * the X-Axis is selected, and
   * the Y-Axis is selected, and
   * the Stack By is selected, and
   * the Aggregation is selected.

   (Date Group By and Display In always have a value, so they never block **Create**.)

8. **Chart rendering after creation**

   * If the selected configuration is **feasible**, the stacked bar chart must be rendered using:
     * the X-Axis (with Date Group By if applicable),
     * the Y-Axis,
     * the Aggregation,
     * the Stack By, and
     * the Display In choice (Values or Percentage).
   * The stacking must be visualised by **different colours inside a bar**, one colour for each Stack By value, with a **legend** that names the values. A Stack By value must have the **same colour in every chart** of the report (for example US Dollar is always the same colour). The **axis titles** show the names of the chosen columns.
   * If the selected configuration is **not feasible** (for example Sum of a Text column), or the report has no fixtures, the stacked bar chart must **still be created**, and it must render a **blank state** with the message **"No data available for the selected chart configuration."**
   * The bars must be in this order: dates in **time order**, numbers from the **lowest to the highest**, text from **A to Z**. Fixtures with an empty X-Axis or Stack By value are shown as one bar or segment named **(Blank)**.

9. **Data of the chart**

   The chart must:

   * use the data of the **generated Fixture Report table** (the fixtures of the report's Date Range, with every office and status), and
   * **update automatically when the report is refreshed** or edited.
   * The filters, the hidden columns and the column order of the **Reports** tab do not change the chart (see **Fixture Report - Table Filters** and **Show Hide / Reorder**).

---

#### **Application areas / In Scope Details:**

| **Area** | **Change** |
| --- | --- |
| Fixture Report → **Charts** dashboard → Create New | Option **Stacked Bar Chart** |
| **Add Stacked Bar Chart** overlay | Chart Name, X-Axis, Date Group By (conditional), Y-Axis, Aggregation, Stack By, Display In; Cancel and Create |
| Charts dashboard | New Stacked Bar Chart widget, with blank state when not feasible |

**Historical Data Behaviour:** Not applicable. Fixture Report is a new type.

---

#### **Out of Scope:**

* The **Bar Chart** and **Pie Chart** (separate stories) and the **Pivot Table**.
* Moving, resizing, editing and deleting a chart (**Fixture Report - Report Dashboard**).
* Special colours for a particular Stack By column. The PCER uses the colours of its delay metrics when **Port Stay Delay Status** is the Stack By column; the Fixture Report has no such column.
* A grouped (side by side) bar, sorting the bars, showing only the top N values, data labels and exporting the chart.

---

#### **To be confirmed:**

* **Decided 2026-11-05:**
  * **Dates in Stack By** are not grouped (the PCER story groups dates by year or month for the X-Axis only). If the user stacks by a date column such as BOOKING DATE, each different date is a segment.
  * **Many segments** need no rule: a Stack By column such as ACCOUNT (about 200 values) gives as many segments as it has values, with no limit.
* **Decided 2026-11-05 (proposals kept):**
  * **Colours:** a **fixed colour for each value**, so a value such as US Dollar has the same colour in every chart of the report (AC 8).
  * **Percentage with Average:** allowed, with no special rule: each segment's average is shown as a share of the sum of the segments' averages of that bar (AC 5).
* **Blank state message.** The PCER story says "render a blank state" without a message. This story uses the same message as the Bar Chart.
* **Count and empty values.** As in **Fixture Report - Create Bar Chart**: proposed default, **Count** is the number of fixtures in the segment, even if the Y-Axis value is empty.
* **Field label.** The PCER story says **Chart Name** in the field list and **Chart Title** in the actions. This story uses **Chart Name**, as the PCER screen does.

---

#### **NON-Functional Requirements:**

To be defined with the Tech Leads (chart rendering time for reports with many fixtures).

| **Particulars** | **Name** | **Date** | **Comments** |
| --- | --- | --- | --- |
| Document Owner | Arun Kumar | 05-11-2026 | |
| Reviewed By | | | |
| Product Manager Signoff | | | |
