const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')

const bookmarkRouter = express.Router()
const bodyParser = express.json()
const BookmarksService = require('./bookmarks-service')

bookmarkRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks.map(bookmark => ({
          id: bookmark.id,
          title: bookmark.title,
          url: bookmark.url,
          description: bookmark.description,
          rating: bookmark.rating
        })))
      })
      .catch(next)
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
  .route('/bookmarks/:bookmark_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getById(knexInstance, req.params.bookmark_id)
      .then(bookmark => {
        res.json(bookmark)
      })
      .catch(next)
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