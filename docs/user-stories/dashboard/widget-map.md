#### **USER Story:**

**As a user,**
**I want to** add a **Map** widget to my dashboard with a single click
**So that** I can see where vessels are on a live map alongside my other dashboard information, and size it to suit my screen.

> Part of **"Customisable Dashboard Widgets"** (the My Dashboard tab of the platform-wide Dashboard shows widgets instead of fixed sections). This story covers the **Map** widget only. The behaviour common to every widget (default minimum size, resizing within limits, moving, Refresh, Delete, per-user persistence, no overlap) is defined there and applies here too.
>
> The Map widget is the **existing vessel map on My Dashboard**. It is not the separate **Map (BETA)** page in the Engineering sidebar, which is unchanged.

---

#### **acceptance criteria:**

1. **Adding the widget**

   * The **Add Widget** list on the My Dashboard tab must include **Map**.
   * When the user clicks **Map**, the widget must be **added to the dashboard directly**, with no pop-up and no configuration step.
   * The new widget must appear at its **default minimum size**, without overlapping any other widget.

2. **Disabled in "Add Widget" once added**

   * Once Map is on the dashboard, its option in **Add Widget** must be **disabled**, so only one Map widget can exist.
   * If the widget is deleted, the option must become **enabled** again.

3. **Content: the existing vessel map**

   The widget must show the same embedded vessel map as the current My Dashboard:

   * Live vessel positions plotted worldwide as markers, each labelled with a short vessel code/callsign
   * A **fullscreen** expand control in the top-right corner of the map
   * Standard Google Maps controls and attribution (zoom, "Keyboard shortcuts", "Map data", "Terms")

4. **Vessel info card**

   Hovering a vessel marker must show an info card with: **Vessel Name**, **IMO**, **Type**, **Destination**, **ETA**, **Speed** (Kn), **Course** (degrees), **Status** (e.g. "AT ANCHOR"), a source note (**"Updated from Terrestrial"**), a **Last Updated** timestamp, and a close (✕) control.

5. **Shown by default**

   * For a user who has not customised the dashboard, Map must appear as a widget by default. The user can delete it at any time.

6. **Refresh**

   * The widget header must show a **Refresh** icon. Clicking it must reload the vessel positions and the information shown on the markers.
   * Refresh must not change the widget's size or position, must not reset the map's current zoom and position, and must not reload any other widget. [Whether the map's current view is kept on refresh was not specified. This is a proposed default.]

7. **Resize and move**

   * The user must be able to increase or decrease the widget's size within the defined limits, and must not be able to reduce it below its minimum allowed size.
   * The map must fill the widget at any size, and its controls (zoom, fullscreen) must remain visible and usable at minimum size.
   * The **fullscreen** control must keep working whatever the widget's size.
   * The user must be able to move the widget by dragging it, in the same way as the existing COEMS widgets can be moved. The other widgets must shift so that nothing overlaps.

8. **Delete and persistence**

   * The widget must have a delete control that removes it from the dashboard. The remaining widgets must adjust so that no gap or overlap is left.
   * Deleting must behave as deleting the existing COEMS widgets does, including whether a confirmation is asked.
   * Whether Map is on the dashboard, and its position and size, must persist for the user across sessions.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| My Dashboard → Add Widget | New **Map** entry; added in one click; disabled while the widget is on the dashboard |
| My Dashboard → Map widget | Existing vessel map (markers, info card, fullscreen) hosted inside a resizable, refreshable, deletable widget |

---

#### **Out of Scope:**

* Any change to the vessel data, marker labels or info-card fields.
* The separate **Map (BETA)** page and its list/print toggle.
* New map layers, filters or search.
* The **Group Worklog Dashboard** tab.

---

#### **To be confirmed:**

* Whether the map keeps its current zoom and centre when the widget is refreshed or resized. Proposed default: it does.
