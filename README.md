# KEHAİ 気配

Arashiyama, Kyoto'da kurgulanmış on yedi odalı bir **duyusal senkronizasyon
oteli** için tanıtım sitesi.

→ **https://bernakym.github.io/kehai-otel/**

KEHAİ, Berna Kayım'ın iç mimarlık bitirme projesi kapsamında geliştirilen otel
konseptinin, otel hayata geçmiş gibi anlatıldığı bir web sitesidir. Site bilinçli
olarak **hiç bina fotoğrafı içermiyor**: proje görüntüyle değil, duyularla
anlatılıyor. Dokular (shoji ızgarası, karesansui kumu, washi greni) tamamen
CSS ve SVG ile üretildi.

Oda dağılımı: 9 standart oda (27–30 m²), 4 connection oda (40 m², 2 bağlantılı
çift), 4 süit (50 m²).

## Palet

Her renk bir duyunun karşılığı:

| Duyu | Renk | Kod |
| --- | --- | --- |
| Görme | Washi kırık beyazı | `#F3EFE6` |
| İşitme | İndigo (aizome) | `#1B2430` |
| Dokunma | Ham traverten beji | `#D8CEBE` |
| Tatma | Yanık yeşil çay | `#5A6349` |
| Koku | Tütsü külü / sedir fümesi | `#8C827A` |

## Dosyalar

```
index.html            tek sayfalık site
assets/css/style.css  palet, dokular, gündüz/gece teması
assets/js/main.js     tema, menü, görünürlük animasyonu, rezervasyon formu
assets/logo.png       sunumdaki logo (CSS maskesi olarak kullanılır)
assets/favicon.png    favicon
```

Yapı aracı yok, bağımlılık yok. Yerelde açmak için `index.html`'e çift tıklamak
yeterli.

## Notlar

- **Gece modu** sağ üstteki düğmeyle değişir, tercih tarayıcıda saklanır.
- **Rezervasyon formu** statik barındırmada sunucu olmadığı için talebi
  `mailto:` ile hazır bir e-postaya dönüştürür.
- Logo, sunum dosyasından birebir alındı; alfa kanalı CSS maskesi olarak
  kullanıldığı için gündüz/gece temasında rengi kendiliğinden değişir.
- Tipografi: Cormorant Garamond, Jost, Shippori Mincho (Google Fonts).
- `prefers-reduced-motion` ve yazdırma için ayrı davranış tanımlı.

Tasarım ve metin: Berna Kayım.
