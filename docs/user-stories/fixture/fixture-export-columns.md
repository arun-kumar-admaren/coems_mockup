# Fixture List "Export All" columns (bctesting)

**Captured:** 2026-11-04 from `coems.bctesting.admaren.org` (Fixtures list, more-options menu, **Export All**; file `fixture-export_04-11-2026_095459.xlsx`).
**Shape:** one sheet named `fixture`, **82 columns**, **1926 rows**, one row per fixture (all fixture IDs and numbers unique). The export is not limited by any date: it has every fixture, including Cancelled and Postponed.

## What matters for the new Fixture Report table

- The first column has no header and is a row index; leave it out. That leaves 81 real columns.
- **Dates are text.** BOOKING DATE and CREATED ON are `dd/mm/yyyy` (CREATED ON also has the time) and VOYAGE START DATE is ISO text. The new table needs real dates, both for the popup's Date Range and so that charts and pivots can group by month or year.
- **Some numbers are text:** FREIGHT RATE, BALANCE, BUY IN FREIGHT RATE and BUY IN GROSS FREIGHT RATE (for example `'14000.0000000000'`, `'0E-10'`). Charts and pivots can only Sum or Average real numbers.
- **No laycan column.** The laycan appears only inside the PORT OF LOADING text, in brackets. The popup option *LAY-CAN / Voyage Date* has nothing to read from, apart from VOYAGE START DATE, which is filled for about 38% of rows.
- **Six currencies**, not two: US Dollar 1,593, Euro 324, Icelandic Krona 5, Singapore Dollar 2, Bulgarian Lev 1, Norwegian Krone 1. This is why a Converted Amount column is needed.
- **Names differ from the list:** FIXED BY is *Assigned Office* and CARGO TYPE is *Cargo Category* on the Fixture List.

## All columns

