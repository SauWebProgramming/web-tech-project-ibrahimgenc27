/* =============================================================================
   SAÜFLIX - Film Kütüphanesi SPA (Single Page Application)
   ISE-201 Web Teknolojileri Dersi Projesi
   
   Kullanılan Teknolojiler:
   - Fetch API ile JSON veri çekme
   - Async/Await asenkron programlama
   - LocalStorage ile veri saklama
   - SPA navigasyon (sayfa yenilemeden içerik değişimi)
   - URL Hash yönetimi
   - DOM manipülasyonu
============================================================================= */

// ==================== DOM ELEMENTLERI ====================
const moviesGrid = document.getElementById('movies-grid');
const favoritesGrid = document.getElementById('favorites-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const yearFilter = document.getElementById('year-filter');
const searchButton = document.getElementById('search-button');
const sortSelect = document.getElementById('sort-select');
const pageSizeSelect = document.getElementById('page-size');
const paginationEl = document.getElementById('pagination');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfoEl = document.getElementById('page-info');
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

// ==================== UYGULAMA DURUMU (STATE) ====================
let movies = [];
let filteredMovies = [];
let currentView = 'home';
let currentPage = 1;
let pageSize = 12;

// LocalStorage'dan favorileri yükle
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// ==================== UYGULAMA BAŞLATMA ====================
document.addEventListener('DOMContentLoaded', async function () {
    try {
        await loadMovies();
        setupYearFilter();
        renderMovies(movies);
        updateFavoriteButtons();
        setupEventListeners();
        handleUrlHash();
        setupFeedbackForm();
        if (pageSizeSelect) {
            pageSize = parseInt(pageSizeSelect.value, 10);
        }
        currentPage = 1;
        filterMovies();
    } catch (error) {
        console.error('Uygulama başlatılırken hata oluştu:', error);
    }
});

// ==================== FETCH API - JSON VERİ ÇEKME ====================
// fetch() ile movies.json dosyasından film verilerini çeker
// async/await kullanarak asenkron işlem yapılır
const loadMovies = async function () {
    try {
        const response = await fetch('./data/movies.json');
        if (!response.ok) {
            throw new Error('Film verileri yüklenemedi');
        }
        const data = await response.json();
        movies = data.movies;
        filteredMovies = [].concat(movies);
        return movies;
    } catch (error) {
        console.error('Film verileri yüklenirken hata oluştu:', error);
        throw error;
    }
};

// ==================== YIL FİLTRESİNİ AYARLA ====================
const setupYearFilter = function () {
    const yearsSet = new Set(movies.map(function (movie) { return movie.year; }));
    const years = Array.from(yearsSet).sort(function (a, b) { return b - a; });
    years.forEach(function (year) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
};

// ==================== YOUTUBE VIDEO ID ÇIKARMA ====================
const extractYouTubeId = function (url) {
    try {
        const u = new URL(url);
        const v = u.searchParams.get('v');
        if (v) return v;
        if (u.hostname === 'youtu.be') {
            return u.pathname.replace('/', '');
        }
        if (u.pathname.startsWith('/embed/')) {
            return u.pathname.split('/embed/')[1];
        }
    } catch (e) {
    }
    return null;
};

// ==================== DOM MANİPÜLASYONU - FİLMLERİ LİSTELE ====================
// Film kartlarını dinamik olarak oluşturur ve DOM'a ekler
const renderMovies = function (moviesToRender) {
    moviesGrid.innerHTML = '';

    if (moviesToRender.length === 0) {
        moviesGrid.innerHTML = '<p class="no-results">Arama kriterlerinize uygun film bulunamadı.</p>';
        return;
    }

    moviesToRender.forEach(function (movie) {
        const isFavorite = favorites.some(function (fav) { return fav.id === movie.id; });

        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card fade-in';

        let cardHTML = '';
        cardHTML += '<img src="' + movie.image + '" alt="' + movie.title + '">';
        cardHTML += '<button class="favorite-btn ' + (isFavorite ? 'active' : '') + '" data-id="' + movie.id + '">';
        cardHTML += '<i class="fas fa-heart"></i>';
        cardHTML += '<span class="sr-only">' + (isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle') + '</span>';
        cardHTML += '</button>';
        cardHTML += '<div class="movie-card-content">';
        cardHTML += '<h3>' + movie.title + '</h3>';
        cardHTML += '<p>' + movie.year + ' | ' + movie.category + '</p>';
        cardHTML += '<div class="rating">';
        cardHTML += '<i class="fas fa-star"></i> ' + movie.rating + '/10';
        cardHTML += '</div>';
        cardHTML += '<button class="btn details-btn" data-id="' + movie.id + '">Detaylar</button>';
        cardHTML += '</div>';

        movieCard.innerHTML = cardHTML;
        moviesGrid.appendChild(movieCard);
    });

    document.querySelectorAll('.details-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            const movieId = parseInt(e.target.dataset.id);
            showMovieDetails(movieId);
        });
    });

    document.querySelectorAll('.favorite-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            if (e.target.tagName === 'I' || e.target.classList.contains('sr-only')) {
                const movieId = parseInt(btn.dataset.id);
                toggleFavorite(movieId);
            } else {
                btn.classList.toggle('active');
            }
        });
    });
};

