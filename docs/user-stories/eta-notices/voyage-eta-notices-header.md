# Voyage - ETA Notifier

COEMS id: COEMS-23971

USER Story:

As a user,
I want to see all the ETA notices of a voyage in a list in the Voyage header
So that I can see which ETA notices are ready to send and which have already been sent, and preview them without opening each port call.

acceptance criteria:

1. Option visibility

   * An "ETA Notices" option should be available in the header of the Voyage page, on the right side with the other header icons.
   * The option should be visible only to users who have the "ETA Notices" checkbox enabled in their user profile. For all other users, the option, the list, and the preview screens should not be available.
   * The option should not depend on the user's Role or Designation.
   * The option should show the number of ETA notices that are Ready to Send for that voyage. When there are none, it should show 0. The Sent and Expired notices should not be counted.

2. Opening the list

   * When the user clicks the "ETA notices" option, a list titled "ETA notices" with the voyage number should open below the option.
   * The list should show only the ETA notices of that voyage.
   * The list should close when the user clicks outside it.
   * A "+ New ETA notice" button should be available at the top right of the list. It is covered in a separate user story.

3. List columns

   * The list should have the columns Date, Port, Fixture, To, Status, and Preview.
   * Date: For a Ready to Send notice and for an Expired notice, the date on which it was generated. For a Sent notice, the date and time at which it was sent. It should not show the ETA date.
   * Port: the port of loading or discharge the notice is for.
   * Fixture: the fixture number.
   * To: the e-mail addresses the notice goes to. For a Ready to Send notice, these are the addresses in the "ETA's to be given" field of the fixture's Handover tab. If the fixture has no address, "No address" should be shown. For a Sent notice, these are the addresses it was sent to. For an Expired notice, these are the addresses of the notice. A long list of addresses should be shortened, with the full list shown on hover.
   * Status: "Ready to Send", "Sent", or "Expired". If the mail server refused an e-mail when it was sent, the status should show "Failed".
   * Preview: every row should have a Preview option, including the Expired rows.

4. Rows in the list

   * There should be one row for each fixture and port, because one e-mail is created for each fixture and port. Two fixtures for the same port should show two rows.
   * A fixture and port can have more than one row, because the Sent and Expired notices of the earlier days stay in the list. Only one notice of a fixture and port can be Ready to Send at a time.
   * Notices should be listed only for the ports of loading and discharge of the fixtures, not for canals or other port calls.
   * Notices should be listed only for ports the vessel has not reached yet. A notice that was generated today should stay in the list for that day, also when the Actual arrival (ATA) of its port is entered later that day.
   * A fixture that loads and discharges at the same port call should have one notice and one row.
   * The Ready-to-Send rows should be shown first, followed by the Sent and Expired rows with the latest on top.
   * The list should scroll when it has many rows.
   * If the voyage has no ETA notice, the list should show "No ETA notice for this voyage yet."

