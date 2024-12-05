const API_KEY = 'YOUR_API_KEY_INSERT_HERE'; // TMDb API Anahtarınız

document.getElementById('search-btn').addEventListener('click', function() {
    const movieTitle = document.getElementById('movie-title').value;

    // TMDb API ile film arama
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieTitle)}`)
        .then(response => response.json())
        .then(data => {
            const resultsDiv = document.getElementById('results');
            if (data.results && data.results.length > 0) {
                const movie = data.results[0]; // İlk sonuç
                resultsDiv.innerHTML = `
                    <h2>${movie.title} (${movie.release_date ? movie.release_date.split('-')[0] : 'Bilinmiyor'})</h2>
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title} poster">
                    <p><strong>Özet:</strong> ${movie.overview || 'Bilgi yok.'}</p>
                    <p><strong>TMDb Puanı:</strong> ${movie.vote_average || 'Bilgi yok.'}</p>
                `;

                // Platform bilgilerini al
                fetch(`https://api.themoviedb.org/3/movie/${movie.id}/watch/providers?api_key=${API_KEY}`)
                    .then(response => response.json())
                    .then(providerData => {
                        const providers = providerData.results['TR']; // Türkiye için
                        if (providers && providers.flatrate) {
                            resultsDiv.innerHTML += `
                                <p><strong>Platformlar:</strong> ${providers.flatrate.map(p => p.provider_name).join(', ')}</p>
                            `;
                        } else {
                            resultsDiv.innerHTML += `<p>Platform bilgisi bulunamadı.</p>`;
                        }
                    });
            } else {
                resultsDiv.innerHTML = `<p>Film veya dizi bulunamadı!</p>`;
            }
        })
        .catch(error => {
            console.error('Hata:', error);
        });
});
