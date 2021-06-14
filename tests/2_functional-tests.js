const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    test('Create an issue with every field: POST request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .post('/api/issues/testing')
            .type('form')
            .send({
                'issue_title': 'issue',
                'issue_text': 'text',
                'created_by': 'create',
                'assigned_to': 'assign',
                'status_text': 'status'
            })
            .end(function (err, res) {
                assert.equal(res.body.issue_title, 'issue');
                assert.equal(res.body.issue_text, 'text');
                assert.equal(res.body.created_by, 'create');
                assert.equal(res.body.assigned_to, 'assign');
                assert.equal(res.body.status_text, 'status');
                done();
            });
    });
    test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .post('/api/issues/testing')
            .type('form')
            .send({
                'issue_title': 'issue',
                'issue_text': 'text',
                'created_by': 'create'
            })
            .end(function (err, res) {
                assert.equal(res.body.issue_title, 'issue');
                assert.equal(res.body.issue_text, 'text');
                assert.equal(res.body.created_by, 'create');
                done();
            });
    });
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .post('/api/issues/testing')
            .type('form')
            .send({
                'issue_title': 'issue',
                'issue_text': 'text',
            })
            .end(function (err, res) {
                assert.equal(res.body.error, 'required field(s) missing');
                done();
            });
    });
    test('View issues on a project: GET request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .get('/api/issues/testing')
            .end(function (err, res) {
                assert.equal(res.body[0].issue_title, 'issue');
                assert.equal(res.body[0].issue_text, 'text');
                assert.equal(res.body[0].created_by, 'create');
                assert.equal(res.body[0].assigned_to, 'assign');
                assert.equal(res.body[0].status_text, 'status');
                done();
            });
    });
    
    test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .get('/api/issues/testing?issue_title=issue')
            .end(function (err, res) {
                for(i = 0; i < res.body.length; i++){
                    assert.equal(res.body[i].issue_title, 'issue');
                }
                done();
            });
    });
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .get('/api/issues/testing?issue_title=issue&assigned_to=assign')
            .end(function (err, res) {
                for(i = 0; i < res.body.length; i++){
                    assert.equal(res.body[i].issue_title, 'issue');
                    assert.equal(res.body[i].assigned_to, 'assign');
                }
                done();
            });
    });
    test('Update one field on an issue: PUT request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .put('/api/issues/testing')
            .type('form')
            .send({
                _id: '60c7c07df137ca3a8411033f',
                status_text: 'updated status'
            })
            .end(function (err, res) {
                assert.equal(res.body.result, 'successfully updated' );
                assert.equal(res.body._id, '60c7c07df137ca3a8411033f');
                done();
            });
    });
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .put('/api/issues/testing')
            .type('form')
            .send({
                _id: '60c7c07df137ca3a8411033f',
                status_text: 'updated status',
                assigned_to: 'updated'
            })
            .end(function (err, res) {
                assert.equal(res.body.result, 'successfully updated' );
                assert.equal(res.body._id, '60c7c07df137ca3a8411033f');
                done();
            });
    });
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .put('/api/issues/testing')
            .type('form')
            .send({
                status_text: 'updated status',
                assigned_to: 'updated'
            })
            .end(function (err, res) {
                assert.equal(res.body.error, 'missing _id');
                done();
            });
    });
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .put('/api/issues/testing')
            .type('form')
            .send({
                _id: '60c4045384898226dc456f49'
            })
            .end(function (err, res) {
                assert.equal(res.body.error, 'no update field(s) sent');
                assert.equal(res.body._id, '60c4045384898226dc456f49');
                done();
            });
    });
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .put('/api/issues/testing')
            .type('form')
            .send({
                _id: '5f665eb46e296f6b9b6a504d',
                assigned_to: 'updated'
            })
            .end(function (err, res) {
                assert.equal(res.body.error, 'could not update');
                assert.equal(res.body._id, '5f665eb46e296f6b9b6a504d');
                done();
            });
    });
    
    test('Delete an issue: DELETE request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .delete('/api/issues/testing')
            .type('form')
            .send({
                _id: '60c3fb0fd66bc30cb01cddc2'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                done();
            });
    });
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .delete('/api/issues/testing')
            .type('form')
            .send({
                _id: '5f665eb46e296f6b9b6a504d'
            })
            .end(function (err, res) {
                assert.equal(res.body.error, 'could not delete');
                assert.equal(res.body._id, '5f665eb46e296f6b9b6a504d');
                done();
            });
    });
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done){
        chai
            .request(server)
            .delete('/api/issues/testing')
            .type('form')
            .send({
                missing_id: '5f665eb46e296f6b9b6a504d'
            })
            .end(function (err, res) {
                assert.equal(res.body.error, 'missing _id');
                done();
            });
    }); 
});
