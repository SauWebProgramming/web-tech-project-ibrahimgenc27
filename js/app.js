// DOM Elementleri
const moviesGrid = document.getElementById('movies-grid');
const favoritesGrid = document.getElementById('favorites-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const yearFilter = document.getElementById('year-filter');
const searchButton = document.getElementById('search-button');
const contentSection = document.getElementById('content-section');
const movieDetails = document.getElementById('movie-details');
const detailContent = document.getElementById('detail-content');
const backButton = document.getElementById('back-button');
const homeLink = document.getElementById('home-link');
const favoritesLink = document.getElementById('favorites-link');
const feedbackLink = document.getElementById('feedback-link');
const favoritesSection = document.getElementById('favorites-section');
const feedbackSection = document.getElementById('feedback-section');
const feedbackForm = document.getElementById('feedback-form');
const feedbackStatus = document.getElementById('feedback-status');
// Modal kullanılmıyor; fragman detay sayfasında gömülü oynatılıyor.

// Uygulama Durumu
let movies = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let filteredMovies = [];
let currentView = 'home'; // 'home', 'details', 'favorites'
// 'feedback' görünümü eklendi

// Sayfa Yüklendiğinde
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadMovies();
        setupYearFilter();
        renderMovies(movies);
        updateFavoriteButtons();
        setupEventListeners();
        handleUrlHash();
        setupFeedbackForm();
    } catch (error) {
        console.error('Uygulama başlatılırken hata oluştu:', error);
}
});

// Film Verilerini Yükle
const loadMovies = async () => {
    try {
        const response = await fetch('./data/movies.json');
        if (!response.ok) {
            throw new Error('Film verileri yüklenemedi');
        }
        const data = await response.json();
        movies = data.movies;
        filteredMovies = [...movies];
        return movies;
    } catch (error) {
        console.error('Film verileri yüklenirken hata oluştu:', error);
        throw error;
    }
};

// Yıl Filtresini Ayarla
const setupYearFilter = () => {
    const years = [...new Set(movies.map(movie => movie.year))].sort((a, b) => b - a);
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
};

// YouTube video ID çıkar
const extractYouTubeId = (url) => {
    try {
        const u = new URL(url);
        // standart watch URL: ?v=ID
        const v = u.searchParams.get('v');
        if (v) return v;
        // youtu.be/ID
        if (u.hostname === 'youtu.be') {
            return u.pathname.replace('/', '');
        }
        // /embed/ID
        if (u.pathname.startsWith('/embed/')) {
            return u.pathname.split('/embed/')[1];
        }
    } catch (e) {
        // geçersiz URL durumunda null döndür
    }
    return null;
};

// Modal tabanlı fragman gösterimi kaldırıldı.