5. Ready to Send conditions

   * Whether a notice is Ready to Send depends on the "Frequency" field in the Handover tab of the fixture:
     * Daily: every day.
     * Standard: Monday, Wednesday, and Friday.
     * None: the fixture should not have any ETA notice.
   * For Daily and Standard, the system should generate the ETA notice at 8 am on each day it is due.
   * The 8 am should be in the time zone of the PIC Operations of the voyage. When the voyage has no PIC Operations, the time zone Europe/Amsterdam should be used. This applies to generating the notices and to changing them to Expired.
   * The ETA notices of a fixture should be generated port by port, in the order of the ports of loading and discharge of that fixture. The notice of the first port of the fixture, which is the port of loading, should be generated first.
   * The notice of the next port of a fixture should be generated only after the vessel has reached the previous port of that fixture, which means the Actual arrival (ATA) of the previous port is entered in COEMS. This should apply even when the ETA of the next port is inside the 14-day window, which is 2 weeks before the ETA.
   * The ports of the other fixtures should not hold back the notices of a fixture. Two fixtures of the same voyage can have their notices at different ports at the same time.
   * After the vessel has reached the previous port of the fixture, if the ETA of the next port is inside the 14-day window, the notices of the next port should be generated as per the Frequency. If the ETA of the next port is not inside the 14-day window, the normal rule should apply, which means the notices should be generated when the ETA of that port comes inside the 14-day window.
   * A port call that is removed from the voyage should not count as the previous port of the fixture. The notices of the next port should then follow the normal rule, which means they start 2 weeks before the ETA of that port.
   * When the ATA of the previous port of the fixture is not entered, no notice should be generated for the next port. The user can still create the notice with "+ New ETA notice" or from the Arrival and Departure Report.
   * For every port, the notices should start 2 weeks before the Expected date of that port, as shown in its Arrival and Departure Report, and the start should move when the Expected date changes.
   * When the system generates a notice at 8 am, it should take the Expected ETA of the port as it is at that moment. All the screens should show this Expected ETA for that notice during that day. A change of the Expected date made later on the same day should be used from the next day's notice.
   * The notices for a port should stop when the vessel reaches that port.
   * When the notice of a fixture and port is sent, its row should change from Ready to Send to Sent. The next Ready to Send row should appear at 8 am on the next day it is due.
   * The system generates the ETA notices by itself, so a Ready to Send notice can stay unsent, for example when the user is on leave. A Ready to Send notice that is not sent should change to Expired automatically when the next notice of the same fixture and port is generated, at 8 am on the next day it is due. For Daily, this is the next day at 8 am.
   * A Ready to Send notice that is not sent should also change to Expired at 8 am on the next day when the fixture and port no longer get notices, which means the vessel has reached the port, the Frequency of the fixture is changed to None, the fixture is removed from the port call, or the voyage is Completed or Cancelled.
   * When a notice changes to Expired because the next notice is generated, the new Ready to Send notice of that fixture and port should appear at the same time, so only one notice of a fixture and port is Ready to Send.
   * An Expired notice cannot be sent. The user can still preview it, as described in point 8.
   * A Sent notice should not change to Expired.
   * The system should never send an ETA notice automatically. Every ETA notice should be sent by the user.

6. Preview of a Sent notice

   * Clicking Preview on a Sent row should open the "ETA notice" screen of that port on its own. The Arrival and Departure Report should not open.
   * The screen should be read-only.
   * The title of the screen should show "ETA notice" with the port name, followed by the vessel name and the voyage number, and a "Sent" tag.
   * Below the title, the screen should show:
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
   * The header of the e-mail should show the fixture number, the Frequency, "Due" when it is due, and the operation with the port, for example "Discharging at Cuxhaven". When the fixture loads and discharges at that port, the operation should be "Loading and Discharging".
   * The To field should be filled automatically with the e-mail addresses in the "ETA's to be given" field of the fixture. The user should be able to add or remove addresses for this notice only. The fixture should not be changed. If there is no address, "No recipient" should be shown, and the notice cannot be sent until an address is added.
   * The user should be able to change the ETA told to the client, with the date and the time (using "Include time"). It should start with the Expected ETA of the port at 8 am today, in the time zone of the port. When no Expected date is entered for the port call, the date calculated by the system should be used.
   * The user should be able to give a Remark. When a remark is given, it should be shown in bold in the e-mail.
   * The Subject and the e-mail text should be filled from the ETA notice template and should be editable. After the text is edited, a "Reset to template" option should be available.
   * The changes made in the notice, which means the To addresses, the ETA told with "Include time", the Remark, the Subject, and the e-mail text, should be stored automatically. When the user closes the screen without sending the notice and opens it again, the stored changes should be shown, so that the user does not need to edit the notice again.
   * The stored changes should be visible only to the user who made them. Other users who open the notice should not see them.
   * The next ETA notice that the system generates for the same fixture and port should not start from the plain template. For the user who made the changes, it should start with the changes stored in the earlier notice, which means the To addresses, the Remark, the Subject, and the e-mail text. The ETA told should start with the Expected ETA of the port at 8 am of the new day, as described above.
   * The values that come from the new notice, such as the ETA date and the port, should be refreshed in the carried e-mail text. The ETA date should be the Expected ETA of the port at 8 am of the new day. For example, when the Expected ETA has changed, the e-mail text should show the new date and not the old date.
   * When the user clicks "Reset to template", the stored changes of the subject or the e-mail text should be removed.
   * The signatory should be the logged-in user.
   * The screen should have a Send button that shows the number of emails to be sent, and a Cancel option. It should also be closable with the X icon.
   * After the user clicks Send, the row should show Sent, the notice should show as Sent in the list with the date and time, and the number on the "ETA notices" option should reduce by one.
   * The screen should list the notices already sent for that port, with an eye icon to view each email.

