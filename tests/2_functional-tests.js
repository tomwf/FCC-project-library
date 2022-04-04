/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      test('Test POST /api/books with title', function(done) {
        const title = 'POST book with title'

        chai.request(server)
          .post('/api/books')
          .send({ title })
          .end((err, res) => {
            if (err) console.error(err)

            const { _id } = res.body

            assert.deepEqual(res.body, { _id, title })
            done();
          })
      });

      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end((err, res) => {
            if (err) console.error(err)

            assert.strictEqual(res.text, 'missing required field title')
            done()
          })
      });
    });


    suite('GET /api/books => array of books', function(){

      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end((err, res) => {
            if (err) console.error(err)

            const docs = res.body
            const doc = docs[docs.length - 1]

            assert.isArray(docs)
            assert.isObject(doc)
            assert.property(doc, '_id')
            assert.property(doc, 'title')
            assert.property(doc, 'comments')
            assert.property(doc, 'commentcount')
            done()
          })
      });
    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        const _id = '624b11df8d4ce5076615dd7a'

        // Search the book
        chai.request(server)
          .get(`/api/books/${_id}`)
          .end((err, res) => {
            if (err) console.error(err)

            assert.isEmpty(res.body)
            assert.strictEqual(res.text, 'no book exists')
            done();
          })
      });

      test('Test GET /api/books/[id] with valid id in db',  function(done){
        const title = 'GET book with valid id'

        // Create a book
        chai.request(server)
          .post('/api/books')
          .send({ title })
          .end((err, res) => {
            if (err) console.error(err)

            const { _id } = res.body

            // Search the book
            chai.request(server)
              .get(`/api/books/${_id}`)
              .end((err, res) => {
                if (err) console.error(err)

                const doc = res.body

                assert.isObject(doc, doc)
                assert.property(doc, '_id')
                assert.property(doc, 'title')
                assert.property(doc, 'comments')
                assert.property(doc, 'commentcount')
                done();
              })
          })
      });
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){

      test('Test POST /api/books/[id] with comment', function(done){
        const title = 'POST a comment'

        // Create a new book
        chai.request(server)
          .post('/api/books')
          .send({ title })
          .end((err, res) => {
            if (err) console.error(err)

            const { _id } = res.body
            const comment = 'This is a comment'
            
            // Add comment
            chai.request(server)
              .post(`/api/books/${_id}`)
              .send({ comment })
              .end((err, res) => {
                if (err) console.error(err)

                const doc = res.body

                assert.isObject(doc)
                assert.strictEqual(doc._id, _id)
                assert.strictEqual(doc.title, title)
                assert.include(doc.comments, comment)
                assert.strictEqual(doc.commentcount, 1)
                done();
              })
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        const title = 'POST without comment field'

        // Create a new book
        chai.request(server)
          .post('/api/books')
          .send({ title })
          .end((err, res) => {
            if (err) console.error(err)

            const { _id } = res.body

            chai.request(server)
              .post(`/api/books/${_id}`)
              .send({ _id })
              .end((err, res) => {
                if (err) console.error(err)

                assert.strictEqual(res.text, 'missing required field comment')
                done();
              })
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        const _id = 'aaaaaaaaaaaaaaaaaaaaaa'
        const comment = 'This is a comment'

        chai.request(server)
          .post(`/api/books/${_id}`)
          .send({ comment })
          .end((err, res) => {
            if (err) console.error(err)

            assert.strictEqual(res.text, 'no book exists')
            done();
          })
      });
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        const title = 'book 5'

        // Create a new book
        chai.request(server)
          .post('/api/books')
          .send({ title })
          .end((err, res) => {
            if (err) console.error(err)

            const { _id } = res.body

            // Delete book
            chai.request(server)
              .delete(`/api/books/${_id}`)
              .end((err, res) => {
                if (err) console.error(err)

                assert.strictEqual(res.text, 'delete successful')
                done()
              })
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        const _id = '624b11df8d4ce5076615dd7a'

        chai.request(server)
          .delete(`/api/books/${_id}`)
          .end((err, res) => {
            if (err) console.error(err)

            assert.strictEqual(res.text, 'no book exists')
            done()
          })
      });
    });

    suite('DELETE /api/books/ => delete all books', function() {
      test('DELETE /api/books/ => delete all books', function(done){
        chai.request(server)
          .delete('/api/books')
          .end((err, res) => {
            if (err) console.error(err)

            assert.strictEqual(res.text, 'complete delete successful')
            done()
          })
      })
    })
  });
});
