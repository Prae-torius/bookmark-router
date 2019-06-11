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

  describe(`POST/bookmarks/`, function() {
    it(`creates a bookmark, responding with 201 and the new bookmark`, () => {
      const newBookmark = {
        title: 'Test new bookmark',
        url: 'www.test.com',
        description: 'test description',
        rating: 5
      }

      return supertest(app)
        .post('/bookmarks')
        .send(newBookmark)
        .expect(201)
        .expect(res => {
          expect(res.body.title).to.eql(newBookmark.title)
          expect(res.body.url).to.eql(newBookmark.url)
          expect(res.body.description).to.eql(newBookmark.description)
          expect(res.body.url).to.eql(newBookmark.url)
        })
        .then(res => 
          supertest(app)
            .get(`/bookmarks/${res.body.id}`)
            .expect(res.body)
        )
    })
  })

  describe.only(`DELETE /bookmarks/:bookmarks_id`, () => {
    context(`given there are bookmarks in the database`, () => {
      const testBookmarks = makeBookmarksArray()

      beforeEach('instert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })

      it(`deletes a bookmark with the coresponding id and responds with 204`, () => {
        const idToRemove = 2
        const expectedBookmarks = testBookmarks.filter(bookmarks => bookmarks.id !== idToRemove)
        return supertest(app)
          .delete(`/bookmarks/${idToRemove}`)
          .expect(204)
          .then(res => {
            supertest(app)
            .get(`/bookmarks/`)
            .expect(expectedBookmarks)
          })
      })
    })
  })
})