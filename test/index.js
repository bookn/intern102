const Crawling = require('../Crawling')

describe('/class Crawling ', () => {
  it('should return success if url avialable', (done) => {
    const crawling = new Crawling({
      urlString: 'http://plearn.io',
      urlDestString: 'http://plearn.io',
      cronMinute: 1,
      intervalMillisec: 1000,
      retryTimes: 1,
    })
    crawling.createJob()
    crawling.jobStart()
    const timer = setInterval(() => {
      expect(crawling.result).to.equal('Success - status code : 200')
      crawling.jobStop()
      clearInterval(timer)
      done()
    }, 70000)
  }).timeout(80000)
  it('should return unsuccess if url unavialable and change destination', (done) => {
    const crawling = new Crawling({
      urlString: 'http://plearn.io/cantaccess',
      urlDestString: 'http://plearn.io',
      cronMinute: 1,
      intervalMillisec: 1000,
      retryTimes: 1
    })
    crawling.createJob()
    crawling.jobStart()
    const timer = setInterval(() => {
      expect(crawling.error).to.equal('Unsuccess - status code : 404')
      expect(crawling.completeDestination).to.equal(true)
      crawling.jobStop()
      clearInterval(timer)
      done()
    }, 70000)
  }).timeout(80000)
  it('should warning when could not access to url destination', (done) => {
    const crawling = new Crawling({
      urlString: 'http://plearn.io/cantaccess',
      urlDestString: 'http://plearn.io/cantaccesstwo',
      cronMinute: 1
    })
    crawling.createJob()
    crawling.jobStart()
    const timer = setInterval(() => {
      expect(crawling.error).to.equal('Unsuccess - status code : 404')
      expect(crawling.completeDestination).to.equal(false)
      crawling.jobStop()
      clearInterval(timer)
      done()
    }, 70000)
  }).timeout(80000)
})
