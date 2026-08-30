// NextWatch - Main JavaScript File
// TMDB-powered movie/TV discovery app

//  Configuration & DOM References
const apiKey = import.meta.env.VITE_API_KEY;
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchButton");
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const resultsGrid = document.querySelector("#resultsGrid");
const titleCard = document.querySelector("h2");


//  Modal Helpers (open / close)
const openModal = () =>{
    const modal = document.querySelector("#details-modal");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
};

const closeModal = () =>{
    const modal = document.querySelector("#details-modal");
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
};


//  Loading Indicators
const showLoader = () =>{
    resultsGrid.innerHTML = `
        <div class="col-span-full flex justify-center py-16">
            <div class="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    `;
};

const showModalLoader = () =>{
    const modalContent = document.querySelector("#modal-content");
    if(modalContent){
        modalContent.innerHTML = `
            <div class="flex justify-center items-center py-20 w-full">
                <div class="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        `;
    }
    openModal();
};


//  Results Grid — Render Cards
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
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 md:via-slate-900/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div class="absolute top-3 left-3 flex gap-2">
          <span class="bg-slate-950/80 backdrop-blur text-teal-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-slate-700/50">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            ${rating}
          </span>
        </div>
      </div>
      <div class="p-5 flex flex-col absolute bottom-0 w-full z-10 translate-y-0 md:translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <div class="flex items-center gap-2 mb-2 text-[11px] font-semibold tracking-wider text-teal-400/90 uppercase opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
          <span>${displayType}</span>
        </div>
        <h3 class="font-extrabold text-xl text-white line-clamp-1 leading-tight group-hover:text-teal-300 transition-colors">${displayTitle}</h3>
        <div class="flex items-center justify-between mt-1 text-slate-400 text-sm">
          <span>${year}</span>
          <span class="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">TMDB</span>
        </div>
      </div>
    </article>
