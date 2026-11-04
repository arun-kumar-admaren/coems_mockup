#### **USER Story:**

**As a user sending a claim notification e-mail,**
**I want to** CC the correct department address, `hse@unitedheavylift.com`, instead of the outdated `hseq@unitedheavylift.com`
**So that** the incident notification actually reaches the right inbox.

> Corrects the CC address defined in **COEMS-20169 "Claims - Send as Email"** — client comment from the 09.09.2026 demo (also logged as action item #17 in the [09.09.2026 Minutes of Meeting](../../meeting-notes/coems-legal-insurance-claims-uat-review-2026-09-09.md)). The `hseq@` address hasn't been implemented anywhere in the current mockup codebase yet — this correction applies at the spec level, so whichever story implements "Copy Template" / "Send as Email" ships with the right address from the start.

---

#### **acceptance criteria:**

1. Wherever the Claims e-mail template's CC field is defined, the address must be **`hse@unitedheavylift.com`**, not `hseq@unitedheavylift.com`.

2. The other fixed CC address, `legal@unitedheavylift.com`, is unaffected — it stays as-is.

3. This applies identically to both delivery paths defined in COEMS-20169:
   * **Copy Template** (kebab menu, Claim Edit overlay) — the copyable template text's CC line.
   * **Send as Email** (kebab menu, Claim Edit overlay) — the `mailto:` link's CC parameter.

4. No other part of COEMS-20169 changes — recipient (To) still blank, Subject/Body formatting, Enclosed Documents Checklist, and the underwriter reference note all stay exactly as previously specified.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Claims → Copy Template | CC address `hseq@unitedheavylift.com` → `hse@unitedheavylift.com` |
| Claims → Send as Email (`mailto:`) | Same correction |

---

#### **Out of Scope:**

* Any other field, formatting rule, or behaviour defined in COEMS-20169.
* Building the Copy Template / Send as Email feature itself — both are currently unimplemented stub menu items in the mockup ([claims-insurance.tsx](../../../src/app/components/claims-insurance.tsx)); this story only corrects the address the spec calls for once that feature is built.
