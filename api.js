document.addEventListener('DOMContentLoaded', async () => {
    if (!window.location.pathname.includes('home.html')) return;
    
    const token = localStorage.getItem('netflix_token');
    if (!token) return;
    
    try {
        // Fetch popular movies
        const popularResponse = await fetch('/api/movies/popular', {
            headers: { 'x-auth-token': token }
        });
        const popularMovies = await popularResponse.json();
        renderMovies(popularMovies, 'popular-movies');
        
        // Fetch trending movies
        const trendingResponse = await fetch('/api/movies/trending', {
            headers: { 'x-auth-token': token }
        });
        const trendingMovies = await trendingResponse.json();
        renderMovies(trendingMovies, 'trending-movies');
        
    } catch (err) {
        console.error('Error fetching movies:', err);
    }
});

function renderMovies(movies, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = movies.slice(0, 10).map(movie => `
        <div class="movie-card">
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title || movie.name}">
            <div class="movie-info">
                <h3>${movie.title || movie.name}</h3>
                <p>${movie.release_date ? movie.release_date.substring(0, 4) : ''}</p>
            </div>
        </div>
    `).join('');
}