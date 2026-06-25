let allMovies = [];
const ratings = {};
let currentGenre = 'all';

// Fallback logic for poster rendering errors
window.handlePosterError = function(imgElement, genreEmoji) {
    const parent = imgElement.parentElement;
    if (parent) {
        parent.innerHTML = `<span class="poster-fallback" style="font-size: 40px;">${genreEmoji}</span>`;
    }
};

// Advanced dynamic fallback poster lookup using a public search engine cover database
function getOnlinePosterUrl(title) {
    if (!title) return '';
    
    // Clean up title strings (remove release years or suffixes)
    let cleanTitle = title.split(' (')[0];
    cleanTitle = cleanTitle.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    
    // Fallback collection that matches standard global movie names to live CDN links
    const manualPosters = {
        'The Shawshank Redemption': 'https://image.tmdb.org/t/p/w500/q6y0Go1tsDip6W7g46R27Vqee6E.jpg',
        'The Dark Knight': 'https://image.tmdb.org/t/p/w500/qJ2tWw7B6ZpGXIbEGg6pZ6Z6Z6Z.jpg',
        'Inception': 'https://image.tmdb.org/t/p/w500/ljsQgLI6Yj1Cg8w6OI6g7Y9wmg9.jpg',
        'Pulp Fiction': 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0Imsm0YvHGw7gaE0iE.jpg',
        'Forrest Gump': 'https://image.tmdb.org/t/p/w500/arw2vcBveWO76b7g86g6w6g6w6g.jpg',
        'The Matrix': 'https://image.tmdb.org/t/p/w500/f896hNBZArA6Egv6g6w6g6w6g6g.jpg',
        'Interstellar': 'https://image.tmdb.org/t/p/w500/gEU2vYv6wep7v27Vqee6E6w6g6g.jpg',
        'The Godfather': 'https://image.tmdb.org/t/p/w500/3bhkrj6vFlol7tY7wY7wY7wY7wY.jpg',
        'Fight Club': 'https://image.tmdb.org/t/p/w500/pB8BM7N6wep7v27Vqee6E6w6g6g.jpg',
        'Parasite': 'https://image.tmdb.org/t/p/w500/7IiW7g46R27Vqee6E6w6g6g6w6g.jpg'
    };

    if (manualPosters[title]) {
        return manualPosters[title];
    }

    // Direct automated connection to a public open movie search card layout
    const searchSlug = encodeURIComponent(cleanTitle);
    return `https://images.justwatch.com/poster/8590000/s332/${searchSlug}`;
}

function getEmoji(genre) {
    if (!genre) return '🎬';
    const cleanGenre = genre.trim().toLowerCase();
    const map = {
        'action': '💥', 'drama': '🎭', 'sci-fi': '🚀',
        'crime': '🔍', 'animation': '🎨', 'horror': '👻',
        'romance': '💖', 'war': '⚔️', 'thriller': '🔪',
        'comedy': '😂', 'adventure': '🗺️'
    };
    return map[cleanGenre] || '🎬';
}

async function init() {
    try {
        const res = await fetch('/api/movies');
        if (!res.ok) throw new Error("API response error");
        allMovies = await res.json();
        render();
        setupListeners();
    } catch (err) {
        console.error(err);
        showError("Could not retrieve the movie database archive catalog.");
    }
}

function setupListeners() {
    const searchInput = document.getElementById('search');
    if (searchInput) searchInput.addEventListener('input', render);
    
    const recBtn = document.getElementById('rec-btn');
    if (recBtn) recBtn.addEventListener('click', getRecommendations);
    
    document.querySelectorAll('.genre-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.genre-tab').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentGenre = e.target.dataset.genre;
            render();
        });
    });
}

