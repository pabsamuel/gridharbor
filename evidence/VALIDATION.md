# Validation ? 23 October 2026

- Node 24.19: 5 tests, 5 pass, 0 fail. Core reversible transforms, safe output, imports, offline signatures and service authorizations/limits.
- Chrome headless through Playwright 1.61.1, no extension installed: capture, safe DOM, cleanup, view persistence, recipes, full CSV download, append preserving originals, Pro gate, JSON backup restore; collector span/hidden/nested/ARIA/list/contact fixtures; 390px no page overflow; 0 external requests; 0 page errors.
- Independent read-only QA separately reran Node and Chromium suites successfully. Its MessageSender.tab concern was fixed by exact runtime ID/extension URL authorization without blanket tab rejection; final suites passed again.
- Real desktop 1360px and narrow 390px full-page screenshots reviewed. Desktop table readable, controls unclipped; narrow table scrolls within page, no horizontal document overflow. Malicious markup remains text.
- Package: 16 files, 16049 bytes, SHA256 91afbf7b6d84e8e043e8bf4b97230120768c9184db5a35f3496a6b47ae759b90. LICENSE and icons present; secrets/test/research/legacy excluded. Deterministic ZIP validated.
- npm lock audit: 3 packages audited, 0 vulnerabilities. Runtime has zero dependency packages.
- Signing secret scanned against every non-secret project file and decompressed ZIP member; no leak.
- Actual installed-extension toolbar/activeTab/service-worker permission integration unverified because user forbids extension use. No CWS submission or live store URL. No configured Paddle purchase; sales pending.

Additional positive Pro integration: isolated HTTP test server substitutes only public-key.js with an ephemeral generated verifier; unchanged runtime performs invalid-token rejection, successful UI activation using explicit txn_TEST fixture, reload persistence, fourth recipe, and all three CSV batch downloads compared byte-for-byte against expected transforms. No real signer or paid order is used/read. Zero external requests and page errors.

Directory fixtures reject English Name+Phone and Turkish Ad Soyad+Telefon; inventory quantity 123456789012 remains accepted. This conservative semantic check does not claim universal PII detection.

Editable-ancestor regression: independently reproduced synthetic unsaved table content captured under contenteditable=true. Table candidate guard now excludes [contenteditable] ancestors consistently with list/control handling. Browser regression rejects the editable table; full Chromium suite passes with zero external requests/errors.
