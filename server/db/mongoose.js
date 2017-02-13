var mongoose =  require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI ||  'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};

//npm uninstall mongoose@4.8.1 --save 
//npm install mongoose@4.8.1 --save 
//npm install mongoose@4.7.2 --save 
//npm uninstall mongoose@4.7.2 --save 