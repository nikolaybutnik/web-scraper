import cheerio from 'cheerio'
import axios from 'axios'

const baseUrl = 'http://jamesqquick.com'

const getArticleContent = async (link) => {
  if (link !== "http://jamesqquick.com/talks/that's-my-jamstack-11-19") {
    const { data } = await axios.get(link)
    const $ = cheerio.load(data)
    return $('.section').children().text()
  } else return null
}

axios.get(`${baseUrl}/talks`).then(async (res) => {
  const talks = []
  const $ = cheerio.load(res.data)

  const result = $('.card').toArray()

  for (let i = 0; i < result.length; i++) {
    const title = $(result[i]).children().eq(1).children('h3').text()
    const articleLink = baseUrl + $(result[i]).attr('href')
    const articleContent = await getArticleContent(articleLink)
    talks[i] = { title, articleLink, articleContent }
  }

  console.log(talks)
})
