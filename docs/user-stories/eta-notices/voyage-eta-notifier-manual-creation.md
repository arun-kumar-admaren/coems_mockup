# Voyage - ETA Notifier - Manual Creation

COEMS id:

USER Story:

As a user,
I want to create ETA notices manually for the fixtures and ports of a voyage
So that I can send an ETA notice whenever it is needed, also when the system has not generated one for that fixture and port.

acceptance criteria:

1. Option visibility

   * A "+ New ETA notice" button should be available at the top right of the "ETA notices" list in the Voyage header.
   * The button should be visible only to the users who can see the "ETA notices" option, which means the users who have the "ETA Notices" checkbox enabled in their user profile.
   * The button should be available also when the voyage has no ETA notice in the list.

2. Opening the screen

   * When the user clicks "+ New ETA notice", a "New ETA notice" screen should open, with the vessel name and the voyage number next to the title.
   * The screen should have two parts: the "Fixtures and ports" list on the left and the e-mails on the right.
   * The screen should open with nothing ticked and no e-mail on the right. The right side should show "Tick the ports to notify in the list on the left. One e-mail per fixture and port appears here."
   * The screen should be closed with the X icon, or with Cancel as described in point 6.

3. Fixtures and ports list (left side)

   * The list should have the title "Fixtures and ports", the text "Tick the ports to notify." and the number of ports ticked, for example "3 ports ticked".
   * Every fixture of the voyage should be listed with:
     * A chevron icon to collapse and expand the ports of the fixture
     * The fixture number
     * The number of ports left, and the number of addresses in the Handover tab, for example "2 ports left · 1 address in Handover". If the fixture has no address, it should show "no address in Handover".
     * The Frequency of the fixture, for example "Frequency: Daily"
   * Under every fixture, its ports should be shown in a box titled "Ports of" followed by the fixture number. Every fixture should be expanded by default, so the ports are shown when the screen opens. The user should be able to collapse a fixture with the chevron icon and expand it again. Collapsing a fixture should not untick its ports or remove their e-mails.
   * Only the ports of loading and discharge of that fixture that the vessel has not reached yet should be shown. Each port should have a checkbox, the port name, the operation (Loading or Discharging) and "ETA" with the date and time of the expected ETA.
   * A fixture that has no port of loading or discharge left to reach should be greyed out, without a chevron icon, and cannot be expanded. It should show "No loading or discharge port left to reach".
   * The ports of any fixture can be ticked, whatever its Frequency, including None, and whether or not its notice is due today.
   * The list should scroll when it is long.

4. Ticking ports

   * The fixtures should not have a checkbox. The user should tick the ports.
   * More than one port can be ticked, also the ports of different fixtures.
   * Each ticked port of a fixture should create one e-mail on the right straight away, in the order the ports were ticked. Two fixtures for the same port should create two e-mails.
   * Unticking a port should remove its e-mail.
   * An e-mail that has been sent from this screen should stay on the screen, and unticking should not remove it.

5. E-mails (right side)

   * Above the e-mails the screen should show "One e-mail per fixture, each to the addresses in that fixture's Handover tab (ETA's to be given). A row without an address is not sent."
   * Each e-mail should have a header with the fixture number, the Frequency, "Due today" when the notice of that fixture and port is due today, and the operation with the port, for example "Discharging at Emden". If there is no address, the header should show "No recipient".
   * Each e-mail should have a chevron icon to collapse and expand the e-mail text. The e-mail text should be open by default.
   * To: it should be filled automatically with the addresses in the "ETA's to be given" field of the fixture's Handover tab, shown in green. The user should be able to add or remove addresses for this notice only. The fixture should not be changed. If the fixture has no address, the screen should show "<fixture number> has no e-mail in ETA's to be given. Add one here or in its Handover tab."
   * ETA told to this client: the date and time in the time zone of the port, filled with the expected ETA of the port and editable. An "Include time (port time)" checkbox should decide whether the time is mentioned in the e-mail. When the ETA is changed, the screen should show "Differs from the system Expected ETA" and a "Reset to Expected ETA" option.
   * Remark: a free text field with the hint "e.g. position, wind, weather, delay". When a remark is given, it should be shown in bold in the e-mail text.
   * Subject: filled from the ETA notice template and editable. After it is edited, a "Reset to template" option should be available.
   * The e-mail box should show the To addresses, the subject underlined, and the e-mail text. The e-mail text should be filled from the ETA notice template and should be editable. After it is edited, a "Reset to template" option should be available.
   * Every e-mail should be independent. A change in one e-mail should not change the others.

6. Sending

   * The footer of the screen should show "Signatory:" with the name of the logged-in user, a Cancel button and a "Send (n)" button. "n" is the number of e-mails that can be sent now, which means the e-mails that are not sent yet and have at least one address.
   * The Send button should be disabled when "n" is 0.
   * The Cancel button should be shown only until an e-mail is sent. After that the screen should be closed with the X icon.
   * When the user clicks Send, all e-mails that have an address should be sent. An e-mail without an address should not be sent and should stay with "No recipient".
   * While sending, the e-mail should show "Sending…". After that it should show "Sent" in green and become read only.
   * If an e-mail cannot be delivered, it should show "Failed" with the reason in red. The user should be able to correct it and send it again with the Send button.
   * The system should send an e-mail only when the user clicks Send.

7. Sent notices

   * Below the e-mails the screen should show "Sent notices for these ports", with the notices already sent for the ports of the e-mails on the screen.
   * Each sent notice should show the date and time it was sent, who sent it, the fixture, the To addresses, the ETA told (with the time if it was included), the status (Sent or Failed), and an eye icon. The eye icon should show and hide the e-mail exactly as it was sent, with the subject underlined and the remark in bold. For a Failed notice, the reason should be shown.
   * The latest 3 notices should be shown. When there are more, "Show all (n)" and "Show fewer" should be available.
   * If no notice has been sent for these ports, it should show "No notice has been sent for this port call yet."

8. After sending

   * Every notice sent from this screen should be added to the "ETA notices" list of the voyage as Sent, or Failed, with the date and time, as described in the Voyage - ETA Notices (header) story.
   * If the same fixture and port has a Ready to Send notice, it should change to Sent after the manual notice is sent, and the number on the "ETA notices" option should reduce by one. A Failed notice should not change it.
   * A manual notice for a fixture and port that is not due should not change the number on the "ETA notices" option.
   * A manual notice should not change the Frequency of the fixture or the days on which the system generates the ETA notices.
