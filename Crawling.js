const cron = require('cron')
const http = require('http')
const url = require('url')
const async = require('async')

const config = require('./config')

const INTERVAL = 1000
const RETRY = 3

class Crawling {
  constructor({ urlString, urlDestString }) {
    this.urlString = urlString
    this.urlDestString = urlDestString
  }
  getOpts(strUrl) {
    const parsedurl = url.parse(strUrl)
    const options = {
      host: parsedurl.hostname,
      port: (parsedurl.port || 80),
      path: parsedurl.path,
      method: 'GET',
      headers: {}
    }
    return options
  }
  scrape() {
    async.retry({ times: RETRY, interval: INTERVAL }, (callback) => {
      const options = this.getOpts(this.urlString)
      const req = http.request(options, (res) => {
        if (res.statusCode === 200) {
          callback(null, { messege: 'Success - status code : 200' })
        } else {
          console.log(`Get status code ${res.statusCode}, retry`)
          callback({ messege: `Unsuccess - status code : ${res.statusCode}` }, null)
        }
      })
      req.on('error', () => {
        console.log('Request error, retry')
        callback({ messege: 'Request error' }, null)
      })
      req.end()
    }, (err, result) => {
      if (err) {
        const options = this.getOpts(this.urlDestString)
        const reqDest = http.request(options, (resDest) => {
          if (resDest.statusCode === 200) console.log(`Change destination to ${this.urlDestString} success !`)
          else console.log(`Cannot change destination to ${this.urlDestString} !`)
        })
        reqDest.on('error', () => {
          console.log('Cannot connect to destination')
        })
        console.log(err.messege)
        reqDest.end()
      } else {
        console.log(result)
      }
    })
  }
  jobStart() {
    const job = new cron.CronJob({
      cronTime: `0 */${config.cronMinute} * * * *`,
      onTick: () => {
        this.scrape(this.urlString, this.urlDestString)
      },
      start: false,
      timeZone: 'Asia/Bangkok'
    })
    job.start()
  }
}
module.exports = Crawling
