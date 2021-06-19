const BASE_URL =  'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSTER_URL = BASE_URL +'/posters/'

const movies=JSON.parse(localStorage.getItem('favoriteMovie'))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

let carMode = true

function renderMovieList(data){
    let rawHTML = ''
    if (carMode) {
      data.forEach((item)=>{
          //title, image
          rawHTML +=`
          <div class="col-sm-3">
              <div class="mb-2">
                <div class="card">
                  <img
                    src="${POSTER_URL + item.image}"
                    class="card-img-top"
                    alt="Movie Poster"
                  />
                  <div class="card-body">
                    <h5 class="card-title">${item.title}</h5>
                  </div>
                  <div class="card-footer">
                    <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                    <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
                  </div>
                </div>
              </div>
            </div>
          `
      })
    } else {
      rawHTML += `<ul class="list-group col-12">`
      data.forEach((item) => {
        //title, image
        rawHTML += `
          <li class="list-group-item">
            <div class="movieList d-flex justify-content-between">
              <div class="listTitle">${item.title}</div>
              <div class="movieButton">
                <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
              </div>
            </div>
          </li>
        `
      })
      rawHTML += "</ul>"
    }
    //processing
    dataPanel.innerHTML = rawHTML
}

function showMovieModal(id){
    const modalTitle = document.querySelector('#movie-modal-title')
    const modalImage = document.querySelector('#movie-modal-image')
    const modalDate = document.querySelector('#movie-modal-date')
    const modalDescription = document.querySelector('#movie-modal-description')
    // console.log(modalTitle)
    axios.get(INDEX_URL+ id).then(response =>{
        //response.data.results
        const data = response.data.results
        // console.log(data)
        modalTitle.innerText = data.title
        modalDate.innerText = 'Release date : '+data.release_date
        modalDescription.innerText = data.description
        modalImage.innerHTML = `  <img src="${POSTER_URL+data.image}" alt="movie-poster" class="img-fluid">`

    })
    .catch((err) => console.log(err))
}

function removeFromFavorite(id){
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  movies.splice(movieIndex,1)
  localStorage.setItem('favoriteMovies',JSON.stringify(movies))
  renderMovieList(movies)
}

dataPanel.addEventListener('click', function onPanelClick(event){

    if (event.target.matches('.btn-show-movie')){
      // console.log(event.target.dataset)
      showMovieModal(Number(event.target.dataset.id))
      // console.log(Number(event.target.dataset.id))
    }else if(event.target.matches('.btn-remove-favorite')){
      removeFromFavorite(Number(event.target.dataset.id))
    }
})

switchBottom.addEventListener('click', function clickSwitch(event) {

  if (event.target.matches('.fa-th')) {
    carMode = true
    renderMovieList(movies)
  } else if (event.target.matches('.fa-bars')) {
    carMode = false
    renderMovieList(movies)
  }

})

/////匿名函式
// dataPanel.addEventListener('click', event => {
//     console.error('哈哈哈哈哈')   
// })

renderMovieList(movies)

// localStorage.setItem("Default_language","english")
// console.log(localStorage.getItem("Default_language"))
// localStorage.removeItem("Default_language")
// console.log(localStorage.getItem("Default_language"))