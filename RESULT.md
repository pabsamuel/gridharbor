# Cross-check rv-c01-cws-clone-wave — 23 October 2026

Sonuç: DUZELTILDI. İki hata giderildi. Node 5/5 ve Chromium harness yeniden geçti.

## Yapılan
Codex raporu, TASK.md ve SPEC kabul koşulları okundu. Commit `b30858f` üzerindeki iddia edilen paket doğrulandı: 16049 byte, SHA256 `91afbf7b6d84e8e043e8bf4b97230120768c9184db5a35f3496a6b47ae759b90`. Ardından bulunan iki hata düzeltildi ve paket yeniden üretildi.

Kontrol edilen ve tutan iddialar: MV3 manifest (`activeTab`, `scripting`, `storage`; `host_permissions` yok; CSP `connect-src 'none'`), ücretsiz dışa aktarma, çevrimdışı Pro anahtarı, satış metninde açık bekleyen ödeme, LISTING özeti 111 karakter, görsel renkler `#EAF2F2` / `#176B65` / `#24384B` / `#536B7A` / uyarı `#9A5C09`. `evidence/desktop.png` ve `narrow.png` sentetik envanter gösterir; zararlı işaret metin olarak durur; satın alma düğmesi yoktur; dar ekranda yatay sayfa taşması yoktur. `.secrets` bu ağaçta yok. ZIP içinde JWK özel alanı `d` yoktur. Ürün sayfası bu kontrolde HTTP 200 (`GridHarbor for Chrome browser`). GitHub `v0.1.0-rc.2` HTTP 200. Rapordaki site 403 bugünkü istekle doğrulanmadı.

## Değişen dosyalar
- `extension/collector.js` — noktasız ı başlık katlaması ve `adi` alternatifi
- `tests/browser.mjs` — Adı Soyadı, Müşteri Adı, Adı + Telefon retleri
- `tools/package.py` — metin üyelerini LF yap
- `dist/gridharbor-0.1.0.zip` — yeniden paket
- `evidence/VALIDATION.md`, `TASK.md` — güncel özet ve ZIP satırı

## Çalıştırılan testler
- `npm test` — tests 5, pass 5, fail 0, duration_ms 116.6169
- `npm run test:browser` — PASS Chromium: capture, safe DOM, cleanup, persistence, recipe, CSV download, append, Pro gate, ephemeral `txn_TEST` activation, fourth recipe, 3 exact batch CSV, backup restore, desktop/390px no overflow, merged/hidden/nested/ARIA/list/contact, English/Turkish directory including dotless-i headers, editable ancestor; 0 external requests; 0 page errors
- `npm audit` — 3 packages, 0 vulnerabilities
- `python tools/package.py` — PASS package: 16 files, 16067 bytes, SHA256 `bab33f4576782e4d0c121d8252e8b24575cdbd40405b2707ddce8cccf971c980`. testzip temiz. Metin üyelerinde CR yok. LICENSE ve dört ikon var.

## Kalan engel
Kurulu eklenti, activeTab ve service worker canlı testi yok; sahip kuralı eklenti kullanımını yasaklıyor. CWS gönderimi yok. Beş tanıtım görseli planda, mağaza render'ı üretilmedi. Paddle kurulu değil; para harcanmadı. 50 token benzerlik taraması bu oturumda yeniden koşulmadı. GoFullPage yorum kanıtı bu deponun dışında, bakılmadı.