// ==================== FAVORİLERİ LİSTELE ====================
const renderFavorites = function () {
    favoritesGrid.innerHTML = '';

    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<p class="no-results">Henüz favori film eklemediniz.</p>';
        return;
    }

    favorites.forEach(function (movie) {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card fade-in';

        let cardHTML = '';
        cardHTML += '<img src="' + movie.image + '" alt="' + movie.title + '">';
        cardHTML += '<button class="favorite-btn active" data-id="' + movie.id + '">';
        cardHTML += '<i class="fas fa-heart"></i>';
        cardHTML += '<span class="sr-only">Favorilerden çıkar</span>';
        cardHTML += '</button>';
        cardHTML += '<div class="movie-card-content">';
        cardHTML += '<h3>' + movie.title + '</h3>';
        cardHTML += '<p>' + movie.year + ' | ' + movie.category + '</p>';
        cardHTML += '<div class="rating">';
        cardHTML += '<i class="fas fa-star"></i> ' + movie.rating + '/10';
        cardHTML += '</div>';
        cardHTML += '<button class="btn details-btn" data-id="' + movie.id + '">Detaylar</button>';
        cardHTML += '</div>';

        movieCard.innerHTML = cardHTML;
        favoritesGrid.appendChild(movieCard);
    });

    document.querySelectorAll('.details-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            const movieId = parseInt(e.target.dataset.id);
            showMovieDetails(movieId);
        });
    });

    document.querySelectorAll('#favorites-grid .favorite-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            const movieId = parseInt(e.target.dataset.id);
            toggleFavorite(movieId);
            renderFavorites();
        });
    });
};

