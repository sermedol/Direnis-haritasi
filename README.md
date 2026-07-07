# Sınıf Atlası

İşçi direnişleri, grevler, adalet mücadeleleri, ekoloji nöbetleri ve sınıf mücadelesinin
güncel haritası.
## Dosyalar

- `index.html` — Yayına alınacak asıl dosya. GitHub Pages ve çoğu statik barındırma
  servisi varsayılan olarak bu dosyayı açar.
- `sinif-atlasi.html` — `index.html` ile birebir aynı içerik; `Sinif-Atlasi-Baslat.bat`
  yerel sunucuyu başlatınca bu dosyayı tarayıcıda açar.
- `direnisscope.template.html` — Yukarıdaki iki dosyanın türetildiği şablon. Veri
  (`data/direnis-listesi.tsv`) değiştiğinde bu şablondan yeni `index.html` /
  `sinif-atlasi.html` üretilir; logo burada `assets/umut-sen-logo.png` yolunu
  kullanır, üretilen dosyalarda ise taşınabilirlik için base64 olarak gömülüdür.
- `data/direnis-listesi.tsv` — Mücadele kayıtlarının kaynak verisi.
- `Sinif-Atlasi-Baslat.bat` — Windows'ta çift tıklayınca yerel bir Python HTTP sunucusu
  açıp uygulamayı tarayıcıda başlatan kısayol.
- `cloudflare-worker.js` — Haber/görsel taramasının kullandığı, ücretsiz Cloudflare
  Workers üzerinde barındırılan kendi proxy'mizin kaynak kodu.

## Yerel çalıştırma

Python 3 kurulu bir Windows makinesinde `Sinif-Atlasi-Baslat.bat` dosyasına çift
tıklamak yeterlidir. Elle çalıştırmak isterseniz:

```bash
python -m http.server 8899
# tarayıcıda http://localhost:8899/index.html
```


## umutsen.org entegrasyonu

Uygulama tamamen göreli yollarla ve harici CDN bağlantılarıyla (Google Fonts,
Leaflet/MarkerCluster) çalışır; hiçbir sunucu tarafı bileşene ihtiyaç duymaz.
umutsen.org üzerine eklenirken iki yaygın yöntem:

- **Alt dizin / alt alan adı olarak barındırma**: bu klasörü olduğu gibi
  `umutsen.org/sinif-atlasi/` gibi bir yola kopyalayıp `index.html`'i sunun.
- **iframe ile gömme**: `index.html`'i ayrı barındırıp (ör. GitHub Pages) ana
  sitede `<iframe src="...">` ile gömün.

Her iki durumda da dosya taşınabilir tek parça statik bir sayfa olduğundan ekstra
yapılandırma gerekmez.
