#### **USER Story:**

**As a** COEMS user who has set "User Logout After" in Personal Settings → Session & Notifications,
**I want to** stay logged in for the full duration I configured (e.g. 36 hours),
**So that** I am not logged out earlier than expected and don't lose unsaved work or get interrupted mid-task.

> The Personal Settings form itself was verified live and works correctly — entering a value, saving, reloading, and re-checking confirms the value persists exactly as entered, and the required/minimum-value validations on this field behave correctly (see `BRD/Personal_Settings_BRD.md`). The defect reported here is separate: the **runtime session-timeout enforcement does not honour the saved "User Logout After" value** — the user is actually logged out sooner than the configured duration.

---

#### **acceptance criteria:**

1. **Session must remain active for the full configured duration**

   Given a user has set **User Logout After** to a value of N hours and saved it successfully, the user's session must remain active for the full N hours (measured from whatever the system's intended start point is — e.g. login time or last activity) and must **not** be terminated before that duration has elapsed.

2. **No premature logout**

   The user must not be automatically logged out earlier than the configured **User Logout After** value under any normal usage pattern. Currently, this is not the case — the user reports being logged out before the configured time is reached.

3. **Fix must be verified against the stored value, not just the form**

   Because the form's save/validation was already confirmed correct, this fix must be verified at the session/token-expiry layer — the mechanism that actually enforces logout — not by re-testing the Personal Settings form alone.

---

#### **Scope:**

| **Area** | **Change** |
| --- | --- |
| Session timeout enforcement (runtime) | Must honour the exact "User Logout After" value configured per user; currently logs out earlier than configured |
| Personal Settings → Session & Notifications form | No change required — save, persistence, and field validation already confirmed working |

---

#### **Out of Scope:**

* Root cause of the premature logout (e.g. session/token expiry misconfigured independently of this setting, timer reset-on-activity vs. absolute-from-login logic, client/server clock mismatch) — not diagnosed in this pass; requires engineering investigation.
* The exact amount by which logout currently occurs early, and the precise steps to reproduce it on demand — not captured; based on user-reported behaviour, not a live-reproduced defect.
* **Receive Email After** and **Idle Days Preference** — not reported as broken; their form-level behaviour was confirmed working, and their own downstream runtime effect (actual email delay timing, actual idle-day behaviour) was not tested and is not addressed here.
* Any change to the Personal Settings page's fields, layout, or validation — already correct and out of scope for this fix.
