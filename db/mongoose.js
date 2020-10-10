//connection logic to the mongodb database

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/jobs', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('connected Local mongodb succesfully');
}).catch((e) => {
    console.log('error while connecting to database');
    console.log(e);
});

//to prevent deprication warning

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('bufferCommands', false);

module.exports = mongoose;
