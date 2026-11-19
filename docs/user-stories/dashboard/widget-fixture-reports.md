# Dashboard - Fixture Reports as a Widget

**As a user,**
**I want to** add report charts and pivots to my dashboard by choosing a Fixture Report and the charts I want from it
**So that** I can keep the figures I care about on my dashboard without opening the report each time.

**Acceptance Criteria**

1. **Opening the pop-up**

   * The **Add Widget** list on the My Dashboard tab must include **Select Reports**.
   * When the user clicks **Select Reports**, a **pop-up menu** must open. Nothing is added to the dashboard until the user has made a selection in it.

2. **Availability of Widget**

   * The "Fixture Reports" widget should be available for users who have access to the following Desks:
     * Chartering
   * If the Desk access for the user is revoked/changed, the currently configured Widget should show a blank state with the following message: "Desk Access Removed, No Data Available"

3. **Select Fixture Report**

   * The pop-up must have a **Select Fixture Report** dropdown field.
   * The dropdown must list **all the available Fixture Reports**.

4. **Select Chart / Pivot**

   * The pop-up must have a **Select Chart / Pivot** dropdown field.
   * It must list **all the available charts inside the selected Fixture Report**.
   * If the selected Fixture Report has **no charts available**, the field must be **empty**.
   * The user must be able to select **multiple** charts.
   * **No duplicates** are allowed: the same chart cannot be selected more than once.

5. **Charts displayed on the dashboard**

   * Once the user selects the Fixture Report and charts, the **selected charts must display on the dashboard**.
   * For reference, the **Fixture Report name must appear as a subheading in each chart**.
   * Each chart must appear at its **default minimum size**, without overlapping any other widget.

6. **Can be added again**

   * Unlike My Tasks, Map, and Worklogs, the **Select Reports** option is **not** disabled in **the Add Widget** after charts have been added. The user can open the pop-up again to add charts from the same or another Fixture Report.

7. **Refresh**

   * Each chart must show a **Refresh** icon in its header. Clicking it must reload that chart's data.
   * Refresh must not change the chart's size or position and must not reload any other widget.

8. **Resize**

   * The user must be able to increase or decrease a chart's size within the defined limits and must not be able to reduce it below its minimum allowed size.
   * The chart, its title, and the Fixture Report subheading must stay readable at minimum size.

9. **Delete and persistence**

   * Each chart must have a delete control that removes it from the dashboard. The remaining widgets must adjust so no gaps or overlaps remain.
   * The charts on the dashboard (including which Fixture Report each belongs to), and their positions and sizes, must persist for the user across sessions.
