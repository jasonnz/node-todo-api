const express = require('express');
const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST todos', () => {
    // 1st test case
    it('Should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });

});    

describe('GET todos/:id', () => {
    it('Should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('Should not return todo doc created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

   it('Should return 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectId().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

     it('Should return 404 for non object ids', (done) => {
        request(app)
            .get(`/todos/123455678`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

}); 

describe('DELETE todos/:id', () => {
    it('Should remove an ID', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) return done(err);

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));

            });

    });

    it('Should not remove an ID', (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toExist();
                    done();
                }).catch((e) => done(e));

            });
    });

    it('Should return 404 if todo not found', (done) => {
        var hexId = new ObjectId().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it ('Should return 404 if obejct ID is invalid', (done) => {
        request(app)
            .delete(`/todos/123455678`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

});

describe('PATCH /todos:id', ()=> {
    it('Should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'This is some Patched text!';
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                text: text,
                completed: true
            })
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBeA('boolean');
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .expect(200)
            .end(done);
    });

    it('Should not update the todo', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'This is some Patched text!';
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                text: text,
                completed: true
            })
            .expect(404)
            // .expect((res) => {
            //     expect(res.body.todo.text).toBe(text);
            //     expect(res.body.todo.completed).toBeA('boolean');
            //     expect(res.body.todo.completed).toBe(true);
            //     expect(res.body.todo.completedAt).toBeA('number');
            // })
            .end(done);
    });

    it('Should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'This is some more Patched text!';
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                text: text,
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBeA('boolean');
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });
});


describe('PATCH /users/me', ()=> {
    it('Should return user if autheticated', (done)=> {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=> {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('Should return a 401 if not autheticated', (done)=> {
        request(app)
            .get('/users/me')
            //.set('x-auth', users[0].tokens[0].token)
            .expect(401)
            .expect((res)=> {
                expect(res.body).toEqual({"error": "Cannot verify!"});
            })
            .end(done);
    });
});

describe('POST /users', ()=> {

        it('Should create a user', (done)=> {
            var email = 'example@example.com'
            var password = '123mnb!';

            request(app)
                .post('/users')
                .send({email, password})
                .expect(200)
                .expect((res)=> {
                     expect(res.headers['x-auth']).toExist();
                     expect(res.body._id).toExist();
                     expect(res.body.email).toBe(email);
                })
                .end((err)=> {
                    if (err) {
                        return done(err);
                    }

                    User.findOne({email}).then((user)=> {
                         expect(user).toExist();
                         expect(user.password).toNotBe(password);
                         done();
                    }).catch((err)=> done(err));
                });
        });

        it('Should return validation errors if request invalid', (done)=> {
            var badEmail = 'wrong.com';
            var badPassword = '123';

            request(app)
                .post('/users')
                .send({badEmail, badPassword})
                .expect(400)
                .end(done);

        });

        it('Should not create user if email in use', (done)=> {
            request(app)
                .post('/users')
                .send({email: users[0].email, password: 'Password123'})
                .expect(400)
                .end(done);
        });
});

describe('POST /users/login', ()=> {
    it('Should login user and return auth token', (done)=> {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email, 
                password: users[1].password
            })
            .expect(200)
            .expect((res)=> {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res)=> {
                if (err) return done(err);
                User.findById(users[1]._id).then((user)=> {
                   expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                   });
                   done();
                }).catch((err)=> done(err));
            });
    });

    it('Should reject invalid login', (done)=> {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email, 
                password: users[1].password + 'Invalid'
            })
            .expect(400)
            .expect((res)=> {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res)=> {
                if (err) return done(err);
                User.findById(users[1]._id).then((user)=> {
                   expect(user.tokens[0]).toNotEqual(null);
                   expect(user.tokens.length).toBe(1);
                   done();
                }).catch((err)=> done(err));
            });
    });
});   

describe('POST /users/me/token', ()=> {
     
     it('Should rremove auth token on logout', (done)=> {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res)=> {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res)=> {
                if (err) return done(err);
                User.findById(users[0]._id).then((user)=> {
                   expect(user.tokens[0]).toEqual(null);
                   expect(user.tokens.length).toBe(0);
                   done();
                }).catch((err)=> done(err));
            });
     });

});