# Issue 283 and 284 fixes

## Summary

This change fixes two self-hosted deployment regressions:

- Issue #283: `/api/image` can now fetch images from the configured KyndForm
  origin when that origin is a private network address, while arbitrary private
  network targets remain blocked.
- Issue #284: the production server HTML now includes favicon links, and
  direct browser requests to `/favicon.ico` redirect to `/static/favicon.ico`.

## Implementation notes

- Private image fetches are only allowed for exact configured first-party
  origins from `APP_HOMEPAGE_URL` and `S3_PUBLIC_URL`. The protocol, hostname,
  and port must match.
- The existing public image allowlist remains in place for Gravatar,
  Googleusercontent, and Unsplash images.
- Failed upstream image fetches return a no-content image response instead of
  bubbling as an unhandled server exception. This lets the frontend image
  fallback paths run without logging a 500 for offline self-hosted servers.
- The server template in `packages/server/view/index.html` is updated because
  the Docker build copies it into the webapp build before producing the final
  static HTML.

## Operational notes

For self-hosted deployments on private IP ranges, set `APP_HOMEPAGE_URL` to the
same origin that users use in the browser, including the port when one is used:

```env
APP_HOMEPAGE_URL=http://192.168.112.4:9157
```

If uploaded images are served from a separate private object storage origin,
set `S3_PUBLIC_URL` to that exact public-facing origin.
