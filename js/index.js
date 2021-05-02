const token = '$2y$13$0JuJiCliJMS6PisdZSavqOfEwJIPAgOfZfiUft.D64/fdOKyv.4gm'
const url = 'http://localhost:8000/admin'

const getApiAnswer = () => {
  window
    .fetch(url, {
      headers: {
        'X-AUTH-TOKEN': token
      }
    })
    .then(response => {
      if (!response.ok) {
        showError(response)
      } else {
        response.json().then(response => {
          showAnswer(response)
        })
      }
    })
    .catch(error => {
      console.log(error)
      showError({
        status: 404,
        statusText: 'No server found'
      })
    })
}

const showError = error => {
  const headerElt = document.querySelector('html > body > header')
  const mainElt = document.querySelector('html > body > main')

  const errorElt = document.createElement('p')
  errorElt.classList.add('error')

  switch (error.status) {
    case 404:
    case 403:
    case 401:
      errorElt.innerHTML = 'Ooops…<br />' + error.statusText
      break
    default:
      errorElt.innerHTML = error
      break
  }

  headerElt.innerHTML =
    '<h1><a href="index.html" class="navbar-brand">SF5 API Backoffice</a></h1>'

  mainElt.innerHTML = ''
  mainElt.appendChild(errorElt)
}

const showAnswer = data => {
  for (let i = 0; i < data.length; i++) {
    buildPost(data[i])
  }
}

const buildPost = post => {
  const tablePosts = document.querySelector('#posts > table > tbody')

  const tableRow = document.createElement('tr')

  const tableCellId = document.createElement('td')
  tableCellId.classList.add('text-end')
  tableCellId.innerHTML = post.id
  tableRow.appendChild(tableCellId)

  const tableCellImage = document.createElement('td')
  tableCellImage.classList.add('text-center')
  const postImage = document.createElement('img')
  postImage.src = post.image
  postImage.alt = post.title
  tableCellImage.appendChild(postImage)
  tableRow.appendChild(tableCellImage)

  const tableCellTitle = document.createElement('td')
  tableCellTitle.innerHTML = post.title
  tableRow.appendChild(tableCellTitle)

  const tableCellActions = document.createElement('td')
  tableCellActions.classList.add('text-center')
  const postBtnEdit = document.createElement('a')
  postBtnEdit.href = 'editPost.html?postId=' + post.id
  postBtnEdit.classList.add('btn')
  postBtnEdit.classList.add('btn-secondary')
  postBtnEdit.classList.add('btn-sm')
  postBtnEdit.classList.add('me-2')
  postBtnEdit.innerHTML = '<i class="fas fa-edit"></i>'
  postBtnEdit.title = 'Modifier cet article'
  tableCellActions.appendChild(postBtnEdit)

  const postBtnDelete = document.createElement('button')
  postBtnDelete.dataset.postid = post.id
  postBtnDelete.classList.add('btn')
  postBtnDelete.classList.add('btn-danger')
  postBtnDelete.classList.add('btn-sm')
  postBtnDelete.innerHTML = '<i class="fas fa-trash"></i>'
  postBtnDelete.title = 'Supprimer cet article'
  postBtnDelete.addEventListener('click', event => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      deletePost(event.target)
    }
  })
  tableCellActions.appendChild(postBtnDelete)
  tableRow.appendChild(tableCellActions)

  tablePosts.appendChild(tableRow)
}

const deletePost = post => {
  console.log('Delete post #' + post.dataset.postid)
}

document.addEventListener('DOMContentLoaded', () => {
  getApiAnswer()
})
