/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

const Posts = require('../models/posts');
const Threads = require('../models/threads');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      
      test('POST Every field filled in', async function() {
        const requester = chai.request(server).keepOpen();
        
        const res = await requester.post('/api/threads/test').send({
          text: 'POST Every field filled in',
          delete_password: 'POST Every field filled in',
        });
        
        assert.equal(res.status, 200);
        
        const doc = await Threads.findOne({
          board: 'test',
          text: 'POST Every field filled in',
          delete_password: 'POST Every field filled in',
        })
        
        assert.isNotNull(doc);
        assert.isArray(doc.replies);
        assert.equal(doc.replies.length, 0);
        assert.equal(doc.created_on.getTime(), doc.bumped_on.getTime());
        requester.close();
      });
           
    });
    
    suite('GET', function() {
      
      test('GET', async function() {
        const requester = chai.request(server).keepOpen();
        
        const res = await requester.get('/api/threads/test');
        
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.isAtMost(res.body.length, 10);
        res.body.forEach(doc => {
          assert.isAtMost(doc.replies.length, 3);
        });
        
        requester.close();
      })
      
    });
    
    suite('DELETE', function() {
      
      test('DELETE with wrong password', async function() {
        const requester = chai.request(server).keepOpen();
        
        const date = Date.now();
        const doc = new Threads({
          board: 'test',
          text: 'DELETE with wrong password',
          created_on: date,
          bumped_on: date,
          delete_password: 'DELETE with wrong password',
          replies: [],
        });
        await doc.save();
        
        const res = await requester.delete('/api/threads/test').send({
          delete_password: 'wrong',
          thread_id: doc._id.toString()
        });
        
        assert.equal(res.status, 401);
        assert.equal(res.text, 'incorrect password');
        
        requester.close();
      })
      
      test('DELETE with correct password', async function() {
        const requester = chai.request(server).keepOpen();
        
        const date = Date.now();
        const doc = new Threads({
          board: 'test',
          text: 'DELETE with correct password',
          created_on: date,
          bumped_on: date,
          delete_password: 'DELETE with correct password',
          replies: [],
        });
        await doc.save();
        
        const res = await requester.delete('/api/threads/test').send({
          delete_password: 'DELETE with correct password',
          thread_id: doc._id.toString()
        });
        
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        
        requester.close();
      })
      
    });
    
    suite('PUT', function() {
      test('PUT', async function() {
        const requester = chai.request(server).keepOpen();
        
        const date = Date.now();
        const doc = new Threads({
          board: 'test',
          text: 'PUT',
          created_on: date,
          bumped_on: date,
          delete_password: 'PUT',
          replies: [],
        });
        await doc.save();
        
        const res = await requester.put('/api/threads/test').send({
          thread_id: doc._id.toString()
        });
        
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        
        requester.close();
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('POST reply', async function() {
        const requester = chai.request(server).keepOpen();
        
        const now = Date.now();
        const date = now - 1000*3600*24*3; // created three days ago
        const thread = new Threads({
          board: 'test',
          text: 'POST reply',
          created_on: date,
          bumped_on: date,
          delete_password: 'POST reply',
          replies: [],
        });
        await thread.save();
        
        const threadId = thread._id.toString();
        
        const res = await requester.post('/api/replies/test').send({
          text: 'POST reply',
          delete_password: 'POST reply',
          thread_id: threadId,
        });
        
        assert.equal(res.status, 200);
        
        const doc = await Threads.findOne({
          _id: threadId
        }).populate('replies');
        
        console.log(doc.replies[0])
        
        assert.isNotNull(doc);
        
        assert.isArray(doc.replies);
        assert.equal(doc.replies.length, 1);
        assert.equal(doc.replies[0].text, 'POST reply');
        assert.closeTo(now, doc.replies[0].created_on.getTime(), 1000*60*3);
        
        assert.equal(doc.text, 'POST reply');
        assert.closeTo(now, doc.bumped_on.getTime(), 1000*60*3); // 3 minute
        assert.equal(doc.created_on.getTime(), date);
        
        requester.close();
      })
    });
    
    suite('GET', function() {
      test('GET reply', async function() {
        const requester = chai.request(server).keepOpen();
        
        const date = Date.now();
        const thread = new Threads({
          board: 'test',
          text: 'GET reply',
          created_on: date,
          bumped_on: date,
          delete_password: 'GET reply',
          replies: [],
        });
        await thread.save();
        
        const res = await requester.get('/api/replies/test').query({ thread_id: thread._id.toString() });
        
        assert.equal(res.status, 200);
        assert.equal(res.body.text, 'GET reply');
        assert.equal(new Date(res.body.created_on).getTime(), date);
        assert.equal(new Date(res.body.bumped_on).getTime(), date);
        assert.isArray(res.body.replies);
        assert.equal(res.body.replies.length, 0);
        
        requester.close();
      })
    });
    
    suite('PUT', function() {
      test('PUT reply', async function() {
        const requester = chai.request(server).keepOpen();
        
        const date = Date.now();
        const post = new Posts({
          text: 'PUT reply',
          created_on: date,
          delete_password: 'PUT reply',
        })
        await post.save();
        
        const thread = new Threads({
          board: 'test',
          text: 'PUT reply',
          delete_password: 'PUT reply',
          created_on: date,
          bumped_on: date,
          replies: [ post._id ]
        })
        await thread.save();
        
        const res = await requester.put('/api/replies/test').send({
          thread_id: thread._id.toString(),
          reply_id: post._id.toString(),
        });
        
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        
        requester.close();
      })
    });
    
    suite('DELETE', function() {
      test('DELETE reply', async function() {
        const requester = chai.request(server).keepOpen();
        
        const date = Date.now();
        const post = new Posts({
          text: 'DELETE reply',
          created_on: date,
          delete_password: 'DELETE reply',
        })
        await post.save();
        
        const thread = new Threads({
          board: 'test',
          text: 'DELETE reply',
          delete_password: 'DELETE reply',
          created_on: date,
          bumped_on: date,
          replies: [ post._id ]
        })
        await thread.save();
        
        let res = await requester.delete('/api/replies/test').send({
          thread_id: thread._id.toString(),
          reply_id: post._id.toString(),
          delete_password: 'wrong'
        });
        
        assert.equal(res.status, 401);
        assert.equal(res.text, 'incorrect password');
        
        res = await requester.delete('/api/replies/test').send({
          thread_id: thread._id.toString(),
          reply_id: post._id.toString(),
          delete_password: 'DELETE reply'
        });
        
        assert.equal(res.status, 200);
        assert.equal(res.text, 'success');
        
        requester.close();
      })
    });
    
  });

});
