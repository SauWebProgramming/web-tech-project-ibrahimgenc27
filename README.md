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

- **CSS Animasyonları**: Sayfa geçişleri ve hover efektleri
- **Erişilebilirlik (A11y)**: Ekran okuyucular için uygun etiketler ve ARIA özellikleri
- **Performans Optimizasyonu**: Verimli DOM manipülasyonu

## Kurulum ve Çalıştırma

1. Projeyi bilgisayarınıza indirin
2. Herhangi bir web sunucusu ile çalıştırın (örn. Live Server)
3. Tarayıcınızda açın

## Depo ve Yayın

- GitHub Depo:`https://github.com/ibrahimgenc27/SAUFL-X`
- GitHub Pages: `https://ibrahimgenc27.github.io/SAUFL-X/`

### GitHub Pages Yayın Adımları
- Depoda Settings → Pages → Source: `Deploy from a branch`
- Branch: `main` ve `/root` seçin (veya `docs` klasörünü kullanın)
- Kaydedin; birkaç dakika sonra Pages linki aktif olur.
- Eğer özel etki alanı kullanacaksanız, aynı sayfadan ekleyebilirsiniz.

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