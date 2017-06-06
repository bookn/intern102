const Crawling = require('./Crawling')
const config = require('./config')

const crawling = new Crawling({
  urlString: config.urlString, urlDestString: config.urlDestString
})

crawling.jobStart()