// Filmleri Listele
const renderMovies = (moviesToRender) => {
    moviesGrid.innerHTML = '';
    
    if (moviesToRender.length === 0) {
        moviesGrid.innerHTML = '<p class="no-results">Arama kriterlerinize uygun film bulunamadı.</p>';
        return;
    }
    
    moviesToRender.forEach(movie => {
        const isFavorite = favorites.some(fav => fav.id === movie.id);
        
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card fade-in';
        movieCard.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${movie.id}">
                <i class="fas fa-heart"></i>
                <span class="sr-only">${isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}</span>
            </button>
            <div class="movie-card-content">
                <h3>${movie.title}</h3>
                <p>${movie.year} | ${movie.category}</p>
                <div class="rating">
                    <i class="fas fa-star"></i> ${movie.rating}/10
                </div>
                <button class="btn details-btn" data-id="${movie.id}">Detaylar</button>
            </div>
        `;
        
        moviesGrid.appendChild(movieCard);
    });
    
    // Detay butonlarına tıklama olayı ekle
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const movieId = parseInt(e.target.dataset.id);
            showMovieDetails(movieId);
        });
    });
    
    // Kartlarda fragman butonu kaldırıldı (kullanıcı talebi)
    
    // Favori butonlarına tıklama olayı ekle
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Kalp simgesine tıklandığında favorilere ekle
            if (e.target.tagName === 'I' || e.target.classList.contains('sr-only')) {
                const movieId = parseInt(btn.dataset.id);
                toggleFavorite(movieId);
            } 
            // Siyah kısma tıklandığında sadece etrafı kırmızı yap
            else {
                btn.classList.toggle('active');
            }
        });
    });
};

// Favorileri Listele
const renderFavorites = () => {
    favoritesGrid.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<p class="no-results">Henüz favori film eklemediniz.</p>';
        return;
    }
    
    favorites.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card fade-in';
        movieCard.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <button class="favorite-btn active" data-id="${movie.id}">
                <i class="fas fa-heart"></i>
                <span class="sr-only">Favorilerden çıkar</span>
            </button>
            <div class="movie-card-content">
                <h3>${movie.title}</h3>
                <p>${movie.year} | ${movie.category}</p>
                <div class="rating">
                    <i class="fas fa-star"></i> ${movie.rating}/10
                </div>
                <button class="btn details-btn" data-id="${movie.id}">Detaylar</button>
            </div>
        `;
        
        favoritesGrid.appendChild(movieCard);
    });
    
    // Detay butonlarına tıklama olayı ekle
    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const movieId = parseInt(e.target.dataset.id);
            showMovieDetails(movieId);
        });
    });
    
    // Favori kartlarda fragman butonu kaldırıldı (kullanıcı talebi)

    // Favori butonlarına tıklama olayı ekle
    document.querySelectorAll('#favorites-grid .favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const movieId = parseInt(e.target.dataset.id);
            toggleFavorite(movieId);
            renderFavorites(); // Favoriler güncellendiğinde yeniden render et
        });
    });
};