// ==================== FİLM DETAYLARINI GÖSTER ====================
const showMovieDetails = function (movieId) {
    const movie = movies.find(function (m) { return m.id === movieId; });
    if (!movie) return;

    window.location.hash = 'movie-' + movieId;
    const videoId = movie && movie.trailer ? extractYouTubeId(movie.trailer) : null;

    let detailHTML = '';
    detailHTML += '<div class="detail-content">';
    detailHTML += '<div class="detail-image">';
    detailHTML += '<img src="' + movie.image + '" alt="' + movie.title + '">';

    if (videoId) {
        detailHTML += '<div class="trailer-section" style="margin-top: 1rem;">';
        detailHTML += '<h3 style="margin-bottom: 0.5rem;">Fragman</h3>';
        detailHTML += '<div class="trailer-iframe-container">';
        detailHTML += '<iframe src="https://www.youtube.com/embed/' + videoId + '?modestbranding=1&rel=0&iv_load_policy=3&playsinline=1"';
        detailHTML += ' title="' + movie.title + ' Fragman"';
        detailHTML += ' allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"';
        detailHTML += ' allowfullscreen></iframe>';
        detailHTML += '</div>';
        detailHTML += '</div>';
    }

    detailHTML += '</div>';
    detailHTML += '<div class="detail-info">';
    detailHTML += '<h2>' + movie.title + '</h2>';
    detailHTML += '<div class="meta">';
    detailHTML += '<span><i class="fas fa-calendar"></i> ' + movie.year + '</span>';
    detailHTML += '<span><i class="fas fa-film"></i> ' + movie.category + '</span>';
    detailHTML += '<span><i class="fas fa-user"></i> ' + movie.director + '</span>';
    detailHTML += '</div>';
    detailHTML += '<div class="rating">';
    detailHTML += '<i class="fas fa-star"></i> ' + movie.rating + '/10';
    detailHTML += '</div>';
    detailHTML += '<div class="description">';
    detailHTML += '<p>' + movie.description + '</p>';
    detailHTML += '</div>';
    detailHTML += '<div class="cast">';
    detailHTML += '<h3>Oyuncular</h3>';
    detailHTML += '<div class="cast-list">';

    movie.cast.forEach(function (actor) {
        const slug = actor.toLowerCase().replace(/\./g, '').replace(/\s+/g, '_');
        const exceptions = {
            'samuel l jackson': 'Samuel_L_Jackson.jpg',
            'robert downey jr': 'Robert_Downey_Jr..jpg',
            'tj miller': 'T.J._Miller.jpg'
        };
        const key = actor.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim();
        const candidates = [];
        if (exceptions[key]) {
            candidates.push('images/' + exceptions[key]);
        }
        candidates.push('images/' + actor.replace(/\s+/g, '_') + '.jpg');
        candidates.push('images/' + slug + '.jpg');
        candidates.push('images/' + actor.toLowerCase().replace(/\./g, '').replace(/\s+/g, '_') + '.jpg');
        candidates.push('images/' + actor.replace(/\s+/g, '_').replace(/-/g, '_') + '.jpg');
        const elementId = 'actor-img-' + slug;
        const avatarSrc = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(actor) + '&background=E50914&color=fff&size=150&bold=true&rounded=true';
        window.actorImageCandidates = window.actorImageCandidates || {};
        window.actorImageCandidates[elementId] = candidates.slice(1);
        const initialSrc = candidates[0];

        detailHTML += '<div class="cast-item">';
        detailHTML += '<div class="cast-image-container">';
        detailHTML += '<img id="' + elementId + '" src="' + initialSrc + '" alt="' + actor + '" class="cast-avatar" onerror="window.onActorImgError && window.onActorImgError(event)" data-avatar="' + avatarSrc + '">';
        detailHTML += '</div>';
        detailHTML += '<p>' + actor + '</p>';
        detailHTML += '</div>';
    });

    detailHTML += '</div>';
    detailHTML += '</div>';

    const isFavorite = favorites.some(function (fav) { return fav.id === movie.id; });
    detailHTML += '<button class="btn favorite-detail-btn ' + (isFavorite ? 'active' : '') + '" data-id="' + movie.id + '">';
    detailHTML += '<i class="fas fa-heart"></i> ' + (isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle');
    detailHTML += '</button>';
    detailHTML += '</div>';
    detailHTML += '</div>';

    detailContent.innerHTML = detailHTML;

    document.querySelector('.favorite-detail-btn').addEventListener('click', function (e) {
        const movieId = parseInt(e.target.dataset.id);
        toggleFavorite(movieId);
        const isFavorite = favorites.some(function (fav) { return fav.id === movieId; });
        e.target.innerHTML = '<i class="fas fa-heart"></i> ' + (isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle');
        e.target.classList.toggle('active', isFavorite);
    });

    contentSection.classList.add('hidden');
    favoritesSection.classList.add('hidden');
    movieDetails.classList.remove('hidden');
    currentView = 'details';
    updateActiveNavLink();
};

// ==================== LOCALSTORAGE - FAVORİ EKLEME/ÇIKARMA ====================
// Favorileri localStorage'a kaydeder, sayfa yenilense bile veriler kalır
const toggleFavorite = function (movieId) {
    const movie = movies.find(function (m) { return m.id === movieId; });
    if (!movie) return;

    const isFavorite = favorites.some(function (fav) { return fav.id === movieId; });

    if (isFavorite) {
        favorites = favorites.filter(function (fav) { return fav.id !== movieId; });
    } else {
        favorites.push(movie);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();

    if (currentView === 'favorites') {
        renderFavorites();
    }
};

// ==================== FAVORİ BUTONLARINI GÜNCELLE ====================
const updateFavoriteButtons = function () {
    document.querySelectorAll('.favorite-btn').forEach(function (btn) {
        const movieId = parseInt(btn.dataset.id);
        const isFavorite = favorites.some(function (fav) { return fav.id === movieId; });
        btn.classList.toggle('active', isFavorite);
        btn.querySelector('.sr-only').textContent = isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle';
    });
};

// ==================== FİLTRELEME VE SIRALAMA ====================
const filterMovies = function () {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;
    const selectedYear = yearFilter.value;
    const sortValue = sortSelect ? sortSelect.value : '';
    pageSize = pageSizeSelect ? parseInt(pageSizeSelect.value, 10) : pageSize;

    filteredMovies = movies.filter(function (movie) {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === '' || movie.category === selectedCategory;
        const matchesYear = selectedYear === '' || movie.year.toString() === selectedYear;
        return matchesSearch && matchesCategory && matchesYear;
    });

    const sorted = applySort(filteredMovies, sortValue);
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * pageSize;
    const pageItems = sorted.slice(start, start + pageSize);
    renderMovies(pageItems);
    updateFavoriteButtons();
    updatePaginationControls(currentPage, totalPages);
};

// ==================== SPA NAVİGASYON - SAYFA YENİLEMEDEN İÇERİK DEĞİŞİMİ ====================
// classList.add('hidden') ile gizle, classList.remove('hidden') ile göster
// window.location.hash ile URL güncellenir ama sayfa yenilenmez

const showHomePage = function () {
    window.location.hash = 'home';
    contentSection.classList.remove('hidden');
    movieDetails.classList.add('hidden');
    favoritesSection.classList.add('hidden');
    feedbackSection.classList.add('hidden');
    currentView = 'home';
    updateActiveNavLink();
    currentPage = 1;
    filterMovies();
};

const showFavoritesPage = function () {
    window.location.hash = 'favorites';
    contentSection.classList.add('hidden');
    movieDetails.classList.add('hidden');
    favoritesSection.classList.remove('hidden');
    feedbackSection.classList.add('hidden');
    currentView = 'favorites';
    renderFavorites();
    updateActiveNavLink();
};

const updateActiveNavLink = function () {
    homeLink.classList.toggle('active', currentView === 'home');
    favoritesLink.classList.toggle('active', currentView === 'favorites');
    feedbackLink.classList.toggle('active', currentView === 'feedback');
};

// ==================== GÖRSEL YÜKLEME HATASI YÖNETİMİ ====================
window.onActorImgError = function (event) {
    const el = event.target;
    window.actorImageCandidates = window.actorImageCandidates || {};
    const list = window.actorImageCandidates[el.id] || [];
    if (list.length > 0) {
        const next = list.shift();
        window.actorImageCandidates[el.id] = list;
        el.src = next;
    } else {
        el.onerror = null;
        const fallback = el.getAttribute('data-avatar') || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(el.alt) + '&background=E50914&color=fff&size=150&bold=true&rounded=true');
        el.src = fallback;
    }
};

// ==================== URL HASH YÖNETİMİ - SPA ROUTING ====================
// URL'deki # değerine göre doğru sayfayı gösterir
// Örnek: index.html#favorites -> Favoriler sayfası
const handleUrlHash = function () {
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

// ==================== OLAY DİNLEYİCİLERİ (EVENT LISTENERS) ====================
// addEventListener ile kullanıcı etkileşimlerini dinler
// e.preventDefault() ile sayfa yenilenmesi engellenir (SPA için gerekli)
const setupEventListeners = function () {
    searchButton.addEventListener('click', filterMovies);

    // Debounce: Performans için 300ms bekler, her tuşta arama yapmaz
    const debounce = function (fn, delay) {
        if (delay === undefined) delay = 300;
        let t;
        return function () {
            const args = arguments;
            const context = this;
            clearTimeout(t);
            t = setTimeout(function () { fn.apply(context, args); }, delay);
        };
    };

    const debouncedFilter = debounce(function () { currentPage = 1; filterMovies(); }, 300);
    searchInput.addEventListener('input', debouncedFilter);

    searchInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            currentPage = 1;
            filterMovies();
        }
    });

    categoryFilter.addEventListener('change', filterMovies);
    yearFilter.addEventListener('change', filterMovies);
    if (sortSelect) sortSelect.addEventListener('change', function () { currentPage = 1; filterMovies(); });
    if (pageSizeSelect) pageSizeSelect.addEventListener('change', function () { currentPage = 1; filterMovies(); });
    if (prevPageBtn) prevPageBtn.addEventListener('click', function () { if (currentPage > 1) { currentPage--; filterMovies(); } });
    if (nextPageBtn) nextPageBtn.addEventListener('click', function () { currentPage++; filterMovies(); });

    homeLink.addEventListener('click', function (e) {
        e.preventDefault();
        showHomePage();
    });

    favoritesLink.addEventListener('click', function (e) {
        e.preventDefault();
        showFavoritesPage();
    });

    feedbackLink.addEventListener('click', function (e) {
        e.preventDefault();
        showFeedbackPage();
    });

    backButton.addEventListener('click', function () {
        if (currentView === 'favorites') {
            showFavoritesPage();
        } else {
            showHomePage();
        }
    });

    window.addEventListener('hashchange', handleUrlHash);
};

