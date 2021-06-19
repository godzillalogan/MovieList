const BASE_URL =  'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSTER_URL = BASE_URL +'/posters/'
const MOVIES_PER_PAGE = 12

const movies=[]
let filteredMovies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const switchBottom = document.querySelector('#switchBottom')
const paginator = document.querySelector('#paginator')


let currentPage = 1
let carMode = true



//carMode=true,card模式，card=false,list模式
function renderMovieList(data){
    let rawHTML = ''
    if(carMode){
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
                  <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                </div>
              </div>
            </div>
          </div>
        `
    })
    }else{
      rawHTML += `<ul class="list-group col-12">`
       data.forEach((item)=>{
        //title, image
        rawHTML +=`
          <li class="list-group-item">
            <div class="movieList row justify-content-between">
              <div class="listTitle">${item.title}</div>
              <div class="movieButton">
                <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
              </div>
            </div>
          </li>
        `
    })
    rawHTML +="</ul>"
    }
    //processing
    dataPanel.innerHTML = rawHTML
}


function renderPaginator(amount){
  // 80部電影/1頁12部 = 6頁...8部 //所以總共要7頁

  //Math.ceil 無條件進位
  const numberOfPages = Math.ceil(amount/MOVIES_PER_PAGE)

  let rawHTML =''

  for(let page=1 ; page <= numberOfPages ; page++){
    rawHTML +=`
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}


function getMoviesByPage(page){
  //如果filteredMovies.length大於零，選擇filteredMovies，否則選擇movies
  const data=filteredMovies.length? filteredMovies : movies
  //page 1-> movies 0-11
  //page 2-> movies 12-23
  //page 3-> movies 24-35
  //...
  const startIndex = (page-1) *MOVIES_PER_PAGE
  return data.slice(startIndex,startIndex+MOVIES_PER_PAGE)
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

function addToFavorite(id){

  // function isMovieIDMatched(movie){
  //   return movie.id === id
  // }
  //我想要loclaStorage.getItem,如果沒有的話，就給我空陣列
  const list = JSON.parse(localStorage.getItem('favoriteMovie')) || []
  //find和filter很像，後面都放一個函式
  const movie = movies.find(movie => movie.id === id)
  //some()和find(),有點像，find()是回傳元素本身,some()是要知道list裡面到底有沒有movie，有的話true，沒有的話false
  if (list.some((movie) => movie.id ===id)){
    return alert("此電影已經在收藏清單中")
  }

  list.push(movie)
  //JSON.parse  ,將JSON轉為JS資料
  //JSON.stringify  ,將JS資料轉為JSON
  // let jsonString = JSON.stringify(list)

  localStorage.setItem('favoriteMovie',JSON.stringify(list))
  // console.log('jsonParse : ',JSON.parse(jsonString))
  // console.log('jsonString : ',jsonString)
}


switchBottom.addEventListener('click', function clickSwitch(event){
  
   if(event.target.matches('.fa-th')){
     carMode = true
     renderMovieList(getMoviesByPage(currentPage))
   }else if(event.target.matches('.fa-bars')){
     carMode = false
     renderMovieList(getMoviesByPage(currentPage))
   }
     
})




dataPanel.addEventListener('click', function onPanelClick(event){

    if (event.target.matches('.btn-show-movie')){
        // console.log(event.target.dataset)
        showMovieModal(Number(event.target.dataset.id))
        // console.log(Number(event.target.dataset.id))
    }else if(event.target.matches('.btn-add-favorite')){
      addToFavorite(Number(event.target.dataset.id))
    }
})

searchForm.addEventListener('submit',function onSearchFormSubmiited(event){
    //取消預設效果
    event.preventDefault()
    //toLowerCase()變小寫，trim()去掉前後空白
    const keyword = searchInput.value.trim().toLowerCase()

    if (!keyword.length){
      return alert('Please enter valid string')
    }
		//filter方法
		filteredMovies= movies.filter((movie) => 
			movie.title.toLowerCase().includes(keyword)
		)

		if(filteredMovies.length === 0){
			return alert ('Cannot find movie with keyword : '+ keyword)
		}


		///////filter示範
		// const number = [1,2,3,4,5]

		// function islessThan(number){
		// 	return number < 3
		// }
		// console.log(numbers.filter(islessThan3))   [1,2]
		// console.log(number.filter(number =>number < 3))
		// console.log(number.filter(number =>{ [1,2]
		// 	return number < 3
		// }))
    ///////filter示範

		////迴圈方法
    // for(const movie of movies)
		// 	//如果keyword 有包含在movie裡
    // 	if(movie.title.toLowerCase().includes(keyword)){
		// 		filteredMovies.push(movie)
		// 	}
    //重製分頁器
    renderPaginator(filteredMovies.length)  //新增這裡
		renderMovieList(getMoviesByPage(1))
})





/////匿名函式
// dataPanel.addEventListener('click', event => {
//     console.error('哈哈哈哈哈')   
// })

paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
  
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderMovieList(getMoviesByPage(page))
  currentPage = page
})



axios
    .get(INDEX_URL)
    .then((response) =>{
        //array(80)
        // for(const movie of response.data.results){
        //     movies.push(movie)
        // }
        movies.push(...response.data.results)
        renderPaginator(movies.length)
        renderMovieList(getMoviesByPage(currentPage))
    })
    .catch((err) => console.log(err))

// localStorage.setItem("Default_language","english")
// console.log(localStorage.getItem("Default_language"))
// localStorage.removeItem("Default_language")
// console.log(localStorage.getItem("Default_language"))