// API configuration
const API_KEY = "b4476758d9653857aee9660affefd75f"
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNDQ3Njc1OGQ5NjUzODU3YWVlOTY2MGFmZmVmZDc1ZiIsIm5iZiI6MTc0NDUxMjA3OC4xODksInN1YiI6IjY3ZmIyNDRlYWFjZjdjZmIyNjk5MmE3ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nTribJTwS--Xr3spaKm-PLathJNEnH6tTExBLBMuO1g"
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original"

// DOM Elements
const searchForm = document.getElementById("search-form")
const searchInput = document.getElementById("search-input")
const loadingSpinner = document.getElementById("loading")
const movieCategories = document.getElementById("movie-categories")
const movieModal = document.getElementById("movie-modal")
const closeModalBtn = document.getElementById("close-modal")
const filterButtons = document.querySelectorAll(".filter-btn")
const heroSlides = document.getElementById("hero-slides")
const heroIndicators = document.getElementById("hero-indicators")
const prevHeroBtn = document.getElementById("prev-hero")
const nextHeroBtn = document.getElementById("next-hero")
const videoModal = document.getElementById("video-modal")
const closeVideoBtn = document.getElementById("close-video")
const videoContainer = document.getElementById("video-container")
const playMovieBtn = document.getElementById("play-movie")
const watchTrailerBtn = document.getElementById("watch-trailer")
const searchToggleBtn = document.getElementById("search-toggle-btn")
const searchContainer = document.getElementById("search-container")
const logoHome = document.getElementById("logo-home")
const mobileLogoHome = document.getElementById("mobile-logo-home")

// Modal elements
const modalPoster = document.getElementById("modal-poster")
const modalBackdrop = document.getElementById("modal-backdrop")
const modalTitle = document.getElementById("modal-title")
const modalRating = document.getElementById("modal-rating")
const modalYear = document.getElementById("modal-year")
const modalRuntime = document.getElementById("modal-runtime")
const modalOverview = document.getElementById("modal-overview")
const modalGenres = document.getElementById("modal-genres")
const modalGenresContainer = document.getElementById("modal-genres-container")
const modalCast = document.getElementById("modal-cast")
const modalCastContainer = document.getElementById("modal-cast-container")

// Current active category and hero slide
let currentCategory = "trending"
let currentSlide = 0
let heroMovies = []
let autoSlideInterval

// Custom cursor
const cursorDot = document.getElementById("cursor-dot")
const cursorOutline = document.getElementById("cursor-outline")

document.addEventListener("mousemove", (e) => {
  const posX = e.clientX
  const posY = e.clientY

  cursorDot.style.left = `${posX}px`
  cursorDot.style.top = `${posY}px`

  // Add a slight delay to the outline for a smoother effect
  setTimeout(() => {
    cursorOutline.style.left = `${posX}px`
    cursorOutline.style.top = `${posY}px`
  }, 50)
})

document.addEventListener("mousedown", () => {
  cursorOutline.style.transform = "translate(-50%, -50%) scale(0.8)"
})

document.addEventListener("mouseup", () => {
  cursorOutline.style.transform = "translate(-50%, -50%) scale(1)"
})

// Add hover effect for clickable elements
document.querySelectorAll("button, a, .movie-card, .filter-btn, .hero-indicator").forEach((el) => {
  el.addEventListener("mouseover", () => {
    cursorOutline.style.transform = "translate(-50%, -50%) scale(1.5)"
    cursorOutline.style.borderColor = "rgba(229, 9, 20, 0.8)"
  })

  el.addEventListener("mouseleave", () => {
    cursorOutline.style.transform = "translate(-50%, -50%) scale(1)"
    cursorOutline.style.borderColor = "rgba(229, 9, 20, 0.5)"
  })
})

// Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
  // Load trending movies for hero carousel
  await loadHeroCarousel()

  // Load movie categories
  await loadMovieCategories()

  // Logo click to home
  const logoHome = document.getElementById("logo-home")
  if (logoHome) {
    logoHome.addEventListener("click", () => {
      window.location.reload()
    })
  }
})

// Search toggle
searchToggleBtn.addEventListener("click", () => {
  searchContainer.classList.toggle("active")
  if (searchContainer.classList.contains("active")) {
    searchInput.focus()
  }
})

// Close search when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-toggle") && searchContainer.classList.contains("active")) {
    searchContainer.classList.remove("active")
  }
})

// Logo click to home
logoHome.addEventListener("click", () => {
  window.location.reload()
})

mobileLogoHome.addEventListener("click", () => {
  window.location.reload()
})

searchForm.addEventListener("submit", handleSearch)
closeModalBtn.addEventListener("click", closeModal)
closeVideoBtn.addEventListener("click", closeVideoModal)
playMovieBtn.addEventListener("click", playMovie)
watchTrailerBtn.addEventListener("click", watchTrailer)

