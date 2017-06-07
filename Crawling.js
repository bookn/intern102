const cron = require('cron')
const http = require('http')
const url = require('url')
const async = require('async')

class Crawling {
  constructor({ urlString, urlDestString, cronMinute, intervalMillisec, retryTimes }) {
    this.urlString = urlString
    this.urlDestString = urlDestString
    this.cronMinute = cronMinute
    this.intervalMillisec = intervalMillisec
    this.retryTimes = retryTimes
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
    async.retry({ times: this.retryTimes, interval: this.intervalMillisec }, (callback) => {
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
          if (resDest.statusCode === 200) {
            this.completeDestination = true
            console.log(`Change destination to ${this.urlDestString} success !`)
          }
          else {
            this.completeDestination = false
            console.log(`Cannot change destination to ${this.urlDestString} !`)
          }
        })
        reqDest.on('error', () => {
          this.completeDestination = false
          console.log(`Error, cannot change destination to ${this.urlDestString} !`)
        })
        console.log(err.messege)
        this.error = err.messege
        reqDest.end()
      } else {
        console.log(result)
        this.result = result.messege
      }
    })
  }
  createJob(callback) {
    this.job = new cron.CronJob({
      cronTime: `0 */${this.cronMinute} * * * *`,
      onTick: () => {
        this.scrape(this.urlString, this.urlDestString)
      },
      start: false,
      timeZone: 'Asia/Bangkok'
    })
    if (callback) callback()
  }
  jobStart() {
    this.job.start()
  }
  jobStop() {
    this.job.stop()
  }
}
module.exports = Crawling