// ==================== GERİ BİLDİRİM FORMU - FORM VALİDASYONU ====================
// HTML5 validasyonları ve JavaScript ile ek doğrulamalar
const setupFeedbackForm = function () {
    if (!feedbackForm) return;

    const nameInput = document.getElementById('fb-name');
    const emailInput = document.getElementById('fb-email');
    const topicSelect = document.getElementById('fb-topic');
    const messageInput = document.getElementById('fb-message');
    const nameError = document.getElementById('fb-name-error');
    const emailError = document.getElementById('fb-email-error');
    const topicError = document.getElementById('fb-topic-error');
    const messageError = document.getElementById('fb-message-error');
    const ratingInputs = Array.from(document.querySelectorAll('input[name="rating"]'));
    const ratingError = document.getElementById('fb-rating-error');
    const messageCount = document.getElementById('fb-message-count');
    const feedbackList = document.getElementById('feedback-list');
    const feedbackClearBtn = document.getElementById('feedback-clear');
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');

    const validateName = function () {
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

    const validateEmail = function () {
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

    const validateTopic = function () {
        if (!topicSelect.value) {
            topicError.textContent = 'Bir konu seçin.';
            return false;
        }
        topicError.textContent = '';
        return true;
    };

    const validateMessage = function () {
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

    [nameInput, emailInput, topicSelect, messageInput].forEach(function (el) {
        el.addEventListener('input', function () {
            if (el === nameInput) { validateName(); }
            else if (el === emailInput) { validateEmail(); }
            else if (el === topicSelect) { validateTopic(); }
            else if (el === messageInput) { validateMessage(); }
        });
    });

    const updateMessageCount = function () {
        const len = messageInput.value.trim().length;
        if (messageCount) messageCount.textContent = len + ' / min 10';
    };
    messageInput.addEventListener('input', updateMessageCount);
    updateMessageCount();

    const validateRating = function () {
        const selected = ratingInputs.find(function (r) { return r.checked; });
        if (!selected) {
            if (ratingError) ratingError.textContent = 'Bir memnuniyet puanı seçin.';
            return false;
        }
        if (ratingError) ratingError.textContent = '';
        return true;
    };

    const updateStars = function () {
        const checkedInput = ratingInputs.find(function (r) { return r.checked; });
        const selectedVal = checkedInput ? checkedInput.value : '0';
        const valNum = parseInt(selectedVal, 10);
        document.querySelectorAll('#fb-rating label').forEach(function (lbl, idx) {
            lbl.classList.toggle('active', idx < valNum);
        });
    };

    ratingInputs.forEach(function (r) {
        r.addEventListener('change', function () { validateRating(); updateStars(); });
    });
    updateStars();

    const renderFeedbacks = function () {
        if (!feedbackList) return;
        feedbackList.innerHTML = '';
        if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
            feedbackList.innerHTML = '<p class="no-results">Henüz gönderi yok.</p>';
            return;
        }
        feedbacks.slice().reverse().forEach(function (fb, idx) {
            const item = document.createElement('div');
            item.className = 'feedback-item';

            let itemHTML = '';
            itemHTML += '<div class="meta">' + fb.name + ' • ' + fb.email + ' • ' + fb.topic + ' • ⭐ ' + fb.rating + ' • ' + new Date(fb.createdAt || fb.date).toLocaleString('tr-TR') + '</div>';
            itemHTML += '<p>' + fb.message + '</p>';
            itemHTML += '<button class="btn btn-sm" data-index="' + (feedbacks.length - 1 - idx) + '">Sil</button>';

            item.innerHTML = itemHTML;
            feedbackList.appendChild(item);
        });
        feedbackList.querySelectorAll('button[data-index]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                const i = parseInt(e.target.getAttribute('data-index'), 10);
                feedbacks.splice(i, 1);
                localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
                renderFeedbacks();
            });
        });
    };
    renderFeedbacks();

    if (feedbackClearBtn) {
        feedbackClearBtn.addEventListener('click', function () {
            feedbacks = [];
            localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
            renderFeedbacks();
            feedbackStatus.textContent = 'Tüm gönderiler temizlendi.';
        });
    }

    feedbackForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const v1 = validateName();
        const v2 = validateEmail();
        const v3 = validateTopic();
        const v4 = validateMessage();
        const v5 = validateRating();
        if (!(v1 && v2 && v3 && v4 && v5)) {
            feedbackStatus.textContent = 'Lütfen hataları düzeltin ve tekrar deneyin.';
            return;
        }

        const checkedRating = ratingInputs.find(function (r) { return r.checked; });
        const payload = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            topic: topicSelect.value,
            message: messageInput.value.trim(),
            rating: parseInt(checkedRating ? checkedRating.value : '0', 10),
            createdAt: new Date().toISOString()
        };

        feedbacks.push(payload);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
        feedbackStatus.textContent = 'Gönderildi! Görüşünüz için teşekkürler.';
        feedbackForm.reset();
        updateMessageCount();
        updateStars();
        renderFeedbacks();
    });
};