8. Preview of an Expired notice

   * Clicking Preview on an Expired row should open the "ETA notice" screen of that fixture and port only, on its own. The Arrival and Departure Report should not open.
   * The header of the e-mail should show the fixture number, the Frequency, the "Expired" status instead of the "Due" stamp, and the operation with the port, for example "Discharging at Cuxhaven". When the fixture loads and discharges at that port, the operation should be "Loading and Discharging".
   * The e-mail should be shown with the changes that were stored for the notice, if the user edited it before it expired. The user should be able to collapse and expand it with the chevron icon.
   * The screen should be read-only. All the fields should be disabled, which means the To addresses, the ETA told, "Include time", the Remark, the Subject, and the e-mail text, and the "Reset to template" options. The user should not be able to edit anything.
   * The Send button should be disabled. When the user hovers over the disabled Send button, it should show "ETA Notice Expired".
   * The screen should be closed with the X icon, or with Cancel.

9. ETA notice template

   * The Subject and the e-mail text of every ETA notice should be created from the template below. The template is fixed. It is not edited in Settings. The user can change the subject and the e-mail text only for one notice, as described in point 7.
   * Subject:
     > MV {vessel} – Voyage {voyage} – {fixture} – {loadPort} / {dischargePort} – {client}
   * E-mail text:
     > Dear all,
     >
     > from today's perspective the MV {vessel} is expected to arrive in {port} on/about {eta} wp agw wog fme uce
     >
     > Remark: {remark}
     >
     > Please consider this message as notice in accordance with the governing cargo contract and let us know if any additional information is needed
     >
     > Thank you for your attention.
     >
     > Best regards,
     >
     > {signatory}
     >
     > UNITED HEAVY LIFT
     > Am Kaiserkai 69, 20457 Hamburg, Germany
     > operations@uhl-operations.example
   * The line "Remark: {remark}" should be shown in bold in the e-mail.
   * A word in curly brackets is a placeholder. It should be replaced with the value of the notice when the e-mail is created:
     * {vessel}: the vessel name
     * {voyage}: the voyage number
     * {port}: the port of the notice, which is the port of loading or discharge
     * {eta}: the ETA told to the client, for example 24.11.2026. When "Include time" is ticked, the time and the time zone of the port should be added, for example 24.11.2026 21:45 LT (UTC+1:00) Europe/Berlin
     * {fixture}: the fixture number
     * {loadPort}: the port of loading of the fixture. When there are several, they should be separated by a comma
     * {dischargePort}: the port of discharge of the fixture. When there are several, they should be separated by a comma
     * {client}: the client of the fixture, which is the Account of the fixture
     * {remark}: the remark given by the user in the ETA notice
     * {signatory}: the name of the logged-in user who sends the notice
   * The parts of the subject are separated by " – ". A part whose placeholders are all empty should be left out of the subject. If the loading port or the discharge port is empty, the "/" next to it should also be left out.
   * A line of the e-mail text whose placeholders are all empty should be left out, together with the blank line that follows it. For example, when no remark is given, the Remark line should not be in the e-mail.
