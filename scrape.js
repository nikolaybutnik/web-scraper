import cheerio from 'cheerio'
import axios from 'axios'
import express from 'express'
import path from 'path'
import { minify } from 'html-minifier'

const __dirname = path.resolve()
const app = express()
app.use(express.json())
app.use(express.static('public'))
const PORT = process.env.PORT || 3001

const baseUrl = 'http://jamesqquick.com'

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
})

app.get('/data', async (req, res) => {
  const getArticleContent = async (link) => {
    if (link !== "http://jamesqquick.com/talks/that's-my-jamstack-11-19") {
      const { data } = await axios.get(link)
      const $ = cheerio.load(data)
      return $('.section').children().text()
    } else return null
  }
  const data = await axios.get(`${baseUrl}/talks`).then(async (res) => {
    const talks = []
    const $ = cheerio.load(res.data)
    const result = $('.card').toArray()

    for (let i = 0; i < result.length; i++) {
      const title = $(result[i]).children().eq(1).children('h3').text()
      const articleLink = baseUrl + $(result[i]).attr('href')
      const articleContent = await getArticleContent(articleLink)
      talks[i] = { title, articleLink, articleContent }
    }
    return talks
  })
  res.send({ data: data })
})

app.get('/data/:url', async (req, res) => {
  const data = await axios.get(`https://${req.params.url}`).then((res) => {
    const $ = cheerio.load(res.data)
    $('noscript').remove()
    $('script').remove()
    $('br').remove()
    return $('body').html()
  })
  res.send({
    data: minify(data, {
      collapseWhitespace: true,
      removeComments: true,
    }),
  })
})

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`)
})
