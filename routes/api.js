/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';
const mongoose = require('mongoose')
const { Schema } = mongoose
const MONGO_URI = process.env.MONGO_URI

module.exports = function (app) {

  const bookSchema = new Schema({
    title: String,
    comments: Array,
    commentcount: {
      type: Number,
      default: 0
    }
  })
  const Book = mongoose.model('Book', bookSchema)

  mongoose.connect(MONGO_URI)

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      Book.find((err, doc) => {
        if (err) console.error(err)

        res.json(doc)
      })
    })

    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      // Error handling
      if (!title) return res.send('missing required field title')

      const book = new Book({
        title
      })

      book.save((err, doc) => {
        if (err) console.error(err)

        const { _id, title } = doc
        res.json({
          _id,
          title
        })
      })
    })

    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      Book.deleteMany((err, doc) => {
        if (err) console.error(err)

        res.send('complete delete successful')
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.findById(bookid, (err, doc) => {
        if (err || !doc) return res.send('no book exists')

        res.json(doc)
      })
    })

    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;

      // Error handling
      if (!comment) return res.send('missing required field comment')

      //json res format same as .get
      Book.findById(bookid, (err, doc) => {
        if (err || !doc) return res.send('no book exists')

        doc.comments.push(comment)
        doc.commentcount++

        doc.save((err, doc) => {
          if (err) console.error(err)

          res.json(doc)
        })
      })
    })

    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      Book.findByIdAndDelete(bookid, (err, doc) => {
        if (err || !doc) return res.send('no book exists')

        res.send('delete successful')
      })
    });
};
