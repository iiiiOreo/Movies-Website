const API_KEY = "b1425c2e7397b4d658db305ae9abd48b";
const HEADER =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiMTQyNWMyZTczOTdiNGQ2NThkYjMwNWFlOWFiZDQ4YiIsIm5iZiI6MTcyNTY4ODExMC40Nzg0NjcsInN1YiI6IjY2ZGJlMjMyNmU0NjVjNTc4MTc4NTY1ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.SLZShddq1W_YvvzHirMpMV-kSbhJwZIV0tz9FaTdhus";

const URL = "https://api.themoviedb.org";
const baseImageUrl = "https://image.tmdb.org/t/p/original";
const options = {
  method: "GET",
  headers: {
    Authorization: `Bearer ${HEADER}`,
    accept: "application/json",
  },
};
const YouTube = "https://www.youtube.com/watch?v=";
const Vimeo = "https://vimeo.com/";

const id = location.href.split("?")[1].split("=")[1];

let initialMovie;
async function getMovieDetails(id) {
  try {
    const response = await fetch(`${URL}/3/movie/${id}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    movie = await response.json();
    initialMovie = movie;
    console.log(movie);

    // createMovieSlides(movie, "movieSliderTopRated");
    return movie;
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function getMovieCast(id) {
  try {
    const response = await fetch(`${URL}/3/movie/${id}/credits`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const movie = await response.json();
    // console.log(movie);
    return movie;
  } catch (err) {
    console.error("Error:", err.message);
  }
}
async function getRecommendations(id) {
  try {
    const response = await fetch(
      `${URL}/3/movie/${id}/recommendations`,
      options
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { results } = await response.json();
    console.log(results);
    createMovieSlides(results, "movieSliderTopRated");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function getVideos(id) {
  try {
    const response = await fetch(`${URL}/3/movie/${id}/videos`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let { results } = await response.json();
    results = results.filter(
      (result) => result.site === "YouTube" && result.official
    );
    console.log(results);
    if (results.length > 0) setupTrailerThumbnail(results[0].key);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
async function landingPage() {
  const {
    genres,
    backdrop_path,
    title,
    original_title,
    release_date,
    id: movieId,
    overview,
    poster_path,
  } = await getMovieDetails(id);
  document.querySelector(".movieDesc").innerHTML = overview;
  const container = document.querySelector("#landing .container");
  const landingPage = document.querySelector("#landing");
  landingPage.style.backgroundImage = `url("${baseImageUrl}${
    backdrop_path || poster_path
  }")`;
  container.innerHTML += `
  <div class="box active" id="movieDetails">
          <span class="releaseTime">${release_date.split("-")[0]}</span>
          <h1 class="movieTitle">${title || original_title}</h1>
          <p class="movieGeners">
          ${genres
            .map((genre, index) => {
              if (index < genres.length - 1)
                return `<span class="gener">${genre.name}</span>
            <span class="dot"></span>`;
              else return `<span class="gener">${genre.name}</span>`;
            })
            .join("")}
            
          </p>
        </div>

        <div class="btns d-flex justify-content-between flex-wrap">
          <div>
            <button type="button" class="bttn bttn-primary" id=${movieId}>
              <i class="fa-solid fa-play"></i>
              <span>Continue Watching</span>
            </button>
            <button type="button" class="bttn bttn-add">
              <i class="fa-regular fa-bookmark"></i>
              <span>Add to WatchList</span>
            </button>
          </div>
          <div class="flex justify-content-end align-items-center">
            <button type="button" class="bttn bttn-action">
              <i class="fa-solid fa-download"></i>
              <span>Download</span>
            </button>
            <button type="button" class="bttn bttn-action">
              <i class="fa-solid fa-share-nodes"></i>
              <span>Share</span>
            </button>
            <button type="button" class="bttn bttn-action">
              <i class="fa-solid fa-thumbs-up"></i>
              <span>Like</span>
            </button>
          </div>
        </div>
  `;
}

async function cast() {
  const { cast } = await getMovieCast(id);
  const castContainer = document.querySelector(".cast-group");
  castContainer.innerHTML = ``;
  const castGroup = cast
    .slice(0, 12)
    .map((person) => {
      const { profile_path, name, character } = person;
      return `
        <div class="actor">
              <img src="${baseImageUrl}${profile_path}" alt="name" class="actor-image" />
              <div class="info">
                <p>${name}</p>
                <span class="second">${character}</span>
              </div>
            </div>
        `;
    })
    .join("");
  castContainer.innerHTML = castGroup;
}

async function createMovieSlides(movies, section) {
  const sliderContainer = document.getElementById(`${section}`);
  sliderContainer.innerHTML = "";
  movies.forEach((movie) => {
    const slide = document.createElement("div");
    const link = document.createElement("a");
    link.href = `./movie.html?id=${movie.id}`;
    link.className = "movie-slide";
    slide.appendChild(link);
    slide.className = "swiper-slide";
    slide.id = movie.id;
    slide.innerHTML += `
              <div class="image">
              <img
                src="${baseImageUrl}${movie.backdrop_path}"
                alt="movie"
                class="movie-img"
              />
            </div>
            <div class="movie-info">
              <h2 class="movie-title">${movie.title}</h2>
              <span class="releaseTime">${
                movie.release_date?.split("-")[0] ||
                movie.first_air_date?.split("-")[0]
              }</span>
            </div>
                `;
    sliderContainer.appendChild(slide);
  });
}

function setupTrailerThumbnail(Key) {
  const thumbnailUrl = `https://img.youtube.com/vi/${Key}/0.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${Key}`;

  const trailerContainer = document.getElementById("trailerContainer");
  const trailerThumbnail = document.getElementById("trailerThumbnail");
  const movieTitleElement = document.getElementById("movieTitle");

  trailerThumbnail.src = thumbnailUrl;
  trailerThumbnail.alt = `${
    initialMovie.original_title || initialMovie.title
  } trailer thumbnail`;

  trailerContainer.addEventListener("click", () => {
    window.open(youtubeUrl, "_blank");
  });
}
function init() {
  landingPage();
  cast();
  getRecommendations(id);
  getVideos(id);
}
init();
const swiper1 = new Swiper(".topRated", {
  slidesPerView: 1,
  spaceBetween: 10,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3.25,
      spaceBetween: 40,
    },
  },
});
