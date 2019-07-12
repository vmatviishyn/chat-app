if (process.env.NODE_ENV === 'production' ) {
  module.exports = {
    url: process.env.MONGODB_URI,
    secret: process.env.secret
  };
} else {
  module.exports = {
    url: 'mongodb://heroku_rx70cqhm:q1fbklf710kerdj3mcj0mdcilt@ds347367.mlab.com:47367/heroku_rx70cqhm',
    secret: 'myjsonsecret',
  };
}