// ==================== GERİ BİLDİRİM SAYFASI ====================
const showFeedbackPage = function () {
    window.location.hash = 'feedback';
    contentSection.classList.add('hidden');
    movieDetails.classList.add('hidden');
    favoritesSection.classList.add('hidden');
    feedbackSection.classList.remove('hidden');
    currentView = 'feedback';
    updateActiveNavLink();
};

// ==================== SIRALAMA ====================
const applySort = function (list, sortValue) {
    const arr = [].concat(list);
    switch (sortValue) {
        case 'title-asc':
            return arr.sort(function (a, b) { return a.title.localeCompare(b.title); });
        case 'title-desc':
            return arr.sort(function (a, b) { return b.title.localeCompare(a.title); });
        case 'year-asc':
            return arr.sort(function (a, b) { return a.year - b.year; });
        case 'year-desc':
            return arr.sort(function (a, b) { return b.year - a.year; });
        case 'rating-asc':
            return arr.sort(function (a, b) { return a.rating - b.rating; });
        case 'rating-desc':
            return arr.sort(function (a, b) { return b.rating - a.rating; });
        default:
            return arr;
    }
};

// ==================== SAYFALAMA KONTROLÜ ====================
const updatePaginationControls = function (page, totalPages) {
    if (!paginationEl) return;
    prevPageBtn.disabled = page <= 1;
    nextPageBtn.disabled = page >= totalPages;
    pageInfoEl.textContent = page + ' / ' + totalPages;
};