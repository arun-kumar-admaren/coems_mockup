# Voyage - ETA Notices in History

COEMS id: COEMS-25119

USER Story:

As a user,
I want every ETA notice that is sent to be recorded in the History of the voyage
So that I can check later what was told to the client about the arrival, who sent it, and when.

acceptance criteria:

1. Where the notices are shown

   * The ETA notices should be shown in the existing History of the voyage, which is opened with "View History" in the three-dot menu of the voyage details panel.
   * The ETA notices should appear in the same list as the other changes of the voyage, in the same order, with the latest on top.
   * No new option or screen is needed. The History window should work as it does today, including "No History Available" when the voyage has no entry, and closing with the X icon.

2. When an entry is added

   * One entry should be added every time an ETA notice is sent, as soon as the system has sent it.
   * One entry should be added for each fixture and port, because one e-mail is created for each fixture and port. When the user sends three e-mails with one Send, three entries should be added.
   * An entry should be added for a notice sent from any place: the "ETA notices" list in the Voyage header, "+ New ETA notice", and the Arrival and Departure Report opened from the Position List or from the Voyage page.
   * No entry should be added when an e-mail is only opened, previewed, edited, or cancelled, when a notice is Ready to Send but not sent, when a notice changes to Expired, or when the mail server refused the e-mail.

3. Entry of a sent notice

   * The entry should show the name of the user who sent the notice and the date and time it was sent, in the same format as the other entries, for example "18/11/2026, 06:10 AM".
   * Below the user and the date, the entry should show the line "Sent - ETA Notice" followed by the fixture number and the port in brackets, for example "Sent - ETA Notice (UHL-F-2026-1356, Cuxhaven)".
   * Below this line, the entry should show:
     * To: the e-mail addresses the notice was sent to
     * ETA told: the date, with the time if it was included, and the time zone
     * Remark: the remark that was given, shown only if a remark was given

4. Content of the entry

   * The entry should not show the subject or the e-mail text. They can be seen in the preview of the notice, from the "ETA notices" list in the Voyage header.
   * The entry cannot be edited or deleted.

5. Who sees the entries

   * The ETA notice entries should be shown only to the users who have the "ETA Notices" checkbox enabled in their user profile.
   * For all other users, the ETA notice entries should not be shown in the History. The other entries should be shown as today, and when the voyage has no other entry, "No History Available" should be shown.
   * The visibility should not depend on the user's Role or Designation.
