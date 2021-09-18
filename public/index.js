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
      // const returnedData = tidy_html5(data.data, options)
      // Data is first inserted into page to format it before processing
      responseField.innerText = data.data

      const htmlTagPattern1 = /&lt;(?!!)\w*\/?\w*(&gt;)?/gi
      const htmlTagPattern2 = /(?<=")&gt;/gi
      const htmlTagPattern3 = /\/&gt;/gi

      const classPattern =
        /(?!class="custom-html-tag")class=(["'])(?:(?=(\\?))\2.)*?\1/gi

      const idPattern = /(?<!data-)id=(["'])(?:(?=(\\?))\2.)*?\1/gi

      responseField.innerHTML = responseField.innerHTML
        .replace(htmlTagPattern1, '<span class="custom-html-tag">$&</span>')
        .replace(htmlTagPattern2, '<span class="custom-html-tag">$&</span>')
        .replace(htmlTagPattern3, '<span class="custom-html-tag">$&</span>')
        .replace(classPattern, '<span class="custom-class-name">$&</span>')
        .replace(idPattern, '<span class="custom-id-name">$&</span>')
    })
})

// Instead of wraping the html elements in a div, consder inserting a class right into the tags???
