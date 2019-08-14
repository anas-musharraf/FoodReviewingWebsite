const mongoose = require('mongoose');
const local = 'mongodb://localhost:27017/yummky_test';
const remote = 'mongodb://team11:csc309piggies@ds115244.mlab.com:15244/yummky';

mongoose.connect(remote, { useNewUrlParser: true});

module.exports = { mongoose };
