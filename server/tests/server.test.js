const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/Todo');

const todos = [
{
    text: 'First test Todo'
}, {
    text: 'Second test Todo'
}];


beforeEach(() => {
    Todo.remove({}).then(()=> {
        return Todo.insertMany(todos);
    }).then(() => done());
})

describe('POST todos', () => {
    // 1st test case
    it('Should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1); 
                expect(todos[0].text).toBe(text); 
                done();                                        
            }).catch((err) => done(err));
        });
    });

    // 2nd test case
    it('Should not create a todo with invalise todo data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2); 
                done();                                        
            }).catch((err) => done(err));
        });
    });

});

describe('GET todos', () => {

    it('Should get all Todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });

});    