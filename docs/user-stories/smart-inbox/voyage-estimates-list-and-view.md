#### **USER Story:**

**As a** chartering user reviewing an email in Smart Inbox,
**I want to** see every Voyage Estimate already produced from this email's Inquiry and Fixtures, grouped by the record that produced them, and open any one of them in a full workspace view,
**So that** I can trace the commercial chain from email to Inquiry/Fixture to Estimate, and inspect an estimate's full detail without leaving the email.

---

#### **acceptance criteria:**

1. **Entry point:** the "Voyage Estimate" icon on the side rail opens this panel for the currently open email, with a short explanatory line: *"Voyage estimates created from the Inquiries / Fixtures on this email."*

2. **Grouped, not a flat list:** estimates are grouped under whichever Inquiry or Fixture produced them — one group for the email's Inquiry (if one has been AI-created or created manually), and one further group per Fixture already created on that email (whether converted from the Inquiry or created manually). An email with neither shows an empty state instead: *"No voyage estimates yet."* / *"Create an Inquiry or Fixture from this email first."*

3. **Group header:** an Inquiry group shows a document-search icon, the Inquiry's Cargo Number, its cargo name, an **"INQUIRY"** badge, and the estimate count for that group ("{N} estimate(s)"). A Fixture group shows the same layout with a document icon, the Fixture Number, its cargo name, and a **"FIXTURE"** badge instead.

4. **Multiple groups per email:** every Fixture already created on the email gets its own separate group — an email with one Inquiry and two Fixtures created from it shows three separate estimate groups, each with its own table.

5. **Per-group table columns:** Estimate Number (rendered as a link, with a small expand icon beside it — both open the same detail popup, AC 7), Estimate Name, Vessel Name, Created On, Created By.

6. **Estimate counts and values are deterministic:** an Inquiry group typically lists 2–3 estimates, a Fixture group typically lists 1–2. The exact count and every value shown (route name, vessel, dates, creator) is generated deterministically per Inquiry/Fixture, so it stays stable across re-renders rather than changing on every view.

7. **Opening the detail popup:** clicking an Estimate Number, or its adjacent expand icon, opens a full-size Voyage Estimate detail pop-up reproducing the real Voyage Estimate workspace, containing:
   - A top tab bar ("All Estimates" plus other open-estimate tabs, decorative) with the clicked estimate's tab active.
   - Header fields: Estimate Name, Vessel, Start Date, Status, Previous Voyage, EU ETS, Running Cost, VLSFO/MGO bunker prices, EU ETS/FUEL EU toggles, and Target TCE & P/L / Result / Review Checklist actions.
   - A map pane with a stylised route between numbered port pins, plus floating cards for any linked fixtures (number, ports, cargo tag, amounts).
   - A Particulars panel: full P&L breakdown (Gross Freight → Profit/Loss), a Bunker table (VLSFO/MGO rate/consumption/cost), and an EU ETS Emissions summary.
   - An expandable Port Calls table (per-port distance/speed/draft/fuel/extra + amount), an Assign Port Calls toolbar, Suez/Kiel/Panama canal toggles, and Expand All / Collapse All controls.
   - A Port/Cargo/Voyage/Emission tab switcher for Port Income & Expense — only the **Port** tab shows real subtotal data; Cargo, Voyage, and Emission are explicit MVP-stub placeholders.

8. **What's real vs. illustrative in the popup:** only the clicked row's Estimate Name and Vessel are carried into the popup's header fields; every other figure shown (P&L, bunkers, port calls, map) is static demo content, not calculated from the clicked estimate's own data.

9. **Closing the popup:** a "✕" closes it and returns to the grouped table, with both the Estimate Number link and its expand icon still available on that row to reopen it.

---

#### **Out of scope**

* Creating or editing a Voyage Estimate from within Smart Inbox — this panel and popup are view-only; estimates only ever appear as a side effect of an Inquiry or Fixture already existing on the email.
* Real freight/cost calculation — every figure shown, in both the grouped table and the detail popup, is illustrative mock data, not computed from the Inquiry/Fixture's actual field values.
* The other tabs in the popup's top tab bar ("All Estimates" and sibling estimate tabs) — decorative only; they don't switch to a different estimate's data.
* Cargo, Voyage, and Emission tabs of the Port Income & Expense panel — explicitly out of scope for this MVP; only Port is built.

#### **Open items**

1. **The gear/settings icon in the Voyage Estimate panel header has no action wired to it** — the same unwired-decorative-control pattern already flagged for the Archive button elsewhere in Smart Inbox.
2. **Whether estimate figures should eventually reflect the originating Inquiry/Fixture's real freight and cost data is undecided** — today only the first estimate in a group derives its route name from the group's actual load/discharge ports; everything else is unrelated mock data.
3. **The popup's top tab bar implies multiple estimates can be open at once** (like browser tabs) but this isn't functional yet — worth deciding whether to build it out or simplify it away.
