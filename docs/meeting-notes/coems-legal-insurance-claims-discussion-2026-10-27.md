# COEMS - Legal/Insurance/Claims Discussion 27.10.2026

## Minutes of Meeting

**Project:** COEMS – Legal / Insurance / Claims
**Meeting Date:** 27 October 2026 (11:30, approx. 1 hour)
**Meeting Type:** Follow-up discussion on Lena's open-points list (Legal Review, Claims; Insurance deferred)
**Participants:** Lena Pickenpack (UHL), Lukas Krag (UHL), Sajith Salim (Admaren), Arun Kumar (Admaren), Deepak Anthraper (Admaren), Neethu V Mohan (Admaren)
**Planned Go-Live:** Legal Review — UAT updated around 20 November (worst case 23 November), production with the end-of-November major release after regression; Chartering/Legal start using it in December, beginning with a small pilot group.

## Meeting Objective

This session went through the open-points list Lena sent about two weeks earlier, starting with Legal Review and then Claims. Lena could not share her screen (IT issues, joined from her phone), so Arun shared UAT and walked through each point. Deepak noted that all changes agreed so far are already available in UAT. The Insurance module was intentionally not covered; Lena will hold a separate call after checking details with her team.

## 1. Legal Review Module

**Already available in UAT (confirmed live on the call):**

- A review can be created **without any Related To link**; the Inquiry/Fixture connection can be added later.
- For non-Legal users, **Category** and **PIC Legal** are not shown in the create-review view (Legal users see both).

**Tasks and time tracking**

- Lena: the review itself is the task, so a separate task per review is not wanted — but Legal must be able to **track time per review** (KPIs). Lena asked for both the elapsed duration (created to finished) and the hours actually worked.
- Lena's preference: no extra task setup, just a simple way to log "today I worked on this for 2 hours" inside the review.
- Agreed approach (Sajith): when a review is created, **one task is created automatically**, named after the review and linked to it. The **Add Task button is disabled**; multiple tasks may be allowed in future.
- In the review, the user should see **no task at all** — only an **"Add new work log"** button (time spent, date of log, work description) and the **history of logs**. No subtasks and no engineering type.
- A **work-log overview** like Engineering's Group Worklogs (date range, office, group, user filters and grouping) will also be available for reviews.

**Status of each review**

- Statuses To be reviewed (Open), Under review and Review completed apply to every review.
- **Under negotiation, Draft issued, Final issued and Signed apply only to contract reviews** (Review Type = Contract Review Chartering / Contract Review Projects). Arun confirmed this ties directly to Review Type.
- **Status drives the dates on the Fixture/Inquiry Chartering tab:** changing the status to Draft issued, Final issued or Signed updates the matching date field automatically, using the date the status was changed.
- **A review linked to several Fixtures/Inquiries:** when the status changes, a **pop-up checklist** lets the user choose which records receive the update; **all are selected by default** and the user confirms. Lukas: apply the same pattern wherever a change is pushed to several linked records.

**Red Flag**

- Add a **free-text Red Flag field to every review**. Its content is copied to the **Red Flag field on the Fixture Chartering tab**, where it is **read-only for Chartering** (editable by Legal only).
- The same multi-record selection pop-up applies when a review has several linked Fixtures.

**Fixture Chartering tab — Legal section**

