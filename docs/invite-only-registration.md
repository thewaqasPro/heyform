# Invite-only registration

When `APP_DISABLE_REGISTRATION=true`, public account creation remains disabled, but a visitor with a valid workspace invitation can create an account and join that workspace.

## Flow

1. Opening a valid `/workspace/:workspaceId/invitation/:code` page stores the workspace ID and invite code in the `KYNDFORM_INVITATION` browser-session cookie.
2. The invitation cookie makes the sign-up route and link available. It has no `Expires` or `Max-Age` attribute, so it expires with the browser session.
3. Sign-up sends the workspace ID and invite code through the existing optional `SignUpInput` fields.
4. The server allows the registration bypass only when MongoDB contains a workspace with the exact current code, `allowJoinByInviteLink=true`, and an unexpired `inviteCodeExpireAt`.
5. The new user is added as a collaborator before the sign-up succeeds. The invitation and redirect cookies are then cleared.

The cookie is client-controlled and is never treated as authorization by itself. Invalid, partial, disabled, expired, or rotated invitations are rejected before a user is created.

Existing users can continue to log in from the invitation page and accept the invitation through the normal join flow. Social account creation is hidden on invite-only sign-up because invitation context is not carried through the OAuth callback; existing users may still use social login.

## Regression checks

- Direct sign-up without an invitation is redirected to login when registration is disabled.
- A valid invitation exposes sign-up, survives a direct `/sign-up` reload, creates the user, and adds exactly one collaborator membership.
- Invalid or incomplete invitation details do not create a user or session.
- Existing authenticated users can still join through the invitation link.
