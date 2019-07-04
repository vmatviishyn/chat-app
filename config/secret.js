if (process.env.NODE_ENV === 'production' ) {
  module.exports = {
    url: process.env.MONGODB_URI,
    secret: process.env.secret
  };
} else {
  module.exports = {
    url: 'mongodb://localhost:27017/chatapp',
    secret: 'myjsonsecret',
  };
}