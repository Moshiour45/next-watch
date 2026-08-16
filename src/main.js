// NextWatch - Main JavaScript File
// JS logic goes here. No functional logic implemented yet.
const apiKey = import.meta.env.VITE_API_KEY;
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchButton");
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const resultsGrid = document.querySelector("#resultsGrid");
const titleCard = document.querySelector("h2");


const showLoader = () =>{
    resultsGrid.innerHTML = `
        <div class="col-span-full flex justify-center py-16">
            <div class="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    `;
};

const showResults = (queries) => {
    resultsGrid.innerHTML = "";
    if (!queries || queries.length === 0) {
        resultsGrid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <p class="text-slate-400 text-xl font-medium">No movies found matching your search.</p>
                <p class="text-slate-600 text-sm mt-2">Try searching for something else like "Batman" or "Matrix".</p>
            </div>
        `;
        return;
    }
    queries.forEach((query) => {
        const { id, title, name, poster_path, vote_average, release_date, first_air_date, media_type } = query;
        const displayTitle = title || name;
        const displayType = media_type === "tv" ? "TV Series" : "Movie";
        const displayDate = release_date || first_air_date;
        const poster = poster_path
            ? `${imageBaseUrl}${poster_path}`
            : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop';
        const year = displayDate ? displayDate.split("-")[0] : "N/A";
        const rating = vote_average ? vote_average.toFixed(1) : "N/A";

        const cardHTML = `
    <article data-id="${id}" data-type="${media_type || 'movie'}" class="group relative flex flex-col bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-teal-500/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(20,184,166,0.15)] cursor-pointer">
      <div class="aspect-[2/3] w-full relative overflow-hidden bg-slate-800">
        <img src="${poster}" alt="${displayTitle}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy">
        <!-- FIXED: via-slate-900/60 md:via-slate-900/40 for better contrast on mobile -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 md:via-slate-900/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div class="absolute top-3 left-3 flex gap-2">
          <span class="bg-slate-950/80 backdrop-blur text-teal-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-slate-700/50">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            ${rating}
          </span>
        </div>
      </div>
      <!-- FIXED: translate-y-0 on mobile, md:translate-y-2 on desktop -->
      <div class="p-5 flex flex-col absolute bottom-0 w-full z-10 translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <!-- FIXED: opacity-100 on mobile, md:opacity-0 on desktop -->
        <div class="flex items-center gap-2 mb-2 text-[11px] font-semibold tracking-wider text-teal-400/90 uppercase opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <span>${displayType}</span>
        </div>
        <h3 class="font-extrabold text-xl text-white line-clamp-1 leading-tight group-hover:text-teal-300 transition-colors">${displayTitle}</h3>
        <div class="flex items-center justify-between mt-1 text-slate-400 text-sm">
          <span>${year}</span>
          <!-- FIXED: opacity-100 on mobile, md:opacity-0 on desktop -->
          <span class="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">TMDB</span>
        </div>
      </div>
    </article>
`;

        resultsGrid.insertAdjacentHTML("beforeend", cardHTML);
    });
};

const showDefaults = async () => {
    try {
        const url = `${baseUrl}/trending/movie/week?api_key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (titleCard) {
            titleCard.innerText = "Trending Highlights";
        }
        showResults(data.results);
    } catch (error) {
        console.error("Error fetching default movies:", error);
    }
};


const fetchQuery = async (query) => {
    showLoader();
    try {
        const url = `${baseUrl}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (titleCard) {
            titleCard.textContent = `Search Results for "${query}"`;
        }
        const filteredData = data.results.filter(item => item.media_type === "movie" || item.media_type === "tv");
        showResults(filteredData);
    } catch (error) {
        console.error("Error fetching data:", error);
        resultsGrid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <p class="text-red-400 text-lg">Something went wrong while loading movies.</p>
            </div>
        `;
    }
};




const startSearch = () => {
    const query = searchInput.value.trim();
    if (query != "") {
        fetchQuery(query);
    }
};


