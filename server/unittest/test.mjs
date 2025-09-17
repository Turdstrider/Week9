import { expect } from 'chai';
import request from 'supertest';


// Import the server (make sure your server exports `app` and `httpServer`)
import { app, httpServer } from '../server.js';
import {connectDB,getDB,health,db} from '../db.js'; 

describe('Server Integration Tests', function () {
  // Close server after tests
  after(function (done) {
    httpServer.close(done);
  });

  describe('Basic health check', function () {
    it('should respond with {ok:true} on GET /', async function () {
      const res = await request(app).get('/');
      expect(res.status).to.equal(200);
      expect(res.body).to.deep.equal({ ok: true });
    });
  });

  describe('Database connectivity', function () {
   

    it('should connect to Mongo and return health OK', async function () {
      const conn = await connectDB();  // actual DB connect
      expect(conn).to.be.an('object'); // should return a MongoClient or Db instance

      const status = await health();   // actual health check
      expect(status).to.be.ok;         // adjust depending on what `health()` returns
    });
  });

  // Example placeholder for product routes
  describe('Product routes', function () {
    it('GET /api/getProdlist should return array of products ', async function () {
      // If your getProductList attaches /products route, test it:
      const res = await request(app).get('/api/getProdlist');
      expect(res.status).to.be.oneOf([200]); // adjust depending on db state
      expect(res.body).to.be.an('array');

      res.body.forEach(product=>{
        expect(product).to.be.an('object');
        expect(product).to.have.property('_id');
        expect(product).to.have.property('name');
        expect(product).to.have.property('price');
        expect(product._id).to.be.a('string');
        expect(product.name).to.be.a('string');
        expect(product.price).to.be.a('number');
      })
    });
  });
});
