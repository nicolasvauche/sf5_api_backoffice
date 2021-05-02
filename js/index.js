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
  tableCellId.innerHTML = post.id
  tableRow.appendChild(tableCellId)

  const tableCellImage = document.createElement('td')
  const postImage = document.createElement('img')
  postImage.src = post.image
  postImage.alt = post.title
  tableCellImage.appendChild(postImage)
  tableRow.appendChild(tableCellImage)

  const tableCellTitle = document.createElement('td')
  tableCellTitle.innerHTML = post.title
  tableRow.appendChild(tableCellTitle)

  tablePosts.appendChild(tableRow)
}

document.addEventListener('DOMContentLoaded', () => {
  getApiAnswer()
})
