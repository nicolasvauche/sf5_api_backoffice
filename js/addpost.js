const token = '$2y$13$0JuJiCliJMS6PisdZSavqOfEwJIPAgOfZfiUft.D64/fdOKyv.4gm'
const url = 'http://localhost:8000/admin/post/add'

const formInputs = document.querySelectorAll(
  '#postAdd input, #postAdd textarea'
)

const addPost = () => {
  const formElement = document.getElementById('postAdd')
  formElement.action = url
  formElement.addEventListener('submit', event => {
    event.preventDefault()

    let hasError = false
    formInputs.forEach(input => {
      if (!validateInput(input)) {
        hasError = true
      }
    })

    if (!hasError) {
      const postData = {
        title: formInputs[0].value,
        content: formInputs[1].value
      }
      console.log(postData)

      window
        .fetch(url, {
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

  mainElt.innerHTML = ''
  mainElt.appendChild(errorElt)
}

const validateInput = input => {
  let errorElt = document.getElementById(input.id + 'error')
  if (errorElt !== null) {
    errorElt.remove()
  }

  if (input.required) {
    if (input.value.length > 0 && input.value.length < 3) {
      input.classList.add('error')
      errorElt = document.createElement('p')
      errorElt.id = input.id + 'error'
      errorElt.classList.add('error')
      errorElt.innerHTML = 'Veuillez saisir quelque chose de plus long svp'

      input.parentElement.appendChild(errorElt)

      return false
    } else {
      input.classList.remove('error')
    }
  } else {
    if (input.value.length > 0 && input.value.length < 3) {
      input.classList.add('error')
      errorElt = document.createElement('p')
      errorElt.id = input.id + 'error'
      errorElt.classList.add('error')
      errorElt.innerHTML = 'Veuillez saisir quelque chose de plus long svp'

      input.parentElement.appendChild(errorElt)

      return false
    } else {
      input.classList.remove('error')
    }
  }
  return true
}

document.addEventListener('DOMContentLoaded', () => {
  formInputs.forEach(input => {
    input.addEventListener('keyup', () => {
      validateInput(input)
    })
  })

  addPost()
})
