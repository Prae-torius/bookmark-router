const express = require('express')
const logger = require('../logger')
const xss = require('xss')
const bookmarkRouter = express.Router()
const jsonParser = express.json()
const BookmarksService = require('./bookmarks-service')

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: xss(bookmark.url),
  description: xss(bookmark.description),
  rating: bookmark.rating,
})

bookmarkRouter
  .route('/bookmarks')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getAllBookmarks(knexInstance)
      .then(bookmarks => {
        res.json(bookmarks.map(bookmark => serializeBookmark(bookmark)
        ))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res) => {
    const { title, url, description, rating } = req.body;
    const newBookmark = { title, url, description, rating }
    
    for(const [key, value] of Object.entries(newBookmark)) {
      if (value == null) {
        return res
          .status(400)
          .json({
            error: { message: `Missing '${key}' in the request body` }
          })
      }
    }

    if(newBookmark.rating === 0 || newBookmark.rating > 5) {
      return res
        .status(400)
        .json({
          error: { message: `Rating was: '${newBookmark.rating}'. Rating needs to be a value between 1 and 5` }
        })
    }
    
    BookmarksService.insertBookmark(
      req.app.get('db'),
      newBookmark
    )
      .then(bookmark => {
        res
          .status(201)
          .location(`/bookmarks/${bookmark.id}`)
          .json(serializeBookmark(bookmark))
      })
  })

bookmarkRouter
  .route('/bookmarks/:bookmark_id')
  .all((req, res, next) => {
    BookmarksService.getById(
      req.app.get('db'), 
      req.params.bookmark_id)
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({ 
            error: { message: `Bookmark doesn't exist` } 
          })
        }
        res.bookmark = bookmark
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeBookmark(res.bookmark))
  })
  .delete((req, res, next) => {
    BookmarksService.deleteBookmark(
      req.app.get('db'),
      req.params.bookmark_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

  module.exports = bookmarkRouter