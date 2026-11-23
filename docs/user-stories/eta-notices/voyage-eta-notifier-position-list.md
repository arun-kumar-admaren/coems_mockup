# Position list - ETA Notifier

COEMS id: COEMS-23972

USER Story:

As a user,
I want to send ETA notices from the Arrival and Departure Report of a port call in the Position List
So that I can notify the clients while I check the dates of the vessel's next port, without going to the Voyage page.

acceptance criteria:

1. Option visibility

   * The "ETA notice" button and the "Due" marker described below should be visible only to the users who have the "ETA Notices" checkbox enabled in their user profile. For all other users they should not be shown.
   * The visibility should not depend on the user's Role or Designation.

2. "Due" marker on the port call card

   * A "Due" marker should be shown on a port call card in the Position List when at least one fixture at that port has an ETA notice that is due, which means a Ready to Send notice as described in the Voyage - ETA Notifier story (COEMS-23971).
   * When the user hovers on the marker, it should show "ETA notice due:" followed by the numbers of the fixtures that are due.
   * The marker should not be shown for a port call that has no fixture loading or discharging, for a canal, for a port the vessel has already reached, or when the notices of all its fixtures are already sent today.
   * The marker should be shown only for a Ready to Send notice. It should not be shown for an Expired notice, or for a port whose notice is not generated yet because the vessel has not reached the previous port of the fixture, as described in the Voyage - ETA Notifier story (COEMS-23971).
   * The marker should disappear from the card when the ETA notices of all due fixtures of that port call have been sent.

3. Opening the Arrival and Departure Report

   * When the user clicks a port call card, the Arrival and Departure Report of that port call should open.
   * The report should show the "ETA notice" button as described in the next point. The other parts of the report are not part of this story.

4. "ETA notice" button in the report

   * The "ETA notice" button should be shown in the header bar of the "Expected" section of the Arrival and Departure Report, in the middle between the title "Expected" and "Estimated Port Days".
   * The button should be shown only when all these conditions are met:
     * The port is the port of loading or discharge of at least one fixture of the voyage
     * The Frequency of at least one of these fixtures is not None
     * The vessel has not reached the port yet
   * For a canal, a port without a fixture, a port the vessel has already reached, and a port where the Frequency of all fixtures is None, the button should not be shown.
   * The button should be shown also for a port whose notice is not generated yet because the vessel has not reached the previous port of the fixture. The user can create the notice from here.
   * When at least one fixture at the port has an ETA notice that is due, a "Due" marker should be shown inside the button.

5. Opening the ETA notice screen

   * When the user clicks the "ETA notice" button, an "ETA notice" screen should open on top of the report. The report should stay open behind it.
   * The title should show "ETA notice" with the port name, followed by the vessel name and the voyage number.
   * Below the title the screen should show "Expected ETA:" with the date, time and time zone of the port, which is the Expected ETA at 8 am today, and a tag "entered" when the Expected arrival was typed in the report and saved with "Confirm & Update", or "computed" when it is the date calculated by the system.
   * The screen should show "One e-mail per fixture, each to the addresses in that fixture's Handover tab (ETA's to be given). A row without an address is not sent."
   * One e-mail should be created for every fixture that loads or discharges at the port and whose Frequency is not None, whether or not the notice is due. Two fixtures at the same port should show two e-mails.
   * A fixture whose Frequency is None should not have an e-mail.
   * The screen should be closed with the X icon, or with Cancel as described in point 8. The report should stay open.

