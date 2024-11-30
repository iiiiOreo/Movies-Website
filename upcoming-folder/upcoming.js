const API_KEY = "b1425c2e7397b4d658db305ae9abd48b";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

fetch(
  `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&api_key=${API_KEY}`
)
  .then((response) => response.json())
  .then((response) => {
    const swiper_wrapper = document.getElementsByClassName("swiper-wrapper")[0];

    for (const item of response.results) {
      const swiper_slide = document.createElement("div");
      swiper_slide.setAttribute("class", "swiper-slide");
      // Create the image element
      const image = document.createElement("img");
      image.setAttribute("class", "slider-image");
      // Set the image source
      if (item.backdrop_path) {
        const baseURL = "https://image.tmdb.org/t/p/w500"; // Adjust if necessary
        image.src = baseURL + item.backdrop_path;
      }
      // Append image to the slide
      swiper_slide.appendChild(image);
      // Create title element and append it
      const image_title = document.createElement("h5");
      image_title.setAttribute("class", "image-title");
      image_title.innerText = item.title;
      swiper_slide.appendChild(image_title);
      // create voting tag
      let vote = document.createElement("p");
      vote.innerHTML = ` <i class="fa-solid fa-star" style=color:#FFC700></i> ${item.vote_average}`;
      vote.setAttribute("class", "image-vote");
      // if (item.vote_average>=7) {
      //     vote.style.color= 'green'
      // }else{
      //     vote.style.color= 'red'
      // }
      swiper_slide.appendChild(vote);
      // Append slide to the swiper wrapper
      swiper_wrapper.appendChild(swiper_slide);
    }

    // Initialize Swiper after adding all slides
    const swiper = new Swiper(".swiper", {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },

      breakpoints: {
        320: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        480: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        640: {
          slidesPerView: 6,
          spaceBetween: 40,
        },
      },
    });

    // No need to call swiper.update() here, as initialization takes care of it
  })
  .catch((err) => console.error(err));

function scrollToSection() {
  const selectedValue = document.getElementById("sectionSelect").value;

  if (selectedValue) {
    document
      .getElementById(selectedValue)
      .scrollIntoView({ behavior: "smooth" });
  }
}