// Hero carousel controls
prevHeroBtn.addEventListener("click", () => {
  navigateHeroSlide(-1)
  resetAutoSlide()
})

nextHeroBtn.addEventListener("click", () => {
  navigateHeroSlide(1)
  resetAutoSlide()
})

// Filter button event listeners
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.category

    // Update active button
    filterButtons.forEach((btn) => btn.classList.remove("active"))
    button.classList.add("active")

    // Fetch movies for selected category
    fetchMoviesByCategory(category)
  })
})

// Load hero carousel with trending movies
async function loadHeroCarousel() {
  try {
    const trendingMovies = await fetchMoviesByType("trending/movie/week", "Trending")
    heroMovies = trendingMovies.slice(0, 5) // Use top 5 trending movies for carousel

    // Fetch additional details for each hero movie
    for (let i = 0; i < heroMovies.length; i++) {
      const details = await fetchMovieDetails(heroMovies[i].id)
      heroMovies[i] = { ...heroMovies[i], ...details }
    }

    renderHeroCarousel()
    startAutoSlide()
  } catch (error) {
    console.error("Error loading hero carousel:", error)
  }
}

// Render hero carousel
function renderHeroCarousel() {
  heroSlides.innerHTML = ""
  heroIndicators.innerHTML = ""

  heroMovies.forEach((movie, index) => {
    // Create slide
    const slide = document.createElement("div")
    slide.className = `hero-slide ${index === 0 ? "active" : ""}`
    slide.style.backgroundImage = `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url(${BACKDROP_BASE_URL}${movie.backdrop_path})`

    // Get genre names
    const genres = movie.genres
      ? movie.genres
          .slice(0, 3)
          .map((g) => g.name)
          .join(", ")
      : ""

    slide.innerHTML = `
      <div class="hero-content">
        <h1 class="hero-title">${movie.title}</h1>
        <div class="hero-meta">
          <div class="hero-rating"><i class="fas fa-star"></i> ${movie.vote_average.toFixed(1)}</div>
          <div class="hero-year">${new Date(movie.release_date).getFullYear()}</div>
          <div class="hero-category">${genres}</div>
        </div>
        <p class="hero-overview">${movie.overview.substring(0, 200)}${movie.overview.length > 200 ? "..." : ""}</p>
        <div class="hero-buttons">
          <button class="hero-play-btn" data-id="${movie.id}"><i class="fas fa-play"></i> Play</button>
          <button class="hero-more-btn" data-id="${movie.id}"><i class="fas fa-info-circle"></i> More Info</button>
        </div>
      </div>
    `

    // Add event listeners to buttons
    slide.querySelector(".hero-play-btn").addEventListener("click", () => {
      openMovieDetails(movie.id)
      playMovie()
    })

    slide.querySelector(".hero-more-btn").addEventListener("click", () => {
      openMovieDetails(movie.id)
    })

    heroSlides.appendChild(slide)

    // Create indicator
    const indicator = document.createElement("div")
    indicator.className = `hero-indicator ${index === 0 ? "active" : ""}`
    indicator.addEventListener("click", () => {
      setHeroSlide(index)
      resetAutoSlide()
    })

    heroIndicators.appendChild(indicator)
  })
}

// Navigate hero slides
function navigateHeroSlide(direction) {
  const slides = document.querySelectorAll(".hero-slide")
  const indicators = document.querySelectorAll(".hero-indicator")

  slides[currentSlide].classList.remove("active")
  indicators[currentSlide].classList.remove("active")

  currentSlide = (currentSlide + direction + slides.length) % slides.length

  slides[currentSlide].classList.add("active")
  indicators[currentSlide].classList.add("active")
}

// Set specific hero slide
function setHeroSlide(index) {
  const slides = document.querySelectorAll(".hero-slide")
  const indicators = document.querySelectorAll(".hero-indicator")

  slides[currentSlide].classList.remove("active")
  indicators[currentSlide].classList.remove("active")

  currentSlide = index

  slides[currentSlide].classList.add("active")
  indicators[currentSlide].classList.add("active")
}

// Auto slide for hero carousel
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    navigateHeroSlide(1)
  }, 6000)
}

// Reset auto slide timer
function resetAutoSlide() {
  clearInterval(autoSlideInterval)
  startAutoSlide()
}