| # | Export column | Type in export | Example | Note |
|---|---|---|---|---|
| 1 | `(no header)` | number | 0 | No header. Row index (0 to 1925), not a fixture field; leave it out. |
| 2 | `ID` | number | 1478 | Internal fixture id. |
| 3 | `NUMBER` | text | UWL-TC-2024-001 | Fixture number. Unique per row. |
| 4 | `CARGO NAME` | text | Carousel + Cable |  |
| 5 | `PORT OF LOADING` | text | Vlissingen (19/10/2024-30/10/2024) | Port names with laycan dates in brackets; several ports are comma separated. Not suitable for grouping as it is. |
| 6 | `PORT OF DISCHARGE` | text | Vlissingen | Port names; several ports are comma separated. |
| 7 | `CARGO DESCRIPTION` | text | Carousel + Cable |  |
| 8 | `INTENDED VESSEL TYPE` | text | VestVind NB Type |  |
| 9 | `INTENDED VESSEL` | text | VESTVIND |  |
| 10 | `FINAL PERFORMER` | text | AquaGemini |  |
| 11 | `CARGO TYPE` | text | Time Charter | Called Cargo Category on the Fixture List. |
| 12 | `UNIT NUMBER` | number | 1 |  |
| 13 | `TOTAL VOLUME` | number | 1 |  |
| 14 | `TOTAL WEIGHT` | number | 1 |  |
| 15 | `FREIGHT RATE` | number as text | 14000.0000000000 | Number stored as text; must be a number to Sum or Average. |
| 16 | `FREIGHT CALC TYPE` | text | Lumpsum |  |
| 17 | `CURRENCY` | text | US Dollar | 6 currencies in this file (US Dollar, Euro, Icelandic Krona, Singapore Dollar, Bulgarian Lev, Norwegian Krone). |
| 18 | `GROSS FREIGHT` | number | 14000 | Whole numbers, in the row's CURRENCY. |
| 19 | `FREIGHT COMMENTS` | text | 1st Campaign of 3 |  |
| 20 | `BUY IN` | text | No |  |
| 21 | `BUY IN FREIGHT CALC TYPE` | text | Lumpsum |  |
| 22 | `BUY IN FREIGHT RATE` | number as text | 0E-10 | Number stored as text; must be a number to Sum or Average. |
| 23 | `BUY IN GROSS FREIGHT RATE` | number as text | 0 | Number stored as text; must be a number to Sum or Average. |
| 24 | `BALANCE` | number as text | 14000.0000000000 | Number stored as text; must be a number to Sum or Average. |
| 25 | `BUY IN COMMENTS` | text | Transport (3 shipments of USD300,00... | Empty in over 95% of rows. |
| 26 | `FIXTURE STATUS` | text | Discharged | Includes Cancelled and Postponed. |
| 27 | `BOOKING DATE` | date as text | 30/09/2024 | dd/mm/yyyy text, not a real date. |
| 28 | `PROJECT NAME` | text | Doggerbank |  |
| 29 | `FIXTURE TYPE` | text | Time Chartered Fixture |  |
| 30 | `FIXED BY` | text | UNITED WIND LOGISTICS  (HQ) | Called Assigned Office on the Fixture List. |
| 31 | `PERSON IN CHARGE` | text | Jakob Wittmann |  |
| 32 | `BAF` | text | No |  |
| 33 | `BAF COMMENTS` | text | Current freight rate is based on a ... |  |
| 34 | `CHARTERING TERMS` | text | FIOS l/s/d + welding |  |
| 35 | `RELATED PROJECT` | text | PT-2022-134 |  |
| 36 | `HEAD ACCOUNT` | text | deugro (Deutschland) Projekt GmbH |  |
| 37 | `ACCOUNT` | text | Deugro (Italia) |  |
| 38 | `SHIPPER` | text | Vestas |  |
| 39 | `BROKER` | text | K2 Project Forwarding AS |  |
| 40 | `BROKER COMMISSION` | number | 2 |  |
| 41 | `MANAGEMENT FEE PERCENTAGE` | number | 0 |  |
| 42 | `COMMISSIONS` | text | USG HQ(0E-10) | Text such as 'USG HQ(0E-10)'. |
| 43 | `CHARTER PARTY SIGNED` | text | No |  |
| 44 | `HARD COPY` | text | No |  |
| 45 | `PDF` | text | No |  |
| 46 | `MARKETING` | text | Topaz Driller on HHL in Malta 2.jpg... | Empty in over 95% of rows. |
| 47 | `DELIVERY DATE` | date as text | 14/12/2021 | dd/mm/yyyy text, not a real date. |
| 48 | `REDELIVERY DATE` | date as text | 14/12/2022 | dd/mm/yyyy text, not a real date. |
| 49 | `TIME CHARTER RATE` | text | 9225.0 / day | Empty in over 95% of rows. |
| 50 | `DEMURRAGE DURATION` | text | 18000 day | Empty in over 95% of rows. |
| 51 | `DEMURRAGE PDPR` | text | 12750.0 / day |  |
| 52 | `GROSS DEMURRAGE` | number | 0 |  |
| 53 | `TRANSIT TIME` | text | 5.0 / day | Empty in over 95% of rows. |
| 54 | `VOYAGE NUMBER` | text | 2402 |  |
| 55 | `AGREEMENT TYPE` | text | Transit Time |  |
| 56 | `CHARTERING RATING` | text | Will book again with UHL |  |
| 57 | `ENGINEERING RATING` | text | Will book again with UHL |  |
| 58 | `OPERATIONS RATING` | text | Will book again with UHL |  |
| 59 | `HSE ACTION RATING` | text | No Issue |  |
| 60 | `HSE COMMENTS` | text | UML-I-2021-001 - dropped cargo |  |
| 61 | `PROGRESS` | text | 56 % | Percentage stored as text, for example '56 %'. |
| 62 | `INVOICE STATUS` | text | TO BE ISSUED | Upper case here (TO BE ISSUED, INVOICED, PAID, OVERDUE). |
| 63 | `MANAGEMENT FEE` | number | 0 | Whole numbers, in the row's CURRENCY. |
| 64 | `CREATED BY` | text | Jakob Wittmann |  |
| 65 | `CREATED ON` | date-time as text | 01/10/2024, 09:18 AM | dd/mm/yyyy, hh:mm AM/PM text, not a real date-time. |
| 66 | `MODIFIED BY` | text | Leif Müller |  |
| 67 | `MODIFIED ON` | date-time as text | 24/09/2026, 12:21 PM | dd/mm/yyyy, hh:mm AM/PM text, not a real date-time. |
| 68 | `SEND TO OPERATIONS` | yes/no | True |  |
| 69 | `RELATED ENG REQUESTS` | text | ER-2023-0104 | Empty in over 95% of rows. |
| 70 | `IS ASSIGNED TO VOYAGE` | yes/no | True |  |
| 71 | `VOYAGE ID` | number | 879 |  |
| 72 | `VOYAGE NAME` | text | AQUA 2648 |  |
| 73 | `BC SYNC FAILED` | yes/no | False |  |
| 74 | `RELATED CARGO ID` | number | 8746 |  |
| 75 | `VERSION` | number | 148 |  |
| 76 | `ENQUIRY NUMBER` | text | CR-2024-1583 |  |
| 77 | `VOYAGE START DATE` | date-time as text | 2033-04-20T09:26:00 | Date-time stored as text (ISO). Filled for about 38% of rows. |
| 78 | `ORIGINAL FIXTURE ID` | number | 1291 |  |
| 79 | `HANDOVER OPERATIONS` | number | 1295 |  |
| 80 | `HANDOVER INCON` | number | 1295 |  |
| 81 | `OPM TECHNICAL DOCS REQUIRED` | number | 3 |  |
| 82 | `ADDITIONAL INCOME EXPENSE` | text | [4582] | List of ids stored as text, for example '[4582]'. |
