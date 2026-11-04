#### **USER Story:**

**As a user viewing the Position List,**
**I want** each vessel's list to open already positioned on that vessel's **Transit card** or **Current port card**, to load further voyages automatically as I scroll, and to return to that card with one click
**So that** I can see where every vessel is right now without scrolling or clicking "Load More Voyages", and can get straight back to it after looking at other cards.

> The Position List is a board with one column per vessel. Each column lists the vessel's voyages, and each voyage lists its port call cards, with a leg (Duration / Speed / Distance) between two port calls. This story changes how a vessel's column is positioned and loaded. It does not change what a card shows or the order of voyages and port calls.

---

#### **Terms used in this story:**

| **Term** | **Meaning (as highlighted on the board today)** |
| --- | --- |
| **Current port card** | The port call card with the yellow border: the vessel has arrived (ATA recorded) and has not yet sailed (no ATS). |
| **Transit card** | The leg highlighted in yellow between two port call cards: the vessel has left one port and has not yet arrived at the next. |

A vessel should have only one of these at any time. In practice some vessels show more than one, because older voyages that were never closed keep their highlight (see AC 3).

---

#### **Current behaviour:**

* Each vessel column starts at its first voyage. Only **two voyages** are loaded, and a **"Load More Voyages"** button at the bottom of the column adds the next two.
* A user who wants to see where a vessel is now has to scroll down or keep pressing **Load More Voyages** until the highlighted Current port card or Transit card appears.
* The column header shows only the vessel name.

---

#### **acceptance criteria:**

1. **Opens on the current position, centred**

   * When the user opens the Position List, **every vessel column** must automatically scroll so that the vessel's **Transit card or Current port card**, whichever is available, is shown **centred** in the column.
   * If the card is too close to the start or the end of the list to be centred, it is shown as near the centre as the list allows.
   * This is the **default view**. The user must not need to scroll, click or load anything to see it.
   * It applies again each time the Position List is opened or reloaded.

2. **Each vessel is positioned on its own**

   * Each column is positioned independently of the others, and one vessel's position never moves another vessel's column.
   * A column that finishes loading later than the others must still end up positioned on its own current card.

3. **More than one Transit or Current port card**

   * If a vessel has more than one Transit card and/or Current port card, the list must be positioned on the **last one in list order**, which is the one in the most recent voyage, lowest in the column. (On staging this happens on several vessels, because older voyages were never closed and kept their highlight.)

4. **Vessels with no current position**

   * If a vessel has neither a Transit card nor a Current port card, its column opens from the start of its list, as it does today. (On staging this is the case for 101 of 139 vessels.)

5. **"Load More Voyages" removed**

   * The **"Load More Voyages"** button must no longer appear in any vessel column.

6. **Lazy loading**

   * Voyages must instead load **automatically as the user scrolls** in a vessel column, so that the user can reach every voyage of the vessel by scrolling alone.
   * Loading continues in the existing order (see AC 10). Because a column opens at the current position, voyages must be loaded in **both directions**: earlier voyages when the user scrolls up, later voyages when the user scrolls down. [Not specified. This is a proposed default.]
   * The voyage containing the Transit card or Current port card must be loaded **first**, so that AC 1 works without any scrolling.
   * Cards already in view must not jump when more voyages load around them. [Not specified. This is a proposed default.]
   * Loading one column must not hold up the others.

7. **"Current Position" icon**

   * The **header of every vessel column** must show an **icon next to the vessel name**.
   * Hovering over the icon must show the tooltip **"Current Position"**.

8. **Clicking the icon**

   * Clicking the icon must scroll **that vessel's list** so that its **Transit card or Current port card** is shown **centred**, in the same way as AC 1.
   * It is for the user who has scrolled away to look at other cards and now wants to return to the vessel's current position.
   * It moves only that vessel's column. All other columns, and the horizontal position of the board, stay as they are.
   * If the current card is in a voyage that has not been loaded yet (because of lazy loading), the list must load what is needed and then scroll to it.
   * If AC 3 applies, it goes to the same card as in AC 3.

9. **When there is nothing to go to**

   * For a vessel with no Transit card and no Current port card, the icon is shown **disabled**. [Not specified. This is a proposed default.]

10. **No change to the existing order and content**

    * Voyages and port calls keep the order they have today. Lazy loading must not re-sort them.
    * Cards, legs, colours, tooltips, the Arrival and Departure Report and the Status and Vessel filters work as they do today.

11. **Works with the filters**

    * Positioning, lazy loading and the icon apply to whatever the Vessel and Status filters currently show.
    * If the filters hide the voyage that holds the current card, the vessel counts as having no current position (AC 4, AC 9).

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Position List → each vessel column | Opens with the Transit card or Current port card centred |
| Position List → each vessel column | "Load More Voyages" button removed; voyages load automatically on scroll |
| Position List → vessel column header | New "Current Position" icon with tooltip that scrolls the column to the Transit card or Current port card |

---

#### **Out of Scope:**

* The content of cards and legs, the colours and highlights, and the order of voyages and port calls.
* The Vessel and Status filters, and the Arrival and Departure Report.
* How a vessel is judged to be "in port" or "in transit". The board's existing highlighting is used as it is.
* Sorting the list by date or any new sorting option.
* How many voyages load each time, and any loading indicator.

---

#### **To be confirmed:**

* **Disabled icon** (AC 9): disabled, hidden, or showing a message when there is nothing to go to.
* **Icon appearance and exact position** in the column header.
