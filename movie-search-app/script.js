const API_KEY = 'a7cbb5f5'; 
const BASE_URL = 'https://www.omdbapi.com/';

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const filtersContainer = document.getElementById('filters-container');

const yearInput = document.getElementById('year-input');
const resultsCount = document.getElementById('results-count');
const clearFiltersBtn = document.getElementById('clear-filters-btn');
const typeSelector = document.getElementById('type-selector');

const loader = document.getElementById('loader');
const messageContainer = document.getElementById('message-container');
const moviesContainer = document.getElementById('movies-container');

let selectedType = '';


// ---- Functions ----

function handleSearchSubmit(e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    
    if (!query) {
        showMessage('נא להזין שם של סרט לחיפוש', 'warning');
        return;
    }

    searchMovies();
}

async function searchMovies() {
    const query = searchInput.value.trim();
    const type = selectedType; 
    const year = yearInput.value.trim();

    if (year && year.length < 4) {
        return;
    }

    clearUI();
    
    if (!query) {
        showMessage('נא להזין שם של סרט לחיפוש', 'warning');
        return; 
    }

    loader.classList.remove('d-none');

    const params = {
        apikey: API_KEY,
        s: query
    };

    if (type) params.type = type;
    if (year && year.length === 4) params.y = year;

    try {
        const response = await axios.get(BASE_URL, { params });

        loader.classList.add('d-none');

        if (response.data.Response === 'True') {
            filtersContainer.classList.remove('d-none');
            const total = response.data.totalResults || response.data.Search.length;
            resultsCount.textContent = `${total} תוצאות נמצאו`;

            displayMovies(response.data.Search);
        } else {
            const hasActiveFilters = Boolean(type || year);

            if (hasActiveFilters) {
                filtersContainer.classList.remove('d-none');
                resultsCount.textContent = `0 תוצאות נמצאו`;
            } else {
                filtersContainer.classList.add('d-none');
            }

            showMessage(`לא נמצאו תוצאות עבור החיפוש שלך`, 'danger');
        }

    } catch (error) {
        loader.classList.add('d-none');
        filtersContainer.classList.add('d-none');
        console.log(error);  
        showMessage('תרחשה שגיאה בתקשורת מול השרת. נסה שוב מאוחר יותר.', 'danger');
    }
}

function displayMovies(movies) {
    const fallbackImage = 'https://placehold.co/300x450?text=No+Image';

    moviesContainer.innerHTML = movies.map(movie => {
        const posterUrl = (movie.Poster && movie.Poster !== 'N/A') ? movie.Poster : fallbackImage;

        return `
            <div class="col">
                <div class="card h-100 shadow-sm border-0" id="card-${movie.imdbID}">
                    
                    <div class="movie-overlay d-none" id="overlay-${movie.imdbID}">
                        <div class="text-center py-4">
                            <div class="spinner-border text-light" role="status"></div>
                        </div>
                    </div>

                    <img 
                        src="${posterUrl}" 
                        class="card-img-top" 
                        alt="${movie.Title}" 
                        style="height: 360px; object-fit: cover;"
                        onerror="this.onerror=null; this.src='${fallbackImage}';"
                    >
                    <div class="card-body d-flex flex-column justify-content-between">
                        <h5 class="card-title fs-6 fw-bold">${movie.Title}</h5>
                        <p class="card-text text-muted mb-2">שנה: ${movie.Year}</p>
                        <button class="btn btn-outline-primary btn-sm w-100 mt-2" onclick="getMovieDetails('${movie.imdbID}')">
                            <i class="bi bi-info-circle"></i> פרטים נוספים
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function getMovieDetails(imdbId) {
    const overlay = document.getElementById(`overlay-${imdbId}`);
    
    overlay.classList.remove('d-none');

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                apikey: API_KEY,
                i: imdbId,
                plot: 'full'
            }
        });

        if (response.data.Response === 'True') {
            displayOverlayContent(imdbId, response.data);
        } else {
            overlay.innerHTML = `
                <p class="text-danger small text-center mt-3">לא ניתן לטעון פרטים.</p>
                <button class="btn btn-sm btn-light w-100 mt-auto" onclick="closeOverlay('${imdbId}')">סגור</button>
            `;
        }
    } catch (error) {
        console.log(error);
        overlay.innerHTML = `
            <p class="text-danger small text-center mt-3">שגיאת תקשורת.</p>
            <button class="btn btn-sm btn-light w-100 mt-auto" onclick="closeOverlay('${imdbId}')">סגור</button>
        `;
    }
}

function displayOverlayContent(imdbId, movie) {
    const overlay = document.getElementById(`overlay-${imdbId}`);

    overlay.innerHTML = `
        <div>
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="fw-bold mb-0 pt-1 text-white">${movie.Title}</h6>
                <button type="button" class="btn-close btn-close-white ms-2" onclick="closeOverlay('${imdbId}')" aria-label="Close"></button>
            </div>
            <hr class="my-2 border-light opacity-50">
            <p class="small mb-1"><strong>ז'אנר:</strong> ${movie.Genre || 'N/A'}</p>
            <p class="small mb-1"><strong>במאי:</strong> ${movie.Director || 'N/A'}</p>
            <p class="small mb-1"><strong>שחקנים:</strong> ${movie.Actors || 'N/A'}</p>
            <p class="small mb-1"><strong>דירוג:</strong> ⭐ ${movie.imdbRating || 'N/A'}</p>
            <hr class="my-1 border-light">
            <p class="small lh-sm">${movie.Plot || 'אין תקציר זמין.'}</p>
        </div>
        <button class="btn btn-sm btn-outline-light w-100 mt-2" onclick="closeOverlay('${imdbId}')">
            <i class="bi bi-x-lg"></i> סגור
        </button>
    `;
}

function closeOverlay(imdbId) {
    const overlay = document.getElementById(`overlay-${imdbId}`);
    overlay.classList.add('d-none');
}

function clearUI() {
    moviesContainer.innerHTML = '';
    messageContainer.innerHTML = '';
    messageContainer.classList.add('d-none');
}

function showMessage(msg, type) {
    messageContainer.className = `alert alert-${type} text-center col-md-6 mx-auto`;
    messageContainer.textContent = msg;
    messageContainer.classList.remove('d-none');
}

function resetFilters() {
    selectedType = '';
    yearInput.value = ''; 
   
    const radios = typeSelector.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.checked = false);
}

function handleYearInput() {
    const val = yearInput.value.trim();
    if (val.length === 4 || val === '') {
        searchMovies();
    }
}

function handleTypeChange(e) {
    if (e.target.type !== 'radio') return;

    if (selectedType === e.target.value) {
        e.target.checked = false;
        selectedType = '';
    } else {
        selectedType = e.target.value;
    }

    searchMovies();
}


function handleInputChange() {
    if (!searchInput.value.trim()) {
        filtersContainer.classList.add('d-none');
        resetFilters();
        clearUI();
    } else {        
        messageContainer.innerHTML = '';
        messageContainer.classList.add('d-none');
    }
}


// ---- Event Listeners ----

searchForm.addEventListener('submit', handleSearchSubmit);
searchInput.addEventListener('input', handleInputChange);

clearFiltersBtn.addEventListener('click', () => {
    resetFilters();
    searchMovies();
});

yearInput.addEventListener('input', handleYearInput);
typeSelector.addEventListener('click', handleTypeChange);