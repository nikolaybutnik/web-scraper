const getDataBtn = document.getElementById('get-data-btn')
const responseField = document.getElementById('response-field')

getDataBtn.addEventListener('click', () => {
  fetch('/data')
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
})
