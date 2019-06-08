const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray } = require('./bookmars.fixtures')

describe.only('Bookmarks Endpoints', function() {
  let db

  before('make knex instantce', () => {
    db = knex ({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('bookmarks').truncate())

  afterEach('clean up', () => db('bookmarks').truncate())

  describe(`GET /bookmarks`, () => {
    context(`Given no bookmarks`, () => {
      it(`responds with 200 and with no bookmarks`, () => {
        return supertest(app)
        .get('/bookmarks')
        .expect(200, [])
      })

    context(`Given there are bookmarks in the db`, () => {
      const testBookmarks = makeBookmarksArray()
    
      beforeEach('insert bookmarks', () => {
        return db
        .into('bookmarks')
          .insert(testBookmarks)
      })

      it(`GET /bookmarks responds with 200 and all of the bookmarks in the bookmarks db`, () => {
        return supertest(app)
          .get('/bookmarks')
          .expect(200, testBookmarks)
      })

      
      })
    })
  })
  
  describe(`GET /bookmarks/:bookmark_id`, () => {
    context(`Given no bookmarks`, () => {
      it(`responds with 404`, () => {
        const bookmarkId = 12345
        return supertest(app)
          .get(`bookmarks/${bookmarkId}`)
          .expect(404, { error: { message: `Article doesn't exist` } })
      })
    })

    context(`Given bookmarks are in the database`, () => {
      const testBookmarks = makeBookmarksArray()

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })

      it(`Get /bookmarks/:bookmark_id responds with 200 and the specified bookmark`, () => {
        const bookmarkId = 2
        const expectedBookmark = testBookmarks[bookmarkId - 1]
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .expect(200, expectedBookmark)
      })
    })
  })
})