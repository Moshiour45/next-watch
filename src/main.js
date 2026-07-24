// NextWatch - Main JavaScript File
// JS logic goes here. No functional logic implemented yet.
const apiKey = import.meta.env.VITE_API_KEY;
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchButton");
const baseUrl = 'https://api.themoviedb.org/3';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const resultsGrid = document.querySelector("#resultsGrid");
const titleCard = document.querySelector("h2");

const showResults = (movies) => {
    resultsGrid.innerHTML = "";
    if(!movies || movies.length === 0){
        resultsGrid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <p class="text-slate-400 text-xl font-medium">No movies found matching your search.</p>
                <p class="text-slate-600 text-sm mt-2">Try searching for something else like "Batman" or "Matrix".</p>
            </div>
        `;
        return;
    }
    movies.forEach((movie) =>{
        const {title, poster_path, vote_average, release_date} = movie;

        const poster = poster_path 
            ? `${imageBaseUrl}${poster_path}` 
            : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop';
        const year = release_date ? release_date.split("-")[0] : "N/A";
        const rating = vote_average ? vote_average.toFixed(1) : "N/A";

        const cardHTML = `
            <article class="group relative flex flex-col bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800/80 hover:border-teal-500/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(20,184,166,0.15)] cursor-pointer">
              <div class="aspect-[2/3] w-full relative overflow-hidden bg-slate-800">
                <img src="${poster}" alt="${title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div class="absolute top-3 left-3 flex gap-2">
                  <span class="bg-slate-950/80 backdrop-blur text-teal-400 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 border border-slate-700/50">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    ${rating}
                  </span>
                </div>
              </div>
              <div class="p-5 flex flex-col absolute bottom-0 w-full z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div class="flex items-center gap-2 mb-2 text-[11px] font-semibold tracking-wider text-teal-400/90 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  <span>Movie</span>
                </div>
                <h3 class="font-extrabold text-xl text-white line-clamp-1 leading-tight group-hover:text-teal-300 transition-colors">${title}</h3>
                <div class="flex items-center justify-between mt-1 text-slate-400 text-sm">
                  <span>${year}</span>
                  <span class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">TMDB</span>
                </div>
              </div>
            </article>
        `;

        resultsGrid.insertAdjacentHTML("beforeend", cardHTML);
    });
};

const getMovie = async (query) => {
    try{
        const url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (titleCard) {
            titleCard.textContent = `Search Results for "${query}"`;
        }
        showResults(data.results);
    }catch(error){
        console.error("Error fetching data:", error);
        resultsGrid.innerHTML = `
            <div class="col-span-full text-center py-16">
                <p class="text-red-400 text-lg">Something went wrong while loading movies.</p>
            </div>
        `;
    }
};

const startSearch = () =>{
    const query = searchInput.value.trim();
    if(query != ""){
        getMovie(query);
    }
};

searchBtn.addEventListener("click", startSearch);
searchInput.addEventListener("keydown", (e) =>{
    if(e.key === "Enter"){
        startSearch();
    }
});