// Load movie categories
async function loadMovieCategories() {
  showLoading()

  try {
    const categories = [
      { type: "trending/movie/week", title: "Trending Now" },
      { type: "movie/popular", title: "Popular Movies" },
      { type: "movie/top_rated", title: "Top Rated" },
      { type: "movie/upcoming", title: "Coming Soon" },
      { type: "movie/now_playing", title: "Now Playing" },
    ]

    movieCategories.innerHTML = ""

    // Fetch all categories in parallel
    const results = await Promise.all(categories.map((category) => fetchMoviesByType(category.type, category.title)))

    // Render each category
    categories.forEach((category, index) => {
      renderMovieCategory(category.title, results[index])
    })
  } catch (error) {
    console.error("Error loading movie categories:", error)
  } finally {
    hideLoading()
  }
}

// Fetch movies by type
async function fetchMoviesByType(type, title) {
  const url = `${BASE_URL}/${type}?language=en-US&page=1`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }

  const data = await response.json()
  return data.results
}

// Render movie category
function renderMovieCategory(title, movies) {
  const categorySection = document.createElement("div")
  categorySection.className = "movie-category"

  categorySection.innerHTML = `
    <div class="category-header">
      <h2 class="category-title">${title}</h2>
      <a href="#" class="see-all">See All <i class="fas fa-chevron-right"></i></a>
    </div>
    <div class="movie-row">
      ${movies.map((movie) => createMovieCard(movie)).join("")}
    </div>
  `

  // Add event listeners to movie cards
  categorySection.querySelectorAll(".movie-card").forEach((card) => {
    card.addEventListener("click", () => {
      openMovieDetails(card.dataset.id)
    })
  })

  movieCategories.appendChild(categorySection)
}

// Create movie card HTML
function createMovieCard(movie) {
  const posterPath = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown"
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"

  return `
    <div class="movie-card" data-id="${movie.id}">
      <div class="movie-poster">
        ${
          posterPath
            ? `<img src="${posterPath}" alt="${movie.title}" loading="lazy">`
            : `<div class="no-image">No Image</div>`
        }
        <div class="movie-info">
          <h3 class="movie-title">${movie.title}</h3>
          <p class="movie-year">${releaseYear}</p>
          <div class="movie-rating"><i class="fas fa-star"></i> ${rating}</div>
        </div>
      </div>
    </div>
  `
}

// Search for movies
async function handleSearch(e) {
  e.preventDefault()
  const searchTerm = searchInput.value.trim()

  if (!searchTerm) return

  showLoading()

  try {
    const movies = await searchMovies(searchTerm)

    // Clear existing categories
    movieCategories.innerHTML = ""

    // Render search results as a category
    renderMovieCategory(`Search Results: "${searchTerm}"`, movies)

    // Update active button (none for search)
    filterButtons.forEach((btn) => btn.classList.remove("active"))

    // Close search container
    searchContainer.classList.remove("active")
  } catch (error) {
    console.error("Error searching movies:", error)
    alert("Failed to search movies. Please try again.")
  } finally {
    hideLoading()
  }
}

// Fetch movies by category
async function fetchMoviesByCategory(category) {
  showLoading()
  currentCategory = category

  try {
    await loadMovieCategories()

    // Update active button
    filterButtons.forEach((btn) => {
      if (btn.dataset.category === category) {
        btn.classList.add("active")
      } else {
        btn.classList.remove("active")
      }
    })
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error)
    alert(`Failed to load ${category} movies. Please try again.`)
  } finally {
    hideLoading()
  }
}

