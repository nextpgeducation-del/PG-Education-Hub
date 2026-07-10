---
name: esbuild-bundled runtime file dependencies
description: Packages that read sibling files on disk at runtime (not via require/import) break silently when esbuild-bundled into a single output file.
---

Some npm packages resolve auxiliary files (SQL scripts, templates, locale data, etc.) relative to their own module directory at runtime using `fs.readFile(path.join(__dirname, "some-file"))`, rather than importing them as modules. Bundling such a package with esbuild collapses everything into one output file, so the on-disk directory structure the package expects no longer exists — the read fails.

**Why:** Hit this with `connect-pg-simple`'s `createTableIfMissing` option. It emits an `error` event (not a thrown exception) when it can't find `table.sql`, so the failure was silent: sessions were created, cookies were set, but the session was never persisted server-side and every subsequent request appeared "not logged in". No crash, no visible error — only found it by attaching an explicit `store.on("error", ...)` listener and inspecting workflow logs.

**How to apply:** If a backend package needs to read non-JS files from its own package directory at runtime (common in DB session stores, template engines, migration runners), add it to the esbuild `external` array in `build.mjs` rather than letting it bundle. If a "successful" login/write doesn't persist or silently no-ops, check whether the underlying library emits its own `error` events that aren't being listened to — don't assume no thrown exception means no error.
