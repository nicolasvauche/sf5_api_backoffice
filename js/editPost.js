const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const postId = urlParams.get('postid')

const token = '$2y$13$0JuJiCliJMS6PisdZSavqOfEwJIPAgOfZfiUft.D64/fdOKyv.4gm'
const urlCheck = 'http://localhost:8000/admin/post/' + postId
const urlEdit = 'http://localhost:8000/admin/post/edit/' + postId

const formElement = document.getElementById('postEdit')
const submitElement = document.getElementById('formSubmit')
const formInputs = document.querySelectorAll(
  '#postEdit input, #postEdit textarea'
)

const editPost = () => {
  formElement.action = urlEdit
  formElement.addEventListener('submit', event => {
    event.preventDefault()

    let hasError = false
    formInputs.forEach(input => {
      if (!validateInput(input)) {
        hasError = true
      }
    })

    if (!hasError) {
      window
        .fetch(urlEdit, {
          method: 'POST',
          headers: {
            'X-AUTH-TOKEN': token
          },
          body: new FormData(formElement)
        })
        .then(response => {
          if (!response.ok) {
            console.log(response)
            showError(response)
          } else {
            response.json().then(response => {
              window.location.href = 'index.html'
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

const validateInput = input => {
  let errorElt = document.getElementById(input.id + 'error')
  if (errorElt !== null) {
    errorElt.remove()
  }

  if (input.value.length > 0 && input.value.length < 3) {
    input.classList.add('error')
    errorElt = document.createElement('p')
    errorElt.id = input.id + 'error'
    errorElt.classList.add('error')
    errorElt.innerHTML = 'Veuillez saisir quelque chose de plus long svp'

    input.parentElement.appendChild(errorElt)

    submitElement.classList.add('disabled')

    return false
  } else {
    input.classList.remove('error')
  }
  return true
}

const initPost = post => {
  const inputTitle = document.getElementById('inputTitle')
  inputTitle.value = post.title

  const inputContent = document.getElementById('inputContent')
  inputContent.value = post.content
}

document.addEventListener('DOMContentLoaded', () => {
  formInputs.forEach(input => {
    input.addEventListener('keyup', () => {
      validateInput(input)
      let hasError = false
      formInputs.forEach(input => {
        if (!validateInput(input)) {
          hasError = true
        }
      })
      if (!hasError) {
        submitElement.classList.remove('disabled')
      }
    })
  })

  window
    .fetch(urlCheck, {
      headers: {
        'X-AUTH-TOKEN': token
      }
    })
    .then(response => {
      if (!response.ok) {
        showError(response)
      } else {
        response.json().then(response => {
          initPost(response)
          editPost(response)
        })
      }
    })
    .catch(error => {
      console.log(error)
      showError({
        status: 404,
        statusText: 'No server found'
      })
      window.location.href = 'index.html'
    })
})
