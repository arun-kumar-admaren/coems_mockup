#### **USER Story:**

**As a user viewing the Scheduler,**
**I want** two voyage bars for the same vessel to share one line whenever they don't actually overlap in time — even if they fall on the same calendar date
**So that** the Scheduler doesn't waste an extra line, and doesn't visually suggest two voyages were happening at once when they were really back-to-back.

> The Scheduler lays out each vessel's voyage bars (and the port-call segments inside them) on a monthly grid — one column per date, one or more horizontal lines per vessel row, with a bar pushed onto a new line whenever it would otherwise overlap an existing bar on the same line.

---

#### **acceptance criteria:**

1. **Current behaviour (bug)**

   The line-assignment logic that decides whether two bars for the same vessel can share a line currently compares only the **calendar date** of each bar's start/end, not the **time of day**. As a result, if a vessel's voyage ends at one port and its next voyage starts at another port on the **same date** — just at different times — the two bars are treated as overlapping and pushed onto separate lines, even though there is no real time conflict.

   Observed example: vessel **ANNETTE** left **Abbeville** and arrived at **Lisboa** on **10 September 2026**, at different times that day. Today, the Abbeville bar and the Lisboa bar are rendered on two separate lines within ANNETTE's row, as if the vessel were in both places on the 10th at once.

2. **Fix — compare actual time, not just date**

   The overlap check must be based on each bar's actual start and end **date-time**, not date alone. Concretely, each date column's 24 hours must be treated as distinct positions when determining overlap (i.e. the comparison resolution is hourly, not daily) — two bars that fall on the same date but don't share any hour in common must be treated as non-overlapping.

3. **Outcome**

   * Two bars for the same vessel are placed on the **same line** whenever their actual time ranges do not overlap, regardless of whether they share a calendar date.
   * Two bars are placed on **separate lines** only when their time ranges genuinely overlap (this case must still work exactly as it does today — the fix must not cause truly concurrent bars to be drawn on top of each other).

4. **Applies to every vessel row, not just the examples observed**

   This is a general fix to the line-assignment logic, not a special case for ANNETTE or Atlantic — it must apply uniformly across every vessel in the Scheduler.

5. **No change to the visible date-column layout**

   The grid still shows one column per calendar date, exactly as today. This story only changes how bars are assigned to lines within a vessel's row — it does not add visible hour gridlines or change the month/date header.

6. **Consistent across views**

   If the Scheduler supports more than one zoom level (e.g. week or day view, in addition to the month view shown here), the same hour-based overlap logic must apply at every zoom level, not just month view.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Scheduler → vessel row → bar line-assignment | Overlap detection compares actual date-time (hour resolution), not calendar date alone |

---

#### **Out of Scope:**

* Any change to how a voyage or port-call bar's own width/position is rendered within a date column.
* The visible date-column grid itself (still one column per day).
* Genuinely overlapping voyages/port calls — those must continue to render on separate lines.
