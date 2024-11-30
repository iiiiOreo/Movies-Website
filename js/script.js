const landing = document.getElementById("landing");
const releaseTime = document.querySelector(".releaseTime");
const movieTitle = document.querySelector(".movieTitle");
const movieDesc = document.querySelector(".movieDesc");
const movieBox = document.getElementById("movieDetails");

const allSection = document.querySelectorAll(".section");

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

let movies;
async function fetchMovies() {
  try {
    const response = await fetch(`${URL}/3/movie/popular`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { results } = await response.json();
    movies = results;
    setInterval(sliderLandingPage, 20000);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function getLatestMovies() {
  try {
    const response = await fetch(`${URL}/3/movie/now_playing`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { results } = await response.json();
    createMovieSlides(results, "movieSliderLatest");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function getAllTrending() {
  try {
    const response = await fetch(`${URL}/3/trending/all/day`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { results } = await response.json();

    createMovieSlides(results, "movieSliderTrending");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function getTopRatedMovies() {
  try {
    const response = await fetch(`${URL}/3/movie/top_rated`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { results } = await response.json();
    createTopMovieSlides(results, "movieSliderTopRated", "movie");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

async function getTopRatedTV() {
  try {
    const response = await fetch(`${URL}/3/tv/top_rated`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { results } = await response.json();
    console.log(results);
    createTopMovieSlides(results, "showsSilderTopRated", "tv");
    createTvSlides(results, "TVSliderTrending");
  } catch (err) {
    console.error("Error:", err.message);
  }
}
function init() {
  fetchMovies();
  getTopRatedMovies();
  getTopRatedTV();
  getLatestMovies();
  getAllTrending();
}
init();

let i = 0;
function sliderLandingPage() {
  // Fade out and scale down
  movieBox.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
  landing.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
  movieBox.style.opacity = "0";
  movieBox.style.transform = "translateY(-100px)";

  landing.style.opacity = "0";
  landing.style.transform = "translateX(-100%)";

  setTimeout(() => {
    // Update content
    landing.style.backgroundImage = `url(${baseImageUrl}${movies[i].backdrop_path})`;
    releaseTime.innerHTML =
      movies[i].release_date?.split("-")[0] ||
      movies[i].first_air_date?.split("-")[0];
    movieTitle.innerHTML = movies[i].title;
    movieDesc.innerHTML = movies[i].overview;

    landing.style.opacity = "1";
    landing.style.transform = "translateX(0)";

    // Move to next movie
    i = (i + 1) % movies.length;
  }, 600);
  setTimeout(() => {
    // Fade in and scale up
    movieBox.style.opacity = "1";
    movieBox.style.transform = "translateY(0)";

    // Move to next movie
  }, 800);
}

function createMovieSlides(movies, section) {
  const sliderContainer = document.getElementById(`${section}`);
  sliderContainer.innerHTML = "";
  movies.forEach((movie) => {
    const slide = document.createElement("div");
    const link = document.createElement("a");
    link.href = `./movie/movie.html?id=${movie.id}`;
    link.className = "movie-slide";
    slide.appendChild(link);
    slide.className = "swiper-slide";
    slide.id = movie.id;
    slide.innerHTML += `
              <div class="image">
              <img
                src="${baseImageUrl}${movie.poster_path}"
                alt="movie"
                class="movie-img"
              />
            </div>
            <div class="movie-info">
              <h2 class="movie-title">${movie.title || movie.original_name}</h2>
              <span class="releaseTime">${
                movie.release_date?.split("-")[0] ||
                movie.first_air_date?.split("-")[0]
              }</span>
            </div>
                `;
    sliderContainer.appendChild(slide);
  });
}
function createTvSlides(movies, section) {
  const sliderContainer = document.getElementById(`${section}`);
  sliderContainer.innerHTML = "";
  movies.forEach((movie) => {
    const slide = document.createElement("div");
    const link = document.createElement("a");
    link.href = `./tv/tv.html?id=${movie.id}`;
    link.className = "movie-slide";
    slide.appendChild(link);
    slide.className = "swiper-slide";
    slide.id = movie.id;
    slide.innerHTML += `
              <div class="image">
              <img
                src="${baseImageUrl}${movie.poster_path}"
                alt="movie"
                class="movie-img"
              />
            </div>
                `;
    sliderContainer.appendChild(slide);
  });
}

function createTopMovieSlides(movies, section, type) {
  const sliderContainer = document.getElementById(`${section}`);
  sliderContainer.innerHTML = "";
  movies.forEach((movie) => {
    const slide = document.createElement("div");
    const link = document.createElement("a");
    link.href = `./${type}/${type}.html?id=${movie.id}`;
    link.className = "movie-slide";
    slide.appendChild(link);
    slide.className = "swiper-slide";
    slide.id = movie.id;
    slide.innerHTML += `
              <div class="image-top">
              <img
                src="${baseImageUrl}${movie.backdrop_path}"
                alt="movie"
                class="movie-img"
              />
            </div>
            <div class="movie-info">
              <h2 class="movie-title">${
                movie.title || movie.name || movie.original_name
              }</h2>
              <div>
                <i class="fa-solid fa-star"/></i>
              <span class="releaseTime">${(+movie.vote_average).toFixed(
                1
              )} | Drama</span>
              </div>
            </div>
                `;
    sliderContainer.appendChild(slide);
  });
}

const swiper = new Swiper(".mySwiper", {
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
      slidesPerView: 4,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 5,
      spaceBetween: 50,
    },
  },
});
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

const swiper2 = new Swiper(".slider-swiper", {
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
      slidesPerView: 2.25,
      spaceBetween: 40,
    },
  },
});

// animation fadeoutSection
const fadeoutSection = function (entries, observer) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  }
};
const sectionObserver = new IntersectionObserver(fadeoutSection, {
  root: null,
  threshold: 0.15,
});

allSection.forEach((section) => {
  console.log();
  section.classList.add("section--hidden");
  sectionObserver.observe(section);
});
