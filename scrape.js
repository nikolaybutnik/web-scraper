import cheerio from 'cheerio'
import axios from 'axios'

const base = 'http://jamesqquick.com'

const getArticleContent = async (link) => {
  if (link !== "http://jamesqquick.com/talks/that's-my-jamstack-11-19") {
    const { data } = await axios.get(link)
    const $ = cheerio.load(data)
    return $('.section').children().text()
  } else return null
}

axios
  .get(`${base}/talks`)
  .then(async (res) => {
    const talks = []
    const $ = cheerio.load(res.data)

    $('.card').each(async (index, element) => {
      const title = $(element).children().eq(1).children('h3').text()
      const link = base + $(element).attr('href')
      const articleContent = await getArticleContent(link)
      const newItem = { title, link, articleContent }
      // console.log(newItem)
      talks[index] = newItem
    })

    return talks
  })
  .then((data) => console.log(data))