// Fetch movies from API
async function searchMovies(query) {
  const url = `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }

  const data = await response.json()
  return data.results
}

// Open movie details modal
async function openMovieDetails(movieId) {
  try {
    // Show loading spinner inside modal
    modalTitle.textContent = "Loading..."
    modalRating.innerHTML = '<i class="fas fa-star"></i>'
    modalYear.textContent = ""
    modalRuntime.textContent = ""
    modalOverview.textContent = ""
    modalGenres.innerHTML = ""
    modalCast.innerHTML = ""
    modalPoster.src = ""
    modalBackdrop.style.backgroundImage = ""
    movieModal.classList.remove("hidden")

    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden"

    // Fetch movie details and credits in parallel
    const [movie, credits, videos] = await Promise.all([
      fetchMovieDetails(movieId),
      fetchMovieCredits(movieId),
      fetchMovieVideos(movieId),
    ])

    // Update modal content
    modalTitle.textContent = movie.title
    modalRating.innerHTML = `<i class="fas fa-star"></i> ${movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}`
    modalYear.textContent = movie.release_date ? new Date(movie.release_date).getFullYear() : "Unknown"

    // Add runtime if available
    if (movie.runtime && movie.runtime > 0) {
      const hours = Math.floor(movie.runtime / 60)
      const minutes = movie.runtime % 60
      modalRuntime.textContent = `${hours}h ${minutes}m`
    } else {
      modalRuntime.textContent = ""
    }

    modalOverview.textContent = movie.overview || "No overview available"

    // Set backdrop
    if (movie.backdrop_path) {
      modalBackdrop.style.backgroundImage = `url(${BACKDROP_BASE_URL}${movie.backdrop_path})`
    } else if (movie.poster_path) {
      modalBackdrop.style.backgroundImage = `url(${BACKDROP_BASE_URL}${movie.poster_path})`
    }

    // Set poster
    if (movie.poster_path) {
      modalPoster.src = `${IMAGE_BASE_URL}${movie.poster_path}`
      modalPoster.alt = movie.title
    } else {
      modalPoster.src = ""
      modalPoster.alt = ""
      modalPoster.parentElement.innerHTML = `<div class="no-image">No Image Available</div>`
    }

    // Set genres
    if (movie.genres && movie.genres.length > 0) {
      modalGenresContainer.classList.remove("hidden")
      modalGenres.innerHTML = movie.genres.map((genre) => `<span class="genre-tag">${genre.name}</span>`).join("")
    } else {
      modalGenresContainer.classList.add("hidden")
    }

    // Set cast
    if (credits.cast && credits.cast.length > 0) {
      modalCastContainer.classList.remove("hidden")

      // Display up to 10 cast members
      const castToShow = credits.cast.slice(0, 10)

      modalCast.innerHTML = castToShow
        .map((person) => {
          const profileImg = person.profile_path
            ? `${IMAGE_BASE_URL}${person.profile_path}`
            : "https://via.placeholder.com/80x80?text=No+Image"

          return `
          <div class="cast-item">
            <img src="${profileImg}" alt="${person.name}" class="cast-photo">
            <div class="cast-name">${person.name}</div>
            <div class="cast-character">${person.character || "Unknown"}</div>
          </div>
        `
        })
        .join("")
    } else {
      modalCastContainer.classList.add("hidden")
    }

    // Store videos for trailer button
    movie.videos = videos.results

    // Set data-id for play button
    playMovieBtn.dataset.id = movie.id
  } catch (error) {
    console.error("Error fetching movie details:", error)
    closeModal()
    alert("Failed to load movie details. Please try again.")
  }
}

// Fetch movie details from API
async function fetchMovieDetails(movieId) {
  const url = `${BASE_URL}/movie/${movieId}?language=en-US`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }

  return await response.json()
}

// Fetch movie credits (cast & crew)
async function fetchMovieCredits(movieId) {
  const url = `${BASE_URL}/movie/${movieId}/credits?language=en-US`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }

  return await response.json()
}

// Fetch movie videos (trailers, etc.)
async function fetchMovieVideos(movieId) {
  const url = `${BASE_URL}/movie/${movieId}/videos?language=en-US`

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }

  return await response.json()
}

// Play movie (simulated)
function playMovie() {
  // In a real app, this would play the actual movie
  // For this demo, we'll just show a message
  const movieTitle = modalTitle.textContent

  videoContainer.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; padding: 20px;">
      <i class="fas fa-film" style="font-size: 48px; margin-bottom: 20px;"></i>
      <h2 style="margin-bottom: 10px;">Playing: ${movieTitle}</h2>
      <p>This is a demo app. In a real streaming service, the movie would play here.</p>
    </div>
  `

  videoModal.classList.remove("hidden")
  document.body.style.overflow = "hidden"
}

// Watch trailer
function watchTrailer() {
  const movieTitle = modalTitle.textContent
  const movieId = playMovieBtn.dataset.id

  // Fetch movie videos
  fetchMovieVideos(movieId)
    .then((videos) => {
      const videoResults = videos.results || []

      // Look for official trailer or any trailer
      const trailer =
        videoResults.find((v) => v.type === "Trailer" && v.official) ||
        videoResults.find((v) => v.type === "Trailer") ||
        videoResults[0]

      if (trailer) {
        videoContainer.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `
      } else {
        videoContainer.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; padding: 20px;">
          <i class="fas fa-exclamation-circle" style="font-size: 48px; margin-bottom: 20px;"></i>
          <h2 style="margin-bottom: 10px;">No Trailer Available</h2>
          <p>Sorry, we couldn't find a trailer for "${movieTitle}".</p>
        </div>
      `
      }

      videoModal.classList.remove("hidden")
      document.body.style.overflow = "hidden"
    })
    .catch((error) => {
      console.error("Error fetching trailer:", error)
      alert("Failed to load trailer. Please try again.")
    })
}

// Close the modal
function closeModal() {
  movieModal.classList.add("hidden")
  document.body.style.overflow = "auto"
}

// Close video modal
function closeVideoModal() {
  videoModal.classList.add("hidden")
  videoContainer.innerHTML = ""
  document.body.style.overflow = "auto"
}

// Show loading spinner
function showLoading() {
  loadingSpinner.classList.remove("hidden")
}

// Hide loading spinner
function hideLoading() {
  loadingSpinner.classList.add("hidden")
}
