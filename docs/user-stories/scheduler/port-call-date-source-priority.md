#### **USER Story:**

**As a user viewing the Scheduler,**
**I want** each port call to be drawn from the best dates available for it — the actual dates once the vessel has arrived and sailed, otherwise the next most reliable set of dates
**So that** the Scheduler shows what has really happened and, where nothing has happened yet, the most reliable plan, instead of depending on a single fixed pair of dates.

> The Scheduler draws each port call as a bar on the vessel's row, between an arrival date-time and a departure date-time. This story changes **which dates** are used for that bar. It does not change how the bar looks, how bars are laid out on lines, or the Port Call details panel.

---

#### **Current behaviour (observed on UAT, 13 Oct 2026):**

* A port call that has **actual** arrival and departure (ATA / ATS) is drawn from them.
* Otherwise it is drawn from the **ETA / ETS** shown in the Port Call details panel. On every port call checked (Phu My, Dundee, Las Palmas, Gdynia), the ETA / ETS equal the **Budgeted** arrival and departure in the Voyage module's Arrival and Departure Report.
* The **Expected** arrival and departure are not used. As a result, for a voyage that has not been completed, the Scheduler can differ from the Voyage page, which shows the Expected dates. For example, Dundee on voyage FAS 2605 is 9 Oct on the Voyage page and 10 Oct in the Scheduler.

---

#### **acceptance criteria:**

1. **Order of preference**

   For each port call, the Scheduler must draw the bar from the **first available set of dates**, in this order:

   | **Priority** | **Dates used** | **Where they come from** |
   | --- | --- | --- |
   | 1 | **ATA / ATS** | Actual arrival and departure |
   | 2 | **Expected** | Expected Arrival and Expected Departure in the Arrival and Departure Report |
   | 3 | **ETA / ETS** | The Port Call's ETA and ETS |
   | 4 | **Budgeted** | Budgeted Arrival and Budgeted Departure in the Arrival and Departure Report |

   Example (UAT data): Dundee on voyage FAS 2605 has no actuals. It must be drawn from its **Expected** dates (9 Oct 06:19 → 12 Oct 06:19, port time), matching the Voyage page, and no longer from its ETA / ETS (10 Oct → 13 Oct).

2. **What "available" means**

   A set of dates is available when **both** its arrival and its departure date-time are filled in. If one of the two is missing, that set is skipped and the next one in the order is used.

3. **Decided per port call**

   * The choice is made **separately for every port call**. Port calls of the same voyage can be drawn from different sets (for example, completed port calls from Actual and later ones from Expected).
   * It is made again every time the Scheduler loads or is refreshed. When a higher set becomes available (for example, ATA / ATS are recorded), the bar moves to it on the next load, with no manual action.

4. **Nothing available**

   If none of the four sets is available for a port call, the Scheduler must not draw that port call. [Not specified. This is a proposed default.]

5. **Everything that depends on the bar follows the chosen dates**

   * The **voyage outline** must run from the arrival of the voyage's first port call to the departure of its last port call, as drawn.
   * The **hatched transit** between two consecutive port calls must run from the first one's departure to the next one's arrival, as drawn.
   * The **line assignment** (bars that do not overlap in time share one line; bars that overlap are separated, at hourly resolution) must use the chosen dates.

6. **No other change**

   * The bar's label (port name and laydays), tooltip, colour, minimum width and the Port Call details panel stay as they are today.
   * Berth dates are not used by the Scheduler.

7. **Applies to every vessel and every view**

   The order applies uniformly to every vessel row in the **All Vessels** view. [Whether the **Vessels** (single-vessel calendar) view draws from the same dates was not checked. See "To be confirmed".]

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Scheduler → port call bar | Arrival and departure of each bar are taken from the first available set: ATA / ATS, then Expected, then ETA / ETS, then Budgeted |
| Scheduler → voyage outline, transit and line assignment | Follow the dates the bar is drawn from |

---

#### **Out of Scope:**

* How Expected and Budgeted dates are calculated, or when Expected is recalculated. These stay in the Voyage module.
* Any change to the Port Call details panel, the Arrival and Departure Report, or the Voyage page.
* Berth dates.
* A visual cue showing which set a bar was drawn from, and a colour legend. [Both are worth considering, see "To be confirmed".]
* The time zone used by the Scheduler grid.

---

#### **To be confirmed:**

* **ETA / ETS and Budgeted.** On the port calls checked, ETA / ETS **equal the Budgeted dates**. If they always do, priorities 3 and 4 give the same result. Please confirm whether ETA / ETS can ever differ from Budgeted.
* **Arrival and departure together or separately.** This story treats each set as a pair. A vessel that is **in port** (ATA recorded, no ATS yet) would therefore be drawn from Expected (or the next available set), ignoring its real arrival. The alternative is to take **each end separately** (arrival from ATA, departure from the next available set), with a rule that a bar never ends before it starts.
* **Nothing available** (AC 4): not drawn, or drawn some other way.
* **Single-vessel (Vessels) view:** whether it follows the same order.
* **A visual cue** for which set a bar comes from (for example, a different outline for planned versus actual dates), so that users can tell a forecast from something that happened.