`;

        resultsGrid.insertAdjacentHTML("beforeend", cardHTML);
    });
};

// Fetch and Render TV Episodes
const fetchSeasonEpisodes = async (tvId, seasonNum) => {
    const listEl = document.querySelector("#episodes-list");
    if (!listEl) return;
    
    listEl.innerHTML = `
        <div class="flex justify-center py-8">
            <div class="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    `;

    try {
        const url = `${baseUrl}/tv/${tvId}/season/${seasonNum}?api_key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.episodes || data.episodes.length === 0) {
            listEl.innerHTML = `<div class="text-slate-400 text-sm p-4 text-center">No episodes found for this season.</div>`;
            return;
        }

        listEl.innerHTML = data.episodes.map(ep => {
            const epImg = ep.still_path 
                ? `${imageBaseUrl}${ep.still_path}` 
                : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=300&auto=format&fit=crop';
            
            const epDate = ep.air_date ? ep.air_date : 'TBA';
            const epRuntime = ep.runtime ? `${ep.runtime}m` : '';

            return `
                <div class="flex flex-col sm:flex-row gap-4 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50 hover:border-teal-500/50 transition-colors group">
                    <img src="${epImg}" alt="${ep.name}" class="w-full sm:w-32 h-32 sm:h-20 object-cover rounded-lg shrink-0 bg-slate-800">
                    <div class="flex flex-col w-full min-w-0">
                        <div class="flex justify-between items-start mb-1 gap-2">
                            <h4 class="text-sm font-bold text-white truncate leading-tight group-hover:text-teal-300 transition-colors">
                                ${ep.episode_number}. ${ep.name}
                            </h4>
                            <span class="text-[10px] font-medium bg-slate-700/80 px-2 py-0.5 rounded text-teal-300 shrink-0 border border-slate-600">
                                ${epDate}
                            </span>
                        </div>
                        <p class="text-xs text-slate-400 line-clamp-2 mb-1">${ep.overview || 'No description available for this episode.'}</p>
                        <div class="mt-auto flex gap-3 text-[10px] text-slate-500 font-semibold">
                            <span>⭐ ${ep.vote_average ? ep.vote_average.toFixed(1) : 'N/A'}</span>
                            ${epRuntime ? `<span>⏱ ${epRuntime}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error("Error fetching episodes:", e);
        listEl.innerHTML = `<div class="text-red-400 text-sm p-4 text-center">Failed to load episodes.</div>`;
    }
};


// Detail Modal — Render Full Movie/TV Info
const showDetails = (data, castData, type) => {
    const modal = document.querySelector("#details-modal");
    const modalContent = document.querySelector("#modal-content");
    if (!modal || !modalContent) return;

    // Common Data Extraction
    const displayTitle = data.title || data.name;
    const displayDate = data.release_date || data.first_air_date || "N/A";
    const rating = data.vote_average ? data.vote_average.toFixed(1) : "N/A";
    const poster = data.poster_path ? `${imageBaseUrl}${data.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop';
    const genres = data.genres ? data.genres.map(g => g.name).join(", ") : "N/A";
    const overview = data.overview || "No description available.";
    const tagline = data.tagline ? `<p class="italic text-teal-400/80 text-sm mb-4 border-l-2 border-teal-500 pl-3">"${data.tagline}"</p>` : '';
    const status = data.status || "Unknown";

    // Director / Creator
    const directorLabel = type === "movie" ? "Director" : "Creator";
    let directorName = "N/A";
    if (type === "movie") {
        const director = (castData?.crew || []).find(member => member.job === directorLabel);
        directorName = director ? director.name : "N/A";
    } else {
        directorName = data.created_by && data.created_by.length > 0 ? data.created_by.map(c => c.name).join(", ") : "N/A";
    }

    // Extract Certification / Age Rating
    let ageRating = "NR";
    if (type === "movie") {
        const usRelease = data.release_dates?.results?.find(r => r.iso_3166_1 === "US");
        const cert = usRelease?.release_dates?.find(d => d.certification)?.certification;
        if (cert) ageRating = cert;
    } else {
        const usRating = data.content_ratings?.results?.find(r => r.iso_3166_1 === "US");
        if (usRating?.rating) ageRating = usRating.rating;
    }

    // Official Trailer (YouTube)
    const trailer = data.videos?.results?.find(
        vid => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser")
    );
    const trailerBtn = trailer 
        ? `<a href="https://www.youtube.com/watch?v=${trailer.key}" target="_blank" rel="noopener noreferrer" 
              class="inline-flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-red-500/30 transition-colors">
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              Watch Trailer
           </a>` 
        : '';

    // External Links (IMDb)
    const imdbId = data.imdb_id || data.external_ids?.imdb_id;
    const imdbLink = imdbId
        ? `<a href="https://www.imdb.com/title/${imdbId}" target="_blank" rel="noopener noreferrer" class="bg-yellow-500/10 hover:bg-yellow-500 px-2 py-1 rounded text-yellow-500 hover:text-slate-900 font-bold border border-yellow-500/30 transition-colors">IMDb</a>` 
        : '';

    // Dynamic Metadata Layout (Movie vs TV)
    let extraMetaData = '';
    let episodesSection = '';

    if (type === "movie") {
        const runtime = data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : "N/A";
        const budget = data.budget ? `$${(data.budget / 1000000).toFixed(1)}M` : "N/A";
        const revenue = data.revenue ? `$${(data.revenue / 1000000).toFixed(1)}M` : "N/A";
        
        extraMetaData = `
            <div>
                <p class="text-[10px] tracking-wider text-slate-500 uppercase font-bold mb-1">Runtime</p>
                <p class="text-slate-300 text-xs font-medium">${runtime}</p>
            </div>
            <div>
                <p class="text-[10px] tracking-wider text-slate-500 uppercase font-bold mb-1">Budget / Box Office</p>
                <p class="text-slate-300 text-xs font-medium">${budget} / ${revenue}</p>
            </div>
        `;
    } else if (type === "tv") {
        const networks = data.networks ? data.networks.map(n => n.name).join(", ") : "N/A";
        const seasonsCount = data.number_of_seasons || 0;
        const episodesCount = data.number_of_episodes || 0;

        extraMetaData = `
            <div>
                <p class="text-[10px] tracking-wider text-slate-500 uppercase font-bold mb-1">Network</p>
                <p class="text-slate-300 text-xs font-medium">${networks}</p>
            </div>
            <div>
                <p class="text-[10px] tracking-wider text-slate-500 uppercase font-bold mb-1">Total Content</p>
                <p class="text-slate-300 text-xs font-medium">${seasonsCount} Seasons, ${episodesCount} Episodes</p>
            </div>
        `;

        // Next Episode (TV)
        let nextEpisodeBadge = '';
        if (data.next_episode_to_air) {
            const nextEp = data.next_episode_to_air;
            nextEpisodeBadge = `
                <div class="mt-4 p-3 bg-teal-500/10 border border-teal-500/30 rounded-xl">
                    <span class="text-teal-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Upcoming Episode</span>
                    <span class="text-slate-300 text-sm font-medium">S${nextEp.season_number}E${nextEp.episode_number}: "${nextEp.name}" airs on <strong class="text-white">${nextEp.air_date}</strong></span>
                </div>
            `;
        }

        // Generate Season Dropdown 
        if (data.seasons && data.seasons.length > 0) {
            const validSeasons = data.seasons.filter(s => s.season_number > 0);
            const options = validSeasons.map(s => `<option value="${s.season_number}">${s.name} (${s.episode_count} eps)</option>`).join('');
            
            episodesSection = `
                ${nextEpisodeBadge}
                <div class="mt-6 pt-6 border-t border-slate-800/80">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-sm tracking-wider text-teal-500/80 uppercase font-bold">Episodes Guide</h3>
                        <select id="season-selector" data-tvid="${data.id}" class="bg-slate-950 text-xs font-semibold text-white px-3 py-2 rounded-lg border border-slate-700 outline-none focus:border-teal-400 cursor-pointer">
                            ${options}
                        </select>
                    </div>
                    <div id="episodes-list" class="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2" style="scrollbar-width: thin; scrollbar-color: #0D8B93 transparent;">
                    </div>
                </div>
            `;
        }
    }

    // Extract Top Cast
    const topCast = (castData?.cast || []).slice(0, 4).map(actor => {
        const profilePic = actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : `https://ui-avatars.com/api/?name` + encodeURIComponent(actor.name) + `&background=random&color=fff`;
        return `
        <div class="flex flex-col items-center text-center gap-1">
            <img src="${profilePic}" alt="${actor.name}" class="w-12 h-12 rounded-full object-cover border border-slate-700">
            <span class="text-[10px] text-slate-300 line-clamp-1 w-16">${actor.name}</span>
        </div>`;
    }).join('');

    // Streaming providers
    const rawProviders = data['watch/providers']?.results?.US?.flatrate || [];
    const providers = [];
    const seenBaseNames = new Set();
    
    rawProviders.forEach(p => {
        const baseName = p.provider_name.split(' ')[0];
        if (!seenBaseNames.has(baseName)) {
            seenBaseNames.add(baseName);
            providers.push(p);
        }
    });

    let streamingSection = "";
    if(providers.length > 0){
        const providerIcons = providers.slice(0, 4).map(p => 
            `<img src="https://image.tmdb.org/t/p/w92${p.logo_path}" alt="${p.provider_name}" title="${p.provider_name}" class="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl shadow-sm border border-slate-700/50 object-cover">`
        ).join('');
        
        streamingSection = `
            <div>
                <p class="text-[10px] tracking-wider text-slate-500 uppercase font-bold mb-1">Streaming On</p>
                <div class="flex flex-wrap gap-2">${providerIcons}</div>
            </div>
        `;
    }

    // Production Studios
    const companies = data.production_companies?.filter(c => c.logo_path).slice(0, 3) || [];
    let companiesSection = "";
    if(companies.length > 0){
        const companyIcons = companies.map(c => 
            `<div class="bg-white px-2 md:px-3 py-1 rounded-lg md:rounded-xl flex items-center justify-center h-8 md:h-11 border border-slate-700/50">
                <img src="https://image.tmdb.org/t/p/w92${c.logo_path}" alt="${c.name}" title="${c.name}" class="max-h-5 md:max-h-7 max-w-[60px] md:max-w-[80px] object-contain">
            </div>`
        ).join('');
        companiesSection = `
            <div>
                <p class="text-[10px] tracking-wider text-slate-500 uppercase font-bold mb-1">Studios</p>
                <div class="flex flex-wrap gap-2">${companyIcons}</div>
            </div>
        `;
    }

    // Similar / Recommended
    let similarSection = '';
    if (data.similar?.results?.length > 0) {
        const similarCards = data.similar.results.slice(0, 6).map(item => {
            const img = item.poster_path ? `${imageBaseUrl}${item.poster_path}` : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&auto=format&fit=crop';
            const title = item.title || item.name;
            return `
                <div data-id="${item.id}" data-type="${item.media_type || type}" class="similar-card flex-shrink-0 w-24 cursor-pointer group">
                    <img src="${img}" alt="${title}" class="w-full h-36 object-cover rounded-lg border border-slate-700/50 group-hover:border-teal-500/80 transition-colors">
                    <p class="text-[10px] text-slate-400 mt-1 truncate group-hover:text-teal-300 transition-colors">${title}</p>
                </div>
            `;
        }).join('');
        
        similarSection = `
            <div class="pt-5 mt-5 border-t border-slate-800/80">
                <p class="text-[10px] tracking-wider text-teal-500/80 uppercase font-bold mb-3">You Might Also Like</p>
                <div class="flex gap-4 overflow-x-auto pb-2" style="scrollbar-width: thin; scrollbar-color: #0D8B93 transparent;">
                    ${similarCards}
                </div>
            </div>
        `;
    }

    // Inject Master Layout
    modalContent.innerHTML = `
        <div class="flex flex-col md:flex-row gap-6 relative min-w-0">
            <button id="close-modal" class="absolute top-1 right-1 md:top-2 md:right-2 text-slate-400 hover:text-teal-400 transition-colors z-20 bg-slate-900 rounded-full p-1 border border-slate-700/50">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            
            <div class="w-1/2 sm:w-1/3 md:w-1/3 shrink-0 mx-auto md:mx-0 pt-8 md:pt-0">
                <img src="${poster}" alt="${displayTitle}" class="w-full rounded-xl shadow-lg border border-slate-700/50 object-cover">
            </div>
            
            <div class="flex flex-col text-left w-full min-w-0 pr-2 md:pr-6">
                <h2 class="text-2xl md:text-3xl font-extrabold text-white mb-2 pr-8">${displayTitle}</h2>
                <div class="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-slate-400 mb-3 font-medium">
                    <span class="bg-slate-800 px-2 py-1 rounded text-teal-400 border border-slate-700">⭐ ${rating}</span>
                    <span class="bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700 font-bold">${ageRating}</span>
                    <span class="bg-slate-800 px-2 py-1 rounded text-slate-300 border border-slate-700">${status}</span>
                    <span>${displayDate.split("-")[0]}</span>
                    <span>•</span>
                    <span>${type === 'tv' ? 'TV Series' : 'Movie'}</span>
                    ${imdbLink}
                </div>
                
                <div class="flex items-center gap-4 mb-4">
                    ${trailerBtn}
                </div>
                
                ${tagline}
                
                <div class="grid grid-cols-2 gap-4 mb-4 bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                    <div>
                        <p class="text-[10px] tracking-wider text-slate-500 uppercase font-bold mb-1">${directorLabel}</p>
                        <p class="text-slate-300 text-xs font-medium truncate pr-2">${directorName}</p>
                    </div>
                    <div>
                        <p class="text-[10px] tracking-wider text-slate-500 uppercase font-bold mb-1">Genres</p>
                        <p class="text-slate-300 text-xs font-medium line-clamp-1 pr-2">${genres}</p>
                    </div>
                    ${extraMetaData}
                    ${streamingSection}
                    ${companiesSection}
                </div>

                <div class="mb-4">
                    <p class="text-[10px] tracking-wider text-teal-500/80 uppercase font-bold mb-1">Overview</p>
                    <p class="text-slate-300 leading-relaxed text-sm">${overview}</p>
                </div>
                
                ${topCast.length > 0 ? `
                <div class="pt-4 border-t border-slate-800/80">
                    <p class="text-[10px] tracking-wider text-teal-500/80 uppercase font-bold mb-3">Top Cast</p>
                    <div class="flex flex-wrap gap-4">
                        ${topCast}
                    </div>
                </div>
                ` : ''}

                ${episodesSection}
                ${similarSection}
            </div>
        </div>
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    if (type === "tv" && data.seasons && data.seasons.length > 0) {
        const selector = document.querySelector("#season-selector");
        const validSeasons = data.seasons.filter(s => s.season_number > 0);
        
        if (selector && validSeasons.length > 0) {
            const initialSeason = validSeasons[0].season_number;
            fetchSeasonEpisodes(data.id, initialSeason);

            selector.addEventListener("change", (e) => {
                const selectedSeason = e.target.value;
                const tvId = e.target.getAttribute("data-tvid");
                fetchSeasonEpisodes(tvId, selectedSeason);
            });
        }
    }
};


//  API Fetchers — Trending, Search, Details
const showDefaults = async () => {
    try {
        const url = `${baseUrl}/trending/all/week?api_key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (titleCard) {
            titleCard.innerText = "Trending Highlights";
        }
        const filteredData = data.results.filter(item => item.media_type === "movie" || item.media_type === "tv");
        showResults(filteredData);
    } catch (error) {
        console.error("Error fetching default movies:", error);
    }
};

let currentSearchController = null;

const fetchQuery = async (query) => {
    if(currentSearchController){
        currentSearchController.abort();
    }
    currentSearchController = new AbortController();
    
    showLoader();
    try {
        const url = `${baseUrl}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        const response = await fetch(url, {signal : currentSearchController.signal});
        const data = await response.json();
        if (titleCard) {
            titleCard.textContent = `Search Results for "${query}"`;
        }
        const filteredData = data.results.filter(item => item.media_type === "movie" || item.media_type === "tv");
        showResults(filteredData);
    } catch (error) {

        if(error.name == "AbortError"){
            return;
        }

        console.error("Error fetching data:", error);
        resultsGrid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <p class="text-red-400 text-lg">Something went wrong while loading movies.</p>
            </div>
        `;
    }
};

const fetchDetails = async (id, type) => {
    showModalLoader();
    try {

        const appendParams = type === "movie"
        ? "credits,videos,release_dates,external_ids,watch/providers,similar"
        : "credits,videos,content_ratings,external_ids,watch/providers,similar";

        const url = `${baseUrl}/${type}/${id}?api_key=${apiKey}&append_to_response=${appendParams}`;
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("Failed to fetch details");
        }
        const data = await response.json();
        showDetails(data, data.credits || {}, type);

    } catch (e) {
        console.error("Error fetching details:", e);
        const modalContent = document.querySelector("#modal-content");
        if(modalContent){
            modalContent.innerHTML = `
                <div class="text-center py-10 relative bg-slate-900 rounded-xl p-6 border border-slate-800">
                    <button id="close-modal" class="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors p-1">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    <p class="text-red-400 font-medium">Failed to load movie details. Please try again.</p>
                </div>
            `;
        }
    }
};


