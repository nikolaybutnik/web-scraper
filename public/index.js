const getDataBtn = document.getElementById('get-data-btn')
const responseField = document.getElementById('response-field')
const timerField = document.getElementById('timer-field')
const urlInputForm = document.getElementById('url-input-form')

getDataBtn.addEventListener('click', async () => {
  responseField.textContent = ''
  const timerStart = performance.now()
  timerField.textContent = 'Fetching data...'
  await fetch('/data')
    .then((res) => res.json())
    .then((data) => {
      console.log(data.data)
      data.data.map((el) => {
        const card = document.createElement('div')
        const title = document.createElement('h3')
        const link = document.createElement('a')
        const content = document.createElement('p')

        title.textContent = el.title
        link.textContent = el.articleLink
        link.href = el.articleLink
        link.target = '_blank'
        content.textContent = el.articleContent
          ? el.articleContent
          : 'Content is not available'

        card.append(title, link, content)
        responseField.appendChild(card)
      })
    })
  const timerEnd = performance.now()
  timerField.textContent = `The operation took ${(
    (timerEnd - timerStart) /
    1000
  ).toFixed(1)} seconds to complete`
  console.log(timerEnd - timerStart)
})

urlInputForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const userInputUrl = document.getElementsByName('url')[0].value
  const options = {
    indent: 'auto',
    'indent-spaces': 2,
    wrap: 80,
    markup: true,
    'output-xml': false,
    'numeric-entities': true,
    'quote-marks': true,
    'quote-nbsp': false,
    'show-body-only': true,
    'quote-ampersand': false,
    'break-before-br': true,
    'uppercase-tags': false,
    'uppercase-attributes': false,
    'drop-font-tags': true,
    'tidy-mark': false,
  }
  fetch(`data/${userInputUrl}`)
    .then((res) => res.json())
    .then((data) => {
      const returnedData = tidy_html5(data.data, options)
      // Data is first inserted into <pre></pre> tag to format it before processing
      console.log(returnedData)
      responseField.innerText = returnedData
      // Highlight HTML tags
      const pattern1 = /&lt;(?!!)\w*\/?\w*(&gt;)?/gi
      const pattern2 = /(?<=")&gt;/gi
      const pattern3 = /\/&gt;/gi
      const result = responseField.innerHTML
        .replace(pattern1, '<strong>$&</strong>')
        .replace(pattern2, '<strong>$&</strong>')
        .replace(pattern3, '<strong>$&</strong>')
      responseField.innerHTML = result
    })
})