6. E-mails

   * Each e-mail should have a header with the fixture number, the Frequency, "Due" when the notice of that fixture is due, and the operation with the port, for example "Discharging at Emden". When the fixture loads and discharges at that port, the operation should be "Loading and Discharging". If there is no address, the header should show "No recipient".
   * Each e-mail should have a chevron icon to collapse and expand the e-mail text. The e-mail text should be open by default.
   * To: it should be filled automatically with the addresses in the "ETA's to be given" field of the fixture's Handover tab, shown in green. The user should be able to add or remove addresses for this notice only. The fixture should not be changed. If the fixture has no address, the screen should show "<fixture number> has no e-mail in ETA's to be given. Add one here or in its Handover tab."
   * ETA told to this client: the date and time in the time zone of the port, filled with the Expected ETA at 8 am today and editable. An "Include time (port time)" checkbox should decide whether the time is mentioned in the e-mail. When the ETA is changed, the screen should show "Differs from the system Expected ETA" and a "Reset to Expected ETA" option, which brings back the Expected ETA at 8 am today.
   * Remark: a free text field with the hint "e.g. position, wind, weather, delay". When a remark is given, it should be shown in bold in the e-mail text.
   * Subject: filled from the ETA notice template (point 11) and editable. After it is edited, a "Reset to template" option should be available.
   * The e-mail box should show the To addresses, the subject underlined, and the e-mail text. The e-mail text should be filled from the ETA notice template (point 11) and should be editable. After it is edited, a "Reset to template" option should be available.
   * When the e-mail is a Ready to Send notice, which means it has the "Due" stamp, the changes made in the e-mail should be stored automatically, as described in the Voyage - ETA Notifier story (COEMS-23971). When the user closes the screen without sending and opens it again, the stored changes should be shown, so that the user does not need to edit the e-mail again. The stored changes should be visible only to the user who made them, and the next notice of that fixture and port should start with them, with the values of the new notice, such as the ETA date, shown instead of the old values.
   * The changes made in an e-mail that is not a Ready to Send notice, which means it does not have the "Due" stamp, should not be stored.
   * Every e-mail should be independent. A change in one e-mail should not change the others.

7. Expected ETA in the notice

   * The ETA notice should carry the Expected ETA as it was at 8 am today, when the notice was generated.
   * A change of the Expected dates made in the report after 8 am should be used from the next day's notice. It should not change the ETA of the notices of today.
   * The ETA notice screen should not show a message about unsaved date changes, and the Send button should not be disabled because of the dates in the report.

8. Sending

   * The footer of the screen should show "Signatory:" with the name of the logged-in user, a Cancel button and a "Send (n)" button. "n" is the number of e-mails that can be sent now, which means the e-mails that are not sent yet and have at least one address.
   * The Send button should be disabled when "n" is 0.
   * The Cancel button should be shown only until an e-mail is sent. After that the screen should be closed with the X icon.
   * When the user clicks Send, all e-mails that have an address should be sent. An e-mail without an address should not be sent and should stay with "No recipient".
   * While sending, the e-mail should show "Sending...". After that it should show "Sent" in green and become read-only.
   * If the mail server refuses an e-mail when it is sent, it should show "Failed" with the reason in red. The user should be able to correct it and send it again with the Send button.
   * The system should send an e-mail only when the user clicks Send.

9. Sent notices

   * Below the e-mails the screen should show "Sent notices for" followed by the port name, with the notices already sent for that port.
   * Each sent notice should show the date and time it was sent, who sent it, the fixture, the To addresses, the ETA told (with the time if it was included), the status (Sent or Failed), and an eye icon. The eye icon should show and hide the e-mail exactly as it was sent, with the subject underlined and the remark in bold. For a Failed notice, the reason should be shown.
   * The latest 3 notices should be shown. When there are more, "Show all (n)" and "Show fewer" should be available.
   * If no notice has been sent for the port, it should show "No notice has been sent for this port call yet."

10. After sending

   * When the notice of a fixture and port was Ready to Send, it should change to Sent after the e-mail is sent from here, in the same way as for a manual notice.
   * The "Due" marker should disappear from the button in the report and from the port call card in the Position List when the notices of all due fixtures of that port are sent. A Failed notice should not remove it.
   * Every notice sent from here should be added to the "ETA notices" list in the header of the Voyage page as Sent or Failed, with the date and time, and the number on the "ETA notices" option should reduce by one for each Ready to Send notice that was sent.
   * Sending an ETA notice should not change the dates of the port call, the Frequency of the fixture, or the days on which the system generates the ETA notices.

11. ETA notice template

   * The Subject and the e-mail text of every ETA notice should be created from the template below. The template is fixed. It is not edited in Settings. The user can change the subject and the e-mail text only for one notice, as described in point 6.
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