// Film Detaylarını Göster
const showMovieDetails = (movieId) => {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;
    
    window.location.hash = `movie-${movieId}`;
    const videoId = movie && movie.trailer ? extractYouTubeId(movie.trailer) : null;
    
    detailContent.innerHTML = `
        <div class="detail-content">
            <div class="detail-image">
                <img src="${movie.image}" alt="${movie.title}">
                ${videoId ? `
                <div class="trailer-section" style="margin-top: 1rem;">
                    <h3 style="margin-bottom: 0.5rem;">Fragman</h3>
                    <div class="trailer-iframe-container">
                        <iframe src="https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&iv_load_policy=3&playsinline=1"
                                title="${movie.title} Fragman"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                    </div>
                </div>
                ` : ''}
            </div>
            <div class="detail-info">
                <h2>${movie.title}</h2>
                <div class="meta">
                    <span><i class="fas fa-calendar"></i> ${movie.year}</span>
                    <span><i class="fas fa-film"></i> ${movie.category}</span>
                    <span><i class="fas fa-user"></i> ${movie.director}</span>
                </div>
                <div class="rating">
                    <i class="fas fa-star"></i> ${movie.rating}/10
                </div>
                <div class="description">
                    <p>${movie.description}</p>
                </div>
                <div class="cast">
                    <h3>Oyuncular</h3>
                    <div class="cast-list">
                        ${movie.cast.map(actor => {
                            // Oyuncu fotoğrafını yükleme
                            let actorFileName = actor.replace(/\s+/g, '_');
                            
                            // Özel isim kontrolleri
                            if (actor === "Samuel L. Jackson") {
                                actorFileName = "Samuel_L_Jackson";
                            } else if (actor === "Samuel Jackson") {
                                actorFileName = "Samuel_L_Jackson";
                            }
                            
                            // Fotoğraf dosyasının var olup olmadığını kontrol et
                            let imgSrc = `./images/${actorFileName}.jpg`;
                            
                            // UI Avatars için daha iyi bir görsel oluştur
                            let avatarSrc = 'https://ui-avatars.com/api/?name=' + 
                                encodeURIComponent(actor) + 
                                '&background=E50914&color=fff&size=150&bold=true&rounded=true';
                            
                            // Hata yakalama ve yedek görsel gösterme
                            try {
                                const img = new Image();
                                img.onerror = function() {
                                    document.getElementById(`actor-img-${actorFileName}`).src = avatarSrc;
                                };
                                img.src = imgSrc;
                            } catch (e) {
                                // Hata durumunda varsayılan avatar kullan
                                imgSrc = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(actor) + '&background=E50914&color=fff&size=80';
                            }
                            
                            return `
                            <div class="cast-item">
                                <div class="cast-image-container">
                                    <img id="actor-img-${actorFileName}" src="${imgSrc}" alt="${actor}" class="cast-avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(actor)}&background=E50914&color=fff&size=150&bold=true&rounded=true'">
                                </div>
                                <p>${actor}</p>
                            </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <button class="btn favorite-detail-btn ${favorites.some(fav => fav.id === movie.id) ? 'active' : ''}" data-id="${movie.id}">
                    <i class="fas fa-heart"></i> ${favorites.some(fav => fav.id === movie.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                </button>
            </div>
        </div>
    `;
    
    // Artık fragman inline oynatılıyor; ekstra olay gerekmiyor

    // Detay sayfasındaki favori butonuna tıklama olayı ekle
    document.querySelector('.favorite-detail-btn').addEventListener('click', (e) => {
        const movieId = parseInt(e.target.dataset.id);
        toggleFavorite(movieId);
        
        // Buton metnini güncelle
        const isFavorite = favorites.some(fav => fav.id === movieId);
        e.target.innerHTML = `<i class="fas fa-heart"></i> ${isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}`;
        e.target.classList.toggle('active', isFavorite);
    });
    
    // Görünümü değiştir
    contentSection.classList.add('hidden');
    favoritesSection.classList.add('hidden');
    movieDetails.classList.remove('hidden');
    currentView = 'details';
    
    // Aktif menü öğesini güncelle
    updateActiveNavLink();
};

// Favorilere Ekle/Çıkar
const toggleFavorite = (movieId) => {
    const movie = movies.find(m => m.id === movieId);
    if (!movie) return;
    
    const isFavorite = favorites.some(fav => fav.id === movieId);
    
    if (isFavorite) {
        favorites = favorites.filter(fav => fav.id !== movieId);
    } else {
        favorites.push(movie);
    }
    
    // LocalStorage'a kaydet
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Favori butonlarını güncelle
    updateFavoriteButtons();
    
    // Eğer favoriler görünümündeyse, listeyi güncelle
    if (currentView === 'favorites') {
        renderFavorites();
    }
};

// Favori Butonlarını Güncelle
const updateFavoriteButtons = () => {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const movieId = parseInt(btn.dataset.id);
        const isFavorite = favorites.some(fav => fav.id === movieId);
        
        btn.classList.toggle('active', isFavorite);
        btn.querySelector('.sr-only').textContent = isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle';
    });
};

// Filmleri Filtrele
const filterMovies = () => {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedYear = yearFilter.value;
    
    filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === '' || movie.category === selectedCategory;
        const matchesYear = selectedYear === '' || movie.year.toString() === selectedYear;
        
        return matchesSearch && matchesCategory && matchesYear;
    });
    
    renderMovies(filteredMovies);
};

// Ana Sayfayı Göster
const showHomePage = () => {
    window.location.hash = 'home';
    contentSection.classList.remove('hidden');
    movieDetails.classList.add('hidden');
    favoritesSection.classList.add('hidden');
    currentView = 'home';
    updateActiveNavLink();
};

// Favoriler Sayfasını Göster
const showFavoritesPage = () => {
    window.location.hash = 'favorites';
    contentSection.classList.add('hidden');
    movieDetails.classList.add('hidden');
    favoritesSection.classList.remove('hidden');
    currentView = 'favorites';
    renderFavorites();
    updateActiveNavLink();
};

// Aktif Menü Öğesini Güncelle
const updateActiveNavLink = () => {
    homeLink.classList.toggle('active', currentView === 'home');
    favoritesLink.classList.toggle('active', currentView === 'favorites');
    feedbackLink.classList.toggle('active', currentView === 'feedback');
};

// URL Hash'ini İşle
const handleUrlHash = () => {
    const hash = window.location.hash.substring(1);
    
    if (hash.startsWith('movie-')) {
        const movieId = parseInt(hash.split('-')[1]);
        showMovieDetails(movieId);
    } else if (hash === 'favorites') {
        showFavoritesPage();
    } else if (hash === 'feedback') {
        showFeedbackPage();
    } else {
        showHomePage();
    }
};

// Olay Dinleyicilerini Ayarla
const setupEventListeners = () => {
    // Arama ve filtreleme
    searchButton.addEventListener('click', filterMovies);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            filterMovies();
        }
    });
    categoryFilter.addEventListener('change', filterMovies);
    yearFilter.addEventListener('change', filterMovies);
    
    // Navigasyon
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showHomePage();
    });
    
    favoritesLink.addEventListener('click', (e) => {
        e.preventDefault();
        showFavoritesPage();
    });
    
    feedbackLink.addEventListener('click', (e) => {
        e.preventDefault();
        showFeedbackPage();
    });
    
    backButton.addEventListener('click', () => {
        if (currentView === 'favorites') {
            showFavoritesPage();
        } else {
            showHomePage();
        }
    });
    
    // URL hash değişikliklerini dinle
    window.addEventListener('hashchange', handleUrlHash);

    // Modal kapatma dinleyicileri kaldırıldı.
};

// Geri Bildirim Formu Doğrulama ve Submit
const setupFeedbackForm = () => {
    if (!feedbackForm) return;

    const nameInput = document.getElementById('fb-name');
    const emailInput = document.getElementById('fb-email');
    const topicSelect = document.getElementById('fb-topic');
    const messageInput = document.getElementById('fb-message');
    const nameError = document.getElementById('fb-name-error');
    const emailError = document.getElementById('fb-email-error');
    const topicError = document.getElementById('fb-topic-error');
    const messageError = document.getElementById('fb-message-error');

    const validateName = () => {
        const pattern = /^[A-Za-zÇçĞğİıÖöŞşÜü\s]{2,}$/;
        if (!nameInput.value.trim()) {
            nameError.textContent = 'Ad soyad zorunlu.';
            return false;
        } else if (!pattern.test(nameInput.value)) {
            nameError.textContent = 'Sadece harf ve boşluk, en az 2 karakter.';
            return false;
        }
        nameError.textContent = '';
        return true;
    };

    const validateEmail = () => {
        if (!emailInput.value.trim()) {
            emailError.textContent = 'E-posta zorunlu.';
            return false;
        } else if (!emailInput.checkValidity()) {
            emailError.textContent = 'Geçerli bir e-posta girin.';
            return false;
        }
        emailError.textContent = '';
        return true;
    };

    const validateTopic = () => {
        if (!topicSelect.value) {
            topicError.textContent = 'Bir konu seçin.';
            return false;
        }
        topicError.textContent = '';
        return true;
    };

    const validateMessage = () => {
        if (!messageInput.value.trim()) {
            messageError.textContent = 'Mesaj zorunlu.';
            return false;
        } else if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'En az 10 karakter yazın.';
            return false;
        }
        messageError.textContent = '';
        return true;
    };

    [nameInput, emailInput, topicSelect, messageInput].forEach(el => {
        el.addEventListener('input', () => {
            switch (el) {
                case nameInput: validateName(); break;
                case emailInput: validateEmail(); break;
                case topicSelect: validateTopic(); break;
                case messageInput: validateMessage(); break;
            }
        });
    });

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const v1 = validateName();
        const v2 = validateEmail();
        const v3 = validateTopic();
        const v4 = validateMessage();
        if (!(v1 && v2 && v3 && v4)) {
            feedbackStatus.textContent = '';
            return;
        }

        const payload = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            topic: topicSelect.value,
            message: messageInput.value.trim(),
            createdAt: new Date().toISOString(),
        };

        const existing = JSON.parse(localStorage.getItem('feedbacks') || '[]');
        existing.push(payload);
        localStorage.setItem('feedbacks', JSON.stringify(existing));

        feedbackStatus.textContent = 'Gönderildi! Görüşünüz için teşekkürler.';
        feedbackForm.reset();
    });
};
// Geri Bildirim Sayfasını Göster
const showFeedbackPage = () => {
    window.location.hash = 'feedback';
    contentSection.classList.add('hidden');
    movieDetails.classList.add('hidden');
    favoritesSection.classList.add('hidden');
    feedbackSection.classList.remove('hidden');
    currentView = 'feedback';
    updateActiveNavLink();
};