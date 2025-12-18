# Film Kütüphanesi SPA

Bu proje, ISE-201 Web Teknolojileri dersi kapsamında geliştirilen bir Single Page Application (SPA) film kütüphanesi uygulamasıdır.

## Özellikler

- **Film Listesi**: Tüm filmler grid görünümünde listelenir
- **Arama ve Filtreleme**: İsme göre arama, kategoriye ve yıla göre filtreleme
- **Film Detayları**: Filmlerin detaylı bilgilerini görüntüleme
- **Favoriler**: Filmleri favorilere ekleme ve localStorage ile saklama
- **Responsive Tasarım**: Mobil, tablet ve masaüstü cihazlarda uyumlu görünüm
- **SPA Mimarisi**: Sayfa yenilenmeden içerik değişimi
- **URL Yönetimi**: Tarayıcı adres çubuğu güncelleme

## Kullanılan Teknolojiler

- **HTML5**: Semantik etiketler kullanılarak yapılandırıldı
- **CSS3**: Flexbox ve Grid kullanılarak responsive tasarım oluşturuldu
- **JavaScript (ES6+)**: Modern JavaScript özellikleri kullanıldı
  - Arrow Functions
  - Async/Await ve Promise
  - Template Literals
  - Destructuring
  - Spread Operator
- **Fetch API**: JSON verilerini çekmek için kullanıldı
- **localStorage**: Favori filmleri saklamak için kullanıldı

## Bonus Özellikler

Bu proje, zorunlu gereksinimlerin ötesinde aşağıdaki ekstra özelliklerle geliştirilmiştir:

### ✅ Uygulanan Bonus Özellikler

| Özellik | Açıklama |
|---------|----------|
| **Canlı Arama (Debounce)** | Arama kutusunda yazarken 300ms gecikmeli, performanslı filtreleme |
| **Gelişmiş Sıralama** | Ada (A→Z/Z→A), Yıla (yeni→eski/eski→yeni), Puana (yüksek→düşük/düşük→yüksek) göre sıralama |
| **Dinamik Sayfalama** | Sayfa başına 8/12/16/24 seçenekleri, Önceki/Sonraki kontrolleri |
| **Görsel Yükleme Dayanıklılığı** | Aktör görselleri için çoklu dosya adı denemesi ve `onerror` fallback |
| **CSS Animasyonları/Transitions** | Sayfa geçişleri, kart hover efektleri ve fade-in animasyonları |
| **Erişilebilirlik (A11y)** | ARIA etiketleri, `sr-only` sınıfları, focus göstergeleri |
| **Performans Optimizasyonu** | Verimli DOM manipülasyonu ve minimal re-render |
| **YouTube Fragman Entegrasyonu** | Film detay sayfasında gömülü fragman oynatıcı |
| **Memnuniyet Yıldız Sistemi** | Geri bildirim formunda interaktif 5 yıldızlı puanlama |

### 📋 Potansiyel Gelecek Geliştirmeler

Ödev dökümanında bonus puan kazandırabilecek diğer özellikler:

- [ ] PWA (Progressive Web App) özellikleri (Service Worker, manifest.json)
- [ ] Web Workers ile arka plan işlemleri
- [ ] Dark/Light tema geçişi

## Kurulum ve Çalıştırma

1. Projeyi bilgisayarınıza indirin
2. Herhangi bir web sunucusu ile çalıştırın (örn. Live Server)
3. Tarayıcınızda açın

### Kullanım
- Arama: Üstteki arama kutusuna yazdıkça sonuçlar 300ms debounce ile güncellenir. Enter ile anında arama yapılır.
- Filtreler: Kategori ve yıl filtreleri birlikte çalışır.
- Sıralama: "Sırala" menüsünden ada/yıl/puan kriterini seçin.
- Sayfalama: "Sayfa başına" menüsünden liste boyutunu seçin; alt kısımdaki Önceki/Sonraki ile sayfalar arasında geçiş yapın.

## Depo ve Yayın

- GitHub Depo:`https://github.com/ibrahimgenc27/SAUFL-X`
- GitHub Pages: `https://ibrahimgenc27.github.io/SAUFL-X/`

### GitHub Pages Yayın Adımları
- Depoda Settings → Pages → Source: `Deploy from a branch`
- Branch: `main` ve `/root` seçin (veya `docs` klasörünü kullanın)
- Kaydedin; birkaç dakika sonra Pages linki aktif olur.
- Eğer özel etki alanı kullanacaksanız, aynı sayfadan ekleyebilirsiniz.

### Önemli Notlar
- Dosya adları GitHub Pages’da büyük/küçük harfe duyarlıdır. Görseller için küçük harf ve tireli adlandırma önerilir (ör. `leonardo_dicaprio.jpg`).
- `WEB TEKNOLOJİLERİ ÖDEVİ.txt` dosyası `.gitignore` altında tutulur ve depoya gönderilmez.

## Geri Bildirim Formu (Validasyon)

- Menüde “Geri Bildirim” bağlantısı ile forma ulaşılır.
- HTML5 Validasyonlar: `required`, `type="email"`, `pattern`, `minlength` kullanıldı.
- JS Validasyonlar: Alan bazlı hata mesajları ve `localStorage`’a güvenli kayıt.
- Submit sonrası sayfa yenilenmeden “Gönderildi” bilgisi gösterilir.

## Proje Yapısı

```
├── index.html          # Ana HTML dosyası
├── css/                # CSS dosyaları
│   └── style.css       # Ana stil dosyası
├── js/                 # JavaScript dosyaları
│   └── app.js          # Ana uygulama kodu
└── data/               # Veri dosyaları
    └── movies.json     # Film verileri
```

## Ekran Görüntüleri

(Ekran görüntüleri buraya eklenecek)

## Geliştirici

ISE-201 Web Teknolojileri Dersi Öğrencisi
- **Adı Soyadı**: ibrahim Genç
- **Numarası**: b241200008