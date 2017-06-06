const chai = require('chai')
const chaiHttp = require('chai-http')

// const dirtyChai = require('dirty-chai')

process.env.NODE_ENV = 'test'
// chai.use(dirtyChai)
chai.use(chaiHttp)
global.chai = chai
global.expect = chai.expect
global.should = chai.should()
