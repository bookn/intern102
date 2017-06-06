const dummyCorrectUrl = { url: 'http://plearn.io' }
const dummyWrongUrl = { url: 'http://plearn.io/nothing' }
const dummyErrorUrl = { url: '' }


describe('/POST crawling', () => {
  it('it should POST url and show succesful to get the url', (done) => {
    chai.request(server)
      .post('/crawling')
      .send(dummyCorrectUrl)
      .end((err, res) => {
        res.should.have.status(200)
        res.text.should.equal('Success status code : 200')
        done()
      })
  }).timeout(20000)
  it('it should POST url but show unsuccesful to get the url', (done) => {
    chai.request(server)
      .post('/crawling')
      .send(dummyWrongUrl)
      .end((err, res) => {
        res.should.have.status(200)
        res.text.should.not.equal('Success status code : 200')
        done()
      })
  }).timeout(20000)
  it('it should POST url but show unsuccesful to get the url', (done) => {
    chai.request(server)
      .post('/crawling')
      .send(dummyErrorUrl)
      .end((err, res) => {
        res.should.have.status(200)
        res.text.should.not.equal('Success status code : 200')
        done()
      })
  }).timeout(20000)
})
