var mongoose =  require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

// var nt = new Todo({
//     text: 'Make a hot drink'
// });

// nt.save().then((doc)=> {
//     console.log('Saved Todo', doc);
// }, (err)=> {
//     console.log('Unable to Save Todo ', err);
// });

var nt1 = new Todo({
    text: 'Get ready for bed',
    completed: true,
});

nt1.save().then((doc)=> {
    console.log('Saved Todo', doc);
}, (err)=> {
    console.log('Unable to Save Todo ', err);
});