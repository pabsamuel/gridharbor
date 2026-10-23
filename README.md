# GridHarbor

Local MV3 table workbench, version 0.1.0. Release preparation; not installed, submitted or store-approved. No comparative speed or revenue claims.

Project: https://github.com/pabsamuel/gridharbor

Source: https://github.com/gebrkn/copytables at 2eeda5d09dd8ffbf2d00fa5535c71644fc17ecdc, MIT, Georg Barikin. This repository retains upstream history, LICENSE and legacy source. New extension/ is the shipped MV3 implementation. Its collector adapts visible/text DOM helpers, and vendor/matrix.js adapts actual upstream transpose/column algorithms. All branding, interface and additional workflows are original. No proprietary competitor code, images, icons or copy are shipped. Legacy gulp/source files are reference history, excluded from ZIP and not required to build.

## Available
User-triggered visible HTML/ARIA table capture and explicit list selectors; bounded merged-cell handling; reversible trim/filter/dedupe/transpose and column selection; safe CSV, TSV, JSON, Markdown and clipboard; multi-table previews; manual append into a new table retaining both source tables; local recovery, JSON backup/restore; three free recipes. Pro verifies signed keys offline and unlocks more recipes plus batch CSV. All individual exports stay free. Planned $19 lifetime; sales and checkout are not configured. Paddle dashboard order verification and manual key fulfillment are the intended existing-account pattern, not a working checkout.

## Boundaries
100,000 cells / 100 tables per workspace, 1,000 columns per validated dataset, 10,000 text characters per cell. Lists include one header within the same cell bound. Preview shows at most 101 rows; export uses all filtered rows. Only rendered rows; no automatic pagination, hidden content, cross-origin frames or controls. Contact email/mailto/tel detection rejects capture; this is a safeguard, not a general personal-data classifier. No credentials or personal contact directories should be captured. Extremely long text is truncated to 10,000 characters during capture. Imported backups are capped at 12 MB and validated. Browser storage quota can be lower than the cell bound; keep exported backups. JSON retains content text; CSV/TSV neutralize leading formula markers. Markdown escapes HTML, pipes and newlines.

Capture uses activeTab/scripting/storage, no persistent site permissions or remote requests. Refresh capture from an existing workbench can fail after source navigation because activeTab permission expires. Click the source page toolbar again. Toolbar captures add tables without silently erasing old data. Backups export captures only, not keys/recipes/cleanup preferences; those persist locally. Clearing local data deletes the saved license too. Source pages are never modified by cleanup.

C03-local-table-export overlaps basic extraction. GridHarbor is a successor alternative with reversible workspace, append, recipes and multi-table previews. Hold C03 as a duplicate SKU; do not submit both as substantially similar extensions. No overlap with Report Fixer QBO, Workable or AI Chat Toolbox.

## Verification and packaging
Node 24+: `node --test tests/core.test.mjs` (5 tests). Browser: `npm install --ignore-scripts`, then `node tests/browser.mjs`; it uses locally installed Playwright or the existing sibling C03 dependency, and existing system Chrome headlessly. No extension is installed or used. Harness executes unchanged shipped modules with chrome.* mocks. Browser test covers capture, cleanup, persistence, recipes, full CSV download, append, Pro gate, local backup restore, merged/hidden/nested/ARIA/list/contact DOM and zero remote requests. Desktop and 390px screenshots in evidence/ were visually reviewed. Live installed-extension permissions and service-worker lifecycle remain unverified under the user's no-extension-use rule.

`python tools/package.py` builds a deterministic ZIP containing extension runtime and LICENSE only, then verifies entries and references. No npm build or paid dependency required. `dist/gridharbor-0.1.0.zip` is the upload artifact.

## License fulfillment
`node tools/license.mjs init` was run once. The signing key is only in ignored .secrets/; never upload it. The public verifier ships. After verifying a real paid Paddle transaction in the existing dashboard, set C01_LICENSE_OUTPUT to a local .key path and run `node tools/license.mjs issue txn_VERIFIEDORDER lifetime`. No Paddle secret is present in the extension and no API/server is required. Keep private signing key safely backed up; losing it prevents issuing compatible keys. Existing lifetime licenses cannot be remotely revoked.

Product / privacy / support URLs are listed in SUBMIT.md. They do not imply store availability.
