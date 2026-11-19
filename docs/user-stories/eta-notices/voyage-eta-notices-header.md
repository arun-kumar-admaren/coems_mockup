# Voyage - ETA Notices (header)

COEMS id:

USER Story:

As a user,
I want to see all the ETA notices of a voyage in a list in the Voyage header
So that I can see which ETA notices are ready to send and which are already sent, and preview them without opening each port call.

acceptance criteria:

1. Option visibility

   * An "ETA notices" option should be available in the header of the Voyage page, on the right side with the other header icons.
   * The option should be visible only to the users who have the "ETA Notices" checkbox enabled in their user profile. For all other users the option, the list and the preview screens should not be available.
   * The option should not depend on the user's Role or Designation.
   * The option should show the number of ETA notices that are Ready to Send for that voyage. When there are none, it should show 0.

2. Opening the list

   * When the user clicks the "ETA notices" option, a list titled "ETA notices" with the voyage number should open below the option.
   * The list should show only the ETA notices of that voyage.
   * The list should close when the user clicks outside it.
   * A "+ New ETA notice" button should be available at the top right of the list. It is covered in a separate user story.

3. List columns

   * The list should have the columns Date, Port, Fixture, To, Status and Preview.
   * Date: for a Ready to Send notice, the date on which it is to be sent (today). For a Sent notice, the date and time at which it was sent. It should not show the ETA date.
   * Port: the port of loading or discharge the notice is for.
   * Fixture: the fixture number.
   * To: the e-mail addresses the notice goes to. For a Ready to Send notice these are the addresses in the "ETA's to be given" field of the fixture's Handover tab. If the fixture has no address, "No address" should be shown. For a Sent notice these are the addresses it was sent to. A long list of addresses should be shortened, with the full list shown on hover.
   * Status: "Ready to Send" or "Sent". If an e-mail could not be delivered, the status should show "Failed".
   * Preview: every row should have a Preview option.

4. Rows in the list

   * There should be one row for each fixture and port, because one e-mail is created for each fixture and port. Two fixtures for the same port should show two rows.
   * Notices should be listed only for the ports of loading and discharge of the fixtures, not for canals or other port calls.
   * Notices should be listed only for ports the vessel has not reached yet.
   * The Ready to Send rows should be shown first, followed by the Sent rows with the latest on top.
   * The list should scroll when it has many rows.
   * If the voyage has no ETA notice, the list should show "No ETA notice for this voyage yet."

5. Ready to Send conditions

   * Whether a notice is Ready to Send depends on the "Frequency" field in the Handover tab of the fixture:
     * Daily: every day.
     * Standard: Monday, Wednesday and Friday.
     * None: the fixture should not have any ETA notice.
   * For Daily and Standard, the system should generate the ETA notice at 8 am on each day it is due.
   * For a port of loading, the notices should start 2 weeks before the voyage starts. For a port of discharge, the notices should start 2 weeks before the ETA of that port, and the start should move when the ETA changes.
   * The notices for a port should stop when the vessel reaches that port.
   * When the notice of a fixture and port is sent, its row should change from Ready to Send to Sent. The next Ready to Send row should appear at 8 am on the next day it is due.
   * The system should never send an ETA notice automatically. Every ETA notice should be sent by the user.

6. Preview of a Sent notice

   * Clicking Preview on a Sent row should open the "ETA notice" screen of that port on its own. The Arrival and Departure Report should not open.
   * The screen should be read only.
   * The title of the screen should show "ETA notice" with the port name, followed by the vessel name and the voyage number, and a "Sent" tag.
   * Below the title the screen should show:
     * Date: the date and time at which the notice was sent, followed by "by" and the name of the user who sent it
     * Fixture: the fixture number
     * To: the e-mail addresses the notice was sent to
     * ETA told: the date, with the time if it was included, and the time zone
     * Remark: the remark that was given, shown only if a remark was given
   * Below this, the e-mail should be shown in a box exactly as it was sent. The subject should be the first line, underlined, followed by the e-mail text with the remark in bold and the signature.
   * The screen should be closed with the X icon.

7. Preview of a Ready to Send notice

   * Clicking Preview on a Ready to Send row should open the "ETA notice" screen of that fixture and port only, on its own. The Arrival and Departure Report should not open.
   * The e-mail should be open by default. The user should be able to collapse and expand it with a chevron icon.
   * The header of the e-mail should show the fixture number, the Frequency, "Due today" when it is due, and the operation with the port, for example "Discharging at Cuxhaven".
   * The To field should be filled automatically with the e-mail addresses in the "ETA's to be given" field of the fixture. The user should be able to add or remove addresses for this notice only. The fixture should not be changed. If there is no address, "No recipient" should be shown and the notice cannot be sent until an address is added.
   * The user should be able to change the ETA told to the client, with the date and the time (using "Include time"). It should start with the expected ETA of the port, in the time zone of the port.
   * The user should be able to give a Remark. When a remark is given, it should be shown in bold in the e-mail.
   * The Subject and the e-mail text should be filled from the ETA notice template and should be editable. After the text is edited, a "Reset to template" option should be available.
   * The signatory should be the logged-in user.
   * The screen should have a Send button that shows the number of e-mails to be sent, and a Cancel option. It should also be closed with the X icon.
   * After the user clicks Send, the row should show Sent, the notice should show as Sent in the list with the date and time, and the number on the "ETA notices" option should reduce by one.
   * The screen should list the notices already sent for that port, with an eye icon to view each e-mail.
