const Crawling = require('./Crawling')
const config = require('./config')

const crawling = new Crawling({
  urlString: config.urlString,
  urlDestString: config.urlDestString,
  cronMinute: config.cronMinute,
  intervalMillisec: config.intervalMillisec,
  retryTimes: config.retryTimes
})

crawling.jobStart()

