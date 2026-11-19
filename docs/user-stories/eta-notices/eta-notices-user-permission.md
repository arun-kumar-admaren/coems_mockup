# ETA Notices - User Permission

COEMS id:

USER Story:

As a user,
I want to assign an "ETA Notices" permission to users
So that only authorized users can access the ETA Notices functionality, while others do not see it.

acceptance criteria:

1. A new checkbox field named "ETA Notices" should be available next to the "Legal" checkbox, under the "HSE" checkbox, in the User Add overlay in the settings page.

2. The "ETA Notices" checkbox should also be available in the User Edit overlay.

3. The "ETA Notices" checkbox should be optional and unchecked by default.

4. When the "ETA Notices" checkbox is enabled for a user:

   * The user should be able to see the ETA Notices options and buttons wherever they are available.
   * The user should be able to create, preview, edit and send ETA notices.

5. When the "ETA Notices" checkbox is NOT enabled for a user:

   * The user should not see the ETA Notices options and buttons anywhere.
   * The user should not be able to create, preview, edit or send ETA notices.

6. The system should enforce this restriction across all entry points where ETA Notices are available.

7. The access should depend only on the "ETA Notices" checkbox. The user's Role or Designation should not be considered.
