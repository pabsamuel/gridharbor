# C01 / C02 market and static package research

Checked 23 October 2026, Europe/Istanbul. Research only; revenue, paid conversion and earnings were not verified. The store exposes rounded users, not paying customers. No purchases, installation, package execution, account creation or authentication were performed.

## Decision and category coverage

| Category / candidate | Evidence opened | Decision |
|---|---|---|
| Productivity / Table Capture | [CWS](https://chromewebstore.google.com/detail/table-capture/iebpjdmgckacbodjpijphcplhebcmeop): 200,000 users, 4.3/5, 605 ratings in retrieved listing. [Official plans](https://georgemike.com/tablecapture/plans/): Basic $12/year up to 1,000 rows; Max $120/year unlimited; free exports limited to 250 rows. | Select: visible page extraction and file export can run locally. Keep essential export usable free. |
| Developer Tools / GoFullPage | [CWS](https://chromewebstore.google.com/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl?hl=en): 11,000,000 users, 4.9/5, 84.6K ratings; premium editor disclosed. [Official FAQ](https://gofullpage.com/faq) search index states $12/year, seven-day trial, premium required to download edited results. The FAQ page itself produced zero extracted lines, so pricing has weaker direct-page verification than Table Capture. | Select: screenshot processing and editing can be local; free crop/redaction is a concrete differentiation. Do not claim faster without measured comparisons. |
| Productivity / Session Buddy | [CWS](https://chromewebstore.google.com/detail/session-buddy-tab-bookmar/edacconmaakjimmfgnblocblbcdcpbko?hl=en): 1,000,000 users; description explicitly says all existing features free, only a future cloud alternative would be premium. | Exclude from paid/freemium shortlist under the requested condition. |
| Productivity / Workona | [CWS](https://chromewebstore.google.com/detail/tab-manager-by-workona/ailcmbgekjpnablpdkmaaccecekgdhlh?hl=en): 200,000 users. [Official plans](https://workona.com/pricing/) disclose Pro, Team and Enterprise features; dynamic numeric prices were absent in extracted content. | Secondary; cloud collaboration makes full parity incompatible with local-only constraints. |
| Developer Tools / JSON Lens | [CWS](https://chromewebstore.google.com/detail/json-lens/lgggchgflmkdckkedionfdfkaceonpbo): $9.99 one-time Pro stated, three ratings; no high user count exposed in retrieved content. | Exclude: payment model exists but adoption evidence is insufficient. Broad JSON market research was not exhaustive. |
| Shopping / Keepa | [CWS](https://chromewebstore.google.com/detail/keepa-amazon-price-tracke/neebplgakaahbhdphmkckjjcegoiijjo?hl=en-IN): 5,000,000 users and 3.4/5 on opened page; search cache had stale 4M/4.7. Description explains connection to its price-history database via keepa.com and Amazon permissions. | Exclude: historical multi-billion-product dataset cannot be recreated by a fully local extension. A local watchlist would have materially narrower utility. Numeric paid-plan price not verified. |

Report Fixer QBO, Workable and AI Chat Toolbox K05 are excluded by the owner. C01 should also omit accounting-specific QuickBooks export even though the inspected competitor package contains that route.

## Low-star evidence, not invented review summaries

Store review UI was not installed or interacted with. Individual reviews below are third-party mirrors of store reviews; availability and preservation are controlled by those mirrors. They are not independently authenticated originals.

1. [Table Capture mirror](https://chrome-stats.com/d/iebpjdmgckacbodjpijphcplhebcmeop/reviews), 2026-10-07, author masked Re*****, **1 star**: reviewer objects that useful functionality has moved to recurring payment. Own-words paraphrase.
2. Same mirror, 2026-07-10, author shown in Cyrillic and masked, **1 star**: reviewer reports excessive restrictions and inability to download even one table. Own-words translation. Together these support a repeated restriction/paywall complaint, not a claim that most users are dissatisfied.
3. [GoFullPage mirror](https://gofullpage.browserinsider.com/), 2026-06-11 04:21:27, author A, **1 star**: only the present viewport was captured on a Cypress Canvas page. The review block contains exactly one `fas fa-star` element; inspected with a non-executing HTML fetch.
4. Same mirror, 2026-06-12 10:29:48, author JustPlay!t, **1 star**: capture does not work on a Cloudflare challenge page. Record as a limitation; bypassing challenges is outside scope.
5. Supplemental, **not low-star**: same mirror, 2026-04-03 Chris Richter reports no scrolling-page capture; 2026-04-02 muhammad nazmi reports viewport-only output. These support repetition of a scrolling failure theme but must not be described as 1–2-star reviews.

## Open-source priority

- [CopyTables](https://github.com/gebrkn/copytables): 152 stars / 33 forks at observation; [MIT LICENSE](https://github.com/gebrkn/copytables/blob/master/LICENSE), copyright Georg Barikin. Repository documents existing CSV/TSV/HTML, cell selection, iframe and transpose capability. Use a licensed fork and preserve attribution; do not substitute downloaded proprietary Table Capture code.
- [Original full-page capture project](https://github.com/mrcoles/full-page-screen-capture-chrome-extension): public historical source is the candidate base selected by coordinator. Current CWS GoFullPage package is a separate inspected proprietary artifact; its presence does not license its current source. Preserve the upstream LICENSE and source line after verifying the exact fork revision.
- [Tabli](https://github.com/antonycourtney/tabli): 413 stars / 59 forks; [MIT LICENSE](https://github.com/antonycourtney/tabli/blob/master/LICENSE), copyright Antony Courtney, as an alternative source base if a future session project is selected.

## Official package acquisition and isolation

Both packages downloaded successfully, HTTP 200, from Google's official `clients2.google.com/service/update2/crx` endpoint using extension IDs. The reproducible metadata and hashes are in [packages.json](packages.json). Raw CRX and extraction live only in ignored `private-packages/`; never include this directory in C01/C02, ZIPs, Git commits or published artifacts. No proprietary executable code, text, icon or image is delivered in this research report. The package scripts were not executed and no extension was installed.

| Package | Downloaded manifest version | Size | SHA-256 |
|---|---|---|---|
| Table Capture | MV3, 11.0.45 | 7,029,185 bytes | `299c7be04fd931a9bdf045e61d2bc6fd6e83b6c5d4c42fa58e8be1d1f7a36082` |
| GoFullPage | MV3, 8.9 | 890,215 bytes | `ed803408e3217c0bfc25d4c90cb425313524e7d45b64c11ee9353d9ccd929199` |

Table Capture downloaded package 11.0.45 is newer than store text observed as 11.0.42. Report the package metadata separately rather than silently treating them as identical snapshots.

### Table Capture inventory and inferred data flow

Static HTML routes indicate: toolbar table chooser; settings; editable grid; saved clips; activity; local CSV input; JSON input; PDF extraction; repeatable recipes; sheet management; cloud panel; optional AI settings; account; paid upgrade; existing-key activation; diagnostics/support; accounting-specific export. Route presence proves packaged screens, not successful feature execution.

Manifest has a module service worker and document-start content script on all URLs and frames, including blank child frames. Required permissions: contextMenus, storage, tabs, webNavigation and all-site host access. Optional identity, userScripts and downloads. Google scopes request spreadsheet access and email identity; public OAuth client identifier is omitted as irrelevant. This is broader access than a click-only local extractor needs.

Static API signals include messaging, extension/local/IndexedDB storage, downloads, scroll control and network clients. Referenced service hosts include Google Sheets APIs, georgemike.com, OpenAI and local Ollama-related resources. Host strings may occur in documentation or dependencies and are **not evidence those requests execute**. Inferred architecture: page content collection communicates with worker and extension pages; local editing/export can happen in browser; Sheets, cloud, licensing and optional AI introduce external flows. Their exact payloads, endpoints called and consent timing were not runtime-verified.

### GoFullPage inventory and inferred data flow

Static routes indicate: toolbar/start state; capture result; alternate capture view; image editor; options; welcome/onboarding; premium/account integration frame. Manifest uses a service worker and action popup. Required activeTab, scripting, storage, unlimitedStorage; optional downloads, tabs, webNavigation and all-site/file host access. No persistent content-script declaration in the inspected manifest.

Static signals include viewport capture, script injection, scrolling, message passing, canvas, file download, local and IndexedDB storage, and network clients. Inferred architecture: user action grants active-tab access; worker injects page coordination; viewport images are captured while scrolling; image output is assembled and shown in extension result/editor pages. CWS documents separate images when a single canvas cannot fit the page. Referenced hosts include gofullpage.com and its historical product domain, premium web frames and Google Analytics strings. Presence alone does **not** establish analytics execution or data transmission. No runtime traffic capture was performed.

## Access gates and remaining verification

Standalone Playwright launched installed Chrome in headless mode without extensions, using an isolated empty browser context. [access.json](access.json) records final URLs/titles/statuses. Both services returned HTTP 200 public authentication gates: CWS redirected to Google sign-in and Paddle to login.paddle.com. There was **no application error text**; `visible_error` is null. These observations do not establish whether the owner's existing interactive Chrome profile already has valid sessions. No credentials were entered and no gate was bypassed. Screenshots contain only public empty login forms.

No complete hands-on competitor UI audit has been performed: the user prohibits browser-extension use. Screen/function coverage is derived from public descriptions and static package metadata. Exact runtime consent, complete feature behavior, authenticated publishing access, Paddle product configuration and sales remain unverified. Download/static inspection satisfies package research only. No quota/limit error occurred.
