var env = process.env.NODE_ENV || 'development';

if (env == 'development' || env == 'test') {

    var config = require('./config.json');
    var envConfig = config[env];
    
    //iterates over the keys in the object
    Object.keys(envConfig).forEach((key)=> {
        process.env[key] = envConfig[key];
    });
}