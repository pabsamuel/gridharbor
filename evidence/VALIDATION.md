# Validation ? 23 October 2026

- Node 24.19: 5 tests, 5 pass, 0 fail. Core reversible transforms, safe output, imports, offline signatures and service authorizations/limits.
- Chrome headless through Playwright 1.61.1, no extension installed: capture, safe DOM, cleanup, view persistence, recipes, full CSV download, append preserving originals, Pro gate, JSON backup restore; collector span/hidden/nested/ARIA/list/contact fixtures; 390px no page overflow; 0 external requests; 0 page errors.
- Independent read-only QA separately reran Node and Chromium suites successfully. Its MessageSender.tab concern was fixed by exact runtime ID/extension URL authorization without blanket tab rejection; final suites passed again.
- Real desktop 1360px and narrow 390px full-page screenshots reviewed. Desktop table readable, controls unclipped; narrow table scrolls within page, no horizontal document overflow. Malicious markup remains text.
- Package: 16 files, 15697 bytes, SHA256 be5e744392e9e3685392167e1a2138b8eaa48e0da7d89e6d90c380689f3a83f4. LICENSE and icons present; secrets/test/research/legacy excluded. Deterministic ZIP validated.
- npm lock audit: 3 packages audited, 0 vulnerabilities. Runtime has zero dependency packages.
- Signing secret scanned against every non-secret project file and decompressed ZIP member; no leak.
- Actual installed-extension toolbar/activeTab/service-worker permission integration unverified because user forbids extension use. No CWS submission or live store URL. No configured Paddle purchase; sales pending.
