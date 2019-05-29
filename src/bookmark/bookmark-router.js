const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

const bookmarks = [{
  id: 1,
  title: 'Bookmark 1',
  url: 'blank',
  rating: 1
}]

bookmarkRouter
  .route('/bookmark')
  .get((req, res) => {
    res
    .json(bookmarks)
  })
  .post(bodyParser, (req, res) => {
    const { url, title, rating } = req.body;
    
      if (!url) {
        logger.error('URL is required');
        return res
          .status(400)
          .send('Invalid data')
      }
    
      if (!title) {
        logger.error('Title is required');
        return res
          .status(400)
          .send('Invalid data')
      }
    
      if (!rating) {
        logger.error('Rating is required');
        return res
          .status(400)
          .send('Invalid data')
      }
    
      const id = uuid();
    
      const bookmark = {
        id,
        title,
        url,
        rating
      }
    
      bookmarks.push(bookmark)
    
      logger.info(`Bookmark with id ${id} created`)
    
      res
        .status(201)
        .location(`http://localhost8000/card/${id}`)
        .json(bookmark)
  })

bookmarkRouter
  .route('/bookmark/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id)

  if (!bookmark) {
    logger.error(`Bookmark with id ${id} not found.`)
    return res
      .status(404)
      .send('Bookmark Not Found')
  }

  res.json(bookmark)
  })
  .delete((req, res) => {
    const { id } = req.params;

  const bookmarkIndex = bookmarks.findIndex(b => b.id == id)

  if (bookmarkIndex === -1) {
    logger.error(`Bookmark with id ${id} not found.`)
    return res
      .status(404)
      .send('Not found')
  }

  bookmarks.splice(bookmarkIndex, 1)
  
  logger.info(`Bookmark with id ${id}, index ${bookmarkIndex} deleted.`)

  res
    .status(204)
    .end()
  })

  module.exports = bookmarkRouter