- **Legal Review Status field:** Lena asked whether to delete it or connect it to the review status. Lukas first favoured connecting it, but because a Fixture can have several reviews with different statuses, the team agreed to **remove the field from the Chartering tab**; each review's status is already visible on its card.
- **Possible merge of the Legal Review tab into the Chartering tab:** Lena suggested showing the list of linked reviews (with each review's status) at the bottom of the Chartering tab, which would remove one tab. Arun noted the tab exists in Inquiry, Insurance, Claims and others, so doing this for Fixture would mean doing it for Inquiry too, and that all the features (search, add new review, link review) would have to move with it. Arun will do a **short feasibility study**. If it is too much work, the Legal Review tab stays as it is for now.
- **Date fields:** the order and names become **Draft Charter Party Issuance Date | Final Charter Party Issuance Date | Charter Party Signed by Client** (the existing "Charter Party Issuance Date" is renamed; the other two move). These three are connected to the statuses Draft issued, Final issued and Signed. Arun asked whether the same applies to the Inquiry Chartering tab and Lena said yes (see Open Points).

**Additional insurance required**

- Today, ticking the checkbox only enables the free-text "Insurance details" field; there is no automated flow.
- Lena's idea: a notification, a review in the review list, or a new insurance in the insurance list whenever Chartering ticks it. Lukas suggested the decision may belong to Legal during the review, while warning that a clearly required insurance (e.g. a third-party tonnage fixture) must not get missed.
- **No development for now.** Lena will discuss it with her team.

## 2. Insurance

- Not reviewed on this call. Lena will hold a **separate call** once she has checked with her team; she has a detailed list of which fields are needed per insurance type.
- The overview column headers and the split into "Additional Cover" and "Vessel Insurances" lists (from Lena's earlier message) will be discussed in that call.
- Lena may not be available next week; a new date will be agreed after she sends her feedback.

## 3. Claims

- **Operations view:** Arun showed that Operations (non-Legal users) creating a claim from inside a Voyage see only the fields up to Legal Entity — the Additional Information section is hidden. Lena confirmed this is as wanted.
- **Claimant:** it has been mandatory since the beginning. Lena asked to **remove the mandatory validation**.
- **Port Agent:** Operations needs the agent's full address in the e-mail to the broker. The dropdown comes from the Port Agency list and shows a details tooltip with copy options, but most agents have incomplete details. Options discussed: a DA-Desk integration or export (UHL is evaluating DA-Desk for another purpose), or a dropdown plus free text. **Decision (Lukas):** keep the dropdown and fill the details in the Port Agency list; if details are missing, the operator adds them once. Importing a DA-Desk export into COEMS remains a later option.
- **Field order in an existing claim (Legal view):** Lena will send the preferred field order after the meeting. Arun confirmed it is about the claim's Edit overlay, not the Add overlay or the listing columns.
- **Notification when Operations creates a new claim:** wanted. Both an **in-app notification** (bell icon) and an **e-mail**, with the e-mail sent to the general Legal mailbox so all Legal users see it. Lena wants the e-mail at least for the first months. A configurable dashboard widget is planned later (the dashboard exists, the widgets are still in development), and a digest e-mail for inactive users was mentioned as an option. **Update 29.10.2026:** COEMS is restructuring its Notifications functionality internally, so the in-app and e-mail notifications for new Claims and new Legal Reviews are delayed and will **not be part of the November release** (communicated to Lena).
- **CC e-mail address in the Claims template:** Arun noted this as the only earlier Claims update; no new discussion.

## 4. Release Plan and Go-Live

- Legal Review can go live independently of Insurance and Claims. Lena: once today's points are implemented, Legal and Chartering can start, after an **introduction for the whole Chartering and Projects team**.
- Lukas proposed starting with a **small pilot group for a few weeks** before everyone switches; Lena agreed.
- Admaren: one more sprint of development is needed, then testing. Current sprint ends 4 November; the next runs **5–18 November**. **UAT will be updated around 20 November** (Friday), worst case 23 November. **Production is updated only with the end-of-November major release**, after regression.
- Testing and the introduction session can both be done in UAT. The introduction should be scheduled the next working day after the UAT update (after 23 November in the worst case), with the aim that the team starts using Legal Review in December.
- Lena will confirm with her team and asked to be told early if the date slips.

## 5. Key Decisions

- One task is created automatically per review; no visible task or subtasks — Legal only sees a work log (add log + history), plus a group work-log overview.
- Contract-only statuses (Under negotiation, Draft issued, Final issued, Signed) apply only to contract review types.
- Review status updates the Fixture/Inquiry Chartering dates; with several linked records a checklist (all pre-selected) lets the user confirm.
- Red Flag is entered on the review and shown read-only on the Chartering tab.
- The Legal Review Status field is removed from the Fixture Chartering tab; merging the Legal Review tab into the Chartering tab is subject to Arun's feasibility study.
- The Port Agent stays a dropdown; agent details are maintained in the Port Agency list.
- Claims: Claimant is no longer mandatory; new-claim notifications go out in-app and by e-mail to the Legal mailbox (deferred on 29.10.2026, not in the November release).
- "Additional insurance required": no change for now; Lena to discuss internally.
- Insurance is discussed in a separate call.
- Pilot group first, then wider rollout; introduction after the UAT update.

## Open Points

- **Inquiry Chartering tab:** it was agreed on 09.09 that the Inquiry "Legal" section keeps only Charter Party Type, Legal Review Status and Red Flag (the CP date fields were removed). On this call the new date names/order were also agreed for Inquiry — to be reconciled with Lena (are the date fields coming back on Inquiry, or does the change apply to Fixture only?). The same question applies to removing the Legal Review Status field from Inquiry.
- **Elapsed duration:** confirm whether the time between creation and completion is enough, or whether a separate field is needed, in addition to the logged hours.
- **Additional insurance required:** Lena to feed back after discussing with her team.
- **Points on Lena's earlier list not covered on this call:** who can delete a note, the missing fixture links on review UHL-L-2026-012, the Type of CP dropdown values and the Review Type order. Confirm whether these still need a reply.

## Action Items

| No. | Action | Owner | Module | Status / Notes |
| --- | --- | --- | --- | --- |
| 1 | Confirm creating a review without Related To (connect later) works | COEMS | Legal Review | Done – confirmed live |
| 2 | Hide Category and PIC Legal from non-Legal users in the create-review view | COEMS | Legal Review | Done – confirmed live |
| 3 | Auto-create one task per review (named after the review), disable Add Task, show only "Add new work log" and log history in the review | COEMS | Legal Review | To Do – next sprint |
| 4 | Provide a work-log overview for reviews (date range, office, group and user filters, grouping), like Engineering | COEMS | Legal Review | To Do – next sprint |
| 5 | Show the additional statuses (Under negotiation, Draft issued, Final issued, Signed) only for Contract Review Chartering/Projects | COEMS | Legal Review | To Do – next sprint |
| 6 | Update the Draft/Final CP Issuance and Signed by Client dates on the Chartering tab when the review status changes; checklist (all pre-selected) when several records are linked | COEMS | Legal Review / Fixture | To Do – next sprint |
| 7 | Add a free-text Red Flag field to the review and copy it to the Chartering tab Red Flag (read-only for Chartering) | COEMS | Legal Review / Fixture | To Do – next sprint |
| 8 | Remove the Legal Review Status field from the Fixture Chartering tab | COEMS | Fixture | To Do – next sprint (Inquiry to be confirmed) |
| 9 | Rename and reorder the Fixture Chartering date fields: Draft CP Issuance Date, Final CP Issuance Date, CP Signed by Client | COEMS | Fixture | To Do – next sprint (Inquiry to be confirmed) |
| 10 | Feasibility study: merge the Legal Review tab (list, add, link, search) into the bottom of the Chartering tab and remove the tab, incl. Inquiry/other modules | COEMS (Arun) | Legal Review / Fixture | To Do – fallback is to leave the tab as is |
| 11 | Decide how to handle "Additional insurance required" (notification / auto-created review or insurance / Legal decision) | UHL (Lena) | Legal Review / Insurance | Open – to be discussed internally |
| 12 | Remove the mandatory validation on Claimant | COEMS | Claims | To Do – next sprint |
| 13 | Send the preferred field order for the existing claim (Legal view / Edit overlay) | UHL (Lena) | Claims | To Do – after the meeting |
| 14 | Re-order the fields of the claim Edit overlay per Lena's list | COEMS | Claims | To Do – after receiving the list |
| 15 | Send an in-app notification and an e-mail to the general Legal mailbox when a new claim is created | COEMS | Claims | Deferred (29.10.2026) – not in the November release; follows the internal restructuring of COEMS Notifications |
| 16 | Fill agent details in the Port Agency list (full address) so they appear in the claim e-mail | UHL / Operations | Claims / Port Agency | Ongoing – optional DA-Desk export import later |
| 17 | Schedule a separate Insurance call (field lists per insurance type, overview headers and list split) | UHL (Lena) / COEMS | Insurance | To Do – date to be agreed after Lena's feedback |
| 18 | Document the Legal Review updates and Claims field changes and plan them into the next sprint (5–18 Nov) | COEMS (Arun) | General | To Do |
| 19 | Update UAT around 20 November (worst case 23 November); production with the end-of-November release | COEMS | General | To Do |
| 20 | Confirm the timeline and pilot group with the team and schedule the introduction session after the UAT update | UHL (Lena) | General | To Do |
| 21 | Inform Lena early if the delivery date is at risk | COEMS | General | Ongoing |