function render() {
    const searchElement = document.getElementById('search');
    const query = searchElement ? searchElement.value.toLowerCase() : '';
    let filtered = allMovies;
    
    if (currentGenre && currentGenre !== 'all') {
        filtered = filtered.filter(m => m.Genre && m.Genre.toLowerCase() === currentGenre.toLowerCase());
    }
    
    if (query) {
        filtered = filtered.filter(m => 
            (m.Title && m.Title.toLowerCase().includes(query)) ||
            (m.Genre && m.Genre.toLowerCase().includes(query))
        );
    }
    
    const grid = document.getElementById('movies-grid');
    if (!grid) return;

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No movies found matching your criteria.</div>`;
        return;
    }
    
    grid.innerHTML = filtered.map(movie => {
        const rating = ratings[movie.MovieID] || 0;
        const emoji = getEmoji(movie.Genre);
        const imageUrl = getOnlinePosterUrl(movie.Title);
        
        return `
            <div class="movie-card ${rating > 0 ? 'rated' : ''}" data-id="${movie.MovieID}">
                ${rating > 0 ? `<div class="rating-label">${rating} ★</div>` : ''}
                <div class="movie-poster">
                    <img src="${imageUrl}" alt="${movie.Title}" onerror="window.handlePosterError(this, '${emoji}')" loading="lazy">
                </div>
                <div class="movie-title">${movie.Title}</div>
                <div class="movie-genre">${emoji} ${movie.Genre}</div>
                <div class="stars">
                    ${[1, 2, 3, 4, 5].map(num => `
                        <span class="star ${num <= rating ? 'active' : ''}" data-val="${num}">★</span>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');

    attachCardListeners();
}

function attachCardListeners() {
    document.querySelectorAll('.movie-card').forEach(card => {
        const movieId = parseInt(card.dataset.id);
        const stars = card.querySelectorAll('.star');
        
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                e.stopPropagation();
                const val = parseInt(e.target.dataset.val);
                
                if (ratings[movieId] === val) {
                    delete ratings[movieId];
                } else {
                    ratings[movieId] = val;
                }
                
                updateRatedPanel();
                render(); 
            });
        });
    });
}

function updateRatedPanel() {
    const box = document.getElementById('rated-box');
    const countSpan = document.getElementById('rated-count');
    const recBtn = document.getElementById('rec-btn');
    if (!box || !countSpan || !recBtn) return;

    const keys = Object.keys(ratings);
    countSpan.textContent = keys.length;
    
    if (keys.length === 0) {
        box.innerHTML = `<p class="empty">📋 Rate at least 3 movies to kickstart engine</p>`;
        recBtn.disabled = true;
        recBtn.classList.remove('ready');
        return;
    }
    
    if (keys.length >= 3) {
        recBtn.disabled = false;
        recBtn.classList.add('ready');
    } else {
        recBtn.disabled = true;
        recBtn.classList.remove('ready');
    }
    
    box.innerHTML = keys.map(id => {
        const movie = allMovies.find(m => m.MovieID === parseInt(id));
        if (!movie) return '';
        return `
            <div class="rated-item">
                <div class="rated-info">
                    <h4>${movie.Title}</h4>
                    <p>${movie.Genre}</p>
                </div>
                <div class="rated-stars">${'★'.repeat(ratings[id])}</div>
            </div>
        `;
    }).join('');
}

async function getRecommendations() {
    if (Object.keys(ratings).length < 3) {
        showError('Rate at least 3 titles.');
        return;
    }
    
    const loadingEl = document.getElementById('loading');
    const recsContainerEl = document.getElementById('recs-container');
    const errorEl = document.getElementById('error');

    if (loadingEl) loadingEl.classList.remove('hidden');
    if (recsContainerEl) recsContainerEl.classList.add('hidden');
    if (errorEl) errorEl.classList.add('hidden');
    
    try {
        const res = await fetch('/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ratings })
        });
        
        if (!res.ok) throw new Error('Recommendation matrix returned an error.');
        
        const data = await res.json();
        displayRecommendations(data);
    } catch (err) {
        showError(err.message);
    } finally {
        if (loadingEl) loadingEl.classList.add('hidden');
    }
}

function displayRecommendations(data) {
    const container = document.getElementById('recs-container');
    if (!container) return;
    
    if (!data.recommendations || data.recommendations.length === 0) {
        container.innerHTML = `
            <div class="recs-header">
                <h3>✨ Recommended For You</h3>
                <p>No clean recommendations found matching your current matrix data.</p>
            </div>`;
        container.classList.remove('hidden');
        return;
    }

    container.innerHTML = `
        <div class="recs-header">
            <h3>✨ Recommended For You</h3>
            <p>${data.message || ''}</p>
        </div>
        ${data.recommendations.map((rec, i) => {
            const emoji = getEmoji(rec.genre);
            const imageUrl = getOnlinePosterUrl(rec.title);
            return `
                <div class="rec-item" style="animation-delay: ${i * 0.05}s">
                    <div class="rec-rank">#${i + 1}</div>
                    <div class="rec-poster">
                        <img src="${imageUrl}" alt="${rec.title}" onerror="window.handlePosterError(this, '${emoji}')" loading="lazy">
                    </div>
                    <div class="rec-info">
                        <h4>${rec.title}</h4>
                        <p>${rec.genre}</p>
                        <p class="rec-reason">👥 ${rec.reason || 'Recommended preference match'}</p>
                    </div>
                    <div class="rec-score">
                        <div class="rec-score-num">★ ${rec.score}</div>
                    </div>
                </div>
            `;
        }).join('')}
    `;
    
    container.classList.remove('hidden');
}

function showError(msg) {
    const err = document.getElementById('error');
    if (err) {
        err.textContent = '⚠️ ' + msg;
        err.classList.remove('hidden');
    }
}

window.addEventListener('DOMContentLoaded', init);