//  Search Logic & Debounce
const startSearch = () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchQuery(query);
    }else{
        if(currentSearchController){
            currentSearchController.abort();
        }
        showDefaults();
    }
};

const debounce = (func, delay = 500) => {
    let timeoutID;
    return (...args) => {
        clearTimeout(timeoutID);
        timeoutID = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

const debouncedSearch = debounce(startSearch, 500);


//  Event Listeners

// Search triggers
searchBtn.addEventListener("click", startSearch);
searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        startSearch();
    }
});
searchInput.addEventListener("input", debouncedSearch);

// Card click — open details modal
resultsGrid.addEventListener("click", (e) => {
    const card = e.target.closest("article");
    if (card) {
        const id = card.getAttribute("data-id");
        const type = card.getAttribute("data-type");
        fetchDetails(id, type);
    }
});

// Modal close — click backdrop or close button
document.addEventListener("click", (e) => {
    const modal = document.querySelector("#details-modal");
    if (!modal) {
        return;
    }
    if (e.target === modal || e.target.closest("#close-modal")) {
        closeModal();
    }
});

// Modal close — Escape key
document.addEventListener("keydown", (e)=>{
    const modal = document.querySelector("#details-modal");
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }
});


// Modal content click
const modalContentEl = document.querySelector("#modal-content");
if (modalContentEl) {
    modalContentEl.addEventListener("click", (e) => {
        const similarCard = e.target.closest(".similar-card");
        if (similarCard) {
            const id = similarCard.getAttribute("data-id");
            const type = similarCard.getAttribute("data-type");
            fetchDetails(id, type); 
            document.querySelector("#details-modal").scrollTo(0,0);
        }
    });
}


//  Init — Load Trending on Page Load
showDefaults();