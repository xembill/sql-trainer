# SQL Trainer — Rana için 🐬

Tarayıcıda çalışan etkileşimli SQL öğrenme uygulaması. **17 adımlık** basitten zora ders dizisi (SELECT'ten pencere fonksiyonlarına), tarayıcıda gerçek SQLite motoru ([sql.js](https://github.com/sql-js/sql.js) / WebAssembly) ve otomatik kontrol edilen alıştırmalar. Backend yok, kayıt yok, hiçbir veri tarayıcıyı terk etmez.

Veri Mühendisliği 3. sınıfına geçen yeğenim **Rana** için, dayısı 🐬 ile yaptı.

## Neden var?

SQL'i sadece sözdizimi ezberleyerek değil, küçük bir e-ticaret veri seti üzerinde gerçek sorgular çalıştırarak ve anında doğru/yanlış geri bildiresi alarak öğrenmek için. Cevaplar "şöyle görünüyor mu?" ile değil, bir referans sorgunun sonucuyla satır satır karşılaştırılarak değerlendirilir.

## Özellikler

- **17 ders (basitten zora):** `SELECT`/`LIMIT` → `WHERE` → `ORDER BY` → `DISTINCT` → aggregates → `GROUP BY`/`HAVING` → `CASE WHEN` → `LIKE` → `JOIN` → `LEFT JOIN` → `COALESCE`/`NULL` → çoklu `JOIN` → self `JOIN` → subquery → `UNION` → CTE (`WITH`) → pencere fonksiyonları (`RANK() OVER`)
- Tarayıcıda gerçek SQLite (WebAssembly) — customers, products, orders, order_items, employees tabloları
- Sözdizimi vurgulu SQL editörü (CodeMirror), `Ctrl/Cmd+Enter` ile çalıştırma
- Otomatik değerlendirme: sorgunun sonucu referans çözümla karşılaştırılır (sütunlar + satırlar), metin eşleşmesi değil
- Her derste ipucu ve çözüm
- İlerlemenin yerel olarak takibi (`localStorage`), ilerleme çubuğu
- **Rana'ya Not** kutuları: her derste veri mühendisliğine özel ipucu ve motive edici mesajlar
- **Easter egg'ler:** konfeti, Konami kodu, editöre "RANA" yaz, Rana'ya özel sertifika
- Açık/koyu tema
- Tamamlandığında kişiselleştirilmiş sertifika (PNG/PDF)

## 🐬 Rana için Gözlem Paneli (Dayısına özel)

Rana'nın nasıl çalıştığını gözlemlemek için gizli bir panel var. Her olay (derse girme, sorgu çalıştırma, doğru/yanlış denemeler, ipucu kullanımı, çözüm gösterme, gezinme) ve her dersteki aktif süre kayıt altına alınır.

**Paneli açma:**
- Klavye: `Ctrl+Shift+G` (Mac'te `Cmd+Shift+G`)
- veya URL sonuna `#gozlem` ekle (örn. `http://localhost:8080/#gozlem`)

Panelde görebilecekler:
- Özet kartları: tamamlanan ders, toplam aktif süre, sorgu/kontrol sayısı, başarı oranı, ipucu & çözüm kullanımı
- Ders bazında detay tablosu (görüntülenme, süre, doğru/yanlış sayısı, ipucu, çözüm)
- **Yanlış denemeler**: Rana'nın tam olarak ne yazdığı ve neden hatalı olduğu
- Son etkinlik zaman çizelgesi (sayfa hareketleri)
- Verileri JSON olarak indirme veya özeti panoya kopyalama

### ☁️ Uzaktan izleme — Vercel'da yayınla (Rana kendi evinde, dayı kendi evinde)

En pratik yol: uygulamayı **Vercel'da** yayınla. İki küçük bulut fonksiyonu (`api/track.js`, `api/obs.js`) verileri Vercel'in ücretsiz deposunda (KV) tutar. Rana çalışırken veriler otomatik buluta gider; sen de aynı sitenin Gözlem Paneli'nde "Buluttan yükle" ile Rana'nın verisini görürsün. **Rana'ya bir şey indirtme yok, URL/key/Script yok.**

**1. GitHub'a pushla** (zaten repodayız).

**2. Vercel'a aktar**
- [vercel.com](https://vercel.com) → GitHub ile giriş → **Add New → Project** → bu repoyu **Import** et → varsayılanlarla **Deploy**.
  - Build ayarı gerekmez; Vercel `index.html`'i serve eder, `api/*` dosyalarını otomatik fonksiyon yapar.
- Birkaç saniye sonra canlı: `https://sql-trainer-...vercel.app`

**3. KV deposu bağla (ücretsiz, tek tık)**
- Vercel panelinde projen → **Storage** sekmesi → **Create Database** → **KV (Upstash)** → isim ver → **Connect**.
- Ortam değişkenleri (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) otomatik eklenir, sonra **Redeploy** et.
- (Hobby/ücretsiz plan yeterli; bu kullanım çok düşük.)

**4. Hepsi bu kadar**
- Rana siteyi açar, çalışır → veriler otomatik buluta gider.
- Sen (dayı) aynı siteyi açar → Gözlem Paneli (`Ctrl+Shift+G`) → **"Buluttan yükle (Rana'nın verisi)"** → Rana'nın cihazından gelen son durumu (tamamlanan dersler, başarı oranı, süre, yanlış denemeleri, son hareketleri) görürsün. Bu cihazdan buluta yazılmaz (veriyi üstüne yazmazsın).

> Not: Veriler Rana'nın tarayıcısında (offline yedek) **ve** Vercel KV'de tutulur. Yerel `file://` veya localhost'ta bulut çalışmaz (sessizce atlanır); canlı Vercel adresi gerekir.

<details>
<summary>Alternatif: Google E-Tablo (Apps Script) — daha zahmetli</summary>

İstersen Vercel yerine kendi Google E-Tablona da yazdırabilirsin: `google-sheet/apps-script.gs` dosyasını bir e-tabloda **Uzantılar → Apps Script**'e yapıştır, **Web uygulaması** olarak yayınla, `/exec` URL'ini al. (Bu yol aktif kullanılmıyor; Vercel önerilir.)
</details>

## Teknoloji

Saf HTML/CSS/JS — build adımı yok, framework yok, sunucu yok. Her şey tarayıcıda:
- [sql.js](https://github.com/sql-js/sql.js) — SQLite, WASM'e derlenmiş
- [CodeMirror 5](https://codemirror.net/5/) — sözdizimi vurgulu SQL editörü
- [jsPDF](https://github.com/parallax/jsPDF) — sertifika PDF'i

## Yerel olarak çalıştırma

Uygulama WebAssembly yüklediği için `file://` ile doğrudan açmak bazı tarayıcılarda güvenlik politikası nedeniyle engellenir. Yerel bir HTTP sunucusu kullan:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .
```

Sonra `http://localhost:8080` adresini aç.

## Yayınlama (GitHub Pages)

Tamamen statik bir site, yani GitHub Pages doğrudan çalışır:

1. Bu repoyu GitHub'a pushla
2. Repo **Settings → Pages → Source**: `main` dalından, kök klasörden yayınla
3. Uygulama `https://<kullanici>.github.io/<repo>/` adresinde canlı olur

## Yol haritası fikirleri

- Tarih/saat fonksiyonları, set operasyonları için ek ders dizileri
- Sabit cevap anahtarı olmayan "serbest pratik" modu
- Daha büyük/gerçekçi bir veri seti (örn. genel bir GA4 örnek verisi)

## Lisans

MIT — [LICENSE](LICENSE)'a bakın.
