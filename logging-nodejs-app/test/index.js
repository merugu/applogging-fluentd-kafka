const chai = require('chai'),
  chaiHttp = require('chai-http'),
  server = require('../app'),
  faker = require('faker'),
  should = chai.should();

chai.use(chaiHttp);

describe('Init', function () {

  it('check app status', function (done) {
    chai.request(server).get('/').end((err, res) => {
      should.not.exist(err);
      res.should.have.status(200);
      done();
    })
  });

});

// Test a get route...

describe('/Get API test', function () {

  it('Check the api without user id parameter', function (done) {
    chai.request(server).get('/post-list').end((err, res) => {
      should.not.exist(err);
      res.should.have.status(401);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.should.have.property('message').eql('User Id parameter is missing');
      done();
    })
  });

  it('Check the api with user id. Success', function (done) {
    chai.request(server).get('/post-list?user_id=1').end((err, res) => {
      should.not.exist(err);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('userId');
      res.body.should.have.property('title');
      res.body.should.have.property('body');
      done();
    })
  });

});


describe('/POST API test', function () {

  it('Check the api without parameters . failure case', function (done) {
    chai.request(server).post('/submit-data').send({}).end((err, res) => {
      should.not.exist(err);
      res.should.have.status(401);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.should.have.property('message').eql('Mandatory params are missing!');
      done();
    })
  });

  it('Check the API with valid parameters. Success', function (done) {
    chai.request(server).post('/submit-data').send({
      name: faker.name.firstName(),
      email: faker.internet.email()
    }).end((err, res) => {
      should.not.exist(err);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('message');
      res.body.should.have.property('message').eql('data saved successfully');
      done();
    })
  });

});
