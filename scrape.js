const axios = require('axios')
const cheerio = require('cheerio')

const base = 'http://jamesqquick.com'

axios.get(`${base}/talks`).then((res) => {
  const talks = []
  const $ = cheerio.load(res.data)

  $('.card').each((index, element) => {
    const title = $(element).children().eq(1).children('h3').text()
    const link = base + $(element).attr('href')
    talks[index] = { title, link }
  })
  console.log(talks)
})