const showDetails = (data, castData, type) => {
    const modal = document.querySelector("#details-modal");
    const modalContent = document.querySelector("#modal-content");
    if (!modal || !modalContent) {
        return;
    }

    const directorLabel = type === "movie" ? "Director" : "Creator";
    let directorName = "N/A";

    if (type === "movie") {
        const director = castData.crew.find(member => member.job === directorLabel);
        directorName = director ? director.name : "N/A";
    } else {
        directorName = data.created_by && data.created_by.length > 0 ? data.created_by.map(c => c.name).join(", ") : "N/A";
    }

    const displayTitle = data.title || data.name;
    const displayDate = data.release_date || data.first_air_date || "N/A";
    const rating = data.vote_average ? data.vote_average.toFixed(1) : "N/A";
    const poster = data.poster_path ? `${imageBaseUrl}${data.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop';
    const genres = data.genres ? data.genres.map(g => g.name).join(", ") : "N/A";
    const overview = data.overview || "No description available.";
    const topCast = castData.cast.slice(0, 4).map(actor => {
        const profilePic = actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : `https://ui-avatars.com/api/?name` + encodeURIComponent(actor.name) + `&background=random&color=fff`;
        return `
        <div class="flex flex-col items-center text-center gap-1">
                <img src="${profilePic}" alt="${actor.name}" class="w-12 h-12 rounded-full object-cover border border-slate-700">
                <span class="text-[10px] text-slate-300 line-clamp-1">${actor.name}</span>
            </div>
            `;
    }).join('');

   modalContent.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6 relative">
            <!-- FIXED: Added background to close button so it's visible over the poster on mobile -->
            <button id="close-modal" class="absolute -top-2 -right-2 text-slate-400 hover:text-teal-400 transition-colors z-10 bg-slate-900 rounded-full p-1">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <!-- FIXED: w-1/2 mx-auto on mobile, w-1/3 on md screens -->
            <div class="w-1/2 sm:w-1/3 md:w-1/3 shrink-0 mx-auto md:mx-0 pt-4 md:pt-0">
                <img src="${poster}" alt="${displayTitle}" class="w-full rounded-xl shadow-lg border border-slate-700/50 object-cover">
            </div>
            
            <div class="flex flex-col text-left">
                <!-- FIXED: Scaled text sizing for mobile -->
                <h2 class="text-2xl md:text-3xl font-extrabold text-white mb-2 pr-6">${displayTitle}</h2>
                <div class="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-slate-400 mb-4 font-medium">
                    <span class="bg-slate-800 px-2 py-1 rounded text-teal-400 border border-slate-700">⭐ ${rating}</span>
                    <span>${displayDate.split("-")[0]}</span>
                    <span>•</span>
                    <span>${type === 'tv' ? 'TV Series' : 'Movie'}</span>
                </div>
                
                <!-- FIXED: Single column on mobile, 2 columns on sm+ -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <p class="text-xs tracking-wider text-teal-500/80 uppercase font-bold mb-1">${directorLabel}</p>
                        <p class="text-slate-300 text-sm">${directorName}</p>
                    </div>
                    <div>
                        <p class="text-xs tracking-wider text-teal-500/80 uppercase font-bold mb-1">Genres</p>
                        <p class="text-slate-300 text-sm">${genres}</p>
                    </div>
                </div>

                <div class="mb-4">
                    <p class="text-xs tracking-wider text-teal-500/80 uppercase font-bold mb-1">Overview</p>
                    <p class="text-slate-300 leading-relaxed text-sm">${overview}</p>
                </div>
                ${topCast.length > 0 ? `
                <div class="mt-auto pt-4 border-t border-slate-800/80">
                    <p class="text-xs tracking-wider text-teal-500/80 uppercase font-bold mb-3">Top Cast</p>
                    <!-- FIXED: flex-wrap to prevent cast images from overflowing -->
                    <div class="flex flex-wrap gap-4">
                        ${topCast}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");
};

const fetchDetails = async (id, type) => {
    try {
        const dataUrl = `${baseUrl}/${type}/${id}?api_key=${apiKey}`;
        const castUrl = `${baseUrl}/${type}/${id}/credits?api_key=${apiKey}`;
        const [dataResponse, castResponse] = await Promise.all([
            fetch(dataUrl),
            fetch(castUrl)
        ]);
        
        if(!dataResponse.ok || !castResponse.ok){
            throw new Error("Failed to fetch details");
        }

        const data = await dataResponse.json();
        const cast = await castResponse.json();
        showDetails(data, cast || [], type);

    } catch (e) {
        console.error("Error fetching details:", e);
    }

};

searchBtn.addEventListener("click", startSearch);
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        startSearch();
    }
});

resultsGrid.addEventListener("click", (e) => {
    const card = e.target.closest("article");
    if (card) {
        const id = card.getAttribute("data-id");
        const type = card.getAttribute("data-type");
        fetchDetails(id, type);
    }
});

document.addEventListener("click", (e) => {
    const modal = document.querySelector("#details-modal");
    if (!modal) {
        return;
    }
    if (e.target === modal || e.target.closest("#close-modal")) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
});

showDefaults();